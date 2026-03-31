import { getApiClient } from '~/utils/api'
import type { ApiResponse, CreatePackageInput, Package } from '~/types'

export const packageService = {
  async listPackages(): Promise<Package[]> {
    const { data } = await getApiClient().get<ApiResponse<Package[]>>(
      '/api/v1/user/packages',
    )
    if (data.error) throw new Error(data.error)
    return data.data ?? []
  },

  async createPackage(input: CreatePackageInput): Promise<Package> {
    const { data } = await getApiClient().post<ApiResponse<Package>>(
      '/api/v1/admin/packages',
      input,
    )
    if (data.error) throw new Error(data.error)
    return data.data!
  },
}
