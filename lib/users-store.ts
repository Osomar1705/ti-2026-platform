import { dbSelect, dbInsert, dbDelete } from './supabase'

export interface AuthorizedUser {
  name: string
  email: string
  role: 'superadmin' | 'admin'
  added_at: string
}

export async function readUsers(): Promise<AuthorizedUser[]> {
  return dbSelect<AuthorizedUser>('authorized_users')
}

export async function isAuthorized(email: string): Promise<AuthorizedUser | null> {
  const rows = await dbSelect<AuthorizedUser>('authorized_users', { email: `eq.${email.toLowerCase()}` })
  return rows[0] ?? null
}

export async function isSuperAdmin(email: string): Promise<boolean> {
  const user = await isAuthorized(email)
  return user?.role === 'superadmin'
}

export async function addUser(user: Omit<AuthorizedUser, 'added_at'>): Promise<{ error?: string }> {
  try {
    await dbInsert('authorized_users', {
      ...user,
      email: user.email.toLowerCase(),
      added_at: new Date().toISOString().split('T')[0],
    })
    return {}
  } catch (e: any) {
    return { error: e.message }
  }
}

export async function removeUser(email: string): Promise<void> {
  await dbDelete('authorized_users', { email: `eq.${email.toLowerCase()}` })
}
