'use client'

import { Surface, SectionTitle } from '@/components/shared/ui'
import { ChevronRight, Radio } from 'lucide-react'
import Link from 'next/link'
import LiveStreamPlayer from '@/components/simulator/LiveStreamPlayer'

const tournamentStreams = {
  twitch: 'dota2ti',
  youtube: 'nU5mLup2s7Q',
  kick: 'dotati'
}

export default function LivePage() {
  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#8A7A5A]">
        <span>Pancho Web</span>
        <ChevronRight className="size-3" />
        <span className="text-[#D4AF37]">En vivo</span>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2 rounded-full border border-[rgba(138,122,90,0.3)] bg-[rgba(138,122,90,0.06)] px-3 py-1">
            <span className="size-1.5 rounded-full bg-[#8A7A5A]" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8A7A5A]">SIN PARTIDA EN VIVO</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#F5F1E8]">Centro en vivo</h1>
      </div>

      {/* Stream player */}
      <div className="mb-6 w-full">
        <LiveStreamPlayer streamUrls={tournamentStreams} />
      </div>

      {/* No live match */}
      <Surface className="mb-6 p-10 gold-top-border">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-full border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.05)]">
            <Radio className="size-6 text-[#8A7A5A]" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A7A5A] mb-2">ESTADO</p>
            <p className="text-xl font-bold text-[#F5F1E8]">No hay partidas en vivo</p>
            <p className="mt-2 text-sm text-[#8A7A5A] max-w-md">
              Cuando comience una partida de TI 2026, aparecerá aquí automáticamente
              con marcadores, estadísticas, draft y probabilidad de victoria en tiempo real.
            </p>
          </div>
          <div className="mt-2 rounded-lg border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.04)] px-5 py-3 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">TI 2026 · FASE DE GRUPOS</p>
            <p className="mt-1 text-sm text-[#F5F1E8] font-semibold">13 de agosto de 2026</p>
          </div>
        </div>
      </Surface>

      {/* What will appear here */}
      <Surface className="p-5">
        <SectionTitle eyebrow="Durante la partida" title="Lo que verás aquí en vivo" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            'Marcador en tiempo real',
            'Win Probability',
            'Picks & Bans',
            'Net Worth',
            'Bajas por minuto',
            'Estadísticas de jugadores',
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-[rgba(212,175,55,0.1)] bg-[rgba(212,175,55,0.03)] p-3 text-center"
            >
              <p className="text-[11px] text-[#8A7A5A] leading-4">{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/simulator"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:underline"
          >
            Mientras tanto, explora el simulador <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </Surface>
    </div>
  )
}
