'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import type { LiveApiResponse } from '@/lib/live/types'

const DEFAULT_INTERVAL = 30_000

export function useLiveMatches(intervalMs = DEFAULT_INTERVAL) {
  const [data, setData]       = useState<LiveApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const mountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/live', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json: LiveApiResponse = await res.json()
      if (!mountedRef.current) return
      setData(json)
      setLastUpdated(new Date())
    } catch {
      // conserva los datos anteriores si los hay
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    fetchData()
    const id = setInterval(fetchData, intervalMs)
    return () => {
      mountedRef.current = false
      clearInterval(id)
    }
  }, [fetchData, intervalMs])

  return { data, loading, lastUpdated, refresh: fetchData }
}

// Devuelve un string legible de "hace X s / min" desde lastUpdated
export function useRelativeTime(lastUpdated: Date | null): string {
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!lastUpdated) return
    const update = () => {
      const secs = Math.floor((Date.now() - lastUpdated.getTime()) / 1000)
      if (secs < 60)   setLabel(`hace ${secs}s`)
      else             setLabel(`hace ${Math.floor(secs / 60)}min`)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [lastUpdated])

  return label
}
