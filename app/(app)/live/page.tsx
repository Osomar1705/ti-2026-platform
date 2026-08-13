'use client'

import { liveMatch, upcomingMatches } from '@/lib/mock/index'
import { heroes } from '@/lib/mock/heroes'
import { players } from '@/lib/mock/teams'

import { Surface, SectionTitle, TeamMark, LiveBadge, MatchRow } from '@/components/shared/ui'
import { WinProbabilityBar } from '@/components/match/WinProbabilityBar'
import { WinProbabilityChart } from '@/components/match/WinProbabilityChart'
import { DraftPanel } from '@/components/match/DraftPanel'
import { PlayerTable } from '@/components/match/PlayerTable'
import { ChevronRight, Radio } from 'lucide-react'
import Link from 'next/link'
import LiveStreamPlayer from '@/components/simulator/LiveStreamPlayer'

const tournamentStreams = {
  twitch: 'dota2ti_es',
  youtube: 'UCbEhNEf6zVdmd4C61ALvsAw', // Tu ID de YouTube
  kick: 'dotati'
}

export default function LivePage() {
  if (!liveMatch || !liveMatch.liveGame) {
    return (
      <div className="mx-auto max-w-[1440px] p-4 md:p-8">
        <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#8A7A5A]">
          <span>Pancho Web</span>
          <ChevronRight className="size-3" />
          <span className="text-[#D4AF37]">En vivo</span>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2 rounded-full border border-[rgba(138,122,90,0.3)] bg-[rgba(138,122,90,0.06)] px-3 py-1">
              <span className="size-1.5 rounded-full bg-[#8A7A5A]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8A7A5A]">SIN PARTIDA EN VIVO</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#F5F1E8]">Centro en vivo</h1>
        </div>

        <div className="mb-6 w-full">
          <LiveStreamPlayer streamUrls={tournamentStreams} />
        </div>

        <Surface className="mb-6 p-10 gold-top-border">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-full border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.05)]">
              <Radio className="size-6 text-[#8A7A5A]" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A7A5A] mb-2">ESTADO</p>
              <p className="text-xl font-bold text-[#F5F1E8]">No hay partidas en vivo</p>
              <p className="mt-2 text-sm text-[#8A7A5A] max-w-md">
                Cuando comience una partida de TI 2026, aparecerá aquí automáticamente
                con marcadores, estadísticas, draft y probabilidad de victoria en tiempo real.
              </p>
            </div>
            <div className="mt-2 rounded-lg border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.04)] px-5 py-3 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">TI 2026 · FASE DE GRUPOS</p>
              <p className="mt-1 text-sm text-[#F5F1E8] font-semibold">13 de agosto de 2026</p>
            </div>
          </div>
        </Surface>

        <Surface className="p-5">
          <SectionTitle eyebrow="Durante la partida" title="Lo que verás aquí en vivo" />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {['Marcador en tiempo real', 'Win Probability', 'Picks & Bans', 'Net Worth', 'Bajas por minuto', 'Estadísticas de jugadores'].map((item) => (
              <div key={item} className="rounded-lg border border-[rgba(212,175,55,0.1)] bg-[rgba(212,175,55,0.03)] p-3 text-center">
                <p className="text-[11px] text-[#8A7A5A] leading-4">{item}</p>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    )
  }

  const game = liveMatch.liveGame
  const radiantPlayerIds = players ? players.filter(p => p.teamId === liveMatch.radiant.id).map(p => p.id) : []

  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#8A7A5A]">
        <span>Pancho Web</span>
        <ChevronRight className="size-3" />
        <span className="text-[#D4AF37]">En vivo</span>
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <LiveBadge />
            <span className="text-sm text-muted-foreground">{liveMatch.phase} · Partida {liveMatch.currentGame} · {game.duration}</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold">
            {liveMatch.radiant.name} vs {liveMatch.dire.name}
          </h1>
        </div>
        <Link
          href={`/matches/${liveMatch.id}`}
          className="flex items-center gap-2 rounded-lg bg-[rgba(212,175,55,0.10)] border border-[rgba(212,175,55,0.2)] px-4 py-2 text-sm font-semibold text-[#D4AF37] hover:bg-[rgba(212,175,55,0.18)] transition-colors"
        >
          Centro de partida <ChevronRight className="size-4" />
        </Link>
      </div>

      {/* Reproductor de Video Oficial */}
      <div className="mb-6 w-full">
        <LiveStreamPlayer streamUrls={tournamentStreams} />
      </div>

      {/* Score hero */}
      <Surface className="mb-6 p-6 gold-top-border relative">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <TeamMark team={liveMatch.radiant} />
            <p className="font-semibold text-[#F5F1E8]">{liveMatch.radiant.name}</p>
            <p className="font-mono text-5xl font-black text-[#D4AF37]">{liveMatch.radiantScore}</p>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="font-mono text-xs text-[#8A7A5A]">{game.duration}</p>
            <div className="my-1 text-[11px] font-bold uppercase tracking-widest text-[#8A7A5A]">vs</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="font-mono text-sm font-bold text-[#F5F1E8]">{game.radiantScore} — {game.direScore}</p>
                <p className="text-[10px] text-[#8A7A5A]">Bajas</p>
              </div>
              <div>
                <p className="font-mono text-sm font-bold text-[#D4AF37]">+{((game.economyHistory?.at(-1)?.radiantNW ?? 0) - (game.economyHistory?.at(-1)?.direNW ?? 0)).toLocaleString()}</p>
                <p className="text-[10px] text-[#8A7A5A]">Diff. NW</p>
              </div>
              <div>
                <p className="font-mono text-sm font-bold text-[#F5F1E8]">{liveMatch.format}</p>
                <p className="text-[10px] text-[#8A7A5A]">Formato</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <TeamMark team={liveMatch.dire} />
            <p className="font-semibold text-[#F5F1E8]">{liveMatch.dire.name}</p>
            <p className="font-mono text-5xl font-black text-[#F5F1E8]">{liveMatch.direScore}</p>
          </div>
        </div>
        
        {/* Barra de Probabilidad 85-15 */}
        <div className="mt-6">
          <WinProbabilityBar
            radiantPct={game.winProbHistory?.at(-1)?.radiant ?? 85}
            direPct={game.winProbHistory?.at(-1)?.dire ?? 15}
            radiantLabel={liveMatch.radiant.short}
            direLabel={liveMatch.dire.short}
            radiantColor={liveMatch.radiant.color}
            direColor={liveMatch.dire.color}
          />
        </div>
      </Surface>

      {/* Charts + Draft */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Surface className="p-5">
          <SectionTitle eyebrow="En vivo" title={`Probabilidad de victoria — Partida ${liveMatch.currentGame}`} />
          <WinProbabilityChart
            data={game.winProbHistory}
            radiantLabel={liveMatch.radiant.short}
            direLabel={liveMatch.dire.short}
            radiantColor={liveMatch.radiant.color}
            direColor={liveMatch.dire.color}
          />
        </Surface>

        <Surface className="p-5">
          <SectionTitle eyebrow="Draft" title={`Selección de héroes — Partida ${liveMatch.currentGame}`} />
          {game.draft && game.draft.length > 0 ? (
            <DraftPanel draft={game.draft} heroes={heroes} />
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-[#8A7A5A]">
              Esperando fase de picks y bans...
            </div>
          )}
        </Surface>
      </div>

      {/* Player table */}
      <Surface className="mt-6 p-5">
        <SectionTitle eyebrow="Estadísticas" title="Rendimiento de jugadores" />
        {game.playerStats && game.playerStats.length > 0 ? (
           <PlayerTable
             playerStats={game.playerStats}
             players={players}
             heroes={heroes}
             radiantPlayerIds={radiantPlayerIds}
           />
        ) : (
           <div className="flex h-32 items-center justify-center text-sm text-[#8A7A5A]">
             Las estadísticas de los jugadores aparecerán al sonar el cuerno de batalla.
           </div>
        )}
      </Surface>
    </div>
  )
}
