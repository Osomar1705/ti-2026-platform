import { NextRequest, NextResponse } from 'next/server'
import { findById } from '@/lib/user-store'

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('pancho_user')
  if (!cookie) return NextResponse.json({ user: null })

  try {
    const { id } = JSON.parse(cookie.value)
    const user = await findById(id)
    return NextResponse.json({ user: user ?? null })
  } catch {
    return NextResponse.json({ user: null })
  }
}
