export function useProgramApi() {
  const config = useRuntimeConfig()
  const base = config.public.apiBase
  const { token, logout } = useAuth()

  async function authFetch(url: string, opts: any = {}) {
    try {
      return await $fetch(url, {
        ...opts,
        headers: {
          ...opts.headers,
          Authorization: `Bearer ${token.value}`,
        },
      })
    } catch (err: any) {
      if (err.status === 401) {
        logout() // token หมดอายุหรือไม่ถูกต้อง -> เด้งไป login
      }
      throw err
    }
  }

  const createProgram = (payload: any) =>
    authFetch(`${base}/api/programs`, { method: 'POST', body: payload })

  const updateProgram = (id: string | number, payload: any) =>
    authFetch(`${base}/api/programs/${id}`, { method: 'PATCH', body: payload })

  const getProgram = (id: string | number) =>
    authFetch(`${base}/api/programs/${id}`)

  const submitProgram = (id: string | number) =>
    authFetch(`${base}/api/programs/${id}/submit`, { method: 'POST' })

  const reviewProgram = (id: string | number, decision: string, comment?: string) =>
    authFetch(`${base}/api/programs/${id}/review`, {
      method: 'POST',
      body: { decision, comment },
    })

  return { createProgram, updateProgram, getProgram, submitProgram, reviewProgram }
}