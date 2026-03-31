<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'
import { usePackages } from '~/composables/usePackages'
import { useOrders } from '~/composables/useOrders'
import { useCredit } from '~/composables/useCredit'
import type { OrderStatus } from '~/types'

definePageMeta({ middleware: ['auth'] })

const authStore = useAuthStore()
const { packages, loading: packagesLoading, fetchPackages } = usePackages()
const { orders, loading: ordersLoading, actionLoading, error: ordersError, fetchUserOrders, buyPackage, requestRefund } = useOrders()
const { loading: topupLoading, error: topupError, success: topupSuccess, topup, reset: resetTopup } = useCredit()

const showTopupModal = ref(false)
const topupAmount = ref<number>(0)

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  refund_requested: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  refunded: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
}

const canRefund = (status: OrderStatus) => status === 'approved'

const handleBuyPackage = async (packageId: string) => {
  const order = await buyPackage(packageId)
  if (order) {
    authStore.updateCreditBalance(authStore.creditBalance - order.amount)
  }
}

const handleTopup = async () => {
  if (topupAmount.value <= 0) return
  const ok = await topup(topupAmount.value)
  if (ok) {
    setTimeout(() => {
      showTopupModal.value = false
      topupAmount.value = 0
      resetTopup()
    }, 1500)
  }
}

const openTopupModal = () => {
  resetTopup()
  topupAmount.value = 0
  showTopupModal.value = true
}

onMounted(async () => {
  authStore.loadFromStorage()
  await Promise.all([fetchPackages(), fetchUserOrders()])
})
</script>

<template>
  <div class="p-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-white">Dashboard</h1>
        <p class="text-slate-400 text-sm mt-0.5">Manage your packages and orders</p>
      </div>
      <button
        class="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        @click="openTopupModal"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Top up credit
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mb-8">
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p class="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Credit Balance</p>
        <p class="text-2xl font-bold text-emerald-400">${{ authStore.creditBalance.toFixed(2) }}</p>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p class="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Total Orders</p>
        <p class="text-2xl font-bold text-white">{{ orders.length }}</p>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p class="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Available Packages</p>
        <p class="text-2xl font-bold text-white">{{ packages.filter(p => p.is_active).length }}</p>
      </div>
    </div>

    <div class="grid grid-cols-5 gap-6">
      <!-- Packages -->
      <div class="col-span-3">
        <h2 class="text-base font-semibold text-white mb-4">Available Packages</h2>
        <div v-if="packagesLoading" class="flex justify-center py-12">
          <div class="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <div v-else-if="packages.length === 0" class="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p class="text-slate-500 text-sm">No packages available</p>
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="pkg in packages.filter(p => p.is_active)"
            :key="pkg.id"
            class="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-colors"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p class="text-white font-medium text-sm truncate">{{ pkg.name }}</p>
                <p class="text-slate-400 text-xs mt-0.5 line-clamp-2">{{ pkg.description }}</p>
              </div>
              <div class="shrink-0 flex items-center gap-3">
                <span class="text-emerald-400 font-bold text-sm">${{ pkg.price.toFixed(2) }}</span>
                <button
                  :disabled="actionLoading === pkg.id || authStore.creditBalance < pkg.price"
                  class="bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  @click="handleBuyPackage(pkg.id)"
                >
                  <span v-if="actionLoading === pkg.id" class="flex items-center gap-1.5">
                    <span class="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    Buying...
                  </span>
                  <span v-else>Buy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders -->
      <div class="col-span-2">
        <h2 class="text-base font-semibold text-white mb-4">My Orders</h2>
        <div
          v-if="ordersError"
          class="mb-3 px-3 py-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs"
        >
          {{ ordersError }}
        </div>
        <div v-if="ordersLoading" class="flex justify-center py-12">
          <div class="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <div v-else-if="orders.length === 0" class="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p class="text-slate-500 text-sm">No orders yet</p>
        </div>
        <div v-else class="space-y-2">
          <div
            v-for="order in orders"
            :key="order.id"
            class="bg-slate-900 border border-slate-800 rounded-xl p-3"
          >
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="text-slate-400 text-xs font-mono">{{ order.id.slice(-8) }}</span>
              <span
                class="text-xs font-medium px-2 py-0.5 rounded-full border"
                :class="statusColors[order.status]"
              >
                {{ order.status.replace('_', ' ') }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-white text-sm font-semibold">${{ order.amount.toFixed(2) }}</span>
              <button
                v-if="canRefund(order.status)"
                :disabled="actionLoading === order.id"
                class="text-xs text-slate-400 hover:text-rose-400 disabled:opacity-40 transition-colors"
                @click="requestRefund(order.id)"
              >
                <span v-if="actionLoading === order.id">Requesting...</span>
                <span v-else>Request refund</span>
              </button>
            </div>
            <p class="text-slate-500 text-xs mt-1">{{ new Date(order.created_at).toLocaleDateString() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Top-up Modal -->
  <Teleport to="body">
    <div
      v-if="showTopupModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click.self="showTopupModal = false"
    >
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-white font-semibold">Top up credit</h3>
          <button
            class="text-slate-500 hover:text-slate-300 transition-colors"
            @click="showTopupModal = false"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          v-if="topupSuccess"
          class="mb-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm text-center"
        >
          ✓ Credit topped up successfully!
        </div>
        <div
          v-if="topupError"
          class="mb-4 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm"
        >
          {{ topupError }}
        </div>

        <div class="mb-4">
          <label class="block text-slate-300 text-sm font-medium mb-1.5">Amount ($)</label>
          <input
            v-model.number="topupAmount"
            type="number"
            min="1"
            step="0.01"
            placeholder="0.00"
            class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
        </div>

        <div class="flex gap-3">
          <button
            class="flex-1 border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium py-2.5 rounded-lg text-sm transition-colors"
            @click="showTopupModal = false"
          >
            Cancel
          </button>
          <button
            :disabled="topupLoading || topupAmount <= 0"
            class="flex-1 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
            @click="handleTopup"
          >
            <span v-if="topupLoading" class="flex items-center justify-center gap-2">
              <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </span>
            <span v-else>Confirm</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
