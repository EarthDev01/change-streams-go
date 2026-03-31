<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const isAdminArea = computed(() => route.path.startsWith('/admin'))

const navLinks = computed(() =>
  isAdminArea.value
    ? [{ label: 'Dashboard', path: '/admin/dashboard', icon: 'grid' }]
    : [
        { label: 'Dashboard', path: '/dashboard', icon: 'grid' },
      ],
)

const handleLogout = () => {
  authStore.clearAuth()
  router.push(isAdminArea.value ? '/admin/login' : '/login')
}

onMounted(() => {
  authStore.loadFromStorage()
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed inset-y-0 left-0 z-30">
      <!-- Logo -->
      <div class="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div class="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <p class="text-white font-semibold text-sm leading-tight">ChangeStreams</p>
          <p class="text-primary-400 text-xs">{{ isAdminArea ? 'Admin Panel' : 'User Portal' }}</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-4 py-4 space-y-1">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
          :class="route.path === link.path
            ? 'bg-primary-600/20 text-primary-400'
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="link.icon === 'grid'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- User card -->
      <div class="px-4 py-4 border-t border-slate-800">
        <div class="bg-slate-800 rounded-xl p-3 mb-3">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-primary-700 flex items-center justify-center shrink-0">
              <span class="text-primary-200 text-xs font-bold uppercase">
                {{ authStore.user?.username?.charAt(0) ?? '?' }}
              </span>
            </div>
            <div class="min-w-0">
              <p class="text-white text-sm font-medium truncate">{{ authStore.user?.username }}</p>
              <p class="text-slate-400 text-xs truncate">{{ authStore.user?.email }}</p>
            </div>
          </div>
          <div v-if="!isAdminArea" class="mt-2 pt-2 border-t border-slate-700 flex items-center justify-between">
            <span class="text-slate-400 text-xs">Balance</span>
            <span class="text-emerald-400 text-xs font-semibold">
              ${{ authStore.creditBalance.toFixed(2) }}
            </span>
          </div>
        </div>

        <button
          class="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg text-sm transition-colors"
          @click="handleLogout"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 ml-64 min-h-screen">
      <slot />
    </main>
  </div>
</template>
