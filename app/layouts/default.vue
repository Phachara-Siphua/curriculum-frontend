<!-- layouts/default.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isNewMenuOpen = ref(false)

const createNewCurriculum = (type: 'new' | 'rev') => {
  if (type === 'rev') return // 🌟 ถ้าเป็น rev (ปรับปรุง) ให้หยุดการทำงาน ไม่ทำอะไร
  isNewMenuOpen.value = false
  const newId = Date.now()
  router.push(`/curriculum/${newId}?type=${type}`)
}
</script>

<template>
  <div class="shell-layout">
    <!-- Top Header -->
    <header class="top-nav">
      <NuxtLink to="/" class="logo">
        <b>AI-Powered</b> Curriculum Management System
      </NuxtLink>
      <div class="user-profile">
        <span class="font-medium">User</span>
      </div>
    </header>

    <div class="body-area">
      <!-- Sidebar ทางซ้าย -->
      <aside class="side-nav">
        
        <!-- 🌟 ปุ่ม + ใหม่ พร้อม Dropdown -->
        <div class="relative" style="margin-bottom: 16px;">
          <button class="new-btn" @click="isNewMenuOpen = true">
            <span class="text-[20px] font-bold leading-none mr-2">＋</span> ใหม่
          </button>

          <!-- ฉากหลังใสสำหรับกดปิด Menu -->
          <div v-if="isNewMenuOpen" class="fixed inset-0 z-40" @click="isNewMenuOpen = false"></div>

          <!-- Dropdown Menu -->
          <div v-if="isNewMenuOpen" class="dropdown-menu z-50">
            <!-- ปุ่มสร้างใหม่ (กดได้) -->
            <button class="dropdown-item" @click="createNewCurriculum('new')">
              <UIcon name="i-heroicons-document-plus" class="w-5 h-5 mr-3 text-[var(--acc)]" /> 
              หลักสูตรใหม่
            </button>
            
            <!-- 🌟 ปุ่มปรับปรุง (กดไม่ได้ แสดงเฉยๆ) -->
            <button class="dropdown-item" @click.prevent="createNewCurriculum('rev')">
              <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 mr-3 text-[var(--mute)]" /> 
              ปรับปรุงหลักสูตร
            </button>
          </div>
        </div>

        <nav class="nav-menu">
          <NuxtLink to="/" class="nav-btn" active-class="on">
            <UIcon name="i-heroicons-home" class="w-5 h-5" />
            <span>หน้าแรก</span>
          </NuxtLink>
          <NuxtLink to="/courses" class="nav-btn" active-class="on">
            <UIcon name="i-heroicons-circle-stack" class="w-5 h-5" />
            <span>คลังวิชา</span>
          </NuxtLink>
          <NuxtLink to="/starred" class="nav-btn" active-class="on">
            <UIcon name="i-heroicons-star" class="w-5 h-5" />
            <span>ติดดาว</span>
          </NuxtLink>
        </nav>
      </aside>

      <!-- พื้นที่เนื้อหาหลัก -->
      <main class="main-content custom-scrollbar">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.shell-layout { display: flex; flex-direction: column; height: 100vh; overflow: hidden; background: var(--bg); }
.top-nav { display: flex; align-items: center; justify-content: space-between; padding: 10px 24px; background: var(--panel); border-bottom: 1px solid var(--line); height: 58px; flex: none; z-index: 10; }

.logo { font-size: 16.5px; font-weight: 600; color: var(--ink); text-decoration: none; }
.logo b { color: var(--acc); }
.user-profile { font-size: 14px; color: var(--mute); display: flex; align-items: center; gap: 8px; }

.body-area { display: flex; flex: 1; min-height: 0; }
.side-nav { width: 240px; padding: 20px 14px; border-right: 1px solid var(--line); background: var(--panel); flex: none; display: flex; flex-direction: column; }

/* ปุ่มสร้างหลักสูตรใหม่ */
.relative { position: relative; }
.new-btn { display: flex; align-items: center; justify-content: center; background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 10px 16px; font-size: 15px; font-weight: 600; color: var(--ink); box-shadow: 0 1px 3px rgba(0,0,0,0.06); width: 100%; transition: all 0.2s; }
.new-btn:hover { background: var(--soft); border-color: var(--acc); color: var(--btn); }

/* Dropdown Menu */
.dropdown-menu { position: absolute; top: 100%; left: 0; right: 0; margin-top: 6px; background: var(--panel); border: 1px solid var(--line); border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.08); overflow: hidden; animation: pop 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes pop { 0% { opacity: 0; transform: translateY(-5px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.dropdown-item { display: flex; align-items: center; width: 100%; text-align: left; padding: 12px 16px; border: none; background: none; font-size: 14.5px; font-weight: 500; color: var(--ink); transition: 0.15s; }
.dropdown-item:hover:not(.disabled-item) { background: var(--soft); color: var(--acc); }

/* 🌟 สไตล์สำหรับปุ่มที่ถูกปิดใช้งาน (Disabled) */
.disabled-item {   }

.nav-menu { display: flex; flex-direction: column; gap: 4px; }
.nav-btn { display: flex; align-items: center; gap: 12px; padding: 10px 16px; text-decoration: none; color: var(--ink); border-radius: 0 20px 20px 0; font-size: 14.5px; font-weight: 500; transition: 0.15s; }
.nav-btn:hover { background: var(--chip); }
.nav-btn.on { background: var(--soft); color: var(--btn); font-weight: 600; }

.main-content { flex: 1; padding: 28px 36px 60px; overflow-y: auto; background: var(--bg); }

@media (max-width: 768px) {
  .body-area { flex-direction: column; }
  .side-nav { width: 100%; flex-direction: row; padding: 10px; border-right: none; border-bottom: 1px solid var(--line); overflow-x: auto; }
  .new-btn { width: auto; margin-bottom: 0; margin-right: 12px; }
  .nav-menu { flex-direction: row; }
  .nav-btn { border-radius: 20px; white-space: nowrap; }
  .main-content { padding: 16px; }
}
</style>