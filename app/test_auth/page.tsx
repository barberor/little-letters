"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TestAuthPage() {
  const [email, setEmail] = useState("");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // get current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    await supabase.auth.signInWithOtp({
      email,
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Auth Test Page</h1>

      {session ? (
        <>
          <p>Logged in as: {session.user.email}</p>
          <button onClick={signOut}>Log out</button>
        </>
      ) : (
        <>
          <input
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={signIn}>Send magic link</button>
        </>
      )}
    </div>
  );
}
