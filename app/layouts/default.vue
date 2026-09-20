<!-- layouts/default.vue -->
<script setup lang="ts">
// โครงหน้าหลัก: แถบบน + เมนูซ้าย (accordion) + พื้นที่เนื้อหา
// เนื้อหาของแต่ละหมวดอยู่ในไฟล์ pages/* ผ่าน <slot />
</script>

<template>
  <div class="shell">
    <AppHeader />

    <div class="body-row">
      <Sidebar />

      <main id="main-scroll" class="main custom-scrollbar">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.shell { display: flex; flex-direction: column; height: 100vh; }
.body-row { flex: 1; display: flex; min-height: 0; }
.main { flex: 1; overflow-y: auto; padding: 34px 26px 90px; scroll-behavior: smooth; }

.main::-webkit-scrollbar { width: 10px; }
.main::-webkit-scrollbar-thumb { background: rgba(27,42,74,.18); border-radius: 5px; }
</style>