'use client'

import { Surface, SectionTitle } from '@/components/shared/ui'
import { ChevronRight, Edit3, Shield, Trophy } from 'lucide-react'

const PREDICTION_HISTORY = [
  { match: 'Spirit vs Tundra — Partida 2', prediction: 'Spirit gana', result: 'correct', points: 120 },
  { match: 'Liquid vs Nigma — BO3', prediction: 'Liquid 2-1', result: 'correct', points: 150 },
  { match: 'GG vs Aurora — BO3', prediction: 'Aurora 2-0', result: 'wrong', points: -50 },
  { match: 'Spirit vs Nigma — BO3', prediction: 'Spirit 2-0', result: 'correct', points: 100 },
  { match: 'Tundra vs Liquid — BO3', prediction: 'Tundra 2-1', result: 'correct', points: 120 },
]

const BADGES = [
  { icon: '🔥', label: 'Racha de 3', desc: '3 predicciones correctas seguidas' },
  { icon: '🎯', label: 'Analista', desc: 'Primera predicción correcta' },
  { icon: '🦁', label: 'Fanático TI', desc: '10 partidas seguidas en vivo' },
]

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">
        <span>Nexus</span>
        <ChevronRight className="size-3" />
        <span className="text-primary">Perfil</span>
      </div>

      {/* Profile hero */}
      <Surface className="mb-6 p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/20 text-3xl font-black text-primary">
              AL
            </div>
            <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              5
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Alex</h1>
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-mono text-[10px] font-bold text-primary">PRO FAN</span>
              <button className="ml-auto flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground">
                <Edit3 className="size-3" /> Editar
              </button>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Fan de Dota 2 desde TI3 · Analista aficionado</p>
            <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-5">
              {[
                { label: 'Predicciones', value: '12', accent: false },
                { label: 'Acierto', value: '64%', accent: true },
                { label: 'Puntos', value: '840', accent: true },
                { label: 'Ranking', value: '#5', accent: false },
                { label: 'Racha', value: '3 🔥', accent: false },
              ].map((s) => (
                <div key={s.label} className="rounded-lg bg-muted/30 p-3 text-center">
                  <p className={`font-mono text-xl font-bold ${s.accent ? 'text-primary' : ''}`}>{s.value}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Surface>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Prediction history */}
        <Surface className="p-5">
          <SectionTitle eyebrow="Historial" title="Mis predicciones" />
          <div className="flex flex-col gap-2">
            {PREDICTION_HISTORY.map((p, i) => (
              <div key={i} className={`flex items-center gap-3 rounded-lg border px-3 py-3 ${
                p.result === 'correct' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-destructive/20 bg-destructive/5'
              }`}>
                <span className={`flex size-6 items-center justify-center rounded-full text-[11px] font-bold ${
                  p.result === 'correct' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-destructive/20 text-destructive'
                }`}>
                  {p.result === 'correct' ? '✓' : '✗'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-semibold">{p.match}</p>
                  <p className="text-[11px] text-muted-foreground">{p.prediction}</p>
                </div>
                <span className={`font-mono text-sm font-bold ${p.points > 0 ? 'text-emerald-400' : 'text-destructive'}`}>
                  {p.points > 0 ? '+' : ''}{p.points}
                </span>
              </div>
            ))}
          </div>
        </Surface>

        {/* Badges */}
        <div className="flex flex-col gap-4">
          <Surface className="p-5">
            <SectionTitle eyebrow="Logros" title="Insignias" />
            <div className="flex flex-col gap-3">
              {BADGES.map((b) => (
                <div key={b.label} className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-3">
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <p className="text-xs font-semibold">{b.label}</p>
                    <p className="text-[10px] text-muted-foreground">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Surface>
          <Surface className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="size-4 text-primary" />
              <span>Cuenta verificada · datos mock</span>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  )
}
