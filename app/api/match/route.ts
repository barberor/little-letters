import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function GET() {
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
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

  return NextResponse.json(data ?? null)
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { studentId } = await req.json()

  if (!studentId) {
    return NextResponse.json({ error: 'studentId is required' }, { status: 400 })
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user || userError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // THIS is what should be there - using the database function
  const { error } = await supabase.rpc('create_match', {
    mentor_uuid: user.id,
    student_uuid: studentId
  })

  if (error) {
    console.error('Match creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}