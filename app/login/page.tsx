'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LogIn, UserPlus, Loader2 } from 'lucide-react'

type Tab = 'login' | 'register'

const FLAGS = ['🇦🇷', '🇲🇽', '🇨🇴', '🇵🇪', '🇨🇱', '🇧🇷', '🇺🇸', '🇪🇸', '🇵🇱', '🇸🇪', '🇩🇪', '🇨🇳', '🇰🇷', '🇷🇺', '🇵🇭', '🇦🇺', '🌍']

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [loginForm, setLoginForm] = useState({ email: '' })
  const [regForm, setRegForm] = useState({ name: '', username: '', email: '', country: '' })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginForm.email }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    router.push('/profile')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = await fetch('/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regForm),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    router.push('/profile')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080604] px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image src="/logo-pancho-blanco.png" alt="Pancho Web" width={48} height={48} className="rounded-xl" />
          <div className="text-center">
            <div className="text-lg font-bold tracking-wide text-[#D4AF37]">PANCHO WEB</div>
            <div className="font-mono text-[10px] uppercase tracking-[.2em] text-[#8A7A5A]">TI 2026 · Predicciones y análisis</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex rounded-xl border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.03)] p-1">
          {(['login', 'register'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                tab === t
                  ? 'bg-[#D4AF37] text-[#080604]'
                  : 'text-[#8A7A5A] hover:text-[#F5F1E8]'
              }`}
            >
              {t === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.03)] p-6">
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
                <LogIn className="size-4 text-[#D4AF37]" />
                <span className="text-sm font-semibold text-[#F5F1E8]">Bienvenido de vuelta</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[.15em] text-[#8A7A5A]">Correo</label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={e => setLoginForm({ email: e.target.value })}
                  placeholder="tu@correo.com"
                  className="rounded-lg border border-[rgba(212,175,55,0.12)] bg-[rgba(212,175,55,0.04)] px-3 py-2.5 text-sm text-[#F5F1E8] outline-none placeholder:text-[#4A3F2F] focus:border-[rgba(212,175,55,0.4)] transition-colors"
                />
              </div>
              {error && <p className="rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-2 text-xs text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-[#080604] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
              <p className="text-center text-xs text-[#4A3F2F]">
                ¿Sin cuenta?{' '}
                <button type="button" onClick={() => setTab('register')} className="text-[#D4AF37] hover:underline">
                  Regístrate gratis
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
                <UserPlus className="size-4 text-[#D4AF37]" />
                <span className="text-sm font-semibold text-[#F5F1E8]">Crea tu cuenta</span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[.15em] text-[#8A7A5A]">Nombre completo</label>
                <input
                  type="text"
                  required
                  value={regForm.name}
                  onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Tu nombre"
                  className="rounded-lg border border-[rgba(212,175,55,0.12)] bg-[rgba(212,175,55,0.04)] px-3 py-2.5 text-sm text-[#F5F1E8] outline-none placeholder:text-[#4A3F2F] focus:border-[rgba(212,175,55,0.4)] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[.15em] text-[#8A7A5A]">
                  Usuario <span className="text-[#4A3F2F]">(visible en leaderboard)</span>
                </label>
                <input
                  type="text"
                  required
                  value={regForm.username}
                  onChange={e => setRegForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="miusuario_dota"
                  pattern="[a-zA-Z0-9_]{3,20}"
                  title="3-20 caracteres: letras, números y _"
                  className="rounded-lg border border-[rgba(212,175,55,0.12)] bg-[rgba(212,175,55,0.04)] px-3 py-2.5 text-sm text-[#F5F1E8] outline-none placeholder:text-[#4A3F2F] focus:border-[rgba(212,175,55,0.4)] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[.15em] text-[#8A7A5A]">Correo</label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="tu@correo.com"
                  className="rounded-lg border border-[rgba(212,175,55,0.12)] bg-[rgba(212,175,55,0.04)] px-3 py-2.5 text-sm text-[#F5F1E8] outline-none placeholder:text-[#4A3F2F] focus:border-[rgba(212,175,55,0.4)] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[.15em] text-[#8A7A5A]">País (opcional)</label>
                <select
                  value={regForm.country}
                  onChange={e => setRegForm(f => ({ ...f, country: e.target.value }))}
                  className="rounded-lg border border-[rgba(212,175,55,0.12)] bg-[rgba(0,0,0,0.4)] px-3 py-2.5 text-sm text-[#F5F1E8] outline-none focus:border-[rgba(212,175,55,0.4)] transition-colors"
                >
                  <option value="">— Selecciona —</option>
                  {FLAGS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {error && <p className="rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-2 text-xs text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-[#080604] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>

              <p className="text-center text-xs text-[#4A3F2F]">
                ¿Ya tienes cuenta?{' '}
                <button type="button" onClick={() => setTab('login')} className="text-[#D4AF37] hover:underline">
                  Inicia sesión
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
