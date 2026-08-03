<!-- pages/number7.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const programId = ref<string | null>(null)

// รายชื่อหัวข้อในหมวดที่ 7
const sectionTitles = [
  "การกำกับมาตรฐาน",
  "บัณฑิต",
  "นักศึกษา",
  "อาจารย์",
  "หลักสูตร การเรียนการสอน การประเมินผู้เรียน",
  "สิ่งสนับสนุนการเรียนรู้",
  "ตัวบ่งชี้ผลการดำเนินงาน (Key Performance Indicators)"
]

// ================= State ข้อมูลฟอร์ม =================
const form = ref<any>({
  id: null,
  // 7.1 - 7.6 (Textarea ทั่วไป)
  sections: Array(6).fill(''),
  // 7.7 ตัวบ่งชี้ผลการดำเนินงาน (Table)
  s7_7: [
    { indicator: '1. อาจารย์ประจำหลักสูตรอย่างน้อยร้อยละ 80 มีส่วนร่วมในการประชุมเพื่อวางแผน ติดตาม และทบทวนการดำเนินงานหลักสูตร', y1: '✓', y2: '✓', y3: '✓', y4: '✓', y5: '✓' },
    { indicator: '2. มีรายละเอียดของหลักสูตรตามแบบ มคอ.2 ที่สอดคล้องกับกรอบมาตรฐานคุณวุฒิแห่งชาติ', y1: '✓', y2: '✓', y3: '✓', y4: '✓', y5: '✓' },
    { indicator: '3. มีรายละเอียดของรายวิชาและประสบการณ์ภาคสนาม (OBE 3 / OBE 4) ครบทุกรายวิชาก่อนเปิดสอน', y1: '✓', y2: '✓', y3: '✓', y4: '✓', y5: '✓' },
    { indicator: '4. จัดทำรายงานผลการดำเนินการของรายวิชาและประสบการณ์ภาคสนาม (OBE 5 / OBE 6) ภายใน 30 วัน', y1: '✓', y2: '✓', y3: '✓', y4: '✓', y5: '✓' },
    { indicator: '5. จัดทำรายงานผลการดำเนินการของหลักสูตร (OBE 7) ภายใน 60 วันหลังสิ้นปีการศึกษา', y1: '✓', y2: '✓', y3: '✓', y4: '✓', y5: '✓' },
    { indicator: 'รวมตัวบ่งชี้ (ตัว)', y1: '5', y2: '5', y3: '5', y4: '5', y5: '5' }
  ]
})

// ================= Helper Functions (Table) =================
const addTable = (key: string, emptyObj: any) => { form.value[key].push({...emptyObj}) }
const removeTable = (key: string, idx: number, emptyObj: any) => {
  form.value[key].splice(idx, 1)
  if (form.value[key].length === 0) form.value[key].push({...emptyObj})
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
  router.push({ path: '/number8', query: { id: programId.value } })
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
        <span>เล่มหลักสูตร</span> › <b class="text-[#1B2A4A] font-semibold">หมวดที่ 7</b>
        <span class="page-badge">หน้า 8 / 9</span>
      </div>
      <div class="doc-head">
        <div class="doc-eyebrow">หมวดที่ 7</div>
        <h1 class="doc-title">การประกันคุณภาพหลักสูตร</h1>
      </div>

      <!-- TOC Card -->
      <div class="toc-card">
        <div class="toc-label">หัวข้อในหน้านี้ — คลิกเพื่อกระโดดไปยังหัวข้อ</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-[4px_18px]">
          <div v-for="(title, i) in sectionTitles" :key="i" class="toc-item" :class="{ 'filled': doneState[i] }" @click="scrollToSec(`sec-7-${i+1}`)">
            <div class="toc-dot"></div>
            <span class="toc-num">7.{{ i + 1 }}</span>
            <span class="lbl">{{ title }}</span>
          </div>
        </div>
      </div>

      <!-- Main Paper Card -->
      <div class="paper-card">
        
        <!-- Loop สร้างทั้ง 7 Section -->
        <section v-for="(title, i) in sectionTitles" :key="i" :id="`sec-7-${i+1}`" class="topic-sec">
          
          <div class="sec-head">
            <div class="sec-number">7.{{ i + 1 }}</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <h2 class="sec-title pt-1">{{ title }}</h2>
              <button type="button" class="sec-check" :class="{ 'on': doneState[i] }" @click="toggleDone(i)">
                {{ doneState[i] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}
              </button>
            </div>
          </div>

          <div class="sec-body">
            
            <!-- 🌟 7.7 ตัวบ่งชี้ผลการดำเนินงาน (Table) -->
            <template v-if="i === 6">
              <table class="builder">
                <thead>
                  <tr>
                    <th style="min-width: 300px;">ตัวบ่งชี้ผลการดำเนินงาน</th>
                    <th style="width: 70px;" class="text-center">ปีที่ 1</th>
                    <th style="width: 70px;" class="text-center">ปีที่ 2</th>
                    <th style="width: 70px;" class="text-center">ปีที่ 3</th>
                    <th style="width: 70px;" class="text-center">ปีที่ 4</th>
                    <th style="width: 70px;" class="text-center">ปีที่ 5</th>
                    <th style="width: 40px;"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, idx) in form.s7_7" :key="idx">
                    <td><input v-model="row.indicator" type="text" placeholder="ระบุตัวบ่งชี้..."></td>
                    <td><input v-model="row.y1" type="text" class="text-center" placeholder="✓ หรือ -"></td>
                    <td><input v-model="row.y2" type="text" class="text-center" placeholder="✓ หรือ -"></td>
                    <td><input v-model="row.y3" type="text" class="text-center" placeholder="✓ หรือ -"></td>
                    <td><input v-model="row.y4" type="text" class="text-center" placeholder="✓ หรือ -"></td>
                    <td><input v-model="row.y5" type="text" class="text-center" placeholder="✓ หรือ -"></td>
                    <td><button type="button" class="table-del" @click="removeTable('s7_7', idx, {indicator:'', y1:'', y2:'', y3:'', y4:'', y5:''})">✕</button></td>
                  </tr>
                </tbody>
              </table>
              <button type="button" class="add-row" @click="addTable('s7_7', {indicator:'', y1:'', y2:'', y3:'', y4:'', y5:''})">+ เพิ่มตัวบ่งชี้</button>
            </template>

            <!-- 🌟 หัวข้อ 7.1 - 7.6 (Textarea ปกติ) -->
            <template v-else>
              <div class="fs-grid full">
                <div class="fs-field">
                  <textarea v-model="form.sections[i]" class="field" :placeholder="`ระบุข้อมูล ${title}...`"></textarea>
                </div>
              </div>
            </template>

          </div>
        </section>

      </div>

      <!-- Action Footer -->
      <div class="page-footer">
        <button type="button" @click="router.push(`/number6?id=${programId || ''}`)" class="nav-btn">
          ← <span>การพัฒนาอาจารย์</span>
        </button>
        <div class="flex flex-col md:flex-row gap-3">
          <button type="button" @click="saveDraft()" :disabled="isSavingDraft" class="nav-btn">
            <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-1" /> {{ isSavingDraft ? 'กำลังบันทึก...' : 'บันทึกฉบับร่าง' }}
          </button>
          <button type="button" @click="saveAndNext()" :disabled="isSavingNext" class="btn-brass force-white-btn" style="border:none;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;cursor:pointer;">
            <span style="color:#ffffff !important;">{{ isSavingNext ? 'กำลังบันทึก...' : 'หมวดที่ 8 การประเมินและปรับปรุงฯ' }}</span> <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-white" />
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
.sec-number { font-family: 'Noto Serif Thai', serif; font-weight: 700; color: #A8793B; font-size: 17px; min-width: 32px; flex: none; }
.sec-title { font-size: 16.5px; font-weight: 600; color: #1B2A4A; flex: 1; margin: 0; line-height: 1.4; }
.sec-check { flex: none; border: 1px solid #E3DCC9; background: #fff; color: #736F60; border-radius: 7px; padding: 6px 12px; font-size: 11.8px; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s; }
.sec-check.on { background: #E4EEE7 !important; border-color: #3F6B52 !important; color: #3F6B52 !important; }
.sec-body { padding-left: 44px; }
@media (max-width:720px){ .sec-body { padding-left: 0; } }

.fs-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
.fs-field label { display: block; font-size: 12.6px; font-weight: 600; color: #1B2A4A; margin-bottom: 6px; }

textarea.field {
  width: 100%; border: 1px solid #E3DCC9 !important; border-radius: 8px !important; 
  padding: 9px 12px !important; font-size: 13.6px !important; background: #FEFDFA !important; 
  color: #26241E !important; font-family: 'Sarabun', sans-serif !important; box-shadow: none !important; min-height: 100px; resize: vertical; line-height: 1.7; transition: all 0.2s; 
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

.btn-brass { background: #1B2A4A; transition: all 0.2s; }
.btn-brass:hover { background: #2C3E63; }
</style>