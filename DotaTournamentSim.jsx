import { useState, useEffect, useRef } from "react";
import { Trophy, Plus, Trash2, Users, ChevronRight, ArrowLeft, Check, ListTree, Layers, Swords, RefreshCw } from "lucide-react";

const RADIANT = "#79C93C";
const DIRE = "#D64545";
const GOLD = "#D9A94C";

const uid = () => Math.random().toString(36).slice(2, 10);
const DATA_AS_OF = "10 de agosto de 2026";

// ---------- Motor genérico ----------

function seedOrder(size) {
  let result = [1, 2];
  while (result.length < size) {
    const newSize = result.length * 2;
    const next = [];
    for (const s of result) { next.push(s); next.push(newSize + 1 - s); }
    result = next;
  }
  return result;
}

function nextPow2(n) { let p = 1; while (p < n) p *= 2; return p; }

function generateBracket(seedTeamIds) {
  const size = nextPow2(seedTeamIds.length);
  const order = seedOrder(size);
  const slots = [...seedTeamIds];
  while (slots.length < size) slots.push(null);
  const round1Teams = order.map((pos) => slots[pos - 1]);
  const round1 = [];
  for (let i = 0; i < round1Teams.length; i += 2) {
    round1.push({ id: uid(), teamAId: round1Teams[i], teamBId: round1Teams[i + 1], scoreA: 0, scoreB: 0, played: false, winnerId: null, date: null });
  }
  const rounds = [round1];
  let count = round1.length;
  while (count > 1) {
    count = count / 2;
    rounds.push(Array.from({ length: count }, () => ({ id: uid(), teamAId: null, teamBId: null, scoreA: 0, scoreB: 0, played: false, winnerId: null, date: null })));
  }
  return recomputeBracket(rounds);
}

function recomputeBracket(rounds) {
  const next = rounds.map((r) => r.map((m) => ({ ...m })));
  for (let r = 0; r < next.length - 1; r++) {
    next[r].forEach((m, i) => {
      let winner;
      if (!m.teamAId) winner = m.teamBId;
      else if (!m.teamBId) winner = m.teamAId;
      else winner = m.played ? (m.scoreA > m.scoreB ? m.teamAId : m.teamBId) : null;
      m.winnerId = winner;
      const nextMatch = next[r + 1][Math.floor(i / 2)];
      const slot = i % 2 === 0 ? "teamAId" : "teamBId";
      if (nextMatch[slot] !== winner) {
        nextMatch[slot] = winner; nextMatch.played = false; nextMatch.scoreA = 0; nextMatch.scoreB = 0; nextMatch.winnerId = null;
      }
    });
  }
  return next;
}

// ---------- Motor de doble eliminación genérico (4, 8, 16, 32... equipos) ----------

function detWinnerLoser(m) {
  if (!m.teamAId || !m.teamBId || !m.played) return { winner: null, loser: null };
  if (m.scoreA > m.scoreB) return { winner: m.teamAId, loser: m.teamBId };
  if (m.scoreB > m.scoreA) return { winner: m.teamBId, loser: m.teamAId };
  return { winner: null, loser: null };
}

function mkDEMatch(links, date) {
  return { id: uid(), teamAId: null, teamBId: null, scoreA: 0, scoreB: 0, played: false, date: date || null, links: links || [] };
}

// round1Pairs: [[teamA,teamB], ...] ya emparejados (el llamador decide el sorteo/seed).
// La cantidad de pares debe ser potencia de 2 (2, 4, 8, 16 pares -> 4,8,16,32 equipos).
function generateDoubleElimN(round1Pairs) {
  const k = Math.round(Math.log2(round1Pairs.length)) + 1; // rondas de upper bracket
  const ub = [round1Pairs.map(([a, b]) => ({ ...mkDEMatch([]), teamAId: a, teamBId: b }))];
  let count = ub[0].length;
  while (count > 1) {
    count = count / 2;
    const r = ub.length;
    ub.push(Array.from({ length: count }, (_, i) => mkDEMatch([
      { type: "winner", bracket: "ub", round: r - 1, idx: i * 2 },
      { type: "winner", bracket: "ub", round: r - 1, idx: i * 2 + 1 },
    ])));
  }

  const pairSelfLinks = (links) => {
    const out = [];
    for (let i = 0; i < links.length; i += 2) out.push(mkDEMatch([links[i], links[i + 1]]));
    return out;
  };
  const pairCrossLinks = (linksA, linksB) => linksA.map((la, i) => mkDEMatch([la, linksB[i]]));

  const lb = [];
  let currentWinnerLinks = null;
  for (let i = 0; i <= k - 2; i++) {
    const ubLoserLinks = ub[i].map((_, idx) => ({ type: "loser", bracket: "ub", round: i, idx }));
    const round = currentWinnerLinks === null ? pairSelfLinks(ubLoserLinks) : pairCrossLinks(currentWinnerLinks, ubLoserLinks);
    lb.push(round);
    currentWinnerLinks = round.map((_, idx) => ({ type: "winner", bracket: "lb", round: lb.length - 1, idx }));
    if (round.length > 1 && i < k - 2) {
      const consolidate = pairSelfLinks(currentWinnerLinks);
      lb.push(consolidate);
      currentWinnerLinks = consolidate.map((_, idx) => ({ type: "winner", bracket: "lb", round: lb.length - 1, idx }));
    }
  }
  while (currentWinnerLinks.length > 1) {
    const consolidate = pairSelfLinks(currentWinnerLinks);
    lb.push(consolidate);
    currentWinnerLinks = consolidate.map((_, idx) => ({ type: "winner", bracket: "lb", round: lb.length - 1, idx }));
  }
  const ubFinalLoserLink = { type: "loser", bracket: "ub", round: k - 1, idx: 0 };
  const finalRound = pairCrossLinks(currentWinnerLinks, [ubFinalLoserLink]);
  lb.push(finalRound);
  const lbFinalWinnerLink = { type: "winner", bracket: "lb", round: lb.length - 1, idx: 0 };

  const grandFinal = [mkDEMatch([{ type: "winner", bracket: "ub", round: k - 1, idx: 0 }, lbFinalWinnerLink])];

  return recomputeDoubleElimGeneric({ ub, lb, grandFinal });
}

function recomputeDoubleElimGeneric(state) {
  const ub = state.ub.map((r) => r.map((m) => ({ ...m })));
  const lb = state.lb.map((r) => r.map((m) => ({ ...m })));
  const grandFinal = state.grandFinal.map((m) => ({ ...m }));
  const getMatch = (link) => (link.bracket === "ub" ? ub[link.round][link.idx] : link.bracket === "lb" ? lb[link.round][link.idx] : grandFinal[0]);
  const val = (link) => { const wl = detWinnerLoser(getMatch(link)); return link.type === "winner" ? wl.winner : wl.loser; };
  const setSlot = (m, slot, teamId) => { if (m[slot] !== teamId) { m[slot] = teamId; m.played = false; m.scoreA = 0; m.scoreB = 0; } };

  for (let r = 1; r < ub.length; r++) ub[r].forEach((m) => { setSlot(m, "teamAId", val(m.links[0])); setSlot(m, "teamBId", val(m.links[1])); });
  lb.forEach((round) => round.forEach((m) => { setSlot(m, "teamAId", val(m.links[0])); setSlot(m, "teamBId", val(m.links[1])); }));
  setSlot(grandFinal[0], "teamAId", val(grandFinal[0].links[0]));
  setSlot(grandFinal[0], "teamBId", val(grandFinal[0].links[1]));

  return { ub, lb, grandFinal };
}

function roundRobinMatches(teamIds) {
  const matches = [];
  for (let i = 0; i < teamIds.length; i++) for (let j = i + 1; j < teamIds.length; j++)
    matches.push({ id: uid(), teamAId: teamIds[i], teamBId: teamIds[j], scoreA: 0, scoreB: 0, played: false, date: null });
  return matches;
}

// Ordena una lista de partidos por fecha (ascendente). Sin fecha van al final,
// conservando su orden relativo original.
function sortByDate(matches) {
  return matches
    .map((m, i) => ({ m, i }))
    .sort((a, b) => {
      if (!a.m.date && !b.m.date) return a.i - b.i;
      if (!a.m.date) return 1;
      if (!b.m.date) return -1;
      return a.m.date.localeCompare(b.m.date) || a.i - b.i;
    })
    .map((x) => x.m);
}

function splitIntoGroups(teamIds, numGroups) {
  const groups = Array.from({ length: numGroups }, () => []);
  teamIds.forEach((id, i) => groups[i % numGroups].push(id));
  return groups;
}

function calcStandings(group, teamsById) {
  const table = {};
  group.teamIds.forEach((id) => { table[id] = { teamId: id, name: teamsById[id]?.name || "?", pj: 0, pg: 0, pp: 0, gf: 0, gc: 0, pts: 0 }; });
  group.matches.forEach((m) => {
    if (!m.played) return;
    const a = table[m.teamAId], b = table[m.teamBId];
    if (!a || !b) return;
    a.pj++; b.pj++; a.gf += m.scoreA; a.gc += m.scoreB; b.gf += m.scoreB; b.gc += m.scoreA;
    if (m.scoreA > m.scoreB) { a.pg++; a.pts += 1; b.pp++; } else if (m.scoreB > m.scoreA) { b.pg++; b.pts += 1; a.pp++; }
  });
  return Object.values(table).sort((x, y) => {
    if (y.pts !== x.pts) return y.pts - x.pts;
    const diffX = x.gf - x.gc, diffY = y.gf - y.gc;
    if (diffY !== diffX) return diffY - diffX;
    return y.gf - x.gf;
  });
}

function applyResult(matches, byName, nameA, nameB, sa, sb) {
  return matches.map((m) => {
    if (m.teamAId === byName[nameA] && m.teamBId === byName[nameB]) return { ...m, scoreA: sa, scoreB: sb, played: true };
    if (m.teamAId === byName[nameB] && m.teamBId === byName[nameA]) return { ...m, scoreA: sb, scoreB: sa, played: true };
    return m;
  });
}

function applyDate(matches, byName, nameA, nameB, date) {
  return matches.map((m) => {
    const isPair = (m.teamAId === byName[nameA] && m.teamBId === byName[nameB]) || (m.teamAId === byName[nameB] && m.teamBId === byName[nameA]);
    return isPair ? { ...m, date } : m;
  });
}

// ---------- Motor de fase suiza (The International) ----------

function computeSwissRecords(teamIds, rounds) {
  const rec = {};
  teamIds.forEach((id) => (rec[id] = { wins: 0, losses: 0 }));
  rounds.flat().forEach((m) => {
    if (!m.played) return;
    if (m.scoreA > m.scoreB) { if (rec[m.teamAId]) rec[m.teamAId].wins++; if (rec[m.teamBId]) rec[m.teamBId].losses++; }
    else if (m.scoreB > m.scoreA) { if (rec[m.teamBId]) rec[m.teamBId].wins++; if (rec[m.teamAId]) rec[m.teamAId].losses++; }
  });
  return rec;
}

function generateSwissRound(teamIds, previousRounds, pairFilter) {
  const records = computeSwissRecords(teamIds, previousRounds);
  const playedPairs = new Set();
  previousRounds.flat().forEach((m) => playedPairs.add([m.teamAId, m.teamBId].sort().join("|")));
  const buckets = {};
  teamIds.forEach((id) => { const w = records[id].wins; buckets[w] = buckets[w] || []; buckets[w].push(id); });
  const winsKeys = Object.keys(buckets).map(Number).sort((a, b) => b - a);
  const pairs = [];
  let leftover = [];
  // Busca rival válido probando, en orden: sin repetir + respeta el filtro de ronda,
  // luego solo el filtro, y como último recurso cualquiera (para no trabar el emparejamiento).
  const pickOpponent = (a, pool) => {
    let idx = pool.findIndex((b) => !playedPairs.has([a, b].sort().join("|")) && (!pairFilter || pairFilter(a, b)));
    if (idx === -1 && pairFilter) idx = pool.findIndex((b) => pairFilter(a, b));
    if (idx === -1) idx = 0;
    return idx;
  };
  winsKeys.forEach((w) => {
    let pool = [...leftover, ...buckets[w]];
    leftover = [];
    while (pool.length > 1) {
      const a = pool.shift();
      const idx = pickOpponent(a, pool);
      const b = pool.splice(idx, 1)[0];
      pairs.push([a, b]);
      playedPairs.add([a, b].sort().join("|"));
    }
    if (pool.length === 1) leftover = pool;
  });
  for (let i = 0; i + 1 < leftover.length; i += 2) pairs.push([leftover[i], leftover[i + 1]]);
  return pairs.map(([a, b]) => ({ id: uid(), teamAId: a, teamBId: b, scoreA: 0, scoreB: 0, played: false, date: null }));
}

function swissStandings(teamIds, rounds, teamsById) {
  const records = computeSwissRecords(teamIds, rounds);
  return teamIds.map((id) => ({ teamId: id, name: teamsById[id]?.name || "?", ...records[id] }))
    .sort((a, b) => (b.wins - b.losses) - (a.wins - a.losses) || b.wins - a.wins);
}

function generateEliminationRoundMatches(rankedIds) {
  const n = rankedIds.length;
  const matches = [];
  for (let i = 0; i < n / 2; i++) matches.push({ id: uid(), teamAId: rankedIds[i], teamBId: rankedIds[n - 1 - i], scoreA: 0, scoreB: 0, played: false, date: null });
  return matches;
}

// ---------- Torneos oficiales precargados ----------
// Datos verificados en Liquipedia / DLTV al 7 de agosto de 2026.
// Pide "actualiza los resultados" en el chat para refrescarlos.

const SWISS_ROUNDS = 5;
const TI_2026_TEAMS = [
  "Team Falcons", "Team Liquid", "Iron Wing", "Aurora Gaming", "Team Yandex", "Boomboys", "Xtreme Gaming",
  "Team Spirit", "Team Vision", "Huligani", "Nigma Galaxy", "Team Resilience", "Vici Gaming", "OG Esports", "GamerLegion", "LGD Gaming",
];

// Duelos reales de la Ronda 1 confirmados por Valve (fuente: Hotspawn / dota2.com, 10 ago 2026).
const TI_2026_ROUND1 = [
  ["Team Falcons", "LGD Gaming", "2026-08-13T10:00"],
  ["Iron Wing", "Nigma Galaxy", "2026-08-13T10:00"],
  ["Boomboys", "OG Esports", "2026-08-13T10:00"],
  ["Team Vision", "Team Resilience", "2026-08-13T10:00"],
  ["Team Spirit", "Xtreme Gaming", "2026-08-13T13:00"],
  ["Team Liquid", "Vici Gaming", "2026-08-13T13:00"],
  ["Aurora Gaming", "GamerLegion", "2026-08-13T13:00"],
  ["Team Yandex", "Huligani", "2026-08-13T13:00"],
];

// División oficial en dos grupos de 8 (fuente: reglamento Valve TI 2026).
// Rondas 1-3: solo enfrentamientos dentro del mismo grupo.
// Ronda 4: obligatoriamente cruzada entre grupos.
// Ronda 5: sin restricción de grupo (suizo estándar).
const TI_2026_INITIAL_GROUPS = {
  GA: ["Team Vision", "Boomboys", "Team Falcons", "Iron Wing", "Nigma Galaxy", "LGD Gaming", "OG Esports", "Team Resilience"],
  GB: ["Team Yandex", "Aurora Gaming", "Team Spirit", "Team Liquid", "Xtreme Gaming", "Vici Gaming", "GamerLegion", "Huligani"],
};

// Reglamento oficial del torneo (fuente: cyberscore.live / Liquipedia, 10 ago 2026).
const TI_2026_RULES = {
  tiebreakers: [
    "Porcentaje de partidas ganadas (games won %)",
    "Total de partidos ganados por los rivales enfrentados",
    "Porcentaje promedio de partidas ganadas por los rivales enfrentados",
    "Duración promedio de partida (más corta es mejor)",
    "Cara o sello",
  ],
  swissPairing: [
    "Los pares se forman entre equipos con el mismo récord.",
    "Se evitan revanchas (mismos rivales) en la medida de lo posible.",
    "Se minimiza la distancia en la tabla entre los equipos emparejados.",
    "Ronda 1: los 16 equipos se dividen en 2 grupos de 8 fijados por el organizador; los cruces se dan dentro de cada grupo.",
    "Rondas 2 y 3: los cruces se siguen dando solo dentro del grupo inicial de cada equipo.",
    "Ronda 4: los cruces son obligatoriamente entre equipos de distinto grupo inicial.",
    "Ronda 5: sin restricciones de grupo, reglas estándar de suizo.",
  ],
  eliminationRound: [
    "Participan los puestos 4° al 13° de la fase suiza (10 equipos), 5 avanzan a playoffs.",
    "El mejor equipo con récord 3-2 elige a cuál de los cinco equipos 2-3 quiere enfrentar.",
    "El siguiente mejor 3-2 elige entre los 2-3 restantes, y así sucesivamente.",
    "En este simulador el emparejamiento se genera automáticamente por posición (no por elección manual) como aproximación — Valve usa un draft real hecho por los equipos.",
  ],
  playoffs: [
    "8 equipos: los 3 primeros de la fase suiza + los 5 que avanzan de la ronda de eliminación.",
    "Formato de doble eliminación (Upper Bracket / Lower Bracket).",
    "Todos los partidos son Bo3, excepto la Gran Final que es Bo5.",
  ],
};

// Rosters (fuente: cyberscore.live, pestaña de participantes del torneo, 10 ago 2026).
const TI_2026_ROSTERS = {
  "Aurora Gaming": [
    { nick: "Nightfall", country: "Rusia" }, { nick: "Mikoto", country: "Indonesia" }, { nick: "Ws", country: "Malasia" },
    { nick: "Mira", country: "Ucrania" }, { nick: "kaori", country: "Ucrania" },
  ],
  "Boomboys": [
    { nick: "Kiritych~", country: "Rusia" }, { nick: "gpk", country: "Rusia" }, { nick: "MieRo", country: "Rusia" },
    { nick: "Save-", country: "Moldavia" }, { nick: "Kataomi", country: "Rusia" },
  ],
  "Team Falcons": [
    { nick: "skiter", country: "Eslovaquia" }, { nick: "Malr1ne", country: "Rusia" }, { nick: "ATF", country: "Jordania" },
    { nick: "Cr1t-", country: "Dinamarca" }, { nick: "Sneyking", country: "Estados Unidos" },
  ],
  "Team Liquid": [
    { nick: "m1CKe", country: "Suecia" }, { nick: "Nisha", country: "Polonia" }, { nick: "Ace", country: "Dinamarca" },
    { nick: "Boxi", country: "Suecia" }, { nick: "tOfu", country: "Alemania" },
  ],
  "Iron Wing": [
    { nick: "Pure", country: "Rusia" }, { nick: "bzm", country: "Bulgaria" }, { nick: "33", country: "Israel" },
    { nick: "Ari", country: "Reino Unido" }, { nick: "Whitemon", country: "Indonesia" },
  ],
  "Xtreme Gaming": [
    { nick: "Ame", country: "China" }, { nick: "NothingToSay", country: "Malasia" }, { nick: "Xxs", country: "China" },
    { nick: "fy", country: "China" }, { nick: "xNova", country: "Malasia" },
  ],
  "Team Yandex": [
    { nick: "watson", country: "Kazajistán" }, { nick: "CHIRA_JUNIOR", country: "Rusia" }, { nick: "DM", country: "Rusia" },
    { nick: "Saksa", country: "Macedonia del Norte" }, { nick: "Malady", country: "Kazajistán" },
  ],
  "Team Spirit": [
    { nick: "Yatoro", country: "Ucrania" }, { nick: "Larl", country: "Rusia" }, { nick: "Collapse", country: "Rusia" },
    { nick: "not me", country: "Rusia" }, { nick: "rue", country: "Rusia" },
  ],
  "Team Vision": [
    { nick: "Satanic", country: "Rusia" }, { nick: "No[o]ne-", country: "Ucrania" }, { nick: "Noticed", country: "Rusia" },
    { nick: "9Class", country: "Rusia" }, { nick: "Dukalis", country: "Rusia" },
  ],
  "Nigma Galaxy": [
    { nick: "Suma1L-", country: "Pakistán" }, { nick: "Lorenof", country: "Ucrania" }, { nick: "Davai Lama", country: "Bélgica" },
    { nick: "OmaR", country: "Líbano" }, { nick: "GH", country: "Líbano" },
  ],
  "Huligani": [
    { nick: "ssnovv1", country: "Rusia" }, { nick: "Mirage`", country: "Kazajistán" }, { nick: "Corrupted", country: "Rusia" },
    { nick: "sayuw", country: "Rusia" }, { nick: "RESPECT", country: "Bielorrusia" },
  ],
  "Team Resilience": [
    { nick: "Erika", country: "China" }, { nick: "EchozZ", country: "China" }, { nick: "niu", country: "China" },
    { nick: "planet", country: "China" }, { nick: "zzq", country: "China" },
  ],
  "Vici Gaming": [
    { nick: "shiro", country: "China" }, { nick: "Xm", country: "China" }, { nick: "Bach", country: "China" },
    { nick: "XinQ", country: "China" }, { nick: "y`", country: "China" },
  ],
  "OG Esports": [
    { nick: "Natsumi-", country: "Filipinas" }, { nick: "Yopaj-", country: "Filipinas" }, { nick: "Raven^", country: "Filipinas" },
    { nick: "TIMS", country: "Filipinas" }, { nick: "skem", country: "Filipinas" },
  ],
  "LGD Gaming": [
    { nick: "Yuma", country: "Nicaragua" }, { nick: "Topson", country: "Finlandia" }, { nick: "Wisper", country: "Bolivia" },
    { nick: "Thiolicor", country: "Brasil" }, { nick: "KJ", country: "Brasil" },
  ],
  "GamerLegion": [
    { nick: "Ghost", country: "Malasia" }, { nick: "RCY", country: "Estados Unidos" }, { nick: "Fayde", country: "Estados Unidos" },
    { nick: "Bignum", country: "Ucrania" }, { nick: "Speeed", country: "Estados Unidos" },
  ],
};

function buildTI2026() {
  const teams = TI_2026_TEAMS.map((n) => ({ id: uid(), name: n, roster: TI_2026_ROSTERS[n] || null }));
  const byName = Object.fromEntries(teams.map((t) => [t.name, t.id]));
  const round1 = TI_2026_ROUND1.map(([a, b, date]) => ({
    id: uid(), teamAId: byName[a], teamBId: byName[b], scoreA: 0, scoreB: 0, played: false, date,
  }));
  const initialGroupOf = {};
  TI_2026_INITIAL_GROUPS.GA.forEach((n) => { initialGroupOf[byName[n]] = "GA"; });
  TI_2026_INITIAL_GROUPS.GB.forEach((n) => { initialGroupOf[byName[n]] = "GB"; });
  return {
    id: uid(),
    presetKey: "ti2026",
    name: "The International 2026",
    teams,
    format: "ti_swiss",
    swiss: { rounds: [round1] },
    initialGroupOf,
    eliminationRound: null,
    bracket: null,
  };
}

const EPL1_GROUP_A = ["Power Rangers", "Ilbirs eSports", "Team Syntax", "Nemiga Gaming", "Team Jenz", "Amaru Gaming"];
const EPL1_GROUP_B = ["Level UP", "Zero Tenacity", "RE Arise", "No Hoodwink", "PuckChamp"];
const EPL1_RESULTS_A = [
  ["Power Rangers", "Ilbirs eSports", 2, 1],
  ["Power Rangers", "Nemiga Gaming", 2, 1],
  ["Power Rangers", "Team Jenz", 2, 0],
  ["Power Rangers", "Amaru Gaming", 2, 0],
  ["Power Rangers", "Team Syntax", 2, 0],
  ["Ilbirs eSports", "Team Syntax", 2, 0],
  ["Ilbirs eSports", "Nemiga Gaming", 2, 1],
  ["Ilbirs eSports", "Amaru Gaming", 2, 0],
  ["Ilbirs eSports", "Team Jenz", 2, 0],
  ["Team Syntax", "Nemiga Gaming", 2, 1],
  ["Team Syntax", "Team Jenz", 2, 1],
  ["Team Syntax", "Amaru Gaming", 2, 0],
  ["Nemiga Gaming", "Amaru Gaming", 2, 1],
  ["Nemiga Gaming", "Team Jenz", 2, 0],
  ["Amaru Gaming", "Team Jenz", 2, 0],
];
const EPL1_RESULTS_B = [
  ["Level UP", "Zero Tenacity", 2, 1],
  ["Level UP", "RE Arise", 2, 0],
  ["Level UP", "No Hoodwink", 2, 1],
  ["Level UP", "PuckChamp", 2, 0],
  ["Zero Tenacity", "RE Arise", 2, 0],
  ["Zero Tenacity", "No Hoodwink", 2, 0],
  ["Zero Tenacity", "PuckChamp", 2, 0],
  ["RE Arise", "No Hoodwink", 2, 1],
  ["RE Arise", "PuckChamp", 2, 0],
  ["No Hoodwink", "PuckChamp", 2, 0],
];
// Fechas/hora reales de cada partido (obtenidas de dltv.org, hora local del sitio).
// Cubren tanto los ya jugados como los que aún faltan al 7 ago 2026.
const EPL1_DATES_A = [
  ["Power Rangers", "Ilbirs eSports", "2026-08-06T18:56"],
  ["Power Rangers", "Nemiga Gaming", "2026-07-28T09:03"],
  ["Power Rangers", "Team Jenz", "2026-08-07T15:10"],
  ["Power Rangers", "Amaru Gaming", "2026-07-30T16:17"],
  ["Ilbirs eSports", "Team Syntax", "2026-08-07T12:17"],
  ["Ilbirs eSports", "Nemiga Gaming", "2026-07-26T09:13"],
  ["Ilbirs eSports", "Amaru Gaming", "2026-07-30T18:50"],
  ["Team Syntax", "Nemiga Gaming", "2026-07-27T12:09"],
  ["Team Syntax", "Team Jenz", "2026-07-26T18:12"],
  ["Team Syntax", "Amaru Gaming", "2026-07-29T19:30"],
  ["Nemiga Gaming", "Amaru Gaming", "2026-07-29T15:00"],
  ["Team Jenz", "Nemiga Gaming", "2026-08-07T19:00"],
  ["Power Rangers", "Team Syntax", "2026-08-08T09:00"],
  ["Team Jenz", "Ilbirs eSports", "2026-08-08T15:00"],
  ["Amaru Gaming", "Team Jenz", "2026-08-08T18:00"],
];
const EPL1_DATES_B = [
  ["Level UP", "Zero Tenacity", "2026-07-30T12:07"],
  ["Level UP", "RE Arise", "2026-08-06T09:12"],
  ["Level UP", "No Hoodwink", "2026-08-06T15:00"],
  ["Level UP", "PuckChamp", "2026-07-27T09:07"],
  ["Zero Tenacity", "RE Arise", "2026-07-29T12:06"],
  ["Zero Tenacity", "No Hoodwink", "2026-08-07T09:00"],
  ["Zero Tenacity", "PuckChamp", "2026-07-30T09:08"],
  ["RE Arise", "No Hoodwink", "2026-08-06T12:00"],
  ["RE Arise", "PuckChamp", "2026-07-26T13:05"],
  ["No Hoodwink", "PuckChamp", "2026-07-28T12:02"],
];

// Rosters (fuente: hoja de cálculo oficial del torneo, pestaña "Teams Group").
const EPL1_ROSTERS = {
  "Team Syntax": [
    { nick: "leni", country: "Türkiye" }, { nick: "Mikey", country: "Iran" },
    { nick: "Emptiness死", country: "Kazakhstan" }, { nick: "Jeezy", country: "Türkiye" }, { nick: "Stoic", country: "Türkiye" },
  ],
  "Team Jenz": [
    { nick: "Parker", country: "Peru" }, { nick: "No!ob", country: "Lebanon" }, { nick: "ruustle", country: "Lebanon" },
    { nick: "Jing", country: "Philippines" }, { nick: "Yadomi", country: "Peru" },
  ],
  "PuckChamp": [
    { nick: "Yuragi", country: "Ukraine" }, { nick: "xn丶e", country: "Estonia" }, { nick: "krol9ash", country: "Ukraine" },
    { nick: "Gothic-", country: "Ukraine" }, { nick: "Hyuga", country: "Ukraine" },
  ],
  "Zero Tenacity": [
    { nick: "nesfeer", country: "Russia" }, { nick: "Worick", country: "Russia" }, { nick: "Miksa", country: "Serbia" },
    { nick: "dEsire", country: "Greece" }, { nick: "MoOz", country: "Peru" },
  ],
  "Nemiga Gaming": [
    { nick: "byun", country: "Belarus" }, { nick: "young G", country: "Belarus" }, { nick: "Covisnine", country: "Sevastopol" },
    { nick: "ariel", country: "Russia" }, { nick: "JANTER", country: "Russia" },
  ],
  "Level UP": [
    { nick: "WoE", country: "Russia" }, { nick: "Ainkrad", country: "Belarus" }, { nick: "bb3px", country: "Russia" },
    { nick: "queezy", country: "Russia" }, { nick: "Htrd", country: "Russia" },
  ],
  "Ilbirs eSports": [
    { nick: "423", country: "Mongolia" }, { nick: "niche", country: "Ukraine" }, { nick: "Norma", country: "Ukraine" },
    { nick: "Fernans", country: "Ukraine" }, { nick: "ponlo", country: "Singapore/Georgia" },
  ],
  "Amaru Gaming": [
    { nick: "K1", country: "Peru" }, { nick: "PiPi", country: "Peru" }, { nick: "Oscar", country: "Bolivia" },
    { nick: "Genek", country: "Peru" }, { nick: "Panda", country: "Peru" },
  ],
  "Power Rangers": [
    { nick: "bashka", country: "Russia" }, { nick: "kiyotaka", country: "Russia" }, { nick: "alberkaaa", country: "Russia" },
    { nick: "Immersion", country: "Russia" }, { nick: "Till The End", country: "Ukraine" },
  ],
  "RE Arise": [
    { nick: "yowaai", country: "Ukraine" }, { nick: "Ethereal", country: "Kazakhstan" }, { nick: "Ankou ♡", country: "Estonia" },
    { nick: "ani-san", country: "Kazakhstan" }, { nick: "waveformn", country: "Russia" },
  ],
  // No Hoodwink: roster no disponible en la hoja consultada.
};

// Premiación oficial (fuente: pestaña "Prize Pool"). Los puestos se asignan
// automáticamente según cómo termine el torneo, no están fijados a un equipo.
const EPL1_PRIZE_POOL = [
  { place: "1er lugar", amount: "$50,000" },
  { place: "2do lugar", amount: "$25,000" },
  { place: "3er lugar", amount: "$13,000" },
  { place: "4to lugar", amount: "$7,000" },
  { place: "5to-6to lugar", amount: "$2,500" },
  { place: "5to-6to lugar", amount: "$2,500" },
];

// Los 4 equipos que arrancan directo en playoffs (invitados), sin pasar por grupos.
// Fuente: pestaña "Playoffs Bracket" de la hoja oficial.
const EPL1_DIRECT_INVITES = ["Yellow Submarine", "MOUZ", "Rune Eaters", "NAVI"];
// Fechas reales de cada cruce de playoffs (doble eliminación, hora CEST).
const EPL1_PLAYOFF_DATES = {
  ub: [
    ["2026-08-09T09:00", "2026-08-09T12:00", "2026-08-09T15:00", "2026-08-09T18:00"],
    ["2026-08-10T15:00", "2026-08-10T18:00"],
    ["2026-08-11T15:00"],
  ],
  lb: [
    ["2026-08-10T09:00", "2026-08-10T12:00"],
    ["2026-08-11T09:00", "2026-08-11T12:00"],
    ["2026-08-11T18:00"],
    ["2026-08-12T09:00"],
  ],
  grandFinal: ["2026-08-12T15:00"],
};

function applyDEDates(bracket, dates) {
  const ub = bracket.ub.map((round, r) => round.map((m, i) => ({ ...m, date: dates.ub?.[r]?.[i] || m.date })));
  const lb = bracket.lb.map((round, r) => round.map((m, i) => ({ ...m, date: dates.lb?.[r]?.[i] || m.date })));
  const grandFinal = bracket.grandFinal.map((m, i) => ({ ...m, date: dates.grandFinal?.[i] || m.date }));
  return { ub, lb, grandFinal };
}

// Construye el bracket real de playoffs (doble eliminación) a partir de los
// puestos 1° y 2° de cada grupo + los 4 invitados directos.
function buildEplPlayoffs(tournament) {
  const teamsById = Object.fromEntries(tournament.teams.map((t) => [t.id, t]));
  const byName = Object.fromEntries(tournament.teams.map((t) => [t.name, t.id]));
  const [groupA, groupB] = tournament.groups;
  const standingsA = calcStandings(groupA, teamsById);
  const standingsB = calcStandings(groupB, teamsById);
  const [ys, mouz, runeEaters, navi] = EPL1_DIRECT_INVITES.map((n) => byName[n]);
  const pairs = [
    [standingsA[0].teamId, ys],
    [standingsB[0].teamId, mouz],
    [standingsA[1].teamId, runeEaters],
    [standingsB[1].teamId, navi],
  ];
  return applyDEDates(generateDoubleElimN(pairs), EPL1_PLAYOFF_DATES);
}

function buildEPLMasters1() {
  const teamsA = EPL1_GROUP_A.map((n) => ({ id: uid(), name: n, roster: EPL1_ROSTERS[n] || null }));
  const teamsB = EPL1_GROUP_B.map((n) => ({ id: uid(), name: n, roster: EPL1_ROSTERS[n] || null }));
  const directInvites = EPL1_DIRECT_INVITES.map((n) => ({ id: uid(), name: n, roster: null, directInvite: true }));
  const teams = [...teamsA, ...teamsB, ...directInvites];
  const byName = Object.fromEntries(teams.map((t) => [t.name, t.id]));
  let matchesA = roundRobinMatches(teamsA.map((t) => t.id));
  EPL1_RESULTS_A.forEach(([a, b, sa, sb]) => { matchesA = applyResult(matchesA, byName, a, b, sa, sb); });
  EPL1_DATES_A.forEach(([a, b, date]) => { matchesA = applyDate(matchesA, byName, a, b, date); });
  let matchesB = roundRobinMatches(teamsB.map((t) => t.id));
  EPL1_RESULTS_B.forEach(([a, b, sa, sb]) => { matchesB = applyResult(matchesB, byName, a, b, sa, sb); });
  EPL1_DATES_B.forEach(([a, b, date]) => { matchesB = applyDate(matchesB, byName, a, b, date); });
  return {
    id: uid(),
    presetKey: "eplmasters1",
    name: "EPL Masters I",
    teams,
    format: "both",
    qualifiers: 2,
    groups: [
      { id: uid(), name: "Grupo A", teamIds: teamsA.map((t) => t.id), matches: matchesA },
      { id: uid(), name: "Grupo B", teamIds: teamsB.map((t) => t.id), matches: matchesB },
    ],
    bracket: null,
    doubleElimBracket: null,
    prizePool: EPL1_PRIZE_POOL,
  };
}

const PRESETS = [
  {
    key: "ti2026",
    label: "The International 2026",
    desc: "16 equipos · fase suiza (aún no arranca, inicia 13 ago) · Shanghái",
    build: buildTI2026,
  },
  {
    key: "eplmasters1",
    label: "EPL Masters I",
    desc: "11 equipos activos · fase de grupos ya jugada casi completa · playoffs por definir",
    build: buildEPLMasters1,
  },
];

const MANUAL_TEMPLATES = [
  { key: "grupo_unico", label: "Round robin simple", desc: "Un solo grupo, todos contra todos", teams: 6, numGroups: 1, qualifiers: 4, format: "groups" },
  { key: "grupos_playoffs", label: "Grupos + Playoffs", desc: "2 grupos, top 4 avanza a bracket", teams: 12, numGroups: 2, qualifiers: 4, format: "both" },
  { key: "major", label: "Estilo Major (16 equipos)", desc: "4 grupos, top 2 a bracket eliminatorio", teams: 16, numGroups: 4, qualifiers: 2, format: "both" },
  { key: "bracket_solo", label: "Solo eliminación directa", desc: "8 equipos, bracket puro", teams: 8, numGroups: 0, qualifiers: 0, format: "bracket" },
];

// ---------- Persistencia ----------

function useStorage() {
  const [tournaments, setTournaments] = useState([]);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("tournaments", false);
        if (res && res.value) setTournaments(JSON.parse(res.value));
      } catch (e) {}
      finally { loaded.current = true; setReady(true); }
    })();
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    window.storage.set("tournaments", JSON.stringify(tournaments), false).catch(() => {});
  }, [tournaments]);

  return [tournaments, setTournaments, ready];
}

// ---------- Componentes de UI compartidos ----------

function Badge({ children, color }) {
  return <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase", padding: "3px 8px", borderRadius: 4, background: color + "22", color, border: `1px solid ${color}55` }}>{children}</span>;
}

function TeamName({ teamsById, id }) {
  if (!id) return <span style={{ color: "#6b6b6b", fontStyle: "italic" }}>por definir</span>;
  return <span>{teamsById[id]?.name || "?"}</span>;
}

const COUNTRY_FLAGS = {
  "türkiye": "🇹🇷", "turkey": "🇹🇷", "iran": "🇮🇷", "kazakhstan": "🇰🇿", "kazajistán": "🇰🇿",
  "lebanon": "🇱🇧", "líbano": "🇱🇧", "peru": "🇵🇪", "perú": "🇵🇪", "philippines": "🇵🇭", "filipinas": "🇵🇭",
  "ukraine": "🇺🇦", "ucrania": "🇺🇦", "estonia": "🇪🇪", "serbia": "🇷🇸", "greece": "🇬🇷", "grecia": "🇬🇷",
  "belarus": "🇧🇾", "bielorrusia": "🇧🇾", "bolivia": "🇧🇴", "mongolia": "🇲🇳",
  "russia": "🇷🇺", "rusia": "🇷🇺", "indonesia": "🇮🇩", "malaysia": "🇲🇾", "malasia": "🇲🇾",
  "moldova": "🇲🇩", "moldavia": "🇲🇩", "slovakia": "🇸🇰", "eslovaquia": "🇸🇰", "jordan": "🇯🇴", "jordania": "🇯🇴",
  "denmark": "🇩🇰", "dinamarca": "🇩🇰", "united states": "🇺🇸", "estados unidos": "🇺🇸",
  "poland": "🇵🇱", "polonia": "🇵🇱", "sweden": "🇸🇪", "suecia": "🇸🇪", "germany": "🇩🇪", "alemania": "🇩🇪",
  "bulgaria": "🇧🇬", "israel": "🇮🇱", "united kingdom": "🇬🇧", "reino unido": "🇬🇧", "china": "🇨🇳",
  "north macedonia": "🇲🇰", "macedonia del norte": "🇲🇰", "pakistan": "🇵🇰", "pakistán": "🇵🇰",
  "belgium": "🇧🇪", "bélgica": "🇧🇪", "nicaragua": "🇳🇮", "finland": "🇫🇮", "finlandia": "🇫🇮",
  "brazil": "🇧🇷", "brasil": "🇧🇷",
};
function countryFlag(country) {
  if (!country) return "";
  return COUNTRY_FLAGS[country.trim().toLowerCase()] || "";
}

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;
  return d.toLocaleString("es-PE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function MatchRow({ match, teamsById, onSave, onDateChange }) {
  const [sa, setSa] = useState(match.scoreA);
  const [sb, setSb] = useState(match.scoreB);
  const nameA = teamsById[match.teamAId]?.name || "?";
  const nameB = teamsById[match.teamBId]?.name || "?";
  const scoreA = sa === "" ? 0 : sa;
  const scoreB = sb === "" ? 0 : sb;
  const onScoreChange = (setter) => (e) => {
    const raw = e.target.value;
    if (raw === "") { setter(""); return; }
    setter(Math.min(3, Math.max(0, parseInt(raw) || 0)));
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, borderBottom: "1px solid #1c1c1c", padding: "6px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
        <span style={{ flex: 1, textAlign: "right", fontWeight: match.played && match.scoreA > match.scoreB ? 600 : 400, color: match.played && match.scoreA > match.scoreB ? RADIANT : "#ddd" }}>{nameA}</span>
        <input type="number" min={0} max={3} value={sa} onFocus={(e) => e.target.select()} onChange={onScoreChange(setSa)} onBlur={() => sa === "" && setSa(0)} style={scoreInputStyle} />
        <span style={{ color: "#666" }}>–</span>
        <input type="number" min={0} max={3} value={sb} onFocus={(e) => e.target.select()} onChange={onScoreChange(setSb)} onBlur={() => sb === "" && setSb(0)} style={scoreInputStyle} />
        <span style={{ flex: 1, fontWeight: match.played && match.scoreB > match.scoreA ? 600 : 400, color: match.played && match.scoreB > match.scoreA ? RADIANT : "#ddd" }}>{nameB}</span>
        <button onClick={() => onSave(scoreA, scoreB)} style={saveBtnStyle} title="Guardar resultado"><Check size={14} /></button>
        {match.played && <Badge color={GOLD}>jugado</Badge>}
      </div>
      {onDateChange && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: "#777" }}>{match.date ? formatDate(match.date) : "sin fecha"}</span>
          <input
            type="datetime-local"
            value={match.date || ""}
            onChange={(e) => onDateChange(e.target.value || null)}
            style={{ background: "#161616", border: "1px solid #2c2c2c", borderRadius: 4, color: "#888", fontSize: 10, padding: "1px 4px" }}
          />
        </div>
      )}
    </div>
  );
}

function GroupsView({ tournament, updateTournament }) {
  const teamsById = Object.fromEntries(tournament.teams.map((t) => [t.id, t]));
  const setMatchResult = (groupId, matchId, scoreA, scoreB) => {
    const groups = tournament.groups.map((g) => g.id !== groupId ? g : { ...g, matches: g.matches.map((m) => m.id === matchId ? { ...m, scoreA, scoreB, played: true } : m) });
    updateTournament({ ...tournament, groups });
  };
  const setMatchDate = (groupId, matchId, date) => {
    const groups = tournament.groups.map((g) => g.id !== groupId ? g : { ...g, matches: g.matches.map((m) => m.id === matchId ? { ...m, date } : m) });
    updateTournament({ ...tournament, groups });
  };
  const allPlayed = tournament.groups.every((g) => g.matches.every((m) => m.played));
  const isEpl = tournament.presetKey === "eplmasters1";
  const generatePlayoffs = () => {
    if (isEpl) {
      updateTournament({ ...tournament, doubleElimBracket: buildEplPlayoffs(tournament) });
      return;
    }
    const seeds = [];
    const standingsByGroup = tournament.groups.map((g) => calcStandings(g, teamsById));
    const maxRank = tournament.qualifiers || Math.max(...standingsByGroup.map((s) => s.length));
    for (let rank = 0; rank < maxRank; rank++) standingsByGroup.forEach((s) => { if (s[rank]) seeds.push(s[rank].teamId); });
    updateTournament({ ...tournament, bracket: generateBracket(seeds) });
  };
  const hasPlayoffs = isEpl ? !!tournament.doubleElimBracket : !!tournament.bracket;
  return (
    <div>
      {tournament.groups.map((group) => {
        const standings = calcStandings(group, teamsById);
        const groupComplete = group.matches.every((m) => m.played);
        return (
          <div key={group.id} style={{ marginBottom: 32 }}>
            <h3 style={h3Style}>{group.name}</h3>
            <table style={tableStyle}>
              <thead><tr><th style={thStyle}>#</th><th style={{ ...thStyle, textAlign: "left" }}>Equipo</th><th style={thStyle}>PJ</th><th style={thStyle}>PG</th><th style={thStyle}>PP</th><th style={thStyle}>Dif</th><th style={thStyle}>Pts</th></tr></thead>
              <tbody>
                {standings.map((row, i) => {
                  const advanced = groupComplete && i < (tournament.qualifiers || 0);
                  const eliminated = groupComplete && i >= (tournament.qualifiers || 0) && (tournament.qualifiers || 0) > 0;
                  const rowColor = advanced ? RADIANT : eliminated ? DIRE : "#ddd";
                  const rowBg = advanced ? RADIANT + "14" : eliminated ? DIRE + "14" : "transparent";
                  return (
                    <tr key={row.teamId} style={{ background: rowBg }}>
                      <td style={tdStyle}>{i + 1}</td><td style={{ ...tdStyle, textAlign: "left", fontWeight: 500, color: rowColor }}>{row.name}</td>
                      <td style={tdStyle}>{row.pj}</td><td style={tdStyle}>{row.pg}</td><td style={tdStyle}>{row.pp}</td>
                      <td style={tdStyle}>{row.gf - row.gc > 0 ? "+" : ""}{row.gf - row.gc}</td>
                      <td style={{ ...tdStyle, fontWeight: 600, color: GOLD }}>{row.pts}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ marginTop: 12 }}>{sortByDate(group.matches).map((m) => <MatchRow key={m.id} match={m} teamsById={teamsById} onSave={(sa, sb) => setMatchResult(group.id, m.id, sa, sb)} onDateChange={(date) => setMatchDate(group.id, m.id, date)} />)}</div>
          </div>
        );
      })}
      {tournament.format === "both" && <button onClick={generatePlayoffs} style={primaryBtnStyle}><ListTree size={16} /> {hasPlayoffs ? "Regenerar playoffs" : "Generar playoffs"}</button>}
      {tournament.format === "both" && !allPlayed && <p style={{ fontSize: 12, color: "#888", marginTop: 8 }}>Los grupos aún no están completos — los clasificados que uses en playoffs pueden cambiar si sigues cargando resultados de grupos.</p>}
    </div>
  );
}

function BracketMatch({ match, teamsById, onSave }) {
  const [sa, setSa] = useState(match.scoreA);
  const [sb, setSb] = useState(match.scoreB);
  const canPlay = match.teamAId && match.teamBId;
  const aWon = match.played && match.scoreA > match.scoreB;
  const bWon = match.played && match.scoreB > match.scoreA;
  const scoreA = sa === "" ? 0 : sa;
  const scoreB = sb === "" ? 0 : sb;
  const onScoreChange = (setter) => (e) => {
    const raw = e.target.value;
    if (raw === "") { setter(""); return; }
    setter(Math.min(3, Math.max(0, parseInt(raw) || 0)));
  };
  return (
    <div style={{ border: "1px solid #2c2c2c", borderRadius: 8, background: "#161616", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", borderBottom: "1px solid #2c2c2c", background: aWon ? RADIANT + "14" : "transparent" }}>
        <span style={{ fontSize: 13, fontWeight: aWon ? 600 : 400, color: aWon ? RADIANT : match.teamAId ? "#ddd" : "#666" }}><TeamName teamsById={teamsById} id={match.teamAId} /></span>
        {canPlay && <input type="number" min={0} max={3} value={sa} onFocus={(e) => e.target.select()} onChange={onScoreChange(setSa)} onBlur={() => sa === "" && setSa(0)} style={{ ...scoreInputStyle, width: 42, padding: "4px 2px" }} />}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", background: bWon ? RADIANT + "14" : "transparent" }}>
        <span style={{ fontSize: 13, fontWeight: bWon ? 600 : 400, color: bWon ? RADIANT : match.teamBId ? "#ddd" : "#666" }}><TeamName teamsById={teamsById} id={match.teamBId} /></span>
        {canPlay && <input type="number" min={0} max={3} value={sb} onFocus={(e) => e.target.select()} onChange={onScoreChange(setSb)} onBlur={() => sb === "" && setSb(0)} style={{ ...scoreInputStyle, width: 42, padding: "4px 2px" }} />}
      </div>
      {canPlay && <button onClick={() => onSave(scoreA, scoreB)} style={{ ...saveBtnStyle, width: "100%", borderRadius: 0, borderTop: "1px solid #2c2c2c" }}><Check size={12} /> guardar</button>}
    </div>
  );
}

function BracketView({ bracket, teamsById, onUpdateBracket, title }) {
  const setMatchResult = (roundIdx, matchIdx, scoreA, scoreB) => {
    const rounds = bracket.map((r) => r.map((m) => ({ ...m })));
    rounds[roundIdx][matchIdx] = { ...rounds[roundIdx][matchIdx], scoreA, scoreB, played: true };
    onUpdateBracket(recomputeBracket(rounds));
  };
  const roundNames = (total, idx) => { const remaining = total - idx; if (remaining === 1) return "Gran final"; if (remaining === 2) return "Semifinales"; if (remaining === 3) return "Cuartos de final"; return `Ronda ${idx + 1}`; };
  const champion = bracket.length ? bracket[bracket.length - 1][0]?.winnerId : null;
  return (
    <div>
      {title && <h3 style={h3Style}>{title}</h3>}
      {champion && <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, padding: "12px 16px", background: GOLD + "18", border: `1px solid ${GOLD}55`, borderRadius: 8 }}><Trophy size={20} color={GOLD} /><span style={{ fontWeight: 600, color: GOLD }}>Campeón: {teamsById[champion]?.name}</span></div>}
      <div style={{ display: "flex", gap: 32, overflowX: "auto", paddingBottom: 8 }}>
        {bracket.map((round, ri) => (
          <div key={ri} style={{ minWidth: 220, display: "flex", flexDirection: "column", justifyContent: "space-around", gap: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#999", textAlign: "center" }}>{roundNames(bracket.length, ri)}</div>
            {round.map((m, mi) => <BracketMatch key={m.id} match={m} teamsById={teamsById} onSave={(sa, sb) => setMatchResult(ri, mi, sa, sb)} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Layout geométrico del bracket: columnas por ronda, filas UB arriba / LB abajo,
// y la Gran Final centrada verticalmente entre la final de UB y la final de LB.
// Se adapta solo a la cantidad de rondas real (4, 8, 16, 32 equipos...).
const CW = 210, COLGAP = 70, SLOT = 100, ROWGAP = 90, CARD_H = 90, TOP_PAD = 36;
const colX = (i) => i * (CW + COLGAP);
const laneY = (i, n, offset, H) => offset + (H * (i + 0.5)) / n;

function roundLabel(prefix, r, total) {
  const remaining = total - r;
  if (remaining === 1) return `${prefix} Final`;
  if (remaining === 2) return `${prefix} Semis`;
  if (remaining === 3) return `${prefix} Cuartos`;
  return `${prefix} Ronda ${r + 1}`;
}

function buildDELayout(bracket) {
  const k = bracket.ub.length;
  const lbRounds = bracket.lb.length;
  const H = SLOT * bracket.ub[0].length;
  const LB_Y0 = H + ROWGAP + TOP_PAD;
  const pos = {};
  bracket.ub.forEach((round, r) => round.forEach((m, i) => {
    pos[m.id] = { x: colX(r), y: laneY(i, round.length, TOP_PAD, H), m, bracketKey: "ub", round: r, idx: i };
  }));
  bracket.lb.forEach((round, r) => round.forEach((m, i) => {
    pos[m.id] = { x: colX(r), y: laneY(i, round.length, LB_Y0, H), m, bracketKey: "lb", round: r, idx: i };
  }));
  const ubFinalM = bracket.ub[k - 1][0], lbFinalM = bracket.lb[lbRounds - 1][0];
  const gfCol = Math.max(k, lbRounds);
  const gfY = (pos[ubFinalM.id].y + pos[lbFinalM.id].y) / 2;
  pos[bracket.grandFinal[0].id] = { x: colX(gfCol), y: gfY, m: bracket.grandFinal[0], bracketKey: "grandFinal", round: 0, idx: 0 };

  const findMatch = (link) => (link.bracket === "ub" ? bracket.ub[link.round][link.idx] : link.bracket === "lb" ? bracket.lb[link.round][link.idx] : bracket.grandFinal[0]);
  const edges = [];
  [...bracket.ub.flat(), ...bracket.lb.flat(), ...bracket.grandFinal].forEach((m) => {
    if (m.links && m.links.length) edges.push([m.links.map(findMatch), m]);
  });

  const headers = [];
  bracket.ub.forEach((round, r) => headers.push({ x: colX(r), y: TOP_PAD - 30, label: roundLabel("Upper Bracket", r, k), color: RADIANT }));
  bracket.lb.forEach((round, r) => headers.push({ x: colX(r), y: LB_Y0 - 30, label: roundLabel("Lower Bracket", r, lbRounds), color: DIRE }));
  headers.push({ x: colX(gfCol), y: TOP_PAD - 30, label: "Gran Final (Bo5)", color: GOLD });

  return { pos, edges, headers, width: colX(gfCol) + CW + 20, height: LB_Y0 + H + 60 };
}

function ConnectorSvg({ pos, edges, width, height }) {
  const paths = [];
  edges.forEach(([sources, dest], ei) => {
    const d = pos[dest.id];
    if (!d) return;
    const destX = d.x, destY = d.y;
    const xMid = destX - COLGAP / 2;
    const ys = [];
    sources.forEach((s, si) => {
      const sp = pos[s.id];
      if (!sp) return;
      ys.push(sp.y);
      paths.push(<line key={`${ei}-h${si}`} x1={sp.x + CW} y1={sp.y} x2={xMid} y2={sp.y} stroke="#444" strokeWidth={2} />);
    });
    ys.push(destY);
    const yTop = Math.min(...ys), yBot = Math.max(...ys);
    if (yTop !== yBot) paths.push(<line key={`${ei}-v`} x1={xMid} y1={yTop} x2={xMid} y2={yBot} stroke="#444" strokeWidth={2} />);
    paths.push(<line key={`${ei}-out`} x1={xMid} y1={destY} x2={destX} y2={destY} stroke="#444" strokeWidth={2} />);
  });
  return <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>{paths}</svg>;
}

function DoubleElimBracketView({ bracket, teamsById, onUpdate }) {
  const setResult = (bracketKey, round, idx, scoreA, scoreB) => {
    const updated = { ...bracket };
    if (bracketKey === "grandFinal") {
      updated.grandFinal = [{ ...bracket.grandFinal[0], scoreA, scoreB, played: true }];
    } else {
      updated[bracketKey] = bracket[bracketKey].map((r, ri) => (ri !== round ? r : r.map((m, mi) => (mi !== idx ? m : { ...m, scoreA, scoreB, played: true }))));
    }
    onUpdate(recomputeDoubleElimGeneric(updated));
  };
  const champion = bracket.grandFinal[0].played
    ? (bracket.grandFinal[0].scoreA > bracket.grandFinal[0].scoreB ? bracket.grandFinal[0].teamAId : bracket.grandFinal[0].teamBId)
    : null;
  const { pos, edges, headers, width, height } = buildDELayout(bracket);
  return (
    <div>
      {champion && <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "12px 16px", background: GOLD + "18", border: `1px solid ${GOLD}55`, borderRadius: 8 }}><Trophy size={20} color={GOLD} /><span style={{ fontWeight: 600, color: GOLD }}>Campeón: {teamsById[champion]?.name}</span></div>}
      <div style={{ overflowX: "auto", paddingBottom: 12 }}>
        <div style={{ position: "relative", width, height }}>
          {headers.map((h, i) => (
            <div key={i} style={{ position: "absolute", left: h.x, top: h.y, width: CW, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, color: h.color, textAlign: "center" }}>{h.label}</div>
          ))}
          <ConnectorSvg pos={pos} edges={edges} width={width} height={height} />
          {Object.values(pos).map(({ x, y, m, bracketKey, round, idx }) => (
            <div key={m.id} style={{ position: "absolute", left: x, top: y - CARD_H / 2, width: CW }}>
              <BracketMatch match={m} teamsById={teamsById} onSave={(sa, sb) => setResult(bracketKey, round, idx, sa, sb)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TIStageView({ tournament, updateTournament }) {
  const teamsById = Object.fromEntries(tournament.teams.map((t) => [t.id, t]));
  const teamIds = tournament.teams.map((t) => t.id);
  const rounds = tournament.swiss.rounds;
  const currentRound = rounds[rounds.length - 1];
  const currentRoundPlayed = currentRound.every((m) => m.played);
  const standings = swissStandings(teamIds, rounds, teamsById);
  const swissDone = rounds.length >= SWISS_ROUNDS && currentRoundPlayed;

  const setSwissResult = (roundIdx, matchId, scoreA, scoreB) => {
    const newRounds = rounds.map((r, i) => i === roundIdx ? r.map((m) => m.id === matchId ? { ...m, scoreA, scoreB, played: true } : m) : r);
    updateTournament({ ...tournament, swiss: { rounds: newRounds } });
  };
  const setSwissDate = (roundIdx, matchId, date) => {
    const newRounds = rounds.map((r, i) => i === roundIdx ? r.map((m) => m.id === matchId ? { ...m, date } : m) : r);
    updateTournament({ ...tournament, swiss: { rounds: newRounds } });
  };
  const nextSwissRound = () => {
    const nextRoundNumber = rounds.length + 1;
    const groupOf = tournament.initialGroupOf;
    // Excluir equipos ya clasificados (4+ victorias) — no reciben más enfrentamientos.
    const fullRecords = computeSwissRecords(teamIds, rounds);
    const activeIds = teamIds.filter((id) => fullRecords[id].wins < 4);
    let pairFilter = null;
    if (groupOf) {
      if (nextRoundNumber === 2 || nextRoundNumber === 3) pairFilter = (a, b) => groupOf[a] === groupOf[b];
      else if (nextRoundNumber === 4) pairFilter = (a, b) => groupOf[a] !== groupOf[b];
    }
    updateTournament({ ...tournament, swiss: { rounds: [...rounds, generateSwissRound(activeIds, rounds, pairFilter)] } });
  };

  return (
    <div>
      <h3 style={h3Style}>Fase suiza · ronda {rounds.length} de {SWISS_ROUNDS}</h3>
      <table style={tableStyle}>
        <thead><tr><th style={thStyle}>#</th><th style={{ ...thStyle, textAlign: "left" }}>Equipo</th><th style={thStyle}>G</th><th style={thStyle}>P</th><th style={thStyle}>Estado</th></tr></thead>
        <tbody>
          {standings.map((row, i) => {
            let status = null, color = "#ddd";
            if (row.wins >= 4) {
              status = "🟢 CLASIFICADO"; color = RADIANT;
            } else if (swissDone) {
              if (i < 3) { status = "directo a Main Event"; color = RADIANT; }
              else if (i < 13) {
                const em = tournament.eliminationRound && tournament.eliminationRound.find((m) => m.teamAId === row.teamId || m.teamBId === row.teamId);
                if (em && em.played) {
                  const winnerId = em.scoreA > em.scoreB ? em.teamAId : em.teamBId;
                  if (winnerId === row.teamId) { status = "avanzó al Main Event"; color = RADIANT; }
                  else { status = "eliminado"; color = DIRE; }
                } else { status = "ronda de eliminación"; color = "#ddd"; }
              } else { status = "eliminado"; color = DIRE; }
            }
            const groupOf = tournament.initialGroupOf;
            const groupLabel = groupOf ? (groupOf[row.teamId] === "GA" ? " [A]" : " [B]") : "";
            return <tr key={row.teamId}><td style={tdStyle}>{i + 1}</td><td style={{ ...tdStyle, textAlign: "left", fontWeight: 500, color }}>{row.name}<span style={{ fontSize: 10, color: "#666", fontWeight: 400 }}>{groupLabel}</span></td><td style={tdStyle}>{row.wins}</td><td style={tdStyle}>{row.losses}</td><td style={{ ...tdStyle, fontSize: 11, color }}>{status || "-"}</td></tr>;
          })}
        </tbody>
      </table>
      {rounds.map((round, ri) => (
        <div key={ri} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>Ronda {ri + 1}</div>
          {sortByDate(round).map((m) => <MatchRow key={m.id} match={m} teamsById={teamsById} onSave={(sa, sb) => setSwissResult(ri, m.id, sa, sb)} onDateChange={(date) => setSwissDate(ri, m.id, date)} />)}
        </div>
      ))}
      {!swissDone && rounds.length < SWISS_ROUNDS && <button onClick={nextSwissRound} disabled={!currentRoundPlayed} style={{ ...primaryBtnStyle, opacity: currentRoundPlayed ? 1 : 0.4 }}><Layers size={16} /> Generar ronda {rounds.length + 1}</button>}
      {swissDone && <p style={{ fontSize: 12, color: "#888", marginTop: 8 }}>Fase de grupos completa. Ve a la pestaña "Elimination Round" para continuar.</p>}
    </div>
  );
}

function EliminationRoundView({ tournament, updateTournament }) {
  const teamsById = Object.fromEntries(tournament.teams.map((t) => [t.id, t]));
  const teamIds = tournament.teams.map((t) => t.id);
  const rounds = tournament.swiss.rounds;
  const currentRoundPlayed = rounds[rounds.length - 1].every((m) => m.played);
  const standings = swissStandings(teamIds, rounds, teamsById);
  const swissDone = rounds.length >= SWISS_ROUNDS && currentRoundPlayed;

  const startEliminationRound = () => {
    const ranked = standings.map((s) => s.teamId);
    updateTournament({ ...tournament, eliminationRound: generateEliminationRoundMatches(ranked.slice(3, 13)) });
  };
  const setElimResult = (matchId, scoreA, scoreB) => updateTournament({ ...tournament, eliminationRound: tournament.eliminationRound.map((m) => m.id === matchId ? { ...m, scoreA, scoreB, played: true } : m) });
  const setElimDate = (matchId, date) => updateTournament({ ...tournament, eliminationRound: tournament.eliminationRound.map((m) => m.id === matchId ? { ...m, date } : m) });
  const startMainEvent = () => {
    const top3 = standings.slice(0, 3).map((s) => s.teamId);
    const elimWinners = tournament.eliminationRound.map((m) => (m.scoreA > m.scoreB ? m.teamAId : m.teamBId));
    updateTournament({ ...tournament, bracket: generateBracket([...top3, ...elimWinners]) });
  };
  const elimDone = tournament.eliminationRound && tournament.eliminationRound.every((m) => m.played);

  if (!swissDone) {
    return <p style={{ fontSize: 13, color: "#888" }}>Completa las {SWISS_ROUNDS} rondas de la fase suiza para desbloquear la ronda de eliminación.</p>;
  }

  return (
    <div>
      <h3 style={h3Style}>Ronda de eliminación (puestos 4-13, 5 avanzan)</h3>
      <p style={{ fontSize: 12, color: "#888", marginTop: -6, marginBottom: 14 }}>
        Aproximación por posición (4° vs 13°, 5° vs 12°...). El reglamento real usa un draft donde los equipos eligen rival — ver pestaña "Reglamento".
      </p>
      {!tournament.eliminationRound && <button onClick={startEliminationRound} style={primaryBtnStyle}><ListTree size={16} /> Generar ronda de eliminación</button>}
      {tournament.eliminationRound && sortByDate(tournament.eliminationRound).map((m) => (
        <MatchRow key={m.id} match={m} teamsById={teamsById} onSave={(sa, sb) => setElimResult(m.id, sa, sb)} onDateChange={(date) => setElimDate(m.id, date)} />
      ))}
      {elimDone && !tournament.bracket && <button onClick={startMainEvent} style={{ ...primaryBtnStyle, marginTop: 8 }}><Trophy size={16} /> Generar Main Event</button>}
      {tournament.bracket && <div style={{ marginTop: 28 }}><BracketView bracket={tournament.bracket} teamsById={teamsById} onUpdateBracket={(b) => updateTournament({ ...tournament, bracket: b })} title="Main Event" /></div>}
    </div>
  );
}

// ---------- Alta manual ----------

function NewTournamentForm({ onCreate, onCancel }) {
  const [name, setName] = useState("");
  const [template, setTemplate] = useState(MANUAL_TEMPLATES[1]);
  const [teamsText, setTeamsText] = useState(Array.from({ length: MANUAL_TEMPLATES[1].teams }, (_, i) => `Equipo ${i + 1}`).join("\n"));
  const [numGroups, setNumGroups] = useState(MANUAL_TEMPLATES[1].numGroups);
  const [qualifiers, setQualifiers] = useState(MANUAL_TEMPLATES[1].qualifiers);
  const [format, setFormat] = useState(MANUAL_TEMPLATES[1].format);

  const applyTemplate = (t) => {
    setTemplate(t);
    setTeamsText(Array.from({ length: t.teams }, (_, i) => `Equipo ${i + 1}`).join("\n"));
    setNumGroups(t.numGroups); setQualifiers(t.qualifiers); setFormat(t.format);
  };

  const teamNames = teamsText.split("\n").map((s) => s.trim()).filter(Boolean);

  const handleSubmit = () => {
    if (!name.trim() || teamNames.length < 2) return;
    const teams = teamNames.map((n) => ({ id: uid(), name: n }));
    const teamIds = teams.map((t) => t.id);
    let groups = [];
    if (format !== "bracket") {
      const groupTeamIdLists = numGroups > 1 ? splitIntoGroups(teamIds, numGroups) : [teamIds];
      groups = groupTeamIdLists.map((ids, i) => ({ id: uid(), name: numGroups > 1 ? `Grupo ${String.fromCharCode(65 + i)}` : "Todos contra todos", teamIds: ids, matches: roundRobinMatches(ids) }));
    }
    let bracket = null;
    if (format === "bracket") bracket = generateBracket(teamIds);
    onCreate({ id: uid(), name: name.trim(), teams, format, qualifiers: format === "both" ? qualifiers : 0, groups, bracket });
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <button onClick={onCancel} style={backBtnStyle}><ArrowLeft size={16} /> Volver</button>
      <h2 style={h2Style}>Nuevo torneo manual</h2>
      <label style={labelStyle}>Nombre del torneo</label>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Copa Radiant Otoño 2026" style={inputStyle} />
      <label style={labelStyle}>Plantilla de estructura</label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {MANUAL_TEMPLATES.map((t) => (
          <button key={t.key} onClick={() => applyTemplate(t)} style={{ ...cardBtnStyle, borderColor: template.key === t.key ? GOLD : "#333", background: template.key === t.key ? "#2a2318" : "#181818" }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{t.label}</div>
            <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{t.desc}</div>
          </button>
        ))}
      </div>
      {(format === "groups" || format === "both") && (
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}><label style={labelStyle}># de grupos</label><input type="number" min={1} max={8} value={numGroups} onChange={(e) => setNumGroups(Math.max(1, parseInt(e.target.value) || 1))} style={inputStyle} /></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Clasifican por grupo</label><input type="number" min={1} max={8} value={qualifiers} onChange={(e) => setQualifiers(Math.max(1, parseInt(e.target.value) || 1))} style={inputStyle} disabled={format !== "both"} /></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Formato</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} style={inputStyle}>
              <option value="groups">Solo grupos</option>
              <option value="both">Grupos + playoffs</option>
            </select>
          </div>
        </div>
      )}
      <label style={labelStyle}>Equipos (uno por línea, {teamNames.length} cargados)</label>
      <textarea value={teamsText} onChange={(e) => setTeamsText(e.target.value)} rows={8} style={{ ...inputStyle, fontFamily: "monospace", resize: "vertical" }} />
      <p style={{ fontSize: 12, color: "#888", marginTop: -8, marginBottom: 16 }}>Edita los nombres por los equipos reales que quieras usar en este torneo.</p>
      <button onClick={handleSubmit} disabled={!name.trim() || teamNames.length < 2} style={primaryBtnStyle}><Plus size={16} /> Crear torneo</button>
    </div>
  );
}

// ---------- Info adicional: rosters y prize pool ----------

function RostersView({ tournament }) {
  const withRoster = tournament.teams.filter((t) => t.roster);
  const withoutRoster = tournament.teams.filter((t) => !t.roster);
  return (
    <div>
      <h3 style={h3Style}>Plantillas</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, marginBottom: 12 }}>
        {withRoster.map((t) => (
          <div key={t.id} style={{ ...cardBtnStyle, cursor: "default" }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{t.name}</div>
            {t.roster.map((p, i) => (
              <div key={i} style={{ fontSize: 12, color: "#bbb", display: "flex", justifyContent: "space-between" }}>
                <span>{p.nick}</span><span style={{ color: "#777" }}>{countryFlag(p.country)} {p.country}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      {withoutRoster.length > 0 && (
        <p style={{ fontSize: 12, color: "#777" }}>Sin roster disponible: {withoutRoster.map((t) => t.name).join(", ")}.</p>
      )}
    </div>
  );
}

function PrizePoolView({ prizePool }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={h3Style}>Premiación</h3>
      <table style={tableStyle}>
        <thead><tr><th style={{ ...thStyle, textAlign: "left" }}>Puesto</th><th style={thStyle}>Premio</th></tr></thead>
        <tbody>
          {prizePool.map((row, i) => (
            <tr key={i}><td style={{ ...tdStyle, textAlign: "left" }}>{row.place}</td><td style={{ ...tdStyle, fontWeight: 600, color: GOLD }}>{row.amount}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RuleList({ title, items }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={h3Style}>{title}</h3>
      <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "#ccc", lineHeight: 1.7 }}>
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ol>
    </div>
  );
}

function GroupsSplitView({ tournament }) {
  const groupOf = tournament.initialGroupOf;
  const groups = groupOf
    ? { GA: tournament.teams.filter((t) => groupOf[t.id] === "GA"), GB: tournament.teams.filter((t) => groupOf[t.id] === "GB") }
    : null;
  if (!groups) return <p style={{ fontSize: 13, color: "#888" }}>Este torneo no tiene grupos iniciales definidos.</p>;
  return (
    <div>
      <h3 style={h3Style}>División de grupos (fase suiza)</h3>
      <p style={{ fontSize: 12, color: "#888", marginTop: -4, marginBottom: 14 }}>
        Grupos oficiales del TI 2026. Rondas 1-3: enfrentamientos solo dentro del mismo grupo.
        Ronda 4: obligatoriamente cruzada entre grupos. Ronda 5: suizo estándar sin restricción.
        4 victorias = clasificado automáticamente (deja de jugar).
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {["GA", "GB"].map((g) => (
          <div key={g} style={{ ...cardBtnStyle, cursor: "default" }}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: GOLD }}>Group {g === "GA" ? "A" : "B"}</div>
            {groups[g].map((t) => <div key={t.id} style={{ fontSize: 13, color: "#ddd", padding: "2px 0" }}>{t.name}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

function RulesView({ tournament }) {
  return (
    <div>
      <RuleList title="Criterios de desempate" items={TI_2026_RULES.tiebreakers} />
      <RuleList title="Reglas de emparejamiento suizo" items={TI_2026_RULES.swissPairing} />
      <RuleList title="Ronda de eliminación" items={TI_2026_RULES.eliminationRound} />
      <RuleList title="Playoffs (Main Event)" items={TI_2026_RULES.playoffs} />
    </div>
  );
}

// ---------- Detalle de torneo ----------

function TournamentDetail({ tournament, updateTournament, onBack, onDelete }) {
  const [tab, setTab] = useState(tournament.format === "bracket" ? "bracket" : "groups");
  const teamsById = Object.fromEntries(tournament.teams.map((t) => [t.id, t]));
  const formatLabel = { groups: "Fase de grupos", both: "Grupos + playoffs", bracket: "Eliminación directa", ti_swiss: "Fase suiza (TI 2026)" }[tournament.format];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button onClick={onBack} style={backBtnStyle}><ArrowLeft size={16} /> Torneos</button>
        <button onClick={onDelete} style={{ ...backBtnStyle, color: DIRE }}><Trash2 size={14} /> Eliminar</button>
      </div>
      <h2 style={h2Style}>{tournament.name}</h2>
      <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
        <Badge color={GOLD}>{tournament.teams.length} equipos</Badge>
        <Badge color={tournament.format === "bracket" ? DIRE : RADIANT}>{formatLabel}</Badge>
        {tournament.presetKey && <Badge color="#8aa8c9">datos reales al {DATA_AS_OF}</Badge>}
      </div>
      {tournament.presetKey && <p style={{ fontSize: 12, color: "#888", marginBottom: 16 }}>Pídeme "actualiza los resultados" en el chat para refrescar este torneo con los últimos datos.</p>}

      {(tournament.format === "both" || tournament.format === "ti_swiss" || tournament.teams.some((t) => t.roster) || tournament.prizePool) && (
        <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid #2c2c2c", flexWrap: "wrap" }}>
          {tournament.format === "both" && <TabBtn active={tab === "groups"} onClick={() => setTab("groups")}><Users size={14} /> Grupos</TabBtn>}
          {tournament.format === "both" && <TabBtn active={tab === "bracket"} onClick={() => setTab("bracket")} disabled={tournament.presetKey === "eplmasters1" ? !tournament.doubleElimBracket : !tournament.bracket}><ListTree size={14} /> Playoffs</TabBtn>}
          {tournament.format === "ti_swiss" && <TabBtn active={tab === "groups"} onClick={() => setTab("groups")}><Layers size={14} /> Fase suiza</TabBtn>}
          {tournament.format === "ti_swiss" && <TabBtn active={tab === "elimination"} onClick={() => setTab("elimination")}><ListTree size={14} /> Elimination Round</TabBtn>}
          {tournament.teams.some((t) => t.roster) && <TabBtn active={tab === "rosters"} onClick={() => setTab("rosters")}><Users size={14} /> Equipos</TabBtn>}
          {tournament.prizePool && <TabBtn active={tab === "prizepool"} onClick={() => setTab("prizepool")}><Trophy size={14} /> Premios</TabBtn>}
          {tournament.format === "ti_swiss" && <TabBtn active={tab === "swissgroups"} onClick={() => setTab("swissgroups")}><Users size={14} /> Grupos</TabBtn>}
          {tournament.format === "ti_swiss" && <TabBtn active={tab === "rules"} onClick={() => setTab("rules")}><ListTree size={14} /> Reglamento</TabBtn>}
        </div>
      )}
      {(tournament.format === "groups" || (tournament.format === "both" && tab === "groups")) && <GroupsView tournament={tournament} updateTournament={updateTournament} />}
      {tournament.format === "bracket" && tournament.bracket && <BracketView bracket={tournament.bracket} teamsById={teamsById} onUpdateBracket={(b) => updateTournament({ ...tournament, bracket: b })} />}
      {tournament.format === "both" && tab === "bracket" && tournament.presetKey === "eplmasters1" && tournament.doubleElimBracket && (
        <DoubleElimBracketView bracket={tournament.doubleElimBracket} teamsById={teamsById} onUpdate={(b) => updateTournament({ ...tournament, doubleElimBracket: b })} />
      )}
      {tournament.format === "both" && tab === "bracket" && tournament.presetKey !== "eplmasters1" && tournament.bracket && <BracketView bracket={tournament.bracket} teamsById={teamsById} onUpdateBracket={(b) => updateTournament({ ...tournament, bracket: b })} />}
      {tournament.format === "ti_swiss" && tab === "groups" && <TIStageView tournament={tournament} updateTournament={updateTournament} />}
      {tournament.format === "ti_swiss" && tab === "elimination" && <EliminationRoundView tournament={tournament} updateTournament={updateTournament} />}
      {tab === "rosters" && <RostersView tournament={tournament} />}
      {tab === "prizepool" && tournament.prizePool && <PrizePoolView prizePool={tournament.prizePool} />}
      {tab === "swissgroups" && tournament.format === "ti_swiss" && <GroupsSplitView tournament={tournament} />}
      {tab === "rules" && tournament.format === "ti_swiss" && <RulesView tournament={tournament} />}
    </div>
  );
}

function TabBtn({ active, onClick, disabled, children }) {
  return <button onClick={onClick} disabled={disabled} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", fontSize: 13, fontWeight: 500, background: "transparent", border: "none", borderBottom: active ? `2px solid ${GOLD}` : "2px solid transparent", color: disabled ? "#555" : active ? GOLD : "#ccc", cursor: disabled ? "not-allowed" : "pointer" }}>{children}</button>;
}

// ---------- App ----------

export default function DotaTournamentSim() {
  const [tournaments, setTournaments, ready] = useStorage();
  const [view, setView] = useState("home");
  const [activeId, setActiveId] = useState(null);
  const active = tournaments.find((t) => t.id === activeId);

  const createTournament = (t) => { setTournaments((prev) => [...prev, t]); setActiveId(t.id); setView("detail"); };
  const updateTournament = (updated) => setTournaments((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  const deleteTournament = (id) => { setTournaments((prev) => prev.filter((t) => t.id !== id)); setView("home"); setActiveId(null); };

  const addPreset = (preset) => createTournament(preset.build());
  const alreadyAdded = (key) => tournaments.some((t) => t.presetKey === key);

  if (!ready) return <div style={{ ...wrapStyle, textAlign: "center", padding: 60, color: "#888" }}>Cargando torneos…</div>;

  return (
    <div style={wrapStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <Swords size={22} color={GOLD} />
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 0.3 }}>Simulador de torneos <span style={{ color: RADIANT }}>Dota</span> <span style={{ color: DIRE }}>2</span></span>
      </div>

      {view === "home" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <h2 style={h2Style}>Torneos oficiales</h2>
            <span style={{ fontSize: 11, color: "#777", display: "flex", alignItems: "center", gap: 4 }}><RefreshCw size={12} /> datos al {DATA_AS_OF}</span>
          </div>
          <div style={{ display: "grid", gap: 10, marginBottom: 28 }}>
            {PRESETS.map((p) => (
              <div key={p.key} style={{ ...cardBtnStyle, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "default" }}>
                <div>
                  <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><Trophy size={14} color={GOLD} /> {p.label}</div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{p.desc}</div>
                </div>
                <button onClick={() => addPreset(p)} disabled={alreadyAdded(p.key)} style={{ ...primaryBtnStyle, opacity: alreadyAdded(p.key) ? 0.4 : 1 }}>
                  {alreadyAdded(p.key) ? "Ya agregado" : "Cargar"}
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={h2Style}>Tus torneos</h2>
            <button onClick={() => setView("new")} style={primaryBtnStyle}><Plus size={16} /> Nuevo torneo manual</button>
          </div>
          {tournaments.length === 0 && <p style={{ color: "#888", fontSize: 14 }}>Aún no tienes torneos. Carga uno oficial arriba o crea uno manual.</p>}
          <div style={{ display: "grid", gap: 10 }}>
            {tournaments.map((t) => (
              <button key={t.id} onClick={() => { setActiveId(t.id); setView("detail"); }} style={{ ...cardBtnStyle, display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{t.teams.length} equipos</div>
                </div>
                <ChevronRight size={18} color="#888" />
              </button>
            ))}
          </div>
        </div>
      )}

      {view === "new" && <NewTournamentForm onCreate={createTournament} onCancel={() => setView("home")} />}
      {view === "detail" && active && <TournamentDetail tournament={active} updateTournament={updateTournament} onBack={() => setView("home")} onDelete={() => deleteTournament(active.id)} />}
    </div>
  );
}

const wrapStyle = { background: "#0d0d0d", color: "#e8e8e8", fontFamily: "system-ui, -apple-system, sans-serif", padding: 24, borderRadius: 12, minHeight: 400 };
const h2Style = { fontSize: 18, fontWeight: 700, margin: "0 0 12px" };
const h3Style = { fontSize: 15, fontWeight: 600, margin: "0 0 8px", color: GOLD };
const labelStyle = { display: "block", fontSize: 12, color: "#999", marginBottom: 4, marginTop: 12 };
const inputStyle = { width: "100%", padding: "8px 10px", background: "#181818", border: "1px solid #333", borderRadius: 6, color: "#eee", fontSize: 14, boxSizing: "border-box" };
const primaryBtnStyle = { display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: GOLD, color: "#181310", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" };
const backBtnStyle = { display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "#aaa", fontSize: 13, cursor: "pointer", padding: "4px 0", marginBottom: 8 };
const cardBtnStyle = { padding: "10px 14px", background: "#181818", border: "1px solid #333", borderRadius: 8, color: "#eee", cursor: "pointer", textAlign: "left" };
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: 13, marginBottom: 8 };
const thStyle = { padding: "6px 8px", borderBottom: "1px solid #333", color: "#999", fontWeight: 500, textAlign: "center" };
const tdStyle = { padding: "6px 8px", borderBottom: "1px solid #222", textAlign: "center" };
const matchRowStyle = { display: "flex", alignItems: "center", gap: 8, padding: "6px 4px", fontSize: 13, borderBottom: "1px solid #1c1c1c" };
const scoreInputStyle = { width: 40, padding: "4px 6px", background: "#181818", border: "1px solid #333", borderRadius: 4, color: "#eee", textAlign: "center" };
const saveBtnStyle = { display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: "4px 8px", background: "#222", border: "1px solid #333", borderRadius: 4, color: RADIANT, cursor: "pointer", fontSize: 12 };
