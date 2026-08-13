'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Radio, Target, Trophy, Users } from 'lucide-react'
import { teams } from '@/lib/mock/teams'
import { useUser } from '@/lib/hooks/useUser'
import { Surface, SectionTitle, TeamMark } from '@/components/shared/ui'

const TI_START = new Date('2026-08-13T02:00:00Z') // Primera partida: 21:00 GMT-5 Aug 12 = 02:00 UTC Aug 13
const MAIN_EVENT_START = new Date('2026-08-19T00:00:00Z') // Main Event: 19 agosto, Shanghai

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(() => Math.max(0, target.getTime() - Date.now()))

  useEffect(() => {
    const id = setInterval(() => setDiff(Math.max(0, target.getTime() - Date.now())), 1000)
    return () => clearInterval(id)
  }, [target])

  const total = diff
  const days = Math.floor(total / 86400000)
  const hours = Math.floor((total % 86400000) / 3600000)
  const minutes = Math.floor((total % 3600000) / 60000)
  const seconds = Math.floor((total % 60000) / 1000)
  const started = total === 0

  return { days, hours, minutes, seconds, started }
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="min-w-[72px] rounded-lg border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.06)] px-4 py-3 text-center">
        <span className="font-mono text-3xl font-black text-[#D4AF37] md:text-4xl tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#8A7A5A]">{label}</span>
    </div>
  )
}

export default function Page() {
  const { user } = useUser()
  const { days, hours, minutes, seconds, started } = useCountdown(TI_START)

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-[rgba(212,175,55,0.12)] bg-[#050505] py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(212,175,55,0.06) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src="/pancho-logo-blanco.png"
              alt="Pancho Web"
              width={120}
              height={120}
              className="drop-shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:scale-105 transition-transform duration-300"
            />
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#8A7A5A] mb-3">DOTA 2</p>
          <h1 className="text-5xl font-black tracking-tight text-[#F5F1E8] md:text-7xl">THE INTERNATIONAL</h1>
          <p className="mt-2 text-5xl font-black text-[#D4AF37] md:text-7xl">2026</p>

          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#8A7A5A]">
                FASE DE GRUPOS EN LÍNEA · 12–16 AGO
              </p>
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[rgba(212,175,55,0.4)]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#4A3F2F]">
                MAIN EVENT · 19–23 AGO · SHANGHAI
              </p>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[rgba(212,175,55,0.4)]" />
            </div>
            <p className="font-mono text-[10px] text-[#D4AF37] tracking-wider">PRIZE POOL $2,905,798</p>
          </div>

          {/* Countdown */}
          <div className="mt-10">
            {started ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.08)] px-5 py-2.5">
                <span className="size-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <span className="font-mono text-sm font-bold text-[#D4AF37]">EN CURSO</span>
              </div>
            ) : (
              <div>
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#8A7A5A]">
                  COMIENZA EN
                </p>
                <div className="flex items-start justify-center gap-3">
                  <CountdownUnit value={days} label="DÍAS" />
                  <span className="mt-3 font-mono text-2xl font-black text-[#D4AF37]">:</span>
                  <CountdownUnit value={hours} label="HRS" />
                  <span className="mt-3 font-mono text-2xl font-black text-[#D4AF37]">:</span>
                  <CountdownUnit value={minutes} label="MIN" />
                  <span className="mt-3 font-mono text-2xl font-black text-[#D4AF37]">:</span>
                  <CountdownUnit value={seconds} label="SEG" />
                </div>
                <p className="mt-4 font-mono text-[10px] text-[#8A7A5A]">13 AGOSTO 2026 · 00:00 GMT-5 · PRIMERA PARTIDA</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="mx-auto max-w-[1440px] p-4 md:p-8">

        {/* Greeting */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-[#F5F1E8] md:text-4xl">
            {user ? (
              <>Bienvenido, <span className="text-[#D4AF37]">{user.name || user.username}.</span></>
            ) : (
              <>La plataforma está lista. <span className="text-[#D4AF37]">Esperando TI 2026.</span></>
            )}
          </h2>
          <p className="mt-2 text-sm text-[#8A7A5A]">
            Los resultados, estadísticas y análisis aparecerán cuando comiencen las partidas.
          </p>
        </div>

        {/* Status cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Radio, label: 'En vivo', desc: 'Partidas en directo', href: '/live', status: 'PRÓXIMAMENTE' },
            { icon: Trophy, label: 'Bracket', desc: 'Playoffs TI 2026', href: '/bracket', status: 'POST GRUPOS' },
            { icon: Target, label: 'Simulador', desc: 'Predicciones propias', href: '/simulator', status: 'DISPONIBLE' },
            { icon: Users, label: 'Comunidad', desc: 'Foro de fans', href: '/community', status: 'DISPONIBLE' },
          ].map(({ icon: Icon, label, desc, href, status }) => (
            <Link key={href} href={href}>
              <Surface className="flex flex-col gap-2 p-4 hover:border-[rgba(212,175,55,0.3)] transition-colors cursor-pointer h-full">
                <div className="flex items-center justify-between">
                  <Icon className="size-4 text-[#D4AF37]" />
                  <span className={`font-mono text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    status === 'DISPONIBLE'
                      ? 'bg-[rgba(212,175,55,0.1)] text-[#D4AF37]'
                      : 'bg-[rgba(138,122,90,0.1)] text-[#8A7A5A]'
                  }`}>
                    {status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#F5F1E8]">{label}</p>
                <p className="text-[11px] text-[#8A7A5A]">{desc}</p>
              </Surface>
            </Link>
          ))}
        </div>

        {/* No live match state */}
        <Surface className="mb-6 p-8 gold-top-border">
          <div className="flex flex-col items-center justify-center gap-3 text-center py-6">
            <div className="flex size-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.06)]">
              <Radio className="size-5 text-[#8A7A5A]" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A7A5A] mb-1">EN VIVO</p>
              <p className="text-base font-semibold text-[#F5F1E8]">No hay partidas en curso</p>
              <p className="mt-1 text-sm text-[#8A7A5A]">
                Las partidas en vivo aparecerán aquí cuando comience TI 2026 el 13 de agosto.
              </p>
            </div>
            <Link
              href="/simulator"
              className="mt-2 inline-flex items-center gap-2 rounded-lg border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.06)] px-4 py-2 text-xs font-semibold text-[#D4AF37] hover:bg-[rgba(212,175,55,0.12)] transition-colors"
            >
              <Target className="size-3.5" />
              Usar el simulador mientras tanto
              <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </Surface>

        {/* Teams grid */}
        <Surface className="mb-6 p-5">
          <SectionTitle eyebrow="TI 2026" title="Equipos participantes" />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {teams.map((team) => (
              <div
                key={team.id}
                className="flex flex-col items-center gap-2 rounded-lg border border-[rgba(212,175,55,0.1)] bg-[rgba(212,175,55,0.03)] p-3 hover:border-[rgba(212,175,55,0.2)] transition-colors"
              >
                <TeamMark team={team} />
                <p className="text-center text-[11px] font-semibold text-[#F5F1E8]">{team.name}</p>
                <span className="font-mono text-[9px] text-[#8A7A5A]">{team.region}</span>
              </div>
            ))}
          </div>
        </Surface>

        {/* Pancho Analysis coming soon */}
        <div className="mb-6 rounded-xl border border-[rgba(212,175,55,0.15)] bg-[rgba(5,5,5,0.6)] p-6" style={{ borderTop: '1px solid rgba(212,175,55,0.35)' }}>
          <div className="flex items-start gap-4">
            <div className="w-0.5 self-stretch rounded-full bg-gradient-to-b from-[#D4AF37] to-[rgba(212,175,55,0.1)]" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] mb-1">ANALISTA PANCHO</p>
              <p className="text-base font-semibold text-[#F5F1E8]">
                Las recomendaciones aparecerán cuando comiencen las partidas.
              </p>
              <p className="mt-2 text-sm text-[#8A7A5A]">
                Pancho publicará análisis de picks, predicciones de resultado y alertas de upset conforme avance el torneo.
              </p>
              <Link
                href="/predictions"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:underline"
              >
                Hacer predicciones propias <ChevronRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* No results state */}
        <Surface className="mb-6 p-6">
          <SectionTitle eyebrow="Resultados" title="Historial de partidas" />
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm font-semibold text-[#F5F1E8]">Aún no hay resultados</p>
            <p className="mt-1 text-xs text-[#8A7A5A] max-w-sm">
              Los resultados oficiales de The International 2026 aparecerán aquí cuando comiencen las partidas.
            </p>
          </div>
        </Surface>

        {/* Community CTA */}
        <Surface className="mb-6 p-6">
          <SectionTitle eyebrow="Comunidad" title="Únete a la conversación" action="Abrir comunidad" actionHref="/community" />
          <p className="mt-1 text-sm text-[#8A7A5A]">
            Comparte tus predicciones y análisis con la comunidad mientras esperamos el inicio de TI 2026.
          </p>
        </Surface>

        {/* Footer */}
        <footer className="mt-12 border-t border-[rgba(212,175,55,0.08)] pt-6 pb-4">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-[11px] leading-5 text-[#8A7A5A] font-medium antialiased">
              PanchoWeb es una plataforma independiente de simulación con fines recreativos y estadísticos.
              No está afiliada, patrocinada ni asociada con Valve Corporation, PGL ni los equipos de esports mencionados.
              Dota 2 y The International son marcas registradas de Valve Corporation.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
