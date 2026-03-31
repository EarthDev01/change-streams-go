import { defineStore } from 'pinia'
import type { AuthResult, User } from '~/types'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'
const ROLE_KEY = 'auth_role'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const creditBalance = computed(() => user.value?.credit_balance ?? 0)

  function setAuth(result: AuthResult): void {
    token.value = result.token
    user.value = result.user
    localStorage.setItem(TOKEN_KEY, result.token)
    localStorage.setItem(USER_KEY, JSON.stringify(result.user))
    localStorage.setItem(ROLE_KEY, result.user.role)
  }

  function clearAuth(): void {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(ROLE_KEY)
  }

  function updateCreditBalance(newBalance: number): void {
    if (user.value) {
      user.value = { ...user.value, credit_balance: newBalance }
      localStorage.setItem(USER_KEY, JSON.stringify(user.value))
    }
  }

  function loadFromStorage(): void {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser) as User
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    creditBalance,
    setAuth,
    clearAuth,
    updateCreditBalance,
    loadFromStorage,
  }
})
