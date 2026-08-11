'use client'

import { useEffect, useState } from 'react'

export function LoadingScreen() {
  const [phase, setPhase] = useState<'loading' | 'done'>('loading')
  const [text, setText] = useState('INICIANDO TI 2026...')

  useEffect(() => {
    const shown = sessionStorage.getItem('ti-loaded')
    if (shown) {
      setPhase('done')
      return
    }

    const t1 = setTimeout(() => setText('CARGANDO DATOS EN VIVO...'), 600)
    const t2 = setTimeout(() => {
      setPhase('done')
      sessionStorage.setItem('ti-loaded', '1')
    }, 1400)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: '#050505' }}
    >
      {/* Shimmer line */}
      <div
        className="mb-8 h-px w-48"
        style={{
          background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
          backgroundSize: '200% 100%',
          animation: 'ti-shimmer 1.5s ease-in-out infinite',
        }}
      />

      {/* Title */}
      <div className="text-center">
        <p
          className="font-cinzel text-sm font-bold uppercase tracking-[0.4em]"
          style={{ color: '#8A6418' }}
        >
          THE INTERNATIONAL
        </p>
        <p
          className="font-cinzel text-6xl font-black"
          style={{
            color: '#D4AF37',
            textShadow: '0 0 40px #D4AF3760, 0 0 80px #D4AF3730',
          }}
        >
          2026
        </p>
        <p
          className="mt-3 font-mono text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: '#6B5E4E' }}
        >
          PANCHO WEB
        </p>
      </div>

      {/* Shimmer line bottom */}
      <div
        className="mt-8 h-px w-48"
        style={{
          background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
          backgroundSize: '200% 100%',
          animation: 'ti-shimmer 1.5s ease-in-out infinite',
        }}
      />

      {/* Status text */}
      <p
        className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] transition-all duration-300"
        style={{ color: '#4A3710' }}
      >
        {text}
      </p>
    </div>
  )
}
