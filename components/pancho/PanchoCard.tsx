import type { PanchoRecommendation } from '@/lib/types'
import { AlertTriangle, Eye, Info } from 'lucide-react'

export function PanchoCard({ recommendation, rec }: { recommendation?: PanchoRecommendation; rec?: PanchoRecommendation }) {
  const data = recommendation ?? rec!

  return (
    <div className="relative rounded-xl overflow-hidden gold-top-border border border-[rgba(212,175,55,0.18)] transition-all duration-200 hover:border-[rgba(212,175,55,0.35)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_0_1px_rgba(212,175,55,0.1)]"
      style={{
        background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 60%, #0D0B08 100%)',
      }}
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-8 rounded-full bg-gradient-to-b from-[#D4AF37] to-[rgba(212,175,55,0.2)]" />
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                ANALISTA PANCHO · {data.tag}
              </p>
              <p className="text-sm font-bold leading-tight text-[#F5F1E8]">{data.title}</p>
            </div>
          </div>
          {data.upsetAlert && (
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-[rgba(192,57,43,0.12)] border border-[rgba(192,57,43,0.25)] px-2 py-0.5 font-mono text-[9px] font-bold text-[#C0392B]">
              <AlertTriangle className="size-2.5" /> UPSET
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-[rgba(212,175,55,0.2)] to-transparent" />

      {/* Body */}
      <div className="p-4 pt-3">
        <p className="text-xs leading-5 text-[#8A7A5A]">{data.body}</p>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          {data.winPct !== undefined && (
            <div className="flex-1 min-w-[140px]">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[9px] text-[#8A7A5A] uppercase tracking-widest">Prob. victoria</span>
                <span className="font-mono text-[11px] font-bold text-[#D4AF37]">{data.winPct}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#141008]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${data.winPct}%`,
                    background: 'linear-gradient(90deg, #8A6418, #D4AF37, #FFD76A)',
                    boxShadow: '0 0 6px rgba(212,175,55,0.4)',
                  }}
                />
              </div>
            </div>
          )}
          {data.heroToWatch && (
            <span className="flex items-center gap-1 rounded-full border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.05)] px-2.5 py-0.5 text-[10px] text-[#D4AF37]">
              <Eye className="size-2.5" /> {data.heroToWatch}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-[#8A7A5A]">
          <Info className="size-3 text-[#D4AF37]" />
          <span>Análisis PANCHO INTELLIGENCE · datos mock</span>
        </div>
      </div>
    </div>
  )
}
