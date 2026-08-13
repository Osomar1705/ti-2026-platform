'use client'
import { useEffect, useState, useCallback } from 'react'

export function useLiveData<T>(fetcher: () => T, intervalMs: number = 8000) {
  const [data, setData] = useState<T>(fetcher)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const refresh = useCallback(() => {
    setData(fetcher())
    setLastUpdated(new Date())
  }, [fetcher])

  useEffect(() => {
    const id = setInterval(refresh, intervalMs)
    return () => clearInterval(id)
  }, [refresh, intervalMs])

  return { data, lastUpdated, refresh }
}
