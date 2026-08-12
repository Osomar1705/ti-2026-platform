import { NextRequest, NextResponse } from 'next/server'
import { readUsers, writeUsers, isSuperAdmin, type AuthorizedUser } from '@/lib/users-store'

function getCallerEmail(req: NextRequest): string | null {
  const cookie = req.cookies.get('pancho_admin')
  if (!cookie) return null
  try {
    return JSON.parse(cookie.value).email ?? null
  } catch {
    return null
  }
}

// GET /api/admin/users — lista todos los usuarios autorizados
export async function GET(req: NextRequest) {
  const caller = getCallerEmail(req)
  if (!caller || !isSuperAdmin(caller)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 })
  }
  return NextResponse.json({ users: readUsers() })
}

// POST /api/admin/users — agrega un usuario
export async function POST(req: NextRequest) {
  const caller = getCallerEmail(req)
  if (!caller || !isSuperAdmin(caller)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  if (!body?.name || !body?.email) {
    return NextResponse.json({ error: 'Nombre y correo requeridos.' }, { status: 400 })
  }

  const email = body.email.toLowerCase().trim()
  const users = readUsers()

  if (users.find(u => u.email === email)) {
    return NextResponse.json({ error: 'El correo ya está registrado.' }, { status: 409 })
  }

  const newUser: AuthorizedUser = {
    name: body.name.trim(),
    email,
    role: body.role === 'superadmin' ? 'superadmin' : 'admin',
    addedAt: new Date().toISOString().split('T')[0],
  }

  writeUsers([...users, newUser])
  return NextResponse.json({ ok: true, user: newUser })
}

// DELETE /api/admin/users — elimina un usuario por email
export async function DELETE(req: NextRequest) {
  const caller = getCallerEmail(req)
  if (!caller || !isSuperAdmin(caller)) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 })
  }

  const { email } = await req.json().catch(() => ({}))
  if (!email) {
    return NextResponse.json({ error: 'Email requerido.' }, { status: 400 })
  }

  if (email.toLowerCase() === caller.toLowerCase()) {
    return NextResponse.json({ error: 'No puedes eliminarte a ti mismo.' }, { status: 400 })
  }

  const users = readUsers()
  const filtered = users.filter(u => u.email.toLowerCase() !== email.toLowerCase())

  if (filtered.length === users.length) {
    return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 })
  }

  writeUsers(filtered)
  return NextResponse.json({ ok: true })
}
