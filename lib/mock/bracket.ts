import type { BracketSlot } from '../types'

// TI 2026 begins August 13, 2026 with the Group Stage.
// Playoff bracket will be determined after the group stage concludes.
// All slots start as TBD.

export const bracketSlots: BracketSlot[] = [
  // Upper Bracket
  { id: 'ub-qf-1', phase: 'Cuartos UB', format: 'BO3', scoreA: 0, scoreB: 0, status: 'upcoming' },
  { id: 'ub-qf-2', phase: 'Cuartos UB', format: 'BO3', scoreA: 0, scoreB: 0, status: 'upcoming' },
  { id: 'ub-qf-3', phase: 'Cuartos UB', format: 'BO3', scoreA: 0, scoreB: 0, status: 'upcoming' },
  { id: 'ub-qf-4', phase: 'Cuartos UB', format: 'BO3', scoreA: 0, scoreB: 0, status: 'upcoming' },
  { id: 'ub-sf-1', phase: 'Semifinal UB', format: 'BO3', scoreA: 0, scoreB: 0, status: 'upcoming' },
  { id: 'ub-sf-2', phase: 'Semifinal UB', format: 'BO3', scoreA: 0, scoreB: 0, status: 'upcoming' },
  { id: 'ub-f', phase: 'Final UB', format: 'BO3', scoreA: 0, scoreB: 0, status: 'upcoming' },

  // Lower Bracket
  { id: 'lb-r1-1', phase: 'LB Ronda 1', format: 'BO1', scoreA: 0, scoreB: 0, status: 'upcoming' },
  { id: 'lb-r1-2', phase: 'LB Ronda 1', format: 'BO1', scoreA: 0, scoreB: 0, status: 'upcoming' },
  { id: 'lb-r2-1', phase: 'LB Ronda 2', format: 'BO3', scoreA: 0, scoreB: 0, status: 'upcoming' },
  { id: 'lb-r2-2', phase: 'LB Ronda 2', format: 'BO3', scoreA: 0, scoreB: 0, status: 'upcoming' },
  { id: 'lb-sf', phase: 'Semifinal LB', format: 'BO3', scoreA: 0, scoreB: 0, status: 'upcoming' },
  { id: 'lb-f', phase: 'Final LB', format: 'BO3', scoreA: 0, scoreB: 0, status: 'upcoming' },

  // Grand Final
  { id: 'gf', phase: 'Gran Final', format: 'BO5', scoreA: 0, scoreB: 0, status: 'upcoming' },
]

export const bracketColumns = [
  { phase: 'Cuartos UB', slots: bracketSlots.filter(s => s.phase === 'Cuartos UB') },
  { phase: 'Semifinales UB', slots: bracketSlots.filter(s => s.phase === 'Semifinal UB') },
  { phase: 'Final UB', slots: bracketSlots.filter(s => s.phase === 'Final UB') },
  { phase: 'Gran Final', slots: bracketSlots.filter(s => s.phase === 'Gran Final') },
]

export const lowerBracketColumns = [
  { phase: 'LB Ronda 1', slots: bracketSlots.filter(s => s.phase === 'LB Ronda 1') },
  { phase: 'LB Ronda 2', slots: bracketSlots.filter(s => s.phase === 'LB Ronda 2') },
  { phase: 'Semifinal LB', slots: bracketSlots.filter(s => s.phase === 'Semifinal LB') },
  { phase: 'Final LB', slots: bracketSlots.filter(s => s.phase === 'Final LB') },
]
