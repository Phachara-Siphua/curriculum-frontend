<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen flex flex-col bg-gray-50 font-sans">
    <!-- แถบด้านบนคงที่ -->
    <AppHeader class="sticky top-0 z-50 shadow-sm" />

    <div class="flex flex-1 overflow-hidden">
      <!-- แถบเมนูด้านซ้ายคงที่ -->
      <Sidebar class="w-64 flex-shrink-0 border-r border-gray-200 bg-white" />

      <!-- พื้นที่แสดงเนื้อหาหลักตรงกลาง (Scroll ได้) -->
      <main class="flex-1 overflow-y-auto">
        <div class="max-w-5xl mx-auto py-8 px-6">
           <!-- หน้าต่างๆ ในโฟลเดอร์ pages จะมาแทรกตรงนี้ -->
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>