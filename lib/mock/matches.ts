import type { Match } from '../types'
import { teams } from './teams'

const fal = teams.find(t => t.id === 'fal')!
const lgd = teams.find(t => t.id === 'lgd')!
const ng  = teams.find(t => t.id === 'ng')!
const iw  = teams.find(t => t.id === 'iw')!
const bb  = teams.find(t => t.id === 'bb')!
const og  = teams.find(t => t.id === 'og')!
const vis = teams.find(t => t.id === 'vis')!
const res = teams.find(t => t.id === 'res')!
const ts  = teams.find(t => t.id === 'ts')!
const xg  = teams.find(t => t.id === 'xg')!

// Group Stage Round 1 — August 13, 2026
// All matches start at 10:00 AM CST (02:00 UTC), second block at 15:00 CST (07:00 UTC)
export const matches: Match[] = [
  {
    id: 'gs-r1-fal-lgd',
    radiant: fal, dire: lgd,
    radiantScore: 0, direScore: 0,
    status: 'upcoming',
    phase: 'Fase de Grupos · Ronda 1',
    format: 'BO3',
    scheduledAt: '2026-08-13T02:00:00Z',
    games: [],
  },
  {
    id: 'gs-r1-ng-iw',
    radiant: ng, dire: iw,
    radiantScore: 0, direScore: 0,
    status: 'upcoming',
    phase: 'Fase de Grupos · Ronda 1',
    format: 'BO3',
    scheduledAt: '2026-08-13T02:00:00Z',
    games: [],
  },
  {
    id: 'gs-r1-bb-og',
    radiant: bb, dire: og,
    radiantScore: 0, direScore: 0,
    status: 'upcoming',
    phase: 'Fase de Grupos · Ronda 1',
    format: 'BO3',
    scheduledAt: '2026-08-13T02:00:00Z',
    games: [],
  },
  {
    id: 'gs-r1-vis-res',
    radiant: vis, dire: res,
    radiantScore: 0, direScore: 0,
    status: 'upcoming',
    phase: 'Fase de Grupos · Ronda 1',
    format: 'BO3',
    scheduledAt: '2026-08-13T02:00:00Z',
    games: [],
  },
  {
    id: 'gs-r1-ts-xg',
    radiant: ts, dire: xg,
    radiantScore: 0, direScore: 0,
    status: 'upcoming',
    phase: 'Fase de Grupos · Ronda 1',
    format: 'BO3',
    scheduledAt: '2026-08-13T07:00:00Z',
    games: [],
  },
]

export const liveMatch = null
export const upcomingMatches = matches
export const recentMatches: Match[] = []
export const liveGame2 = null
