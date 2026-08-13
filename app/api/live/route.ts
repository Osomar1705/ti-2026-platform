import { NextResponse } from 'next/server'
import { getLiveData } from '@/lib/live/provider'
import { getDebugLeagueIds } from '@/lib/live/stratz'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const debug = url.searchParams.get('debug') === '1'

  try {
    if (debug) {
      const ids = await getDebugLeagueIds()
      return NextResponse.json({ leagueIds: ids }, { headers: { 'Cache-Control': 'no-store' } })
    }

    const data = await getLiveData()
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json(
      { matches: [], fetchedAt: Date.now(), source: 'ERROR', error: 'Internal server error' },
      { status: 500 }
    )
  }
}
