import { dbSelect, dbInsert, dbUpdate } from './supabase'

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
  const rows = await dbSelect<User>('users', { email: `eq.${email.toLowerCase()}` })
  return rows[0] ?? null
}

export async function findByUsername(username: string): Promise<User | null> {
  const rows = await dbSelect<User>('users', { username: `eq.${username.toLowerCase()}` })
  return rows[0] ?? null
}

export async function findById(id: string): Promise<User | null> {
  const rows = await dbSelect<User>('users', { id: `eq.${id}` })
  return rows[0] ?? null
}

export async function createUser(input: {
  username: string
  name: string
  email: string
  country: string
}): Promise<User> {
  return dbInsert<User>('users', {
    username: input.username.toLowerCase(),
    name: input.name,
    email: input.email.toLowerCase(),
    country: input.country,
  })
}

export async function updateUser(id: string, patch: Partial<Pick<User, 'name' | 'bio' | 'country'>>): Promise<User | null> {
  return dbUpdate<User>('users', { id: `eq.${id}` }, patch)
}

export async function getLeaderboard() {
  const rows = await dbSelect<User>('users', { order: 'points.desc' })
  return rows.map((u, i) => ({
    id: u.id,
    username: u.username,
    name: u.name,
    country: u.country,
    points: u.points,
    correct: u.correct,
    total: u.total,
    streak: u.streak,
    rank: i + 1,
    accuracy: u.total > 0 ? Math.round((u.correct / u.total) * 100) : 0,
  }))
}
