'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAdminUser, logoutAdmin, type AdminUser } from '@/lib/auth'
import { ChevronRight, LogOut, Settings2, Target, ShieldCheck, Users } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminUser().then(u => {
      if (!u) {
        router.replace('/admin/login')
      } else {
        setUser(u)
        setLoading(false)
      }
    })
  }, [router])

  const handleLogout = async () => {
    await logoutAdmin()
    router.push('/')
  }

  if (loading) return null

  return (
    <div className="mx-auto max-w-2xl p-6 md:p-10">
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#8A7A5A]">
        <span>Pancho Web</span>
        <ChevronRight className="size-3" />
        <span className="text-[#D4AF37]">Admin</span>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-[#D4AF37]" />
            <h1 className="text-xl font-bold text-[#F5F1E8]">Panel de Admin</h1>
          </div>
          <p className="mt-1 text-sm text-[#8A7A5A]">
            Bienvenido, <span className="text-[#D4AF37] font-semibold">{user?.name}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-[rgba(212,175,55,0.15)] px-3 py-2 text-xs text-[#8A7A5A] hover:border-red-900/40 hover:text-red-400 transition-colors"
        >
          <LogOut className="size-3.5" />
          Salir
        </button>
      </div>

      <div className="grid gap-4">
        <Link
          href="/simulator"
          className="flex items-center gap-4 rounded-xl border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.04)] p-4 transition-all hover:border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.07)]"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-[rgba(212,175,55,0.1)]">
            <Target className="size-5 text-[#D4AF37]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#F5F1E8]">Editar Simulador</div>
            <div className="mt-0.5 text-xs text-[#8A7A5A]">Configura equipos, resultados y parámetros del torneo</div>
          </div>
          <ChevronRight className="ml-auto size-4 text-[#8A7A5A]" />
        </Link>

        {user?.role === 'superadmin' && (
          <Link
            href="/admin/users"
            className="flex items-center gap-4 rounded-xl border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.04)] p-4 transition-all hover:border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.07)]"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-[rgba(212,175,55,0.1)]">
              <Users className="size-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#F5F1E8]">Gestión de Usuarios</div>
              <div className="mt-0.5 text-xs text-[#8A7A5A]">Agrega o elimina personas con acceso al panel</div>
            </div>
            <ChevronRight className="ml-auto size-4 text-[#8A7A5A]" />
          </Link>
        )}

        <div className="flex items-center gap-4 rounded-xl border border-[rgba(212,175,55,0.08)] bg-[rgba(212,175,55,0.02)] p-4 opacity-50 cursor-not-allowed">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[rgba(212,175,55,0.06)]">
            <Settings2 className="size-5 text-[#8A7A5A]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#8A7A5A]">Configuración general</div>
            <div className="mt-0.5 text-xs text-[#4A3F2F]">Próximamente</div>
          </div>
        </div>
      </div>
    </div>
  )
}
