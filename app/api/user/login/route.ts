import { NextRequest, NextResponse } from 'next/server'
import { findByEmail } from '@/lib/user-store'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)

  if (!body?.email) {
    return NextResponse.json({ error: 'Correo requerido.' }, { status: 400 })
  }

  const email = body.email.toLowerCase().trim()
  const user = findByEmail(email)

  if (!user) {
    return NextResponse.json({ error: 'No existe una cuenta con ese correo.' }, { status: 404 })
  }

  const res = NextResponse.json({ ok: true, user })
  res.cookies.set('pancho_user', JSON.stringify({ id: user.id, username: user.username, name: user.name, email: user.email }), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return res
}
