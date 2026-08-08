<!-- pages/appendix/h.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const programId = ref<string | null>(null)

// รายชื่อหัวข้อในภาคผนวก ซ.
const sectionTitles = [
  "คำชี้แจง",
  "ตารางแจกแจงรายวิชาเทียบกับองค์ความรู้ที่สภาวิศวกรกำหนด"
]

// ================= State ข้อมูลฟอร์ม =================
const form = ref<any>({
  id: null,
  
  // ซ.1 คำชี้แจง
  sH_1: 'แสดงความสอดคล้องระหว่างรายวิชาในหลักสูตรกับองค์ความรู้ที่สภาวิศวกรกำหนด สำหรับการขอรับใบอนุญาตประกอบวิชาชีพวิศวกรรมควบคุม',

  // ซ.2 ตารางแจกแจงรายวิชา
  sH_2: [
    { code: '030413100', name: 'การวิเคราะห์วงจรไฟฟ้า 1', knowledge: 'วงจรไฟฟ้า (Electrical Circuits)' },
    { code: '030513120', name: 'สัญญาณและระบบ', knowledge: 'สัญญาณและระบบ (Signals and Systems)' },
    { code: '030413145', name: 'สนามแม่เหล็กไฟฟ้า', knowledge: 'สนามแม่เหล็กไฟฟ้า (Electromagnetic Fields)' }
  ]
})

// ================= Helper Functions =================
const addTable = () => { 
  form.value.sH_2.push({ code: '', name: '', knowledge: '' }) 
}
const removeTable = (idx: number) => {
  form.value.sH_2.splice(idx, 1)
  if (form.value.sH_2.length === 0) form.value.sH_2.push({ code: '', name: '', knowledge: '' })
}

const doneState = ref<Record<number, boolean>>({})
const toggleDone = (index: number) => { doneState.value[index] = !doneState.value[index] }

onMounted(() => { 
  if (route.query.id) { 
    programId.value = route.query.id as string
    form.value.id = route.query.id as string 
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
  // เนื่องจากเป็นหน้าสุดท้าย ให้พากลับไปหน้าแรก หรือหน้า Dashboard
  router.push({ path: '/', query: { id: programId.value } })
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
        <span>เล่มหลักสูตร</span> › <b>ภาคผนวก</b> › <b class="text-[#1B2A4A] font-semibold">ภาคผนวก ซ.</b>
      </div>
      <div class="doc-head">
        <div class="doc-eyebrow">ภาคผนวก ซ.</div>
        <h1 class="doc-title">ตารางแจกแจงรายวิชาเทียบกับองค์ความรู้ที่สภาวิศวกรกำหนด</h1>
      </div>

      <!-- TOC Card -->
      <div class="toc-card">
        <div class="toc-label">หัวข้อในหน้านี้ — คลิกเพื่อกระโดดไปยังหัวข้อ</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-[4px_18px]">
          <div v-for="(title, i) in sectionTitles" :key="i" class="toc-item" :class="{ 'filled': doneState[i] }" @click="scrollToSec(`app-ซ-${i+1}`)">
            <div class="toc-dot"></div>
            <span class="toc-num">ซ.{{ i + 1 }}</span>
            <span class="lbl">{{ title }}</span>
          </div>
        </div>
      </div>

      <!-- Main Paper Card -->
      <div class="paper-card">
        
        <!-- ซ.1 คำชี้แจง -->
        <section class="topic-sec" id="app-ซ-1">
          <div class="sec-head">
            <div class="sec-number text-[#1B2A4A]">ซ.1</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <h2 class="sec-title pt-1">{{ sectionTitles[0] }}</h2>
              <button type="button" class="sec-check" :class="{ 'on': doneState[0] }" @click="toggleDone(0)">
                {{ doneState[0] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}
              </button>
            </div>
          </div>
          <div class="sec-body mt-4">
            <div class="fs-grid full">
              <div class="fs-field">
                <textarea v-model="form.sH_1" class="field" placeholder="ระบุคำชี้แจง..." style="min-height: 80px;"></textarea>
              </div>
            </div>
          </div>
        </section>

        <!-- ซ.2 ตารางเปรียบเทียบ -->
        <section class="topic-sec" id="app-ซ-2">
          <div class="sec-head">
            <div class="sec-number text-[#1B2A4A]">ซ.2</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <h2 class="sec-title pt-1">{{ sectionTitles[1] }}</h2>
              <button type="button" class="sec-check" :class="{ 'on': doneState[1] }" @click="toggleDone(1)">
                {{ doneState[1] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}
              </button>
            </div>
          </div>
          <div class="sec-body mt-4">
            <table class="builder">
              <thead>
                <tr>
                  <th style="width: 25%;">รหัสวิชา</th>
                  <th style="width: 35%;">ชื่อวิชา</th>
                  <th>องค์ความรู้ตามเกณฑ์สภาวิศวกร</th>
                  <th style="width: 40px;"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, idx) in form.sH_2" :key="idx">
                  <td><input v-model="row.code" type="text" placeholder="ระบุรหัสวิชา..."></td>
                  <td><input v-model="row.name" type="text" placeholder="ระบุชื่อวิชา..."></td>
                  <td><input v-model="row.knowledge" type="text" placeholder="ระบุองค์ความรู้..."></td>
                  <td><button type="button" class="table-del" @click="removeTable(idx)">✕</button></td>
                </tr>
              </tbody>
            </table>
            <button type="button" class="add-row mt-2" @click="addTable()">+ เพิ่มแถว</button>
          </div>
        </section>

      </div>

      <!-- Action Footer -->
      <div class="page-footer">
        <button type="button" @click="router.push(`/appendix/g?id=${programId || ''}`)" class="nav-btn">
          ← <span>ภาคผนวก ช. ตารางเปรียบเทียบมาตรฐานฯ</span>
        </button>
        <div class="flex flex-col md:flex-row gap-3">
          <button type="button" @click="saveDraft()" :disabled="isSavingDraft" class="nav-btn">
            <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-1" /> {{ isSavingDraft ? 'กำลังบันทึก...' : 'บันทึกฉบับร่าง' }}
          </button>
          <button type="button" @click="saveAndNext()" :disabled="isSavingNext" class="btn-brass force-white-btn" style="border:none;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;cursor:pointer;background-color:#3F6B52;">
            <span style="color:#ffffff !important;">{{ isSavingNext ? 'กำลังบันทึก...' : 'เสร็จสิ้น / บันทึกข้อมูลทั้งหมด' }}</span> <UIcon name="i-heroicons-check-circle" class="w-4 h-4 text-white" />
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
.toc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px,1fr)); gap: 4px 18px; }
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
.sec-body { padding-left: 44px; }
@media (max-width:720px){ .sec-body { padding-left: 0; } }

.fs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.fs-grid.full { grid-template-columns: 1fr; }
.fs-field label { display: block; font-size: 12.6px; font-weight: 600; color: #1B2A4A; margin-bottom: 6px; }

/* Textarea */
textarea.field {
  width: 100%; border: 1px solid #E3DCC9 !important; border-radius: 8px !important; 
  padding: 9px 12px !important; font-size: 13.6px !important; background: #FEFDFA !important; 
  color: #26241E !important; font-family: 'Sarabun', sans-serif !important; box-shadow: none !important; transition: all 0.2s; 
}
textarea.field:focus { outline: none !important; border-color: #A8793B !important; box-shadow: 0 0 0 3px #EEE0C6 !important; }

/* Table Builder */
table.builder { width: 100%; border-collapse: collapse; margin-top: 4px; }
table.builder th { background: #1B2A4A; color: #EFE7D6; font-size: 12.3px; font-weight: 600; text-align: left; padding: 9px 12px; border: 1px solid #1B2A4A; }
table.builder td { border: 1px solid #E3DCC9; padding: 5px 6px; }
table.builder td input { width: 100%; border: 1px solid transparent !important; background: transparent !important; padding: 6px 8px !important; font-size: 13.4px !important; border-radius: 5px !important; }
table.builder td input:focus { outline: none !important; border-color: #A8793B !important; background: #EEE0C6 !important; }
table.builder tr:nth-child(even) td { background: #FCFAF4; }
.table-del { border: none; background: none; color: #9C4132; font-size: 14px; width: 100%; text-align: center; cursor: pointer;}
.add-row { margin-top: 6px; border: 1px dashed #C9BFA2; background: #FDFBF4; color: #A8793B; border-radius: 7px; padding: 8px 14px; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: 0.2s; }
.add-row:hover { background: #EEE0C6; }

.page-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 22px; }
.nav-btn { border: 1px solid #E3DCC9; background: #fff; border-radius: 8px; padding: 10px 16px; font-size: 13px; font-weight: 600; color: #1B2A4A; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
.nav-btn:hover:not([disabled]) { border-color: #A8793B; color: #A8793B; }
.nav-btn[disabled] { opacity: .35; pointer-events: none; }

.btn-brass { transition: all 0.2s; }
.btn-brass:hover { filter: brightness(1.1); }
</style>