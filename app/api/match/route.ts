import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

/**
 * GET /api/match
 * Returns the current match for the logged-in user (student OR mentor),
 * or null if no match exists yet.
 */
export async function GET() {
  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (!user || userError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .or(`student_id.eq.${user.id},mentor_id.eq.${user.id}`)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

/**
 * POST /api/match
 * Mentor creates an instant match with a student.
 * Body: { studentId: string }
 */
export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { studentId } = await req.json()

  if (!studentId) {
    return NextResponse.json(
      { error: 'studentId is required' },
      { status: 400 }
    )
  }

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (!user || userError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase.from('matches').insert({
    mentor_id: user.id,
    student_id: studentId
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
