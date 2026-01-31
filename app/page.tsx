import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Hello Amelia!</h1>
      <Link href="/sign-up">
        <button>Student Sign Up</button>
      </Link>
    </div>
  )
}