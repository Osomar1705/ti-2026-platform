// Mock dinámico — simula una partida TI 2026 progresando en tiempo real.
// Se activa con LIVE_MOCK_MODE=true. No consume la API de STRATZ.

import type { LiveMatch, LivePlayer, LiveApiResponse } from './types'
import { heroName } from './hero-names'

// La "partida" avanza dentro de un ciclo de 50 minutos que se repite.
const CYCLE_MS = 50 * 60 * 1000

function mockDuration(): number {
  const elapsed = Date.now() % CYCLE_MS
  return Math.floor(elapsed / 1000)
}

function fmt(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const R_HEROES  = [74, 1, 106, 91, 86]   // Invoker, AM, Ember, Io, Rubick
const D_HEROES  = [17, 49, 97, 29, 22]   // Storm, DK, Magnus, Tide, Zeus

export function getMockLiveResponse(): LiveApiResponse {
  const duration = mockDuration()
  const minute = duration / 60

  // Kills escalan con el tiempo + variación sinusoidal
  const rKills = Math.max(0, Math.floor(minute * 2.4 + Math.sin(minute * 0.7) * 2.5))
  const dKills = Math.max(0, Math.floor(minute * 2.0 + Math.cos(minute * 0.6) * 2.0))

  const players: LivePlayer[] = [
    // Radiant (slot 0-4)
    { slot: 0, isRadiant: true,  heroId: R_HEROES[0], heroName: heroName(R_HEROES[0]), kills: Math.floor(rKills * 0.35), deaths: Math.floor(dKills * 0.15), assists: Math.floor(rKills * 0.6),  netWorth: Math.floor(3200 + minute * 580), level: Math.min(25, Math.floor(1 + minute * 0.9)), gpm: Math.floor(420 + minute * 8),  xpm: Math.floor(480 + minute * 9),  lastHits: Math.floor(minute * 9),  denies: Math.floor(minute * 1.2), items: [50, 254, 63, 0, 0, 0] },
    { slot: 1, isRadiant: true,  heroId: R_HEROES[1], heroName: heroName(R_HEROES[1]), kills: Math.floor(rKills * 0.30), deaths: Math.floor(dKills * 0.12), assists: Math.floor(rKills * 0.3),  netWorth: Math.floor(3500 + minute * 620), level: Math.min(25, Math.floor(1 + minute * 0.9)), gpm: Math.floor(450 + minute * 9),  xpm: Math.floor(460 + minute * 8),  lastHits: Math.floor(minute * 10), denies: Math.floor(minute * 0.8), items: [63, 48, 0, 0, 0, 0] },
    { slot: 2, isRadiant: true,  heroId: R_HEROES[2], heroName: heroName(R_HEROES[2]), kills: Math.floor(rKills * 0.20), deaths: Math.floor(dKills * 0.18), assists: Math.floor(rKills * 0.5),  netWorth: Math.floor(2800 + minute * 480), level: Math.min(25, Math.floor(1 + minute * 0.85)),gpm: Math.floor(380 + minute * 7),  xpm: Math.floor(420 + minute * 7.5),lastHits: Math.floor(minute * 6),  denies: Math.floor(minute * 0.5), items: [36, 0, 0, 0, 0, 0] },
    { slot: 3, isRadiant: true,  heroId: R_HEROES[3], heroName: heroName(R_HEROES[3]), kills: Math.floor(rKills * 0.05), deaths: Math.floor(dKills * 0.20), assists: Math.floor(rKills * 0.8),  netWorth: Math.floor(1400 + minute * 260), level: Math.min(25, Math.floor(1 + minute * 0.75)),gpm: Math.floor(180 + minute * 4),  xpm: Math.floor(300 + minute * 5.5),lastHits: Math.floor(minute * 1.5),denies: Math.floor(minute * 0.2), items: [0, 0, 0, 0, 0, 0] },
    { slot: 4, isRadiant: true,  heroId: R_HEROES[4], heroName: heroName(R_HEROES[4]), kills: Math.floor(rKills * 0.10), deaths: Math.floor(dKills * 0.15), assists: Math.floor(rKills * 0.9),  netWorth: Math.floor(1600 + minute * 290), level: Math.min(25, Math.floor(1 + minute * 0.78)),gpm: Math.floor(200 + minute * 4.5),xpm: Math.floor(320 + minute * 5.8),lastHits: Math.floor(minute * 2),  denies: Math.floor(minute * 0.3), items: [0, 0, 0, 0, 0, 0] },
    // Dire (slot 5-9)
    { slot: 5, isRadiant: false, heroId: D_HEROES[0], heroName: heroName(D_HEROES[0]), kills: Math.floor(dKills * 0.30), deaths: Math.floor(rKills * 0.18), assists: Math.floor(dKills * 0.5),  netWorth: Math.floor(3100 + minute * 560), level: Math.min(25, Math.floor(1 + minute * 0.88)),gpm: Math.floor(410 + minute * 7.8),xpm: Math.floor(460 + minute * 8.5),lastHits: Math.floor(minute * 8.5),denies: Math.floor(minute * 1.1), items: [17, 63, 0, 0, 0, 0] },
    { slot: 6, isRadiant: false, heroId: D_HEROES[1], heroName: heroName(D_HEROES[1]), kills: Math.floor(dKills * 0.25), deaths: Math.floor(rKills * 0.14), assists: Math.floor(dKills * 0.4),  netWorth: Math.floor(3300 + minute * 590), level: Math.min(25, Math.floor(1 + minute * 0.87)),gpm: Math.floor(430 + minute * 8.2),xpm: Math.floor(445 + minute * 7.9),lastHits: Math.floor(minute * 9.2),denies: Math.floor(minute * 0.9), items: [110, 214, 0, 0, 0, 0] },
    { slot: 7, isRadiant: false, heroId: D_HEROES[2], heroName: heroName(D_HEROES[2]), kills: Math.floor(dKills * 0.22), deaths: Math.floor(rKills * 0.20), assists: Math.floor(dKills * 0.6),  netWorth: Math.floor(2700 + minute * 460), level: Math.min(25, Math.floor(1 + minute * 0.83)),gpm: Math.floor(370 + minute * 6.8),xpm: Math.floor(400 + minute * 7.2),lastHits: Math.floor(minute * 5.8),denies: Math.floor(minute * 0.5), items: [36, 0, 0, 0, 0, 0] },
    { slot: 8, isRadiant: false, heroId: D_HEROES[3], heroName: heroName(D_HEROES[3]), kills: Math.floor(dKills * 0.12), deaths: Math.floor(rKills * 0.22), assists: Math.floor(dKills * 0.75), netWorth: Math.floor(1500 + minute * 270), level: Math.min(25, Math.floor(1 + minute * 0.76)),gpm: Math.floor(190 + minute * 4.1),xpm: Math.floor(310 + minute * 5.6),lastHits: Math.floor(minute * 1.6),denies: Math.floor(minute * 0.2), items: [0, 0, 0, 0, 0, 0] },
    { slot: 9, isRadiant: false, heroId: D_HEROES[4], heroName: heroName(D_HEROES[4]), kills: Math.floor(dKills * 0.11), deaths: Math.floor(rKills * 0.16), assists: Math.floor(dKills * 0.85), netWorth: Math.floor(1550 + minute * 280), level: Math.min(25, Math.floor(1 + minute * 0.77)),gpm: Math.floor(195 + minute * 4.2),xpm: Math.floor(315 + minute * 5.7),lastHits: Math.floor(minute * 1.7),denies: Math.floor(minute * 0.3), items: [0, 0, 0, 0, 0, 0] },
  ]

  const rNetWorth = players.filter(p => p.isRadiant).reduce((s, p) => s + p.netWorth, 0)
  const dNetWorth = players.filter(p => !p.isRadiant).reduce((s, p) => s + p.netWorth, 0)

  const match: LiveMatch = {
    matchId: 'mock-ti2026-fal-vs-tl',
    status: 'LIVE',
    duration,
    radiant: { teamId: 8599101, name: 'Team Falcons',   tag: 'FAL', kills: rKills, netWorth: rNetWorth },
    dire:    { teamId: 2163,    name: 'Team Liquid',     tag: 'TL',  kills: dKills, netWorth: dNetWorth },
    players,
    draft: [
      { heroId: R_HEROES[0], heroName: heroName(R_HEROES[0]), isBan: false, isRadiant: true,  order: 0 },
      { heroId: R_HEROES[1], heroName: heroName(R_HEROES[1]), isBan: false, isRadiant: true,  order: 1 },
      { heroId: R_HEROES[2], heroName: heroName(R_HEROES[2]), isBan: false, isRadiant: true,  order: 2 },
      { heroId: R_HEROES[3], heroName: heroName(R_HEROES[3]), isBan: false, isRadiant: true,  order: 3 },
      { heroId: R_HEROES[4], heroName: heroName(R_HEROES[4]), isBan: false, isRadiant: true,  order: 4 },
      { heroId: D_HEROES[0], heroName: heroName(D_HEROES[0]), isBan: false, isRadiant: false, order: 5 },
      { heroId: D_HEROES[1], heroName: heroName(D_HEROES[1]), isBan: false, isRadiant: false, order: 6 },
      { heroId: D_HEROES[2], heroName: heroName(D_HEROES[2]), isBan: false, isRadiant: false, order: 7 },
      { heroId: D_HEROES[3], heroName: heroName(D_HEROES[3]), isBan: false, isRadiant: false, order: 8 },
      { heroId: D_HEROES[4], heroName: heroName(D_HEROES[4]), isBan: false, isRadiant: false, order: 9 },
    ],
    leagueName: 'The International 2026',
    seriesType: 'BO3',
    fetchedAt: Date.now(),
  }

  return {
    matches: [match],
    fetchedAt: Date.now(),
    source: 'MOCK',
  }
}
