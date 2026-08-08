<!-- pages/number8.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const programId = ref<string | null>(null)

// รายชื่อหัวข้อในหมวดที่ 8
const sectionTitles = [
  "การประเมินกลยุทธ์การสอน",
  "การประเมินทักษะของอาจารย์ในการใช้แผนกลยุทธ์การสอน",
  "การประเมินหลักสูตรในภาพรวม",
  "การประเมินผลการดำเนินงานตามรายละเอียดหลักสูตร",
  "การทบทวนผลการประเมินและวางแผนปรับปรุง"
]

// ================= State ข้อมูลฟอร์ม =================
const form = ref<any>({
  id: null,
  // 8.2 - 8.5 (Textarea ทั่วไป)
  sections: Array(5).fill(''),
  // 8.1 การประเมินกลยุทธ์การสอน (Dynamic List)
  s8_1: [
    'มีการประเมินการสอนทุกรายวิชาโดยนักศึกษา เพื่อพัฒนาการเรียนการสอน',
    'มีการประเมินจากการทดสอบย่อย การสังเกตพฤติกรรมนักศึกษา และการอภิปรายโต้ตอบในชั้นเรียน',
    'มีการทดสอบกลางภาคและปลายภาคเพื่อชี้วัดความเข้าใจของผู้เรียน'
  ]
})

// ================= Helper Functions (List) =================
const addList = (key: string) => { form.value[key].push('') }
const removeList = (key: string, idx: number) => {
  form.value[key].splice(idx, 1)
  if (form.value[key].length === 0) form.value[key].push('')
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
  router.push({ path: '/appendix/a', query: { id: programId.value } })
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
        <span>เล่มหลักสูตร</span> › <b class="text-[#1B2A4A] font-semibold">หมวดที่ 8</b>
        <span class="page-badge">หน้า 9 / 9</span>
      </div>
      <div class="doc-head">
        <div class="doc-eyebrow">หมวดที่ 8</div>
        <h1 class="doc-title">การประเมินและปรับปรุงการดำเนินการของหลักสูตร</h1>
      </div>

      <!-- TOC Card -->
      <div class="toc-card">
        <div class="toc-label">หัวข้อในหน้านี้ — คลิกเพื่อกระโดดไปยังหัวข้อ</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-[4px_18px]">
          <div v-for="(title, i) in sectionTitles" :key="i" class="toc-item" :class="{ 'filled': doneState[i] }" @click="scrollToSec(`sec-8-${i+1}`)">
            <div class="toc-dot"></div>
            <span class="toc-num">8.{{ i + 1 }}</span>
            <span class="lbl">{{ title }}</span>
          </div>
        </div>
      </div>

      <!-- Main Paper Card -->
      <div class="paper-card">
        
        <!-- Loop สร้างทั้ง 5 Section -->
        <section v-for="(title, i) in sectionTitles" :key="i" :id="`sec-8-${i+1}`" class="topic-sec">
          
          <div class="sec-head">
            <div class="sec-number">8.{{ i + 1 }}</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <h2 class="sec-title pt-1">{{ title }}</h2>
              <button type="button" class="sec-check" :class="{ 'on': doneState[i] }" @click="toggleDone(i)">
                {{ doneState[i] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}
              </button>
            </div>
          </div>

          <div class="sec-body">
            
            <!-- 🌟 8.1 การประเมินกลยุทธ์การสอน (Dynamic List) -->
            <template v-if="i === 0">
              <div class="list-editor">
                <div class="list-row" v-for="(item, idx) in form.s8_1" :key="idx">
                  <div class="list-num">{{ idx + 1 }}</div>
                  <input v-model="form.s8_1[idx]" type="text" placeholder="ระบุการประเมินกลยุทธ์การสอน..." />
                  <button type="button" class="row-del" @click="removeList('s8_1', idx)">✕</button>
                </div>
                <button type="button" class="add-row" @click="addList('s8_1')">+ เพิ่มรายการ</button>
              </div>
            </template>

            <!-- 🌟 หัวข้อ 8.2 - 8.5 (Textarea ปกติ) -->
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
        <button type="button" @click="router.push(`/number7?id=${programId || ''}`)" class="nav-btn">
          ← <span>การประกันคุณภาพหลักสูตร</span>
        </button>
        <div class="flex flex-col md:flex-row gap-3">
          <button type="button" @click="saveDraft()" :disabled="isSavingDraft" class="nav-btn">
            <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-1" /> {{ isSavingDraft ? 'กำลังบันทึก...' : 'บันทึกฉบับร่าง' }}
          </button>
          <button type="button" @click="saveAndNext()" :disabled="isSavingNext" class="btn-brass force-white-btn" style="border:none;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;cursor:pointer;">
            <span style="color:#ffffff !important;">{{ isSavingNext ? 'กำลังบันทึก...' : 'ภาคผนวก ก. แผนภูมิความต่อเนื่องฯ' }}</span> <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-white" />
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

/* Dynamic List Editor */
.list-editor .list-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 9px; }
.list-num { width: 24px; height: 24px; flex: none; margin-top: 3px; border-radius: 50%; background: #F3EFE4; display: flex; align-items: center; justify-content: center; font-size: 11.5px; font-weight: 700; color: #1B2A4A; font-family: 'Noto Serif Thai', serif; }
.list-row input { flex: 1; border: 1px solid #E3DCC9 !important; border-radius: 7px !important; padding: 9px 12px !important; font-size: 13.8px !important; background: #FEFDFA !important; box-shadow: none !important; outline: none !important; }
.list-row input:focus { border-color: #A8793B !important; box-shadow: 0 0 0 3px #EEE0C6 !important; }
.row-del { width: 30px; height: 30px; flex: none; border: 1px solid #E3DCC9; background: #fff; border-radius: 7px; color: #9C4132; font-size: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
.row-del:hover { background: #FBECE8; }
.add-row { margin-top: 6px; border: 1px dashed #C9BFA2; background: #FDFBF4; color: #A8793B; border-radius: 7px; padding: 8px 14px; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: 0.2s; }
.add-row:hover { background: #EEE0C6; }

.page-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 22px; }
.nav-btn { border: 1px solid #E3DCC9; background: #fff; border-radius: 8px; padding: 10px 16px; font-size: 13px; font-weight: 600; color: #1B2A4A; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
.nav-btn:hover:not([disabled]) { border-color: #A8793B; color: #A8793B; }
.nav-btn[disabled] { opacity: .35; pointer-events: none; }

.btn-brass { background: #1B2A4A; transition: all 0.2s; }
.btn-brass:hover { background: #2C3E63; }
</style>