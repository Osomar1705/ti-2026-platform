'use client'

import { useMemo } from 'react'

interface Particle {
  id: number
  size: number
  x: number
  y: number
  duration: number
  delay: number
  opacity: number
}

export function GoldenParticles({ count = 20, className = '' }: { count?: number; className?: string }) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 6,
      opacity: Math.random() * 0.5 + 0.2,
    }))
  }, [count])

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: '#D4AF37',
            opacity: p.opacity,
            animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            boxShadow: `0 0 ${p.size * 2}px rgba(212,175,55,0.6)`,
          }}
        />
      ))}
    </div>
  )
}

export function GoldenLine({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 overflow-hidden ${className}`} style={{ height: 1 }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'linear-gradient(90deg, transparent 0%, #D4AF37 30%, #FFD76A 50%, #D4AF37 70%, transparent 100%)',
          animation: 'golden-slide 4s ease-in-out 1s forwards',
        }}
      />
    </div>
  )
}
