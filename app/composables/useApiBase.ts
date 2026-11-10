// Central API base URL. Uses nuxt.config's public.apiBase, but when the site is
// opened from another machine on the LAN (e.g. 192.168.x.x:3000) we point the
// API at that same host instead of "localhost".
export const useApiBase = () => {
  const config = useRuntimeConfig()
  const configured = (config.public?.apiBase as string) || 'http://localhost:8000'

  try {
    const url = new URL(configured)
    const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1'
    if (import.meta.client && isLocal && window.location.hostname) {
      url.hostname = window.location.hostname
    }
    return url.origin
  } catch {
    return configured.replace(/\/$/, '')
  }
}
