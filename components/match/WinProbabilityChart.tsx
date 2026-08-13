'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { WinProbPoint } from '@/lib/types'

interface Props {
  data: WinProbPoint[]
  radiantLabel?: string
  direLabel?: string
  radiantColor?: string
  direColor?: string
  height?: number
}

export function WinProbabilityChart({
  data,
  radiantLabel = 'Radiant',
  direLabel = 'Dire',
  radiantColor = '#cf4b45',
  direColor = '#6f7890',
  height = 176,
}: Props) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="radiantGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={radiantColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={radiantColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
          <XAxis
            dataKey="minute"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            tickFormatter={(v) => `${v}m`}
          />
          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            width={28}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 11,
            }}
            formatter={(value: number, name: string) => [
              `${value}%`,
              name === 'radiant' ? radiantLabel : direLabel,
            ]}
          />
          <Area
            type="monotone"
            dataKey="radiant"
            stroke={radiantColor}
            fill="url(#radiantGrad)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="dire"
            stroke={direColor}
            fill="transparent"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
