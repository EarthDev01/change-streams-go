import { initApiClient } from '~/utils/api'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  initApiClient(config.public.apiBaseUrl as string)
})
