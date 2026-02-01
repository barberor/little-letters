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
  const [childEmail, setChildEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [grade, setGrade] = useState("");
  const [interests, setInterests] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setError(null);

    // ---- VALIDATION ----
    if (!role) return setError("Please select a role.");
    if (!email || !password) return setError("Missing required fields.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");

    if (role === "parent" && !childEmail) {
      return setError("Please enter your child’s email.");
    }

    if (role === "student" && !grade) {
      return setError("Please enter your grade.");
    }

    setLoading(true);

    // ---- AUTH SIGNUP ----
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          fullName,
        },
      },
    });

    if (authError || !data.user) {
      setLoading(false);
      return setError(authError?.message ?? "Signup failed.");
    }

    const userId = data.user.id;

    // ---- PROFILE INSERT (EXPLICIT, DETERMINISTIC) ----
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,

        // always store email explicitly
        email: email,

        role: role,
        full_name: fullName,

        // relationships
        parent_id: null, // NEVER self-reference
        child_email: role === "parent" ? childEmail : null,

        // student-specific
        grade: role === "student" ? grade : null,
        interests: interests || null,

        // control flags
        approved: role === "student" ? false : null,
        matched: role === "student" || role === "mentor" ? false : null,
      });

    if (profileError) {
      console.error("PROFILE INSERT ERROR:", profileError);
      setLoading(false);
      setError("Account created, but profile failed to save.");
      return;
    }

    setLoading(false);

    // ---- ROUTING ----
    if (role === "parent") {
      router.push("/parentdashboard");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/70 rounded-3xl p-8 space-y-3">
        <h1 className="text-3xl font-semibold text-center">
          Create your account
        </h1>

        {!role && (
          <div className="space-y-2">
            {(Object.keys(roleLabels) as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="w-full rounded-xl border py-2"
              >
                {roleLabels[r]}
              </button>
            ))}
          </div>
        )}

        {role && (
          <>
            <input
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border px-4 py-2"
            />

            {role === "parent" && (
              <input
                type="email"
                placeholder="Child’s email"
                value={childEmail}
                onChange={(e) => setChildEmail(e.target.value)}
                className="w-full rounded-xl border px-4 py-2"
              />
            )}

            {role === "student" && (
              <input
                placeholder="Grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full rounded-xl border px-4 py-2"
              />
            )}

            {(role === "student" || role === "mentor") && (
              <input
                placeholder="Interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full rounded-xl border px-4 py-2"
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border px-4 py-2"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-4 py-2"
            />

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border px-4 py-2"
            />

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full rounded-2xl py-3 bg-[#9CAF88] text-white"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>

            <button
              onClick={() => setRole(null)}
              className="text-sm underline w-full"
            >
              Change role
            </button>
          </>
        )}

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
