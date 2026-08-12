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
  { label: 'Winrate promedio', value: '0.0%', change: '+0.0%' },
  { label: 'Duración promedio', value: '00:00', change: '0:00' },
  { label: 'Primera sangre', value: '0.0%', change: '+0.0%' },
  { label: 'Héroe más pickeado', value: 'TBD', change: 'TBD picks' },
]
