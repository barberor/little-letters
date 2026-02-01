import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { receiverId, content } = await req.json()

  if (!receiverId || !content) {
    return NextResponse.json(
      { error: 'receiverId and content are required' },
      { status: 400 }
    )
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user || userError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('letters')
    .insert({
      sender_id: user.id,
      receiver_id: receiverId,
      content: content,
    })

  if (error) {
    console.error('Letter creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}