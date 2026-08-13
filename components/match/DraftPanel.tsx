import type { DraftAction, Hero } from '@/lib/types'

interface Props {
  draft: DraftAction[]
  heroes: Hero[]
}

function getHeroName(heroId: string, heroes: Hero[]) {
  return heroes.find((h) => h.id === heroId)?.name ?? heroId
}

export function DraftPanel({ draft, heroes }: Props) {
  const radiantPicks = draft.filter((d) => d.type === 'pick' && d.side === 'radiant')
  const radiantBans = draft.filter((d) => d.type === 'ban' && d.side === 'radiant')
  const direPicks = draft.filter((d) => d.type === 'pick' && d.side === 'dire')
  const direBans = draft.filter((d) => d.type === 'ban' && d.side === 'dire')

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Radiant */}
      <div>
        <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: '#cf4b45' }}>
          Radiant — Picks
        </p>
        <div className="flex flex-col gap-1.5">
          {radiantPicks.map((d) => (
            <div
              key={d.order}
              className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2"
            >
              <span
                className="flex size-5 items-center justify-center rounded text-[9px] font-bold"
                style={{ background: '#cf4b4520', color: '#cf4b45' }}
              >
                {d.order}
              </span>
              <span className="text-xs font-medium">{getHeroName(d.heroId, heroes)}</span>
              {d.playerId && (
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">{d.playerId}</span>
              )}
            </div>
          ))}
        </div>
        <p className="mb-2 mt-4 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Bans
        </p>
        <div className="flex flex-wrap gap-1">
          {radiantBans.map((d) => (
            <span
              key={d.order}
              className="rounded border border-border/50 bg-muted/30 px-2 py-0.5 text-[11px] line-through text-muted-foreground"
            >
              {getHeroName(d.heroId, heroes)}
            </span>
          ))}
        </div>
      </div>

      {/* Dire */}
      <div>
        <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: '#b69a66' }}>
          Dire — Picks
        </p>
        <div className="flex flex-col gap-1.5">
          {direPicks.map((d) => (
            <div
              key={d.order}
              className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2"
            >
              <span
                className="flex size-5 items-center justify-center rounded text-[9px] font-bold"
                style={{ background: '#b69a6620', color: '#b69a66' }}
              >
                {d.order}
              </span>
              <span className="text-xs font-medium">{getHeroName(d.heroId, heroes)}</span>
              {d.playerId && (
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">{d.playerId}</span>
              )}
            </div>
          ))}
        </div>
        <p className="mb-2 mt-4 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Bans
        </p>
        <div className="flex flex-wrap gap-1">
          {direBans.map((d) => (
            <span
              key={d.order}
              className="rounded border border-border/50 bg-muted/30 px-2 py-0.5 text-[11px] line-through text-muted-foreground"
            >
              {getHeroName(d.heroId, heroes)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
