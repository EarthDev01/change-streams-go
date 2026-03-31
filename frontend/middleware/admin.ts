export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const token = localStorage.getItem('auth_token')
  const role = localStorage.getItem('auth_role')

  if (!token || role !== 'admin') {
    return navigateTo('/admin/login')
  }
})
