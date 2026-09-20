<!-- components/AppHeader.vue -->
<script setup lang="ts">
withDefaults(defineProps<{
  programTitle?: string
  programSubtitle?: string
}>(), {
  programTitle: 'AI-Powered Curriculum Management System',
  programSubtitle: 'ระบบบริหารจัดการการจัดทำ เล่มหลักสูตรด้วย ปัญญาประดิษฐ์'
})
</script>

<template>
  <header class="app-header">
    <div class="mark">C</div>
    <div class="titles">
      <b>{{ programTitle }}</b>
      <span>{{ programSubtitle }}</span>
    </div>
    <div class="flex-1"></div>
    <div class="save-state hidden md:flex">
      <span class="dot"></span> บันทึกอัตโนมัติแล้ว
    </div>
    <button type="button" class="btn btn-ghost hidden md:flex">
      <UIcon name="i-heroicons-eye" class="w-4 h-4" /> ดูตัวอย่างเล่ม
    </button>
    <button type="button" class="btn btn-brass">
      <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4" /> ส่งออกเป็น Word
    </button>
  </header>
</template>

<style scoped>
/* ==========================================
   🎨 KMUTNB Theme สำหรับ Header
========================================== */
.app-header {
  height: 60px; flex: none; display: flex; align-items: center; gap: 16px;
  padding: 0 24px; 
  background: #2D2D2D; /* สีเทาชาร์โคล (ตัวเดียวกับ Sidebar) */
  border-bottom: 1px solid rgba(255,255,255,.05);
  box-shadow: 0 2px 8px rgba(0,0,0,.15); 
  z-index: 20;
}
.mark {
  width: 32px; height: 32px; 
  border: 2px solid #9C7853; /* สีน้ำตาลพระจอมฯ */
  background: rgba(156, 120, 83, 0.15);
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Noto Serif Thai', serif; font-weight: 700; font-size: 15px; 
  color: #F8F5F0; flex: none;
}
.titles { display: flex; flex-direction: column; line-height: 1.3; overflow: hidden; }
.titles b {
  font-size: 15px; font-weight: 600; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;
  color: #ffffff !important; letter-spacing: 0.02em;
}
.titles span {
  font-size: 12px; color: #9A9A9A !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.save-state { font-size: 13px; color: #EFEFEF !important; align-items: center; gap: 8px; font-weight: 500; margin-right: 12px; }
.save-state .dot {
  width: 7px; height: 7px; border-radius: 50%; background: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
}

.btn {
  border: none; border-radius: 8px; padding: 9px 16px; font-size: 14px; font-weight: 600;
  display: inline-flex; align-items: center; gap: 8px; transition: all .15s ease;
  cursor: pointer;
}
.btn:active { transform: translateY(1px); }

.btn-ghost { background: rgba(255,255,255,.05); color: #DCD7C9 !important; border: 1px solid rgba(255,255,255,.1); }
.btn-ghost:hover { background: rgba(255,255,255,.12); color: #fff !important; }

.btn-brass { background: #9C7853; color: #ffffff !important; }
.btn-brass:hover { background: #7E5F40; box-shadow: 0 4px 12px rgba(156, 120, 83, 0.4); }
</style>