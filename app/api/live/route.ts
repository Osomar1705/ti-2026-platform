import { NextResponse } from 'next/server'
import { getLiveData } from '@/lib/live/provider'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await getLiveData()
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json(
      { matches: [], fetchedAt: Date.now(), source: 'ERROR', error: 'Internal server error' },
      { status: 500 }
    )
  }
}
