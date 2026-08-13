'use client'

import { motion } from 'framer-motion'

interface Props {
  radiantPct: number
  direPct: number
  radiantLabel?: string
  direLabel?: string
  radiantColor?: string
  direColor?: string
}

export function WinProbabilityBar({
  radiantPct,
  direPct,
  radiantLabel = 'Radiant',
  direLabel = 'Dire',
  radiantColor = '#D4AF37',
  direColor = '#6f7890',
}: Props) {
  const radiantWinning = radiantPct >= direPct

  return (
    <div className="rounded-lg bg-[rgba(212,175,55,0.04)] border border-[rgba(212,175,55,0.10)] p-3">
      <div className="mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider">
        <span className="text-[#8A7A5A]">Probabilidad de victoria</span>
        <span className="font-mono text-[#8A7A5A]">Tiempo real</span>
      </div>
      <div className="relative flex h-3 overflow-hidden rounded-full bg-[#141008]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${radiantPct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            background: radiantWinning
              ? `linear-gradient(90deg, ${radiantColor}, ${radiantColor}CC)`
              : radiantColor,
            boxShadow: radiantWinning ? `0 0 8px ${radiantColor}50` : undefined,
          }}
        />
        <motion.div
          initial={{ flex: 0 }}
          animate={{ flex: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            background: !radiantWinning
              ? `linear-gradient(90deg, ${direColor}CC, ${direColor})`
              : direColor,
            boxShadow: !radiantWinning ? `0 0 8px ${direColor}50` : undefined,
          }}
        />
      </div>
      <div className="mt-2 flex justify-between font-mono text-xs">
        <span
          style={{ color: radiantColor }}
          className={radiantWinning ? 'font-bold' : 'opacity-70'}
        >
          {radiantLabel} {radiantPct}%
        </span>
        <span
          style={{ color: direColor }}
          className={!radiantWinning ? 'font-bold' : 'opacity-70'}
        >
          {direLabel} {direPct}%
        </span>
      </div>
    </div>
  )
}
