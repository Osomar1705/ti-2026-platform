'use client'

import { liveMatch, upcomingMatches } from '@/lib/mock'
import { heroes } from '@/lib/mock/heroes'
import { Surface, SectionTitle, TeamMark, LiveBadge, MatchRow } from '@/components/shared/ui'
import { WinProbabilityBar } from '@/components/match/WinProbabilityBar'
import { WinProbabilityChart } from '@/components/match/WinProbabilityChart'
import { DraftPanel } from '@/components/match/DraftPanel'
import { PlayerTable } from '@/components/match/PlayerTable'
import { players } from '@/lib/mock/teams'
import Link from 'next/link'
import { ChevronRight, Zap } from 'lucide-react'
import LiveStreamPlayer from '@/components/simulator/LiveStreamPlayer';

// Page showing the live match in detail
export default function LivePage() {
  const game = liveMatch.liveGame!
  const radiantPlayerIds = players.filter(p => p.teamId === liveMatch.radiant.id).map(p => p.id)

const tournamentStreams = {
    twitch: 'dota2ti_es', 
    youtube: 'UCbEhNEf6zVdmd4C61ALvsAw', 
    kick: 'dotati'
  };

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

      {/* Score hero */}
      <Surface className="mb-6 p-6 gold-top-border relative">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <TeamMark team={liveMatch.radiant} />
            <p className="font-semibold text-[#F5F1E8]">{liveMatch.radiant.name}</p>
            <p className="font-mono text-5xl font-black text-[#D4AF37]">{liveMatch.radiantScore}</p>
            <span className="rounded-full bg-[rgba(46,204,113,0.08)] border border-[rgba(46,204,113,0.2)] px-2 py-0.5 font-mono text-[10px] text-emerald-400">SERIE</span>
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
                <p className="font-mono text-sm font-bold text-[#D4AF37]">+{((liveMatch.liveGame?.economyHistory.at(-1)?.radiantNW ?? 0) - (liveMatch.liveGame?.economyHistory.at(-1)?.direNW ?? 0)).toLocaleString()}</p>
                <p className="text-[10px] text-[#8A7A5A]">Diff. NW</p>
              </div>
              <div>
                <p className="font-mono text-sm font-bold text-[#F5F1E8]">BO3</p>
                <p className="text-[10px] text-[#8A7A5A]">Formato</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <TeamMark team={liveMatch.dire} />
            <p className="font-semibold text-[#F5F1E8]">{liveMatch.dire.name}</p>
            <p className="font-mono text-5xl font-black text-[#F5F1E8]">{liveMatch.direScore}</p>
            <span className="rounded-full bg-[rgba(212,175,55,0.06)] border border-[rgba(212,175,55,0.15)] px-2 py-0.5 font-mono text-[10px] text-[#8A7A5A]">SERIE</span>
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

      {/* Charts + Draft */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Surface className="p-5">
          <SectionTitle eyebrow="En vivo" title="Probabilidad de victoria" />
          <WinProbabilityChart
            data={game.winProbHistory}
            radiantLabel={liveMatch.radiant.short}
            direLabel={liveMatch.dire.short}
            radiantColor={liveMatch.radiant.color}
            direColor={liveMatch.dire.color}
          />
        </Surface>

        <Surface className="p-5">
          <SectionTitle eyebrow="Draft" title="Selección de héroes — Partida 2" />
          <DraftPanel draft={game.draft} heroes={heroes} />
        </Surface>
      </div>

      {/* Player table */}
      <Surface className="mt-6 p-5">
        <SectionTitle eyebrow="Estadísticas" title="Rendimiento de jugadores" />
        <PlayerTable
          playerStats={game.playerStats}
          players={players}
          heroes={heroes}
          radiantPlayerIds={radiantPlayerIds}
        />
      </Surface>

      {/* Upcoming */}
      <Surface className="mt-6 p-5">
        <SectionTitle eyebrow="Próximas partidas" title="En cola" />
        <div className="-mx-4 border-t border-border/50">
          {upcomingMatches.map((m) => (
            <MatchRow key={m.id} match={m} />
          ))}
        </div>
      </Surface>
    </div>
  )
}
