<!-- pages/index.vue -->
<script setup lang="ts">
import { ref } from 'vue'
const router = useRouter()

// สร้างหลักสูตรใหม่
const createNewProgram = () => {
  const newMockId = 'new_' + Date.now()
  router.push(`/number1?id=${newMockId}&type=new`)
}

// สร้างหลักสูตรปรับปรุง 
const createRevisedProgram = () => {
  const reviseMockId = 'rev_' + Date.now()
  router.push(`/number1?id=${reviseMockId}&type=revise&ref=101`)
}

// เปิดหลักสูตรที่ทำค้างไว้
const openDraft = (id: string) => {
  router.push(`/number1?id=${id}`)
}

// 🌟 ข้อมูลจำลอง: รายการหลักสูตรที่ทำค้างไว้ (Recent Drafts)
const recentDrafts = ref([
  { 
    id: 'draft-001', 
    name: 'วิศวกรรมศาสตรบัณฑิต สาขาวิชาเทคโนโลยีวิศวกรรมอิเล็กทรอนิกส์', 
    type: 'หลักสูตรปรับปรุง', 
    year: '2565', 
    lastEdited: '2 ชั่วโมงที่แล้ว', 
    status: 'กำลังจัดทำ (ฉบับร่าง)', 
    progress: 45 
  },
  { 
    id: 'draft-002', 
    name: 'วิทยาศาสตรบัณฑิต สาขาวิทยาการข้อมูลและการวิเคราะห์', 
    type: 'หลักสูตรใหม่', 
    year: '2566', 
    lastEdited: '1 วันที่แล้ว', 
    status: 'รอตรวจสอบ', 
    progress: 100 
  }
])

// 🌟 ข้อมูลจำลอง: ไฟล์อ้างอิงและหลักสูตรต้นฉบับ
const referenceFiles = ref([
  { 
    id: 'f1', 
    name: 'แบบ-ล.2-แบบฟอร์มจัดทำหลักสูตร_OBE2_V19.pdf', 
    size: '7.7 MB', 
    date: '06/07/2569',
    url: '/pdf/แบบ-ล.2-แบบฟอร์มจัดทำหลักสูตร_OBE2_V19.pdf' // ชี้ไปที่โฟลเดอร์ pdf ที่อยู่ใน public
  },
  { 
    id: 'f2', 
    name: 'มคอ.2_EnET_ปรับปรุง2565 (final).pdf', 
    size: '7.9 MB', 
    date: '06/07/2569',
    url: '/pdf/มคอ.2_EnET_ปรับปรุง2565 (final).pdf'
  },
  { 
    id: 'f3', 
    name: 'มคอ.2_อสบ_ปรับปรุง2565 (v14) (1).pdf', 
    size: '9.9 MB', 
    date: '06/07/2569',
    url: '/pdf/มคอ.2_อสบ_ปรับปรุง2565 (v14) (1).pdf'
  }
])
</script>

<template>
  <div class="dashboard-shell flex flex-col items-center pt-12 md:pt-20 min-h-full w-full px-4 pb-24">
    
    <!-- 🌟 ส่วนที่ 1: Header & ปุ่มสร้างหลักสูตร -->
    <div class="w-full max-w-4xl">
      <div class="text-center mb-10">
        <div class="main-logo mx-auto mb-6">C</div>
        <h1 class="text-[var(--fs-h1)] font-bold text-[var(--c-primary)] font-serif">เริ่มต้นจัดทำ เล่มหลักสูตร</h1>
        <p class="text-[var(--fs-input)] text-[var(--c-text-muted)] mt-2">สร้างหลักสูตรใหม่ หรือเลือกทำต่อจากฉบับร่างที่คุณบันทึกไว้</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-14">
        <button type="button" @click="createNewProgram" class="action-card group">
          <div class="icon-wrap bg-[#E8F5E9] text-[#2E7D32] group-hover:bg-[#2E7D32] group-hover:text-white">
            <UIcon name="i-heroicons-plus-circle" class="w-10 h-10 transition-colors" />
          </div>
          <h2 class="title">สร้างหลักสูตรใหม่</h2>
          <p class="desc">เริ่มต้นร่างหลักสูตรใหม่ทั้งหมดตั้งแต่ศูนย์ เหมาะสำหรับหลักสูตรที่เพิ่งเปิดสอนใหม่</p>
        </button>

        <button type="button" @click="createRevisedProgram" class="action-card group">
          <div class="icon-wrap bg-[var(--c-gold-light)] text-[var(--c-gold)] group-hover:bg-[var(--c-gold)] group-hover:text-white">
            <UIcon name="i-heroicons-document-duplicate" class="w-10 h-10 transition-colors" />
          </div>
          <h2 class="title">หลักสูตรปรับปรุง</h2>
          <p class="desc">คัดลอกข้อมูลจากโครงสร้างหลักสูตรเดิมในระบบ เพื่อนำมาปรับปรุงแก้ไขสำหรับรอบปีใหม่</p>
        </button>
      </div>
    </div>

    <!-- 🌟 ส่วนที่ 2: รายการหลักสูตรที่เปิดล่าสุด (Recent Drafts) -->
    <div class="w-full max-w-4xl mb-12">
      <div class="flex items-center justify-between mb-4 border-b border-[var(--c-border)] pb-2">
        <h3 class="text-[16px] font-bold text-[var(--c-primary)] flex items-center gap-2">
          <UIcon name="i-heroicons-clock" class="w-5 h-5 text-[var(--c-gold)]" /> เปิดใช้งานล่าสุด
        </h3>
        <button type="button" class="text-[13px] text-[var(--c-gold)] hover:underline font-medium">ดูทั้งหมด</button>
      </div>

      <div class="flex flex-col gap-3">
        <div v-for="draft in recentDrafts" :key="draft.id" @click="openDraft(draft.id)" class="draft-item group">
          <div class="flex items-start md:items-center justify-between w-full flex-col md:flex-row gap-4">
            <div class="flex items-start gap-4 flex-1">
              <div class="mt-1 w-10 h-10 rounded-lg bg-[var(--c-bg-input)] border border-[var(--c-border)] flex items-center justify-center text-[var(--c-text-muted)] group-hover:border-[var(--c-gold)] group-hover:text-[var(--c-gold)] transition-colors flex-none">
                <UIcon name="i-heroicons-document-text" class="w-6 h-6" />
              </div>
              <div>
                <h4 class="text-[15px] font-bold text-[var(--c-primary)] mb-1 group-hover:text-[var(--c-gold)] transition-colors line-clamp-1">{{ draft.name }}</h4>
                <div class="flex flex-wrap items-center gap-3 text-[12px] text-[var(--c-text-muted)]">
                  <span class="bg-[#F8F5F0] px-2 py-0.5 rounded text-[var(--c-gold)] border border-[var(--c-gold-light)]">{{ draft.type }} ปี {{ draft.year }}</span>
                  <span class="flex items-center gap-1"><UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" /> แก้ไขล่าสุด {{ draft.lastEdited }}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end pl-14 md:pl-0 border-t border-[var(--c-border)] md:border-none pt-3 md:pt-0">
              <div class="w-24">
                <div class="flex justify-between text-[11px] mb-1 font-medium">
                  <span :class="draft.progress === 100 ? 'text-[#2E7D32]' : 'text-[var(--c-primary)]'">{{ draft.status }}</span>
                  <span class="text-[var(--c-text-muted)]">{{ draft.progress }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div class="h-1.5 rounded-full" :class="draft.progress === 100 ? 'bg-[#4CAF50]' : 'bg-[var(--c-gold)]'" :style="{ width: draft.progress + '%' }"></div>
                </div>
              </div>
              <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-300 group-hover:text-[var(--c-gold)] transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 🌟 ส่วนที่ 3: ไฟล์เอกสารอ้างอิง (PDF Files) -->
    <div class="w-full max-w-4xl">
      <div class="flex items-center justify-between mb-4 border-b border-[var(--c-border)] pb-2">
        <h3 class="text-[16px] font-bold text-[var(--c-primary)] flex items-center gap-2">
          <UIcon name="i-heroicons-folder-open" class="w-5 h-5 text-[var(--c-gold)]" /> เอกสารอ้างอิงและต้นฉบับ
        </h3>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="file in referenceFiles" :key="file.id" class="file-card group">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 flex-none rounded bg-[#FFEBEE] text-[#E53935] flex items-center justify-center">
              <!-- ไอคอน PDF สีแดง -->
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-[13px] font-bold text-[var(--c-primary)] mb-1 truncate" :title="file.name">{{ file.name }}</h4>
              <div class="flex items-center justify-between text-[11px] text-[var(--c-text-muted)]">
                <span>{{ file.size }}</span>
                <span>อัปเดต: {{ file.date }}</span>
              </div>
            </div>
          </div>
          <!-- ปุ่มดาวน์โหลดจะโผล่มาตอนเอาเมาส์ชี้ -->
          <div class="mt-3 pt-3 border-t border-[var(--c-border)] flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
            <a :href="file.url" target="_blank" download class="text-[12px] font-bold text-[var(--c-gold)] hover:underline flex items-center gap-1">
              <UIcon name="i-heroicons-arrow-down-tray" class="w-3.5 h-3.5" /> ดาวน์โหลด
            </a>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
.dashboard-shell {
  font-family: 'Sarabun', sans-serif;
  animation: fadeIn 0.4s ease-out;
}

.main-logo {
  width: 80px; 
  height: 80px; 
  border: 3.5px solid var(--c-primary); 
  background: rgba(61, 61, 61, 0.06); 
  border-radius: 16px;
  display: flex; 
  align-items: center; 
  justify-content: center;
  font-family: 'Noto Serif Thai', serif; 
  font-weight: 700; 
  font-size: 42px; 
  color: var(--c-primary); 
}

.action-card {
  background: var(--c-bg-card);
  border: 1.5px solid var(--c-border);
  border-radius: 16px;
  padding: 28px 24px;
  text-align: left;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.action-card:hover {
  border-color: var(--c-gold);
  box-shadow: 0 12px 24px rgba(156, 120, 83, 0.12);
  transform: translateY(-4px);
}

.icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.action-card .title {
  font-size: 20px;
  font-weight: 700;
  color: var(--c-primary);
  margin-bottom: 8px;
  font-family: 'Noto Serif Thai', serif;
}

.action-card .desc {
  font-size: 13px;
  color: var(--c-text-muted);
  line-height: 1.5;
}

.draft-item {
  background: #ffffff;
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
}

.draft-item:hover {
  border-color: var(--c-gold-light);
  box-shadow: 0 6px 16px rgba(156, 120, 83, 0.08);
  transform: translateY(-2px);
}

/* 🌟 สไตล์การ์ดสำหรับไฟล์ PDF อ้างอิง */
.file-card {
  background: #ffffff;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  padding: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
}
.file-card:hover {
  border-color: var(--c-gold);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>