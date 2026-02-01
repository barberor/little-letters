"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ParentDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChild = async () => {
      setLoading(true);
      setError(null);

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

    setChild({ ...child, approved: true });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
        <p className="text-[#6f5a4d]">Loading parent dashboard…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f5f0] px-4 py-12 flex justify-center">
      <div className="w-full max-w-3xl space-y-10">
        {/* Header */}
        <h1 className="text-4xl font-semibold text-center text-[#8B6F5B]">
          Parent Dashboard
        </h1>

        {/* No child */}
        {!child && (
          <div className="bg-white/70 rounded-3xl p-8 shadow-sm text-center">
            <p className="text-[#6f5a4d]">
              We couldn’t find a child account linked to your email yet.
            </p>
          </div>
        )}

        {/* Child card */}
        {child && (
          <div className="bg-white/70 rounded-3xl p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#8B6F5B]">
                {child.full_name}
              </h2>
              {child.grade && (
                <p className="text-[#6f5a4d] mt-1">
                  Grade: {child.grade}
                </p>
              )}
            </div>

            {/* NOT APPROVED */}
            {!child.approved && (
              <div className="space-y-4 text-[#6f5a4d]">
                <p>
                  <strong>Little Letters</strong> is a supervised mentorship
                  program that connects students with trained Michigan State
                  University mentors through thoughtful, written correspondence.
                </p>

                <p>
                  Before your child begins exchanging letters, we ask a parent or
                  guardian to review and approve their participation.
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    All mentors are Michigan State University students and are
                    vetted by the program
                  </li>
                  <li>
                    Messages are exchanged in a moderated, child-safe environment
                  </li>
                  <li>
                    <strong>
                      You will be able to view all communication between your
                      child and their mentor at any time
                    </strong>
                  </li>
                </ul>

                <p className="text-sm">
                  Once approved, your child will be matched with a mentor based
                  on their interests and grade level.
                </p>

                <div className="flex justify-center pt-4">
                  <button
                    onClick={approveChild}
                    className="px-6 py-3 rounded-2xl bg-[#9CAF88] text-white text-lg font-medium transition-all hover:scale-105"
                  >
                    Approve Participation
                  </button>
                </div>
              </div>
            )}

            {/* APPROVED BUT NOT MATCHED */}
            {child.approved && !child.matched && (
              <div className="space-y-2 text-[#6f5a4d]">
                <p>
                  Your child has been approved and is waiting to be matched with
                  a mentor.
                </p>
                <p className="text-sm">
                  We’ll notify you once a match is made.
                </p>
              </div>
            )}

            {/* APPROVED + MATCHED */}
            {child.approved && child.matched && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#8B6F5B] mb-2">
                    Mentor
                  </h3>
                  <div className="bg-[#fafaf7] border border-[#d6cfc8] rounded-2xl p-4">
                    <p className="font-medium text-[#8B6F5B]">
                      Dr. Sarah Johnson
                    </p>
                    <p className="text-sm text-[#6f5a4d]">
                      Marine Biology · Conservation
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#8B6F5B] mb-2">
                    Letters
                  </h3>
                  <ul className="list-disc pl-6 text-[#6f5a4d] space-y-1">
                    <li>Welcome to the program!</li>
                    <li>Great progress this week</li>
                    <li>Weekly summary</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LOG OUT BUTTON */}
        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-2xl border border-[#d6cfc8] bg-white text-[#8B6F5B] text-lg font-medium shadow-sm transition-all hover:scale-105 hover:shadow-md"
          >
            Log out
          </button>
        </div>
      </div>
    </main>
  );
}
