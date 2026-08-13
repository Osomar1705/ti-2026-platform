'use client'

import { Surface, SectionTitle } from '@/components/shared/ui'
import TeamLogo from '@/components/shared/TeamLogo'
import { ChevronRight, TrendingUp, Swords, Shield, Clock, Zap, Star } from 'lucide-react'

/* ── Datos TI 2026 – Fase Suiza ──────────────────────────────────────── */

const GROUPS = {
  A: ['Team Falcons', 'Boomboys', 'Team Vision', 'Iron Wing', 'Nigma Galaxy', 'LGD Gaming', 'OG Esports', 'Team Resilience'],
  B: ['Team Yandex', 'Aurora Gaming', 'Team Spirit', 'Team Liquid', 'Xtreme Gaming', 'Vici Gaming', 'GamerLegion', 'Huligani'],
}

// Ronda 1 de la fase suiza (13 agosto 2026)
const ROUND1_RESULTS = [
  { teamA: 'Team Falcons',  teamB: 'LGD Gaming',    scoreA: 0, scoreB: 0, played: false },
  { teamA: 'Iron Wing',     teamB: 'Nigma Galaxy',  scoreA: 0, scoreB: 0, played: false },
  { teamA: 'Boomboys',      teamB: 'OG Esports',    scoreA: 0, scoreB: 0, played: false },
  { teamA: 'Team Vision',   teamB: 'Team Resilience', scoreA: 0, scoreB: 0, played: false },
  { teamA: 'Team Spirit',   teamB: 'Xtreme Gaming', scoreA: 0, scoreB: 0, played: false },
  { teamA: 'Team Liquid',   teamB: 'Vici Gaming',   scoreA: 0, scoreB: 0, played: false },
  { teamA: 'Aurora Gaming', teamB: 'GamerLegion',   scoreA: 0, scoreB: 0, played: false },
  { teamA: 'Team Yandex',   teamB: 'Huligani',      scoreA: 0, scoreB: 0, played: false },
]

// Rosters completos TI 2026
const ROSTERS: Record<string, { nick: string; role: string; country: string; flag: string }[]> = {
  'Team Falcons':   [
    { nick: 'skiter',    role: 'carry',        country: 'Eslovaquia', flag: '🇸🇰' },
    { nick: 'Malr1ne',   role: 'mid',          country: 'Rusia',      flag: '🇷🇺' },
    { nick: 'ATF',       role: 'offlane',      country: 'Jordania',   flag: '🇯🇴' },
    { nick: 'Cr1t-',     role: 'support',      country: 'Dinamarca',  flag: '🇩🇰' },
    { nick: 'Sneyking',  role: 'hard support', country: 'EE.UU.',     flag: '🇺🇸' },
  ],
  'Team Liquid': [
    { nick: 'm1CKe',  role: 'carry',       country: 'Suecia',   flag: '🇸🇪' },
    { nick: 'Nisha',  role: 'mid',         country: 'Polonia',  flag: '🇵🇱' },
    { nick: 'Ace',    role: 'offlane',     country: 'Dinamarca',flag: '🇩🇰' },
    { nick: 'Boxi',   role: 'support',     country: 'Suecia',   flag: '🇸🇪' },
    { nick: 'tOfu',   role: 'hard support',country: 'Alemania', flag: '🇩🇪' },
  ],
  'Team Spirit': [
    { nick: 'Yatoro',   role: 'carry',       country: 'Ucrania', flag: '🇺🇦' },
    { nick: 'Larl',     role: 'mid',         country: 'Rusia',   flag: '🇷🇺' },
    { nick: 'Collapse', role: 'offlane',     country: 'Rusia',   flag: '🇷🇺' },
    { nick: 'not me',   role: 'support',     country: 'Rusia',   flag: '🇷🇺' },
    { nick: 'rue',      role: 'hard support',country: 'Rusia',   flag: '🇷🇺' },
  ],
  'Xtreme Gaming': [
    { nick: 'Ame',          role: 'carry',       country: 'China',   flag: '🇨🇳' },
    { nick: 'NothingToSay', role: 'mid',         country: 'Malasia', flag: '🇲🇾' },
    { nick: 'Xxs',          role: 'offlane',     country: 'China',   flag: '🇨🇳' },
    { nick: 'fy',           role: 'support',     country: 'China',   flag: '🇨🇳' },
    { nick: 'xNova',        role: 'hard support',country: 'Malasia', flag: '🇲🇾' },
  ],
  'Aurora Gaming': [
    { nick: 'Nightfall', role: 'carry',       country: 'Rusia',    flag: '🇷🇺' },
    { nick: 'Mikoto',    role: 'mid',         country: 'Indonesia',flag: '🇮🇩' },
    { nick: 'Ws',        role: 'offlane',     country: 'Malasia',  flag: '🇲🇾' },
    { nick: 'Mira',      role: 'support',     country: 'Ucrania',  flag: '🇺🇦' },
    { nick: 'kaori',     role: 'hard support',country: 'Ucrania',  flag: '🇺🇦' },
  ],
  'Nigma Galaxy': [
    { nick: 'Suma1L-',    role: 'carry',       country: 'Pakistán', flag: '🇵🇰' },
    { nick: 'Lorenof',    role: 'mid',         country: 'Ucrania',  flag: '🇺🇦' },
    { nick: 'Davai Lama', role: 'offlane',     country: 'Bélgica',  flag: '🇧🇪' },
    { nick: 'OmaR',       role: 'support',     country: 'Líbano',   flag: '🇱🇧' },
    { nick: 'GH',         role: 'hard support',country: 'Líbano',   flag: '🇱🇧' },
  ],
  'OG Esports': [
    { nick: 'Natsumi-', role: 'carry',       country: 'Filipinas', flag: '🇵🇭' },
    { nick: 'Yopaj-',   role: 'mid',         country: 'Filipinas', flag: '🇵🇭' },
    { nick: 'Raven^',   role: 'offlane',     country: 'Filipinas', flag: '🇵🇭' },
    { nick: 'TIMS',     role: 'support',     country: 'Filipinas', flag: '🇵🇭' },
    { nick: 'skem',     role: 'hard support',country: 'Filipinas', flag: '🇵🇭' },
  ],
  'LGD Gaming': [
    { nick: 'Yuma',      role: 'carry',       country: 'Nicaragua', flag: '🇳🇮' },
    { nick: 'Topson',    role: 'mid',         country: 'Finlandia', flag: '🇫🇮' },
    { nick: 'Wisper',    role: 'offlane',     country: 'Bolivia',   flag: '🇧🇴' },
    { nick: 'Thiolicor', role: 'support',     country: 'Brasil',    flag: '🇧🇷' },
    { nick: 'KJ',        role: 'hard support',country: 'Brasil',    flag: '🇧🇷' },
  ],
  'Boomboys': [
    { nick: 'Kiritych~', role: 'carry',       country: 'Rusia',    flag: '🇷🇺' },
    { nick: 'gpk',       role: 'mid',         country: 'Rusia',    flag: '🇷🇺' },
    { nick: 'MieRo',     role: 'offlane',     country: 'Rusia',    flag: '🇷🇺' },
    { nick: 'Save-',     role: 'support',     country: 'Moldavia', flag: '🇲🇩' },
    { nick: 'Kataomi',   role: 'hard support',country: 'Rusia',    flag: '🇷🇺' },
  ],
  'Iron Wing': [
    { nick: 'Pure',     role: 'carry',       country: 'Rusia',        flag: '🇷🇺' },
    { nick: 'bzm',      role: 'mid',         country: 'Bulgaria',     flag: '🇧🇬' },
    { nick: '33',       role: 'offlane',     country: 'Israel',       flag: '🇮🇱' },
    { nick: 'Ari',      role: 'support',     country: 'Reino Unido',  flag: '🇬🇧' },
    { nick: 'Whitemon', role: 'hard support',country: 'Indonesia',    flag: '🇮🇩' },
  ],
  'Team Yandex': [
    { nick: 'watson',      role: 'carry',       country: 'Kazajistán',        flag: '🇰🇿' },
    { nick: 'CHIRA_JUNIOR',role: 'mid',         country: 'Rusia',             flag: '🇷🇺' },
    { nick: 'DM',          role: 'offlane',     country: 'Rusia',             flag: '🇷🇺' },
    { nick: 'Saksa',       role: 'support',     country: 'Macedonia del Norte',flag: '🇲🇰' },
    { nick: 'Malady',      role: 'hard support',country: 'Kazajistán',        flag: '🇰🇿' },
  ],
  'Vici Gaming': [
    { nick: 'shiro', role: 'carry',       country: 'China', flag: '🇨🇳' },
    { nick: 'Xm',    role: 'mid',         country: 'China', flag: '🇨🇳' },
    { nick: 'Bach',  role: 'offlane',     country: 'China', flag: '🇨🇳' },
    { nick: 'XinQ',  role: 'support',     country: 'China', flag: '🇨🇳' },
    { nick: "y`",    role: 'hard support',country: 'China', flag: '🇨🇳' },
  ],
  'GamerLegion': [
    { nick: 'Ghost',  role: 'carry',       country: 'Malasia',  flag: '🇲🇾' },
    { nick: 'RCY',    role: 'mid',         country: 'EE.UU.',   flag: '🇺🇸' },
    { nick: 'Fayde',  role: 'offlane',     country: 'EE.UU.',   flag: '🇺🇸' },
    { nick: 'Bignum', role: 'support',     country: 'Ucrania',  flag: '🇺🇦' },
    { nick: 'Speeed', role: 'hard support',country: 'EE.UU.',   flag: '🇺🇸' },
  ],
  'Huligani': [
    { nick: 'ssnovv1',  role: 'carry',       country: 'Rusia',       flag: '🇷🇺' },
    { nick: "Mirage`",  role: 'mid',         country: 'Kazajistán',  flag: '🇰🇿' },
    { nick: 'Corrupted',role: 'offlane',     country: 'Rusia',       flag: '🇷🇺' },
    { nick: 'sayuw',    role: 'support',     country: 'Rusia',       flag: '🇷🇺' },
    { nick: 'RESPECT',  role: 'hard support',country: 'Bielorrusia', flag: '🇧🇾' },
  ],
  'Team Vision': [
    { nick: 'Satanic',   role: 'carry',       country: 'Rusia',   flag: '🇷🇺' },
    { nick: 'No[o]ne-',  role: 'mid',         country: 'Ucrania', flag: '🇺🇦' },
    { nick: 'Noticed',   role: 'offlane',     country: 'Rusia',   flag: '🇷🇺' },
    { nick: '9Class',    role: 'support',     country: 'Rusia',   flag: '🇷🇺' },
    { nick: 'Dukalis',   role: 'hard support',country: 'Rusia',   flag: '🇷🇺' },
  ],
  'Team Resilience': [
    { nick: 'Erika',  role: 'carry',       country: 'China', flag: '🇨🇳' },
    { nick: 'EchozZ', role: 'mid',         country: 'China', flag: '🇨🇳' },
    { nick: 'niu',    role: 'offlane',     country: 'China', flag: '🇨🇳' },
    { nick: 'planet', role: 'support',     country: 'China', flag: '🇨🇳' },
    { nick: 'zzq',    role: 'hard support',country: 'China', flag: '🇨🇳' },
  ],
}

// Héroes del meta TI 2026 (proyección basada en DPC 2025 y patches recientes)
const META_HEROES = [
  { name: 'Morphling',      attr: 'agi', contested: 95, role: 'Carry/Mid',    tier: 'S' },
  { name: 'Invoker',        attr: 'uni', contested: 92, role: 'Mid',          tier: 'S' },
  { name: 'Io',             attr: 'uni', contested: 88, role: 'Hard Support', tier: 'S' },
  { name: 'Pangolier',      attr: 'agi', contested: 85, role: 'Mid/Offlane',  tier: 'A' },
  { name: 'Primal Beast',   attr: 'str', contested: 83, role: 'Offlane',      tier: 'A' },
  { name: 'Marci',          attr: 'uni', contested: 80, role: 'Offlane/Supp', tier: 'A' },
  { name: 'Ember Spirit',   attr: 'agi', contested: 78, role: 'Mid',          tier: 'A' },
  { name: 'Rubick',         attr: 'int', contested: 76, role: 'Support',      tier: 'A' },
  { name: 'Dark Willow',    attr: 'uni', contested: 73, role: 'Hard Support', tier: 'B' },
  { name: 'Faceless Void',  attr: 'agi', contested: 70, role: 'Carry',        tier: 'B' },
  { name: 'Tidehunter',     attr: 'str', contested: 68, role: 'Offlane',      tier: 'B' },
  { name: 'Earth Spirit',   attr: 'str', contested: 65, role: 'Support',      tier: 'B' },
]

const ATTR_COLORS: Record<string, string> = {
  str: 'bg-red-500/20 text-red-400',
  agi: 'bg-emerald-500/20 text-emerald-400',
  int: 'bg-blue-500/20 text-blue-400',
  uni: 'bg-purple-500/20 text-purple-400',
}

const TIER_COLORS: Record<string, { bg: string; text: string }> = {
  S: { bg: 'rgba(212,175,55,0.2)',   text: '#D4AF37' },
  A: { bg: 'rgba(74,222,128,0.15)',  text: '#4ADE80' },
  B: { bg: 'rgba(148,163,184,0.15)', text: '#94A3B8' },
}

const ROLE_COLORS: Record<string, string> = {
  'carry':        '#4ADE80',
  'mid':          '#60A5FA',
  'offlane':      '#F87171',
  'support':      '#C084FC',
  'hard support': '#FB923C',
}

const ALL_TEAMS = [...GROUPS.A, ...GROUPS.B]

// Tabla suiza vacía (torneo comienza hoy)
const SWISS_TABLE = ALL_TEAMS.map((name) => ({
  name,
  group: GROUPS.A.includes(name) ? 'A' : 'B',
  wins: 0,
  losses: 0,
  status: 'pending' as const,
}))

/* ── Componentes ─────────────────────────────────────────────────────── */

function StatBadge({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-[rgba(212,175,55,0.12)] bg-[rgba(212,175,55,0.04)] p-4 text-center">
      <p className="font-mono text-[10px] uppercase tracking-wider text-[#8A7A5A]">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[#D4AF37]">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-[#8A7A5A]">{sub}</p>}
    </div>
  )
}

function LiveChip() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.08)] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37]">
      <span className="size-1.5 animate-pulse rounded-full bg-[#D4AF37]" />
      EN VIVO HOY
    </span>
  )
}

/* ── Página ──────────────────────────────────────────────────────────── */

export default function StatisticsPage() {
  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#8A7A5A]">
        <span>Pancho Web</span>
        <ChevronRight className="size-3" />
        <span className="text-[#D4AF37]">Estadísticas</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">The International 2026</p>
          <h1 className="mt-1 text-3xl font-bold text-[#F5F1E8]">Estadísticas TI 2026</h1>
          <p className="mt-2 text-sm text-[#8A7A5A]">
            Fase Suiza · 13–16 agosto 2026 · Main Event Shanghai 19–23 agosto
          </p>
        </div>
        <LiveChip />
      </div>

      {/* Overview stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatBadge label="Equipos" value="16" sub="2 grupos de 8" />
        <StatBadge label="Prize Pool" value="$2.9M" sub="USD total" />
        <StatBadge label="Formato" value="Suizo" sub="5 rondas Bo3" />
        <StatBadge label="Partidas Ronda 1" value="8" sub="Hoy · 13 ago" />
      </div>

      {/* Tabla suiza */}
      <Surface className="mb-6 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <SectionTitle eyebrow="Fase Suiza" title="Tabla general" />
          <span className="rounded border border-[rgba(212,175,55,0.2)] bg-[rgba(212,175,55,0.06)] px-3 py-1 font-mono text-[10px] text-[#8A7A5A]">
            Ronda 1 en curso
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {(['A', 'B'] as const).map((grp) => (
            <div key={grp}>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded bg-[rgba(212,175,55,0.15)] px-2.5 py-1 font-mono text-xs font-bold text-[#D4AF37]">
                  GRUPO {grp}
                </span>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[rgba(212,175,55,0.1)]">
                    <th className="px-2 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8A7A5A]">#</th>
                    <th className="px-2 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8A7A5A]">Equipo</th>
                    <th className="px-2 py-2 text-center font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8A7A5A]">V</th>
                    <th className="px-2 py-2 text-center font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8A7A5A]">D</th>
                    <th className="px-2 py-2 text-center font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8A7A5A]">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {GROUPS[grp].map((teamName, i) => (
                    <tr
                      key={teamName}
                      className="border-b border-[rgba(212,175,55,0.05)] hover:bg-[rgba(212,175,55,0.03)]"
                    >
                      <td className="px-2 py-2.5 font-mono text-xs text-[#8A7A5A]">{i + 1}</td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-2">
                          <TeamLogo name={teamName} size={24} />
                          <span className="text-sm font-semibold text-[#F5F1E8]">{teamName}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2.5 text-center font-mono text-xs text-[#4A3F2F]">—</td>
                      <td className="px-2 py-2.5 text-center font-mono text-xs text-[#4A3F2F]">—</td>
                      <td className="px-2 py-2.5 text-center">
                        <span className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide bg-[rgba(212,175,55,0.1)] text-[#D4AF37]">
                          Pendiente
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-[11px] text-[#8A7A5A]">
                Top 3 → Main Event directo · Pos 4–13 → Ronda eliminación
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-lg border border-[rgba(212,175,55,0.1)] bg-[rgba(212,175,55,0.03)] px-4 py-3 text-center">
          <p className="text-xs text-[#8A7A5A]">
            La tabla se actualizará automáticamente cuando finalicen las partidas · Ronda 1 comienza hoy 13 agosto
          </p>
        </div>
      </Surface>

      {/* Partidas Ronda 1 */}
      <Surface className="mb-6 p-5">
        <SectionTitle eyebrow="13 agosto 2026" title="Ronda 1 — Enfrentamientos" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ROUND1_RESULTS.map((m, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-[rgba(212,175,55,0.1)] bg-[rgba(212,175,55,0.03)] px-4 py-3"
            >
              {/* Team A */}
              <div className="flex flex-1 items-center justify-end gap-2 text-right">
                <span className="text-sm font-semibold text-[#F5F1E8]">{m.teamA}</span>
                <TeamLogo name={m.teamA} size={28} />
              </div>

              {/* Score / VS */}
              <div className="mx-3 flex flex-col items-center gap-0.5">
                {m.played ? (
                  <span className="font-mono text-base font-bold text-[#D4AF37]">
                    {m.scoreA} – {m.scoreB}
                  </span>
                ) : (
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#4A3F2F]">vs</span>
                )}
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#4A3F2F]">Bo3</span>
              </div>

              {/* Team B */}
              <div className="flex flex-1 items-center gap-2">
                <TeamLogo name={m.teamB} size={28} />
                <span className="text-sm font-semibold text-[#F5F1E8]">{m.teamB}</span>
              </div>
            </div>
          ))}
        </div>
      </Surface>

      {/* Rosters */}
      <Surface className="mb-6 p-5">
        <SectionTitle eyebrow="Rosters" title="Jugadores — TI 2026" />
        <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {ALL_TEAMS.map((teamName) => {
            const roster = ROSTERS[teamName] ?? []
            return (
              <div
                key={teamName}
                className="rounded-lg border border-[rgba(212,175,55,0.1)] bg-[rgba(212,175,55,0.02)] p-4"
              >
                <div className="mb-3 flex items-center gap-2">
                  <TeamLogo name={teamName} size={28} />
                  <div>
                    <p className="text-sm font-bold text-[#F5F1E8] leading-tight">{teamName}</p>
                    <p className="font-mono text-[10px] text-[#8A7A5A]">
                      Grupo {GROUPS.A.includes(teamName) ? 'A' : 'B'}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  {roster.map((p) => (
                    <div key={p.nick} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{p.flag}</span>
                        <span className="text-[13px] font-semibold text-[#F5F1E8]">{p.nick}</span>
                      </div>
                      <span
                        className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase"
                        style={{
                          background: (ROLE_COLORS[p.role] ?? '#888') + '22',
                          color: ROLE_COLORS[p.role] ?? '#888',
                        }}
                      >
                        {p.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Surface>

      {/* Meta héroes */}
      <Surface className="mb-6 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <SectionTitle eyebrow="Meta del torneo" title="Pool de héroes proyectado" />
          <span className="rounded border border-[rgba(74,222,128,0.2)] bg-[rgba(74,222,128,0.06)] px-3 py-1 font-mono text-[10px] text-[#4ADE80]">
            Basado en patch 7.38
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-[rgba(212,175,55,0.1)]">
                {['Héroe', 'Attr', 'Rol', 'Tier', 'Contested%'].map((h) => (
                  <th key={h} className="px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8A7A5A]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {META_HEROES.map((hero) => {
                const tier = TIER_COLORS[hero.tier]
                return (
                  <tr key={hero.name} className="border-b border-[rgba(212,175,55,0.06)] hover:bg-[rgba(212,175,55,0.03)]">
                    <td className="px-3 py-2.5 text-sm font-semibold text-[#F5F1E8]">{hero.name}</td>
                    <td className="px-3 py-2.5">
                      <span className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${ATTR_COLORS[hero.attr]}`}>
                        {hero.attr}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-[#8A7A5A]">{hero.role}</td>
                    <td className="px-3 py-2.5">
                      <span
                        className="rounded px-2 py-0.5 font-mono text-xs font-bold"
                        style={{ background: tier.bg, color: tier.text }}
                      >
                        {hero.tier}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#1a1a1a]">
                          <div
                            className="h-full rounded-full bg-[#D4AF37]"
                            style={{ width: `${hero.contested}%`, opacity: 0.7 }}
                          />
                        </div>
                        <span className="font-mono text-xs text-[#D4AF37]">{hero.contested}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-lg border border-[rgba(212,175,55,0.1)] bg-[rgba(212,175,55,0.03)] px-4 py-3">
          <p className="text-xs text-[#8A7A5A]">
            Picks, bans y win rates reales se actualizarán durante la Fase de Grupos · 13–16 agosto 2026.
            Datos de Contested% son proyecciones basadas en el meta previo al torneo.
          </p>
        </div>
      </Surface>

      {/* Premios */}
      <Surface className="p-5">
        <SectionTitle eyebrow="Premio" title="Prize Pool TI 2026" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { place: 'Total', amount: '$2,905,798' },
            { place: '1° lugar', amount: 'A definir' },
            { place: '2° lugar', amount: 'A definir' },
            { place: '3° lugar', amount: 'A definir' },
            { place: '4° lugar', amount: 'A definir' },
            { place: '5–6°', amount: 'A definir' },
            { place: '7–8°', amount: 'A definir' },
            { place: '9–12°', amount: 'A definir' },
          ].map((row) => (
            <div
              key={row.place}
              className="rounded-lg border border-[rgba(212,175,55,0.12)] bg-[rgba(212,175,55,0.04)] p-3 text-center"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#8A7A5A]">{row.place}</p>
              <p className={`mt-1 font-bold ${row.place === 'Total' ? 'text-lg text-[#D4AF37]' : 'text-sm text-[#F5F1E8]'}`}>
                {row.amount}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center font-mono text-[11px] text-[#4A3F2F]">
          Distribución exacta a confirmar por Valve · Main Event Shanghai Convention Center
        </p>
      </Surface>
    </div>
  )
}
