import type { Team, Player } from '../types'

export const teams: Team[] = [
  // Invited
  { id: 'fal', name: 'Team Falcons',    short: 'FAL', color: '#E8871A', seed: 1,  region: 'WEU' },
  { id: 'tl',  name: 'Team Liquid',     short: 'TL',  color: '#4FC3F7', seed: 2,  region: 'WEU' },
  { id: 'xg',  name: 'Xtreme Gaming',   short: 'XG',  color: '#EF4444', seed: 3,  region: 'CN'  },
  { id: 'au',  name: 'Aurora Gaming',   short: 'AUR', color: '#22D3EE', seed: 4,  region: 'EEU' },
  { id: 'iw',  name: 'Iron Wing',       short: 'IW',  color: '#9CA3AF', seed: 5,  region: 'WEU' },
  { id: 'ydk', name: 'Team Yandex',     short: 'YDX', color: '#FF5C5C', seed: 6,  region: 'CIS' },
  { id: 'bb',  name: 'BoomBoys',        short: 'BB',  color: '#A78BFA', seed: 7,  region: 'EEU' },
  // Qualified
  { id: 'ts',  name: 'Team Spirit',     short: 'TS',  color: '#3B82F6', seed: 8,  region: 'CIS' },
  { id: 'vis', name: 'TEAM VISION',     short: 'VIS', color: '#10B981', seed: 9,  region: 'CN'  },
  { id: 'ng',  name: 'Nigma Galaxy',    short: 'NGX', color: '#D4AF37', seed: 10, region: 'WEU' },
  { id: 'hul', name: 'HULIGANI',        short: 'HUL', color: '#F97316', seed: 11, region: 'EEU' },
  { id: 'res', name: 'Team Resilience', short: 'TR',  color: '#22C55E', seed: 12, region: 'CN'  },
  { id: 'vg',  name: 'Vici Gaming',     short: 'VG',  color: '#EAB308', seed: 13, region: 'CN'  },
  { id: 'og',  name: 'OG',              short: 'OG',  color: '#1D4ED8', seed: 14, region: 'WEU' },
  { id: 'gl',  name: 'GamerLegion',     short: 'GL',  color: '#8B5CF6', seed: 15, region: 'WEU' },
  { id: 'lgd', name: 'LGD Gaming',      short: 'LGD', color: '#DC2626', seed: 16, region: 'CN'  },
]

export const players: Player[] = [
  // Team Falcons
  { id: 'crit',     name: 'Cr1t-',        teamId: 'fal', role: 'support',      country: 'DK', rating: 9.2 },
  { id: 'sneyking', name: 'Sneyking',      teamId: 'fal', role: 'hard-support', country: 'US', rating: 9.0 },
  { id: 'skiter',   name: 'skiter',        teamId: 'fal', role: 'carry',        country: 'SK', rating: 9.1 },
  { id: 'atf',      name: 'ATF',           teamId: 'fal', role: 'offlane',      country: 'JO', rating: 9.3 },
  { id: 'malr1ne',  name: 'Malr1ne',       teamId: 'fal', role: 'mid',          country: 'RU', rating: 9.0 },
  // Team Liquid
  { id: 'micke',    name: 'miCKe',         teamId: 'tl',  role: 'carry',        country: 'SE', rating: 9.1 },
  { id: 'nisha',    name: 'Nisha',         teamId: 'tl',  role: 'mid',          country: 'PL', rating: 9.2 },
  { id: 'boxi',     name: 'Boxi',          teamId: 'tl',  role: 'offlane',      country: 'SE', rating: 8.9 },
  { id: 'ace',      name: 'Ace',           teamId: 'tl',  role: 'support',      country: 'DK', rating: 8.8 },
  { id: 'tofu',     name: 'tOfu',          teamId: 'tl',  role: 'hard-support', country: 'DE', rating: 8.7 },
  // Xtreme Gaming
  { id: 'ame',      name: 'Ame',           teamId: 'xg',  role: 'carry',        country: 'CN', rating: 9.4 },
  { id: 'xxs',      name: 'Xxs',           teamId: 'xg',  role: 'mid',          country: 'CN', rating: 9.1 },
  { id: 'xinq',     name: 'XinQ',          teamId: 'xg',  role: 'offlane',      country: 'CN', rating: 8.9 },
  { id: 'nts',      name: 'NothingToSay',  teamId: 'xg',  role: 'support',      country: 'MY', rating: 8.8 },
  { id: 'xnova',    name: 'xNova',         teamId: 'xg',  role: 'hard-support', country: 'MY', rating: 8.7 },
  // Aurora Gaming
  { id: 'nightfall',name: 'Nightfall',     teamId: 'au',  role: 'carry',        country: 'RU', rating: 9.0 },
  { id: 'mira',     name: 'Mira',          teamId: 'au',  role: 'mid',          country: 'UA', rating: 9.1 },
  { id: 'mikoto',   name: 'Mikoto',        teamId: 'au',  role: 'offlane',      country: 'ID', rating: 8.6 },
  // Iron Wing
  { id: '33',       name: '33',            teamId: 'iw',  role: 'offlane',      country: 'IL', rating: 9.0 },
  { id: 'pure',     name: 'Pure',          teamId: 'iw',  role: 'carry',        country: 'RU', rating: 9.1 },
  { id: 'whitemon', name: 'Whitemon',       teamId: 'iw',  role: 'hard-support', country: 'ID', rating: 8.7 },
  { id: 'bzm',      name: 'bzm',           teamId: 'iw',  role: 'mid',          country: 'BG', rating: 8.8 },
  // Team Spirit
  { id: 'yatoro',   name: 'Yatoro',        teamId: 'ts',  role: 'carry',        country: 'UA', rating: 9.4 },
  { id: 'collapse', name: 'Collapse',      teamId: 'ts',  role: 'offlane',      country: 'UA', rating: 9.3 },
  { id: 'larl',     name: 'Larl',          teamId: 'ts',  role: 'mid',          country: 'RU', rating: 9.1 },
  // Nigma Galaxy
  { id: 'sumail',   name: 'SumaiL',        teamId: 'ng',  role: 'mid',          country: 'PK', rating: 9.3 },
  { id: 'gh',       name: 'GH',            teamId: 'ng',  role: 'support',      country: 'LB', rating: 9.1 },
  // BoomBoys
  { id: 'gpk',      name: 'gpk~',          teamId: 'bb',  role: 'mid',          country: 'RU', rating: 9.0 },
  { id: 'save',     name: 'Save-',         teamId: 'bb',  role: 'offlane',      country: 'MD', rating: 8.9 },
  { id: 'kataomi',  name: 'Kataomi`',      teamId: 'bb',  role: 'support',      country: 'RU', rating: 8.7 },
  { id: 'miero',    name: 'MieRo`',        teamId: 'bb',  role: 'hard-support', country: 'RU', rating: 8.6 },
  // OG
  { id: 'topson',   name: 'Topson',        teamId: 'og',  role: 'mid',          country: 'FI', rating: 9.3 },
  { id: 'raven',    name: 'Raven',         teamId: 'og',  role: 'carry',        country: 'PH', rating: 8.9 },
  { id: 'tims',     name: 'TIMS',          teamId: 'og',  role: 'support',      country: 'PH', rating: 8.7 },
  // LGD Gaming
  { id: 'wisper',   name: 'Wisper',        teamId: 'lgd', role: 'carry',        country: 'BO', rating: 8.9 },
  { id: 'yuma',     name: 'Yuma',          teamId: 'lgd', role: 'support',      country: 'NI', rating: 8.6 },
  { id: 'kj',       name: 'KJ',            teamId: 'lgd', role: 'offlane',      country: 'BR', rating: 8.7 },
  // Team Yandex
  { id: 'saksa',    name: 'Saksa',         teamId: 'ydk', role: 'support',      country: 'MK', rating: 8.8 },
  { id: 'dm',       name: 'DM',            teamId: 'ydk', role: 'mid',          country: 'RU', rating: 8.9 },
  { id: 'watson',   name: 'watson',        teamId: 'ydk', role: 'carry',        country: 'KZ', rating: 8.7 },
  // Vici Gaming
  { id: 'yback',    name: 'y`',            teamId: 'vg',  role: 'carry',        country: 'CN', rating: 8.8 },
  { id: 'xm',       name: 'Xm',            teamId: 'vg',  role: 'mid',          country: 'CN', rating: 8.7 },
  { id: 'shiro',    name: 'shiro',         teamId: 'vg',  role: 'support',      country: 'CN', rating: 8.6 },
]
