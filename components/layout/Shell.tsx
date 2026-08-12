'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  BarChart3,
  Bell,
  Home,
  Menu,
  Radio,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  Users,
  X,
  ArrowUpRight,
} from 'lucide-react'
import { getAdminUser, type AdminUser } from '@/lib/auth'
import { useUser } from '@/lib/hooks/useUser'

const navItems = [
  { label: 'Inicio', href: '/', icon: Home },
  { label: 'En vivo', href: '/live', icon: Radio, live: true },
  { label: 'TI 2026', href: '/bracket', icon: Trophy },
  { label: 'Estadísticas', href: '/statistics', icon: BarChart3 },
  { label: 'Simulador', href: '/simulator', icon: Target },
  { label: 'Comunidad', href: '/community', icon: Users },
  { label: 'Perfil', href: '/profile', icon: UserRound },
]

const mobileNavItems = [
  { label: 'Inicio', href: '/', icon: Home },
  { label: 'En vivo', href: '/live', icon: Radio },
  { label: 'Simulador', href: '/simulator', icon: Target },
  { label: 'Comunidad', href: '/community', icon: Users },
  { label: 'Perfil', href: '/profile', icon: UserRound },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const { user: sessionUser } = useUser()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    getAdminUser().then(setAdminUser)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-[rgba(212,175,55,0.12)] bg-[#080604] px-4 py-5 transition-transform md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-3">
            
            <Image 
              src="/logo-pancho-blanco.png" 
              alt="Logo Pancho Web" 
              width={36} 
              height={36} 
              className="rounded-lg" 
            />

            <div>
              <div className="text-sm font-bold tracking-wide text-[#D4AF37]">PANCHO WEB</div>
              <div className="font-mono text-[9px] uppercase tracking-[.2em] text-[#8A7A5A]">THE INTERNATIONAL 2026</div>
            </div>
          </Link>
          <button className="md:hidden text-[#8A7A5A] hover:text-[#F5F1E8]" onClick={() => setMobileOpen(false)}>
            <X className="size-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-9 flex flex-col gap-0.5">
          {navItems.map(({ label, href, icon: Icon, live }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-[rgba(212,175,55,0.08)] font-semibold text-[#D4AF37] border-l-2 border-[#D4AF37]'
                    : 'text-[#8A7A5A] hover:bg-[rgba(212,175,55,0.04)] hover:text-[#F5F1E8] border-l-2 border-transparent'
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {label}
                {live && (
                  <span className="ml-auto size-1.5 rounded-full bg-[#C0392B] animate-live-pulse" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Pancho promo card */}
        <div className="mt-auto rounded-xl border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.04)] p-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[#D4AF37]" />
            <span className="text-xs font-semibold text-[#F5F1E8]">Analista Pancho</span>
          </div>
          <p className="mt-2 text-[11px] leading-4 text-[#8A7A5A]">
            Recomendaciones basadas en señales del torneo.
          </p>
          <Link href="/" className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#D4AF37]">
            Explorar picks <ArrowUpRight className="size-3" />
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between px-2 text-[#8A7A5A]">
          <Settings2 className="size-4" />
          <span className="font-mono text-[10px]">v0.2 beta</span>
          <UserRound className="size-4" />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col md:pl-60">
        {/* Header */}
        <header
          className={`sticky top-0 z-30 flex h-16 items-center justify-between px-4 backdrop-blur-md md:px-8 transition-all duration-200 ${
            scrolled
              ? 'border-b border-[rgba(212,175,55,0.25)] bg-[rgba(5,5,5,0.95)] shadow-[0_2px_20px_rgba(0,0,0,0.6)]'
              : 'border-b border-[rgba(212,175,55,0.12)] bg-[rgba(5,5,5,0.80)]'
          }`}
        >
          <div className="flex items-center gap-3">
            <button className="md:hidden text-[#8A7A5A] hover:text-[#F5F1E8]" onClick={() => setMobileOpen(true)}>
              <Menu className="size-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-2.5 size-4 text-[#8A7A5A]" />
              <input
                placeholder="Buscar equipos, jugadores, partidas..."
                className="w-64 rounded-lg border border-[rgba(212,175,55,0.12)] bg-[rgba(212,175,55,0.04)] py-2 pl-9 pr-3 text-xs text-[#F5F1E8] outline-none placeholder:text-[#8A7A5A] focus:border-[rgba(212,175,55,0.4)]"
              />
            </div>
            <span className="text-sm font-bold text-[#D4AF37] sm:hidden">PANCHO WEB</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.04)] px-3 py-1.5 sm:flex">
              <span className="size-1.5 rounded-full bg-amber-500" />
              <span className="font-mono text-[10px] font-semibold text-[#8A7A5A]">DATOS MOCK</span>
              <span className="text-[10px] text-[#8A7A5A]">· hace 8 seg</span>
            </div>
            <button className="relative rounded-lg p-2 text-[#8A7A5A] hover:bg-[rgba(212,175,55,0.06)] hover:text-[#F5F1E8]">
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#D4AF37]" />
            </button>
            {adminUser && (
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.08)] px-2.5 py-1.5 text-xs font-bold text-[#D4AF37] hover:bg-[rgba(212,175,55,0.14)] transition-colors"
              >
                <ShieldCheck className="size-3.5" />
                {adminUser.name.split(' ')[0]}
              </Link>
            )}
            {sessionUser ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.06)] px-2.5 py-1.5 text-xs font-semibold text-[#F5F1E8] hover:bg-[rgba(212,175,55,0.1)] transition-colors"
              >
                <div className="flex size-5 items-center justify-center rounded-full bg-[rgba(212,175,55,0.2)] text-[9px] font-black text-[#D4AF37]">
                  {sessionUser.username.slice(0, 2).toUpperCase()}
                </div>
                {sessionUser.username}
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-full border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.06)] px-3 py-1.5 text-xs font-semibold text-[#D4AF37] hover:bg-[rgba(212,175,55,0.1)] transition-colors"
              >
                <UserRound className="size-3.5" />
                Entrar
              </Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-[rgba(212,175,55,0.12)] bg-[#080604] md:hidden">
        {mobileNavItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#D4AF37]' : 'text-[#8A7A5A]'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-[#D4AF37]" />
              )}
              <Icon className="size-5" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  )
}
