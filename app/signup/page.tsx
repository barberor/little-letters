"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Role = "parent" | "teacher" | "student" | "mentor";

const roleLabels: Record<Role, string> = {
  parent: "Parent / Guardian",
  teacher: "Teacher",
  student: "Student",
  mentor: "MSU Student Mentor",
};

export default function SignUpPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // NEW FIELDS
  const [grade, setGrade] = useState("");           // student
  const [interests, setInterests] = useState("");   // student + mentor

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signedUpEmail, setSignedUpEmail] = useState<string | null>(null);

  const handleSignUp = async () => {
    setError(null);

    if (!role) {
      setError("Please select a role.");
      return;
    }

    if (!email || !password) {
      setError("Please fill out all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Basic validation
    if (role === "student" && !grade) {
      setError("Please select a grade.");
      return;
    }

    if ((role === "student" || role === "mentor") && !interests) {
      setError("Please add at least one interest.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // 🚀 Student & Mentor go straight to dashboard
    if (role === "student" || role === "mentor") {
      router.push("/dashboard");
      return;
    }

    setSignedUpEmail(data.user?.email ?? email);
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "radial-gradient(circle at top, #fafaf7, #f5f5f0)",
      }}
    >
      <div className="w-full max-w-md bg-white/70 rounded-3xl p-8 shadow-sm space-y-6">

        <h1 className="text-3xl font-semibold text-center text-[#8B6F5B]">
          Create your account
        </h1>

        {/* Escape hatch */}
        {!signedUpEmail && (
          <p className="text-sm text-center text-[#6f5a4d]">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </p>
        )}

        {/* ROLE SELECTION */}
        {!role && (
          <>
            <p className="text-center text-[#6f5a4d]">
              I’m signing up as a:
            </p>

            <div className="space-y-2">
              {(Object.keys(roleLabels) as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className="w-full rounded-xl border border-[#d6cfc8] py-2 hover:bg-[#fafaf7]"
                >
                  {roleLabels[r]}
                </button>
              ))}
            </div>
          </>
        )}

        {/* FORM */}
        {role && !signedUpEmail && (
          <>
            <p className="text-sm text-center text-[#6f5a4d]">
              Signing up as {roleLabels[role]}
            </p>

            <div className="space-y-3">
              <input
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-[#d6cfc8] px-4 py-2"
              />

              {/* STUDENT ONLY */}
              {role === "student" && (
              <input
                type="text"
                placeholder="Grade (e.g. 2nd, Grade 4, K)"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded-xl border border-[#d6cfc8] px-4 py-2"
              />
            )}


              {/* STUDENT + MENTOR */}
              {(role === "student" || role === "mentor") && (
                <input
                  placeholder="Interests (e.g. art, animals, soccer)"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="w-full rounded-xl border border-[#d6cfc8] px-4 py-2"
                />
              )}

              <input
            type="email"
            placeholder={
              role === "student"
                ? "School Email"
                : role === "mentor"
                ? "MSU Email"
                : "Email"
            }
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[#d6cfc8] px-4 py-2"
          />


              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#d6cfc8] px-4 py-2"
              />

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-[#d6cfc8] px-4 py-2"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full rounded-2xl py-3 text-lg font-medium bg-[#9CAF88] text-white transition-all hover:scale-105 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>

            <button
              onClick={() => setRole(null)}
              className="text-sm underline text-[#6f5a4d] w-full"
            >
              Change role
            </button>
          </>
        )}

        {signedUpEmail && (
          <div className="text-center space-y-2">
            <p className="text-green-700 font-medium">Welcome!</p>
            <p className="text-sm">{signedUpEmail}</p>
            <p className="text-xs text-[#6f5a4d]">
              Check your email to confirm your account.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
