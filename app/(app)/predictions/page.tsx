'use client'

import { useState, useEffect } from 'react'
import { matches } from '@/lib/mock'
import { Surface, SectionTitle, TeamMark } from '@/components/shared/ui'
import type { Prediction } from '@/lib/types'
import { ChevronRight, Lock, Target, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import { useUser } from '@/lib/hooks/useUser'
import Link from 'next/link'

export default function PredictionsPage() {
  const { user } = useUser()
  const userId = user?.username ?? 'anon'
  const [predictions, setPredictions] = useState<Prediction[]>(() => {
    if (typeof window === 'undefined') return []
    try { return JSON.parse(localStorage.getItem('predictions') || '[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('predictions', JSON.stringify(predictions))
  }, [predictions])
  const upcomingMatches = matches.filter((m) => m.status === 'upcoming')

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
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#8A7A5A]">
        <span>Pancho Web</span>
        <ChevronRight className="size-3" />
        <span className="text-[#D4AF37]">Predicciones</span>
      </div>

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Tu mesa de análisis</p>
          <h1 className="mt-1 text-3xl font-bold text-[#F5F1E8]">Predicciones</h1>
          <p className="mt-2 text-sm text-[#8A7A5A]">Predice los resultados y sube en el ranking de la comunidad.</p>
        </div>
        {user && (
          <div className="flex gap-3">
            <div className="rounded-xl border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.04)] p-3 text-center">
              <p className="font-mono text-xl font-bold text-[#D4AF37]">{user.total ?? 0}</p>
              <p className="text-[10px] text-[#8A7A5A]">predicciones</p>
            </div>
            <div className="rounded-xl border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.04)] p-3 text-center">
              <p className="font-mono text-xl font-bold text-[#F5F1E8]">
                {user.total > 0 ? Math.round((user.correct / user.total) * 100) : 0}%
              </p>
              <p className="text-[10px] text-[#8A7A5A]">acierto</p>
            </div>
            <div className="rounded-xl border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.04)] p-3 text-center">
              <p className="font-mono text-xl font-bold text-[#D4AF37]">{user.points ?? 0}</p>
              <p className="text-[10px] text-[#8A7A5A]">puntos</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Surface className="p-5">
          <SectionTitle eyebrow="Partidas abiertas" title="Haz tu predicción" />

          {upcomingMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.04)]">
                <Target className="size-5 text-[#8A7A5A]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F5F1E8]">No hay partidas disponibles aún</p>
                <p className="mt-1 text-xs text-[#8A7A5A] max-w-xs">
                  Las predicciones estarán disponibles cuando se publique el calendario de TI 2026 el 13 de agosto.
                </p>
              </div>
              <Link
                href="/simulator"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:underline"
              >
                Usar el simulador mientras tanto <ChevronRight className="size-3.5" />
              </Link>
            </div>
          ) : (
            upcomingMatches.map((match) => {
              const pred = predictions.find((p) => p.matchId === match.id)
              return (
                <div key={match.id} className={`mb-4 last:mb-0 rounded-xl border p-4 ${pred?.locked ? 'border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.05)]' : 'border-[rgba(212,175,55,0.1)] bg-[rgba(212,175,55,0.02)]'}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#8A7A5A]">{match.phase} · {match.format}</span>
                    {pred?.locked && (
                      <span className="flex items-center gap-1 rounded-full bg-[rgba(212,175,55,0.1)] px-2 py-0.5 font-mono text-[9px] font-bold text-[#D4AF37]">
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
                          ? 'border-[#D4AF37] bg-[rgba(212,175,55,0.1)]'
                          : 'border-[rgba(212,175,55,0.1)] hover:border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.04)]'
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      <TeamMark team={match.radiant} />
                      <span className="text-xs font-semibold text-[#F5F1E8]">{match.radiant.name}</span>
                    </button>
                    <span className="font-mono text-xs text-[#8A7A5A]">vs</span>
                    <button
                      disabled={pred?.locked}
                      onClick={() => setPrediction(match.id, match.dire.id, '2-1')}
                      className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-all ${
                        pred?.predictedWinner === match.dire.id
                          ? 'border-[#D4AF37] bg-[rgba(212,175,55,0.1)]'
                          : 'border-[rgba(212,175,55,0.1)] hover:border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.04)]'
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      <TeamMark team={match.dire} />
                      <span className="text-xs font-semibold text-[#F5F1E8]">{match.dire.name}</span>
                    </button>
                  </div>
                  {pred && !pred.locked && (
                    <motion.button
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => lockPrediction(match.id)}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2 text-xs font-bold text-black"
                    >
                      <Lock className="size-3" /> Confirmar predicción
                    </motion.button>
                  )}
                </div>
              )
            })
          )}
        </Surface>

        <div className="flex flex-col gap-4">
          <Surface className="h-fit p-5">
            <SectionTitle eyebrow="Ranking" title="Top predictores" actionHref="/leaderboard" action="Ver todo" />
            <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
              <Trophy className="size-8 text-[#4A3F2F]" />
              <p className="text-sm font-semibold text-[#F5F1E8]">Ranking vacío</p>
              <p className="text-xs text-[#8A7A5A]">
                El ranking se actualizará conforme los usuarios hagan predicciones durante TI 2026.
              </p>
            </div>
          </Surface>

          <Surface className="p-5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-3">¿Cómo funciona?</p>
            <ul className="flex flex-col gap-2 text-xs text-[#8A7A5A]">
              <li className="flex gap-2"><span className="text-[#D4AF37]">1.</span> Elige el ganador de cada partida.</li>
              <li className="flex gap-2"><span className="text-[#D4AF37]">2.</span> Confirma tu predicción antes de que empiece.</li>
              <li className="flex gap-2"><span className="text-[#D4AF37]">3.</span> Gana puntos por cada acierto.</li>
              <li className="flex gap-2"><span className="text-[#D4AF37]">4.</span> Sube en el ranking de la comunidad.</li>
            </ul>
          </Surface>
        </div>
      </div>
    </div>
  )
}
