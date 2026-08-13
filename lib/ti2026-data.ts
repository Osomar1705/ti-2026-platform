export type Team = { name: string; short: string; color: string; seed: string }
export type Match = { id: string; teamA: Team; teamB: Team; scoreA: number; scoreB: number; status: 'live' | 'upcoming' | 'finished'; phase: string; format: string; time: string; duration?: string }

export const teams: Team[] = [
  { name: 'Team Spirit', short: 'TS', color: '#cf4b45', seed: '1' },
  { name: 'Tundra Esports', short: 'TE', color: '#b69a66', seed: '2' },
  { name: 'Team Liquid', short: 'TL', color: '#7d94b5', seed: '3' },
  { name: 'Gaimin Gladiators', short: 'GG', color: '#a978b7', seed: '4' },
  { name: 'Nigma Galaxy', short: 'NG', color: '#d3a959', seed: '5' },
  { name: 'Aurora', short: 'AU', color: '#729b9c', seed: '6' },
]

// No matches have been played. TI 2026 begins August 13, 2026.
export const liveMatch: Match | null = null
export const upcomingMatches: Match[] = []
export const recentMatches: Match[] = []
export const winProbability: { minute: string; spirit: number; tundra: number }[] = []
export const bracket = [
  { phase: 'Cuartos de final', games: [{ a: 'TBD', b: 'TBD', score: '—', live: false }, { a: 'TBD', b: 'TBD', score: '—', live: false }] },
  { phase: 'Semifinales', games: [{ a: 'TBD', b: 'TBD', score: '—', live: false }] },
  { phase: 'Gran Final', games: [{ a: 'TBD', b: 'TBD', score: '—', live: false }] },
]
export const stats: { label: string; value: string; change: string }[] = []
export const events: { time: string; text: string; detail: string }[] = []
export const recommendations: { tag: string; title: string; body: string; tone: string }[] = []
export const communityPosts: { user: string; time: string; text: string; replies: number; likes: number }[] = []

export const serviceAdapters = {
  matches: '/api/matches',
  teams: '/api/teams',
  players: '/api/players',
  heroes: '/api/heroes',
  live: '/api/live',
  simulation: '/api/simulation',
} as const

export const dataStatus = {
  mode: 'ESPERANDO DATOS',
  source: 'TI 2026 — Comienza el 13 de agosto',
  lastUpdated: '—',
}

export const navItems = ['Inicio', 'En vivo', 'TI 2026', 'Estadísticas', 'Simulador', 'Comunidad', 'Favoritos']
export const formatTime = (value: string) => value

export function simulateSeries(teamA: Team, teamB: Team, bestOf = 3) {
  const base = teamA.name === 'Team Spirit' ? 68 : teamA.name === 'Team Liquid' ? 58 : 54
  return {
    a: base,
    b: 100 - base,
    result: bestOf === 3
      ? `${base > 55 ? teamA.short : teamB.short} wins 2–1`
      : `${base > 50 ? teamA.short : teamB.short} wins`,
    duration: '38–44 min',
  }
}
