'use client'

import { useState, useMemo } from 'react'
import { teams } from '@/lib/mock/teams'
import { simulateSeries, simulateTournament } from '@/lib/services/simulation'
import { Surface, SectionTitle, TeamMark } from '@/components/shared/ui'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, RotateCcw, Target, Zap } from 'lucide-react'
import type { Team } from '@/lib/types'

type SimResult = { pctA: number; pctB: number; predictedResult: string; duration: string; mvp: string }
type TournResult = Record<string, { champion: number; top3: number; topHalf: number }>

export default function SimulatorPage() {
  const [teamA, setTeamA] = useState<Team>(teams[0])
  const [teamB, setTeamB] = useState<Team>(teams[1])
  const [bestOf, setBestOf] = useState(3)
  const [result, setResult] = useState<SimResult | null>(null)
  const [history, setHistory] = useState<Array<{ teamA: Team; teamB: Team; bestOf: number; result: SimResult }>>([])
  const [tournResult, setTournResult] = useState<TournResult | null>(null)
  const [simulating, setSimulating] = useState(false)

  function simulate() {
    const r = simulateSeries(teamA, teamB, bestOf)
    setResult(r)
    setHistory((h) => [{ teamA, teamB, bestOf, result: r }, ...h].slice(0, 5))
  }

  function simulateTournamentAll() {
    setSimulating(true)
    setTimeout(() => {
      setTournResult(simulateTournament(teams, 1000))
      setSimulating(false)
    }, 200)
  }

  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">
        <span>Nexus</span>
        <ChevronRight className="size-3" />
        <span className="text-primary">Simulador</span>
      </div>

      <div className="mb-8">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Motor predictivo</p>
        <h1 className="mt-1 text-3xl font-bold">Simulador TI 2026</h1>
        <p className="mt-2 text-sm text-muted-foreground">Explora escenarios con datos estructurados. Usa el motor de simulación basado en seeds y ratings para predecir resultados.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Match simulator */}
        <Surface className="p-5">
          <SectionTitle eyebrow="Head to head" title="Simulador de partida" />

          <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">Equipo A</label>
              <select
                value={teamA.id}
                onChange={(e) => setTeamA(teams.find((t) => t.id === e.target.value) ?? teams[0])}
                className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm outline-none focus:border-primary/60"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <div className="mt-3 flex items-center gap-2">
                <TeamMark team={teamA} />
                <div>
                  <p className="text-xs font-semibold">{teamA.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">Seed #{teamA.seed} · {teamA.region}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <p className="font-mono text-xs font-bold text-muted-foreground">VS</p>
              <div className="flex gap-1">
                {[1, 3, 5].map((bo) => (
                  <button
                    key={bo}
                    onClick={() => setBestOf(bo)}
                    className={`rounded px-2 py-1 font-mono text-[10px] font-bold transition-colors ${
                      bestOf === bo ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'
                    }`}
                  >
                    BO{bo}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">Equipo B</label>
              <select
                value={teamB.id}
                onChange={(e) => setTeamB(teams.find((t) => t.id === e.target.value) ?? teams[1])}
                className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm outline-none focus:border-primary/60"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <div className="mt-3 flex items-center gap-2">
                <TeamMark team={teamB} />
                <div>
                  <p className="text-xs font-semibold">{teamB.name}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">Seed #{teamB.seed} · {teamB.region}</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={simulate}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-all hover:scale-[1.01] hover:opacity-90"
          >
            <Zap className="size-4" /> Simular partida
          </button>

          <AnimatePresence>
            {result && (
              <motion.div
                key={`${teamA.id}-${teamB.id}-${bestOf}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl border border-primary/25 bg-primary/5 p-4"
              >
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="font-mono text-3xl font-black text-primary">{result.pctA}%</p>
                    <p className="mt-1 text-xs font-semibold">{teamA.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">probabilidad de victoria</p>
                  </div>
                  <div>
                    <p className="font-mono text-3xl font-black">{result.pctB}%</p>
                    <p className="mt-1 text-xs font-semibold">{teamB.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">probabilidad de victoria</p>
                  </div>
                </div>
                <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="bg-primary" style={{ width: `${result.pctA}%` }} />
                </div>
                <div className="mt-4 border-t border-border/50 pt-3 text-center">
                  <p className="text-sm font-bold">{result.predictedResult}</p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    Duración estimada: {result.duration} · MVP predicho: {result.mvp}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Surface>

        {/* History */}
        <div className="flex flex-col gap-4">
          {history.length > 0 && (
            <Surface className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold">Historial de simulaciones</p>
                <button onClick={() => setHistory([])} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground">
                  <RotateCcw className="size-3" /> Limpiar
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
                    <TeamMark team={h.teamA} small />
                    <div className="flex-1 text-xs">
                      <span className="font-semibold">{h.teamA.short}</span>
                      <span className="mx-1 text-muted-foreground">vs</span>
                      <span className="font-semibold">{h.teamB.short}</span>
                      <span className="ml-2 font-mono text-[10px] text-muted-foreground">BO{h.bestOf}</span>
                    </div>
                    <div className="font-mono text-[11px]">
                      <span className="text-primary">{h.result.pctA}%</span>
                      <span className="mx-1 text-muted-foreground">—</span>
                      <span>{h.result.pctB}%</span>
                    </div>
                    <TeamMark team={h.teamB} small />
                  </div>
                ))}
              </div>
            </Surface>
          )}

          {/* Tournament simulator */}
          <Surface className="p-5">
            <SectionTitle eyebrow="Torneo completo" title="Probabilidades de campeonato" />
            <p className="mb-4 text-xs text-muted-foreground">Ejecuta 1000 simulaciones del torneo para obtener probabilidades estadísticas de cada equipo.</p>
            <button
              onClick={simulateTournamentAll}
              disabled={simulating}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20 disabled:opacity-50"
            >
              <Target className="size-4" />
              {simulating ? 'Simulando 1000 torneos...' : 'Simular torneo completo'}
            </button>

            <AnimatePresence>
              {tournResult && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex flex-col gap-2">
                  {teams
                    .slice()
                    .sort((a, b) => (tournResult[b.id]?.champion ?? 0) - (tournResult[a.id]?.champion ?? 0))
                    .map((team) => {
                      const r = tournResult[team.id]
                      if (!r) return null
                      return (
                        <div key={team.id} className="flex items-center gap-3 rounded-lg bg-muted/20 px-3 py-2">
                          <TeamMark team={team} small />
                          <span className="flex-1 text-xs font-semibold">{team.name}</span>
                          <div className="flex gap-3 font-mono text-[10px]">
                            <span className="text-primary font-bold">{r.champion}% 🏆</span>
                            <span className="text-muted-foreground">Top3: {r.top3}%</span>
                          </div>
                        </div>
                      )
                    })}
                </motion.div>
              )}
            </AnimatePresence>
          </Surface>
        </div>
      </div>
    </div>
  )
}
