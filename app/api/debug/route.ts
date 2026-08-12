import { NextResponse } from 'next/server'

export async function GET() {
  const url = ((process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL) ?? '').replace(/\/$/, '')
  const key = ((process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ?? '').trim()

  let ok = false
  let error = ''
  let status = 0

  try {
    const res = await fetch(`${url}/rest/v1/users?select=id&limit=1`, {
      method: 'GET',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    status = res.status
    ok = res.ok
    if (!res.ok) error = await res.text()
  } catch (e: any) {
    error = e.message
  }

  return NextResponse.json({
    url,
    key_length: key.length,
    key_start: key.slice(0, 20),
    key_end: key.slice(-10),
    status,
    ok,
    error,
  })
}
