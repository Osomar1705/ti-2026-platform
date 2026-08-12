export interface AdminUser {
  name: string
  email: string
  role: 'superadmin' | 'admin'
}

export async function loginAdmin(name: string, email: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  })
  const data = await res.json()
  if (!res.ok) return { ok: false, error: data.error }
  return { ok: true }
}

export async function logoutAdmin(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' })
}

export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const res = await fetch('/api/auth/me')
    const data = await res.json()
    return data.user ?? null
  } catch {
    return null
  }
}

// Gestión de usuarios autorizados (solo superadmin)
export async function fetchAuthorizedUsers() {
  const res = await fetch('/api/admin/users')
  if (!res.ok) return []
  const data = await res.json()
  return data.users ?? []
}

export async function addAuthorizedUser(name: string, email: string, role: 'admin' | 'superadmin' = 'admin') {
  const res = await fetch('/api/admin/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, role }),
  })
  const data = await res.json()
  if (!res.ok) return { ok: false, error: data.error }
  return { ok: true }
}

export async function removeAuthorizedUser(email: string) {
  const res = await fetch('/api/admin/users', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const data = await res.json()
  if (!res.ok) return { ok: false, error: data.error }
  return { ok: true }
}
