import type { Match, GameDetail } from '../types'
import { teams } from './teams'

const ts = teams[0] // Team Spirit
const te = teams[1] // Tundra Esports
const tl = teams[2]
const gg = teams[3]
const ng = teams[4]
const au = teams[5]

const winProbGame2 = [
  { minute: 0, radiant: 50, dire: 50 },
  { minute: 3, radiant: 52, dire: 48 },
  { minute: 6, radiant: 55, dire: 45 },
  { minute: 9, radiant: 53, dire: 47 },
  { minute: 12, radiant: 58, dire: 42 },
  { minute: 15, radiant: 61, dire: 39 },
  { minute: 18, radiant: 59, dire: 41 },
  { minute: 21, radiant: 65, dire: 35 },
  { minute: 24, radiant: 67, dire: 33 },
  { minute: 27, radiant: 68, dire: 32 },
]

const economyGame2 = [
  { minute: 0, radiantNW: 5200, direNW: 5200, radiantXP: 4800, direXP: 4800 },
  { minute: 3, radiantNW: 7800, direNW: 7600, radiantXP: 8200, direXP: 7900 },
  { minute: 6, radiantNW: 12400, direNW: 11800, radiantXP: 14100, direXP: 13500 },
  { minute: 9, radiantNW: 18200, direNW: 17100, radiantXP: 21400, direXP: 20100 },
  { minute: 12, radiantNW: 26500, direNW: 24200, radiantXP: 31800, direXP: 29500 },
  { minute: 15, radiantNW: 36800, direNW: 32900, radiantXP: 44200, direXP: 40100 },
  { minute: 18, radiantNW: 48200, direNW: 43100, radiantXP: 58400, direXP: 53200 },
  { minute: 21, radiantNW: 61900, direNW: 54800, radiantXP: 74100, direXP: 67500 },
  { minute: 24, radiantNW: 77400, direNW: 67200, radiantXP: 91800, direXP: 83200 },
  { minute: 27, radiantNW: 92100, direNW: 79600, radiantXP: 109400, direXP: 98700 },
]

const draftGame2 = [
  { type: 'ban' as const, side: 'radiant' as const, heroId: 'io', order: 1 },
  { type: 'ban' as const, side: 'dire' as const, heroId: 'faceless-void', order: 2 },
  { type: 'ban' as const, side: 'radiant' as const, heroId: 'invoker', order: 3 },
  { type: 'ban' as const, side: 'dire' as const, heroId: 'ember-spirit', order: 4 },
  { type: 'pick' as const, side: 'radiant' as const, heroId: 'pangolier', order: 5, playerId: 'torontotokyo' },
  { type: 'pick' as const, side: 'dire' as const, heroId: 'rubick', order: 6, playerId: 'saksa' },
  { type: 'pick' as const, side: 'radiant' as const, heroId: 'marci', order: 7, playerId: 'mira' },
  { type: 'pick' as const, side: 'dire' as const, heroId: 'tidehunter', order: 8, playerId: '33' },
  { type: 'ban' as const, side: 'radiant' as const, heroId: 'dark-willow', order: 9 },
  { type: 'ban' as const, side: 'dire' as const, heroId: 'skywrath-mage', order: 10 },
  { type: 'ban' as const, side: 'radiant' as const, heroId: 'snapfire', order: 11 },
  { type: 'ban' as const, side: 'dire' as const, heroId: 'ancient-apparition', order: 12 },
  { type: 'pick' as const, side: 'radiant' as const, heroId: 'morphling', order: 13, playerId: 'yatoro' },
  { type: 'pick' as const, side: 'dire' as const, heroId: 'dragon-knight', order: 14, playerId: 'skiter' },
  { type: 'pick' as const, side: 'radiant' as const, heroId: 'primal-beast', order: 15, playerId: 'collapse' },
  { type: 'pick' as const, side: 'dire' as const, heroId: 'puck', order: 16, playerId: 'nine' },
  { type: 'ban' as const, side: 'radiant' as const, heroId: 'enigma', order: 17 },
  { type: 'ban' as const, side: 'dire' as const, heroId: 'earth-spirit', order: 18 },
  { type: 'pick' as const, side: 'radiant' as const, heroId: 'ancient-apparition', order: 19, playerId: 'miroslaw' },
  { type: 'pick' as const, side: 'dire' as const, heroId: 'snapfire', order: 20, playerId: 'sneyking' },
]

const playerStatsGame2 = [
  { playerId: 'yatoro', heroId: 'morphling', kills: 11, deaths: 2, assists: 8, netWorth: 22400, gpm: 830, xpm: 910, lastHits: 224, denies: 18, level: 22, itemIds: ['bfury', 'manta', 'skadi'] },
  { playerId: 'torontotokyo', heroId: 'pangolier', kills: 8, deaths: 3, assists: 14, netWorth: 16200, gpm: 600, xpm: 720, lastHits: 168, denies: 12, level: 20, itemIds: ['orchid', 'blink', 'aghs'] },
  { playerId: 'collapse', heroId: 'primal-beast', kills: 5, deaths: 4, assists: 18, netWorth: 13800, gpm: 512, xpm: 610, lastHits: 122, denies: 8, level: 19, itemIds: ['echo', 'blink', 'hood'] },
  { playerId: 'mira', heroId: 'marci', kills: 4, deaths: 5, assists: 21, netWorth: 9200, gpm: 341, xpm: 480, lastHits: 64, denies: 4, level: 17, itemIds: ['glimmer', 'solar', 'force'] },
  { playerId: 'miroslaw', heroId: 'ancient-apparition', kills: 3, deaths: 6, assists: 22, netWorth: 6800, gpm: 252, xpm: 390, lastHits: 24, denies: 2, level: 15, itemIds: ['urn', 'magic-wand', 'boots'] },
  { playerId: 'skiter', heroId: 'dragon-knight', kills: 6, deaths: 6, assists: 11, netWorth: 17100, gpm: 634, xpm: 740, lastHits: 190, denies: 14, level: 21, itemIds: ['bf', 'bkb', 'assault'] },
  { playerId: 'nine', heroId: 'puck', kills: 7, deaths: 7, assists: 12, netWorth: 13400, gpm: 497, xpm: 680, lastHits: 142, denies: 10, level: 20, itemIds: ['blink', 'orchid', 'lens'] },
  { playerId: '33', heroId: 'tidehunter', kills: 3, deaths: 8, assists: 16, netWorth: 10600, gpm: 393, xpm: 510, lastHits: 98, denies: 6, level: 18, itemIds: ['blink', 'pipe', 'aghs'] },
  { playerId: 'saksa', heroId: 'rubick', kills: 5, deaths: 7, assists: 18, netWorth: 7800, gpm: 289, xpm: 420, lastHits: 42, denies: 3, level: 16, itemIds: ['blink', 'aether', 'force'] },
  { playerId: 'sneyking', heroId: 'snapfire', kills: 2, deaths: 8, assists: 20, netWorth: 5600, gpm: 208, xpm: 330, lastHits: 18, denies: 1, level: 14, itemIds: ['glimmer', 'medallion', 'boots'] },
]

const eventsGame2 = [
  { minute: '03:42', type: 'kill' as const, text: 'Primera sangre', detail: 'Collapse eliminó a 33 en la jungla superior' },
  { minute: '07:18', type: 'tower' as const, text: 'Torre destruida', detail: 'Radiant derriba T1 del carril central' },
  { minute: '11:55', type: 'teamfight' as const, text: 'Teamfight en río', detail: 'Spirit gana 3-1, Yatoro se escapa con 50 HP' },
  { minute: '14:22', type: 'roshan' as const, text: 'Roshan eliminado', detail: 'Team Spirit obtiene Aegis para Yatoro' },
  { minute: '18:44', type: 'tower' as const, text: 'Torre destruida', detail: 'Radiant derriba T2 del carril superior' },
  { minute: '22:10', type: 'teamfight' as const, text: 'Teamfight en highground', detail: 'Spirit 4-2, Tundra defiende el racax' },
  { minute: '25:38', type: 'building' as const, text: 'Barracks derribados', detail: 'Radiant destruye ranged barracks medio' },
  { minute: '27:12', type: 'kill' as const, text: 'Skiter eliminado', detail: 'Yatoro con Aegis activo asegura el pick-off' },
]

export const liveGame2: GameDetail = {
  gameNumber: 2,
  duration: '27:42',
  radiantScore: 31,
  direScore: 24,
  winProbHistory: winProbGame2,
  economyHistory: economyGame2,
  draft: draftGame2,
  playerStats: playerStatsGame2,
  events: eventsGame2,
}

export const matches: Match[] = [
  {
    id: 'ts-vs-te-ub-sf',
    radiant: ts,
    dire: te,
    radiantScore: 1,
    direScore: 0,
    status: 'live',
    phase: 'Bracket Superior · Semifinal',
    format: 'BO3',
    scheduledAt: '2026-08-10T15:00:00Z',
    currentGame: 2,
    games: [liveGame2],
    liveGame: liveGame2,
  },
  {
    id: 'tl-vs-gg-ub-sf',
    radiant: tl,
    dire: gg,
    radiantScore: 0,
    direScore: 0,
    status: 'upcoming',
    phase: 'Bracket Superior · Semifinal',
    format: 'BO3',
    scheduledAt: '2026-08-10T18:30:00Z',
    games: [],
  },
  {
    id: 'ng-vs-au-lb-r2',
    radiant: ng,
    dire: au,
    radiantScore: 0,
    direScore: 0,
    status: 'upcoming',
    phase: 'Bracket Inferior · Ronda 2',
    format: 'BO1',
    scheduledAt: '2026-08-10T21:00:00Z',
    games: [],
  },
  {
    id: 'tl-vs-ng-ub-qf',
    radiant: tl,
    dire: ng,
    radiantScore: 2,
    direScore: 1,
    status: 'finished',
    phase: 'Bracket Superior · Cuartos de final',
    format: 'BO3',
    scheduledAt: '2026-08-09T16:00:00Z',
    games: [],
  },
  {
    id: 'gg-vs-au-ub-qf',
    radiant: gg,
    dire: au,
    radiantScore: 2,
    direScore: 0,
    status: 'finished',
    phase: 'Bracket Superior · Cuartos de final',
    format: 'BO3',
    scheduledAt: '2026-08-09T19:00:00Z',
    games: [],
  },
  {
    id: 'ts-vs-ng-ub-qf',
    radiant: ts,
    dire: ng,
    radiantScore: 2,
    direScore: 0,
    status: 'finished',
    phase: 'Bracket Superior · Cuartos de final',
    format: 'BO3',
    scheduledAt: '2026-08-08T16:00:00Z',
    games: [],
  },
]

export const liveMatch = matches[0]
export const upcomingMatches = matches.filter(m => m.status === 'upcoming')
export const recentMatches = matches.filter(m => m.status === 'finished')
