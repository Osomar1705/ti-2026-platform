// Proveedor OpenDota — endpoint /live público, sin Cloudflare, sin auth.
// Mantenemos el nombre del archivo para no romper imports.

import type { LiveMatch, LivePlayer, LiveTeam } from './types'
import { heroName } from './hero-names'

const OPENDOTA_URL = 'https://api.opendota.com/api/live'

// Equipos TI 2026 — hardcoded para resolver nombres sin team_id en el live feed
const TI_2026_TEAMS: Record<string, { name: string; tag: string }> = {
  // Se puebla con IDs reales de OpenDota cuando estén disponibles
}

function parseTeam(raw: any, kills: number, fallback: string): LiveTeam {
  const teamId = raw?.team_id ?? raw?.teamId ?? null
  const fromMap = teamId ? TI_2026_TEAMS[String(teamId)] : null
  return {
    teamId,
    name: fromMap?.name ?? raw?.team_name ?? raw?.name ?? fallback,
    tag:  fromMap?.tag  ?? raw?.team_tag  ?? raw?.tag  ?? fallback.slice(0, 4).toUpperCase(),
    kills,
  }
}

function parsePlayers(rawPlayers: any[]): LivePlayer[] {
  if (!Array.isArray(rawPlayers)) return []
  return rawPlayers.map((p: any, i: number) => ({
    slot: i,
    isRadiant: p.team === 0 || (p.isRadiant ?? i < 5),
    heroId: p.hero_id ?? p.heroId ?? 0,
    heroName: heroName(p.hero_id ?? p.heroId ?? 0),
    kills: p.kills ?? 0,
    deaths: p.death ?? p.deaths ?? 0,
    assists: p.assists ?? 0,
    netWorth: p.net_worth ?? p.networth ?? 0,
    level: p.level ?? 1,
    gpm: p.gold_per_min ?? undefined,
    xpm: p.xp_per_min ?? undefined,
    lastHits: p.last_hits ?? undefined,
    denies: p.denies ?? undefined,
    items: [],
  }))
}

export async function fetchStratzLive(leagueId?: number): Promise<LiveMatch[]> {
  const res = await fetch(OPENDOTA_URL, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 25 },
  })

  if (!res.ok) throw new Error(`OpenDota ${res.status}`)

  const rawMatches: any[] = await res.json()

  // Log para debug: ver qué league_ids hay en los matches actuales
  const leagueIds = [...new Set(rawMatches.map((m: any) => m.league_id))]
  console.log('[live] league_ids activos:', leagueIds)

  const now = Date.now()

  return rawMatches
    .filter((m: any) => {
      if (leagueId && m.league_id !== leagueId) return false
      return true
    })
    .slice(0, 20)
    .map((m: any): LiveMatch => ({
      matchId: String(m.match_id),
      status: 'LIVE',
      duration: m.game_time ?? m.duration ?? 0,
      radiant: parseTeam(m.radiant_team, m.radiant_score ?? 0, 'Radiant'),
      dire: parseTeam(m.dire_team, m.dire_score ?? 0, 'Dire'),
      players: parsePlayers(m.players ?? []),
      leagueId: m.league_id,
      leagueName: m.league?.name,
      fetchedAt: now,
    }))
}
