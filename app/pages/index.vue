<!-- pages/index.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const router = useRouter()
const route = useRoute()

// ================= State ข้อมูลฟอร์มหน้าข้อมูลสถาบัน =================
const form = ref({
  id: null as string | number | null, 
  university: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', 
  campus: 'วิทยาลัยเทคโนโลยีอุตสาหกรรม ภาควิชาเทคโนโลยีวิศวกรรมอิเล็กทรอนิกส์'
})

onMounted(() => {
  if (route.query.id) {
    form.value.id = route.query.id as string
  }
})

// ================= ระบบบันทึกข้อมูล (Save System) =================
const isSavingDraft = ref(false)
const isSavingNext = ref(false)

const saveDraft = async () => {
  isSavingDraft.value = true
  await new Promise(r => setTimeout(r, 800))
  if (!form.value.id) form.value.id = 1 
  isSavingDraft.value = false
  alert(`บันทึกฉบับร่างเรียบร้อยแล้ว (Program ID: ${form.value.id})`)
}

const saveAndNext = async () => {
  isSavingNext.value = true
  await new Promise(r => setTimeout(r, 800))
  if (!form.value.id) form.value.id = 1
  isSavingNext.value = false
  router.push({ path: '/number1', query: { id: form.value.id } })
}

const scrollToSec = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    el.classList.add('pulse')
    setTimeout(() => el.classList.remove('pulse'), 1200)
  }
}

// สถานะปุ่ม Checkmark
const isDone = ref(false)
const toggleDone = () => { isDone.value = !isDone.value }
</script>

<template>
  <div class="page-shell">
    <form @submit.prevent>
      
      <!-- Breadcrumb & Title -->
      <div class="crumb">
        <span>เล่มหลักสูตร</span> › <b>ข้อมูลสถาบัน</b>
        <span class="page-badge">หน้า 1 / 9</span>
      </div>
      <div class="doc-head">
        <div class="doc-eyebrow">ข้อมูลสถาบันอุดมศึกษา</div>
        <h1 class="doc-title">ข้อมูลสถาบันอุดมศึกษา</h1>
      </div>

      <!-- TOC Card -->
      <div class="toc-card">
        <div class="toc-label">หัวข้อในหน้านี้ — คลิกเพื่อกระโดดไปยังหัวข้อ</div>
        <div class="toc-grid">
          <div class="toc-item" :class="{ 'filled': isDone }" @click="scrollToSec('sec-inst-1')">
            <div class="toc-dot"></div>
            <span class="lbl">ชื่อสถาบันอุดมศึกษา และ วิทยาเขต/คณะ/ภาควิชา</span>
          </div>
        </div>
      </div>

      <!-- Main Paper Card -->
      <div class="paper-card">
        <section class="topic-sec" id="sec-inst-1">
          <div class="sec-head">
            <h2 class="sec-title">ชื่อสถาบันอุดมศึกษา และ วิทยาเขต/คณะ/ภาควิชา</h2>
            <button type="button" class="sec-check" :class="{ 'on': isDone }" @click="toggleDone">
              {{ isDone ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}
            </button>
          </div>
          <div class="sec-body">
            <div class="fs-grid full">
              <div class="fs-field">
                <label>ชื่อสถาบันอุดมศึกษา</label>
                <!-- บังคับ input ให้เป็น HTML ปกติ ไม่โดน Nuxt UI กวน -->
                <input v-model="form.university" type="text" />
              </div>
              <div class="fs-field">
                <label>วิทยาเขต/คณะ/ภาควิชา</label>
                <input v-model="form.campus" type="text" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Action Footer -->
      <div class="page-footer">
        <button type="button" class="nav-btn" disabled>
          ← <span>ย้อนกลับ</span>
        </button>
        <div class="flex flex-col md:flex-row gap-3">
          <button type="button" @click="saveDraft()" :disabled="isSavingDraft" class="nav-btn">
            <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-1" /> {{ isSavingDraft ? 'กำลังบันทึก...' : 'บันทึกฉบับร่าง' }}
          </button>
          <!-- บังคับปุ่มไปหน้าถัดไปให้เป็นสีกรมท่า ตัวหนังสือสีขาว -->
          <button type="button" @click="saveAndNext()" :disabled="isSavingNext" class="btn-brass" style="border:none;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;cursor:pointer;">
            <span style="color:#ffffff !important;">{{ isSavingNext ? 'กำลังบันทึก...' : 'ข้อมูลทั่วไป' }}</span> <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

    </form>
  </div>
</template>

<style scoped>
/* ================== CSS ถอดแบบ 100% จาก Mockup HTML ================== */
.page-shell { max-width: 900px; margin: 0 auto; width: 100%; }

.crumb { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #736F60; margin-bottom: 14px; }
.crumb b { color: #1B2A4A; font-weight: 600; }
.page-badge { margin-left: auto; font-size: 11px; color: #A8793B; border: 1px solid #EEE0C6; background: #fff; padding: 3px 9px; border-radius: 20px; font-weight: 600; }

.doc-head { margin-bottom: 20px; }
.doc-eyebrow { font-size: 12.5px; color: #A8793B; font-weight: 700; letter-spacing: .03em; margin-bottom: 6px; }
.doc-title { font-size: 25px; font-weight: 600; color: #1B2A4A; margin: 0; font-family: 'Noto Serif Thai', serif; }

.toc-card { background: #fff; border: 1px solid #E3DCC9; border-radius: 10px; box-shadow: 0 18px 40px -18px rgba(27,42,74,.28); padding: 18px 24px 20px; margin-bottom: 18px; }
.toc-label { font-size: 11.5px; color: #A8793B; font-weight: 700; letter-spacing: .04em; margin-bottom: 10px; }
.toc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px,1fr)); gap: 4px 18px; }
.toc-item { display: flex; align-items: center; gap: 9px; padding: 7px 8px; border-radius: 7px; cursor: pointer; font-size: 13px; color: #26241E; border: 1px solid transparent; transition: all 0.2s; }
.toc-item:hover { background: #F3EFE4; }
.toc-dot { width: 7px; height: 7px; border-radius: 50%; background: #E3DCC9; flex: none; transition: background 0.2s; }
.toc-item.filled .toc-dot { background: #3F6B52; }
.toc-item span.lbl { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.paper-card { background: #fff; border: 1px solid #E3DCC9; border-radius: 10px; box-shadow: 0 18px 40px -18px rgba(27,42,74,.28); padding: 8px 42px 20px; position: relative; }

.topic-sec { padding: 26px 0 30px; border-bottom: 1px solid #E3DCC9; position: relative; }
.topic-sec:last-child { border-bottom: none; }
.topic-sec.pulse { animation: pulseSec 1.1s ease; }
@keyframes pulseSec { 0% { background: #EEE0C6; } 100% { background: transparent; } }

.sec-head { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 6px; }
.sec-title { font-size: 16.5px; font-weight: 600; color: #1B2A4A; flex: 1; margin: 0; line-height: 1.4; }
.sec-check { flex: none; border: 1px solid #E3DCC9; background: #fff; color: #736F60; border-radius: 7px; padding: 6px 12px; font-size: 11.8px; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s; }
.sec-check.on { background: #E4EEE7 !important; border-color: #3F6B52 !important; color: #3F6B52 !important; }
.sec-body { padding-left: 0; margin-top: 16px; }

.fs-grid { display: grid; gap: 16px; }
.fs-grid.full { grid-template-columns: 1fr; }
.fs-field label { display: block; font-size: 12.6px; font-weight: 600; color: #1B2A4A; margin-bottom: 6px; }

/* 🌟 บังคับช่อง Input ให้เป็นสีขาวออฟไวท์ตาม Mockup โดยใช้ !important ทลายเฟรมเวิร์ก */
.fs-field input[type=text] { 
  width: 100%; 
  border: 1px solid #E3DCC9 !important; 
  border-radius: 8px !important; 
  padding: 9px 12px !important; 
  font-size: 13.6px !important; 
  background: #FEFDFA !important; 
  color: #26241E !important; 
  font-family: 'Sarabun', sans-serif !important; 
  box-shadow: none !important; 
  transition: all 0.2s; 
}
.fs-field input[type=text]:focus { 
  outline: none !important; 
  border-color: #A8793B !important; 
  box-shadow: 0 0 0 3px #EEE0C6 !important; 
}

.page-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 22px; }
.nav-btn { border: 1px solid #E3DCC9; background: #fff; border-radius: 8px; padding: 10px 16px; font-size: 13px; font-weight: 600; color: #1B2A4A; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
.nav-btn:hover:not([disabled]) { border-color: #A8793B; color: #A8793B; }
.nav-btn[disabled] { opacity: .35; pointer-events: none; }

.btn-brass { background: #1B2A4A; color: #fff !important; transition: all 0.2s; }
.btn-brass:hover { background: #2C3E63; }
</style>