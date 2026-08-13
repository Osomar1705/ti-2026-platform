import type { Team, Match, MatchStatus } from '@/lib/types'
import { ChevronRight, Clock3 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Surface({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('card-premium rounded-xl transition-all duration-200', className)}>
      {children}
    </div>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  action,
  actionHref,
}: {
  eyebrow?: string
  title: string
  action?: string
  actionHref?: string
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-1">{eyebrow}</p>
        )}
        <h2 className="text-lg font-semibold tracking-tight text-[#F5F1E8]">{title}</h2>
      </div>
      {action && (
        actionHref ? (
          <Link href={actionHref} className="flex items-center gap-1 text-xs text-[#8A7A5A] transition-colors hover:text-[#D4AF37]">
            {action}<ChevronRight className="size-3" />
          </Link>
        ) : (
          <button className="flex items-center gap-1 text-xs text-[#8A7A5A] transition-colors hover:text-[#D4AF37]">
            {action}<ChevronRight className="size-3" />
          </button>
        )
      )}
    </div>
  )
}

export function TeamMark({ team, small = false }: { team: Team; small?: boolean }) {
  return (
    <span
      className={`inline-flex ${small ? 'size-7 text-[10px]' : 'size-10 text-xs'} items-center justify-center rounded-lg font-bold transition-transform hover:scale-105`}
      style={{
        background: `${team.color}18`,
        color: team.color,
        border: `1px solid ${team.color}40`,
        boxShadow: `0 0 12px ${team.color}15`,
      }}
    >
      {team.short}
    </span>
  )
}

export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(192,57,43,0.15)] px-3 py-1 font-mono text-[10px] font-bold text-[#C0392B] tracking-widest uppercase border border-[rgba(192,57,43,0.25)]">
      <span className="live-dot" />
      LIVE
    </span>
  )
}

export function DataBadge({ source, connected }: { source: string; connected: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.04)] px-3 py-1 font-mono text-[10px] font-semibold text-[#F5F1E8]">
      <span className={`size-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      {source}
    </span>
  )
}

export function StatCard({
  label,
  value,
  change,
  changePositive,
}: {
  label: string
  value: string
  change?: string
  changePositive?: boolean
}) {
  return (
    <div className="rounded-lg bg-[rgba(212,175,55,0.04)] border border-[rgba(212,175,55,0.10)] p-3">
      <p className="text-[10px] text-[#8A7A5A]">{label}</p>
      <p className="mt-2 truncate text-lg font-bold text-[#F5F1E8]">{value}</p>
      {change && (
        <p className={`mt-1 font-mono text-[10px] ${changePositive !== false ? 'text-[#D4AF37]' : 'text-[#8A7A5A]'}`}>
          {change}
        </p>
      )}
    </div>
  )
}

export function MatchRow({ match, showTime = true }: { match: Match; showTime?: boolean }) {
  const statusColors: Record<MatchStatus, string> = {
    live: 'bg-[#C0392B]',
    upcoming: 'bg-[#8A7A5A]',
    finished: 'bg-emerald-500',
    cancelled: 'bg-destructive',
  }

  return (
    <Link
      href={`/matches/${match.id}`}
      className="group flex items-center gap-4 border-b border-[rgba(212,175,55,0.08)] px-4 py-3 last:border-0 hover:bg-[rgba(212,175,55,0.04)] transition-colors"
    >
      {showTime && (
        <div className="flex w-14 items-center gap-1 font-mono text-xs text-[#8A7A5A]">
          {match.status === 'live' ? (
            <span className="flex items-center gap-1 text-[#C0392B] font-bold">
              <span className="live-dot size-1.5" />
              LIVE
            </span>
          ) : match.status === 'upcoming' ? (
            <span className="flex items-center gap-1"><Clock3 className="size-3" />{new Date(match.scheduledAt).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}</span>
          ) : (
            'Final'
          )}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-sm font-medium text-[#F5F1E8]">
          <TeamMark team={match.radiant} small />
          <span className="truncate">{match.radiant.name}</span>
          <span className="font-mono text-[#8A7A5A]">{match.radiantScore} — {match.direScore}</span>
          <span className="truncate">{match.dire.name}</span>
          <TeamMark team={match.dire} small />
        </div>
        <div className="mt-1 text-[11px] text-[#8A7A5A]">{match.phase} · {match.format}</div>
      </div>
      <ChevronRight className="size-4 shrink-0 text-[#8A7A5A] opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  )
}
