import { useCopy } from '../i18n/useCopy'
export function CloudCTA() {
  const { common } = useCopy()
  return (
    <a href="#demo" className="cloud-cta" data-testid="cloud-cta" aria-label={common.tryShort}>
      <span className="cloud-body">
        <svg className="cloud-shape" viewBox="0 0 148 74" aria-hidden="true">
          <path d="M29 65C15 65 7 57 7 46C7 36 15 28 26 28C26 16 36 9 48 12C55 1 73 2 81 15C94 8 108 16 111 28C126 24 140 33 140 46C140 58 130 65 116 65Z" />
        </svg>
        <span className="cloud-label">{common.tryShort}</span>
        <span className="cloud-glint" aria-hidden="true" />
      </span>
    </a>
  )
}
