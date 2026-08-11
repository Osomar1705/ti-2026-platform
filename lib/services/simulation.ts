import type { Team } from '../types'

export function simulateSeries(
  teamA: Team,
  teamB: Team,
  bestOf: number = 3,
): { pctA: number; pctB: number; predictedResult: string; duration: string; mvp: string } {
  // Simple simulation based on seed ratings
  const seedDiff = teamB.seed - teamA.seed
  const base = Math.min(Math.max(50 + seedDiff * 4, 30), 70)
  const pctA = base
  const pctB = 100 - base

  const winsNeeded = Math.ceil(bestOf / 2)
  const winner = pctA >= 50 ? teamA.short : teamB.short
  const loser = pctA >= 50 ? teamB.short : teamA.short

  let predictedResult: string
  if (bestOf === 1) {
    predictedResult = `${winner} gana`
  } else {
    const loserWins = pctA >= 60 || pctB >= 60 ? 0 : 1
    predictedResult = `${winner} ${winsNeeded}–${loserWins} ${loser}`
  }

  const durations = ['32–40 min', '36–44 min', '38–48 min', '40–50 min']
  const duration = durations[Math.floor(Math.abs(seedDiff) % durations.length)]

  const mvpCandidates: Record<string, string> = {
    ts: 'Yatoro',
    te: 'Skiter',
    tl: 'Nisha',
    gg: 'Quinn',
    ng: 'Miracle-',
    au: 'SabeRLight-',
  }
  const mvpTeam = pctA >= 50 ? teamA.id : teamB.id
  const mvp = mvpCandidates[mvpTeam] ?? 'TBD'

  return { pctA, pctB, predictedResult, duration, mvp }
}

export function simulateTournament(
  teams: Team[],
  iterations: number = 1000,
): Record<string, { champion: number; top3: number; topHalf: number }> {
  const results: Record<string, { champion: number; top3: number; topHalf: number }> = {}

  for (const team of teams) {
    results[team.id] = { champion: 0, top3: 0, topHalf: 0 }
  }

  for (let i = 0; i < iterations; i++) {
    const sorted = [...teams].sort((a, b) => {
      const noise = (Math.random() - 0.5) * 6
      return a.seed - b.seed + noise
    })

    for (let rank = 0; rank < sorted.length; rank++) {
      const team = sorted[rank]
      if (rank === 0) {
        results[team.id].champion++
        results[team.id].top3++
        results[team.id].topHalf++
      } else if (rank < 3) {
        results[team.id].top3++
        results[team.id].topHalf++
      } else if (rank < teams.length / 2) {
        results[team.id].topHalf++
      }
    }
  }

  for (const teamId of Object.keys(results)) {
    results[teamId].champion = Math.round((results[teamId].champion / iterations) * 100)
    results[teamId].top3 = Math.round((results[teamId].top3 / iterations) * 100)
    results[teamId].topHalf = Math.round((results[teamId].topHalf / iterations) * 100)
  }

  return results
}
