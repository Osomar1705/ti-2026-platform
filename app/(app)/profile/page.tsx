'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Surface, SectionTitle } from '@/components/shared/ui'
import { useUser } from '@/lib/hooks/useUser'
import { ChevronRight, Edit3, Shield, LogOut, Loader2, Check, X } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, logout } = useUser()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', bio: '', country: '' })

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
    if (user) setForm({ name: user.name, bio: user.bio, country: user.country })
  }, [user, loading, router])

  const handleSave = async () => {
    setSaving(true)
    await fetch('/api/user/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setEditing(false)
    window.location.reload()
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[#D4AF37]" />
      </div>
    )
  }

  const accuracy = user.total > 0 ? Math.round((user.correct / user.total) * 100) : 0
  const initials = user.username.slice(0, 2).toUpperCase()

  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">
        <span>Pancho Web</span>
        <ChevronRight className="size-3" />
        <span className="text-primary">Perfil</span>
      </div>

      <Surface className="mb-6 p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/20 text-3xl font-black text-primary">
              {initials}
            </div>
            {user.streak > 0 && (
              <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                {user.streak}
              </div>
            )}
          </div>

          <div className="flex-1">
            {editing ? (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Nombre</label>
                    <input
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-lg border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.04)] px-3 py-2 text-sm text-foreground outline-none focus:border-[rgba(212,175,55,0.4)]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">País (emoji)</label>
                    <input
                      value={form.country}
                      onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                      placeholder="🇦🇷"
                      className="w-full rounded-lg border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.04)] px-3 py-2 text-sm text-foreground outline-none focus:border-[rgba(212,175,55,0.4)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    placeholder="Fan de Dota 2 desde TI3..."
                    rows={2}
                    className="w-full resize-none rounded-lg border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.04)] px-3 py-2 text-sm text-foreground outline-none focus:border-[rgba(212,175,55,0.4)]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    {saving ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                    Guardar
                  </button>
                  <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs text-muted-foreground">
                    <X className="size-3" /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <span className="font-mono text-sm text-muted-foreground">@{user.username}</span>
                  {user.country && <span className="text-lg">{user.country}</span>}
                  <button onClick={() => setEditing(true)} className="ml-auto flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground">
                    <Edit3 className="size-3" /> Editar
                  </button>
                  <button onClick={logout} className="flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs text-muted-foreground hover:border-red-900/40 hover:text-red-400">
                    <LogOut className="size-3" /> Salir
                  </button>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {user.bio || `Miembro desde ${user.createdAt}`}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-5">
                  {[
                    { label: 'Predicciones', value: String(user.total) },
                    { label: 'Acierto', value: accuracy + '%', accent: true },
                    { label: 'Puntos', value: String(user.points), accent: true },
                    { label: 'Racha', value: user.streak > 0 ? `${user.streak} 🔥` : '—' },
                    { label: 'Correctas', value: String(user.correct) },
                  ].map(s => (
                    <div key={s.label} className="rounded-lg bg-muted/30 p-3 text-center">
                      <p className={`font-mono text-xl font-bold ${(s as any).accent ? 'text-primary' : ''}`}>{s.value}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Surface>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Surface className="p-5">
          <SectionTitle eyebrow="Historial" title="Mis predicciones" />
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-4xl">🎯</p>
            <p className="mt-3 text-sm font-semibold">Aún no hay predicciones</p>
            <p className="mt-1 text-xs text-muted-foreground">Tus predicciones aparecerán cuando el torneo comience</p>
          </div>
        </Surface>
        <div className="flex flex-col gap-4">
          <Surface className="p-5">
            <SectionTitle eyebrow="Logros" title="Insignias" />
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-3xl">🏆</p>
              <p className="mt-2 text-xs text-muted-foreground">Gana insignias haciendo predicciones correctas</p>
            </div>
          </Surface>
          <Surface className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="size-4 text-primary" />
              <span>Cuenta activa · {user.email}</span>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  )
}
