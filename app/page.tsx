export default function Home() {
  return (
    <main className="min-h-screen px-6 py-20">
      {/* Hero */}
      <section className="max-w-5xl mx-auto text-center mb-28 bg-white rounded-3xl p-16 shadow-sm">
        <h1 className="text-5xl font-bold mb-6">
          Little Letters
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Connecting K–12 students with MSU mentors through letters,
          creativity, and encouragement.
        </p>

        {/* Decorative divider */}
        <div className="w-24 h-1 bg-[#4f8f63] mx-auto rounded-full mt-10" />
      </section>

      {/* Role Cards */}
      <section className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3 mb-32">
        <RoleCard
          title="Students"
          description="Write letters, draw pictures, and connect with a college mentor."
          button="Student Login"
        />

        {/* Slightly raised middle card */}
        <div className="relative md:-top-6">
          <RoleCard
            title="Parents"
            description="Approve participation and monitor your child’s experience."
            button="Parent Portal"
          />
        </div>

        <RoleCard
          title="Mentors"
          description="MSU students supporting younger learners through letters."
          button="Mentor Login"
        />
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

function RoleCard({
  title,
  description,
  button,
}: {
  title: string;
  description: string;
  button: string;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 text-center transition hover:shadow-xl">
      <h3 className="text-2xl font-semibold mb-4">
        {title}
      </h3>
      <p className="text-gray-600 mb-8">
        {description}
      </p>
      <button className="px-6 py-2 rounded-full font-medium bg-[#4f8f63] text-white hover:bg-[#3f7350] transition">
        {button}
      </button>
    </div>
  );
}

function Step({ text }: { text: string }) {
  return (
    <div className="bg-[#f3f7f4] rounded-2xl shadow-sm p-6">
      <p className="text-gray-700">
        {text}
      </p>
    </div>
  );
}

