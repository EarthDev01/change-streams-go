import { packageService } from '~/services/package.service'
import type { CreatePackageInput, Package } from '~/types'

export function usePackages() {
  const packages = ref<Package[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPackages(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      packages.value = await packageService.listPackages()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch packages'
    } finally {
      loading.value = false
    }
  }

  async function createPackage(input: CreatePackageInput): Promise<Package | null> {
    loading.value = true
    error.value = null
    try {
      const newPackage = await packageService.createPackage(input)
      packages.value = [newPackage, ...packages.value]
      return newPackage
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create package'
      return null
    } finally {
      loading.value = false
    }
  }

  return { packages, loading, error, fetchPackages, createPackage }
}
