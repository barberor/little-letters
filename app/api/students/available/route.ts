import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export async function GET() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, grade, interests')  // Changed 'name' to 'full_name'
    .eq('role', 'student')
    .eq('approved', true)
    .eq('matched', false)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}