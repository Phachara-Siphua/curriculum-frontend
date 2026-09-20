<!-- pages/number6.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSteps } from '~/constants/toc'
const route = useRoute()
const router = useRouter()

// ===== Focus mode =====
const { isFocused, currentIndex, currentStep, isVisible, focusAnchor, next: nextStep, prev: prevStep, showAll, steps } = useFocusMode(getSteps('6'))

const programId = ref<string | null>(null)

// รายชื่อหัวข้อในหมวดที่ 6
const sectionTitles = [
  "การเตรียมการสำหรับอาจารย์ใหม่",
  "การพัฒนาทักษะการจัดการเรียนการสอน การวัดและการประเมินผล",
  "การพัฒนาวิชาการและวิชาชีพด้านอื่น ๆ"
]

// ================= State ข้อมูลฟอร์ม =================
const form = ref<any>({
  id: null,
  s6_1: '',
  s6_2: [
    'ปฐมนิเทศอาจารย์ใหม่ด้านเทคนิคการสอนและการวัดประเมินผล',
    'ส่งเสริมให้อาจารย์เข้ารับการอบรมด้านการจัดการเรียนรู้ที่เน้นผู้เรียนเป็นศูนย์กลาง (OBE)'
  ],
  s6_3: [
    'ส่งเสริมให้อาจารย์เข้ารับการอบรม/ประชุมวิชาการทั้งในและต่างประเทศ',
    'สนับสนุนทุนการศึกษาต่อและทำวิจัยเพื่อพัฒนาผลงานทางวิชาการ'
  ]
})

// ================= Helper Functions =================
const addList = (key: string) => { form.value[key].push('') }
const removeList = (key: string, idx: number) => {
  form.value[key].splice(idx, 1)
  if (form.value[key].length === 0) form.value[key].push('')
}

const doneState = ref<Record<number, boolean>>({})
const keyToAnchor = (i: number) => 'sec-6-' + (i + 1)
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
const saveAndNext = async () => { isSavingNext.value = true; await new Promise(r => setTimeout(r, 1000)); isSavingNext.value = false; router.push({ path: '/number7', query: { id: programId.value } }) }
</script>

<template>
  <div class="page-shell">
    <form @submit.prevent class="w-full">
      <div class="crumb"><span>เล่มหลักสูตร</span> › <b class="text-[#1B2A4A] font-semibold">หมวดที่ 6</b><span class="page-badge">หน้า 7 / 9</span></div>
      <div class="doc-head"><div class="doc-eyebrow">หมวดที่ 6</div><h1 class="doc-title">การพัฒนาอาจารย์</h1></div>

      <div v-if="!isFocused" class="toc-card">
        <div class="toc-label">หัวข้อในหน้านี้ — คลิกเพื่อเลือกกรอกทีละหัวข้อ</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-[4px_18px]">
          <div v-for="(title, i) in sectionTitles" :key="i" class="toc-item" :class="{ 'filled': doneState[i] }" @click="focusAnchor(`sec-6-${i+1}`)">
            <div class="toc-dot"></div><span class="toc-num">6.{{ i + 1 }}</span><span class="lbl">{{ title }}</span>
          </div>
        </div>
      </div>

      <FocusNav :is-focused="isFocused" :current-index="currentIndex" :total="steps.length" :steps="steps" @show-all="showAll" />

      <div class="paper-card">
        <section v-for="(title, i) in sectionTitles" :key="i" :id="`sec-6-${i+1}`" v-show="isVisible(`sec-6-${i+1}`)" class="topic-sec">
          <div class="sec-head">
            <div class="sec-number">6.{{ i + 1 }}</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <h2 class="sec-title pt-1">{{ title }}</h2>
              <button type="button" class="sec-check" :class="{ 'on': doneState[i] }" @click="toggleDone(i)">{{ doneState[i] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body">
            <template v-if="i === 0">
              <div class="fs-grid full"><div class="fs-field"><textarea v-model="form.s6_1" class="field" placeholder="ระบุการเตรียมการสำหรับอาจารย์ใหม่..."></textarea></div></div>
            </template>
            <template v-else-if="i === 1 || i === 2">
              <div class="list-editor">
                <div class="list-row" v-for="(item, idx) in form[`s6_${i+1}`]" :key="idx">
                  <div class="list-num">{{ idx + 1 }}</div>
                  <input v-model="form[`s6_${i+1}`][idx]" type="text" placeholder="ระบุแนวทางหรือกลยุทธ์..." />
                  <button type="button" class="row-del" @click="removeList(`s6_${i+1}`, idx)">✕</button>
                </div>
                <button type="button" class="add-row" @click="addList(`s6_${i+1}`)">+ เพิ่มรายการ</button>
              </div>
            </template>
          </div>
        </section>
      </div>

      <FocusFooter :is-focused="isFocused" :current-index="currentIndex" :steps="steps" @prev="prevStep" @next="nextStep" />

      <div class="page-footer">
        <button type="button" @click="router.push(`/number5?id=${programId || ''}`)" class="nav-btn">← <span>หลักเกณฑ์ในการประเมินผล</span></button>
        <div class="flex flex-col md:flex-row gap-3">
          <button type="button" @click="saveDraft()" :disabled="isSavingDraft" class="nav-btn"><UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-1" /> {{ isSavingDraft ? 'กำลังบันทึก...' : 'บันทึกฉบับร่าง' }}</button>
          <button type="button" @click="saveAndNext()" :disabled="isSavingNext" class="btn-brass force-white-btn" style="border:none;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;cursor:pointer;">
            <span style="color:#ffffff !important;">{{ isSavingNext ? 'กำลังบันทึก...' : 'หมวดที่ 7 การประกันคุณภาพ' }}</span> <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

