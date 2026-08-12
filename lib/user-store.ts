import { supabase } from './supabase'

export interface User {
  id: string
  username: string
  name: string
  email: string
  country: string
  bio: string
  points: number
  correct: number
  total: number
  streak: number
  created_at: string
}

export async function findByEmail(email: string): Promise<User | null> {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()
  return data ?? null
}

export async function findByUsername(username: string): Promise<User | null> {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('username', username.toLowerCase())
    .single()
  return data ?? null
}

export async function findById(id: string): Promise<User | null> {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  return data ?? null
}

export async function createUser(input: {
  username: string
  name: string
  email: string
  country: string
}): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .insert({
      username: input.username.toLowerCase(),
      name: input.name,
      email: input.email.toLowerCase(),
      country: input.country,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateUser(id: string, patch: Partial<Pick<User, 'name' | 'bio' | 'country'>>): Promise<User | null> {
  const { data } = await supabase
    .from('users')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  return data ?? null
}

export async function getLeaderboard() {
  const { data } = await supabase
    .from('users')
    .select('id, username, name, country, points, correct, total, streak')
    .order('points', { ascending: false })
  return (data ?? []).map((u, i) => ({
    ...u,
    rank: i + 1,
    accuracy: u.total > 0 ? Math.round((u.correct / u.total) * 100) : 0,
  }))
}
