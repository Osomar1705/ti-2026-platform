'use client'

import { useLiveMatches, useRelativeTime } from '@/lib/hooks/useLiveMatches'
import type { LiveMatch, LivePlayer } from '@/lib/live/types'
import { Surface, SectionTitle, LiveBadge } from '@/components/shared/ui'
import LiveStreamPlayer from '@/components/simulator/LiveStreamPlayer'
import { ChevronRight, Radio, RefreshCw, Clock, Wifi, WifiOff } from 'lucide-react'

const tournamentStreams = {
  twitch: 'dota2ti_es',
  youtube: 'UCbEhNEf6zVdmd4C61ALvsAw',
  kick: 'dotati',
}

// ─── helpers ───────────────────────────────────────────────────────────────

function fmtDuration(secs: number): string {
  if (secs < 0) return 'Pre-game'
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function fmtGold(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

// ─── sub-components ────────────────────────────────────────────────────────

function TeamScore({ name, tag, kills, netWorth, isRadiant }: {
  name: string; tag: string; kills: number; netWorth?: number; isRadiant: boolean
}) {
  const color = isRadiant ? '#4ADE80' : '#F87171'
  const isGeneric = name === 'Radiant' || name === 'Dire'
  const displayName = isGeneric ? (isRadiant ? '🟢 Radiant' : '🔴 Dire') : name
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <div style={{ fontSize: 22, fontWeight: 800, color: isGeneric ? '#8A7A5A' : '#F5F1E8', letterSpacing: '-0.01em', textAlign: 'center' }}>
        {displayName}
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: 52, fontWeight: 900, color, lineHeight: 1 }}>{kills}</div>
      {netWorth != null && netWorth > 0 && (
        <div style={{ fontSize: 12, color: '#8A7A5A' }}>
          NW: <span style={{ color: '#D4AF37', fontWeight: 600 }}>{fmtGold(netWorth)}</span>
        </div>
      )}
    </div>
  )
}

function PlayerRow({ p, isEven, hideKDA }: { p: LivePlayer; isEven: boolean; hideKDA?: boolean }) {
  const color = p.isRadiant ? '#4ADE80' : '#F87171'
  return (
    <tr style={{ background: isEven ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
      <td style={{ padding: '6px 8px', fontSize: 12, color, fontWeight: 600, whiteSpace: 'nowrap' }}>
        {p.heroName}
      </td>
      {!hideKDA && (
        <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontSize: 12, color: '#F5F1E8', textAlign: 'center' }}>
          {p.kills}/{p.deaths}/{p.assists}
        </td>
      )}
      <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontSize: 11, color: '#8A7A5A', textAlign: 'center' }}>
        {p.level}
      </td>
      {p.gpm != null && (
        <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontSize: 11, color: '#8A7A5A', textAlign: 'right' }}>
          {p.gpm}
        </td>
      )}
    </tr>
  )
}

function MatchCard({ match }: { match: LiveMatch }) {
  const radiantPlayers = match.players.filter(p => p.isRadiant)
  const direPlayers    = match.players.filter(p => !p.isRadiant)
  const rwNW = match.radiant.netWorth ?? match.players.filter(p => p.isRadiant).reduce((s, p) => s + p.netWorth, 0)
  const dNW  = match.dire.netWorth   ?? match.players.filter(p => !p.isRadiant).reduce((s, p) => s + p.netWorth, 0)
  const nwDiff = rwNW - dNW
  const hasPicks = !!match.draft?.some(d => !d.isBan)
  const hasGpm   = match.players.some(p => p.gpm != null)

  return (
    <div className="mb-6 rounded-xl overflow-hidden" style={{ background: 'hsl(var(--surface, 220 13% 9%))', border: '1px solid rgba(212,175,55,0.2)' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px', background: 'rgba(212,175,55,0.06)', borderBottom: '1px solid rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LiveBadge />
          <span style={{ fontSize: 12, color: '#D4AF37', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.08em' }}>TI 2026</span>
          <span style={{ fontSize: 11, color: '#8A7A5A' }}>· Fase de Grupos</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: 13, color: '#D4AF37', fontWeight: 700 }}>
          <Clock size={14} />
          {fmtDuration(match.duration)}
        </div>
      </div>

      {/* Score */}
      <div style={{ padding: '24px 20px', display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16 }}>
        <TeamScore {...match.radiant} kills={match.radiant.kills} netWorth={match.radiant.netWorth ?? rwNW} isRadiant={true} tag={match.radiant.tag} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#8A7A5A', textTransform: 'uppercase', letterSpacing: '0.15em' }}>vs</span>
          <div style={{ fontSize: 11, color: nwDiff > 0 ? '#4ADE80' : nwDiff < 0 ? '#F87171' : '#8A7A5A', fontFamily: 'monospace', fontWeight: 700 }}>
            {nwDiff === 0 ? 'NW igual' : `${nwDiff > 0 ? match.radiant.tag : match.dire.tag} +${fmtGold(Math.abs(nwDiff))}`}
          </div>
        </div>

        <TeamScore {...match.dire} kills={match.dire.kills} netWorth={match.dire.netWorth ?? dNW} isRadiant={false} tag={match.dire.tag} />
      </div>

      {/* NW bar */}
      {(rwNW + dNW) > 0 && (
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#8A7A5A', marginBottom: 4 }}>
            <span>{match.radiant.tag} NW</span>
            <span>{match.dire.tag} NW</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: '#1a1a1a', overflow: 'hidden', display: 'flex' }}>
            <div style={{ background: '#4ADE80', width: `${(rwNW / (rwNW + dNW)) * 100}%`, transition: 'width 0.8s ease' }} />
            <div style={{ background: '#F87171', flex: 1 }} />
          </div>
        </div>
      )}

      {/* Draft picks */}
      {hasPicks && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 11, color: '#8A7A5A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Picks</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[true, false].map(isR => (
              <div key={String(isR)}>
                <div style={{ fontSize: 10, color: isR ? '#4ADE80' : '#F87171', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' }}>
                  {isR ? match.radiant.name : match.dire.name}
                </div>
                {match.draft!.filter(d => !d.isBan && d.isRadiant === isR).map((d, i) => (
                  <div key={i} style={{ fontSize: 12, color: '#F5F1E8', padding: '2px 0' }}>• {d.heroName}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Players */}
      {(() => {
        const knownPlayers = match.players.filter(p => p.heroId !== 0)
        const inDraft = knownPlayers.length === 0 && match.players.length > 0
        if (match.players.length === 0) return null
        if (inDraft) return (
          <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', fontSize: 12, color: '#8A7A5A', fontStyle: 'italic' }}>
            En fase de draft — héroes pendientes
          </div>
        )
        const rPlayers = knownPlayers.filter(p => p.isRadiant)
        const dPlayers = knownPlayers.filter(p => !p.isRadiant)
        const allZeroKDA = knownPlayers.every(p => p.kills === 0 && p.deaths === 0 && p.assists === 0)
        return (
          <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
            <div style={{ fontSize: 11, color: '#8A7A5A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Jugadores</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 280 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ padding: '4px 8px', textAlign: 'left',   fontSize: 10, color: '#8A7A5A', fontWeight: 500 }}>Héroe</th>
                  {!allZeroKDA && <th style={{ padding: '4px 8px', textAlign: 'center', fontSize: 10, color: '#8A7A5A', fontWeight: 500 }}>K/D/A</th>}
                  <th style={{ padding: '4px 8px', textAlign: 'center', fontSize: 10, color: '#8A7A5A', fontWeight: 500 }}>Nv.</th>
                  {hasGpm && <th style={{ padding: '4px 8px', textAlign: 'right', fontSize: 10, color: '#8A7A5A', fontWeight: 500 }}>GPM</th>}
                </tr>
              </thead>
              <tbody>
                {rPlayers.map((p, i) => <PlayerRow key={p.slot} p={p} isEven={i % 2 === 0} hideKDA={allZeroKDA} />)}
                <tr><td colSpan={4} style={{ height: 8 }} /></tr>
                {dPlayers.map((p, i) => <PlayerRow key={p.slot} p={p} isEven={i % 2 === 0} hideKDA={allZeroKDA} />)}
              </tbody>
            </table>
          </div>
        )
      })()}
    </div>
  )
}

// ─── PÁGINA PRINCIPAL ──────────────────────────────────────────────────────

export default function LivePage() {
  const { data, loading, lastUpdated, refresh } = useLiveMatches(30_000)
  const relativeTime = useRelativeTime(lastUpdated)

  const isConnected = data?.source === 'STRATZ' || data?.source === 'MOCK'
  const isMock      = data?.source === 'MOCK'
  const hasMatches  = (data?.matches?.length ?? 0) > 0

  return (
    <div className="mx-auto max-w-[1440px] p-4 md:p-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.2em] text-[#8A7A5A]">
        <span>Pancho Web</span>
        <ChevronRight className="size-3" />
        <span className="text-[#D4AF37]">En vivo</span>
      </div>

      {/* Page header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 mb-1">
            {hasMatches ? <LiveBadge /> : (
              <div className="flex items-center gap-2 rounded-full border border-[rgba(138,122,90,0.3)] bg-[rgba(138,122,90,0.06)] px-3 py-1">
                <span className="size-1.5 rounded-full bg-[#8A7A5A]" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#8A7A5A]">SIN PARTIDA EN VIVO</span>
              </div>
            )}
            {isMock && (
              <span style={{ fontSize: 10, background: 'rgba(234,179,8,0.15)', color: '#EAB308', padding: '2px 8px', borderRadius: 4, fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                MOCK
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-[#F5F1E8]">Centro en vivo</h1>
        </div>

        {/* Status / refresh */}
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span style={{ fontSize: 11, color: data?.stale ? '#EAB308' : '#8A7A5A', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 4 }}>
              {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
              {data?.stale ? 'Datos retrasados' : `Actualizado ${relativeTime}`}
            </span>
          )}
          <button
            onClick={refresh}
            title="Actualizar ahora"
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 6, color: '#D4AF37', fontSize: 12, cursor: 'pointer' }}
          >
            <RefreshCw size={13} /> Actualizar
          </button>
        </div>
      </div>

      {/* Stream player (siempre visible) */}
      <div className="mb-6 w-full">
        <LiveStreamPlayer streamUrls={tournamentStreams} />
      </div>

      {/* Loading skeleton */}
      {loading && (
        <Surface className="p-10 gold-top-border">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="size-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
            <p className="text-sm text-[#8A7A5A]">Cargando datos en vivo…</p>
          </div>
        </Surface>
      )}

      {/* Error / no matches */}
      {!loading && !hasMatches && (
        <Surface className="mb-6 p-10 gold-top-border">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-full border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.05)]">
              <Radio className="size-6 text-[#8A7A5A]" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8A7A5A] mb-2">ESTADO</p>
              <p className="text-xl font-bold text-[#F5F1E8]">No hay partidas en vivo</p>
              <p className="mt-2 text-sm text-[#8A7A5A] max-w-md">
                {data?.error
                  ? `Live data temporalmente no disponible: ${data.error}`
                  : 'Cuando comience una partida de TI 2026, aparecerá aquí automáticamente.'}
              </p>
            </div>
            <div className="mt-2 rounded-lg border border-[rgba(212,175,55,0.15)] bg-[rgba(212,175,55,0.04)] px-5 py-3 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">TI 2026 · FASE DE GRUPOS</p>
              <p className="mt-1 text-sm text-[#F5F1E8] font-semibold">13 de agosto de 2026</p>
            </div>
          </div>
        </Surface>
      )}

      {/* Live matches */}
      {!loading && hasMatches && data!.matches.map(match => (
        <MatchCard key={match.matchId} match={match} />
      ))}

      {/* Lo que verás aquí (solo cuando no hay partidas) */}
      {!loading && !hasMatches && (
        <Surface className="p-5">
          <SectionTitle eyebrow="Durante la partida" title="Lo que verás aquí en vivo" />
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {['Marcador en tiempo real', 'Net Worth', 'Picks & Bans', 'K/D/A por jugador', 'GPM / XPM', 'Duración'].map((item) => (
              <div key={item} className="rounded-lg border border-[rgba(212,175,55,0.1)] bg-[rgba(212,175,55,0.03)] p-3 text-center">
                <p className="text-[11px] text-[#8A7A5A] leading-4">{item}</p>
              </div>
            ))}
          </div>
        </Surface>
      )}
    </div>
  )
}
