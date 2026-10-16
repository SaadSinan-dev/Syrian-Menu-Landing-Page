export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <a
      className={`brand ${inverse ? 'brand-inverse' : ''}`}
      href="#home"
      aria-label="SYRIAN MENU — home"
    >
      <span className="brand-symbol">
        <img src="/brand/symbol.png" alt="" width="48" height="48" />
      </span>
      <span className="brand-wordmark">
        SYRIAN <span>MENU</span>
        <small>A LITTLE SCAN. A WHOLE EXPERIENCE.</small>
      </span>
    </a>
  )
}
