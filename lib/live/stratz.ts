// Proveedor OpenDota + Steam — datos live del TI 2026.
// API keys solo en process.env, nunca en el frontend.

import type { LiveMatch, LivePlayer, LiveTeam } from './types'
import { heroName } from './hero-names'

const OPENDOTA_URL = 'https://api.opendota.com/api/live'

// ─── Steam API para nombres de equipo ──────────────────────────────

let _steamCache: Record<number, { name: string; tag: string }> | null = null
let _steamCacheAt = 0

async function getSteamTeams(leagueId: number): Promise<Record<number, { name: string; tag: string }>> {
  const now = Date.now()
  // Refrescar cada 5 minutos
  if (_steamCache && now - _steamCacheAt < 5 * 60 * 1000) return _steamCache

  const key = process.env.STEAM_API_KEY
  if (!key) return {}

  try {
    const url = `https://api.steampowered.com/IDOTA2Match_570/GetLiveLeagueGames/v1/?key=${key}&league_id=${leagueId}`
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) return _steamCache ?? {}

    const json = await res.json()
    const games: any[] = json?.result?.games ?? []

    const map: Record<number, { name: string; tag: string }> = {}
    for (const g of games) {
      if (g.radiant_team?.team_id) {
        map[g.radiant_team.team_id] = {
          name: g.radiant_team.team_name ?? 'Radiant',
          tag: g.radiant_team.team_tag ?? 'RAD',
        }
      }
      if (g.dire_team?.team_id) {
        map[g.dire_team.team_id] = {
          name: g.dire_team.team_name ?? 'Dire',
          tag: g.dire_team.team_tag ?? 'DIR',
        }
      }
    }

    _steamCache = map
    _steamCacheAt = now
    return map
  } catch {
    return _steamCache ?? {}
  }
}

// ─── Mapeo de match_id → equipos desde Steam ───────────────────────

let _matchTeamCache: Record<string, { radiant: { name: string; tag: string }; dire: { name: string; tag: string } }> | null = null
let _matchTeamCacheAt = 0

async function getMatchTeamMap(leagueId: number): Promise<Record<string, { radiant: { name: string; tag: string }; dire: { name: string; tag: string } }>> {
  const now = Date.now()
  if (_matchTeamCache && now - _matchTeamCacheAt < 30_000) return _matchTeamCache

  const key = process.env.STEAM_API_KEY
  if (!key) return {}

  try {
    const url = `https://api.steampowered.com/IDOTA2Match_570/GetLiveLeagueGames/v1/?key=${key}&league_id=${leagueId}`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return _matchTeamCache ?? {}

    const json = await res.json()
    const games: any[] = json?.result?.games ?? []

    const map: Record<string, { radiant: { name: string; tag: string }; dire: { name: string; tag: string } }> = {}
    for (const g of games) {
      if (g.match_id) {
        map[String(g.match_id)] = {
          radiant: {
            name: g.radiant_team?.team_name ?? 'Radiant',
            tag: g.radiant_team?.team_tag ?? 'RAD',
          },
          dire: {
            name: g.dire_team?.team_name ?? 'Dire',
            tag: g.dire_team?.team_tag ?? 'DIR',
          },
        }
      }
    }

    _matchTeamCache = map
    _matchTeamCacheAt = now
    return map
  } catch {
    return _matchTeamCache ?? {}
  }
}

// ─── Parsers ────────────────────────────────────────────────────────

function makeTeam(name: string, tag: string, kills: number, teamId: number | null): LiveTeam {
  return { teamId, name, tag, kills }
}

function parsePlayers(rawPlayers: any[]): LivePlayer[] {
  if (!Array.isArray(rawPlayers)) return []
  return rawPlayers.map((p: any, i: number) => {
    // OpenDota usa player_slot: 0-4 radiant, 128-132 dire
    const slot = p.player_slot ?? p.slot ?? i
    const isRadiant = slot < 128
    return {
      slot: i,
      isRadiant,
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
    }
  })
}

// ─── Debug ──────────────────────────────────────────────────────────

export async function getDebugLeagueIds(): Promise<{ id: number; count: number }[]> {
  const res = await fetch(OPENDOTA_URL, { headers: { Accept: 'application/json' } })
  if (!res.ok) return []
  const raw: any[] = await res.json()
  const counts: Record<number, number> = {}
  raw.forEach((m: any) => { counts[m.league_id] = (counts[m.league_id] ?? 0) + 1 })
  return Object.entries(counts)
    .map(([id, count]) => ({ id: Number(id), count }))
    .sort((a, b) => b.id - a.id)
}

// ─── Main ────────────────────────────────────────────────────────────

export async function fetchStratzLive(leagueId?: number): Promise<LiveMatch[]> {
  const [odRes, teamMap] = await Promise.all([
    fetch(OPENDOTA_URL, { headers: { Accept: 'application/json' }, next: { revalidate: 25 } }),
    leagueId ? getMatchTeamMap(leagueId) : Promise.resolve({}),
  ])

  if (!odRes.ok) throw new Error(`OpenDota ${odRes.status}`)

  const rawMatches: any[] = await odRes.json()
  const now = Date.now()

  return rawMatches
    .filter((m: any) => !leagueId || m.league_id === leagueId)
    .slice(0, 20)
    .map((m: any): LiveMatch => {
      const teams = teamMap[String(m.match_id)]
      return {
        matchId: String(m.match_id),
        status: 'LIVE',
        duration: m.game_time ?? m.duration ?? 0,
        radiant: makeTeam(
          teams?.radiant.name ?? m.radiant_team?.team_name ?? 'Radiant',
          teams?.radiant.tag  ?? m.radiant_team?.team_tag  ?? 'RAD',
          m.radiant_score ?? 0,
          m.radiant_team?.team_id ?? null,
        ),
        dire: makeTeam(
          teams?.dire.name ?? m.dire_team?.team_name ?? 'Dire',
          teams?.dire.tag  ?? m.dire_team?.team_tag  ?? 'DIR',
          m.dire_score ?? 0,
          m.dire_team?.team_id ?? null,
        ),
        players: parsePlayers(m.players ?? []),
        leagueId: m.league_id,
        leagueName: m.league?.name,
        fetchedAt: now,
      }
    })
}
