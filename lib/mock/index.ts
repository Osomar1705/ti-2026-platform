export { teams, players } from './teams'
export { heroes } from './heroes'
export { matches, liveMatch, upcomingMatches, recentMatches, liveGame2 } from './matches'
export { bracketSlots, bracketColumns } from './bracket'
export { posts, chatMessages } from './community'
export { panchoRecommendations } from './pancho'

import type { DataStatus } from '../types'

export const dataStatus: DataStatus = {
  source: 'WAITING',
  label: 'ESPERANDO DATOS EN VIVO',
  lastUpdated: '—',
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
