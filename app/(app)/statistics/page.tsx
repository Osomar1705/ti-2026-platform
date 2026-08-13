'use client'

import { teams } from '@/lib/mock/teams'
import { heroes } from '@/lib/mock/heroes'
import { Surface, SectionTitle, TeamMark } from '@/components/shared/ui'
import { ChevronRight } from 'lucide-react'

export default function StatisticsPage() {
  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#8A7A5A]">
        <span>Pancho Web</span>
        <ChevronRight className="size-3" />
        <span className="text-[#D4AF37]">Estadísticas</span>
      </div>

      <div className="mb-8">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Análisis del torneo</p>
        <h1 className="mt-1 text-3xl font-bold text-[#F5F1E8]">Estadísticas TI 2026</h1>
        <p className="mt-2 text-sm text-[#8A7A5A]">Las estadísticas se actualizarán automáticamente cuando comiencen las partidas.</p>
      </div>

      {/* No data state — team stats */}
      <Surface className="mb-6 p-5">
        <SectionTitle eyebrow="Clasificación" title="Rendimiento por equipo" />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-[rgba(212,175,55,0.1)]">
                {['#', 'Equipo', 'V', 'D', 'Win%', 'Duración', 'Gold Diff', 'FB%'].map((h) => (
                  <th key={h} className="px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8A7A5A]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teams.map((team, i) => (
                <tr key={team.id} className="border-b border-[rgba(212,175,55,0.06)] hover:bg-[rgba(212,175,55,0.03)]">
                  <td className="px-3 py-2 font-mono text-xs text-[#8A7A5A]">{i + 1}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <TeamMark team={team} small />
                      <span className="text-sm font-semibold text-[#F5F1E8]">{team.name}</span>
                    </div>
                  </td>
                  {['—', '—', '—%', '—', '—', '—%'].map((val, j) => (
                    <td key={j} className="px-3 py-2 font-mono text-xs text-[#4A3F2F]">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-lg border border-[rgba(212,175,55,0.1)] bg-[rgba(212,175,55,0.03)] px-4 py-3 text-center">
          <p className="text-xs text-[#8A7A5A]">
            Las estadísticas se actualizarán durante la Fase de Grupos · 13–16 agosto 2026
          </p>
        </div>
      </Surface>

      {/* Hero pool — no stats yet */}
      <Surface className="p-5">
        <SectionTitle eyebrow="Meta del torneo" title="Pool de héroes" />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[580px] text-left">
            <thead>
              <tr className="border-b border-[rgba(212,175,55,0.1)]">
                {['Héroe', 'Atributo', 'Picks', 'Bans', 'Picks+Bans', 'Win%'].map((h) => (
                  <th key={h} className="px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8A7A5A]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heroes.slice(0, 12).map((hero) => (
                <tr key={hero.id} className="border-b border-[rgba(212,175,55,0.06)] hover:bg-[rgba(212,175,55,0.03)]">
                  <td className="px-3 py-2 text-sm font-semibold text-[#F5F1E8]">{hero.name}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                      hero.attribute === 'str' ? 'bg-red-500/20 text-red-400' :
                      hero.attribute === 'agi' ? 'bg-emerald-500/20 text-emerald-400' :
                      hero.attribute === 'int' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {hero.attribute}
                    </span>
                  </td>
                  {['—', '—', '—', '—%'].map((val, j) => (
                    <td key={j} className="px-3 py-2 font-mono text-xs text-[#4A3F2F]">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-lg border border-[rgba(212,175,55,0.1)] bg-[rgba(212,175,55,0.03)] px-4 py-3 text-center">
          <p className="text-xs text-[#8A7A5A]">
            Picks, bans y win rates se actualizarán cuando comiencen las partidas de TI 2026.
          </p>
        </div>
      </Surface>
    </div>
  )
}
