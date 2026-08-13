// Proveedor STRATZ — transforma datos al formato LiveMatch normalizado.
// La API key NUNCA sale de este archivo; vive en process.env.STRATZ_API_KEY.

import type { LiveMatch, LivePlayer, LiveTeam } from './types'
import { heroName } from './hero-names'

// REST endpoint — más permisivo que GraphQL con Cloudflare
const STRATZ_REST = 'https://api.stratz.com/api/v1'

function parseTeam(raw: any, kills: number): LiveTeam {
  return {
    teamId: raw?.teamId ?? null,
    name: raw?.name ?? (kills !== undefined ? 'Radiant' : 'Dire'),
    tag: raw?.tag ?? '???',
    kills,
  }
}

function parsePlayers(rawPlayers: any[]): LivePlayer[] {
  if (!Array.isArray(rawPlayers)) return []
  return rawPlayers.map((p: any, i: number) => ({
    slot: i,
    isRadiant: p.isRadiant ?? i < 5,
    heroId: p.heroId ?? 0,
    heroName: heroName(p.heroId ?? 0),
    kills: p.kills ?? 0,
    deaths: p.deaths ?? 0,
    assists: p.assists ?? 0,
    netWorth: p.networth ?? p.netWorth ?? 0,
    level: p.level ?? 1,
    gpm: p.goldPerMinute ?? undefined,
    xpm: p.experiencePerMinute ?? undefined,
    lastHits: p.numLastHits ?? undefined,
    denies: p.numDenies ?? undefined,
    items: [p.item0Id, p.item1Id, p.item2Id, p.item3Id, p.item4Id, p.item5Id].filter(Boolean),
  }))
}

async function stratzFetch(path: string): Promise<any> {
  const apiKey = process.env.STRATZ_API_KEY
  if (!apiKey) throw new Error('STRATZ_API_KEY no configurada')

  const res = await fetch(`${STRATZ_REST}${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
    // Next.js cache: revalida cada 25s
    next: { revalidate: 25 },
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`STRATZ ${res.status}: ${text.slice(0, 200)}`)
  }

  return res.json()
}

export async function fetchStratzLive(leagueId?: number): Promise<LiveMatch[]> {
  // STRATZ REST: /match/live devuelve partidas activas
  const path = leagueId ? `/league/${leagueId}/matches?matchType=1` : '/match/live'
  const data = await stratzFetch(path)

  // El endpoint puede devolver un array directo o { matches: [] }
  const rawMatches: any[] = Array.isArray(data) ? data : (data?.matches ?? data?.data ?? [])

  const now = Date.now()
  return rawMatches
    .filter((m: any) => !m.completed && !m.isCompleted)
    .slice(0, 20)
    .map((m: any): LiveMatch => ({
      matchId: String(m.matchId ?? m.id ?? ''),
      status: 'LIVE',
      duration: m.gameTime ?? m.duration ?? m.durationValues?.at?.(-1) ?? 0,
      radiant: parseTeam(m.radiantTeam ?? m.radiant, m.radiantScore ?? m.radiantKills ?? 0),
      dire: parseTeam(m.direTeam ?? m.dire, m.direScore ?? m.direKills ?? 0),
      players: parsePlayers(m.players ?? []),
      leagueId: m.leagueId ?? m.league?.id,
      leagueName: m.league?.displayName ?? m.leagueName,
      fetchedAt: now,
    }))
}
