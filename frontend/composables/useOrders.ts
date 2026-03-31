import { orderService } from '~/services/order.service'
import type { Order, OrderStatus } from '~/types'

export function useOrders() {
  const orders = ref<Order[]>([])
  const loading = ref(false)
  const actionLoading = ref<string | null>(null)
  const error = ref<string | null>(null)

  async function fetchUserOrders(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      orders.value = await orderService.getUserOrders()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch orders'
    } finally {
      loading.value = false
    }
  }

  async function fetchAdminOrders(status: OrderStatus = 'pending'): Promise<void> {
    loading.value = true
    error.value = null
    try {
      orders.value = await orderService.getAdminOrders(status)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch orders'
    } finally {
      loading.value = false
    }
  }

  async function buyPackage(packageId: string): Promise<Order | null> {
    actionLoading.value = packageId
    error.value = null
    try {
      const order = await orderService.buyPackage(packageId)
      orders.value = [order, ...orders.value]
      return order
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to purchase package'
      return null
    } finally {
      actionLoading.value = null
    }
  }

  async function requestRefund(orderId: string): Promise<boolean> {
    actionLoading.value = orderId
    error.value = null
    try {
      await orderService.requestRefund(orderId)
      const idx = orders.value.findIndex((o) => o.id === orderId)
      if (idx !== -1) {
        orders.value[idx] = { ...orders.value[idx], status: 'refund_requested' }
      }
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to request refund'
      return false
    } finally {
      actionLoading.value = null
    }
  }

  async function approveOrder(orderId: string): Promise<boolean> {
    actionLoading.value = orderId
    error.value = null
    try {
      await orderService.approveOrder(orderId)
      orders.value = orders.value.filter((o) => o.id !== orderId)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to approve order'
      return false
    } finally {
      actionLoading.value = null
    }
  }

  async function rejectOrder(orderId: string): Promise<boolean> {
    actionLoading.value = orderId
    error.value = null
    try {
      await orderService.rejectOrder(orderId)
      orders.value = orders.value.filter((o) => o.id !== orderId)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to reject order'
      return false
    } finally {
      actionLoading.value = null
    }
  }

  async function approveRefund(orderId: string): Promise<boolean> {
    actionLoading.value = orderId
    error.value = null
    try {
      await orderService.approveRefund(orderId)
      orders.value = orders.value.filter((o) => o.id !== orderId)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to approve refund'
      return false
    } finally {
      actionLoading.value = null
    }
  }

  return {
    orders,
    loading,
    actionLoading,
    error,
    fetchUserOrders,
    fetchAdminOrders,
    buyPackage,
    requestRefund,
    approveOrder,
    rejectOrder,
    approveRefund,
  }
}
