import { supabase } from './supabase'

export interface AuthorizedUser {
  name: string
  email: string
  role: 'superadmin' | 'admin'
  added_at: string
}

export async function readUsers(): Promise<AuthorizedUser[]> {
  const { data } = await supabase.from('authorized_users').select('*')
  return data ?? []
}

export async function isAuthorized(email: string): Promise<AuthorizedUser | null> {
  const { data } = await supabase
    .from('authorized_users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()
  return data ?? null
}

export async function isSuperAdmin(email: string): Promise<boolean> {
  const user = await isAuthorized(email)
  return user?.role === 'superadmin'
}

export async function addUser(user: Omit<AuthorizedUser, 'added_at'>): Promise<{ error?: string }> {
  const { error } = await supabase.from('authorized_users').insert({
    ...user,
    email: user.email.toLowerCase(),
    added_at: new Date().toISOString().split('T')[0],
  })
  if (error) return { error: error.message }
  return {}
}

export async function removeUser(email: string): Promise<void> {
  await supabase.from('authorized_users').delete().eq('email', email.toLowerCase())
}
