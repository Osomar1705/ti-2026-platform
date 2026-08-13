'use client'

import { useEffect, useState } from 'react'
import type { User } from '@/lib/user-store'

export function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    fetch('/api/user/me')
      .then(r => r.json())
      .then(d => setUser(d.user ?? null))
      .catch(() => setUser(null))
  }, [])

  const logout = async () => {
    await fetch('/api/user/logout', { method: 'POST' })
    setUser(null)
    window.location.href = '/login'
  }

  return { user, loading: user === undefined, logout }
}
