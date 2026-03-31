<script setup lang="ts">
import { usePackages } from '~/composables/usePackages'
import { useOrders } from '~/composables/useOrders'
import type { OrderStatus } from '~/types'

definePageMeta({ middleware: ['admin'] })

const { packages, loading: packagesLoading, fetchPackages, createPackage } = usePackages()
const {
  orders,
  loading: ordersLoading,
  actionLoading,
  error: ordersError,
  fetchAdminOrders,
  approveOrder,
  rejectOrder,
  approveRefund,
} = useOrders()

const activeTab = ref<'packages' | 'orders'>('orders')
const orderStatusFilter = ref<OrderStatus>('pending')
const showCreateModal = ref(false)

const packageForm = reactive({ name: '', description: '', price: 0 })
const createError = ref<string | null>(null)
const createLoading = ref(false)

const orderStatusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'refund_requested', label: 'Refund Requested' },
  { value: 'refunded', label: 'Refunded' },
]

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  refund_requested: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  refunded: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
}

const pendingOrders = computed(() => orders.value.filter(o => o.status === 'pending'))
const refundRequests = computed(() => orders.value.filter(o => o.status === 'refund_requested'))

const handleFilterChange = async (status: OrderStatus) => {
  orderStatusFilter.value = status
  await fetchAdminOrders(status)
}

const handleCreatePackage = async () => {
  createLoading.value = true
  createError.value = null
  const pkg = await createPackage(packageForm)
  createLoading.value = false
  if (pkg) {
    showCreateModal.value = false
    packageForm.name = ''
    packageForm.description = ''
    packageForm.price = 0
  } else {
    createError.value = 'Failed to create package'
  }
}

onMounted(async () => {
  await Promise.all([fetchPackages(), fetchAdminOrders('pending')])
})
</script>

<template>
  <div class="p-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-white">Admin Dashboard</h1>
      <p class="text-slate-400 text-sm mt-0.5">Manage packages, orders and refunds</p>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-4 mb-8">
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p class="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Total Packages</p>
        <p class="text-2xl font-bold text-white">{{ packages.length }}</p>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p class="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Pending Orders</p>
        <p class="text-2xl font-bold text-amber-400">{{ pendingOrders.length }}</p>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p class="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Refund Requests</p>
        <p class="text-2xl font-bold text-violet-400">{{ refundRequests.length }}</p>
      </div>
      <div class="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <p class="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Active Packages</p>
        <p class="text-2xl font-bold text-emerald-400">{{ packages.filter(p => p.is_active).length }}</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 w-fit mb-6">
      <button
        class="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="activeTab === 'orders' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-slate-200'"
        @click="activeTab = 'orders'"
      >
        Orders
      </button>
      <button
        class="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="activeTab === 'packages' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-slate-200'"
        @click="activeTab = 'packages'"
      >
        Packages
      </button>
    </div>

    <!-- Orders Tab -->
    <div v-if="activeTab === 'orders'">
      <!-- Status filter -->
      <div class="flex items-center gap-2 mb-5">
        <button
          v-for="opt in orderStatusOptions"
          :key="opt.value"
          class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
          :class="orderStatusFilter === opt.value
            ? 'bg-primary-600/20 text-primary-400 border-primary-500/50'
            : 'text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-200'"
          @click="handleFilterChange(opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>

      <div
        v-if="ordersError"
        class="mb-4 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm"
      >
        {{ ordersError }}
      </div>

      <div v-if="ordersLoading" class="flex justify-center py-16">
        <div class="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <div v-else-if="orders.length === 0" class="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
        <p class="text-slate-500">No orders with status "{{ orderStatusFilter.replace('_', ' ') }}"</p>
      </div>
      <div v-else class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-800">
              <th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Order ID</th>
              <th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">User ID</th>
              <th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Amount</th>
              <th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Status</th>
              <th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Date</th>
              <th class="text-right text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in orders"
              :key="order.id"
              class="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors"
            >
              <td class="px-5 py-3.5 text-sm font-mono text-slate-400">{{ order.id.slice(-8) }}</td>
              <td class="px-5 py-3.5 text-sm font-mono text-slate-400">{{ order.user_id.slice(-8) }}</td>
              <td class="px-5 py-3.5 text-sm font-semibold text-white">${{ order.amount.toFixed(2) }}</td>
              <td class="px-5 py-3.5">
                <span
                  class="text-xs font-medium px-2.5 py-1 rounded-full border"
                  :class="statusColors[order.status]"
                >
                  {{ order.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-sm text-slate-400">
                {{ new Date(order.created_at).toLocaleDateString() }}
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <template v-if="order.status === 'pending'">
                    <button
                      :disabled="actionLoading === order.id"
                      class="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 disabled:opacity-40 px-3 py-1.5 rounded-lg transition-colors"
                      @click="approveOrder(order.id)"
                    >
                      <span v-if="actionLoading === order.id">...</span>
                      <span v-else>Approve</span>
                    </button>
                    <button
                      :disabled="actionLoading === order.id"
                      class="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 disabled:opacity-40 px-3 py-1.5 rounded-lg transition-colors"
                      @click="rejectOrder(order.id)"
                    >
                      <span v-if="actionLoading === order.id">...</span>
                      <span v-else>Reject</span>
                    </button>
                  </template>
                  <template v-else-if="order.status === 'refund_requested'">
                    <button
                      :disabled="actionLoading === order.id"
                      class="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/30 hover:bg-violet-500/20 disabled:opacity-40 px-3 py-1.5 rounded-lg transition-colors"
                      @click="approveRefund(order.id)"
                    >
                      <span v-if="actionLoading === order.id">...</span>
                      <span v-else>Approve refund</span>
                    </button>
                  </template>
                  <span v-else class="text-slate-600 text-xs">—</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Packages Tab -->
    <div v-if="activeTab === 'packages'">
      <div class="flex items-center justify-between mb-5">
        <p class="text-slate-400 text-sm">{{ packages.length }} packages total</p>
        <button
          class="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          @click="showCreateModal = true"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Create package
        </button>
      </div>

      <div v-if="packagesLoading" class="flex justify-center py-16">
        <div class="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <div v-else-if="packages.length === 0" class="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
        <p class="text-slate-500 mb-3">No packages yet</p>
        <button
          class="text-primary-400 hover:text-primary-300 text-sm transition-colors"
          @click="showCreateModal = true"
        >
          Create your first package →
        </button>
      </div>
      <div v-else class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-800">
              <th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Name</th>
              <th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Description</th>
              <th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Price</th>
              <th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Status</th>
              <th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Created</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="pkg in packages"
              :key="pkg.id"
              class="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors"
            >
              <td class="px-5 py-3.5 text-sm font-medium text-white">{{ pkg.name }}</td>
              <td class="px-5 py-3.5 text-sm text-slate-400 max-w-xs truncate">{{ pkg.description }}</td>
              <td class="px-5 py-3.5 text-sm font-semibold text-emerald-400">${{ pkg.price.toFixed(2) }}</td>
              <td class="px-5 py-3.5">
                <span
                  class="text-xs font-medium px-2.5 py-1 rounded-full border"
                  :class="pkg.is_active
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-500/10 text-slate-400 border-slate-500/30'"
                >
                  {{ pkg.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-5 py-3.5 text-sm text-slate-400">
                {{ new Date(pkg.created_at).toLocaleDateString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Create Package Modal -->
  <Teleport to="body">
    <div
      v-if="showCreateModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click.self="showCreateModal = false"
    >
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md">
        <div class="flex items-center justify-between mb-5">
          <h3 class="text-white font-semibold">Create new package</h3>
          <button
            class="text-slate-500 hover:text-slate-300 transition-colors"
            @click="showCreateModal = false"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          v-if="createError"
          class="mb-4 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm"
        >
          {{ createError }}
        </div>

        <form class="space-y-4" @submit.prevent="handleCreatePackage">
          <div>
            <label class="block text-slate-300 text-sm font-medium mb-1.5">Name</label>
            <input
              v-model="packageForm.name"
              type="text"
              required
              placeholder="Premium Plan"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label class="block text-slate-300 text-sm font-medium mb-1.5">Description</label>
            <textarea
              v-model="packageForm.description"
              required
              rows="3"
              placeholder="Describe what this package includes..."
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
            />
          </div>
          <div>
            <label class="block text-slate-300 text-sm font-medium mb-1.5">Price ($)</label>
            <input
              v-model.number="packageForm.price"
              type="number"
              required
              min="0.01"
              step="0.01"
              placeholder="0.00"
              class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
          <div class="flex gap-3 pt-1">
            <button
              type="button"
              class="flex-1 border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium py-2.5 rounded-lg text-sm transition-colors"
              @click="showCreateModal = false"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="createLoading"
              class="flex-1 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
            >
              <span v-if="createLoading" class="flex items-center justify-center gap-2">
                <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </span>
              <span v-else>Create package</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
