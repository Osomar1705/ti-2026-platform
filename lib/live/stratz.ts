// Proveedor STRATZ — transforma datos GraphQL al formato LiveMatch normalizado.
// La API key NUNCA sale de este archivo; vive en process.env.STRATZ_API_KEY.

import type { LiveMatch, LivePlayer, LiveTeam, LiveDraftPick } from './types'
import { heroName } from './hero-names'

const STRATZ_URL = 'https://api.stratz.com/graphql'

const QUERY = `
query LiveMatches($leagueId: Int) {
  live {
    matches(request: { isParsed: false, take: 20, leagueId: $leagueId }) {
      matchId
      radiantScore
      direScore
      gameState
      completed
      durationValues
      radiant { teamId name tag }
      dire   { teamId name tag }
      league { id displayName }
      players {
        steamAccountId
        heroId
        isRadiant
        position
        kills
        deaths
        assists
        networth
        level
        numLastHits
        numDenies
        goldPerMinute
        experiencePerMinute
        item0Id item1Id item2Id item3Id item4Id item5Id
      }
    }
  }
}
`

function parseTeam(raw: any, kills: number): LiveTeam {
  return {
    teamId: raw?.teamId ?? null,
    name: raw?.name ?? (kills === undefined ? 'Radiant' : 'Dire'),
    tag: raw?.tag ?? '???',
    kills,
  }
}

function parsePlayers(rawPlayers: any[]): LivePlayer[] {
  if (!Array.isArray(rawPlayers)) return []
  return rawPlayers.map((p, i) => ({
    slot: i,
    isRadiant: p.isRadiant ?? i < 5,
    heroId: p.heroId ?? 0,
    heroName: heroName(p.heroId ?? 0),
    kills: p.kills ?? 0,
    deaths: p.deaths ?? 0,
    assists: p.assists ?? 0,
    netWorth: p.networth ?? 0,
    level: p.level ?? 1,
    gpm: p.goldPerMinute ?? undefined,
    xpm: p.experiencePerMinute ?? undefined,
    lastHits: p.numLastHits ?? undefined,
    denies: p.numDenies ?? undefined,
    items: [p.item0Id, p.item1Id, p.item2Id, p.item3Id, p.item4Id, p.item5Id].filter(Boolean),
  }))
}

function normalizeDuration(durationValues: number[]): number {
  if (!Array.isArray(durationValues) || durationValues.length === 0) return 0
  return durationValues[durationValues.length - 1] ?? 0
}

export async function fetchStratzLive(leagueId?: number): Promise<LiveMatch[]> {
  const apiKey = process.env.STRATZ_API_KEY
  if (!apiKey) throw new Error('STRATZ_API_KEY no configurada')

  const res = await fetch(STRATZ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'PanchoWeb/1.0 (contact: panchoweb@proton.me)',
    },
    body: JSON.stringify({
      query: QUERY,
      variables: { leagueId: leagueId || undefined },
    }),
    // Cache Next.js: revalida cada 25 segundos
    next: { revalidate: 25 },
  })

  if (!res.ok) {
    throw new Error(`STRATZ respondió ${res.status}`)
  }

  const json = await res.json()
  if (json.errors?.length) {
    throw new Error(json.errors[0]?.message ?? 'STRATZ GraphQL error')
  }

  const rawMatches: any[] = json?.data?.live?.matches ?? []

  return rawMatches
    .filter((m: any) => !m.completed)
    .map((m: any): LiveMatch => ({
      matchId: String(m.matchId),
      status: 'LIVE',
      duration: normalizeDuration(m.durationValues),
      radiant: parseTeam(m.radiant, m.radiantScore ?? 0),
      dire: parseTeam(m.dire, m.direScore ?? 0),
      players: parsePlayers(m.players ?? []),
      leagueId: m.league?.id,
      leagueName: m.league?.displayName,
      fetchedAt: Date.now(),
    }))
}
