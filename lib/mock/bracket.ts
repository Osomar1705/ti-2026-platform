import type { BracketSlot } from '../types'
import { teams } from './teams'

const ts = teams[0] // Team Spirit      seed 1
const te = teams[1] // Tundra Esports   seed 2
const tl = teams[2] // Team Liquid      seed 3
const gg = teams[3] // Gaimin Gladiators seed 4
const ng = teams[4] // Nigma Galaxy     seed 5
const au = teams[5] // Aurora           seed 6

// ──────────────────────────────────────────────
// UPPER BRACKET
// ──────────────────────────────────────────────
export const bracketSlots: BracketSlot[] = [
  // Cuartos de final UB — con oponentes reales
  { id: 'ub-qf-1', phase: 'Cuartos UB', format: 'BO3', teamA: ts, teamB: ng, scoreA: 2, scoreB: 0, status: 'finished', matchId: 'ts-vs-ng-ub-qf' },
  { id: 'ub-qf-2', phase: 'Cuartos UB', format: 'BO3', teamA: te, teamB: au, scoreA: 2, scoreB: 1, status: 'finished' },
  { id: 'ub-qf-3', phase: 'Cuartos UB', format: 'BO3', teamA: tl, teamB: ng, scoreA: 2, scoreB: 1, status: 'finished', matchId: 'tl-vs-ng-ub-qf' },
  { id: 'ub-qf-4', phase: 'Cuartos UB', format: 'BO3', teamA: gg, teamB: au, scoreA: 2, scoreB: 0, status: 'finished', matchId: 'gg-vs-au-ub-qf' },

  // Semifinales UB
  { id: 'ub-sf-1', phase: 'Semifinal UB', format: 'BO3', teamA: ts, teamB: te, scoreA: 1, scoreB: 0, status: 'live', matchId: 'ts-vs-te-ub-sf' },
  { id: 'ub-sf-2', phase: 'Semifinal UB', format: 'BO3', teamA: tl, teamB: gg, scoreA: 0, scoreB: 0, status: 'upcoming', matchId: 'tl-vs-gg-ub-sf' },

  // Final UB
  { id: 'ub-f', phase: 'Final UB', format: 'BO3', scoreA: 0, scoreB: 0, status: 'upcoming' },

  // ──────────────────────────────────────────────
  // LOWER BRACKET
  // ──────────────────────────────────────────────
  // Ronda 1 LB — perdedores de cuartos UB
  { id: 'lb-r1-1', phase: 'LB Ronda 1', format: 'BO1', teamA: ng, teamB: au, scoreA: 1, scoreB: 0, status: 'finished', matchId: 'ng-vs-au-lb-r2' },
  { id: 'lb-r1-2', phase: 'LB Ronda 1', format: 'BO1', teamA: au, teamB: ng, scoreA: 0, scoreB: 1, status: 'finished' },

  // Ronda 2 LB
  { id: 'lb-r2-1', phase: 'LB Ronda 2', format: 'BO3', teamA: ng, scoreA: 0, scoreB: 0, status: 'upcoming' },
  { id: 'lb-r2-2', phase: 'LB Ronda 2', format: 'BO3', teamA: au, scoreA: 0, scoreB: 0, status: 'upcoming' },

  // Semifinal LB
  { id: 'lb-sf', phase: 'Semifinal LB', format: 'BO3', scoreA: 0, scoreB: 0, status: 'upcoming' },

  // Final LB
  { id: 'lb-f', phase: 'Final LB', format: 'BO3', scoreA: 0, scoreB: 0, status: 'upcoming' },

  // GRAN FINAL
  { id: 'gf', phase: 'Gran Final', format: 'BO5', scoreA: 0, scoreB: 0, status: 'upcoming' },
]

export const bracketColumns = [
  {
    phase: 'Cuartos UB',
    slots: bracketSlots.filter(s => s.phase === 'Cuartos UB'),
  },
  {
    phase: 'Semifinales UB',
    slots: bracketSlots.filter(s => s.phase === 'Semifinal UB'),
  },
  {
    phase: 'Final UB',
    slots: bracketSlots.filter(s => s.phase === 'Final UB'),
  },
  {
    phase: 'Gran Final',
    slots: bracketSlots.filter(s => s.phase === 'Gran Final'),
  },
]

export const lowerBracketColumns = [
  {
    phase: 'LB Ronda 1',
    slots: bracketSlots.filter(s => s.phase === 'LB Ronda 1'),
  },
  {
    phase: 'LB Ronda 2',
    slots: bracketSlots.filter(s => s.phase === 'LB Ronda 2'),
  },
  {
    phase: 'Semifinal LB',
    slots: bracketSlots.filter(s => s.phase === 'Semifinal LB'),
  },
  {
    phase: 'Final LB',
    slots: bracketSlots.filter(s => s.phase === 'Final LB'),
  },
]
