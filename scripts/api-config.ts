export function resolveApiBase(value: string | undefined, production: boolean): string {
  const base = (value?.trim() || (production
    ? 'https://syrian-menu-api.onrender.com/api/v1'
    : '/api/v1')).replace(/\/$/, '')
  if (!production && base === '/api/v1') return base
  try {
    const url = new URL(base)
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      url.search || url.hash || url.pathname !== '/api/v1' ||
      (production && (url.protocol !== 'https:' || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))))
      throw new Error()
  } catch {
    throw new Error('VITE_API_URL must be the product API URL ending in /api/v1 (HTTPS in production). The static website has no /api/v1 proxy.')
  }
  return base
}
