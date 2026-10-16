import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

export function QR({ size = 82 }: { size?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!canvas.current) return
    const element = canvas.current
    void QRCode.toCanvas(element, `${window.location.origin}${window.location.pathname}#demo`, {
      width: size * 2,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#123f30', light: '#fffefa' },
    })
      .then(() => {
        // The encoder sizes the backing canvas and its CSS box. Keep retina pixels
        // while restoring the intended on-screen dimensions.
        element.style.width = `${size}px`
        element.style.height = `${size}px`
      })
      .catch(() => {
        /* The accessible link remains available if canvas is unsupported. */
      })
  }, [size])
  return (
    <a className="qr-link" href="#demo" aria-label="Open the interactive menu demo">
      <canvas ref={canvas} style={{ width: size, height: size }} aria-hidden="true" />
    </a>
  )
}
