<!-- pages/login.vue -->
<script setup lang="ts">
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)
const { login } = useAuth()

async function handleLogin() {
  loading.value = true
  errorMsg.value = ''
  try {
    await login(email.value, password.value)
    navigateTo('/') 
  } catch (err: any) {
    errorMsg.value = err.data?.detail || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-20 p-6">
    <UCard>
      <template #header>
        <p class="font-bold text-lg">เข้าสู่ระบบ</p>
      </template>
      <UFormField label="อีเมล">
        <UInput v-model="email" type="email" class="w-full" />
      </UFormField>
      <UFormField label="รหัสผ่าน" class="mt-4">
        <UInput v-model="password" type="password" class="w-full" />
      </UFormField>
      <UAlert v-if="errorMsg" color="error" :title="errorMsg" class="mt-4" />
      <UButton :loading="loading" class="mt-4 w-full" @click="handleLogin">เข้าสู่ระบบ</UButton>
    </UCard>
  </div>
</template>