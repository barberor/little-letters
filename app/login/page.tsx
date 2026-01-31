"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    const role = data.user?.user_metadata?.role;

    if (role === "mentor" || role === "student") {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "radial-gradient(circle at top, #fafaf7, #f5f5f0)",
      }}
    >
      <div className="w-full max-w-md bg-white/70 rounded-3xl p-8 shadow-sm space-y-6">

        <h1
          className="text-3xl font-semibold text-center"
          style={{ color: "#8B6F5B" }}
        >
          Welcome back
        </h1>

        <p className="text-sm text-center text-[#6f5a4d]">
          We’re glad you’re here.
        </p>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[#d6cfc8] px-4 py-2 bg-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-[#d6cfc8] px-4 py-2 bg-white"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 text-center">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-2xl py-3 text-lg font-medium bg-[#9CAF88] text-white transition-all hover:scale-105 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-sm text-center text-[#6f5a4d]">
          Don’t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
