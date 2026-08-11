import type { PanchoRecommendation } from '../types'

export const panchoRecommendations: PanchoRecommendation[] = [
  {
    id: 'rec-1',
    matchId: 'ts-vs-te-ub-sf',
    tag: 'PICK DEL DÍA',
    title: 'Team Spirit cierra la serie en 2',
    body: 'El draft de Spirit con Morphling + Pangolier es devastador en el mid game. Yatoro ya tiene Aegis y la ventaja de net worth supera 12k. La base de Tundra tiene dos barracks vulnerables. Espero que Spirit presione antes del minuto 32 para asegurar la serie.',
    winPct: 87,
    heroToWatch: 'Morphling',
    upsetAlert: false,
    createdAt: '2026-08-10T15:35:00Z',
  },
  {
    id: 'rec-2',
    tag: 'HÉROE A VIGILAR',
    title: 'Pangolier define el meta del torneo',
    body: 'Con 18 picks en el TI 2026 y un 71% de win rate, Pangolier se ha posicionado como el héroe más determinante del evento. Su movilidad con Rolling Thunder está creando situaciones de teamfight imposibles de navegar sin un counter específico en el draft. Equipos que no tienen plan para él están perdiendo.',
    winPct: undefined,
    heroToWatch: 'Pangolier',
    upsetAlert: false,
    createdAt: '2026-08-10T14:00:00Z',
  },
  {
    id: 'rec-3',
    matchId: 'ng-vs-au-lb-r2',
    tag: 'UPSET ALERT',
    title: 'Aurora puede sorprender a Nigma Galaxy',
    body: 'Nigma llega con energía baja tras su derrota en cuartos. Aurora ha mostrado un juego de supports de alto nivel, especialmente Mang0num, cuyo win rate en TI supera el 72%. Si Aurora consigue el control de Roshan en los primeros 20 minutos, su late game puede igualar o superar la star-power individual de Miracle-.',
    winPct: 41,
    heroToWatch: 'Io',
    upsetAlert: true,
    createdAt: '2026-08-10T12:00:00Z',
  },
]
