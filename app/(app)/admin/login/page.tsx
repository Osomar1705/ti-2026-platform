'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { loginAdmin } from '@/lib/auth'
import { LogIn, ShieldCheck } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await loginAdmin(name.trim(), email.trim())
    if (result.ok) {
      router.push('/admin')
    } else {
      setError(result.error ?? 'Error al iniciar sesión.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080604] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image src="/logo-pancho-blanco.png" alt="Pancho Web" width={48} height={48} className="rounded-xl" />
          <div className="text-center">
            <div className="text-lg font-bold tracking-wide text-[#D4AF37]">PANCHO WEB</div>
            <div className="font-mono text-[10px] uppercase tracking-[.2em] text-[#8A7A5A]">Panel de administración</div>
          </div>
        </div>

        <div className="rounded-2xl border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.03)] p-6">
          <div className="mb-5 flex items-center gap-2">
            <ShieldCheck className="size-4 text-[#D4AF37]" />
            <span className="text-sm font-semibold text-[#F5F1E8]">Acceso restringido</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-[.15em] text-[#8A7A5A]">Nombre</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Tu nombre"
                className="rounded-lg border border-[rgba(212,175,55,0.12)] bg-[rgba(212,175,55,0.04)] px-3 py-2.5 text-sm text-[#F5F1E8] outline-none placeholder:text-[#4A3F2F] focus:border-[rgba(212,175,55,0.4)] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-[.15em] text-[#8A7A5A]">Correo</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="rounded-lg border border-[rgba(212,175,55,0.12)] bg-[rgba(212,175,55,0.04)] px-3 py-2.5 text-sm text-[#F5F1E8] outline-none placeholder:text-[#4A3F2F] focus:border-[rgba(212,175,55,0.4)] transition-colors"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-2 text-xs text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-[#080604] transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              <LogIn className="size-4" />
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center font-mono text-[10px] text-[#4A3F2F]">
          Solo correos autorizados pueden acceder
        </p>
      </div>
    </div>
  )
}
