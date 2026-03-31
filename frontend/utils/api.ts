import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

let instance: AxiosInstance | null = null

export function initApiClient(baseURL: string): AxiosInstance {
  instance = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10_000,
  })

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        localStorage.removeItem('auth_role')
        window.location.href = '/login'
      }
      return Promise.reject(error)
    },
  )

  return instance
}

export function getApiClient(): AxiosInstance {
  if (!instance) {
    throw new Error('API client not initialized. Call initApiClient() first.')
  }
  return instance
}
