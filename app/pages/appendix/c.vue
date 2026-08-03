<!-- pages/appendix/c.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const programId = ref<string | null>(null)

// รายชื่อหัวข้อในภาคผนวก ค.
const sectionTitles = [
  "สำเนาคำสั่งแต่งตั้งคณะกรรมการพัฒนาหลักสูตร"
]

const doneState = ref<Record<number, boolean>>({})
const toggleDone = (index: number) => { doneState.value[index] = !doneState.value[index] }

// Mock สำหรับการอัปโหลดไฟล์
const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFile = ref<File | null>(null)

const triggerUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    uploadedFile.value = target.files[0]
  }
}

const removeFile = () => {
  uploadedFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

onMounted(() => { 
  if (route.query.id) { 
    programId.value = route.query.id as string
  } 
})

const isSavingDraft = ref(false)
const isSavingNext = ref(false)

const saveDraft = async () => { 
  isSavingDraft.value = true
  await new Promise(r => setTimeout(r, 1000))
  isSavingDraft.value = false 
}

const saveAndNext = async () => { 
  isSavingNext.value = true
  await new Promise(r => setTimeout(r, 1000))
  isSavingNext.value = false 
  router.push({ path: '/appendix/d', query: { id: programId.value } })
}

const scrollToSec = (id: string) => {
  const el = document.getElementById(id)
  if (el) { 
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    el.classList.add('pulse')
    setTimeout(() => el.classList.remove('pulse'), 1200) 
  }
}
</script>

<template>
  <div class="page-shell">
    <form @submit.prevent class="w-full">
      
      <!-- Breadcrumb & Title -->
      <div class="crumb">
        <span>เล่มหลักสูตร</span> › <b>ภาคผนวก</b> › <b class="text-[#1B2A4A] font-semibold">ภาคผนวก ค.</b>
      </div>
      <div class="doc-head">
        <div class="doc-eyebrow">ภาคผนวก ค.</div>
        <h1 class="doc-title">สำเนาคำสั่งแต่งตั้งคณะกรรมการพัฒนาหลักสูตร</h1>
      </div>

      <!-- TOC Card -->
      <div class="toc-card">
        <div class="toc-label">หัวข้อในหน้านี้ — คลิกเพื่อกระโดดไปยังหัวข้อ</div>
        <div class="grid grid-cols-1 gap-[4px_18px]">
          <div class="toc-item" :class="{ 'filled': doneState[0] }" @click="scrollToSec('app-ค-1')">
            <div class="toc-dot"></div>
            <span class="toc-num">ค.1</span>
            <span class="lbl">{{ sectionTitles[0] }}</span>
          </div>
        </div>
      </div>

      <!-- Main Paper Card -->
      <div class="paper-card">
        
        <section class="topic-sec" id="app-ค-1">
          <div class="sec-head">
            <div class="sec-number text-[#1B2A4A]">ค.1</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <h2 class="sec-title pt-1">{{ sectionTitles[0] }}</h2>
              <button type="button" class="sec-check" :class="{ 'on': doneState[0] }" @click="toggleDone(0)">
                {{ doneState[0] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}
              </button>
            </div>
          </div>
          <div class="sec-body mt-4">
            
            <!-- 🌟 Upload Box -->
            <input type="file" ref="fileInput" class="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" @change="handleFileUpload" />
            
            <div v-if="!uploadedFile" class="upload-box cursor-pointer hover:bg-[#F3EFE4] transition-colors" @click="triggerUpload">
              <b>ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</b>
              รองรับ PDF, DOCX, JPG — ใช้สำหรับเอกสารแนบที่ไม่ต้องพิมพ์เนื้อหาในระบบ
            </div>

            <!-- แสดงเมื่อมีไฟล์อัปโหลดแล้ว -->
            <div v-else class="flex items-center justify-between p-4 bg-[#FDFBF4] border border-[#A8793B] rounded-[10px]">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-[#EEE0C6] text-[#A8793B] flex items-center justify-center">
                  <UIcon name="i-heroicons-document-text" class="w-6 h-6" />
                </div>
                <div>
                  <p class="font-semibold text-[#1B2A4A] m-0 text-[14px]">{{ uploadedFile.name }}</p>
                  <p class="text-[#736F60] text-[12px] m-0">{{ (uploadedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
                </div>
              </div>
              <button type="button" class="text-[#9C4132] hover:bg-[#FBECE8] p-2 rounded-md transition-colors" @click="removeFile">
                <UIcon name="i-heroicons-trash" class="w-5 h-5 block" />
              </button>
            </div>

          </div>
        </section>

      </div>

      <!-- Action Footer -->
      <div class="page-footer">
        <button type="button" @click="router.push(`/appendix/b?id=${programId || ''}`)" class="nav-btn">
          ← <span>ภาคผนวก ข. รหัสวิชา/ปริญญา</span>
        </button>
        <div class="flex flex-col md:flex-row gap-3">
          <button type="button" @click="saveDraft()" :disabled="isSavingDraft" class="nav-btn">
            <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-1" /> {{ isSavingDraft ? 'กำลังบันทึก...' : 'บันทึกฉบับร่าง' }}
          </button>
          <button type="button" @click="saveAndNext()" :disabled="isSavingNext" class="btn-brass force-white-btn" style="border:none;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;cursor:pointer;">
            <span style="color:#ffffff !important;">{{ isSavingNext ? 'กำลังบันทึก...' : 'ภาคผนวก ง. ระเบียบมหาวิทยาลัย' }}</span> <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

    </form>
  </div>
</template>

<style scoped>
/* ================== CSS สไตล์เดียวกับหน้าอื่นเพื่อความต่อเนื่อง ================== */
.force-white-btn { color: #ffffff !important; }

.page-shell { max-width: 900px; margin: 0 auto; width: 100%; }

.crumb { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #736F60; margin-bottom: 14px; }
.crumb b { color: #1B2A4A; font-weight: 600; }
.page-badge { margin-left: auto; font-size: 11px; color: #A8793B; border: 1px solid #EEE0C6; background: #fff; padding: 3px 9px; border-radius: 20px; font-weight: 600; }

.doc-head { margin-bottom: 20px; }
.doc-eyebrow { font-size: 12.5px; color: #A8793B; font-weight: 700; letter-spacing: .03em; margin-bottom: 6px; }
.doc-title { font-size: 25px; font-weight: 600; color: #1B2A4A; margin: 0; font-family: 'Noto Serif Thai', serif; }

.toc-card { background: #fff; border: 1px solid #E3DCC9; border-radius: 10px; box-shadow: 0 18px 40px -18px rgba(27,42,74,.28); padding: 18px 24px 20px; margin-bottom: 18px; }
.toc-label { font-size: 11.5px; color: #A8793B; font-weight: 700; letter-spacing: .04em; margin-bottom: 10px; }
.toc-item { display: flex; align-items: center; gap: 9px; padding: 7px 8px; border-radius: 7px; cursor: pointer; font-size: 13px; color: #26241E; border: 1px solid transparent; transition: all 0.2s; }
.toc-item:hover { background: #F3EFE4; }
.toc-num { font-family: 'Noto Serif Thai', serif; font-weight: 700; color: #A8793B; font-size: 12.5px; min-width: 24px; flex: none; }
.toc-dot { width: 7px; height: 7px; border-radius: 50%; background: #E3DCC9; flex: none; transition: background 0.2s; }
.toc-item.filled .toc-dot { background: #3F6B52; }
.toc-item span.lbl { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.paper-card { background: #fff; border: 1px solid #E3DCC9; border-radius: 10px; box-shadow: 0 18px 40px -18px rgba(27,42,74,.28); padding: 8px 42px 20px; position: relative; }

.topic-sec { padding: 26px 0 30px; border-bottom: 1px solid #E3DCC9; position: relative; }
.topic-sec:last-child { border-bottom: none; }
.topic-sec.pulse { animation: pulseSec 1.1s ease; }
@keyframes pulseSec { 0% { background: #EEE0C6; } 100% { background: transparent; } }

.sec-head { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 6px; }
.sec-number { font-family: 'Noto Serif Thai', serif; font-weight: 700; color: #1B2A4A; font-size: 17px; min-width: 32px; flex: none; }
.sec-title { font-size: 16.5px; font-weight: 600; color: #1B2A4A; flex: 1; margin: 0; line-height: 1.4; }
.sec-check { flex: none; border: 1px solid #E3DCC9; background: #fff; color: #736F60; border-radius: 7px; padding: 6px 12px; font-size: 11.8px; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s; }
.sec-check.on { background: #E4EEE7 !important; border-color: #3F6B52 !important; color: #3F6B52 !important; }

/* Upload Box แบบใน Mockup */
.upload-box {
  border: 1.6px dashed #C9BFA2;
  border-radius: 10px;
  padding: 30px 20px;
  text-align: center;
  color: #736F60;
  background: #FDFBF4;
  font-size: 13.3px;
}
.upload-box b {
  display: block;
  color: #1B2A4A;
  font-size: 14px;
  margin-bottom: 4px;
}

.page-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 22px; }
.nav-btn { border: 1px solid #E3DCC9; background: #fff; border-radius: 8px; padding: 10px 16px; font-size: 13px; font-weight: 600; color: #1B2A4A; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
.nav-btn:hover:not([disabled]) { border-color: #A8793B; color: #A8793B; }
.nav-btn[disabled] { opacity: .35; pointer-events: none; }

.btn-brass { background: #1B2A4A; transition: all 0.2s; }
.btn-brass:hover { background: #2C3E63; }
</style>