<script setup lang="ts">
definePageMeta({ layout: false })

onMounted(() => {
  const token = localStorage.getItem('auth_token')
  const role = localStorage.getItem('auth_role')
  if (token && role === 'admin') {
    navigateTo('/admin/dashboard')
  } else if (token) {
    navigateTo('/dashboard')
  } else {
    navigateTo('/login')
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center">
    <div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
  </div>
</template>
