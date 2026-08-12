import { NextResponse } from 'next/server'
import { getLeaderboard } from '@/lib/user-store'

export async function GET() {
  const users = await getLeaderboard()
  return NextResponse.json({ users })
}
