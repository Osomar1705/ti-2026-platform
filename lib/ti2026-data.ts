export type Team = { name: string; short: string; color: string; seed: string }
export type Match = { id: string; teamA: Team; teamB: Team; scoreA: number; scoreB: number; status: 'live' | 'upcoming' | 'finished'; phase: string; format: string; time: string; duration?: string; mvp?: string }

export const teams: Team[] = [
  { name: 'Team Spirit', short: 'TS', color: '#cf4b45', seed: '1' },
  { name: 'Tundra Esports', short: 'T', color: '#b69a66', seed: '2' },
  { name: 'Team Liquid', short: 'TL', color: '#7d94b5', seed: '3' },
  { name: 'Gaimin Gladiators', short: 'GG', color: '#a978b7', seed: '4' },
  { name: 'Nigma Galaxy', short: 'NG', color: '#d3a959', seed: '5' },
  { name: 'Aurora', short: 'AU', color: '#729b9c', seed: '6' },
]

export const liveMatch: Match = { id: 'live-01', teamA: teams[0], teamB: teams[1], scoreA: 1, scoreB: 0, status: 'live', phase: 'Bracket Superior · Semifinal', format: 'BO3', time: '27:42' }
export const upcomingMatches: Match[] = [
  { id: 'up-01', teamA: teams[2], teamB: teams[3], scoreA: 0, scoreB: 0, status: 'upcoming', phase: 'Bracket Superior · Semifinal', format: 'BO3', time: '18:30' },
  { id: 'up-02', teamA: teams[4], teamB: teams[5], scoreA: 0, scoreB: 0, status: 'upcoming', phase: 'Bracket Inferior · Ronda 2', format: 'BO1', time: '21:00' },
]
export const recentMatches: Match[] = [
  { id: 'done-01', teamA: teams[2], teamB: teams[4], scoreA: 2, scoreB: 1, status: 'finished', phase: 'Bracket Superior · Cuartos de final', format: 'BO3', time: 'Final', duration: '36:18', mvp: 'miCKe' },
  { id: 'done-02', teamA: teams[3], teamB: teams[5], scoreA: 2, scoreB: 0, status: 'finished', phase: 'Bracket Superior · Cuartos de final', format: 'BO3', time: 'Final', duration: '29:44', mvp: 'Quinn' },
]

export const winProbability = [
  { minute: '0', spirit: 50, tundra: 50 }, { minute: '5', spirit: 53, tundra: 47 }, { minute: '10', spirit: 58, tundra: 42 }, { minute: '15', spirit: 55, tundra: 45 }, { minute: '20', spirit: 64, tundra: 36 }, { minute: '25', spirit: 67, tundra: 33 }, { minute: '27', spirit: 68, tundra: 32 },
]
export const bracket = [
  { phase: 'Semifinales', games: [{ a: 'Team Spirit', b: 'Tundra Esports', score: '1 — 0', live: true }, { a: 'Team Liquid', b: 'Gaimin Gladiators', score: '—', live: false }] },
  { phase: 'Final', games: [{ a: 'TBD', b: 'TBD', score: '—', live: false }] },
  { phase: 'Gran Final', games: [{ a: 'TBD', b: 'TBD', score: '—', live: false }] },
]
export const stats = [
  { label: 'Winrate', value: '68.4%', change: '+4.2%' }, { label: 'Duración promedio', value: '36:42', change: '-2:18' }, { label: 'Primera sangre', value: '57.8%', change: '+1.9%' }, { label: 'Héroe más pickeado', value: 'Pangolier', change: '18 picks' },
]
export const events = [{ time: '03:42', text: 'Primera sangre', detail: 'Collapse → 33' }, { time: '08:20', text: 'Torre destruida', detail: 'T1 Mid' }, { time: '14:35', text: 'Teamfight', detail: 'Spirit +2 bajas' }, { time: '18:42', text: 'Roshan eliminado', detail: 'Team Spirit' }, { time: '23:10', text: 'Empuje a highground', detail: 'Tundra defiende' }]
export const recommendations = [
  { tag: 'PICK DEL DÍA', title: 'Team Spirit', body: 'El draft favorece su tempo: la presión de Collapse puede romper el mapa antes del minuto 20.', tone: 'crimson' },
  { tag: 'HERO A VIGILAR', title: 'Pangolier', body: '18 picks en el evento y un 61% de win rate. Su movilidad está definiendo los mid games.', tone: 'gold' },
  { tag: 'UPSET ALERT', title: 'Aurora vs Nigma', body: 'Hay una posibilidad considerable de sorpresa si Aurora consigue el primer Roshan.', tone: 'blue' },
]
export const communityPosts = [
  { user: 'draftsmith', time: '2 min', text: '¿Spirit puede cerrar la serie sin llegar al late? Ese Pangolier está imposible.', replies: 24, likes: 86 },
  { user: 'carrytheflag', time: '8 min', text: 'Mi predicción: Liquid 2–1 GG. El matchup de supports será la clave.', replies: 12, likes: 41 },
  { user: 'roshanwatch', time: '14 min', text: 'La próxima serie empieza en 00:42:18. ¿Quién entra al bracket final?', replies: 8, likes: 29 },
]

export const serviceAdapters = { matches: '/api/matches', teams: '/api/teams', players: '/api/players', heroes: '/api/heroes', live: '/api/live', simulation: '/api/simulation' } as const
export const dataStatus = { mode: 'DATOS MOCK', source: 'TI 2026 prototipo', lastUpdated: 'hace 8 segundos' }
export const navItems = ['Inicio', 'En vivo', 'TI 2026', 'Estadísticas', 'Simulador', 'Comunidad', 'Favoritos']
export const formatTime = (value: string) => value
export function simulateSeries(teamA: Team, teamB: Team, bestOf = 3) { const base = teamA.name === 'Team Spirit' ? 68 : teamA.name === 'Team Liquid' ? 58 : 54; return { a: base, b: 100 - base, result: bestOf === 3 ? `${base > 55 ? teamA.short : teamB.short} wins 2–1` : `${base > 50 ? teamA.short : teamB.short} wins`, duration: '38–44 min', mvp: base > 55 ? 'Yatoro' : 'miCKe' } }
