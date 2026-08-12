'use client'

import { bracketColumns } from '@/lib/mock'
import { Surface, SectionTitle, TeamMark } from '@/components/shared/ui'
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
          ? 'border-primary/50 bg-primary/5'
          : isFinished
          ? 'border-border/60 bg-muted/15'
          : 'border-border/40 bg-muted/10'
      }`}
    >
      {isLive && (
        <div className="mb-2 flex items-center gap-1 font-mono text-[9px] font-bold uppercase text-primary">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          En vivo
        </div>
      )}
      <div className="flex items-center justify-between gap-2">
        {slot.teamA ? (
          <>
            <div className="flex items-center gap-1.5 min-w-0">
              <TeamMark team={slot.teamA} small />
              <span className="truncate text-[11px] font-semibold">{slot.teamA.short}</span>
            </div>
            <span className={`font-mono text-sm font-bold ${isFinished && slot.scoreA > slot.scoreB ? 'text-primary' : ''}`}>
              {slot.scoreA}
            </span>
          </>
        ) : (
          <span className="text-[11px] text-muted-foreground italic">TBD</span>
        )}
      </div>
      <div className="my-1.5 h-px bg-border/50" />
      <div className="flex items-center justify-between gap-2">
        {slot.teamB ? (
          <>
            <div className="flex items-center gap-1.5 min-w-0">
              <TeamMark team={slot.teamB} small />
              <span className="truncate text-[11px] font-semibold">{slot.teamB.short}</span>
            </div>
            <span className={`font-mono text-sm font-bold ${isFinished && slot.scoreB > slot.scoreA ? 'text-primary' : ''}`}>
              {slot.scoreB}
            </span>
          </>
        ) : (
          <span className="text-[11px] text-muted-foreground italic">TBD</span>
        )}
      </div>
      <div className="mt-2 text-[9px] font-mono text-muted-foreground">{slot.format}</div>
    </div>
  )

  if (slot.matchId) {
    return <Link href={`/matches/${slot.matchId}`}>{card}</Link>
  }
  return card
}

export default function BracketPage() {
  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-muted-foreground">
        <span>Pancho Web</span>
        <ChevronRight className="size-3" />
        <span className="text-primary">TI 2026</span>
      </div>

      <div className="mb-8">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">The International 2026</p>
        <h1 className="mt-1 text-3xl font-bold">Bracket de playoffs</h1>
        <p className="mt-2 text-sm text-muted-foreground">Riad, Arabia Saudita · Día 12 de 18</p>
      </div>

      <Surface className="p-6">
        <div className="overflow-x-auto">
          <div className="flex gap-8 min-w-[700px] pb-4">
            {bracketColumns.map((col) => (
              <div key={col.phase} className="flex-1 min-w-[160px]">
                <p className="mb-4 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
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
      </Surface>

      {/* Legend */}
      <div className="mt-4 flex gap-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2 animate-pulse rounded-full bg-primary" />
          En vivo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500" />
          Finalizado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-muted-foreground" />
          Por jugar
        </span>
      </div>
    </div>
  )
}
