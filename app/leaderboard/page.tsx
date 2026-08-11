'use client'

import { Surface, SectionTitle } from '@/components/shared/ui'
import { ChevronRight, Trophy } from 'lucide-react'

const LEADERBOARD = [
  { rank: 1, username: 'draftsmith', points: 1420, accuracy: 78, correct: 18, total: 23, country: '🇺🇸' },
  { rank: 2, username: 'ti_stats_bot', points: 1280, accuracy: 72, correct: 15, total: 20, country: '🇧🇷' },
  { rank: 3, username: 'roshanwatch', points: 1190, accuracy: 68, correct: 14, total: 21, country: '🇩🇪' },
  { rank: 4, username: 'analystvip', points: 1050, accuracy: 65, correct: 13, total: 20, country: '🇦🇷' },
  { rank: 5, username: 'Alex', points: 840, accuracy: 64, correct: 8, total: 12, country: '🇲🇽', isYou: true },
  { rank: 6, username: 'heros_fan', points: 780, accuracy: 61, correct: 11, total: 18, country: '🇵🇱' },
  { rank: 7, username: 'midlaner99', points: 720, accuracy: 58, correct: 10, total: 17, country: '🇨🇳' },
  { rank: 8, username: 'carrytheflag', points: 680, accuracy: 55, correct: 9, total: 16, country: '🇷🇺' },
  { rank: 9, username: 'pushking', points: 610, accuracy: 52, correct: 8, total: 15, country: '🇸🇪' },
  { rank: 10, username: 'bracket_watcher', points: 540, accuracy: 50, correct: 7, total: 14, country: '🇰🇷' },
]

const medals = ['🥇', '🥈', '🥉']

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">
        <span>Nexus</span>
        <ChevronRight className="size-3" />
        <span className="text-primary">Leaderboard</span>
      </div>

      <div className="mb-8">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Ranking global</p>
        <h1 className="mt-1 text-3xl font-bold">Tabla de líderes</h1>
        <p className="mt-2 text-sm text-muted-foreground">Los mejores predictores del TI 2026 · Actualizado en tiempo real</p>
      </div>

      {/* Top 3 podium */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((user, i) => {
          const positions = [2, 1, 3]
          const pos = positions[i]
          return (
            <div
              key={user.username}
              className={`flex flex-col items-center rounded-xl border p-5 text-center ${
                pos === 1 ? 'border-primary/40 bg-primary/5' : 'border-border/60 bg-muted/20'
              }`}
            >
              <span className="text-3xl">{medals[pos - 1]}</span>
              <div className={`mt-3 flex size-12 items-center justify-center rounded-full text-sm font-bold ${pos === 1 ? 'bg-primary/20 text-primary' : 'bg-secondary'}`}>
                {user.username.slice(0, 2).toUpperCase()}
              </div>
              <p className="mt-2 text-sm font-bold">{user.username}</p>
              <p className="font-mono text-[10px] text-muted-foreground">{user.country}</p>
              <p className={`mt-2 font-mono text-xl font-black ${pos === 1 ? 'text-primary' : ''}`}>{user.points}</p>
              <p className="font-mono text-[10px] text-muted-foreground">{user.accuracy}% acierto</p>
            </div>
          )
        })}
      </div>

      {/* Full table */}
      <Surface className="p-5">
        <SectionTitle eyebrow="Clasificación completa" title="Top 10 predictores" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-border/60">
                {['#', 'Usuario', 'País', 'Correctas', 'Total', 'Acierto', 'Puntos'].map((h) => (
                  <th key={h} className="px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map((user) => (
                <tr
                  key={user.rank}
                  className={`border-b border-border/40 ${(user as any).isYou ? 'bg-primary/5' : 'hover:bg-muted/20'}`}
                >
                  <td className="px-3 py-3 font-mono text-sm font-bold">
                    {user.rank <= 3 ? medals[user.rank - 1] : user.rank}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`flex size-7 items-center justify-center rounded-full text-[10px] font-bold ${(user as any).isYou ? 'bg-primary/20 text-primary' : 'bg-secondary'}`}>
                        {user.username.slice(0, 2).toUpperCase()}
                      </div>
                      <span className={`text-sm font-semibold ${(user as any).isYou ? 'text-primary' : ''}`}>
                        {user.username}{(user as any).isYou ? ' (tú)' : ''}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm">{user.country}</td>
                  <td className="px-3 py-3 font-mono text-sm text-emerald-400">{user.correct}</td>
                  <td className="px-3 py-3 font-mono text-sm text-muted-foreground">{user.total}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-primary" style={{ width: `${user.accuracy}%` }} />
                      </div>
                      <span className="font-mono text-xs">{user.accuracy}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-mono text-sm font-bold text-primary">{user.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>
    </div>
  )
}
