import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return NextResponse.json({
    url_set: !!url,
    url_length: url?.length ?? 0,
    key_set: !!key,
    key_length: key?.length ?? 0,
    key_start: key?.slice(0, 10),
    key_end: key?.slice(-10),
  })
}
