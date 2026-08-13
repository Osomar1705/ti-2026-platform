'use client'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { EconomyPoint } from '@/lib/types'

interface Props {
  data: EconomyPoint[]
  height?: number
}

function fmtK(v: number) {
  return v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
}

export function EconomyChart({ data, height = 240 }: Props) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            dataKey="minute"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            tickFormatter={(v) => `${v}m`}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={38}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            tickFormatter={fmtK}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 11,
            }}
            formatter={(v: number, name: string) => [
              fmtK(v),
              name === 'radiantNW' ? 'Radiant NW' : name === 'direNW' ? 'Dire NW' : name === 'radiantXP' ? 'Radiant XP' : 'Dire XP',
            ]}
          />
          <Legend
            formatter={(v) =>
              v === 'radiantNW' ? 'Radiant NW' : v === 'direNW' ? 'Dire NW' : v === 'radiantXP' ? 'Radiant XP' : 'Dire XP'
            }
            wrapperStyle={{ fontSize: 11 }}
          />
          <Line type="monotone" dataKey="radiantNW" stroke="#cf4b45" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="direNW" stroke="#b69a66" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="radiantXP" stroke="#cf4b4580" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
          <Line type="monotone" dataKey="direXP" stroke="#b69a6680" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
