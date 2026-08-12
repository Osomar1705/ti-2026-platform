import fs from 'fs'
import path from 'path'

export interface AuthorizedUser {
  name: string
  email: string
  role: 'superadmin' | 'admin'
  addedAt: string
}

const FILE_PATH = path.join(process.cwd(), 'data', 'authorized-users.json')

export function readUsers(): AuthorizedUser[] {
  try {
    const raw = fs.readFileSync(FILE_PATH, 'utf-8')
    return JSON.parse(raw).users ?? []
  } catch {
    return []
  }
}

export function writeUsers(users: AuthorizedUser[]): void {
  fs.writeFileSync(FILE_PATH, JSON.stringify({ users }, null, 2), 'utf-8')
}

export function isAuthorized(email: string): AuthorizedUser | null {
  const users = readUsers()
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null
}

export function isSuperAdmin(email: string): boolean {
  const user = isAuthorized(email)
  return user?.role === 'superadmin'
}
