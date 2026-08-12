import { NextResponse } from 'next/server'
import { readUsers } from '@/lib/user-store'

export async function GET() {
  const users = readUsers()
  const ranked = [...users]
    .sort((a, b) => b.points - a.points)
    .map((u, i) => ({
      rank: i + 1,
      id: u.id,
      username: u.username,
      name: u.name,
      country: u.country,
      points: u.points,
      correct: u.correct,
      total: u.total,
      accuracy: u.total > 0 ? Math.round((u.correct / u.total) * 100) : 0,
      streak: u.streak,
    }))
  return NextResponse.json({ users: ranked })
}
