<!-- pages/number5.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSteps } from '~/constants/toc'
const route = useRoute()
const router = useRouter()

// ===== Focus mode =====
const { isFocused, currentIndex, currentStep, isVisible, focusAnchor, next: nextStep, prev: prevStep, showAll, steps } = useFocusMode(getSteps('5'))

const programId = ref<string | null>(null)

// รายชื่อหัวข้อในหมวดที่ 5
const sectionTitles = [
  "กฎระเบียบหรือหลักเกณฑ์ในการให้ระดับคะแนน",
  "การทวนสอบมาตรฐานผลการเรียนรู้ขณะนักศึกษายังไม่สำเร็จการศึกษา",
  "การทวนสอบมาตรฐานผลการเรียนรู้หลังจากนักศึกษาสำเร็จการศึกษา",
  "เกณฑ์การสำเร็จการศึกษาตามหลักสูตร"
]

// ================= State ข้อมูลฟอร์ม =================
const form = ref<any>({
  id: null,
  // 5.1 - 5.3 (Textarea ทั่วไป)
  sections: Array(3).fill(''),
  // 5.4 เกณฑ์การสำเร็จการศึกษา (Dynamic List)
  s5_4: [
    'เป็นไปตามระเบียบมหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ ว่าด้วยการศึกษาระดับปริญญาบัณฑิต',
    'สอบผ่านและมีหน่วยกิตสะสมครบตามโครงสร้างหลักสูตร'
  ]
})

// ================= Helper Functions (List) =================
const addList = (key: string) => { form.value[key].push('') }
const removeList = (key: string, idx: number) => {
  form.value[key].splice(idx, 1)
  if (form.value[key].length === 0) form.value[key].push('')
}

const doneState = ref<Record<number, boolean>>({})
const keyToAnchor = (i: number) => 'sec-5-' + (i + 1)
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
  router.push({ path: '/number6', query: { id: programId.value } })
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
        <span>เล่มหลักสูตร</span> › <b class="text-[#1B2A4A] font-semibold">หมวดที่ 5</b>
        <span class="page-badge">หน้า 6 / 9</span>
      </div>
      <div class="doc-head">
        <div class="doc-eyebrow">หมวดที่ 5</div>
        <h1 class="doc-title">หลักเกณฑ์ในการประเมินผลนักศึกษา</h1>
      </div>

      <!-- TOC Card (ซ่อนตอนอยู่ใน Focus Mode) -->
      <div v-if="!isFocused" class="toc-card">
        <div class="toc-label">หัวข้อในหน้านี้ — คลิกเพื่อเลือกกรอกทีละหัวข้อ</div>
        <div class="grid grid-cols-1 gap-[4px_18px]">
          <div v-for="(title, i) in sectionTitles" :key="i" class="toc-item" :class="{ 'filled': doneState[i] }" @click="focusAnchor(`sec-5-${i+1}`)">
            <div class="toc-dot"></div>
            <span class="toc-num">5.{{ i + 1 }}</span>
            <span class="lbl">{{ title }}</span>
          </div>
        </div>
      </div>

      <!-- Focus Navigation -->
      <FocusNav :is-focused="isFocused" :current-index="currentIndex" :total="steps.length" :steps="steps" @show-all="showAll" />

      <!-- Main Paper Card -->
      <div class="paper-card">
        
        <!-- Loop สร้างทั้ง 4 Section -->
        <section v-for="(title, i) in sectionTitles" :key="i" :id="`sec-5-${i+1}`" v-show="isVisible(`sec-5-${i+1}`)" class="topic-sec">
          
          <div class="sec-head">
            <div class="sec-number text-[#1B2A4A]">5.{{ i + 1 }}</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <h2 class="sec-title pt-1">{{ title }}</h2>
              <button type="button" class="sec-check" :class="{ 'on': doneState[i] }" @click="toggleDone(i)">
                {{ doneState[i] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}
              </button>
            </div>
          </div>

          <div class="sec-body mt-4">
            
            <!-- 🌟 5.4 เกณฑ์การสำเร็จการศึกษา (Dynamic List) -->
            <template v-if="i === 3">
              <div class="list-editor">
                <div class="list-row" v-for="(item, idx) in form.s5_4" :key="idx">
                  <div class="list-num">{{ idx + 1 }}</div>
                  <input v-model="form.s5_4[idx]" type="text" placeholder="ระบุเกณฑ์การสำเร็จการศึกษา..." />
                  <button type="button" class="row-del" @click="removeList('s5_4', idx)">✕</button>
                </div>
                <button type="button" class="add-row" @click="addList('s5_4')">+ เพิ่มเกณฑ์</button>
              </div>
            </template>

            <!-- 🌟 หัวข้อ 5.1 - 5.3 (Textarea ปกติ) -->
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

      <!-- Focus Footer -->
      <FocusFooter :is-focused="isFocused" :current-index="currentIndex" :steps="steps" @prev="prevStep" @next="nextStep" />

      <!-- Action Footer -->
      <div class="page-footer">
        <button type="button" @click="router.push(`/number4?id=${programId || ''}`)" class="nav-btn">
          ← <span>ผลการเรียนรู้ กลยุทธ์การสอน</span>
        </button>
        <div class="flex flex-col md:flex-row gap-3">
          <button type="button" @click="saveDraft()" :disabled="isSavingDraft" class="nav-btn">
            <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-1" /> {{ isSavingDraft ? 'กำลังบันทึก...' : 'บันทึกฉบับร่าง' }}
          </button>
          <button type="button" @click="saveAndNext()" :disabled="isSavingNext" class="btn-brass force-white-btn" style="border:none;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;cursor:pointer;">
            <span style="color:#ffffff !important;">{{ isSavingNext ? 'กำลังบันทึก...' : 'หมวดที่ 6 การพัฒนาอาจารย์' }}</span> <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

    </form>
  </div>
</template>

