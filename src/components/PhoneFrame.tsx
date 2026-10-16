import { BatteryFull, Signal, Wifi } from 'lucide-react'
import type { ReactNode } from 'react'

export function PhoneFrame({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`phone-frame ${className}`}>
      <div className="phone-status" aria-hidden="true">
        <span>9:41</span>
        <span className="phone-island" />
        <span className="phone-status-icons">
          <Signal size={12} />
          <Wifi size={12} />
          <BatteryFull size={17} />
        </span>
      </div>
      <div className="phone-viewport">{children}</div>
      <div className="phone-bottom" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}
