import { NextRequest, NextResponse } from 'next/server'
import { updateUser } from '@/lib/user-store'

export async function PATCH(req: NextRequest) {
  const cookie = req.cookies.get('pancho_user')
  if (!cookie) return NextResponse.json({ error: 'No autenticado.' }, { status: 401 })

  const { id } = JSON.parse(cookie.value)
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Body inválido.' }, { status: 400 })

  const patch: Record<string, string> = {}
  for (const key of ['name', 'bio', 'country'] as const) {
    if (body[key] !== undefined) patch[key] = String(body[key]).trim()
  }

  const updated = await updateUser(id, patch)
  if (!updated) return NextResponse.json({ error: 'Usuario no encontrado.' }, { status: 404 })

  return NextResponse.json({ ok: true, user: updated })
}
