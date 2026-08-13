import Image from 'next/image'
import { getTeamLogo } from '@/lib/teams/registry'

interface Props {
  name: string
  size?: number        // px, default 32
  className?: string
}

export default function TeamLogo({ name, size = 32, className = '' }: Props) {
  const logo = getTeamLogo(name)
  return (
    <div
      className={className}
      style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}
    >
      <Image
        src={logo}
        alt={`${name} logo`}
        width={size}
        height={size}
        style={{ objectFit: 'contain', width: '100%', height: '100%' }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = '/logos/teams/placeholder.svg'
        }}
        unoptimized
      />
    </div>
  )
}
