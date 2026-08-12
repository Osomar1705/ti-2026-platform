import { NextRequest, NextResponse } from 'next/server'
import { isAuthorized } from '@/lib/users-store'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)

  if (!body?.name || !body?.email) {
    return NextResponse.json({ error: 'Nombre y correo requeridos.' }, { status: 400 })
  }

  const email = body.email.toLowerCase().trim()
  const name = body.name.trim()

  const authorized = isAuthorized(email)
  if (!authorized) {
    return NextResponse.json({ error: 'Correo no autorizado.' }, { status: 403 })
  }

  const res = NextResponse.json({ ok: true, user: { name, email, role: authorized.role } })
  res.cookies.set('pancho_admin', JSON.stringify({ name, email, role: authorized.role }), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
