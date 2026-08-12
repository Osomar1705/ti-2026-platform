'use client'

import { useEffect, useState } from 'react'
import { Surface, SectionTitle } from '@/components/shared/ui'
import { useUser } from '@/lib/hooks/useUser'
import { ChevronRight, Trophy } from 'lucide-react'

interface LeaderEntry {
  rank: number
  id: string
  username: string
  name: string
  country: string
  points: number
  correct: number
  total: number
  accuracy: number
  streak: number
}

const medals = ['🥇', '🥈', '🥉']

export default function LeaderboardPage() {
  const { user } = useUser()
  const [board, setBoard] = useState<LeaderEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/leaderboard')
      .then(r => r.json())
      .then(d => { setBoard(d.users ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const top3 = board.slice(0, 3)
  const podiumOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3
  const podiumPositions = [2, 1, 3]

  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">
        <span>Pancho Web</span>
        <ChevronRight className="size-3" />
        <span className="text-primary">Leaderboard</span>
      </div>

      <div className="mb-8">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Ranking global</p>
        <h1 className="mt-1 text-3xl font-bold">Tabla de líderes</h1>
        <p className="mt-2 text-sm text-muted-foreground">Los mejores predictores del TI 2026 · Actualizado en tiempo real</p>
      </div>

      {!loading && board.length === 0 ? (
        <Surface className="flex flex-col items-center justify-center py-20 text-center">
          <Trophy className="size-12 text-primary/30" />
          <p className="mt-4 text-lg font-bold">Aún no hay predicciones</p>
          <p className="mt-2 text-sm text-muted-foreground">Sé el primero en aparecer en el ranking cuando el torneo comience</p>
        </Surface>
      ) : (
        <>
          {/* Podium top 3 */}
          {top3.length >= 3 && (
            <div className="mb-8 grid grid-cols-3 gap-4">
              {podiumOrder.map((entry, i) => {
                const pos = podiumPositions[i]
                const isYou = user?.id === entry.id
                return (
                  <div
                    key={entry.id}
                    className={`flex flex-col items-center rounded-xl border p-5 text-center ${
                      pos === 1 ? 'border-primary/40 bg-primary/5' : 'border-border/60 bg-muted/20'
                    } ${isYou ? 'ring-1 ring-primary/40' : ''}`}
                  >
                    <span className="text-3xl">{medals[pos - 1]}</span>
                    <div className={`mt-3 flex size-12 items-center justify-center rounded-full text-sm font-bold ${pos === 1 ? 'bg-primary/20 text-primary' : 'bg-secondary'}`}>
                      {entry.username.slice(0, 2).toUpperCase()}
                    </div>
                    <p className="mt-2 text-sm font-bold">{entry.username}{isYou ? ' (tú)' : ''}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{entry.country || '🌍'}</p>
                    <p className={`mt-2 font-mono text-xl font-black ${pos === 1 ? 'text-primary' : ''}`}>{entry.points}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{entry.accuracy}% acierto</p>
                  </div>
                )
              })}
            </div>
          )}

          {/* Full table */}
          <Surface className="p-5">
            <SectionTitle eyebrow="Clasificación completa" title={`Top ${board.length} predictores`} />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-b border-border/60">
                    {['#', 'Usuario', 'País', 'Correctas', 'Total', 'Acierto', 'Puntos'].map(h => (
                      <th key={h} className="px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {board.map(entry => {
                    const isYou = user?.id === entry.id
                    return (
                      <tr key={entry.id} className={`border-b border-border/40 ${isYou ? 'bg-primary/5' : 'hover:bg-muted/20'}`}>
                        <td className="px-3 py-3 font-mono text-sm font-bold">
                          {entry.rank <= 3 ? medals[entry.rank - 1] : entry.rank}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`flex size-7 items-center justify-center rounded-full text-[10px] font-bold ${isYou ? 'bg-primary/20 text-primary' : 'bg-secondary'}`}>
                              {entry.username.slice(0, 2).toUpperCase()}
                            </div>
                            <span className={`text-sm font-semibold ${isYou ? 'text-primary' : ''}`}>
                              {entry.username}{isYou ? ' (tú)' : ''}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-sm">{entry.country || '—'}</td>
                        <td className="px-3 py-3 font-mono text-sm text-emerald-400">{entry.correct}</td>
                        <td className="px-3 py-3 font-mono text-sm text-muted-foreground">{entry.total}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                              <div className="h-full bg-primary" style={{ width: `${entry.accuracy}%` }} />
                            </div>
                            <span className="font-mono text-xs">{entry.accuracy}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 font-mono text-sm font-bold text-primary">{entry.points}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Surface>
        </>
      )}
    </div>
  )
}
