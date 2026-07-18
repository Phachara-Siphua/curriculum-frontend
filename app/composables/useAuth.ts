
export function useAuth() {
  const config = useRuntimeConfig()
  const base = config.public.apiBase

  
  const token = useCookie<string | null>('access_token', { maxAge: 60 * 60 * 8 })
  const user = useState<any>('auth-user', () => null)

  async function login(email: string, password: string) {
    
    const body = new URLSearchParams()
    body.append('username', email)
    body.append('password', password)

    const res = await $fetch<{ access_token: string }>(`${base}/api/auth/login`, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    token.value = res.access_token
    await fetchMe()
  }

  async function fetchMe() {
    user.value = await $fetch(`${base}/api/users/me`, {
      headers: { Authorization: `Bearer ${token.value}` },
    })
  }

  function logout() {
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  return { token, user, login, logout, fetchMe }
}