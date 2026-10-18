import { useState, type ImgHTMLAttributes } from 'react'
import { UtensilsCrossed } from 'lucide-react'

export function MenuPhoto({
  src,
  fallbackLabel,
  ...props
}: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string | null
  fallbackLabel: string
}) {
  const [failed, setFailed] = useState<string | null>(null)
  const safe = src && (/^https?:\/\//i.test(src) || (src.startsWith('/') && !src.startsWith('//')))
  if (!safe || failed === src)
    return (
      <span
        className={`menu-photo-fallback ${props.className ?? ''}`}
        role="img"
        aria-label={fallbackLabel}
      >
        <UtensilsCrossed size={28} strokeWidth={1.3} aria-hidden="true" />
      </span>
    )
  return <img {...props} src={src} onError={() => setFailed(src)} />
}
