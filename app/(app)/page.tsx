'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle, ChevronRight } from 'lucide-react'
import { liveMatch, upcomingMatches, recentMatches, panchoRecommendations, tournamentStats } from '@/lib/mock/index'
import { communityPosts } from '@/lib/ti2026-data'
import { useUser } from '@/lib/hooks/useUser'
import { Surface, SectionTitle, TeamMark, LiveBadge, StatCard, MatchRow } from '@/components/shared/ui'
import { WinProbabilityBar } from '@/components/match/WinProbabilityBar'
import { WinProbabilityChart } from '@/components/match/WinProbabilityChart'
import { PanchoCard } from '@/components/pancho/PanchoCard'

export default function Page() {
  const [liked, setLiked] = useState<number[]>([])
  const { user } = useUser()
  const game = liveMatch.liveGame

  if (!game) return null

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-[rgba(212,175,55,0.12)] bg-[#050505] py-16 md:py-24">
        {/* Animated background layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Radial gold gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(212,175,55,0.06) 0%, transparent 70%)',
            }}
          />
          {/* Floating particles */}
          <div
            className="absolute size-1 rounded-full bg-[#D4AF37] animate-particle"
            style={{ top: '20%', left: '15%', animationDuration: '6s', animationDelay: '0s', opacity: 0.5 }}
          />
          <div
            className="absolute size-1 rounded-full bg-[#FFD76A] animate-particle"
            style={{ top: '60%', left: '80%', animationDuration: '8s', animationDelay: '1.5s', opacity: 0.4 }}
          />
          <div
            className="absolute size-0.5 rounded-full bg-[#D4AF37] animate-particle"
            style={{ top: '40%', left: '70%', animationDuration: '7s', animationDelay: '3s', opacity: 0.3 }}
          />
          <div
            className="absolute size-1.5 rounded-full bg-[#F5B942] animate-particle"
            style={{ top: '75%', left: '30%', animationDuration: '9s', animationDelay: '0.8s', opacity: 0.25 }}
          />
          <div
            className="absolute size-0.5 rounded-full bg-[#D4AF37] animate-particle"
            style={{ top: '30%', left: '55%', animationDuration: '5s', animationDelay: '2s', opacity: 0.35 }}
          />
        </div>

        {/* Hero content */}
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          
          {/* Logo Central PanchoWeb */}
          <div className="mb-8 flex justify-center">
            <Image 
              src="/logo-pancho-blanco.png" 
              alt="Logo Central Pancho Web" 
              width={120} 
              height={120} 
              className="drop-shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:scale-105 transition-transform duration-300" 
            />
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#8A7A5A] mb-3">DOTA 2</p>

          <h1 className="text-5xl font-black tracking-tight text-[#F5F1E8] md:text-7xl">
            THE INTERNATIONAL
          </h1>
          <p className="mt-2 text-5xl font-black text-[#D4AF37] md:text-7xl">2026</p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#8A7A5A]">
              LIVE DATA · PREDICTIONS · SIMULATOR
            </p>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <LiveBadge />
            <span className="rounded-full border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.05)] px-4 py-1.5 font-mono text-[10px] text-[#D4AF37]">
              RIAD · DÍA 12/18
            </span>
          </div>
        </div>
      </section>

      {/* ── DASHBOARD CONTENT ── */}
      <div className="mx-auto max-w-[1440px] p-4 md:p-8">
        {/* Greeting */}
        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#F5F1E8] md:text-4xl">
              {user ? <>Bienvenido, <span className="text-[#D4AF37]">{user.name || user.username}.</span></> : <>TI 2026 · <span className="text-[#D4AF37]">En vivo</span></>}
            </h1>
            <p className="mt-2 text-sm text-[#8A7A5A]">
              The International 2026 · <span className="text-[#D4AF37] font-semibold">Día 12</span> de 18 · Riad
            </p>
          </div>
        </div>

        {/* Live match card */}
        <Surface className="relative mb-5 overflow-hidden p-5 gold-top-border">
          <div className="mb-4 flex items-center gap-3">
            <LiveBadge />
            <span className="text-xs text-[#8A7A5A]">{liveMatch.phase} · Partida {liveMatch.currentGame} · {game.duration}</span>
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <TeamMark team={liveMatch.radiant} />
              <p className="text-sm font-semibold text-[#F5F1E8]">{liveMatch.radiant.name}</p>
              <p className="font-mono text-3xl font-bold text-[#F5F1E8]">{liveMatch.radiantScore}</p>
            </div>
            <div className="text-center">
              <p className="font-mono text-xs text-[#8A7A5A]">{game.duration}</p>
              <div className="my-2 text-[10px] font-semibold uppercase tracking-widest text-[#8A7A5A]">vs</div>
              <span className="rounded-full bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.2)] px-2 py-1 font-mono text-[10px] font-bold text-[#D4AF37]">BO3</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <TeamMark team={liveMatch.dire} />
              <p className="text-sm font-semibold text-[#F5F1E8]">{liveMatch.dire.name}</p>
              <p className="font-mono text-3xl font-bold text-[#F5F1E8]">{liveMatch.direScore}</p>
            </div>
          </div>
          <div className="mt-6">
            <WinProbabilityBar
              radiantPct={68}
              direPct={32}
              radiantLabel={liveMatch.radiant.short}
              direLabel={liveMatch.dire.short}
              radiantColor={liveMatch.radiant.color}
              direColor={liveMatch.dire.color}
            />
          </div>
        </Surface>

        {/* Win probability chart */}
        <Surface className="mb-5 p-5">
          <SectionTitle eyebrow="En vivo" title="Probabilidad de victoria — Partida 2" />
          <WinProbabilityChart
            data={game.winProbHistory}
            radiantLabel={liveMatch.radiant.short}
            direLabel={liveMatch.dire.short}
            radiantColor={liveMatch.radiant.color}
            direColor={liveMatch.dire.color}
          />
        </Surface>

        {/* Two-column grid: upcoming + tournament stats */}
        <div className="mb-5 grid gap-5 lg:grid-cols-2">
          <Surface className="p-5">
            <SectionTitle eyebrow="Centro de partidas" title="Próximas partidas" action="Ver horario" actionHref="/live" />
            <div className="-mx-4 border-t border-[rgba(212,175,55,0.08)]">
              {upcomingMatches.map((m) => (
                <MatchRow key={m.id} match={m} />
              ))}
            </div>
          </Surface>

          <Surface className="p-5">
            <SectionTitle eyebrow="Señales" title="Resumen del torneo" />
            <div className="grid grid-cols-2 gap-3">
              {tournamentStats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </Surface>
        </div>

        {/* Recent results */}
        <Surface className="mb-5 p-5">
          <SectionTitle eyebrow="Feed de partidas" title="Resultados recientes" action="Todos los resultados" actionHref="/live" />
          <div className="-mx-4 border-t border-[rgba(212,175,55,0.08)]">
            {recentMatches.map((match) => (
              <MatchRow key={match.id} match={match} />
            ))}
          </div>
        </Surface>

        {/* Pancho recommendations */}
        <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {panchoRecommendations.map((rec) => (
            <PanchoCard key={rec.tag} recommendation={rec} />
          ))}
        </div>

        {/* Community posts */}
        <Surface className="p-5">
          <SectionTitle eyebrow="Comunidad" title="Qué dicen los fans" action="Abrir comunidad" actionHref="/community" />
          <div className="flex flex-col gap-4">
            {communityPosts.map((post, i) => (
              <div key={post.user} className="border-b border-[rgba(212,175,55,0.08)] pb-3 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded-full bg-[rgba(212,175,55,0.08)] border border-[rgba(212,175,55,0.15)] text-[9px] font-bold text-[#D4AF37]">
                    {post.user.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-[#F5F1E8]">{post.user}</span>
                  <span className="text-[10px] text-[#8A7A5A]">{post.time}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-[#8A7A5A]">{post.text}</p>
                <div className="mt-2 flex gap-4 text-[10px] text-[#8A7A5A]">
                  <button
                    onClick={() => setLiked((current) =>
                      current.includes(i) ? current.filter((x) => x !== i) : [...current, i]
                    )}
                    className={`flex items-center gap-1 transition-colors ${liked.includes(i) ? 'text-[#D4AF37]' : 'hover:text-[#D4AF37]'}`}
                  >
                    <Heart className="size-3" fill={liked.includes(i) ? 'currentColor' : 'none'} />
                    {post.likes + (liked.includes(i) ? 1 : 0)}
                  </button>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="size-3" /> {post.replies}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Surface>

        {/* Disclaimer */}
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
