"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signedUpEmail, setSignedUpEmail] = useState<string | null>(null);

  const handleSignUp = async () => {
    setError(null);

    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Store the email for the welcome message
    setSignedUpEmail(data.user?.email ?? email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center">
          Create an account
        </h1>

        {signedUpEmail ? (
          <div className="text-center space-y-2">
            <p className="text-green-600 text-lg font-medium">
              Welcome!
            </p>
            <p className="text-gray-700">
              {signedUpEmail}
            </p>
            <p className="text-sm text-gray-500">
              Check your email to confirm your account.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
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

            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="underline">
                Log in
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
