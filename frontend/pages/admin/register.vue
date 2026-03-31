<script setup lang="ts">
import { authService } from '~/services/auth.service'
import { useAuthStore } from '~/stores/auth.store'

definePageMeta({ layout: 'auth' })

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({ username: '', email: '', password: '' })
const loading = ref(false)
const error = ref<string | null>(null)

const handleSubmit = async () => {
  loading.value = true
  error.value = null
  try {
    const result = await authService.adminRegister(form)
    authStore.setAuth(result)
    router.push('/admin/dashboard')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Registration failed'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (authStore.token && authStore.isAdmin) router.replace('/admin/dashboard')
})
</script>

<template>
  <div class="bg-slate-900 border border-slate-800 rounded-2xl p-8">
    <div class="flex items-center gap-2 mb-1">
      <span class="text-xs bg-primary-600/20 text-primary-400 border border-primary-500/30 px-2 py-0.5 rounded-full font-medium">
        Admin
      </span>
      <h2 class="text-xl font-bold text-white">Create account</h2>
    </div>
    <p class="text-slate-400 text-sm mb-6">Register a new admin account</p>

    <div
      v-if="error"
      class="mb-4 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm"
    >
      {{ error }}
    </div>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-slate-300 text-sm font-medium mb-1.5">Username</label>
        <input
          v-model="form.username"
          type="text"
          required
          placeholder="admin"
          class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
        />
      </div>
      <div>
        <label class="block text-slate-300 text-sm font-medium mb-1.5">Email</label>
        <input
          v-model="form.email"
          type="email"
          required
          placeholder="admin@example.com"
          class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
        />
      </div>
      <div>
        <label class="block text-slate-300 text-sm font-medium mb-1.5">Password</label>
        <input
          v-model="form.password"
          type="password"
          required
          minlength="6"
          placeholder="At least 6 characters"
          class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
        />
      </div>
      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
      >
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Creating account...
        </span>
        <span v-else>Create admin account</span>
      </button>
    </form>

    <p class="text-slate-400 text-sm text-center mt-6">
      Already registered?
      <NuxtLink to="/admin/login" class="text-primary-400 hover:text-primary-300 font-medium transition-colors">
        Sign in
      </NuxtLink>
    </p>
  </div>
</template>
