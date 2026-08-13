'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  'ANALYZING DRAFT...',
  'ANALYZING PLAYERS...',
  'ANALYZING MATCHUP...',
  'RUNNING SIMULATIONS...',
  'PROCESSING RESULTS...',
]

interface Props {
  active: boolean
  onComplete: () => void
}

export function SimulationOverlay({ active, onComplete }: Props) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!active) {
      setStep(0)
      return
    }
    const total = STEPS.length
    let current = 0
    const interval = setInterval(() => {
      current++
      if (current >= total) {
        clearInterval(interval)
        setTimeout(onComplete, 300)
      } else {
        setStep(current)
      }
    }, 350)
    return () => clearInterval(interval)
  }, [active, onComplete])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl"
          style={{ background: 'rgba(5,5,5,0.92)', backdropFilter: 'blur(4px)' }}
        >
          <div className="flex size-16 items-center justify-center rounded-2xl border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.06)] mb-6">
            <span className="text-2xl font-black text-[#D4AF37]">TI</span>
          </div>
          <div className="flex flex-col gap-2 min-h-[120px] items-center">
            {STEPS.map((s, i) => (
              <motion.p
                key={s}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: i <= step ? 1 : 0.15, y: 0 }}
                className="font-mono text-[11px] uppercase tracking-[0.2em]"
                style={{ color: i === step ? '#D4AF37' : '#4A3D20' }}
              >
                {i < step ? '✓ ' : i === step ? '› ' : '  '}{s}
              </motion.p>
            ))}
          </div>
          {/* Animated progress bar */}
          <div className="mt-6 w-48 h-0.5 bg-[#1A1610] overflow-hidden rounded-full">
            <motion.div
              className="h-full"
              style={{ background: 'linear-gradient(90deg, #8A6418, #D4AF37, #FFD76A)' }}
              initial={{ width: '0%' }}
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
