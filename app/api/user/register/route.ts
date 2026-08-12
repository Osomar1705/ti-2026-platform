import { NextRequest, NextResponse } from 'next/server'
import { findByEmail, findByUsername, createUser } from '@/lib/user-store'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)

  if (!body?.username || !body?.name || !body?.email) {
    return NextResponse.json({ error: 'Nombre, usuario y correo son requeridos.' }, { status: 400 })
  }

  const email = body.email.toLowerCase().trim()
  const username = body.username.trim().toLowerCase()

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return NextResponse.json({ error: 'Usuario: 3-20 caracteres, solo letras, números y _' }, { status: 400 })
  }

  const [existingEmail, existingUsername] = await Promise.all([
    findByEmail(email),
    findByUsername(username),
  ])

  if (existingEmail) return NextResponse.json({ error: 'Este correo ya está registrado.' }, { status: 409 })
  if (existingUsername) return NextResponse.json({ error: 'Ese usuario ya está en uso.' }, { status: 409 })

  const user = await createUser({
    username,
    name: body.name.trim(),
    email,
    country: body.country?.trim() ?? '',
  })

  const res = NextResponse.json({ ok: true, user })
  res.cookies.set('pancho_user', JSON.stringify({ id: user.id, username: user.username, name: user.name, email: user.email }), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
  return res
}
