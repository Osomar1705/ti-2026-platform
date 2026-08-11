import type { PlayerStats, Player, Hero } from '@/lib/types'

interface Props {
  playerStats: PlayerStats[]
  players: Player[]
  heroes: Hero[]
  radiantPlayerIds: string[]
}

function getHeroName(heroId: string, heroes: Hero[]) {
  return heroes.find((h) => h.id === heroId)?.name ?? heroId
}

function getPlayerName(playerId: string, players: Player[]) {
  return players.find((p) => p.id === playerId)?.name ?? playerId
}

function kda(k: number, d: number, a: number) {
  return `${k}/${d}/${a}`
}

function fmtNW(nw: number) {
  return nw >= 1000 ? `${(nw / 1000).toFixed(1)}k` : String(nw)
}

interface RowProps {
  stat: PlayerStats
  players: Player[]
  heroes: Hero[]
  side: 'radiant' | 'dire'
}

function PlayerRow({ stat, players, heroes, side }: RowProps) {
  const color = side === 'radiant' ? '#cf4b45' : '#b69a66'
  return (
    <tr className="border-b border-border/40 text-xs hover:bg-muted/20">
      <td className="px-3 py-2 font-medium">{getHeroName(stat.heroId, heroes)}</td>
      <td className="px-3 py-2" style={{ color }}>{getPlayerName(stat.playerId, players)}</td>
      <td className="px-3 py-2 font-mono">{kda(stat.kills, stat.deaths, stat.assists)}</td>
      <td className="px-3 py-2 font-mono">{fmtNW(stat.netWorth)}</td>
      <td className="px-3 py-2 font-mono">{stat.gpm}</td>
      <td className="px-3 py-2 font-mono">{stat.xpm}</td>
      <td className="px-3 py-2 font-mono">{stat.lastHits}/{stat.denies}</td>
      <td className="px-3 py-2 font-mono text-center">{stat.level}</td>
    </tr>
  )
}

export function PlayerTable({ playerStats, players, heroes, radiantPlayerIds }: Props) {
  const radiantStats = playerStats.filter((s) => radiantPlayerIds.includes(s.playerId))
  const direStats = playerStats.filter((s) => !radiantPlayerIds.includes(s.playerId))

  const headers = ['Héroe', 'Jugador', 'K/D/A', 'NW', 'GPM', 'XPM', 'LH/D', 'Lvl']

  const tableSection = (stats: PlayerStats[], side: 'radiant' | 'dire') => (
    <>
      <tr className="border-b border-border/60">
        <td
          colSpan={headers.length}
          className="px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest"
          style={{ color: side === 'radiant' ? '#cf4b45' : '#b69a66' }}
        >
          {side === 'radiant' ? '▲ Radiant' : '▼ Dire'}
        </td>
      </tr>
      {stats.map((s) => (
        <PlayerRow key={s.playerId} stat={s} players={players} heroes={heroes} side={side} />
      ))}
    </>
  )

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left">
        <thead>
          <tr className="border-b border-border/60">
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableSection(radiantStats, 'radiant')}
          {tableSection(direStats, 'dire')}
        </tbody>
      </table>
    </div>
  )
}
