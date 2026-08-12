'use client'

import { ChevronRight } from 'lucide-react'
import TournamentSim from '@/components/simulator/TournamentSim'

export default function SimulatorPage() {
  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#8A7A5A]">
        <span>Pancho Web</span>
        <ChevronRight className="size-3" />
        <span className="text-[#D4AF37]">Simulador</span>
      </div>

      <TournamentSim />
    </div>
  )
}
