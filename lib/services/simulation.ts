import type { Team } from '../types'

export function simulateSeries(
  teamA: Team,
  teamB: Team,
  bestOf: number = 3,
  userMvpRecommendations: Record<string, Record<string, number>>
): { pctA: number; pctB: number; predictedResult: string; duration: string; mvp: string } {
  
  // Simulación básica de probabilidades basada en el rating (seed)
  const seedDiff = teamB.seed - teamA.seed
  const base = Math.min(Math.max(50 + seedDiff * 4, 30), 70)
  const pctA = base
  const pctB = 100 - base

  const winsNeeded = Math.ceil(bestOf / 2)
  const winner = pctA >= 50 ? teamA.short : teamB.short
  const loser = pctA >= 50 ? teamB.short : teamA.short

 // CORRECCIÓN DE BUG: Marcadores precisos y matemáticamente posibles
  if (bestOf === 1) {
    predictedResult = `${winner} gana`
  } else {
    // El perdedor puede ganar desde 0 hasta (winsNeeded - 1) mapas
    const maxLoserWins = winsNeeded - 1
    // Algoritmo de distribución de victorias del perdedor basado en probabilidad
    let loserWins = 0
    if (pctA < 65 && pctB < 65) {
      // Si los equipos están parejos, asignamos mapas al perdedor (con límite máximo)
      loserWins = Math.min(1, maxLoserWins) 
    }
    
    predictedResult = `${winner} ${winsNeeded}–${loserWins} ${loser}`
  }

  const durations = ['32–40 min', '36–44 min', '38–48 min', '40–50 min']
  const duration = durations[Math.floor(Math.abs(seedDiff) % durations.length)]

  // NUEVO ALGORITMO MVP: Basado estrictamente en votos de los usuarios
  let mvp = 'TBD'
  const teamVotes = userMvpRecommendations[winnerTeamId]

  if (teamVotes && Object.keys(teamVotes).length > 0) {
    let maxVotes = -1
    let currentMvp = 'TBD'
    let isTie = false

    for (const [playerName, votes] of Object.entries(teamVotes)) {
      if (votes > maxVotes) {
        maxVotes = votes
        currentMvp = playerName
        isTie = false // Se rompe cualquier empate previo
      } else if (votes === maxVotes) {
        isTie = true // Se detecta empate en la cantidad máxima
      }
    }
    
    // Si hay empate en la cima o no hay votos válidos, se retorna 'TBD'
    mvp = isTie ? 'TBD' : currentMvp
  }

  return { pctA, pctB, predictedResult, duration, mvp }
}

export function simulateTournament(
  teams: Team[],
  iterations: number = 1000
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
