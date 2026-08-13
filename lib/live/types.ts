// Tipos normalizados del sistema LIVE — independientes del proveedor externo

export type LiveMatchStatus = 'LIVE' | 'UPCOMING' | 'FINISHED' | 'PAUSED' | 'CANCELLED' | 'UNKNOWN'

export type LivePlayer = {
  slot: number            // 0-4 radiant, 5-9 dire
  isRadiant: boolean
  heroId: number
  heroName: string
  kills: number
  deaths: number
  assists: number
  netWorth: number
  level: number
  gpm?: number
  xpm?: number
  lastHits?: number
  denies?: number
  items?: number[]        // item IDs
}

export type LiveTeam = {
  teamId: number | null
  name: string
  tag: string
  kills: number
  netWorth?: number
}

export type LiveDraftPick = {
  heroId: number
  heroName: string
  isBan: boolean
  isRadiant: boolean
  order: number
}

export type LiveMatch = {
  matchId: string
  status: LiveMatchStatus
  duration: number        // segundos transcurridos
  radiant: LiveTeam
  dire: LiveTeam
  players: LivePlayer[]
  draft?: LiveDraftPick[]
  leagueId?: number
  leagueName?: string
  seriesType?: string     // 'BO1' | 'BO3' | 'BO5'
  fetchedAt: number       // timestamp ms
}

export type LiveApiResponse = {
  matches: LiveMatch[]
  fetchedAt: number
  source: 'STRATZ' | 'MOCK' | 'ERROR'
  stale?: boolean
  error?: string
}
