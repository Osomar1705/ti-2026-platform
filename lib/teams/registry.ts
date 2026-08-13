export interface TITeam {
  id: string           // kebab-case único
  name: string         // nombre oficial exacto
  tag: string          // abreviatura
  group: 'A' | 'B'
  logo: string         // ruta desde /public
  logoPlaceholder?: boolean  // true si es placeholder SVG
  steamTeamId?: number       // ID en Steam API
  opendotaTeamId?: number    // ID en OpenDota
}

export const TI2026_TEAMS: TITeam[] = [
  // GROUP A
  { id: 'team-vision',     name: 'Team Vision',     tag: 'TV',      group: 'A', logo: '/logos/teams/team-vision.svg',     logoPlaceholder: true },
  { id: 'boomboys',        name: 'Boomboys',         tag: 'BB',      group: 'A', logo: '/logos/teams/boomboys.svg',        logoPlaceholder: true },
  { id: 'team-falcons',    name: 'Team Falcons',     tag: 'Falcons', group: 'A', logo: '/logos/teams/team-falcons.svg',    logoPlaceholder: true, steamTeamId: 8894818 },
  { id: 'iron-wing',       name: 'Iron Wing',        tag: 'IW',      group: 'A', logo: '/logos/teams/iron-wing.svg',       logoPlaceholder: true },
  { id: 'nigma-galaxy',    name: 'Nigma Galaxy',     tag: 'NGX',     group: 'A', logo: '/logos/teams/nigma-galaxy.svg',    logoPlaceholder: true },
  { id: 'lgd-gaming',      name: 'LGD Gaming',       tag: 'LGD',     group: 'A', logo: '/logos/teams/lgd-gaming.svg',      logoPlaceholder: true, steamTeamId: 2108395 },
  { id: 'og-esports',      name: 'OG Esports',       tag: 'OG',      group: 'A', logo: '/logos/teams/og-esports.png',      logoPlaceholder: false, steamTeamId: 39 },
  { id: 'team-resilience', name: 'Team Resilience',  tag: 'TR',      group: 'A', logo: '/logos/teams/team-resilience.svg', logoPlaceholder: true },
  // GROUP B
  { id: 'team-yandex',     name: 'Team Yandex',      tag: 'Yandex',  group: 'B', logo: '/logos/teams/team-yandex.svg',     logoPlaceholder: true },
  { id: 'aurora-gaming',   name: 'Aurora Gaming',    tag: 'Aurora',  group: 'B', logo: '/logos/teams/aurora-gaming.svg',   logoPlaceholder: true },
  { id: 'team-spirit',     name: 'Team Spirit',      tag: 'TSpirit', group: 'B', logo: '/logos/teams/team-spirit.png',     logoPlaceholder: false, steamTeamId: 7119388 },
  { id: 'team-liquid',     name: 'Team Liquid',      tag: 'Liquid',  group: 'B', logo: '/logos/teams/team-liquid.svg',     logoPlaceholder: true, steamTeamId: 2163 },
  { id: 'xtreme-gaming',   name: 'Xtreme Gaming',    tag: 'XG',      group: 'B', logo: '/logos/teams/xtreme-gaming.svg',   logoPlaceholder: true, steamTeamId: 8597391 },
  { id: 'vici-gaming',     name: 'Vici Gaming',      tag: 'VG',      group: 'B', logo: '/logos/teams/vici-gaming.svg',     logoPlaceholder: true, steamTeamId: 15 },
  { id: 'gamerlegion',     name: 'GamerLegion',      tag: 'GL',      group: 'B', logo: '/logos/teams/gamerlegion.svg',     logoPlaceholder: true },
  { id: 'huligani',        name: 'Huligani',         tag: 'HULI',    group: 'B', logo: '/logos/teams/huligani.svg',        logoPlaceholder: true },
]

export function getTeamById(id: string): TITeam | undefined {
  return TI2026_TEAMS.find(t => t.id === id)
}

export function getTeamByName(name: string): TITeam | undefined {
  const lower = name.toLowerCase().trim()
  return TI2026_TEAMS.find(t =>
    t.name.toLowerCase() === lower ||
    t.tag.toLowerCase() === lower ||
    t.id === lower.replace(/\s+/g, '-')
  )
}

export function getTeamBySteamId(steamId: number): TITeam | undefined {
  return TI2026_TEAMS.find(t => t.steamTeamId === steamId)
}

export function getTeamLogo(nameOrId: string): string {
  const team = getTeamByName(nameOrId) ?? getTeamById(nameOrId)
  return team?.logo ?? '/logos/teams/placeholder.svg'
}
