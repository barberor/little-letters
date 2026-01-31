import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-20">
      {/* Hero */}
      <section className="max-w-5xl mx-auto text-center mb-28 bg-white rounded-3xl p-16 shadow-sm">
        <h1 className="text-5xl font-bold mb-6">
          Little Letters
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10">
          Connecting K–12 students with MSU mentors through letters,
          creativity, and encouragement.
        </p>
        
        {/* Login and Dashboard Buttons */}
        <div className="flex gap-4 justify-center">
          <Link href="/stu-login">
            <button className="px-8 py-3 rounded-full font-medium text-lg bg-[#4f8f63] text-white hover:bg-[#3f7350] transition shadow-md hover:shadow-lg">
              Login
            </button>
          </Link>
          
          {/* Temporary Dashboard Button */}
          <Link href="/dashboard">
            <button className="px-8 py-3 rounded-full font-medium text-lg bg-gray-600 text-white hover:bg-gray-700 transition shadow-md hover:shadow-lg">
              Dashboard (temp)
            </button>
          </Link>
        </div>
        
        {/* Decorative divider */}
        <div className="w-24 h-1 bg-[#4f8f63] mx-auto rounded-full mt-10" />
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-14">
          How It Works
        </h2>
        <div className="grid gap-8 md:grid-cols-4">
          <Step text="Sign up through your school" />
          <Step text="Parent or guardian approval" />
          <Step text="Get matched with a mentor" />
          <Step text="Write letters and build connection" />
        </div>
      </section>
    </main>
  );
}

/* ---------- Components ---------- */
function Step({ text }: { text: string }) {
  return (
    <div className="bg-[#f3f7f4] rounded-2xl shadow-sm p-6">
      <p className="text-gray-700">
        {text}
      </p>
    </div>
  );
}