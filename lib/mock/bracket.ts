import type { BracketSlot } from '../types'
import { teams } from './teams'

const ts = teams[0]
const te = teams[1]
const tl = teams[2]
const gg = teams[3]

export const bracketSlots: BracketSlot[] = [
  { id: 'ub-qf-1', phase: 'Cuartos UB', format: 'BO3', teamA: ts, teamB: undefined, scoreA: 2, scoreB: 0, status: 'finished' },
  { id: 'ub-qf-2', phase: 'Cuartos UB', format: 'BO3', teamA: te, teamB: undefined, scoreA: 2, scoreB: 1, status: 'finished' },
  { id: 'ub-qf-3', phase: 'Cuartos UB', format: 'BO3', teamA: tl, teamB: undefined, scoreA: 2, scoreB: 1, status: 'finished' },
  { id: 'ub-qf-4', phase: 'Cuartos UB', format: 'BO3', teamA: gg, teamB: undefined, scoreA: 2, scoreB: 0, status: 'finished' },
  { id: 'ub-sf-1', phase: 'Semifinal UB', format: 'BO3', teamA: ts, teamB: te, scoreA: 1, scoreB: 0, status: 'live', matchId: 'ts-vs-te-ub-sf' },
  { id: 'ub-sf-2', phase: 'Semifinal UB', format: 'BO3', teamA: tl, teamB: gg, scoreA: 0, scoreB: 0, status: 'upcoming', matchId: 'tl-vs-gg-ub-sf' },
  { id: 'ub-f', phase: 'Final UB', format: 'BO3', scoreA: 0, scoreB: 0, status: 'upcoming' },
  { id: 'lb-f', phase: 'Final LB', format: 'BO3', scoreA: 0, scoreB: 0, status: 'upcoming' },
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
