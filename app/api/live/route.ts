import { NextResponse } from 'next/server'
import { getLiveData } from '@/lib/live/provider'
import { getDebugLeagueIds } from '@/lib/live/stratz'

export const dynamic = 'force-dynamic'

// Rate limit simple en memoria: max 10 req/min por IP
const _rateMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10
const RATE_WINDOW = 60_000

function getClientIp(req: Request): string {
  const headers = req.headers
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip') ??
    'unknown'
  )
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = _rateMap.get(ip)

  if (!entry || now > entry.resetAt) {
    _rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return false
  }

  entry.count++
  if (entry.count > RATE_LIMIT) return true
  return false
}

export async function GET(request: Request) {
  const ip = getClientIp(request)

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  const url = new URL(request.url)
  const debug = url.searchParams.get('debug') === '1'

  // El endpoint debug solo desde localhost o Vercel preview
  if (debug) {
    const host = url.hostname
    const isLocal = host === 'localhost' || host === '127.0.0.1' || host.endsWith('.vercel.app')
    if (!isLocal) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const ids = await getDebugLeagueIds()
    return NextResponse.json({ leagueIds: ids }, { headers: { 'Cache-Control': 'no-store' } })
  }

  try {
    const data = await getLiveData()
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return NextResponse.json(
      { matches: [], fetchedAt: Date.now(), source: 'ERROR', error: 'Internal server error' },
      { status: 500 }
    )
  }
}
