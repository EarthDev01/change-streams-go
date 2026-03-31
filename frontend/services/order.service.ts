import { getApiClient } from '~/utils/api'
import type { ApiResponse, Order, OrderStatus, TopupInput } from '~/types'

export const orderService = {
  async buyPackage(packageId: string): Promise<Order> {
    const { data } = await getApiClient().post<ApiResponse<Order>>(
      `/api/v1/user/packages/${packageId}/buy`,
    )
    if (data.error) throw new Error(data.error)
    return data.data!
  },

  async getUserOrders(): Promise<Order[]> {
    const { data } = await getApiClient().get<ApiResponse<Order[]>>(
      '/api/v1/user/orders',
    )
    if (data.error) throw new Error(data.error)
    return data.data ?? []
  },

  async requestRefund(orderId: string): Promise<void> {
    const { data } = await getApiClient().post<ApiResponse<{ message: string }>>(
      `/api/v1/user/orders/${orderId}/refund`,
    )
    if (data.error) throw new Error(data.error)
  },

  async topup(input: TopupInput): Promise<void> {
    const { data } = await getApiClient().post<ApiResponse<{ message: string }>>(
      '/api/v1/user/topup',
      input,
    )
    if (data.error) throw new Error(data.error)
  },

  async getAdminOrders(status: OrderStatus = 'pending'): Promise<Order[]> {
    const { data } = await getApiClient().get<ApiResponse<Order[]>>(
      '/api/v1/admin/orders',
      { params: { status } },
    )
    if (data.error) throw new Error(data.error)
    return data.data ?? []
  },

  async approveOrder(orderId: string): Promise<void> {
    const { data } = await getApiClient().put<ApiResponse<{ message: string }>>(
      `/api/v1/admin/orders/${orderId}/approve`,
    )
    if (data.error) throw new Error(data.error)
  },

  async rejectOrder(orderId: string): Promise<void> {
    const { data } = await getApiClient().put<ApiResponse<{ message: string }>>(
      `/api/v1/admin/orders/${orderId}/reject`,
    )
    if (data.error) throw new Error(data.error)
  },

  async approveRefund(orderId: string): Promise<void> {
    const { data } = await getApiClient().put<ApiResponse<{ message: string }>>(
      `/api/v1/admin/orders/${orderId}/refund`,
    )
    if (data.error) throw new Error(data.error)
  },
}
