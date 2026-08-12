'use client'

import { useState } from 'react'
import { matches } from '@/lib/mock'
import { Surface, SectionTitle, TeamMark } from '@/components/shared/ui'
import type { Prediction } from '@/lib/types'
import { ChevronRight, Lock, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import { useUser } from '@/lib/hooks/useUser'

interface LeaderPreview { rank: number; username: string; points: number; accuracy: number; isYou?: boolean }
const LEADERBOARD_PREVIEW_BASE: LeaderPreview[] = [
  { rank: 1, username: 'draftsmith', points: 1420, accuracy: 78 },
  { rank: 2, username: 'ti_stats_bot', points: 1280, accuracy: 72 },
  { rank: 3, username: 'roshanwatch', points: 1190, accuracy: 68 },
  { rank: 4, username: 'analystvip', points: 1050, accuracy: 65 },
]

export default function PredictionsPage() {
  const { user } = useUser()
  const userId = user?.username ?? 'anon'
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming')

  const LEADERBOARD_PREVIEW: LeaderPreview[] = user
    ? [...LEADERBOARD_PREVIEW_BASE, { rank: 5, username: user.username, points: user.points ?? 840, accuracy: user.total > 0 ? Math.round((user.correct / user.total) * 100) : 64, isYou: true }]
    : LEADERBOARD_PREVIEW_BASE

  function setPrediction(matchId: string, winner: string, score: string) {
    setPredictions((prev) => {
      const existing = prev.find((p) => p.matchId === matchId)
      if (existing) {
        return prev.map((p) => p.matchId === matchId ? { ...p, predictedWinner: winner, predictedScore: score } : p)
      }
      return [...prev, { id: `pred-${Date.now()}`, userId, matchId, predictedWinner: winner, predictedScore: score, locked: false }]
    })
  }

  function lockPrediction(matchId: string) {
    setPredictions((prev) => prev.map((p) => p.matchId === matchId ? { ...p, locked: true } : p))
  }

  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">
        <span>Pancho Web</span>
        <ChevronRight className="size-3" />
        <span className="text-primary">Predicciones</span>
      </div>

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Tu mesa de análisis</p>
          <h1 className="mt-1 text-3xl font-bold">Predicciones</h1>
          <p className="mt-2 text-sm text-muted-foreground">Predice los resultados y sube en el ranking de la comunidad.</p>
        </div>
        <div className="flex gap-3">
          <div className="rounded-xl border border-border/70 bg-card/75 p-3 text-center">
            <p className="font-mono text-xl font-bold text-primary">12</p>
            <p className="text-[10px] text-muted-foreground">predicciones</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-card/75 p-3 text-center">
            <p className="font-mono text-xl font-bold">64%</p>
            <p className="text-[10px] text-muted-foreground">acierto</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-card/75 p-3 text-center">
            <p className="font-mono text-xl font-bold text-primary">840</p>
            <p className="text-[10px] text-muted-foreground">puntos</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-4">
          <Surface className="p-5">
            <SectionTitle eyebrow="Partidas abiertas" title="Haz tu predicción" />
            {upcomingMatches.map((match) => {
              const pred = predictions.find((p) => p.matchId === match.id)
              return (
                <div key={match.id} className={`mb-4 last:mb-0 rounded-xl border p-4 ${pred?.locked ? 'border-primary/30 bg-primary/5' : 'border-border/60 bg-muted/20'}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground">{match.phase} · {match.format}</span>
                    {pred?.locked && (
                      <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[9px] font-bold text-primary">
                        <Lock className="size-2.5" /> Cerrada
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <button
                      disabled={pred?.locked}
                      onClick={() => setPrediction(match.id, match.radiant.id, '2-1')}
                      className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-all ${
                        pred?.predictedWinner === match.radiant.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 hover:border-primary/40 hover:bg-muted/30'
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      <TeamMark team={match.radiant} />
                      <span className="text-xs font-semibold">{match.radiant.name}</span>
                    </button>
                    <span className="font-mono text-xs text-muted-foreground">vs</span>
                    <button
                      disabled={pred?.locked}
                      onClick={() => setPrediction(match.id, match.dire.id, '2-1')}
                      className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-all ${
                        pred?.predictedWinner === match.dire.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 hover:border-primary/40 hover:bg-muted/30'
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      <TeamMark team={match.dire} />
                      <span className="text-xs font-semibold">{match.dire.name}</span>
                    </button>
                  </div>
                  {pred && !pred.locked && (
                    <motion.button
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => lockPrediction(match.id)}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
                    >
                      <Lock className="size-3" /> Confirmar predicción
                    </motion.button>
                  )}
                </div>
              )
            })}
          </Surface>
        </div>

        <Surface className="h-fit p-5">
          <SectionTitle eyebrow="Ranking" title="Top predictores" actionHref="/leaderboard" action="Ver todo" />
          <div className="flex flex-col gap-2">
            {LEADERBOARD_PREVIEW.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${entry.isYou ? 'border border-primary/30 bg-primary/5' : 'bg-muted/20'}`}
              >
                <span className={`w-5 font-mono text-sm font-bold ${entry.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                  {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : entry.rank}
                </span>
                <div className="flex size-7 items-center justify-center rounded-full bg-secondary text-[10px] font-bold">
                  {entry.username.slice(0, 2).toUpperCase()}
                </div>
                <span className="flex-1 text-xs font-semibold">{entry.username}{entry.isYou ? ' (tú)' : ''}</span>
                <div className="text-right">
                  <p className="font-mono text-xs font-bold text-primary">{entry.points}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">{entry.accuracy}%</p>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  )
}
