'use client'

import { use, useState } from 'react'
import { matches } from '@/lib/mock'
import { heroes } from '@/lib/mock/heroes'
import { players } from '@/lib/mock/teams'
import { Surface, SectionTitle, TeamMark, LiveBadge, MatchRow } from '@/components/shared/ui'
import { WinProbabilityBar } from '@/components/match/WinProbabilityBar'
import { WinProbabilityChart } from '@/components/match/WinProbabilityChart'
import { DraftPanel } from '@/components/match/DraftPanel'
import { PlayerTable } from '@/components/match/PlayerTable'
import { EconomyChart } from '@/components/match/EconomyChart'
import { chatMessages } from '@/lib/mock/community'
import { notFound } from 'next/navigation'
import { ChevronRight, Send } from 'lucide-react'

const TABS = ['RESUMEN', 'DRAFT', 'JUGADORES', 'ECONOMÍA', 'CHAT'] as const
type Tab = typeof TABS[number]

export default function MatchPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params)
  const match = matches.find((m) => m.id === matchId)
  if (!match) notFound()

  const [tab, setTab] = useState<Tab>('RESUMEN')
  const game = match.liveGame ?? match.games[0]
  const radiantPlayerIds = players.filter((p) => p.teamId === match.radiant.id).map((p) => p.id)

  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">
        <span>Nexus</span>
        <ChevronRight className="size-3" />
        <span>Partidas</span>
        <ChevronRight className="size-3" />
        <span className="text-primary">{match.radiant.short} vs {match.dire.short}</span>
      </div>

      {/* Header */}
      <Surface className="mb-6 p-6">
        <div className="mb-4 flex items-center gap-3">
          {match.status === 'live' ? <LiveBadge /> : null}
          <span className="text-xs text-muted-foreground">{match.phase} · {match.format}</span>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <TeamMark team={match.radiant} />
            <p className="font-semibold">{match.radiant.name}</p>
            <p className="font-mono text-4xl font-black">{match.radiantScore}</p>
          </div>
          <p className="text-center font-mono text-sm text-muted-foreground">vs</p>
          <div className="flex flex-col items-center gap-2">
            <TeamMark team={match.dire} />
            <p className="font-semibold">{match.dire.name}</p>
            <p className="font-mono text-4xl font-black">{match.direScore}</p>
          </div>
        </div>
        {game && (
          <div className="mt-6">
            <WinProbabilityBar
              radiantPct={game.winProbHistory.at(-1)?.radiant ?? 50}
              direPct={game.winProbHistory.at(-1)?.dire ?? 50}
              radiantLabel={match.radiant.short}
              direLabel={match.dire.short}
              radiantColor={match.radiant.color}
              direColor={match.dire.color}
            />
          </div>
        )}
      </Surface>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg border border-border/60 bg-muted/30 p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-2 font-mono text-xs font-semibold transition-colors ${
              tab === t ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'RESUMEN' && game && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Surface className="p-5">
            <SectionTitle eyebrow="Probabilidad" title="Win probability en tiempo real" />
            <WinProbabilityChart
              data={game.winProbHistory}
              radiantLabel={match.radiant.short}
              direLabel={match.dire.short}
              radiantColor={match.radiant.color}
              direColor={match.dire.color}
            />
          </Surface>
          <Surface className="p-5">
            <SectionTitle eyebrow="Eventos" title="Línea de tiempo" />
            <div className="flex flex-col gap-4">
              {game.events.map((ev, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`mt-1 size-2 rounded-full ${i === game.events.length - 1 ? 'bg-primary shadow-[0_0_10px_var(--primary)]' : 'bg-muted-foreground'}`} />
                    {i < game.events.length - 1 && <span className="mt-1 h-full w-px bg-border" />}
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-xs font-semibold">{ev.text}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{ev.minute}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">{ev.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      )}

      {tab === 'DRAFT' && game && (
        <Surface className="p-5">
          <SectionTitle eyebrow="Draft" title="Selección de héroes" />
          <DraftPanel draft={game.draft} heroes={heroes} />
        </Surface>
      )}

      {tab === 'JUGADORES' && game && (
        <Surface className="p-5">
          <SectionTitle eyebrow="Estadísticas" title="Rendimiento de jugadores" />
          <PlayerTable
            playerStats={game.playerStats}
            players={players}
            heroes={heroes}
            radiantPlayerIds={radiantPlayerIds}
          />
        </Surface>
      )}

      {tab === 'ECONOMÍA' && game && (
        <Surface className="p-5">
          <SectionTitle eyebrow="Economía" title="Net worth y experiencia" />
          <EconomyChart data={game.economyHistory} height={320} />
        </Surface>
      )}

      {tab === 'CHAT' && (
        <Surface className="p-5">
          <SectionTitle eyebrow="Chat en vivo" title="Sala de la partida" />
          <div className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-2">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-bold">
                  {msg.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold">{msg.username}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{msg.timestamp}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{msg.text}</p>
                  {msg.reactions && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {Object.entries(msg.reactions).map(([emoji, count]) => (
                        <span key={emoji} className="rounded-full border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px]">
                          {emoji} {count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2 border-t border-border/50 pt-4">
            <input
              placeholder="Escribe un mensaje..."
              className="flex-1 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs outline-none focus:border-primary/60"
            />
            <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">
              <Send className="size-3" /> Enviar
            </button>
          </div>
        </Surface>
      )}
    </div>
  )
}
