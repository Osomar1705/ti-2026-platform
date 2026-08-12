import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Probar conexión real a Supabase
  let supabaseOk = false
  let supabaseError = ''
  try {
    const res = await fetch(`${url}/rest/v1/users?select=id&limit=1`, {
      headers: {
        apikey: key!,
        Authorization: `Bearer ${key}`,
      },
    })
    supabaseOk = res.ok
    if (!res.ok) supabaseError = await res.text()
  } catch (e: any) {
    supabaseError = e.message
  }

  return NextResponse.json({
    url_length: url?.length ?? 0,
    key_length: key?.length ?? 0,
    key_start: key?.slice(0, 10),
    supabase_ok: supabaseOk,
    supabase_error: supabaseError,
  })
}
