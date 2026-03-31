import { getApiClient } from '~/utils/api'
import type { ApiResponse, AuthResult, LoginInput, RegisterInput } from '~/types'

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const { data } = await getApiClient().post<ApiResponse<AuthResult>>(
      '/api/v1/auth/register',
      input,
    )
    if (data.error) throw new Error(data.error)
    return data.data!
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const { data } = await getApiClient().post<ApiResponse<AuthResult>>(
      '/api/v1/auth/login',
      input,
    )
    if (data.error) throw new Error(data.error)
    return data.data!
  },

  async adminRegister(input: RegisterInput): Promise<AuthResult> {
    const { data } = await getApiClient().post<ApiResponse<AuthResult>>(
      '/api/v1/admin/auth/register',
      input,
    )
    if (data.error) throw new Error(data.error)
    return data.data!
  },

  async adminLogin(input: LoginInput): Promise<AuthResult> {
    const { data } = await getApiClient().post<ApiResponse<AuthResult>>(
      '/api/v1/admin/auth/login',
      input,
    )
    if (data.error) throw new Error(data.error)
    return data.data!
  },
}
