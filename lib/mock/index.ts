export { teams, players } from './teams'
export { heroes } from './heroes'
export { matches, liveMatch, upcomingMatches, recentMatches, liveGame2 } from './matches'
export { bracketSlots, bracketColumns } from './bracket'
export { posts, chatMessages } from './community'
export { panchoRecommendations } from './pancho'

import type { DataStatus } from '../types'

export const dataStatus: DataStatus = {
  source: 'MOCK',
  label: 'DATOS MOCK',
  lastUpdated: 'hace 8 segundos',
  connected: false,
}

export const navItems = [
  { label: 'Inicio', href: '/' },
  { label: 'En vivo', href: '/live' },
  { label: 'TI 2026', href: '/bracket' },
  { label: 'Estadísticas', href: '/statistics' },
  { label: 'Simulador', href: '/simulator' },
  { label: 'Comunidad', href: '/community' },
  { label: 'Perfil', href: '/profile' },
]

export const tournamentStats = [
  { label: 'Winrate promedio', value: '68.4%', change: '+4.2%' },
  { label: 'Duración promedio', value: '36:42', change: '-2:18' },
  { label: 'Primera sangre', value: '57.8%', change: '+1.9%' },
  { label: 'Héroe más pickeado', value: 'Pangolier', change: '18 picks' },
]
