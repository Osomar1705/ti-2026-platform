import https from 'node:https'

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim().replace(/\/$/, '')
const SUPABASE_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim()

function request(method: string, path: string, body?: unknown): Promise<{ ok: boolean; status: number; data: unknown }> {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${path}`)
    const payload = body ? JSON.stringify(body) : undefined

    const options: https.RequestOptions = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    }

    const req = https.request(options, (res) => {
      let raw = ''
      res.on('data', chunk => { raw += chunk })
      res.on('end', () => {
        try {
          resolve({ ok: (res.statusCode ?? 500) < 300, status: res.statusCode ?? 500, data: JSON.parse(raw) })
        } catch {
          resolve({ ok: false, status: res.statusCode ?? 500, data: raw })
        }
      })
    })

    req.on('error', reject)
    if (payload) req.write(payload)
    req.end()
  })
}

export async function dbSelect<T>(table: string, filters: Record<string, string> = {}): Promise<T[]> {
  const params = new URLSearchParams({ select: '*', ...filters })
  const { ok, data } = await request('GET', `${table}?${params}`)
  if (!ok || !Array.isArray(data)) return []
  return data as T[]
}

export async function dbInsert<T>(table: string, data: Record<string, unknown>): Promise<T> {
  const res = await request('POST', table, data)
  if (!res.ok) {
    const msg = (res.data as any)?.message ?? 'Insert failed'
    throw new Error(msg)
  }
  const rows = res.data
  return (Array.isArray(rows) ? rows[0] : rows) as T
}

export async function dbUpdate<T>(table: string, match: Record<string, string>, data: Record<string, unknown>): Promise<T | null> {
  const params = new URLSearchParams(match)
  const res = await request('PATCH', `${table}?${params}`, data)
  if (!res.ok) return null
  const rows = res.data
  return (Array.isArray(rows) ? rows[0] ?? null : rows) as T | null
}

export async function dbDelete(table: string, match: Record<string, string>): Promise<void> {
  const params = new URLSearchParams(match)
  await request('DELETE', `${table}?${params}`)
}
