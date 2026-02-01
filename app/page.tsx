'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f5f0]">
      <div className="text-center max-w-xl px-6 space-y-10">

        {/* Title */}
        <h1
          className="text-6xl md:text-7xl font-semibold tracking-tight"
          style={{
            color: '#8B6F5B',
            fontFamily: 'ui-rounded, system-ui, -apple-system',
          }}
        >
          <img src="/home-logo.png" alt="seed" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-[#6f5a4d] max-w-md mx-auto">
          A safe, thoughtful way to connect students, mentors, and families
          through letters.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-6">
          <Link href="/login">
            <button className="px-8 py-3 rounded-2xl text-lg font-medium bg-[#9CAF88] text-white shadow-sm transition-all hover:scale-105 hover:shadow-md">
              Sign in
            </button>
          </Link>

          <Link href="/signup">
            <button className="px-8 py-3 rounded-2xl text-lg font-medium bg-white text-[#8B6F5B] border border-[#d6cfc8] shadow-sm transition-all hover:scale-105 hover:shadow-md">
              Sign up
            </button>
          </Link>
        </div>

        {/* Character Image */}
        <div className="flex justify-center pt-6">
          <img
            src="/home.png"
            alt="Little Letters character"
            className="w-64 md:w-72 drop-shadow-md"
          />
        </div>

      </div>
    </main>
  )
}
