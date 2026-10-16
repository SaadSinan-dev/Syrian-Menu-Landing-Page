import { useCopy } from '../i18n/useCopy'

export function Brand({ inverse = false }: { inverse?: boolean }) {
  const { common } = useCopy()
  return (
    <a className={`brand ${inverse ? 'brand-inverse' : ''}`} href="#home" aria-label={common.home}>
      <span className="brand-symbol">
        <img src="/brand/symbol.png" alt="" width="48" height="48" />
      </span>
      <span className="brand-wordmark">
        SYRIAN <span>MENU</span>
        <small>{common.brandTagline}</small>
      </span>
    </a>
  )
}
