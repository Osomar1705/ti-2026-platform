import { NextRequest, NextResponse } from 'next/server'
import { readUsers, addUser, removeUser, isSuperAdmin } from '@/lib/users-store'

function getCallerEmail(req: NextRequest): string | null {
  const cookie = req.cookies.get('pancho_admin')
  if (!cookie) return null
  try { return JSON.parse(cookie.value).email ?? null } catch { return null }
}

export async function GET(req: NextRequest) {
  const caller = getCallerEmail(req)
  if (!caller || !(await isSuperAdmin(caller))) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 })
  }
  return NextResponse.json({ users: await readUsers() })
}

export async function POST(req: NextRequest) {
  const caller = getCallerEmail(req)
  if (!caller || !(await isSuperAdmin(caller))) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  if (!body?.name || !body?.email) {
    return NextResponse.json({ error: 'Nombre y correo requeridos.' }, { status: 400 })
  }

  const result = await addUser({
    name: body.name.trim(),
    email: body.email.toLowerCase().trim(),
    role: body.role === 'superadmin' ? 'superadmin' : 'admin',
  })

  if (result.error) return NextResponse.json({ error: result.error }, { status: 409 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const caller = getCallerEmail(req)
  if (!caller || !(await isSuperAdmin(caller))) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 403 })
  }

  const { email } = await req.json().catch(() => ({}))
  if (!email) return NextResponse.json({ error: 'Email requerido.' }, { status: 400 })
  if (email.toLowerCase() === caller.toLowerCase()) {
    return NextResponse.json({ error: 'No puedes eliminarte a ti mismo.' }, { status: 400 })
  }

  await removeUser(email)
  return NextResponse.json({ ok: true })
}
