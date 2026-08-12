import fs from 'fs'
import path from 'path'

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
  createdAt: string
}

const FILE_PATH = path.join(process.cwd(), 'data', 'users.json')

export function readUsers(): User[] {
  try {
    const raw = fs.readFileSync(FILE_PATH, 'utf-8')
    return JSON.parse(raw).users ?? []
  } catch {
    return []
  }
}

export function writeUsers(users: User[]): void {
  fs.writeFileSync(FILE_PATH, JSON.stringify({ users }, null, 2), 'utf-8')
}

export function findByEmail(email: string): User | null {
  return readUsers().find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null
}

export function findByUsername(username: string): User | null {
  return readUsers().find(u => u.username.toLowerCase() === username.toLowerCase()) ?? null
}

export function findById(id: string): User | null {
  return readUsers().find(u => u.id === id) ?? null
}

export function createUser(data: Omit<User, 'id' | 'points' | 'correct' | 'total' | 'streak' | 'createdAt'>): User {
  const users = readUsers()
  const user: User = {
    ...data,
    id: crypto.randomUUID(),
    points: 0,
    correct: 0,
    total: 0,
    streak: 0,
    createdAt: new Date().toISOString().split('T')[0],
  }
  writeUsers([...users, user])
  return user
}

export function updateUser(id: string, patch: Partial<User>): User | null {
  const users = readUsers()
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) return null
  users[idx] = { ...users[idx], ...patch }
  writeUsers(users)
  return users[idx]
}
