import { orderService } from '~/services/order.service'
import { useAuthStore } from '~/stores/auth.store'

export function useCredit() {
  const authStore = useAuthStore()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  async function topup(amount: number): Promise<boolean> {
    loading.value = true
    error.value = null
    success.value = false
    try {
      await orderService.topup({ amount })
      authStore.updateCreditBalance(authStore.creditBalance + amount)
      success.value = true
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Top-up failed'
      return false
    } finally {
      loading.value = false
    }
  }

  function reset(): void {
    error.value = null
    success.value = false
  }

  return { loading, error, success, topup, reset }
}
