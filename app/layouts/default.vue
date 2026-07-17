<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen flex flex-col bg-[#f9fafb] font-sans">
    <AppHeader class="sticky top-0 z-50 shadow-sm" />
    <div class="flex flex-1 overflow-hidden">
      <Sidebar class="w-64 flex-shrink-0 border-r border-gray-200 bg-white" />
      <main class="flex-1 overflow-y-auto">
        <!-- เปลี่ยนตรงนี้! ให้กว้าง 100% เต็มพื้นที่ -->
        <div class="w-full h-full py-8 px-4 md:px-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>