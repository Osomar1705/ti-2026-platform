'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Trophy, Plus, Trash2, Users, ChevronRight, ArrowLeft, Check,
  ListTree, Layers, Swords, RefreshCw,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Paleta                                                               */
/* ------------------------------------------------------------------ */
const RADIANT = '#4ade80'
const DIRE    = '#f87171'
const GOLD    = '#D4AF37'

/* ------------------------------------------------------------------ */
/*  Utilidades                                                           */
/* ------------------------------------------------------------------ */
const uid = () => Math.random().toString(36).slice(2, 10)
const DATA_AS_OF = '13 de agosto de 2026'

const handleScoreInput = (
  currentScoreA: number,
  currentScoreB: number,
  teamToUpdate: 'A' | 'B',
  newValue: string,
  bestOf: number = 3
) => {
  const winsNeeded = Math.ceil(bestOf / 2);
  let parsedValue = parseInt(newValue, 10);

  if (isNaN(parsedValue) || parsedValue < 0) parsedValue = 0;
  if (parsedValue > winsNeeded) parsedValue = winsNeeded;

  if (teamToUpdate === 'A' && parsedValue === winsNeeded && currentScoreB === winsNeeded) {
    return { scoreA: parsedValue, scoreB: winsNeeded - 1 };
  }
  if (teamToUpdate === 'B' && parsedValue === winsNeeded && currentScoreA === winsNeeded) {
    return { scoreA: winsNeeded - 1, scoreB: parsedValue };
  }

  return {
    scoreA: teamToUpdate === 'A' ? parsedValue : currentScoreA,
    scoreB: teamToUpdate === 'B' ? parsedValue : currentScoreB
  };
};

function seedOrder(size: number): number[] {
  let result = [1, 2]
  while (result.length < size) {
    const newSize = result.length * 2
    const next: number[] = []
    for (const s of result) { next.push(s); next.push(newSize + 1 - s) }
    result = next
  }
  return result
}

function nextPow2(n: number) { let p = 1; while (p < n) p *= 2; return p }

function generateBracket(seedTeamIds: string[]) {
  const size = nextPow2(seedTeamIds.length)
  const order = seedOrder(size)
  const slots = [...seedTeamIds]
  while (slots.length < size) slots.push(null as any)
  const round1Teams = order.map((pos) => slots[pos - 1])
  const round1: any[] = []
  for (let i = 0; i < round1Teams.length; i += 2)
    round1.push({ id: uid(), teamAId: round1Teams[i], teamBId: round1Teams[i + 1], scoreA: 0, scoreB: 0, played: false, winnerId: null, date: null })
  const rounds: any[][] = [round1]
  let count = round1.length
  while (count > 1) {
    count = count / 2
    rounds.push(Array.from({ length: count }, () => ({ id: uid(), teamAId: null, teamBId: null, scoreA: 0, scoreB: 0, played: false, winnerId: null, date: null })))
  }
  return recomputeBracket(rounds)
}

function recomputeBracket(rounds: any[][]) {
  const next = rounds.map((r) => r.map((m: any) => ({ ...m })))
  for (let r = 0; r < next.length - 1; r++) {
    next[r].forEach((m: any, i: number) => {
      let winner: string | null
      if (!m.teamAId) winner = m.teamBId
      else if (!m.teamBId) winner = m.teamAId
      else winner = m.played ? (m.scoreA > m.scoreB ? m.teamAId : m.teamBId) : null
      m.winnerId = winner
      const nextMatch = next[r + 1][Math.floor(i / 2)]
      const slot = i % 2 === 0 ? 'teamAId' : 'teamBId'
      if (nextMatch[slot] !== winner) { nextMatch[slot] = winner; nextMatch.played = false; nextMatch.scoreA = 0; nextMatch.scoreB = 0; nextMatch.winnerId = null }
    })
  }
  return next
}

/* ------------------------------------------------------------------ */
/*  Doble eliminación genérica                                           */
/* ------------------------------------------------------------------ */
function detWinnerLoser(m: any) {
  if (!m.teamAId || !m.teamBId || !m.played) return { winner: null, loser: null }
  if (m.scoreA > m.scoreB) return { winner: m.teamAId, loser: m.teamBId }
  if (m.scoreB > m.scoreA) return { winner: m.teamBId, loser: m.teamAId }
  return { winner: null, loser: null }
}

function mkDEMatch(links: any[], date?: string | null) {
  return { id: uid(), teamAId: null, teamBId: null, scoreA: 0, scoreB: 0, played: false, date: date || null, links: links || [] }
}

// Correct 8-team double-elimination bracket (4 R1 pairs → UB+LB+GF)
// UB: R1(4), SF(2), Final(1)
// LB: R1(2 UBR1 losers), R2(2: LBR1 winners vs UB SF losers), R3(1), LB Final(1)
// Grand Final: UB winner vs LB winner
function generateDoubleElimN(round1Pairs: [string, string][]) {
  const L = (type: string, bracket: string, round: number, idx: number) => ({ type, bracket, round, idx })
  const ub: any[][] = [
    round1Pairs.map(([a, b]) => ({ ...mkDEMatch([]), teamAId: a, teamBId: b })),
    [
      mkDEMatch([L('winner','ub',0,0), L('winner','ub',0,1)]),
      mkDEMatch([L('winner','ub',0,2), L('winner','ub',0,3)]),
    ],
    [mkDEMatch([L('winner','ub',1,0), L('winner','ub',1,1)])],
  ]
  const lb: any[][] = [
    // LB R1: pair UB R1 losers
    [
      mkDEMatch([L('loser','ub',0,0), L('loser','ub',0,1)]),
      mkDEMatch([L('loser','ub',0,2), L('loser','ub',0,3)]),
    ],
    // LB R2: LB R1 winners vs UB SF losers
    [
      mkDEMatch([L('winner','lb',0,0), L('loser','ub',1,0)]),
      mkDEMatch([L('winner','lb',0,1), L('loser','ub',1,1)]),
    ],
    // LB R3: LB R2 winners face each other
    [mkDEMatch([L('winner','lb',1,0), L('winner','lb',1,1)])],
    // LB Final: LB R3 winner vs UB Final loser
    [mkDEMatch([L('winner','lb',2,0), L('loser','ub',2,0)])],
  ]
  const grandFinal = [mkDEMatch([L('winner','ub',2,0), L('winner','lb',3,0)])]
  return recomputeDoubleElimGeneric({ ub, lb, grandFinal })
}

function recomputeDoubleElimGeneric(state: any) {
  const ub = state.ub.map((r: any[]) => r.map((m: any) => ({ ...m })))
  const lb = state.lb.map((r: any[]) => r.map((m: any) => ({ ...m })))
  const grandFinal = state.grandFinal.map((m: any) => ({ ...m }))
  const getMatch = (link: any) => (link.bracket === 'ub' ? ub[link.round][link.idx] : link.bracket === 'lb' ? lb[link.round][link.idx] : grandFinal[0])
  const val = (link: any) => { const wl = detWinnerLoser(getMatch(link)); return link.type === 'winner' ? wl.winner : wl.loser }
  const setSlot = (m: any, slot: string, teamId: any) => { if (m[slot] !== teamId) { m[slot] = teamId; m.played = false; m.scoreA = 0; m.scoreB = 0 } }
  for (let r = 1; r < ub.length; r++) ub[r].forEach((m: any) => { setSlot(m, 'teamAId', val(m.links[0])); setSlot(m, 'teamBId', val(m.links[1])) })
  lb.forEach((round: any[]) => round.forEach((m: any) => { setSlot(m, 'teamAId', val(m.links[0])); setSlot(m, 'teamBId', val(m.links[1])) }))
  setSlot(grandFinal[0], 'teamAId', val(grandFinal[0].links[0]))
  setSlot(grandFinal[0], 'teamBId', val(grandFinal[0].links[1]))
  return { ub, lb, grandFinal }
}

/* ------------------------------------------------------------------ */
/*  Round Robin + Suiza                                                  */
/* ------------------------------------------------------------------ */
function roundRobinMatches(teamIds: string[]) {
  const matches: any[] = []
  for (let i = 0; i < teamIds.length; i++)
    for (let j = i + 1; j < teamIds.length; j++)
      matches.push({ id: uid(), teamAId: teamIds[i], teamBId: teamIds[j], scoreA: 0, scoreB: 0, played: false, date: null })
  return matches
}

function sortByDate(matches: any[]) {
  return matches.map((m, i) => ({ m, i })).sort((a, b) => {
    if (!a.m.date && !b.m.date) return a.i - b.i
    if (!a.m.date) return 1; if (!b.m.date) return -1
    return a.m.date.localeCompare(b.m.date) || a.i - b.i
  }).map((x) => x.m)
}

function splitIntoGroups(teamIds: string[], numGroups: number) {
  const groups: string[][] = Array.from({ length: numGroups }, () => [])
  teamIds.forEach((id, i) => groups[i % numGroups].push(id))
  return groups
}

function calcStandings(group: any, teamsById: Record<string, any>) {
  const table: Record<string, any> = {}
  group.teamIds.forEach((id: string) => { table[id] = { teamId: id, name: teamsById[id]?.name || '?', pj: 0, pg: 0, pp: 0, gf: 0, gc: 0, pts: 0 } })
  group.matches.forEach((m: any) => {
    if (!m.played) return
    const a = table[m.teamAId], b = table[m.teamBId]
    if (!a || !b) return
    a.pj++; b.pj++; a.gf += m.scoreA; a.gc += m.scoreB; b.gf += m.scoreB; b.gc += m.scoreA
    if (m.scoreA > m.scoreB) { a.pg++; a.pts += 1; b.pp++ } else if (m.scoreB > m.scoreA) { b.pg++; b.pts += 1; a.pp++ }
  })
  return Object.values(table).sort((x: any, y: any) => {
    if (y.pts !== x.pts) return y.pts - x.pts
    const dx = x.gf - x.gc, dy = y.gf - y.gc
    if (dy !== dx) return dy - dx
    return y.gf - x.gf
  })
}

function applyResult(matches: any[], byName: Record<string, string>, nameA: string, nameB: string, sa: number, sb: number) {
  return matches.map((m) => {
    if (m.teamAId === byName[nameA] && m.teamBId === byName[nameB]) return { ...m, scoreA: sa, scoreB: sb, played: true }
    if (m.teamAId === byName[nameB] && m.teamBId === byName[nameA]) return { ...m, scoreA: sb, scoreB: sa, played: true }
    return m
  })
}

function applyDate(matches: any[], byName: Record<string, string>, nameA: string, nameB: string, date: string) {
  return matches.map((m) => {
    const isPair = (m.teamAId === byName[nameA] && m.teamBId === byName[nameB]) || (m.teamAId === byName[nameB] && m.teamBId === byName[nameA])
    return isPair ? { ...m, date } : m
  })
}

/* ------------------------------------------------------------------ */
/*  Motor suizo                                                          */
/* ------------------------------------------------------------------ */
function computeSwissRecords(teamIds: string[], rounds: any[][]) {
  const rec: Record<string, { wins: number; losses: number; gamesWon: number; gamesLost: number; opponents: string[] }> = {}
  teamIds.forEach((id) => (rec[id] = { wins: 0, losses: 0, gamesWon: 0, gamesLost: 0, opponents: [] }))
  rounds.flat().forEach((m: any) => {
    if (!m.played) return
    if (m.scoreA > m.scoreB) {
      rec[m.teamAId].wins++; rec[m.teamBId].losses++
    } else if (m.scoreB > m.scoreA) {
      rec[m.teamBId].wins++; rec[m.teamAId].losses++
    }
    rec[m.teamAId].gamesWon += m.scoreA; rec[m.teamAId].gamesLost += m.scoreB
    rec[m.teamBId].gamesWon += m.scoreB; rec[m.teamBId].gamesLost += m.scoreA
    rec[m.teamAId].opponents.push(m.teamBId)
    rec[m.teamBId].opponents.push(m.teamAId)
  })
  return rec
}

function generateSwissRound(teamIds: string[], previousRounds: any[][], pairFilter: ((a: string, b: string) => boolean) | null) {
  const records = computeSwissRecords(teamIds, previousRounds)
  const playedPairs = new Set<string>()
  previousRounds.flat().forEach((m: any) => playedPairs.add([m.teamAId, m.teamBId].sort().join('|')))
  const buckets: Record<number, string[]> = {}
  teamIds.forEach((id) => { const w = records[id].wins; buckets[w] = buckets[w] || []; buckets[w].push(id) })
  const winsKeys = Object.keys(buckets).map(Number).sort((a, b) => b - a)
  const pairs: [string, string][] = []
  let leftover: string[] = []
  const pickOpponent = (a: string, pool: string[]) => {
    // Best: no rematch + passes filter
    let idx = pool.findIndex((b) => !playedPairs.has([a, b].sort().join('|')) && (!pairFilter || pairFilter(a, b)))
    if (idx !== -1) return idx
    // Fallback 1: allow rematch but keep filter (avoid same-group in R4 etc.)
    if (pairFilter) idx = pool.findIndex((b) => pairFilter(a, b))
    if (idx !== -1) return idx
    // Fallback 2: look across the whole remaining pool ignoring filter (last resort)
    idx = pool.findIndex((b) => !playedPairs.has([a, b].sort().join('|')))
    if (idx !== -1) return idx
    return 0
  }
  winsKeys.forEach((w) => {
    let pool = [...leftover, ...buckets[w]]
    leftover = []
    while (pool.length > 1) {
      const a = pool.shift()!
      const idx = pickOpponent(a, pool)
      const b = pool.splice(idx, 1)[0]
      pairs.push([a, b])
      playedPairs.add([a, b].sort().join('|'))
    }
    if (pool.length === 1) leftover = pool
  })
  for (let i = 0; i + 1 < leftover.length; i += 2) pairs.push([leftover[i], leftover[i + 1]])
  return pairs.map(([a, b]) => ({ id: uid(), teamAId: a, teamBId: b, scoreA: 0, scoreB: 0, played: false, date: null }))
}

function swissStandings(teamIds: string[], rounds: any[][], teamsById: Record<string, any>) {
  const records = computeSwissRecords(teamIds, rounds)
  // Buchholz: sum of opponents' series wins
  const buchholz = (id: string) => records[id].opponents.reduce((acc, opp) => acc + (records[opp]?.wins ?? 0), 0)
  // Game win %
  const gwp = (id: string) => { const t = records[id].gamesWon + records[id].gamesLost; return t > 0 ? records[id].gamesWon / t : 0 }
  return teamIds
    .map((id) => ({ teamId: id, name: teamsById[id]?.name || '?', ...records[id] }))
    .sort((a, b) =>
      (b.wins - a.wins) ||                    // 1. series ganadas
      (a.losses - b.losses) ||               // 2. series perdidas (menos es mejor)
      (buchholz(b.teamId) - buchholz(a.teamId)) || // 3. Buchholz (wins de oponentes)
      (gwp(b.teamId) - gwp(a.teamId))        // 4. game win %
    )
}

function generateEliminationRoundMatches(rankedIds: string[]) {
  const n = rankedIds.length
  const matches: any[] = []
  for (let i = 0; i < n / 2; i++) matches.push({ id: uid(), teamAId: rankedIds[i], teamBId: rankedIds[n - 1 - i], scoreA: 0, scoreB: 0, played: false, date: null })
  return matches
}

/* ------------------------------------------------------------------ */
/*  Datos TI 2026                                                        */
/* ------------------------------------------------------------------ */
const SWISS_ROUNDS = 5
const TI_2026_TEAMS = [
  'Team Falcons','Team Liquid','Iron Wing','Aurora Gaming','Team Yandex','BoomBoys','Xtreme Gaming',
  'Team Spirit','Team Vision','HULIGANI','Nigma Galaxy','Team Resilience','Vici Gaming','OG','GamerLegion','LGD Gaming',
]
const TI_2026_ROUND1: [string, string, string][] = [
  ['Team Falcons','LGD Gaming','2026-08-13T10:00'],
  ['Iron Wing','Nigma Galaxy','2026-08-13T10:00'],
  ['BoomBoys','OG','2026-08-13T10:00'],
  ['Team Vision','Team Resilience','2026-08-13T10:00'],
  ['Team Spirit','Xtreme Gaming','2026-08-13T13:00'],
  ['Team Liquid','Vici Gaming','2026-08-13T13:00'],
  ['Aurora Gaming','GamerLegion','2026-08-13T13:00'],
  ['Team Yandex','HULIGANI','2026-08-13T13:00'],
]
const TI_2026_INITIAL_GROUPS: Record<string, string[]> = {
  G1: ['Team Falcons','LGD Gaming','Team Spirit','Xtreme Gaming','Iron Wing','Nigma Galaxy','Team Liquid','Vici Gaming'],
  G2: ['BoomBoys','OG','Team Vision','Team Resilience','Aurora Gaming','GamerLegion','Team Yandex','HULIGANI'],
}
const TI_2026_RULES = {
  tiebreakers: ['Porcentaje de partidas ganadas (games won %)','Total de partidos ganados por los rivales enfrentados','Porcentaje promedio de partidas ganadas por los rivales enfrentados','Duración promedio de partida (más corta es mejor)','Cara o sello'],
  swissPairing: ['Los pares se forman entre equipos con el mismo récord.','Se evitan revanchas (mismos rivales) en la medida de lo posible.','Se minimiza la distancia en la tabla entre los equipos emparejados.','Ronda 1: los 16 equipos se dividen en 2 grupos de 8 fijados por el organizador.','Rondas 2 y 3: los cruces se dan solo dentro del grupo inicial.','Ronda 4: los cruces son obligatoriamente entre equipos de distinto grupo inicial.','Ronda 5: sin restricciones de grupo, reglas estándar de suizo.'],
  eliminationRound: ['Participan los puestos 4° al 13° de la fase suiza (10 equipos), 5 avanzan a playoffs.','El mejor equipo con récord 3-2 elige a cuál de los cinco equipos 2-3 quiere enfrentar.','El siguiente mejor 3-2 elige entre los 2-3 restantes, y así sucesivamente.','En este simulador el emparejamiento se genera automáticamente por posición como aproximación.'],
  playoffs: ['8 equipos: los 3 primeros de la fase suiza + los 5 que avanzan de la ronda de eliminación.','Formato de doble eliminación (Upper Bracket / Lower Bracket).','Todos los partidos son Bo3, excepto la Gran Final que es Bo5.'],
}
const TI_2026_ROSTERS: Record<string, { nick: string; country: string }[]> = {
  'Aurora Gaming':[{nick:'Nightfall',country:'Rusia'},{nick:'Mikoto',country:'Indonesia'},{nick:'Ws',country:'Malasia'},{nick:'Mira',country:'Ucrania'},{nick:'kaori',country:'Ucrania'}],
  'BoomBoys':[{nick:'Kiritych~',country:'Rusia'},{nick:'gpk',country:'Rusia'},{nick:'MieRo',country:'Rusia'},{nick:'Save-',country:'Moldavia'},{nick:'Kataomi',country:'Rusia'}],
  'Team Falcons':[{nick:'skiter',country:'Eslovaquia'},{nick:'Malr1ne',country:'Rusia'},{nick:'ATF',country:'Jordania'},{nick:'Cr1t-',country:'Dinamarca'},{nick:'Sneyking',country:'Estados Unidos'}],
  'Team Liquid':[{nick:'m1CKe',country:'Suecia'},{nick:'Nisha',country:'Polonia'},{nick:'Ace',country:'Dinamarca'},{nick:'Boxi',country:'Suecia'},{nick:'tOfu',country:'Alemania'}],
  'Iron Wing':[{nick:'Pure',country:'Rusia'},{nick:'bzm',country:'Bulgaria'},{nick:'33',country:'Israel'},{nick:'Ari',country:'Reino Unido'},{nick:'Whitemon',country:'Indonesia'}],
  'Xtreme Gaming':[{nick:'Ame',country:'China'},{nick:'NothingToSay',country:'Malasia'},{nick:'Xxs',country:'China'},{nick:'fy',country:'China'},{nick:'xNova',country:'Malasia'}],
  'Team Yandex':[{nick:'watson',country:'Kazajistán'},{nick:'CHIRA_JUNIOR',country:'Rusia'},{nick:'DM',country:'Rusia'},{nick:'Saksa',country:'Macedonia del Norte'},{nick:'Malady',country:'Kazajistán'}],
  'Team Spirit':[{nick:'Yatoro',country:'Ucrania'},{nick:'Larl',country:'Rusia'},{nick:'Collapse',country:'Rusia'},{nick:'not me',country:'Rusia'},{nick:'rue',country:'Rusia'}],
  'Team Vision':[{nick:'Satanic',country:'Rusia'},{nick:'No[o]ne-',country:'Ucrania'},{nick:'Noticed',country:'Rusia'},{nick:'9Class',country:'Rusia'},{nick:'Dukalis',country:'Rusia'}],
  'Nigma Galaxy':[{nick:'Suma1L-',country:'Pakistán'},{nick:'Lorenof',country:'Ucrania'},{nick:'Davai Lama',country:'Bélgica'},{nick:'OmaR',country:'Líbano'},{nick:'GH',country:'Líbano'}],
  'HULIGANI':[{nick:'ssnovv1',country:'Rusia'},{nick:"Mirage`",country:'Kazajistán'},{nick:'Corrupted',country:'Rusia'},{nick:'sayuw',country:'Rusia'},{nick:'RESPECT',country:'Bielorrusia'}],
  'Team Resilience':[{nick:'Erika',country:'China'},{nick:'EchozZ',country:'China'},{nick:'niu',country:'China'},{nick:'planet',country:'China'},{nick:'zzq',country:'China'}],
  'Vici Gaming':[{nick:'shiro',country:'China'},{nick:'Xm',country:'China'},{nick:'Bach',country:'China'},{nick:'XinQ',country:'China'},{nick:"y`",country:'China'}],
  'OG':[{nick:'Natsumi-',country:'Filipinas'},{nick:'Yopaj-',country:'Filipinas'},{nick:"Raven^",country:'Filipinas'},{nick:'TIMS',country:'Filipinas'},{nick:'skem',country:'Filipinas'}],
  'LGD Gaming':[{nick:'Yuma',country:'Nicaragua'},{nick:'Topson',country:'Finlandia'},{nick:'Wisper',country:'Bolivia'},{nick:'Thiolicor',country:'Brasil'},{nick:'KJ',country:'Brasil'}],
  'GamerLegion':[{nick:'Ghost',country:'Malasia'},{nick:'RCY',country:'Estados Unidos'},{nick:'Fayde',country:'Estados Unidos'},{nick:'Bignum',country:'Ucrania'},{nick:'Speeed',country:'Estados Unidos'}],
}

function buildTI2026() {
  const teams = TI_2026_TEAMS.map((n) => ({ id: uid(), name: n, roster: TI_2026_ROSTERS[n] || null }))
  const byName = Object.fromEntries(teams.map((t) => [t.name, t.id]))
  const round1 = TI_2026_ROUND1.map(([a, b, date]) => ({ id: uid(), teamAId: byName[a], teamBId: byName[b], scoreA: 0, scoreB: 0, played: false, date }))
  const initialGroupOf: Record<string, string> = {}
  TI_2026_INITIAL_GROUPS.G1.forEach((n) => { initialGroupOf[byName[n]] = 'G1' })
  TI_2026_INITIAL_GROUPS.G2.forEach((n) => { initialGroupOf[byName[n]] = 'G2' })
  const prizePool = [
    { place: 'Total', amount: '$2,905,798 USD' },
    { place: '1°',    amount: 'A definir' },
    { place: '2°',    amount: 'A definir' },
    { place: '3°',    amount: 'A definir' },
    { place: '4°',    amount: 'A definir' },
    { place: '5–6°',  amount: 'A definir' },
    { place: '7–8°',  amount: 'A definir' },
  ]
  return { id: uid(), presetKey: 'ti2026', name: 'The International 2026', teams, format: 'ti_swiss', swiss: { rounds: [round1] }, initialGroupOf, eliminationRound: null, bracket: null, prizePool }
}

const PRESETS = [
  { key: 'ti2026', label: 'The International 2026', desc: '16 equipos · grupos en línea 12–16 ago · Main Event Shanghai 19–23 ago', build: buildTI2026 },
]

const MANUAL_TEMPLATES = [
  { key: 'grupo_unico', label: 'Round robin simple', desc: 'Un solo grupo, todos contra todos', teams: 6, numGroups: 1, qualifiers: 4, format: 'groups' },
  { key: 'grupos_playoffs', label: 'Grupos + Playoffs', desc: '2 grupos, top 4 avanza a bracket', teams: 12, numGroups: 2, qualifiers: 4, format: 'both' },
  { key: 'major', label: 'Estilo Major (16 equipos)', desc: '4 grupos, top 2 a bracket eliminatorio', teams: 16, numGroups: 4, qualifiers: 2, format: 'both' },
  { key: 'bracket_solo', label: 'Solo eliminación directa', desc: '8 equipos, bracket puro', teams: 8, numGroups: 0, qualifiers: 0, format: 'bracket' },
]

/* ------------------------------------------------------------------ */
/*  Persistencia localStorage                                            */
/* ------------------------------------------------------------------ */
function useStorage(): [any[], React.Dispatch<React.SetStateAction<any[]>>, boolean] {
  const [tournaments, setTournaments] = useState<any[]>([])
  const [ready, setReady] = useState(false)
  const loaded = useRef(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pancho_tournaments')
      if (raw) setTournaments(JSON.parse(raw))
    } catch {}
    loaded.current = true
    setReady(true)
  }, [])

  useEffect(() => {
    if (!loaded.current) return
    try { localStorage.setItem('pancho_tournaments', JSON.stringify(tournaments)) } catch {}
  }, [tournaments])

  return [tournaments, setTournaments, ready]
}

/* ------------------------------------------------------------------ */
/*  Helpers de bandera y fecha                                           */
/* ------------------------------------------------------------------ */
const COUNTRY_FLAGS: Record<string, string> = {
  'türkiye':'🇹🇷','turkey':'🇹🇷','iran':'🇮🇷','kazakhstan':'🇰🇿','kazajistán':'🇰🇿',
  'lebanon':'🇱🇧','líbano':'🇱🇧','peru':'🇵🇪','perú':'🇵🇪','philippines':'🇵🇭','filipinas':'🇵🇭',
  'ukraine':'🇺🇦','ucrania':'🇺🇦','estonia':'🇪🇪','serbia':'🇷🇸','greece':'🇬🇷','grecia':'🇬🇷',
  'belarus':'🇧🇾','bielorrusia':'🇧🇾','bolivia':'🇧🇴','mongolia':'🇲🇳',
  'russia':'🇷🇺','rusia':'🇷🇺','indonesia':'🇮🇩','malaysia':'🇲🇾','malasia':'🇲🇾',
  'moldova':'🇲🇩','moldavia':'🇲🇩','slovakia':'🇸🇰','eslovaquia':'🇸🇰','jordan':'🇯🇴','jordania':'🇯🇴',
  'denmark':'🇩🇰','dinamarca':'🇩🇰','united states':'🇺🇸','estados unidos':'🇺🇸',
  'poland':'🇵🇱','polonia':'🇵🇱','sweden':'🇸🇪','suecia':'🇸🇪','germany':'🇩🇪','alemania':'🇩🇪',
  'bulgaria':'🇧🇬','israel':'🇮🇱','united kingdom':'🇬🇧','reino unido':'🇬🇧','china':'🇨🇳',
  'north macedonia':'🇲🇰','macedonia del norte':'🇲🇰','pakistan':'🇵🇰','pakistán':'🇵🇰',
  'belgium':'🇧🇪','bélgica':'🇧🇪','nicaragua':'🇳🇮','finland':'🇫🇮','finlandia':'🇫🇮','brazil':'🇧🇷','brasil':'🇧🇷',
}
function countryFlag(country: string) { return COUNTRY_FLAGS[country?.trim().toLowerCase()] || '' }
function formatDate(iso: string | null) {
  if (!iso) return null
  const d = new Date(iso)
  if (isNaN(d.getTime())) return null
  return d.toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

/* ------------------------------------------------------------------ */
/*  Tokens de diseño                                                     */
/* ------------------------------------------------------------------ */
const C = {
  bg:      '#0c0a07',
  surface: '#161208',
  card:    '#1c1610',
  border:  'rgba(212,175,55,0.15)',
  borderHover: 'rgba(212,175,55,0.30)',
  text:    '#F5F1E8',
  muted:   '#8A7A5A',
  faint:   '#4a3f28',
  gold:    '#D4AF37',
  radiant: '#4ade80',
  dire:    '#f87171',
}

const s = {
  wrap:     { background: C.bg, color: C.text, fontFamily: "system-ui, -apple-system, sans-serif", padding: 24, borderRadius: 12, minHeight: 400 } as React.CSSProperties,
  h2:       { fontSize: 18, fontWeight: 700, margin: '0 0 12px', color: C.text } as React.CSSProperties,
  h3:       { fontSize: 14, fontWeight: 600, margin: '0 0 8px', color: C.gold, textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
  label:    { display: 'block', fontSize: 12, color: C.muted, marginBottom: 4, marginTop: 12 } as React.CSSProperties,
  input:    { width: '100%', padding: '8px 10px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: C.text, fontSize: 14, boxSizing: 'border-box' as const },
  primaryBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: C.gold, color: '#0c0a07', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer' } as React.CSSProperties,
  backBtn:  { display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: C.muted, fontSize: 13, cursor: 'pointer', padding: '4px 0', marginBottom: 8 } as React.CSSProperties,
  card:     { padding: '10px 14px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, cursor: 'pointer', textAlign: 'left' as const },
  table:    { width: '100%', borderCollapse: 'collapse' as const, fontSize: 13, marginBottom: 8 },
  th:       { padding: '6px 8px', borderBottom: `1px solid ${C.border}`, color: C.muted, fontWeight: 600, textAlign: 'center' as const, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
  td:       { padding: '6px 8px', borderBottom: `1px solid rgba(212,175,55,0.07)`, textAlign: 'center' as const },
  scoreInput: { width: 40, padding: '4px 6px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, color: C.text, textAlign: 'center' as const } as React.CSSProperties,
  saveBtn:  { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '4px 8px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, color: C.radiant, cursor: 'pointer', fontSize: 12 } as React.CSSProperties,
}

/* ------------------------------------------------------------------ */
/*  Componentes pequeños                                                 */
/* ------------------------------------------------------------------ */
function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4, background: color + '22', color, border: `1px solid ${color}44` }}>{children}</span>
}

function TeamName({ teamsById, id }: { teamsById: Record<string, any>; id: string | null }) {
  if (!id) return <span style={{ color: C.faint, fontStyle: 'italic' }}>por definir</span>
  return <span>{teamsById[id]?.name || '?'}</span>
}

/* ------------------------------------------------------------------ */
/*  MatchRow                                                          */
/* ------------------------------------------------------------------ */
function MatchRow({ match, teamsById, onSave, onDateChange }: any) {
  const [sa, setSa] = useState<number | ''>(match.scoreA)
  const [sb, setSb] = useState<number | ''>(match.scoreB)
  const [dirty, setDirty] = useState(false)

  const nameA = teamsById[match.teamAId]?.name || '?'
  const nameB = teamsById[match.teamBId]?.name || '?'
  const scoreA = sa === '' ? 0 : (sa as number)
  const scoreB = sb === '' ? 0 : (sb as number)

  // 1. Calculamos dinámicamente cuántas victorias se necesitan (Ej: Bo3 = 2, Bo5 = 3)
  const bestOf = match.bestOf || 3
  const winsNeeded = Math.ceil(bestOf / 2)

  // 2. Función de validación cruzada estricta
  const handleScoreChange = (teamToUpdate: 'A' | 'B') => (e: any) => {
    const v = e.target.value
    
    // Si el usuario borra el contenido
    if (v === '') { 
      if (teamToUpdate === 'A') setSa('')
      else setSb('')
      setDirty(true)
      return 
    }

    let parsedValue = parseInt(v, 10)
    if (isNaN(parsedValue) || parsedValue < 0) parsedValue = 0
    if (parsedValue > winsNeeded) parsedValue = winsNeeded

    let newScoreA = scoreA
    let newScoreB = scoreB

    // Lógica para prevenir empates imposibles (Ej: evitar 2-2 en un Bo3)
    if (teamToUpdate === 'A') {
      newScoreA = parsedValue
      if (newScoreA === winsNeeded && scoreB === winsNeeded) {
        newScoreB = winsNeeded - 1
      }
    } else {
      newScoreB = parsedValue
      if (newScoreB === winsNeeded && scoreA === winsNeeded) {
        newScoreA = winsNeeded - 1
      }
    }

    // Actualizamos ambos estados al mismo tiempo
    setSa(newScoreA)
    setSb(newScoreB)
    setDirty(true)
  }

  const handleSave = () => {
    onSave(scoreA, scoreB)
    setDirty(false)
  }

  // Auto-save when scores form a clear result (one side > 0, total ≥ 1)
  useEffect(() => {
    if (!dirty) return
    const total = scoreA + scoreB
    if (total > 0 && scoreA !== scoreB) {
      const t = setTimeout(() => { onSave(scoreA, scoreB); setDirty(false) }, 600)
      return () => clearTimeout(t)
    }
  }, [sa, sb, dirty]) // eslint-disable-line

  const aWin = match.played && match.scoreA > match.scoreB
  const bWin = match.played && match.scoreB > match.scoreA

  return (
    <div style={{ borderBottom: `1px solid rgba(212,175,55,0.08)`, padding: '5px 4px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
        {/* Team A */}
        <span style={{ flex: 1, textAlign: 'right', fontWeight: aWin ? 700 : 400, color: aWin ? C.radiant : C.text }}>{nameA}</span>
        
        {/* Scores - Ahora usan handleScoreChange y el max dinámico */}
        <input 
          type="number" 
          min={0} 
          max={winsNeeded} 
          value={sa} 
          onFocus={(e) => e.currentTarget.select()} 
          onChange={handleScoreChange('A')} 
          onBlur={() => sa === '' && setSa(0)} 
          style={s.scoreInput} 
        />
        <span style={{ color: C.faint, fontSize: 11 }}>–</span>
        <input 
          type="number" 
          min={0} 
          max={winsNeeded} 
          value={sb} 
          onFocus={(e) => e.currentTarget.select()} 
          onChange={handleScoreChange('B')} 
          onBlur={() => sb === '' && setSb(0)} 
          style={s.scoreInput} 
        />
        
        {/* Team B */}
        <span style={{ flex: 1, fontWeight: bWin ? 700 : 400, color: bWin ? C.radiant : C.text }}>{nameB}</span>
        
        {/* Save button */}
        <button
          onClick={handleSave}
          style={{ ...s.saveBtn, background: dirty ? C.gold + '22' : C.surface, borderColor: dirty ? C.gold + '88' : C.border, color: dirty ? C.gold : C.radiant, minWidth: 32 }}
          title="Guardar resultado"
        >
          <Check size={13} />
        </button>
        
        {/* Status badge */}
        {match.played && !dirty && <Badge color={aWin || bWin ? C.radiant : C.muted}>{aWin ? `✓ ${nameA}` : bWin ? `✓ ${nameB}` : 'jugado'}</Badge>}
      </div>
      
      {onDateChange && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <span style={{ fontSize: 10, color: C.faint }}>{match.date ? formatDate(match.date) : ''}</span>
          <input type="datetime-local" value={match.date || ''} onChange={(e) => onDateChange(e.target.value || null)}
            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, color: C.muted, fontSize: 10, padding: '1px 4px' }} />
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  GroupsView                                                           */
/* ------------------------------------------------------------------ */
function GroupsView({ tournament, updateTournament }: any) {
  const teamsById = Object.fromEntries(tournament.teams.map((t: any) => [t.id, t]))
  const setMatchResult = (groupId: string, matchId: string, scoreA: number, scoreB: number) => {
    const groups = tournament.groups.map((g: any) => g.id !== groupId ? g : { ...g, matches: g.matches.map((m: any) => m.id === matchId ? { ...m, scoreA, scoreB, played: true } : m) })
    updateTournament({ ...tournament, groups })
  }
  const setMatchDate = (groupId: string, matchId: string, date: string | null) => {
    const groups = tournament.groups.map((g: any) => g.id !== groupId ? g : { ...g, matches: g.matches.map((m: any) => m.id === matchId ? { ...m, date } : m) })
    updateTournament({ ...tournament, groups })
  }
  const allPlayed = tournament.groups.every((g: any) => g.matches.every((m: any) => m.played))
  const generatePlayoffs = () => {
    const seeds: string[] = []
    const standingsByGroup = tournament.groups.map((g: any) => calcStandings(g, teamsById as any))
    const maxRank = tournament.qualifiers || Math.max(...standingsByGroup.map((s: any) => s.length))
    for (let rank = 0; rank < maxRank; rank++) standingsByGroup.forEach((s: any) => { if (s[rank]) seeds.push((s[rank] as any).teamId) })
    updateTournament({ ...tournament, bracket: generateBracket(seeds) })
  }
  const hasPlayoffs = !!tournament.bracket
  return (
    <div>
      {tournament.groups.map((group: any) => {
        const standings = calcStandings(group, teamsById as any)
        const groupComplete = group.matches.every((m: any) => m.played)
        return (
          <div key={group.id} style={{ marginBottom: 32 }}>
            <h3 style={s.h3}>{group.name}</h3>
            <table style={s.table}>
              <thead><tr><th style={s.th}>#</th><th style={{ ...s.th, textAlign: 'left' }}>Equipo</th><th style={s.th}>PJ</th><th style={s.th}>PG</th><th style={s.th}>PP</th><th style={s.th}>Dif</th><th style={s.th}>Pts</th></tr></thead>
              <tbody>
                {standings.map((row: any, i: number) => {
                  const advanced = groupComplete && i < (tournament.qualifiers || 0)
                  const eliminated = groupComplete && i >= (tournament.qualifiers || 0) && (tournament.qualifiers || 0) > 0
                  const rowColor = advanced ? C.radiant : eliminated ? C.dire : C.text
                  const rowBg = advanced ? C.radiant + '18' : eliminated ? C.dire + '14' : 'transparent'
                  return (
                    <tr key={row.teamId} style={{ background: rowBg }}>
                      <td style={s.td}>{i + 1}</td>
                      <td style={{ ...s.td, textAlign: 'left', fontWeight: 600, color: rowColor }}>{row.name}</td>
                      <td style={s.td}>{row.pj}</td><td style={s.td}>{row.pg}</td><td style={s.td}>{row.pp}</td>
                      <td style={s.td}>{row.gf - row.gc > 0 ? '+' : ''}{row.gf - row.gc}</td>
                      <td style={{ ...s.td, fontWeight: 700, color: C.gold }}>{row.pts}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div style={{ marginTop: 12 }}>
              {sortByDate(group.matches).map((m: any) => (
                <MatchRow key={m.id} match={m} teamsById={teamsById} onSave={(sa: number, sb: number) => setMatchResult(group.id, m.id, sa, sb)} onDateChange={(date: string | null) => setMatchDate(group.id, m.id, date)} />
              ))}
            </div>
          </div>
        )
      })}
      {tournament.format === 'both' && (
        <button onClick={generatePlayoffs} style={s.primaryBtn}><ListTree size={16} /> {hasPlayoffs ? 'Regenerar playoffs' : 'Generar playoffs'}</button>
      )}
      {tournament.format === 'both' && !allPlayed && (
        <p style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>Los grupos aún no están completos — los clasificados pueden cambiar.</p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  BracketMatch                                                         */
/* ------------------------------------------------------------------ */
function BracketMatch({ match, teamsById, onSave }: any) {
  const [sa, setSa] = useState(match.scoreA)
  const [sb, setSb] = useState(match.scoreB)
  const canPlay = match.teamAId && match.teamBId
  const aWon = match.played && match.scoreA > match.scoreB
  const bWon = match.played && match.scoreB > match.scoreA
  const scoreA = sa === '' ? 0 : sa; const scoreB = sb === '' ? 0 : sb
  const onChg = (setter: any) => (e: any) => { const v = e.target.value; if (v === '') { setter(''); return }; setter(Math.min(3, Math.max(0, parseInt(v) || 0))) }
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, background: C.card, overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', borderBottom: `1px solid ${C.border}`, background: aWon ? C.radiant + '18' : 'transparent' }}>
        <span style={{ fontSize: 13, fontWeight: aWon ? 700 : 400, color: aWon ? C.radiant : match.teamAId ? C.text : C.faint }}><TeamName teamsById={teamsById} id={match.teamAId} /></span>
        {canPlay && <input type="number" min={0} max={3} value={sa} onFocus={(e) => e.currentTarget.select()} onChange={onChg(setSa)} onBlur={() => sa === '' && setSa(0)} style={{ ...s.scoreInput, width: 42, padding: '4px 2px' }} />}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px', background: bWon ? C.radiant + '18' : 'transparent' }}>
        <span style={{ fontSize: 13, fontWeight: bWon ? 700 : 400, color: bWon ? C.radiant : match.teamBId ? C.text : C.faint }}><TeamName teamsById={teamsById} id={match.teamBId} /></span>
        {canPlay && <input type="number" min={0} max={3} value={sb} onFocus={(e) => e.currentTarget.select()} onChange={onChg(setSb)} onBlur={() => sb === '' && setSb(0)} style={{ ...s.scoreInput, width: 42, padding: '4px 2px' }} />}
      </div>
      {canPlay && <button onClick={() => onSave(scoreA, scoreB)} style={{ ...s.saveBtn, width: '100%', borderRadius: 0, borderTop: `1px solid ${C.border}`, justifyContent: 'center' }}><Check size={12} /> guardar</button>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  BracketView (single elim)                                            */
/* ------------------------------------------------------------------ */
function BracketView({ bracket, teamsById, onUpdateBracket, title }: any) {
  const setMatchResult = (ri: number, mi: number, scoreA: number, scoreB: number) => {
    const rounds = bracket.map((r: any[]) => r.map((m: any) => ({ ...m })))
    rounds[ri][mi] = { ...rounds[ri][mi], scoreA, scoreB, played: true }
    onUpdateBracket(recomputeBracket(rounds))
  }
  const roundNames = (total: number, idx: number) => { const r = total - idx; if (r === 1) return 'Gran Final'; if (r === 2) return 'Semifinales'; if (r === 3) return 'Cuartos de Final'; return `Ronda ${idx + 1}` }
  const champion = bracket.length ? bracket[bracket.length - 1][0]?.winnerId : null
  return (
    <div>
      {title && <h3 style={s.h3}>{title}</h3>}
      {champion && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '12px 16px', background: C.gold + '18', border: `1px solid ${C.gold}44`, borderRadius: 8 }}><Trophy size={20} color={C.gold} /><span style={{ fontWeight: 700, color: C.gold }}>Campeón: {teamsById[champion]?.name}</span></div>}
      <div style={{ display: 'flex', gap: 32, overflowX: 'auto', paddingBottom: 8 }}>
        {bracket.map((round: any[], ri: number) => (
          <div key={ri} style={{ minWidth: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', gap: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: C.muted, textAlign: 'center' }}>{roundNames(bracket.length, ri)}</div>
            {round.map((m: any, mi: number) => <BracketMatch key={m.id} match={m} teamsById={teamsById} onSave={(sa: number, sb: number) => setMatchResult(ri, mi, sa, sb)} />)}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Double Elim layout                                                   */
/* ------------------------------------------------------------------ */
const CW = 210, COLGAP = 70, SLOT = 100, ROWGAP = 90, CARD_H = 90, TOP_PAD = 36
const colX = (i: number) => i * (CW + COLGAP)
const laneY = (i: number, n: number, offset: number, H: number) => offset + (H * (i + 0.5)) / n

function roundLabel(prefix: string, r: number, total: number) {
  const remaining = total - r
  if (remaining === 1) return `${prefix} Final`
  if (remaining === 2) return `${prefix} Semis`
  if (remaining === 3) return `${prefix} Cuartos`
  return `${prefix} Ronda ${r + 1}`
}

function buildDELayout(bracket: any) {
  const k = bracket.ub.length; const lbRounds = bracket.lb.length
  const H = SLOT * bracket.ub[0].length; const LB_Y0 = H + ROWGAP + TOP_PAD
  const pos: Record<string, any> = {}
  bracket.ub.forEach((round: any[], r: number) => round.forEach((m: any, i: number) => { pos[m.id] = { x: colX(r), y: laneY(i, round.length, TOP_PAD, H), m, bracketKey: 'ub', round: r, idx: i } }))
  bracket.lb.forEach((round: any[], r: number) => round.forEach((m: any, i: number) => { pos[m.id] = { x: colX(r), y: laneY(i, round.length, LB_Y0, H), m, bracketKey: 'lb', round: r, idx: i } }))
  const ubFinalM = bracket.ub[k - 1][0], lbFinalM = bracket.lb[lbRounds - 1][0]
  const gfCol = Math.max(k, lbRounds); const gfY = (pos[ubFinalM.id].y + pos[lbFinalM.id].y) / 2
  pos[bracket.grandFinal[0].id] = { x: colX(gfCol), y: gfY, m: bracket.grandFinal[0], bracketKey: 'grandFinal', round: 0, idx: 0 }
  const findMatch = (link: any) => (link.bracket === 'ub' ? bracket.ub[link.round][link.idx] : link.bracket === 'lb' ? bracket.lb[link.round][link.idx] : bracket.grandFinal[0])
  const edges: any[] = []
  ;[...bracket.ub.flat(), ...bracket.lb.flat(), ...bracket.grandFinal].forEach((m: any) => { if (m.links && m.links.length) edges.push([m.links.map(findMatch), m]) })
  const headers: any[] = []
  bracket.ub.forEach((_: any, r: number) => headers.push({ x: colX(r), y: TOP_PAD - 30, label: roundLabel('Upper', r, k), color: C.radiant }))
  bracket.lb.forEach((_: any, r: number) => headers.push({ x: colX(r), y: LB_Y0 - 30, label: roundLabel('Lower', r, lbRounds), color: C.dire }))
  headers.push({ x: colX(gfCol), y: TOP_PAD - 30, label: 'Gran Final (Bo5)', color: C.gold })
  return { pos, edges, headers, width: colX(gfCol) + CW + 20, height: LB_Y0 + H + 60 }
}

function ConnectorSvg({ pos, edges, width, height }: any) {
  const paths: React.ReactNode[] = []
  edges.forEach(([ sources, dest ]: any, ei: number) => {
    const d = pos[dest.id]; if (!d) return
    const destX = d.x, destY = d.y, xMid = destX - COLGAP / 2, ys: number[] = []
    sources.forEach((src: any, si: number) => {
      const sp = pos[src.id]; if (!sp) return
      ys.push(sp.y)
      paths.push(<line key={`${ei}-h${si}`} x1={sp.x + CW} y1={sp.y} x2={xMid} y2={sp.y} stroke={C.border} strokeWidth={2} />)
    })
    ys.push(destY)
    const yTop = Math.min(...ys), yBot = Math.max(...ys)
    if (yTop !== yBot) paths.push(<line key={`${ei}-v`} x1={xMid} y1={yTop} x2={xMid} y2={yBot} stroke={C.border} strokeWidth={2} />)
    paths.push(<line key={`${ei}-out`} x1={xMid} y1={destY} x2={destX} y2={destY} stroke={C.border} strokeWidth={2} />)
  })
  return <svg width={width} height={height} style={{ position: 'absolute', top: 0, left: 0 }}>{paths}</svg>
}

function simulateBracketFull(bracket: any): any {
  // Simulate all matches in order: UB rounds, LB rounds, GF — propagating results
  let b = { ub: bracket.ub.map((r: any[]) => r.map((m: any) => ({...m}))), lb: bracket.lb.map((r: any[]) => r.map((m: any) => ({...m}))), grandFinal: bracket.grandFinal.map((m: any) => ({...m})) }
  const simMatch = (m: any) => {
    if (m.played || !m.teamAId || !m.teamBId) return m
    const flip = Math.random() > 0.5
    return { ...m, scoreA: flip ? 2 : 1, scoreB: flip ? 1 : 2, played: true }
  }
  for (let r = 0; r < b.ub.length; r++) {
    b.ub[r] = b.ub[r].map(simMatch)
    b = recomputeDoubleElimGeneric(b)
  }
  for (let r = 0; r < b.lb.length; r++) {
    b.lb[r] = b.lb[r].map(simMatch)
    b = recomputeDoubleElimGeneric(b)
  }
  b.grandFinal = b.grandFinal.map(simMatch)
  return recomputeDoubleElimGeneric(b)
}

function DoubleElimBracketView({ bracket, teamsById, onUpdate }: any) {
  const setResult = (bracketKey: string, round: number, idx: number, scoreA: number, scoreB: number) => {
    const updated = { ...bracket }
    if (bracketKey === 'grandFinal') updated.grandFinal = [{ ...bracket.grandFinal[0], scoreA, scoreB, played: true }]
    else updated[bracketKey] = bracket[bracketKey].map((r: any[], ri: number) => ri !== round ? r : r.map((m: any, mi: number) => mi !== idx ? m : { ...m, scoreA, scoreB, played: true }))
    onUpdate(recomputeDoubleElimGeneric(updated))
  }
  const champion = bracket.grandFinal[0].played ? (bracket.grandFinal[0].scoreA > bracket.grandFinal[0].scoreB ? bracket.grandFinal[0].teamAId : bracket.grandFinal[0].teamBId) : null
  const allDone = bracket.grandFinal[0].played
  const { pos, edges, headers, width, height } = buildDELayout(bracket)
  return (
    <div>
      {champion && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '12px 16px', background: C.gold + '18', border: `1px solid ${C.gold}44`, borderRadius: 8 }}><Trophy size={20} color={C.gold} /><span style={{ fontWeight: 700, color: C.gold }}>🏆 Campeón TI 2026: {teamsById[champion]?.name}</span></div>}
      {!allDone && (
        <button onClick={() => onUpdate(simulateBracketFull(bracket))} style={{ ...s.saveBtn, marginBottom: 12, fontSize: 12 }}>
          <RefreshCw size={13} /> Simular Main Event completo
        </button>
      )}
      <div style={{ overflowX: 'auto', paddingBottom: 12 }}>
        <div style={{ position: 'relative', width, height }}>
          {headers.map((h: any, i: number) => (
            <div key={i} style={{ position: 'absolute', left: h.x, top: h.y, width: CW, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: h.color, textAlign: 'center' }}>{h.label}</div>
          ))}
          <ConnectorSvg pos={pos} edges={edges} width={width} height={height} />
          {Object.values(pos).map(({ x, y, m, bracketKey, round, idx }: any) => (
            <div key={m.id} style={{ position: 'absolute', left: x, top: y - CARD_H / 2, width: CW }}>
              <BracketMatch match={m} teamsById={teamsById} onSave={(sa: number, sb: number) => setResult(bracketKey, round, idx, sa, sb)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  TI Swiss View                                                     */
/* ------------------------------------------------------------------ */
function TIStageView({ tournament, updateTournament, setTab }: any) {
  const teamsById = Object.fromEntries(tournament.teams.map((t: any) => [t.id, t]))
  const teamIds = tournament.teams.map((t: any) => t.id)
  const rounds = tournament.swiss.rounds
  const currentRound = rounds[rounds.length - 1]
  const currentRoundPlayed = currentRound.every((m: any) => m.played)
  const standings = swissStandings(teamIds, rounds, teamsById as any)
  const swissDone = rounds.length >= SWISS_ROUNDS && currentRoundPlayed

  const setSwissResult = (roundIdx: number, matchId: string, scoreA: number, scoreB: number) => {
    const newRounds = rounds.map((r: any[], i: number) => i === roundIdx ? r.map((m: any) => m.id === matchId ? { ...m, scoreA, scoreB, played: true } : m) : r)
    updateTournament({ ...tournament, swiss: { rounds: newRounds } })
  }
  const setSwissDate = (roundIdx: number, matchId: string, date: string | null) => {
    const newRounds = rounds.map((r: any[], i: number) => i === roundIdx ? r.map((m: any) => m.id === matchId ? { ...m, date } : m) : r)
    updateTournament({ ...tournament, swiss: { rounds: newRounds } })
  }
  const nextSwissRound = () => {
    const nextRoundNumber = rounds.length + 1
    const groupOf = tournament.initialGroupOf
    let pairFilter: ((a: string, b: string) => boolean) | null = null
    if (groupOf) {
      if (nextRoundNumber === 2 || nextRoundNumber === 3) pairFilter = (a, b) => groupOf[a] === groupOf[b]
      else if (nextRoundNumber === 4) pairFilter = (a, b) => groupOf[a] !== groupOf[b]
    }
    updateTournament({ ...tournament, swiss: { rounds: [...rounds, generateSwissRound(teamIds, rounds, pairFilter)] } })
  }

  const simulateCurrentRound = () => {
    const ri = rounds.length - 1
    const newRounds = rounds.map((r: any[], i: number) => {
      if (i !== ri) return r
      return r.map((m: any) => {
        if (m.played) return m
        const flip = Math.random() > 0.5
        return { ...m, scoreA: flip ? 2 : 1, scoreB: flip ? 1 : 2, played: true }
      })
    })
    updateTournament({ ...tournament, swiss: { rounds: newRounds } })
  }

  return (
    <div>
      <h3 style={s.h3}>Fase suiza · ronda {rounds.length} de {SWISS_ROUNDS}</h3>
      <table style={s.table}>
        <thead><tr><th style={s.th}>#</th><th style={{ ...s.th, textAlign: 'left' }}>Equipo</th><th style={s.th}>G</th><th style={s.th}>P</th><th style={s.th}>Estado</th></tr></thead>
        <tbody>
          {standings.map((row: any, i: number) => {
            let status: string | null = null, color = C.text
            if (swissDone) {
              if (i < 3) { status = 'directo a Main Event'; color = C.radiant }
              else if (i < 13) {
                const em = tournament.eliminationRound?.find((m: any) => m.teamAId === row.teamId || m.teamBId === row.teamId)
                if (em && em.played) { const wId = em.scoreA > em.scoreB ? em.teamAId : em.teamBId; status = wId === row.teamId ? 'avanzó al Main Event' : 'eliminado'; color = wId === row.teamId ? C.radiant : C.dire }
                else { status = 'ronda de eliminación'; color = C.text }
              } else { status = 'eliminado'; color = C.dire }
            }
            return <tr key={row.teamId}><td style={s.td}>{i + 1}</td><td style={{ ...s.td, textAlign: 'left', fontWeight: 600, color }}>{row.name}</td><td style={s.td}>{row.wins}</td><td style={s.td}>{row.losses}</td><td style={{ ...s.td, fontSize: 11, color }}>{status || '—'}</td></tr>
          })}
        </tbody>
      </table>
      {rounds.map((round: any[], ri: number) => {
        const played = round.filter((m: any) => m.played).length
        const total  = round.length
        const isCurrentRound = ri === rounds.length - 1
        return (
          <div key={ri} style={{ marginBottom: 20 }}>
            {/* Round header + progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: isCurrentRound ? C.gold : C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Ronda {ri + 1}
              </span>
              <span style={{ fontSize: 11, color: played === total ? C.radiant : C.muted }}>
                {played}/{total} guardados
              </span>
              {played === total && <Badge color={C.radiant}>completa</Badge>}
            </div>
            {sortByDate(round).map((m: any) => (
              <MatchRow key={m.id} match={m} teamsById={teamsById} onSave={(sa: number, sb: number) => setSwissResult(ri, m.id, sa, sb)} onDateChange={(date: string | null) => setSwissDate(ri, m.id, date)} />
            ))}
          </div>
        )
      })}

      {/* Generate next round button */}
      {!swissDone && rounds.length < SWISS_ROUNDS && (() => {
        const ri = rounds.length - 1
        const cur = rounds[ri]
        const played = cur.filter((m: any) => m.played).length
        const total = cur.length
        const missing = total - played
        return (
          <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.surface }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: C.muted }}>
                Ronda {rounds.length}:
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: currentRoundPlayed ? C.radiant : C.gold }}>
                {played}/{total} resultados guardados
              </span>
              {missing > 0 && (
                <span style={{ fontSize: 11, color: C.dire }}>
                  — faltan {missing}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={nextSwissRound}
                disabled={!currentRoundPlayed}
                style={{ ...s.primaryBtn, opacity: currentRoundPlayed ? 1 : 0.35, cursor: currentRoundPlayed ? 'pointer' : 'not-allowed', fontSize: 13 }}
              >
                <Layers size={15} /> Generar ronda {rounds.length + 1}
              </button>
              {!currentRoundPlayed && (
                <button
                  onClick={simulateCurrentRound}
                  style={{ ...s.saveBtn, fontSize: 12, padding: '6px 12px', gap: 5 }}
                  title="Simula los partidos pendientes con resultados aleatorios"
                >
                  <RefreshCw size={13} /> Simular pendientes
                </button>
              )}
            </div>
            {!currentRoundPlayed && (
              <p style={{ fontSize: 11, color: C.faint, marginTop: 6 }}>
                Ingresa los {missing} resultado(s) pendiente(s) manualmente, o usa "Simular pendientes" para continuar.
              </p>
            )}
          </div>
        )
      })()}
      {swissDone && (
        <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 10, border: `1px solid ${C.gold}55`, background: C.gold + '0e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.gold }}>✓ Fase suiza completa</p>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: C.muted }}>Los puestos 1-3 avanzan directo al Main Event. Los puestos 4-13 juegan la Ronda de Eliminación.</p>
          </div>
          <button onClick={() => setTab('elimination')} style={{ ...s.primaryBtn, whiteSpace: 'nowrap' }}>
            <ListTree size={15} /> Ir a Ronda de Eliminación
          </button>
        </div>
      )}
    </div>
  )
}
/* ------------------------------------------------------------------ */
/*  Elimination Round                                                    */
/* ------------------------------------------------------------------ */
function EliminationRoundView({ tournament, updateTournament, setTab }: any) {
  const teamsById = Object.fromEntries(tournament.teams.map((t: any) => [t.id, t]))
  const teamIds = tournament.teams.map((t: any) => t.id)
  const rounds = tournament.swiss.rounds
  const currentRoundPlayed = rounds[rounds.length - 1].every((m: any) => m.played)
  const standings = swissStandings(teamIds, rounds, teamsById as any)
  const swissDone = rounds.length >= SWISS_ROUNDS && currentRoundPlayed

  const startEliminationRound = () => {
    const ranked = standings.map((s: any) => s.teamId)
    updateTournament({ ...tournament, eliminationRound: generateEliminationRoundMatches(ranked.slice(3, 13)) })
  }
  const setElimResult = (matchId: string, scoreA: number, scoreB: number) =>
    updateTournament({ ...tournament, eliminationRound: tournament.eliminationRound.map((m: any) => m.id === matchId ? { ...m, scoreA, scoreB, played: true } : m) })
  const setElimDate = (matchId: string, date: string | null) =>
    updateTournament({ ...tournament, eliminationRound: tournament.eliminationRound.map((m: any) => m.id === matchId ? { ...m, date } : m) })
  const simulateElimRound = () => {
    const simulated = tournament.eliminationRound.map((m: any) => {
      if (m.played) return m
      const flip = Math.random() > 0.5
      return { ...m, scoreA: flip ? 2 : 1, scoreB: flip ? 1 : 2, played: true }
    })
    updateTournament({ ...tournament, eliminationRound: simulated })
  }
  const startMainEvent = () => {
    const top3 = standings.slice(0, 3).map((s: any) => s.teamId)
    const elimWinners = tournament.eliminationRound.map((m: any) => m.scoreA > m.scoreB ? m.teamAId : m.teamBId)
    const seeds = [...top3, ...elimWinners] // 8 teams
    // Seeded UB Round 1 pairs: 1v8, 2v7, 3v6, 4v5
    const round1Pairs: [string, string][] = [
      [seeds[0], seeds[7]],
      [seeds[1], seeds[6]],
      [seeds[2], seeds[5]],
      [seeds[3], seeds[4]],
    ]
    updateTournament({ ...tournament, bracket: generateDoubleElimN(round1Pairs) })
    setTab('bracket')
  }
  const elimDone = tournament.eliminationRound?.every((m: any) => m.played)

  if (!swissDone) return <p style={{ fontSize: 13, color: C.muted }}>Completa las {SWISS_ROUNDS} rondas de la fase suiza para desbloquear.</p>
  return (
    <div>
      <h3 style={s.h3}>Ronda de eliminación (puestos 4-13, 5 avanzan)</h3>
      <p style={{ fontSize: 12, color: C.muted, marginTop: -4, marginBottom: 14 }}>Aproximación por posición. El reglamento real usa un draft donde los equipos eligen rival.</p>
      {!tournament.eliminationRound && <button onClick={startEliminationRound} style={s.primaryBtn}><ListTree size={16} /> Generar ronda de eliminación</button>}
      {tournament.eliminationRound && sortByDate(tournament.eliminationRound).map((m: any) => (
        <MatchRow key={m.id} match={m} teamsById={teamsById} onSave={(sa: number, sb: number) => setElimResult(m.id, sa, sb)} onDateChange={(date: string | null) => setElimDate(m.id, date)} />
      ))}
      {tournament.eliminationRound && !elimDone && (
        <button onClick={simulateElimRound} style={{ ...s.saveBtn, marginTop: 8, fontSize: 12 }}>
          <RefreshCw size={13} /> Simular pendientes
        </button>
      )}
      {elimDone && !tournament.bracket && <button onClick={startMainEvent} style={{ ...s.primaryBtn, marginTop: 8 }}><Trophy size={16} /> Generar Main Event</button>}
      {tournament.bracket && <div style={{ marginTop: 28 }}><DoubleElimBracketView bracket={tournament.bracket} teamsById={teamsById} onUpdate={(b: any) => updateTournament({ ...tournament, bracket: b })} /></div>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Rosters, Prize Pool, Rules, Swiss Groups                             */
/* ------------------------------------------------------------------ */
function RostersView({ tournament }: any) {
  const withRoster = tournament.teams.filter((t: any) => t.roster)
  const withoutRoster = tournament.teams.filter((t: any) => !t.roster)
  return (
    <div>
      <h3 style={s.h3}>Plantillas</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10, marginBottom: 12 }}>
        {withRoster.map((t: any) => (
          <div key={t.id} style={{ ...s.card, cursor: 'default' }}>
            <div style={{ fontWeight: 700, marginBottom: 6, color: C.gold }}>{t.name}</div>
            {t.roster.map((p: any, i: number) => (
              <div key={i} style={{ fontSize: 12, color: C.text, display: 'flex', justifyContent: 'space-between' }}>
                <span>{p.nick}</span><span style={{ color: C.muted }}>{countryFlag(p.country)} {p.country}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      {withoutRoster.length > 0 && <p style={{ fontSize: 12, color: C.muted }}>Sin roster disponible: {withoutRoster.map((t: any) => t.name).join(', ')}.</p>}
    </div>
  )
}

function PrizePoolView({ prizePool }: any) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={s.h3}>Premiación</h3>
      <table style={s.table}>
        <thead><tr><th style={{ ...s.th, textAlign: 'left' }}>Puesto</th><th style={s.th}>Premio</th></tr></thead>
        <tbody>
          {prizePool.map((row: any, i: number) => (
            <tr key={i}><td style={{ ...s.td, textAlign: 'left' }}>{row.place}</td><td style={{ ...s.td, fontWeight: 700, color: C.gold }}>{row.amount}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function RuleList({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={s.h3}>{title}</h3>
      <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: C.text, lineHeight: 1.75 }}>
        {items.map((it, i) => <li key={i} style={{ marginBottom: 4 }}>{it}</li>)}
      </ol>
    </div>
  )
}

function GroupsSplitView({ tournament }: any) {
  const groupOf = tournament.initialGroupOf
  if (!groupOf) return <p style={{ fontSize: 13, color: C.muted }}>Este torneo no tiene grupos iniciales definidos.</p>
  const groups: Record<string, any[]> = {
    G1: tournament.teams.filter((t: any) => groupOf[t.id] === 'G1'),
    G2: tournament.teams.filter((t: any) => groupOf[t.id] === 'G2'),
  }
  return (
    <div>
      <h3 style={s.h3}>División de grupos iniciales (fase suiza)</h3>
      <p style={{ fontSize: 12, color: C.muted, marginTop: -4, marginBottom: 14 }}>Reconstruido a partir de la organización de streams del Día 1. Rondas 2-3: mismo grupo. Ronda 4: cruzada obligatoria.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {['G1', 'G2'].map((g) => (
          <div key={g} style={{ ...s.card, cursor: 'default' }}>
            <div style={{ fontWeight: 700, marginBottom: 6, color: C.gold }}>Grupo {g === 'G1' ? '1' : '2'}</div>
            {groups[g].map((t: any) => <div key={t.id} style={{ fontSize: 13, color: C.text, padding: '2px 0' }}>{t.name}</div>)}
          </div>
        ))}
      </div>
    </div>
  )
}

function RulesView() {
  return (
    <div>
      <RuleList title="Criterios de desempate" items={TI_2026_RULES.tiebreakers} />
      <RuleList title="Reglas de emparejamiento suizo" items={TI_2026_RULES.swissPairing} />
      <RuleList title="Ronda de eliminación" items={TI_2026_RULES.eliminationRound} />
      <RuleList title="Playoffs (Main Event)" items={TI_2026_RULES.playoffs} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Formulario nuevo torneo manual                                       */
/* ------------------------------------------------------------------ */
function NewTournamentForm({ onCreate, onCancel }: any) {
  const [name, setName] = useState('')
  const [template, setTemplate] = useState(MANUAL_TEMPLATES[1])
  const [teamsText, setTeamsText] = useState(Array.from({ length: MANUAL_TEMPLATES[1].teams }, (_, i) => `Equipo ${i + 1}`).join('\n'))
  const [numGroups, setNumGroups] = useState(MANUAL_TEMPLATES[1].numGroups)
  const [qualifiers, setQualifiers] = useState(MANUAL_TEMPLATES[1].qualifiers)
  const [format, setFormat] = useState(MANUAL_TEMPLATES[1].format)

  const applyTemplate = (t: typeof MANUAL_TEMPLATES[0]) => {
    setTemplate(t); setTeamsText(Array.from({ length: t.teams }, (_, i) => `Equipo ${i + 1}`).join('\n'))
    setNumGroups(t.numGroups); setQualifiers(t.qualifiers); setFormat(t.format)
  }
  const teamNames = teamsText.split('\n').map((s) => s.trim()).filter(Boolean)
  const handleSubmit = () => {
    if (!name.trim() || teamNames.length < 2) return
    const teams = teamNames.map((n) => ({ id: uid(), name: n }))
    const teamIds = teams.map((t) => t.id)
    let groups: any[] = []
    if (format !== 'bracket') {
      const groupTeamIdLists = numGroups > 1 ? splitIntoGroups(teamIds, numGroups) : [teamIds]
      groups = groupTeamIdLists.map((ids, i) => ({ id: uid(), name: numGroups > 1 ? `Grupo ${String.fromCharCode(65 + i)}` : 'Todos contra todos', teamIds: ids, matches: roundRobinMatches(ids) }))
    }
    let bracket = null
    if (format === 'bracket') bracket = generateBracket(teamIds)
    onCreate({ id: uid(), name: name.trim(), teams, format, qualifiers: format === 'both' ? qualifiers : 0, groups, bracket })
  }
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <button onClick={onCancel} style={s.backBtn}><ArrowLeft size={16} /> Volver</button>
      <h2 style={s.h2}>Nuevo torneo manual</h2>
      <label style={s.label}>Nombre del torneo</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Copa Radiant Otoño 2026" style={s.input} />
      <label style={s.label}>Plantilla de estructura</label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
        {MANUAL_TEMPLATES.map((t) => (
          <button key={t.key} onClick={() => applyTemplate(t)} style={{ ...s.card, borderColor: template.key === t.key ? C.gold : C.border, background: template.key === t.key ? '#2a1e08' : C.card }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: template.key === t.key ? C.gold : C.text }}>{t.label}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.desc}</div>
          </button>
        ))}
      </div>
      {(format === 'groups' || format === 'both') && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}><label style={s.label}># de grupos</label><input type="number" min={1} max={8} value={numGroups} onChange={(e) => setNumGroups(Math.max(1, parseInt(e.target.value) || 1))} style={s.input} /></div>
          <div style={{ flex: 1 }}><label style={s.label}>Clasifican por grupo</label><input type="number" min={1} max={8} value={qualifiers} onChange={(e) => setQualifiers(Math.max(1, parseInt(e.target.value) || 1))} style={s.input} disabled={format !== 'both'} /></div>
          <div style={{ flex: 1 }}><label style={s.label}>Formato</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} style={s.input}>
              <option value="groups">Solo grupos</option>
              <option value="both">Grupos + playoffs</option>
            </select>
          </div>
        </div>
      )}
      <label style={s.label}>Equipos (uno por línea, {teamNames.length} cargados)</label>
      <textarea value={teamsText} onChange={(e) => setTeamsText(e.target.value)} rows={8} style={{ ...s.input, fontFamily: 'monospace', resize: 'vertical' }} />
      <p style={{ fontSize: 12, color: C.muted, marginTop: -8, marginBottom: 16 }}>Edita los nombres por los equipos reales.</p>
      <button onClick={handleSubmit} disabled={!name.trim() || teamNames.length < 2} style={{ ...s.primaryBtn, opacity: !name.trim() || teamNames.length < 2 ? 0.35 : 1 }}><Plus size={16} /> Crear torneo</button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tab button                                                           */
/* ------------------------------------------------------------------ */
function TabBtn({ active, onClick, disabled, children }: any) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', fontSize: 13, fontWeight: 500, background: 'transparent', border: 'none', borderBottom: active ? `2px solid ${C.gold}` : '2px solid transparent', color: disabled ? C.faint : active ? C.gold : C.muted, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'color 0.15s' }}>
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  TournamentDetail                                                     */
/* ------------------------------------------------------------------ */
function TournamentDetail({ tournament, updateTournament, onBack, onDelete }: any) {
  const [tab, setTab] = useState(tournament.format === 'bracket' ? 'bracket' : 'groups')
  const teamsById = Object.fromEntries(tournament.teams.map((t: any) => [t.id, t]))
  const formatLabel: Record<string, string> = { groups: 'Fase de grupos', both: 'Grupos + playoffs', bracket: 'Eliminación directa', ti_swiss: 'Fase Suiza · TI 2026' }
  const hasTabs = tournament.format === 'both' || tournament.format === 'ti_swiss' || tournament.teams.some((t: any) => t.roster) || tournament.prizePool
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={onBack} style={s.backBtn}><ArrowLeft size={16} /> Torneos</button>
        <button onClick={onDelete} style={{ ...s.backBtn, color: C.dire }}><Trash2 size={14} /> Eliminar</button>
      </div>
      <h2 style={s.h2}>{tournament.name}</h2>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
        <Badge color={C.gold}>{tournament.teams.length} equipos</Badge>
        <Badge color={tournament.format === 'bracket' ? C.dire : C.radiant}>{formatLabel[tournament.format]}</Badge>
        {tournament.presetKey && <Badge color="#8aa8c9">datos reales al {DATA_AS_OF}</Badge>}
      </div>
      {tournament.presetKey && <p style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>Los datos de este torneo corresponden al estado real al {DATA_AS_OF}.</p>}
      {hasTabs && (
        <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: `1px solid ${C.border}`, flexWrap: 'wrap' }}>
          {tournament.format === 'both' && <TabBtn active={tab === 'groups'} onClick={() => setTab('groups')}><Users size={14} /> Grupos</TabBtn>}
          {tournament.format === 'both' && <TabBtn active={tab === 'bracket'} onClick={() => setTab('bracket')} disabled={!tournament.bracket}><ListTree size={14} /> Playoffs</TabBtn>}
          {tournament.format === 'ti_swiss' && <TabBtn active={tab === 'groups'} onClick={() => setTab('groups')}><Layers size={14} /> Fase suiza</TabBtn>}
          {tournament.format === 'ti_swiss' && <TabBtn active={tab === 'elimination'} onClick={() => setTab('elimination')}><ListTree size={14} /> Elimination Round</TabBtn>}
          {tournament.teams.some((t: any) => t.roster) && <TabBtn active={tab === 'rosters'} onClick={() => setTab('rosters')}><Users size={14} /> Equipos</TabBtn>}
          {tournament.prizePool && <TabBtn active={tab === 'prizepool'} onClick={() => setTab('prizepool')}><Trophy size={14} /> Premios</TabBtn>}
          {tournament.format === 'ti_swiss' && <TabBtn active={tab === 'swissgroups'} onClick={() => setTab('swissgroups')}><Users size={14} /> Grupos</TabBtn>}
          {tournament.format === 'ti_swiss' && <TabBtn active={tab === 'rules'} onClick={() => setTab('rules')}><ListTree size={14} /> Reglamento</TabBtn>}
          {tournament.format === 'ti_swiss' && tournament.bracket && <TabBtn active={tab === 'bracket'} onClick={() => setTab('bracket')}><Trophy size={14} /> Main Event</TabBtn>}
        </div>
      )}
      {(tournament.format === 'groups' || (tournament.format === 'both' && tab === 'groups')) && <GroupsView tournament={tournament} updateTournament={updateTournament} />}
      {tournament.format === 'bracket' && tournament.bracket && <BracketView bracket={tournament.bracket} teamsById={teamsById} onUpdateBracket={(b: any) => updateTournament({ ...tournament, bracket: b })} />}
      {tournament.format === 'both' && tab === 'bracket' && tournament.bracket && <BracketView bracket={tournament.bracket} teamsById={teamsById} onUpdateBracket={(b: any) => updateTournament({ ...tournament, bracket: b })} />}
      {tournament.format === 'ti_swiss' && tab === 'groups' && <TIStageView tournament={tournament} updateTournament={updateTournament} setTab={setTab} />}
      {tournament.format === 'ti_swiss' && tab === 'elimination' && <EliminationRoundView tournament={tournament} updateTournament={updateTournament} setTab={setTab} />}
      {tournament.format === 'ti_swiss' && tab === 'bracket' && tournament.bracket && <DoubleElimBracketView bracket={tournament.bracket} teamsById={teamsById} onUpdate={(b: any) => updateTournament({ ...tournament, bracket: b })} />}
      {tab === 'rosters' && <RostersView tournament={tournament} />}
      {tab === 'prizepool' && tournament.prizePool && <PrizePoolView prizePool={tournament.prizePool} />}
      {tab === 'swissgroups' && tournament.format === 'ti_swiss' && <GroupsSplitView tournament={tournament} />}
      {tab === 'rules' && tournament.format === 'ti_swiss' && <RulesView />}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  App principal                                                        */
/* ------------------------------------------------------------------ */
export default function TournamentSim() {
  const [tournaments, setTournaments, ready] = useStorage()
  const [view, setView] = useState<'home' | 'new' | 'detail'>('home')
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = tournaments.find((t) => t.id === activeId)

  const createTournament = (t: any) => { setTournaments((prev) => [...prev, t]); setActiveId(t.id); setView('detail') }
  const updateTournament = (updated: any) => setTournaments((prev) => prev.map((t) => t.id === updated.id ? updated : t))
  const deleteTournament = (id: string) => { setTournaments((prev) => prev.filter((t) => t.id !== id)); setView('home'); setActiveId(null) }
  const addPreset = (preset: typeof PRESETS[0]) => createTournament(preset.build())
  const alreadyAdded = (key: string) => tournaments.some((t) => t.presetKey === key)

  if (!ready) return <div style={{ ...s.wrap, textAlign: 'center', padding: 60, color: C.muted }}>Cargando torneos…</div>

  return (
    <div style={s.wrap}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 10, background: C.gold + '18', border: `1px solid ${C.gold}44` }}>
          <Swords size={20} color={C.gold} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: C.gold }}>Motor predictivo</p>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.text }}>Simulador de Torneos · <span style={{ color: C.radiant }}>Dota</span> <span style={{ color: C.dire }}>2</span></h1>
        </div>
      </div>

      {view === 'home' && (
        <div>
          {/* Torneos oficiales */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ ...s.h2, margin: 0 }}>Torneos oficiales</h2>
            <span style={{ fontSize: 11, color: C.muted, display: 'flex', alignItems: 'center', gap: 4 }}><RefreshCw size={12} /> datos al {DATA_AS_OF}</span>
          </div>
          <div style={{ display: 'grid', gap: 10, marginBottom: 32 }}>
            {PRESETS.map((p) => (
              <div key={p.key} style={{ ...s.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'default', border: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}><Trophy size={14} color={C.gold} /> {p.label}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>{p.desc}</div>
                </div>
                <button onClick={() => addPreset(p)} disabled={alreadyAdded(p.key)} style={{ ...s.primaryBtn, opacity: alreadyAdded(p.key) ? 0.35 : 1, flexShrink: 0 }}>
                  {alreadyAdded(p.key) ? 'Ya agregado' : 'Cargar'}
                </button>
              </div>
            ))}
          </div>

          {/* Torneos del usuario */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ ...s.h2, margin: 0 }}>Tus torneos</h2>
            <button onClick={() => setView('new')} style={s.primaryBtn}><Plus size={16} /> Nuevo torneo manual</button>
          </div>
          {tournaments.length === 0 && <p style={{ color: C.muted, fontSize: 14 }}>Aún no tienes torneos. Carga uno oficial arriba o crea uno manual.</p>}
          <div style={{ display: 'grid', gap: 10 }}>
            {tournaments.map((t) => (
              <button key={t.id} onClick={() => { setActiveId(t.id); setView('detail') }} style={{ ...s.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.teams.length} equipos</div>
                </div>
                <ChevronRight size={18} color={C.muted} />
              </button>
            ))}
          </div>
        </div>
      )}

      {view === 'new' && <NewTournamentForm onCreate={createTournament} onCancel={() => setView('home')} />}
      {view === 'detail' && active && (
        <TournamentDetail tournament={active} updateTournament={updateTournament} onBack={() => setView('home')} onDelete={() => deleteTournament(active.id)} />
      )}
    </div>
  )
}
