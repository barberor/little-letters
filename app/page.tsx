import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Hello Amelia!</h1>
      <Link href="/student-signup">
        <button>Student Sign Up</button>
      </Link>
    </div>
  )
}