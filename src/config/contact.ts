export interface WhatsAppConfig {
  mode: 'placeholder' | 'coming-soon' | 'hidden' | 'live'
  number: string
  message: string
}

export const contact = {
  email: 'syrianmenu@gmail.com',
  instagram: 'https://www.instagram.com/syrian_menu/',
  whatsapp: {
    // Before launch: use 'coming-soon' to hide the number, or 'hidden' to hide the section.
    // With an official E.164 number: replace number and set mode to 'live'.
    mode: 'placeholder',
    number: '+963 9XX XXX XXX',
    message:
      'Hello SYRIAN MENU! I would like to create a digital menu for my restaurant. Could you tell me more?',
  } satisfies WhatsAppConfig,
}

interface WhatsAppState {
  label: string
  number?: string
  href?: string
}

export function resolveWhatsApp(config: WhatsAppConfig): WhatsAppState | null {
  if (config.mode === 'hidden') return null
  const comingSoon = { label: 'WhatsApp contact coming soon' }
  if (config.mode === 'coming-soon') return comingSoon
  if (config.mode === 'placeholder') return { ...comingSoon, number: config.number }
  if (!/^\+[\d\s()-]+$/.test(config.number)) return comingSoon
  const digits = config.number.replace(/\D/g, '')
  if (!/^[1-9]\d{7,14}$/.test(digits)) return comingSoon
  return {
    label: 'Chat on WhatsApp',
    number: config.number,
    href: `https://wa.me/${digits}?text=${encodeURIComponent(config.message)}`,
  }
}
