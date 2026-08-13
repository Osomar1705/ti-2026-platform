'use client'

import { bracketColumns, lowerBracketColumns } from '@/lib/mock/bracket'
import { Surface, SectionTitle } from '@/components/shared/ui'
import type { BracketSlot } from '@/lib/types'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

function SlotCard({ slot }: { slot: BracketSlot }) {
  const isLive = slot.status === 'live'
  const isFinished = slot.status === 'finished'

  const card = (
    <div
      className={`rounded-lg border p-3 transition-colors ${
        isLive
          ? 'border-[rgba(212,175,55,0.4)] bg-[rgba(212,175,55,0.06)]'
          : isFinished
          ? 'border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.03)]'
          : 'border-[rgba(212,175,55,0.08)] bg-[rgba(212,175,55,0.02)]'
      }`}
    >
      {isLive && (
        <div className="mb-2 flex items-center gap-1 font-mono text-[9px] font-bold uppercase text-[#D4AF37]">
          <span className="size-1.5 animate-pulse rounded-full bg-[#D4AF37]" />
          En vivo
        </div>
      )}

      {/* Team A */}
      <div className="flex items-center justify-between gap-2">
        {slot.teamA ? (
          <>
            <span className="truncate text-[11px] font-semibold text-[#F5F1E8]">{slot.teamA.short}</span>
            <span className={`font-mono text-sm font-bold tabular-nums ${isFinished && slot.scoreA > slot.scoreB ? 'text-[#D4AF37]' : 'text-[#8A7A5A]'}`}>
              {slot.scoreA}
            </span>
          </>
        ) : (
          <span className="text-[11px] text-[#4A3F2F] italic">TBD</span>
        )}
      </div>

      <div className="my-1.5 h-px bg-[rgba(212,175,55,0.08)]" />

      {/* Team B */}
      <div className="flex items-center justify-between gap-2">
        {slot.teamB ? (
          <>
            <span className="truncate text-[11px] font-semibold text-[#F5F1E8]">{slot.teamB.short}</span>
            <span className={`font-mono text-sm font-bold tabular-nums ${isFinished && slot.scoreB > slot.scoreA ? 'text-[#D4AF37]' : 'text-[#8A7A5A]'}`}>
              {slot.scoreB}
            </span>
          </>
        ) : (
          <span className="text-[11px] text-[#4A3F2F] italic">TBD</span>
        )}
      </div>

      <div className="mt-2 font-mono text-[9px] text-[#4A3F2F]">{slot.format}</div>
    </div>
  )

  if (slot.matchId) {
    return <Link href={`/matches/${slot.matchId}`}>{card}</Link>
  }
  return card
}

function BracketSection({ title, columns }: { title: string; columns: { phase: string; slots: BracketSlot[] }[] }) {
  return (
    <div className="overflow-x-auto">
      <div className="mb-3 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#8A7A5A]">{title}</div>
      <div className="flex gap-6 pb-4" style={{ minWidth: columns.length * 180 }}>
        {columns.map((col) => (
          <div key={col.phase} className="flex-1 min-w-[160px]">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-widest text-[#4A3F2F]">
              {col.phase}
            </p>
            <div className="flex flex-col gap-3">
              {col.slots.map((slot) => (
                <SlotCard key={slot.id} slot={slot} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BracketPage() {
  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#8A7A5A]">
        <span>Pancho Web</span>
        <ChevronRight className="size-3" />
        <span className="text-[#D4AF37]">TI 2026</span>
      </div>

      <div className="mb-8">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">The International 2026</p>
        <h1 className="mt-1 text-3xl font-bold text-[#F5F1E8]">Bracket de playoffs</h1>
        <p className="mt-2 text-sm text-[#8A7A5A]">Riad, Arabia Saudita · El bracket se define tras la Fase de Grupos (13–16 agosto)</p>
      </div>

      {/* Pre-tournament notice */}
      <div className="mb-6 rounded-xl border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.04)] px-5 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] mb-1">FASE DE GRUPOS PRIMERO</p>
        <p className="text-sm text-[#8A7A5A]">
          Los equipos del bracket de playoffs se determinarán al finalizar la Fase de Grupos.
          Las posiciones se actualizarán automáticamente cuando haya resultados reales.
        </p>
      </div>

      {/* Upper Bracket */}
      <Surface className="mb-5 p-6">
        <SectionTitle eyebrow="Upper bracket" title="Bracket superior" />
        <BracketSection title="Upper Bracket" columns={bracketColumns} />
      </Surface>

      {/* Lower Bracket */}
      <Surface className="p-6">
        <SectionTitle eyebrow="Lower bracket" title="Bracket inferior" />
        <BracketSection title="Lower Bracket" columns={lowerBracketColumns} />
      </Surface>

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-[10px] text-[#8A7A5A]">
        <span className="flex items-center gap-1.5">
          <span className="size-2 animate-pulse rounded-full bg-[#D4AF37]" />
          En vivo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500" />
          Finalizado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#4A3F2F]" />
          Por definir
        </span>
      </div>
    </div>
  )
}
