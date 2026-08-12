import https from 'node:https'
import { NextResponse } from 'next/server'

export async function GET() {
  const url = ((process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL) ?? '').trim().replace(/\/$/, '')
  const key = ((process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ?? '').trim()

  const result: Record<string, unknown> = {
    url,
    url_length: url.length,
    key_length: key.length,
    key_start: key.slice(0, 20),
    key_end: key.slice(-10),
  }

  // Test con node:https nativo
  await new Promise<void>((resolve) => {
    const parsed = new URL(`${url}/rest/v1/users?select=id&limit=1`)
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
    }, (res) => {
      let raw = ''
      res.on('data', c => { raw += c })
      res.on('end', () => {
        result.status = res.statusCode
        result.ok = (res.statusCode ?? 500) < 300
        result.body = raw.slice(0, 200)
        resolve()
      })
    })
    req.on('error', (e) => { result.error = e.message; resolve() })
    req.end()
  })

  return NextResponse.json(result)
}
