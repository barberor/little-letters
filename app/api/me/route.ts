import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function GET() {
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (!user || error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error: matchError } = await supabase
    .from('matches')
    .select('*')
    .or(`student_id.eq.${user.id},mentor_id.eq.${user.id}`)
    .maybeSingle()

  if (matchError) {
    return NextResponse.json({ error: matchError.message }, { status: 500 })
  }

  return NextResponse.json(data ?? null)
}


export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { studentId } = await req.json()

  if (!studentId) {
    return NextResponse.json(
      { error: 'studentId is required' },
      { status: 400 }
    )
  }

  const { data: { user }, error: userError } =
    await supabase.auth.getUser()

  if (!user || userError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1️⃣ Ensure requester is a mentor
  const { data: mentor } = await supabase
    .from('profiles')
    .select('id, role, matched')
    .eq('id', user.id)
    .single()

  if (!mentor || mentor.role !== 'mentor') {
    return NextResponse.json(
      { error: 'Only mentors can create matches' },
      { status: 403 }
    )
  }

  if (mentor.matched) {
    return NextResponse.json(
      { error: 'Mentor already matched' },
      { status: 400 }
    )
  }

  // 2️⃣ Validate student
  const { data: student } = await supabase
    .from('profiles')
    .select('id, approved, matched, role')
    .eq('id', studentId)
    .single()

  if (!student || student.role !== 'student') {
    return NextResponse.json(
      { error: 'Invalid student' },
      { status: 400 }
    )
  }

  if (!student.approved) {
    return NextResponse.json(
      { error: 'Student not approved' },
      { status: 400 }
    )
  }

  if (student.matched) {
    return NextResponse.json(
      { error: 'Student already matched' },
      { status: 400 }
    )
  }

  // 3️⃣ Create match
  const { error: matchError } = await supabase
    .from('matches')
    .insert({
      mentor_id: mentor.id,
      student_id: student.id
    })

  if (matchError) {
    return NextResponse.json(
      { error: matchError.message },
      { status: 400 }
    )
  }

  // 4️⃣ Update both users
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ matched: true })
    .in('id', [mentor.id, student.id])

  if (updateError) {
    return NextResponse.json(
      { error: 'Match created but user update failed' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}
