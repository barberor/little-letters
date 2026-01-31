"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Role = "parent" | "teacher" | "student" | "mentor";

const roleLabels: Record<Role, string> = {
  parent: "Parent / Guardian",
  teacher: "Teacher",
  student: "Student",
  mentor: "MSU Student Mentor",
};

export default function SignUpPage() {
  const [role, setRole] = useState<Role | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Optional role-specific fields
  const [childAge, setChildAge] = useState(""); // parent
  const [schoolName, setSchoolName] = useState(""); // teacher / student
  const [universityEmail, setUniversityEmail] = useState(""); // mentor

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

    // Optional mentor validation (you can tighten this later)
    if (role === "mentor" && !universityEmail) {
      setError("Please provide your university email.");
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

    // NOTE:
    // Role + profile data should be saved later (server action)
    // after email confirmation.

    setSignedUpEmail(data.user?.email ?? email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center">
          Create your account
        </h1>

        {/* ROLE SELECTION */}
        {!role && (
          <div className="space-y-3">
            <p className="text-center text-gray-600">
              I am signing up as a:
            </p>

            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(roleLabels) as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className="border rounded-md py-2 hover:bg-gray-50"
                >
                  {roleLabels[r]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SIGNUP FORM */}
        {role && !signedUpEmail && (
          <>
            <p className="text-sm text-center text-gray-500">
              Signing up as <span className="capitalize">{roleLabels[role]}</span>
            </p>

            <div className="space-y-3">
              <input
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />

              {/* ROLE-SPECIFIC FIELDS */}
              {role === "parent" && (
                <input
                  placeholder="Child’s age"
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              )}

              {(role === "teacher" || role === "student") && (
                <input
                  placeholder="School name"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              )}

              {role === "mentor" && (
                <input
                  placeholder="University email (e.g. @msu.edu)"
                  value={universityEmail}
                  onChange={(e) => setUniversityEmail(e.target.value)}
                  className="w-full border rounded-md px-3 py-2"
                />
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full bg-black text-white rounded-md py-2 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>

            <button
              onClick={() => setRole(null)}
              className="w-full text-sm underline text-gray-500"
            >
              Change role
            </button>
          </>
        )}

        {/* SUCCESS */}
        {signedUpEmail && (
          <div className="text-center space-y-2">
            <p className="text-green-600 text-lg font-medium">
              Welcome!
            </p>
            <p>{signedUpEmail}</p>
            <p className="text-sm text-gray-500">
              Check your email to confirm your account.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
