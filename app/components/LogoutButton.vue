<script setup lang="ts">
const { logout, user } = useAuth()
const confirming = ref(false)

function handleClick() {
  if (!confirming.value) {
    confirming.value = true
    setTimeout(() => (confirming.value = false), 3000) // auto reset ถ้าไม่กดซ้ำใน 3 วิ
    return
  }
  logout()
}
</script>

<template>
  <div class="flex items-center gap-3">
    <span v-if="user" class="text-sm text-gray-600">
      {{ user.full_name || user.email }}
      <span class="text-xs text-gray-400">({{ user.role }})</span>
    </span>
    <UButton
      :color="confirming ? 'error' : 'neutral'"
      variant="outline"
      icon="i-heroicons-arrow-right-on-rectangle"
      size="sm"
      @click="handleClick"
    >
      {{ confirming ? 'กดอีกครั้งเพื่อออก' : 'ออกจากระบบ' }}
    </UButton>
  </div>
</template>