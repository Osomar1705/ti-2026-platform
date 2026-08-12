'use client'

import { heroes } from '@/lib/mock/heroes'
import { teams } from '@/lib/mock/teams'
import { Surface, SectionTitle, TeamMark } from '@/components/shared/ui'
import { ChevronRight } from 'lucide-react'

const heroStats = heroes.map((h, i) => ({
  hero: h,
  picks: 18 - i,
  bans: 14 - (i % 7),
  wins: Math.round((18 - i) * (0.45 + (i % 5) * 0.04)),
  games: (18 - i) + (14 - (i % 7)),
})).map(s => ({
  ...s,
  pickRate: Math.round((s.picks / 80) * 100),
  banRate: Math.round((s.bans / 80) * 100),
  winRate: s.picks > 0 ? Math.round((s.wins / s.picks) * 100) : 0,
})).sort((a, b) => b.picks + b.bans - (a.picks + a.bans))

const teamStats = [
  { team: teams[0], wins: 8, losses: 2, winRate: 80, avgDuration: '34:22', goldDiff: '+4.8k', firstBlood: 70 },
  { team: teams[1], wins: 7, losses: 3, winRate: 70, avgDuration: '38:14', goldDiff: '+2.1k', firstBlood: 60 },
  { team: teams[2], wins: 6, losses: 4, winRate: 60, avgDuration: '36:48', goldDiff: '+1.4k', firstBlood: 55 },
  { team: teams[3], wins: 5, losses: 5, winRate: 50, avgDuration: '40:12', goldDiff: '-0.6k', firstBlood: 50 },
  { team: teams[4], wins: 4, losses: 6, winRate: 40, avgDuration: '37:55', goldDiff: '-1.2k', firstBlood: 45 },
  { team: teams[5], wins: 3, losses: 7, winRate: 30, avgDuration: '35:42', goldDiff: '-3.1k', firstBlood: 40 },
]

export default function StatisticsPage() {
  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">
        <span>Nexus</span>
        <ChevronRight className="size-3" />
        <span className="text-primary">Estadísticas</span>
      </div>

      <div className="mb-8">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Análisis del torneo</p>
        <h1 className="mt-1 text-3xl font-bold">Estadísticas TI 2026</h1>
        <p className="mt-2 text-sm text-muted-foreground">Datos acumulados del torneo · 80 partidas jugadas</p>
      </div>

      {/* Team stats */}
      <Surface className="mb-6 p-5">
        <SectionTitle eyebrow="Clasificación" title="Rendimiento por equipo" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-border/60">
                {['#', 'Equipo', 'V', 'D', 'Win%', 'Duración', 'Gold Diff', 'FB%'].map((h) => (
                  <th key={h} className="px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamStats.map((ts, i) => (
                <tr key={ts.team.id} className="border-b border-border/40 hover:bg-muted/20">
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <TeamMark team={ts.team} small />
                      <span className="text-sm font-semibold">{ts.team.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-emerald-400">{ts.wins}</td>
                  <td className="px-3 py-2 font-mono text-xs text-destructive">{ts.losses}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-primary" style={{ width: `${ts.winRate}%` }} />
                      </div>
                      <span className="font-mono text-xs font-bold text-primary">{ts.winRate}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{ts.avgDuration}</td>
                  <td className={`px-3 py-2 font-mono text-xs ${ts.goldDiff.startsWith('+') ? 'text-primary' : 'text-muted-foreground'}`}>{ts.goldDiff}</td>
                  <td className="px-3 py-2 font-mono text-xs">{ts.firstBlood}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>

      {/* Hero stats */}
      <Surface className="p-5">
        <SectionTitle eyebrow="Meta del torneo" title="Estadísticas de héroes" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px] text-left">
            <thead>
              <tr className="border-b border-border/60">
                {['Héroe', 'Atributo', 'Picks', 'Bans', 'Picks+Bans', 'Win%'].map((h) => (
                  <th key={h} className="px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heroStats.map((hs) => (
                <tr key={hs.hero.id} className="border-b border-border/40 hover:bg-muted/20">
                  <td className="px-3 py-2 text-sm font-semibold">{hs.hero.name}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                      hs.hero.attribute === 'str' ? 'bg-red-500/20 text-red-400' :
                      hs.hero.attribute === 'agi' ? 'bg-emerald-500/20 text-emerald-400' :
                      hs.hero.attribute === 'int' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {hs.hero.attribute}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{hs.picks}</td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{hs.bans}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-muted-foreground" style={{ width: `${Math.min((hs.picks + hs.bans) / 32 * 100, 100)}%` }} />
                      </div>
                      <span className="font-mono text-[11px]">{hs.picks + hs.bans}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`font-mono text-xs font-bold ${hs.winRate >= 60 ? 'text-primary' : hs.winRate >= 50 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {hs.winRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>
    </div>
  )
}
