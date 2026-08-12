import { NextRequest, NextResponse } from 'next/server'
import { findByEmail, findByUsername, createUser } from '@/lib/user-store'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)

  if (!body?.username || !body?.name || !body?.email) {
    return NextResponse.json({ error: 'Nombre, usuario y correo son requeridos.' }, { status: 400 })
  }

  const email = body.email.toLowerCase().trim()
  const username = body.username.trim()

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return NextResponse.json({ error: 'Usuario: 3-20 caracteres, solo letras, números y _' }, { status: 400 })
  }

  if (findByEmail(email)) {
    return NextResponse.json({ error: 'Este correo ya está registrado.' }, { status: 409 })
  }

  if (findByUsername(username)) {
    return NextResponse.json({ error: 'Ese nombre de usuario ya está en uso.' }, { status: 409 })
  }

  const user = createUser({
    username,
    name: body.name.trim(),
    email,
    country: body.country?.trim() ?? '',
    bio: '',
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
