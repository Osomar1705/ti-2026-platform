import https from 'node:https'
import { NextResponse } from 'next/server'

function httpsGet(url: string, headers: Record<string, string>): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url)
    const req = https.request({ hostname: parsed.hostname, path: parsed.pathname + parsed.search, method: 'GET', headers }, (res) => {
      let body = ''
      res.on('data', c => { body += c })
      res.on('end', () => resolve({ status: res.statusCode ?? 0, body }))
    })
    req.on('error', reject)
    req.end()
  })
}

export async function GET() {
  const url = ((process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL) ?? '').trim().replace(/\/$/, '')
  const key = ((process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ?? '').trim()

  // 1. Sin auth — ver si el proyecto responde
  const noAuth = await httpsGet(`${url}/rest/v1/`, {}).catch(e => ({ status: 0, body: e.message }))

  // 2. Con solo apikey header
  const withKey = await httpsGet(`${url}/rest/v1/users?select=id&limit=1`, {
    apikey: key,
    Authorization: `Bearer ${key}`,
  }).catch(e => ({ status: 0, body: e.message }))

  // 3. Probar con key hardcodeada (la misma pero sin leer de env)
  const hardcodedKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zdWdhbHdycWt0b29leHptY2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NjcxMTUsImV4cCI6MjEwMjE0MzExNX0.zuZJcS0BQLAqqgeNkH0kgPD8GVqg3X-cQOGXLWbGwZE'
  const withHardcoded = await httpsGet(`${url}/rest/v1/users?select=id&limit=1`, {
    apikey: hardcodedKey,
    Authorization: `Bearer ${hardcodedKey}`,
  }).catch(e => ({ status: 0, body: e.message }))

  return NextResponse.json({
    no_auth: { status: noAuth.status, body: noAuth.body.slice(0, 100) },
    with_env_key: { status: withKey.status, body: withKey.body.slice(0, 100) },
    with_hardcoded_key: { status: withHardcoded.status, body: withHardcoded.body.slice(0, 100) },
  })
}
