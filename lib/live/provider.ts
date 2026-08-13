// Selecciona el proveedor según variables de entorno.
// El frontend NUNCA llama a este archivo — solo lo usan las API routes.

import type { LiveApiResponse } from './types'
import { fetchStratzLive } from './stratz'
import { getMockLiveResponse } from './mock'

// Cache en memoria con TTL (funciona dentro del mismo proceso Node.js / Vercel lambda)
let _cache: { data: LiveApiResponse; expiresAt: number } | null = null

const CACHE_TTL = parseInt(process.env.LIVE_POLL_INTERVAL ?? '30000', 10)

export async function getLiveData(): Promise<LiveApiResponse> {
  // Mock mode: no llama a STRATZ
  if (process.env.LIVE_MOCK_MODE === 'true') {
    return getMockLiveResponse()
  }

  // Si LIVE_ENABLED está apagado, devuelve vacío
  if (process.env.LIVE_ENABLED === 'false') {
    return { matches: [], fetchedAt: Date.now(), source: 'MOCK' }
  }

  // Revisar cache
  const now = Date.now()
  if (_cache && now < _cache.expiresAt) {
    return { ..._cache.data, stale: false }
  }

  try {
    // TI 2026 league ID en OpenDota — hardcoded para garantizar el filtro
    const leagueId = process.env.TI_2026_LEAGUE_ID
      ? parseInt(process.env.TI_2026_LEAGUE_ID, 10)
      : 19719

    const matches = await fetchStratzLive(leagueId)

    const response: LiveApiResponse = {
      matches,
      fetchedAt: now,
      source: 'STRATZ',
    }

    _cache = { data: response, expiresAt: now + CACHE_TTL }
    return response
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'

    // Si hay cache viejo, devuélvelo marcado como stale
    if (_cache) {
      return { ..._cache.data, stale: true, error: message }
    }

    return {
      matches: [],
      fetchedAt: now,
      source: 'ERROR',
      error: message,
    }
  }
}
