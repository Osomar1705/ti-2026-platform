const SUPABASE_URL = (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)!.replace(/\/$/, '')
const SUPABASE_KEY = (process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!.trim()

function makeHeaders(extra?: Record<string, string>) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
    ...extra,
  }
}

export async function dbSelect<T>(table: string, filters: Record<string, string> = {}): Promise<T[]> {
  const params = new URLSearchParams({ select: '*', ...filters })
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    method: 'GET',
    headers: makeHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

export async function dbInsert<T>(table: string, data: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: makeHeaders(),
    body: JSON.stringify(data),
    cache: 'no-store',
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message ?? 'Insert failed')
  }
  const rows = await res.json()
  return Array.isArray(rows) ? rows[0] : rows
}

export async function dbUpdate<T>(table: string, match: Record<string, string>, data: Record<string, unknown>): Promise<T | null> {
  const params = new URLSearchParams(match)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    method: 'PATCH',
    headers: makeHeaders(),
    body: JSON.stringify(data),
    cache: 'no-store',
  })
  if (!res.ok) return null
  const rows = await res.json()
  return Array.isArray(rows) ? rows[0] ?? null : rows
}

export async function dbDelete(table: string, match: Record<string, string>): Promise<void> {
  const params = new URLSearchParams(match)
  await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    method: 'DELETE',
    headers: makeHeaders(),
    cache: 'no-store',
  })
}
