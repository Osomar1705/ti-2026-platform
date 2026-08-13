import { Shell } from '@/components/layout/Shell'
import { LoadingScreen } from '@/components/shared/LoadingScreen'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoadingScreen />
      <Shell>{children}</Shell>
    </>
  )
}
