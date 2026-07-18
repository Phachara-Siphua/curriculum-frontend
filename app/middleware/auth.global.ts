export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/login') return
  const token = useCookie('access_token')
  if (!token.value) return navigateTo('/login')
})