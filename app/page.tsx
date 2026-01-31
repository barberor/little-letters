'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f5f0' }}>
      <div className="text-center max-w-2xl px-6">
        {/* Title */}
        <h1 className="text-7xl font-bold mb-12" style={{ 
          color: '#8B6F5B',
          fontFamily: 'Comic Sans MS, cursive',
          textShadow: '3px 3px 6px rgba(0,0,0,0.1)'
        }}>
          Little Letters
        </h1>

        {/* Buttons Row */}
        <div className="flex gap-8 justify-center items-center mb-12">
          {/* Sign In Button */}
          <Link href="/login">
            <button style={{
              backgroundColor: '#9CAF88',
              color: 'white',
              padding: '1rem 3rem',
              borderRadius: '20px',
              fontSize: '1.5rem',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Comic Sans MS, cursive',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Sign in
            </button>
          </Link>

          {/* Sign Up Button */}
          <Link href="/signup">
            <button style={{
              backgroundColor: '#9CAF88',
              color: 'white',
              padding: '1rem 3rem',
              borderRadius: '20px',
              fontSize: '1.5rem',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Comic Sans MS, cursive',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Sign up
            </button>
          </Link>
        </div>

        {/* Character Image */}
        <div className="relative w-full max-w-xl mx-auto mb-8">
          <img 
            src="home.png" 
            alt="Little Letters Character"
            style={{
              width: '100%',
              height: 'auto',
              maxWidth: '500px',
              margin: '0 auto',
              display: 'block'
            }}
          />
        </div>

      </div>
    </main>
  );
}