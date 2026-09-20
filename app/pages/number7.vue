<!-- pages/number7.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSteps } from '~/constants/toc'
const route = useRoute()
const router = useRouter()

// ===== Focus mode =====
const { isFocused, currentIndex, currentStep, isVisible, focusAnchor, next: nextStep, prev: prevStep, showAll, steps } = useFocusMode(getSteps('7'))

const programId = ref<string | null>(null)

// รายชื่อหัวข้อในหมวดที่ 7
const sectionTitles = [
  "การกำกับมาตรฐาน", "บัณฑิต", "นักศึกษา", "อาจารย์",
  "หลักสูตร การเรียนการสอน การประเมินผู้เรียน", "สิ่งสนับสนุนการเรียนรู้",
  "ตัวบ่งชี้ผลการดำเนินงาน (Key Performance Indicators)"
]

// ================= State ข้อมูลฟอร์ม =================
const form = ref<any>({
  id: null,
  sections: Array(6).fill(''),
  s7_7: [
    { indicator: '1. อาจารย์ประจำหลักสูตรอย่างน้อยร้อยละ 80 มีส่วนร่วมในการประชุมเพื่อวางแผน ติดตาม และทบทวนการดำเนินงานหลักสูตร', y1: '✓', y2: '✓', y3: '✓', y4: '✓', y5: '✓' },
    { indicator: '2. มีรายละเอียดของหลักสูตรตามแบบ มคอ.2 ที่สอดคล้องกับกรอบมาตรฐานคุณวุฒิแห่งชาติ', y1: '✓', y2: '✓', y3: '✓', y4: '✓', y5: '✓' },
    { indicator: '3. มีรายละเอียดของรายวิชาและประสบการณ์ภาคสนาม (OBE 3 / OBE 4) ครบทุกรายวิชาก่อนเปิดสอน', y1: '✓', y2: '✓', y3: '✓', y4: '✓', y5: '✓' },
    { indicator: '4. จัดทำรายงานผลการดำเนินการของรายวิชาและประสบการณ์ภาคสนาม (OBE 5 / OBE 6) ภายใน 30 วัน', y1: '✓', y2: '✓', y3: '✓', y4: '✓', y5: '✓' },
    { indicator: '5. จัดทำรายงานผลการดำเนินการของหลักสูตร (OBE 7) ภายใน 60 วันหลังสิ้นปีการศึกษา', y1: '✓', y2: '✓', y3: '✓', y4: '✓', y5: '✓' },
    { indicator: 'รวมตัวบ่งชี้ (ตัว)', y1: '5', y2: '5', y3: '5', y4: '5', y5: '5' }
  ]
})

// ================= Helper Functions =================
const addTable = (key: string, emptyObj: any) => { form.value[key].push({...emptyObj}) }
const removeTable = (key: string, idx: number, emptyObj: any) => {
  form.value[key].splice(idx, 1)
  if (form.value[key].length === 0) form.value[key].push({...emptyObj})
}

const doneState = ref<Record<number, boolean>>({})
const keyToAnchor = (i: number) => 'sec-7-' + (i + 1)
const toggleDone = (index: number) => { 
  doneState.value[index] = !doneState.value[index]
  if (import.meta.client) {
    localStorage.setItem(`done-${keyToAnchor(index)}`, doneState.value[index] ? '1' : '0')
    window.dispatchEvent(new Event('storage')) 
  }
}

onMounted(() => { 
  if (route.query.id) { 
    programId.value = route.query.id as string
    form.value.id = route.query.id as string 
  } 
  if (!import.meta.client) return
  ;(Object.keys(sectionTitles) as unknown as number[]).forEach((i) => {
    doneState.value[i] = localStorage.getItem(`done-${keyToAnchor(i)}`) === '1'
  })
})

const isSavingDraft = ref(false); const isSavingNext = ref(false)
const saveDraft = async () => { isSavingDraft.value = true; await new Promise(r => setTimeout(r, 1000)); isSavingDraft.value = false; }
const saveAndNext = async () => { isSavingNext.value = true; await new Promise(r => setTimeout(r, 1000)); isSavingNext.value = false; router.push({ path: '/number8', query: { id: programId.value } }) }
</script>

<template>
  <div class="page-shell">
    <form @submit.prevent class="w-full">
      <div class="crumb"><span>เล่มหลักสูตร</span> › <b class="text-[#1B2A4A] font-semibold">หมวดที่ 7</b><span class="page-badge">หน้า 8 / 9</span></div>
      <div class="doc-head"><div class="doc-eyebrow">หมวดที่ 7</div><h1 class="doc-title">การประกันคุณภาพหลักสูตร</h1></div>

      <div v-if="!isFocused" class="toc-card">
        <div class="toc-label">หัวข้อในหน้านี้ — คลิกเพื่อเลือกกรอกทีละหัวข้อ</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-[4px_18px]">
          <div v-for="(title, i) in sectionTitles" :key="i" class="toc-item" :class="{ 'filled': doneState[i] }" @click="focusAnchor(`sec-7-${i+1}`)">
            <div class="toc-dot"></div><span class="toc-num">7.{{ i + 1 }}</span><span class="lbl">{{ title }}</span>
          </div>
        </div>
      </div>

      <FocusNav :is-focused="isFocused" :current-index="currentIndex" :total="steps.length" :steps="steps" @show-all="showAll" />

      <div class="paper-card">
        <section v-for="(title, i) in sectionTitles" :key="i" :id="`sec-7-${i+1}`" v-show="isVisible(`sec-7-${i+1}`)" class="topic-sec">
          <div class="sec-head">
            <div class="sec-number">7.{{ i + 1 }}</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <h2 class="sec-title pt-1">{{ title }}</h2>
              <button type="button" class="sec-check" :class="{ 'on': doneState[i] }" @click="toggleDone(i)">{{ doneState[i] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body">
            <template v-if="i === 6">
              <div class="overflow-x-auto">
                <table class="builder" style="min-width: 800px;">
                  <thead>
                    <tr>
                      <th style="min-width: 300px;">ตัวบ่งชี้ผลการดำเนินงาน</th>
                      <th style="width: 70px;" class="text-center">ปีที่ 1</th><th style="width: 70px;" class="text-center">ปีที่ 2</th>
                      <th style="width: 70px;" class="text-center">ปีที่ 3</th><th style="width: 70px;" class="text-center">ปีที่ 4</th>
                      <th style="width: 70px;" class="text-center">ปีที่ 5</th><th style="width: 40px;"></th>
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
              </div>
              <button type="button" class="add-row mt-2" @click="addTable('s7_7', {indicator:'', y1:'', y2:'', y3:'', y4:'', y5:''})">+ เพิ่มตัวบ่งชี้</button>
            </template>
            <template v-else>
              <div class="fs-grid full"><div class="fs-field"><textarea v-model="form.sections[i]" class="field" :placeholder="`ระบุข้อมูล ${title}...`"></textarea></div></div>
            </template>
          </div>
        </section>
      </div>

      <FocusFooter :is-focused="isFocused" :current-index="currentIndex" :steps="steps" @prev="prevStep" @next="nextStep" />

      <div class="page-footer">
        <button type="button" @click="router.push(`/number6?id=${programId || ''}`)" class="nav-btn">← <span>การพัฒนาอาจารย์</span></button>
        <div class="flex flex-col md:flex-row gap-3">
          <button type="button" @click="saveDraft()" :disabled="isSavingDraft" class="nav-btn"><UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-1" /> {{ isSavingDraft ? 'กำลังบันทึก...' : 'บันทึกฉบับร่าง' }}</button>
          <button type="button" @click="saveAndNext()" :disabled="isSavingNext" class="btn-brass force-white-btn" style="border:none;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;cursor:pointer;">
            <span style="color:#ffffff !important;">{{ isSavingNext ? 'กำลังบันทึก...' : 'หมวดที่ 8 การประเมินฯ' }}</span> <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

