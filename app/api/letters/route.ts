import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function GET() {
  const supabase = await createSupabaseServerClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (!user || userError) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: letters, error } = await supabase
    .from('letters')
    .select(`
      id,
      content,
      subject,
      created_at,
      sender_id,
      receiver_id,
      sender:profiles!letters_sender_id_fkey(full_name),
      receiver:profiles!letters_receiver_id_fkey(full_name)
    `)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching letters:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const transformedLetters = letters.map(letter => ({
    id: letter.id,
    content: letter.content,
    subject: letter.subject,
    created_at: letter.created_at,
    sender_id: letter.sender_id,
    receiver_id: letter.receiver_id,
    sender_name: letter.sender_id === user.id ? 'You' : letter.sender?.full_name,
    receiver_name: letter.receiver_id === user.id ? 'You' : letter.receiver?.full_name,
    read: letter.sender_id !== user.id
  }))

  return NextResponse.json(transformedLetters)
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { receiverId, subject, content } = await req.json()

  if (!receiverId || !content || !subject) {
    return NextResponse.json(
      { error: 'receiverId, subject, and content are required' },
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
      subject: subject,
      content: content,
    })

  if (error) {
    console.error('Letter creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
