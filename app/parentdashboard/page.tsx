"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ParentDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChild = async () => {
      setLoading(true);
      setError(null);

      // Fetch child via SECURITY DEFINER RPC
      const { data, error } = await supabase
        .rpc("get_child_for_parent")
        .maybeSingle();

      if (error) {
        console.error("RPC error:", error);
        setError("Failed to load child account.");
        setLoading(false);
        return;
      }

      setChild(data ?? null);
      setLoading(false);
    };

    loadChild();
  }, []);

  const approveChild = async () => {
    if (!child) return;

    const { error } = await supabase.rpc("approve_child_for_parent");

    if (error) {
      console.error("Approve error:", error);
      setError("Failed to approve child.");
      return;
    }

    // Optimistic UI update
    setChild({ ...child, approved: true });
  };

  if (loading) {
    return <p className="p-8">Loading parent dashboard…</p>;
  }

  if (error) {
    return <p className="p-8 text-red-600">{error}</p>;
  }

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-semibold">Parent Dashboard</h1>

      {/* CHILD NOT FOUND */}
      {!child && (
        <p className="text-gray-600">
          We couldn’t find a child account linked to your email yet.
        </p>
      )}

      {/* CHILD FOUND */}
      {child && (
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">
            Child: {child.full_name}
          </h2>

          {child.grade && (
            <p className="text-gray-600">Grade: {child.grade}</p>
          )}

          {/* NOT APPROVED */}
          {!child.approved && (
            <>
              <p className="text-gray-700">
                Your child has signed up for the program. Please review and
                approve their participation.
              </p>

              <button
                onClick={approveChild}
                className="px-4 py-2 rounded-lg bg-[#9CAF88] text-white"
              >
                Approve Participation
              </button>
            </>
          )}

          {/* APPROVED BUT NOT MATCHED */}
          {child.approved && !child.matched && (
            <>
              <p className="text-gray-700">
                Your child has been approved and is waiting to be matched with a
                mentor.
              </p>

              <p className="text-sm text-gray-500">
                We’ll notify you once a match is made.
              </p>
            </>
          )}

          {/* APPROVED + MATCHED */}
          {child.approved && child.matched && (
            <>
              <h3 className="text-lg font-semibold mt-4">
                Mentor Information
              </h3>

              {/* Demo mentor (replace later) */}
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="font-medium">Dr. Sarah Johnson</p>
                <p className="text-sm text-gray-600">
                  Marine Biology · Conservation
                </p>
              </div>

              <h3 className="text-lg font-semibold mt-4">
                Letters
              </h3>

              <ul className="list-disc pl-5 text-gray-700">
                <li>Welcome to the program!</li>
                <li>Great progress this week</li>
                <li>Weekly summary</li>
              </ul>
            </>
          )}
        </div>
      )}
    </main>
  );
}
