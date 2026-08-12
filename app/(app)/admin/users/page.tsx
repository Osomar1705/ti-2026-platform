'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAdminUser, fetchAuthorizedUsers, addAuthorizedUser, removeAuthorizedUser, type AdminUser } from '@/lib/auth'
import { ChevronRight, UserPlus, Trash2, ShieldCheck, Crown, ArrowLeft, Loader2 } from 'lucide-react'

interface AuthorizedUser {
  name: string
  email: string
  role: 'superadmin' | 'admin'
  addedAt: string
}

export default function UsersPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [users, setUsers] = useState<AuthorizedUser[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', role: 'admin' as 'admin' | 'superadmin' })

  useEffect(() => {
    getAdminUser().then(u => {
      if (!u) { router.replace('/admin/login'); return }
      if (u.role !== 'superadmin') { router.replace('/admin'); return }
      setCurrentUser(u)
      return fetchAuthorizedUsers()
    }).then(list => {
      if (list) setUsers(list)
      setLoading(false)
    })
  }, [router])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    const result = await addAuthorizedUser(form.name, form.email, form.role)
    if (!result.ok) {
      setError(result.error ?? 'Error al agregar usuario.')
    } else {
      setForm({ name: '', email: '', role: 'admin' })
      const list = await fetchAuthorizedUsers()
      setUsers(list)
    }
    setSaving(false)
  }

  const handleRemove = async (email: string) => {
    setSaving(true)
    const result = await removeAuthorizedUser(email)
    if (!result.ok) {
      setError(result.error ?? 'Error al eliminar.')
    } else {
      const list = await fetchAuthorizedUsers()
      setUsers(list)
    }
    setSaving(false)
  }

  if (loading) return null

  return (
    <div className="mx-auto max-w-2xl p-6 md:p-10">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#8A7A5A]">
        <span>Pancho Web</span>
        <ChevronRight className="size-3" />
        <Link href="/admin" className="hover:text-[#D4AF37] transition-colors">Admin</Link>
        <ChevronRight className="size-3" />
        <span className="text-[#D4AF37]">Usuarios</span>
      </div>

      <div className="mb-8 flex items-center gap-3">
        <Link href="/admin" className="flex items-center gap-1.5 text-xs text-[#8A7A5A] hover:text-[#D4AF37] transition-colors">
          <ArrowLeft className="size-3.5" />
          Volver
        </Link>
        <div className="h-4 w-px bg-[rgba(212,175,55,0.15)]" />
        <h1 className="text-xl font-bold text-[#F5F1E8]">Gestión de Usuarios</h1>
      </div>

      {/* Formulario para agregar */}
      <div className="mb-8 rounded-xl border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.04)] p-5">
        <div className="mb-4 flex items-center gap-2">
          <UserPlus className="size-4 text-[#D4AF37]" />
          <h2 className="text-sm font-semibold text-[#F5F1E8]">Agregar persona</h2>
        </div>
        <form onSubmit={handleAdd} className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs text-[#8A7A5A]">Nombre</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ej: Juan Pérez"
                className="w-full rounded-lg border border-[rgba(212,175,55,0.2)] bg-[rgba(0,0,0,0.3)] px-3 py-2 text-sm text-[#F5F1E8] placeholder:text-[#4A3F2F] focus:border-[rgba(212,175,55,0.5)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs text-[#8A7A5A]">Correo</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="correo@ejemplo.com"
                className="w-full rounded-lg border border-[rgba(212,175,55,0.2)] bg-[rgba(0,0,0,0.3)] px-3 py-2 text-sm text-[#F5F1E8] placeholder:text-[#4A3F2F] focus:border-[rgba(212,175,55,0.5)] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-[#8A7A5A]">Rol</label>
            <select
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value as 'admin' | 'superadmin' }))}
              className="w-full rounded-lg border border-[rgba(212,175,55,0.2)] bg-[rgba(0,0,0,0.3)] px-3 py-2 text-sm text-[#F5F1E8] focus:border-[rgba(212,175,55,0.5)] focus:outline-none"
            >
              <option value="admin">Admin — puede entrar al panel</option>
              <option value="superadmin">Superadmin — puede gestionar usuarios</option>
            </select>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-[#0D0B07] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
            Agregar
          </button>
        </form>
      </div>

      {/* Lista de usuarios */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-[#8A7A5A] uppercase tracking-widest">
          Personas autorizadas ({users.length})
        </h2>
        <div className="grid gap-2">
          {users.map(u => (
            <div
              key={u.email}
              className="flex items-center gap-3 rounded-xl border border-[rgba(212,175,55,0.12)] bg-[rgba(212,175,55,0.03)] px-4 py-3"
            >
              <div className="flex size-9 items-center justify-center rounded-full bg-[rgba(212,175,55,0.1)]">
                {u.role === 'superadmin'
                  ? <Crown className="size-4 text-[#D4AF37]" />
                  : <ShieldCheck className="size-4 text-[#8A7A5A]" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#F5F1E8] truncate">{u.name}</span>
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${
                    u.role === 'superadmin'
                      ? 'bg-[rgba(212,175,55,0.15)] text-[#D4AF37]'
                      : 'bg-[rgba(255,255,255,0.06)] text-[#8A7A5A]'
                  }`}>
                    {u.role}
                  </span>
                </div>
                <div className="text-xs text-[#8A7A5A] truncate">{u.email}</div>
              </div>
              <div className="text-[10px] text-[#4A3F2F] shrink-0">{u.addedAt}</div>
              {u.email !== currentUser?.email && (
                <button
                  onClick={() => handleRemove(u.email)}
                  disabled={saving}
                  className="ml-1 rounded-lg p-1.5 text-[#4A3F2F] transition-colors hover:bg-red-900/20 hover:text-red-400 disabled:opacity-40"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
