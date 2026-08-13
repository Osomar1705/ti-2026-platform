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
const tl  = teams.find(t => t.id === 'tl')!
const vg  = teams.find(t => t.id === 'vg')!
const au  = teams.find(t => t.id === 'au')!
const gl  = teams.find(t => t.id === 'gl')!
const ydk = teams.find(t => t.id === 'ydk')!
const hul = teams.find(t => t.id === 'hul')!

// Group Stage Round 1 — August 12-13, 2026 (Online)
// Block 1: 21:00 GMT-5 Aug 12 = 02:00 UTC Aug 13 (Group A)
// Block 2: 00:00 GMT-5 Aug 13 = 05:00 UTC Aug 13 (Group B)
export const matches: Match[] = [
  // Group A
  {
    id: 'gs-r1-fal-lgd',
    radiant: fal, dire: lgd,
    radiantScore: 0, direScore: 0,
    status: 'upcoming',
    phase: 'Fase de Grupos · Ronda 1 · Grupo A',
    format: 'BO3',
    scheduledAt: '2026-08-13T02:00:00Z',
    games: [],
  },
  {
    id: 'gs-r1-iw-ng',
    radiant: iw, dire: ng,
    radiantScore: 0, direScore: 0,
    status: 'upcoming',
    phase: 'Fase de Grupos · Ronda 1 · Grupo A',
    format: 'BO3',
    scheduledAt: '2026-08-13T02:00:00Z',
    games: [],
  },
  {
    id: 'gs-r1-bb-og',
    radiant: bb, dire: og,
    radiantScore: 0, direScore: 0,
    status: 'upcoming',
    phase: 'Fase de Grupos · Ronda 1 · Grupo A',
    format: 'BO3',
    scheduledAt: '2026-08-13T02:00:00Z',
    games: [],
  },
  {
    id: 'gs-r1-vis-res',
    radiant: vis, dire: res,
    radiantScore: 0, direScore: 0,
    status: 'upcoming',
    phase: 'Fase de Grupos · Ronda 1 · Grupo A',
    format: 'BO3',
    scheduledAt: '2026-08-13T02:00:00Z',
    games: [],
  },
  // Group B
  {
    id: 'gs-r1-ts-xg',
    radiant: ts, dire: xg,
    radiantScore: 0, direScore: 0,
    status: 'upcoming',
    phase: 'Fase de Grupos · Ronda 1 · Grupo B',
    format: 'BO3',
    scheduledAt: '2026-08-13T05:00:00Z',
    games: [],
  },
  {
    id: 'gs-r1-tl-vg',
    radiant: tl, dire: vg,
    radiantScore: 0, direScore: 0,
    status: 'upcoming',
    phase: 'Fase de Grupos · Ronda 1 · Grupo B',
    format: 'BO3',
    scheduledAt: '2026-08-13T05:00:00Z',
    games: [],
  },
  {
    id: 'gs-r1-au-gl',
    radiant: au, dire: gl,
    radiantScore: 0, direScore: 0,
    status: 'upcoming',
    phase: 'Fase de Grupos · Ronda 1 · Grupo B',
    format: 'BO3',
    scheduledAt: '2026-08-13T05:00:00Z',
    games: [],
  },
  {
    id: 'gs-r1-ydk-hul',
    radiant: ydk, dire: hul,
    radiantScore: 0, direScore: 0,
    status: 'upcoming',
    phase: 'Fase de Grupos · Ronda 1 · Grupo B',
    format: 'BO3',
    scheduledAt: '2026-08-13T05:00:00Z',
    games: [],
  },
]

export const liveMatch = null
export const upcomingMatches = matches
export const recentMatches: Match[] = []
export const liveGame2 = null
