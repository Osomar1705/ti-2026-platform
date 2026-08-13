// Proveedor OpenDota + Steam — datos live del TI 2026.
// API keys solo en process.env, nunca en el frontend.

import type { LiveMatch, LivePlayer, LiveTeam } from './types'
import { heroName } from './hero-names'

const OPENDOTA_URL = 'https://api.opendota.com/api/live'

// ─── Schedule TI 2026 hardcodeado ──────────────────────────────────
// Pares de equipos por ronda. Los usamos como fallback cuando Steam
// no devuelve datos para un match_id concreto.

interface TeamInfo { name: string; tag: string }

const TI2026_TEAMS: Record<string, TeamInfo> = {
  'Team Falcons':    { name: 'Team Falcons',    tag: 'Falcons' },
  'LGD Gaming':      { name: 'LGD Gaming',      tag: 'LGD'     },
  'Nigma Galaxy':    { name: 'Nigma Galaxy',    tag: 'NGX'     },
  'Iron Wing':       { name: 'Iron Wing',       tag: 'IW'      },
  'BoomBoys':        { name: 'BoomBoys',        tag: 'BB'      },
  'OG Esports':      { name: 'OG Esports',      tag: 'OG'      },
  'TEAM VISION':     { name: 'TEAM VISION',     tag: 'VISION'  },
  'Team Resilience': { name: 'Team Resilience', tag: 'TR'      },
  'Team Spirit':     { name: 'Team Spirit',     tag: 'TSpirit' },
  'Xtreme Gaming':   { name: 'Xtreme Gaming',   tag: 'XG'      },
  'Team Liquid':     { name: 'Team Liquid',     tag: 'Liquid'  },
  'Vici Gaming':     { name: 'Vici Gaming',     tag: 'VG'      },
  'Aurora Gaming':   { name: 'Aurora Gaming',   tag: 'Aurora'  },
  'GamerLegion':     { name: 'GamerLegion',     tag: 'GL'      },
  'Team Yandex':     { name: 'Team Yandex',     tag: 'Yandex'  },
  'Huligani':        { name: 'Huligani',        tag: 'HULI'    },
}

// Round 1 fijo: [radiant_name, dire_name]
const ROUND1_PAIRS: [string, string][] = [
  ['Team Falcons',  'LGD Gaming'],
  ['Nigma Galaxy',  'Iron Wing'],
  ['BoomBoys',      'OG Esports'],
  ['TEAM VISION',   'Team Resilience'],
  ['Team Spirit',   'Xtreme Gaming'],
  ['Team Liquid',   'Vici Gaming'],
  ['Aurora Gaming', 'GamerLegion'],
  ['Team Yandex',   'Huligani'],
]

// ─── Cache acumulativo de match_id → equipos ───────────────────────
// NUNCA se borra — se va llenando con cada respuesta de Steam.
// Así, aunque Steam no devuelva todos los matches al mismo tiempo,
// eventualmente cubrimos todos.

const _knownMatchTeams: Record<string, { radiant: TeamInfo; dire: TeamInfo }> = {}
let _lastSteamFetch = 0

async function refreshSteamCache(leagueId: number): Promise<void> {
  const now = Date.now()
  if (now - _lastSteamFetch < 25_000) return   // no más de 1 fetch cada 25s
  _lastSteamFetch = now

  const key = process.env.STEAM_API_KEY
  if (!key) return

  try {
    const url = `https://api.steampowered.com/IDOTA2Match_570/GetLiveLeagueGames/v1/?key=${key}&league_id=${leagueId}`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return

    const json = await res.json()
    const games: any[] = json?.result?.games ?? []

    for (const g of games) {
      if (!g.match_id) continue
      const mid = String(g.match_id)
      const rName = g.radiant_team?.team_name
      const dName = g.dire_team?.team_name
      if (rName && dName) {
        _knownMatchTeams[mid] = {
          radiant: { name: rName, tag: g.radiant_team?.team_tag ?? rName.slice(0, 4) },
          dire:    { name: dName, tag: g.dire_team?.team_tag  ?? dName.slice(0, 4) },
        }
      }
    }
  } catch {
    // falla silenciosamente, usamos lo que ya tenemos
  }
}

// ─── Asignar equipos a matches sin datos de Steam ──────────────────
// Usa los pares conocidos del Round 1: si ya asignamos N pares vía
// Steam, los matches restantes obtienen los pares que faltan.

function inferTeams(
  unknownMatchIds: string[],
  knownMatchIds: string[],
): Record<string, { radiant: TeamInfo; dire: TeamInfo }> {
  // Equipos ya asignados
  const usedPairs = new Set<string>()
  for (const mid of knownMatchIds) {
    const t = _knownMatchTeams[mid]
    if (t) usedPairs.add(`${t.radiant.name}|${t.dire.name}`)
  }

  // Pares del Round 1 aún sin asignar
  const freePairs = ROUND1_PAIRS.filter(
    ([r, d]) => !usedPairs.has(`${r}|${d}`) && !usedPairs.has(`${d}|${r}`)
  )

  const result: Record<string, { radiant: TeamInfo; dire: TeamInfo }> = {}
  unknownMatchIds.forEach((mid, i) => {
    const pair = freePairs[i]
    if (pair) {
      result[mid] = {
        radiant: TI2026_TEAMS[pair[0]] ?? { name: pair[0], tag: pair[0].slice(0, 4) },
        dire:    TI2026_TEAMS[pair[1]] ?? { name: pair[1], tag: pair[1].slice(0, 4) },
      }
    }
  })
  return result
}

// ─── Parsers ────────────────────────────────────────────────────────

function makeTeam(name: string, tag: string, kills: number, teamId?: number | null): LiveTeam {
  return { teamId: teamId ?? null, name, tag, kills }
}

function parsePlayers(rawPlayers: any[]): LivePlayer[] {
  if (!Array.isArray(rawPlayers)) return []
  return rawPlayers.map((p: any, i: number) => {
    const slot = p.player_slot ?? i
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
  // Refrescar Steam en paralelo con OpenDota
  const [odRes] = await Promise.all([
    fetch(OPENDOTA_URL, { headers: { Accept: 'application/json' }, next: { revalidate: 25 } }),
    leagueId ? refreshSteamCache(leagueId) : Promise.resolve(),
  ])

  if (!odRes.ok) throw new Error(`OpenDota ${odRes.status}`)

  const rawMatches: any[] = await odRes.json()
  const now = Date.now()

  const tiMatches = rawMatches.filter((m: any) => !leagueId || m.league_id === leagueId)

  // Separar matches con y sin datos de Steam
  const withTeams    = tiMatches.filter(m => _knownMatchTeams[String(m.match_id)])
  const withoutTeams = tiMatches.filter(m => !_knownMatchTeams[String(m.match_id)])

  // Inferir equipos para los que Steam no cubrió
  const inferred = inferTeams(
    withoutTeams.map(m => String(m.match_id)),
    withTeams.map(m => String(m.match_id)),
  )

  return tiMatches.slice(0, 20).map((m: any): LiveMatch => {
    const mid   = String(m.match_id)
    const teams = _knownMatchTeams[mid] ?? inferred[mid]
    return {
      matchId: mid,
      status: 'LIVE',
      duration: m.game_time ?? m.duration ?? 0,
      radiant: makeTeam(
        teams?.radiant.name ?? 'Radiant',
        teams?.radiant.tag  ?? 'RAD',
        m.radiant_score ?? 0,
      ),
      dire: makeTeam(
        teams?.dire.name ?? 'Dire',
        teams?.dire.tag  ?? 'DIR',
        m.dire_score ?? 0,
      ),
      players: parsePlayers(m.players ?? []),
      leagueId: m.league_id,
      leagueName: m.league?.name,
      fetchedAt: now,
    }
  })
}
