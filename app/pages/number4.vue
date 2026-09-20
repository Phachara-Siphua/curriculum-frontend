<!-- pages/number4.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSteps } from '~/constants/toc'
const route = useRoute()
const router = useRouter()

// ===== Focus mode =====
const { isFocused, currentIndex, currentStep, isVisible, focusAnchor, next: nextStep, prev: prevStep, showAll, steps } = useFocusMode(getSteps('4'))

const programId = ref<string | null>(null)

// รายชื่อหัวข้อทั้ง 12 หัวข้อของหมวด 4
const sectionTitles = [
  "การพัฒนาคุณลักษณะพิเศษของนักศึกษา",
  "การพัฒนาผลการเรียนรู้ด้านคุณธรรม จริยธรรม",
  "การพัฒนาผลการเรียนรู้ด้านความรู้",
  "การพัฒนาผลการเรียนรู้ด้านทักษะทางปัญญา",
  "การพัฒนาผลการเรียนรู้ด้านทักษะความสัมพันธ์ระหว่างบุคคลและความรับผิดชอบ",
  "การพัฒนาผลการเรียนรู้ด้านทักษะการวิเคราะห์เชิงตัวเลข การสื่อสาร และการใช้เทคโนโลยีสารสนเทศ",
  "ผลการเรียนรู้ในตารางของรายวิชา มีความหมายดังนี้",
  "ผลการเรียนรู้ที่คาดหวัง (ELO) ของหลักสูตรตามกรอบมาตรฐาน",
  "ผลการเรียนรู้ที่คาดหวังหลัก",
  "ผลการเรียนรู้ที่คาดหวังเฉพาะแขนงวิชา",
  "ตารางแสดงความสัมพันธ์ระหว่างผลการเรียนรู้ตาม TQF กับ ELO",
  "แผนที่แสดงการกระจายความรับผิดชอบมาตรฐานผลการเรียนรู้จากหลักสูตรสู่รายวิชา (Curriculum Mapping)"
]

const uid = () => Math.random().toString(36).substring(2, 9)

// ================= State ข้อมูลฟอร์ม =================
const form = ref<any>({
  id: null,
  s4_1: [{ trait: '', strategy: '' }],
  s4_2: { outcomes: '', strategy: '', assessment: '' },
  s4_3: { outcomes: '', strategy: '', assessment: '' },
  s4_4: { outcomes: '', strategy: '', assessment: '' },
  s4_5: { outcomes: '', strategy: '', assessment: '' },
  s4_6: { outcomes: '', strategy: '', assessment: '' },
  s4_7: { d1: '', d2: '', d3: '', d4: '', d5: '' },
  s4_8: '',
  s4_9: [{ code: '', type: '', desc: '' }],
  s4_10: [{ code: '', branch: '', desc: '' }],
  s4_11: [{ code: '', d1: '', d2: '', d3: '', d4: '', d5: '' }],
  mapState: {} as Record<string, string>,
  
  // 🎯 เปลี่ยนเป็น Dynamic Array สำหรับ 4.12
  mapCourseGroups: [
    {
      group: 'ก. กลุ่มวิชาภาษา (หมวดวิชาศึกษาทั่วไป)',
      courses: [
        { _id: uid(), code: '080103001', nameTh: 'ภาษาอังกฤษ 1', nameEn: 'English I', credits: '3(3-0-6)' },
        { _id: uid(), code: '080103002', nameTh: 'ภาษาอังกฤษ 2', nameEn: 'English II', credits: '3(3-0-6)' }
      ]
    },
    {
      group: 'ก. กลุ่มวิชาแกน (หมวดวิชาเฉพาะ)',
      courses: [
        { _id: uid(), code: '040203111', nameTh: 'คณิตศาสตร์วิศวกรรม 1', nameEn: 'Engineering Mathematics I', credits: '3(3-0-6)' },
        { _id: uid(), code: '030413100', nameTh: 'การวิเคราะห์วงจรไฟฟ้า 1', nameEn: 'Electric Circuit Analysis I', credits: '3(3-0-6)' }
      ]
    }
  ]
})

const eloTypes = ['S — เฉพาะทาง (Specific)', 'G — ทั่วไป (General)']
const branchOptions = ['แขนงวิชาโทรคมนาคม (T)', 'แขนงวิชาคอมพิวเตอร์ (C)', 'แขนงวิชาเครื่องมือวัดและควบคุม (I)', 'แขนงวิชาการกระจายเสียงวิทยุและโทรทัศน์ (B)']

// ================= AI Integration =================
const handleAIGenerate = (section: string, payload?: any) => {
  console.log('Trigger AI Generation for:', section, payload)
  alert(`กำลังเรียกใช้ AI สำหรับหมวด: ${section}\n(รอ Backend เชื่อมต่อ API)`)
}

// ================= Helper Functions =================
const addList = (key: string, emptyObj: any) => { form.value[key].push({...emptyObj}) }
const removeList = (key: string, idx: number, emptyObj: any) => { 
  form.value[key].splice(idx, 1); 
  if (form.value[key].length === 0) form.value[key].push({...emptyObj}) 
}

const doneState = ref<Record<number, boolean>>({})
const keyToAnchor = (i: number) => 'sec-4-' + (i + 1)
const toggleDone = (index: number) => { 
  doneState.value[index] = !doneState.value[index]
  if (import.meta.client) {
    localStorage.setItem(`done-${keyToAnchor(index)}`, doneState.value[index] ? '1' : '0')
    window.dispatchEvent(new Event('storage')) 
  }
}

onMounted(() => { 
  if (route.query.id) { programId.value = route.query.id as string; form.value.id = route.query.id as string }
  if (!import.meta.client) return
  ;(Object.keys(sectionTitles) as unknown as number[]).forEach((i) => {
    doneState.value[i] = localStorage.getItem(`done-${keyToAnchor(i)}`) === '1'
  })
})

const isSavingDraft = ref(false); const isSavingNext = ref(false)
const saveDraft = async () => { isSavingDraft.value = true; await new Promise(r => setTimeout(r, 1000)); isSavingDraft.value = false; }
const saveAndNext = async () => { isSavingNext.value = true; await new Promise(r => setTimeout(r, 1000)); isSavingNext.value = false; router.push({ path: '/number5', query: { id: programId.value } }) }

const scrollToSec = (id: string) => {
  const el = document.getElementById(id)
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.classList.add('pulse'); setTimeout(() => el.classList.remove('pulse'), 1200) }
}

// ================= 4.12 Curriculum Mapping Logic =================
const MAP_DOMAINS = [
  {id:'d1', label:'1. คุณธรรม จริยธรรม'}, {id:'d2', label:'2. ความรู้'}, {id:'d3', label:'3. ทักษะทางปัญญา'},
  {id:'d4', label:'4. ทักษะความสัมพันธ์'}, {id:'d5', label:'5. ทักษะวิเคราะห์เชิงตัวเลขฯ'}
]
const MAP_SUBCOLS = [1,2,3,4,5]

const cycleCell = (key: string) => {
  const cur = form.value.mapState[key] || '';
  form.value.mapState[key] = cur === '' ? 'o' : cur === 'o' ? 'r' : '';
}

// เพิ่ม/ลบ กลุ่มและรายวิชา
const addMappingGroup = () => {
  form.value.mapCourseGroups.push({ group: '', courses: [{ _id: uid(), code: '', nameTh: '', nameEn: '', credits: '' }] })
}
const removeMappingGroup = (gIdx: number) => {
  form.value.mapCourseGroups.splice(gIdx, 1)
  if (form.value.mapCourseGroups.length === 0) addMappingGroup()
}
const addCourseToMapping = (gIdx: number) => {
  form.value.mapCourseGroups[gIdx].courses.push({ _id: uid(), code: '', nameTh: '', nameEn: '', credits: '' })
}
const removeCourseFromMapping = (gIdx: number, cIdx: number) => {
  form.value.mapCourseGroups[gIdx].courses.splice(cIdx, 1)
  if (form.value.mapCourseGroups[gIdx].courses.length === 0) addCourseToMapping(gIdx)
}
</script>

<template>
  <div class="page-shell">
    <form @submit.prevent class="w-full">
      
      <!-- Breadcrumb & Title -->
      <div class="crumb">
        <span>เล่มหลักสูตร</span> › <b class="text-[#1B2A4A] font-semibold">หมวดที่ 4</b>
        <span class="page-badge">หน้า 5 / 9</span>
      </div>
      <div class="doc-head">
        <div class="doc-eyebrow">หมวดที่ 4</div>
        <h1 class="doc-title">ผลการเรียนรู้ กลยุทธ์การสอนและการประเมินผล</h1>
      </div>

      <!-- TOC Card (ซ่อนตอนอยู่ใน Focus Mode) -->
      <div v-if="!isFocused" class="toc-card">
        <div class="toc-label">หัวข้อในหน้านี้ — คลิกเพื่อเลือกกรอกทีละหัวข้อ (รวม 12 หัวข้อ)</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-[4px_18px]">
          <div v-for="(title, i) in sectionTitles" :key="i" class="toc-item" :class="{ 'filled': doneState[i] }" @click="focusAnchor(`sec-4-${i+1}`)">
            <div class="toc-dot"></div>
            <span class="toc-num">4.{{ i + 1 }}</span>
            <span class="lbl">{{ title }}</span>
          </div>
        </div>
      </div>

      <!-- Focus Navigation -->
      <FocusNav :is-focused="isFocused" :current-index="currentIndex" :total="steps.length" :steps="steps" @show-all="showAll" />

      <!-- Main Paper Card -->
      <div class="paper-card">
        
        <!-- 4.1 การพัฒนาคุณลักษณะพิเศษ -->
        <section class="topic-sec" id="sec-4-1" v-show="isVisible('sec-4-1')">
          <div class="sec-head">
            <div class="sec-number">4.1</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">{{ sectionTitles[0] }}</h2>
                <span class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState[0] }" @click="toggleDone(0)">{{ doneState[0] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body md:pl-[56px] mt-4 md:mt-0">
            <div v-for="(item, idx) in form.s4_1" :key="idx" class="slist-item">
              <div class="slist-num">{{ idx + 1 }}</div>
              <div class="slist-fields fs-grid full">
                <div class="fs-field"><label>คุณลักษณะพิเศษ</label><textarea v-model="item.trait" class="field" style="min-height:60px"></textarea></div>
                <div class="fs-field"><label>กลยุทธ์หรือกิจกรรมของนักศึกษา</label><textarea v-model="item.strategy" class="field" style="min-height:60px"></textarea></div>
              </div>
              <button type="button" class="slist-del" @click="removeList('s4_1', idx, {trait:'', strategy:''})">✕</button>
            </div>
            <button type="button" class="add-row" @click="addList('s4_1', {trait:'', strategy:''})">+ เพิ่มรายการ</button>
          </div>
        </section>

        <!-- 4.2 - 4.6 โดเมนการเรียนรู้ทั้ง 5 ด้าน -->
        <section v-for="i in 5" :key="i" :id="`sec-4-${i+1}`" v-show="isVisible(`sec-4-${i+1}`)" class="topic-sec">
          <div class="sec-head">
            <div class="sec-number">4.{{ i+1 }}</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <h2 class="sec-title pt-1">{{ sectionTitles[i] }}</h2>
              <button type="button" class="sec-check" :class="{ 'on': doneState[i] }" @click="toggleDone(i)">{{ doneState[i] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body">
            <div class="fs-grid full">
              <div class="fs-field"><label>ผลการเรียนรู้ที่คาดหวังด้านนี้</label><textarea v-model="form[`s4_${i+1}`].outcomes" class="field" style="min-height:80px"></textarea></div>
              <div class="fs-field"><label>กลยุทธ์การสอนที่ใช้พัฒนาการเรียนรู้</label><textarea v-model="form[`s4_${i+1}`].strategy" class="field" style="min-height:80px"></textarea></div>
              <div class="fs-field"><label>กลยุทธ์การประเมินผลการเรียนรู้</label><textarea v-model="form[`s4_${i+1}`].assessment" class="field" style="min-height:80px"></textarea></div>
            </div>
          </div>
        </section>

        <!-- 4.7 ความหมายในตารางรายวิชา -->
        <section class="topic-sec" id="sec-4-7" v-show="isVisible('sec-4-7')">
          <div class="sec-head">
            <div class="sec-number">4.7</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <h2 class="sec-title pt-1">{{ sectionTitles[6] }}</h2>
              <button type="button" class="sec-check" :class="{ 'on': doneState[6] }" @click="toggleDone(6)">{{ doneState[6] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <p class="sec-hint">คำอธิบายความหมายของตัวเลข 1-5 ในแต่ละด้าน ที่ปรากฏในตาราง Curriculum Mapping</p>
          <div class="sec-body">
            <div class="fs-grid full">
              <div class="fs-field" v-for="d in 5" :key="d">
                <label>{{ d }}. {{ MAP_DOMAINS[d-1].label.split('. ')[1] }}</label>
                <textarea v-model="(form.s4_7 as any)[`d${d}`]" class="field" style="min-height:60px"></textarea>
              </div>
            </div>
          </div>
        </section>

        <!-- 4.8 ELO ตามกรอบมาตรฐาน (มีปุ่ม AI) -->
        <section class="topic-sec border-l-4 border-l-[#A8793B] pl-[20px] -ml-[24px] bg-[#FDFBF4]" id="sec-4-8" v-show="isVisible('sec-4-8')">
          <div class="sec-head">
            <div class="sec-number">4.8</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">{{ sectionTitles[7] }}</h2>
                <span class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState[7] }" @click="toggleDone(7)">{{ doneState[7] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body md:pl-[56px] mt-4 md:mt-0">
            <div class="fs-grid full">
              <div class="fs-field">
                <textarea v-model="form.s4_8" class="field bg-white" style="min-height: 80px;"></textarea>
                <button type="button" class="ai-btn mt-2" @click="handleAIGenerate('elo_standard')"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> AI ช่วยร่าง ELO มาตรฐาน</button>
              </div>
            </div>
          </div>
        </section>

        <!-- 4.9 ผลการเรียนรู้ที่คาดหวังหลัก (มีปุ่ม AI) -->
        <section class="topic-sec border-l-4 border-l-[#A8793B] pl-[20px] -ml-[24px] bg-[#FDFBF4]" id="sec-4-9" v-show="isVisible('sec-4-9')">
          <div class="sec-head">
            <div class="sec-number">4.9</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">{{ sectionTitles[8] }}</h2>
                <span class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState[8] }" @click="toggleDone(8)">{{ doneState[8] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body md:pl-[56px] mt-4 md:mt-0">
            <div v-for="(item, idx) in form.s4_9" :key="idx" class="slist-item !bg-white">
              <div class="slist-num">{{ idx + 1 }}</div>
              <div class="slist-fields fs-grid">
                <div class="fs-field"><label>รหัส ELO</label><input v-model="item.code" type="text" class="!bg-[#FEFDFA]" placeholder="เช่น ELO1"/></div>
                <div class="fs-field"><label>ประเภท</label>
                  <select v-model="item.type" class="!bg-[#FEFDFA]"><option value="" disabled>-- เลือกประเภท --</option><option v-for="t in eloTypes" :key="t" :value="t">{{ t }}</option></select>
                </div>
                <div class="fs-field" style="grid-column: 1 / -1;"><label>รายละเอียด</label><textarea v-model="item.desc" class="field !bg-[#FEFDFA]" style="min-height:60px"></textarea></div>
              </div>
              <button type="button" class="slist-del" @click="removeList('s4_9', idx, {code:'', type:'', desc:''})">✕</button>
            </div>
            <button type="button" class="add-row" @click="addList('s4_9', {code:'', type:'', desc:''})">+ เพิ่ม ELO หลัก</button>
            <button type="button" class="ai-btn ml-2" @click="handleAIGenerate('elo_main')"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> AI ช่วยคิด ELO หลัก</button>
          </div>
        </section>

        <!-- 4.10 ผลการเรียนรู้ที่คาดหวังเฉพาะแขนง (มีปุ่ม AI) -->
        <section class="topic-sec border-l-4 border-l-[#A8793B] pl-[20px] -ml-[24px] bg-[#FDFBF4]" id="sec-4-10" v-show="isVisible('sec-4-10')">
          <div class="sec-head">
            <div class="sec-number">4.10</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">{{ sectionTitles[9] }}</h2>
                <span class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState[9] }" @click="toggleDone(9)">{{ doneState[9] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body md:pl-[56px] mt-4 md:mt-0">
            <div v-for="(item, idx) in form.s4_10" :key="idx" class="slist-item !bg-white">
              <div class="slist-num">{{ idx + 1 }}</div>
              <div class="slist-fields fs-grid">
                <div class="fs-field"><label>รหัส ELO</label><input v-model="item.code" type="text" class="!bg-[#FEFDFA]" placeholder="เช่น ELO T.1"/></div>
                <div class="fs-field"><label>แขนงวิชา</label>
                  <select v-model="item.branch" class="!bg-[#FEFDFA]"><option value="" disabled>-- เลือกแขนง --</option><option v-for="b in branchOptions" :key="b" :value="b">{{ b }}</option></select>
                </div>
                <div class="fs-field" style="grid-column: 1 / -1;"><label>รายละเอียด</label><textarea v-model="item.desc" class="field !bg-[#FEFDFA]" style="min-height:60px"></textarea></div>
              </div>
              <button type="button" class="slist-del" @click="removeList('s4_10', idx, {code:'', branch:'', desc:''})">✕</button>
            </div>
            <button type="button" class="add-row" @click="addList('s4_10', {code:'', branch:'', desc:''})">+ เพิ่ม ELO เฉพาะแขนง</button>
            <button type="button" class="ai-btn ml-2" @click="handleAIGenerate('elo_branch')"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> AI ช่วยคิด ELO แขนงวิชา</button>
          </div>
        </section>

        <!-- 4.11 ตารางความสัมพันธ์ TQF กับ ELO -->
        <section class="topic-sec" id="sec-4-11" v-show="isVisible('sec-4-11')">
          <div class="sec-head">
            <div class="sec-number">4.11</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <h2 class="sec-title pt-1">{{ sectionTitles[10] }}</h2>
              <button type="button" class="sec-check" :class="{ 'on': doneState[10] }" @click="toggleDone(10)">{{ doneState[10] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body">
            <div class="overflow-x-auto">
              <table class="builder" style="min-width: 800px;">
                <thead>
                  <tr>
                    <th rowspan="2">รหัส ELO</th>
                    <th colspan="5" class="text-center">ผลการเรียนรู้ตามกรอบมาตรฐานฯ (TQF)</th>
                    <th rowspan="2" style="width:40px"></th>
                  </tr>
                  <tr>
                    <th style="font-size: 11px;">1.คุณธรรมจริยธรรม</th><th style="font-size: 11px;">2.ความรู้</th><th style="font-size: 11px;">3.ทักษะทางปัญญา</th>
                    <th style="font-size: 11px;">4.ความสัมพันธ์ฯ</th><th style="font-size: 11px;">5.วิเคราะห์เชิงตัวเลขฯ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, idx) in form.s4_11" :key="idx">
                    <td><input v-model="row.code" type="text" placeholder="ELO1"></td>
                    <td><input v-model="row.d1" type="text" class="text-center"></td>
                    <td><input v-model="row.d2" type="text" class="text-center"></td>
                    <td><input v-model="row.d3" type="text" class="text-center"></td>
                    <td><input v-model="row.d4" type="text" class="text-center"></td>
                    <td><input v-model="row.d5" type="text" class="text-center"></td>
                    <td><button type="button" class="table-del" @click="removeList('s4_11', idx, {code:'',d1:'',d2:'',d3:'',d4:'',d5:''})">✕</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button type="button" class="add-row mt-2" @click="addList('s4_11', {code:'',d1:'',d2:'',d3:'',d4:'',d5:''})">+ เพิ่มแถว</button>
          </div>
        </section>

        <!-- 4.12 Curriculum Mapping (มีปุ่ม AI และเพิ่มแถว/กลุ่มได้) -->
        <section class="topic-sec border-l-4 border-l-[#A8793B] pl-[20px] -ml-[24px] bg-[#FDFBF4]" id="sec-4-12" v-show="isVisible('sec-4-12')">
          <div class="sec-head">
            <div class="sec-number">4.12</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">{{ sectionTitles[11] }}</h2>
                <span class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState[11] }" @click="toggleDone(11)">{{ doneState[11] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="pl-0 md:pl-[56px] mt-4">
            
            <div class="map-legend">
              <div class="it"><div class="chip r">●</div> ความรับผิดชอบหลัก</div>
              <div class="it"><div class="chip i">○</div> ความรับผิดชอบรอง</div>
              <div class="it text-[#736F60]">คลิกที่ช่องตารางเพื่อสลับสถานะ: ว่าง → ○ → ● → ว่าง</div>
            </div>

            <button type="button" class="ai-btn mb-4" @click="handleAIGenerate('curriculum_mapping')"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> AI ช่วยประเมินและทำ Mapping อัตโนมัติ</button>

            <div class="map-scroll custom-scrollbar">
              <table class="mapping">
                <thead>
                  <tr class="domain-row">
                    <th class="corner course-meta" rowspan="2">รหัส / ชื่อวิชา (ไทย-อังกฤษ) / หน่วยกิต</th>
                    <th v-for="d in MAP_DOMAINS" :key="d.id" :colspan="MAP_SUBCOLS.length">{{ d.label }}</th>
                  </tr>
                  <tr class="sub-row">
                    <template v-for="d in MAP_DOMAINS" :key="'sub'+d.id">
                      <th v-for="n in MAP_SUBCOLS" :key="n">{{ n }}</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(grp, gIdx) in form.mapCourseGroups" :key="gIdx">
                    
                    <!-- ส่วนชื่อกลุ่ม -->
                    <tr class="group-row">
                      <th :colspan="MAP_DOMAINS.length * MAP_SUBCOLS.length + 1" class="relative group !p-0">
                        <input v-model="grp.group" class="w-full bg-transparent border-none outline-none text-white font-bold px-[14px] py-[7px] focus:bg-white/10 transition-colors" placeholder="ชื่อกลุ่มวิชา..." />
                        <button @click="removeMappingGroup(gIdx)" type="button" class="absolute right-2 top-1/2 -translate-y-1/2 text-red-300 hover:text-red-100 text-xs hidden group-hover:block transition-colors">✕ ลบกลุ่ม</button>
                      </th>
                    </tr>
                    
                    <!-- ส่วนรายวิชาในกลุ่ม -->
                    <tr v-for="(c, cIdx) in grp.courses" :key="c._id">
                      <th class="course-meta relative group">
                        <div class="flex flex-col pr-6">
                          <input v-model="c.nameTh" placeholder="ชื่อวิชา (ไทย)" class="mapping-input text-[13px] font-semibold text-[#1B2A4A]" />
                          <div class="flex gap-2">
                            <input v-model="c.code" placeholder="รหัสวิชา" class="mapping-input text-[11.5px] font-normal text-[#736F60] w-1/3" />
                            <input v-model="c.nameEn" placeholder="ชื่อวิชา (Eng)" class="mapping-input text-[11.5px] font-normal text-[#736F60] w-2/3" />
                          </div>
                          <input v-model="c.credits" placeholder="หน่วยกิต" class="mapping-input text-[11.5px] font-normal text-[#736F60]" />
                        </div>
                        <button @click="removeCourseFromMapping(gIdx, cIdx)" type="button" class="absolute right-1 top-2 text-[#9C4132] hover:bg-[#FBECE8] rounded p-1 hidden group-hover:block transition-colors" title="ลบวิชา"><UIcon name="i-heroicons-x-mark" class="w-4 h-4" /></button>
                      </th>
                      
                      <!-- ส่วนคลิกจุด -->
                      <template v-for="d in MAP_DOMAINS" :key="'td'+d.id">
                        <td v-for="n in MAP_SUBCOLS" :key="'td'+d.id+'-'+n">
                          <button type="button" class="cell-btn" :class="form.mapState[`${c._id}|${d.id}-${n}`] || ''" @click="cycleCell(`${c._id}|${d.id}-${n}`)"></button>
                        </td>
                      </template>
                    </tr>
                    
                    <!-- แถวสำหรับปุ่มเพิ่มวิชา -->
                    <tr>
                      <th class="bg-[#FCFAF4] border-r border-[#E3DCC9] p-2 text-center">
                        <button type="button" @click="addCourseToMapping(gIdx)" class="text-[12px] text-[#A8793B] font-semibold hover:underline">+ เพิ่มวิชาในกลุ่มนี้</button>
                      </th>
                      <td :colspan="MAP_DOMAINS.length * MAP_SUBCOLS.length" class="bg-[#FCFAF4]"></td>
                    </tr>

                  </template>
                </tbody>
              </table>
            </div>

            <button type="button" class="add-row mt-3" @click="addMappingGroup()">+ เพิ่มกลุ่มวิชาใหม่</button>

          </div>
        </section>

      </div>

      <!-- Focus Footer -->
      <FocusFooter :is-focused="isFocused" :current-index="currentIndex" :steps="steps" @prev="prevStep" @next="nextStep" />

      <!-- Action Footer -->
      <div class="page-footer">
        <button type="button" @click="router.push(`/number3?id=${programId || ''}`)" class="nav-btn">
          ← <span>ระบบการจัดการศึกษา โครงสร้าง</span>
        </button>
        <div class="flex flex-col md:flex-row gap-3">
          <button type="button" @click="saveDraft()" :disabled="isSavingDraft" class="nav-btn">
            <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-1" /> {{ isSavingDraft ? 'กำลังบันทึก...' : 'บันทึกฉบับร่าง' }}
          </button>
          <button type="button" @click="saveAndNext()" :disabled="isSavingNext" class="btn-brass force-white-btn" style="border:none;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;cursor:pointer;">
            <span style="color:#ffffff !important;">{{ isSavingNext ? 'กำลังบันทึก...' : 'หลักเกณฑ์ในการประเมินผล' }}</span> <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

    </form>
  </div>
</template>

<style scoped>
/* ---------- MAPPING (ใช้เฉพาะหน้า 4) ---------- */
.map-legend { display: flex; gap: 18px; flex-wrap: wrap; margin-bottom: 16px; font-size: var(--fs-hint); color: var(--c-text-muted); }
.map-legend .it { display: flex; align-items: center; gap: 7px; }
.chip { width: 22px; height: 22px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; border: 1px solid var(--c-border); }
.chip.r { background: var(--c-primary); color: #fff; border-color: var(--c-primary); }
.chip.i { background: var(--c-gold-light); color: var(--c-gold); border-color: var(--c-gold); }
.map-scroll { overflow: auto; border: 1px solid var(--c-border); border-radius: 10px; max-height: 480px; }
table.mapping { border-collapse: separate; border-spacing: 0; font-size: var(--fs-input); min-width: 1000px; }
table.mapping th, table.mapping td { border-bottom: 1px solid var(--c-border); border-right: 1px solid var(--c-border); white-space: nowrap; }
table.mapping thead th { position: sticky; top: 0; background: var(--c-primary); color: #fff; padding: 10px 12px; font-weight: 600; z-index: 2; font-size: var(--fs-label); }
table.mapping thead th.corner { left: 0; z-index: 4; background: var(--c-primary); }
table.mapping tbody th { position: sticky; left: 0; background: var(--c-bg-main); text-align: left; padding: 10px 14px; font-weight: 600; color: var(--c-primary); z-index: 1; max-width: 230px; white-space: normal; line-height: 1.4; }
table.mapping td { text-align: center; padding: 0; }
table.mapping tbody tr.group-row th { background: var(--c-primary); color: #fff; text-align: left; font-size: var(--fs-label); letter-spacing: .02em; }
.cell-btn { width: 100%; height: 38px; border: none; background: transparent; font-size: 13px; font-weight: 700; color: transparent; cursor: pointer; transition: 0.1s; }
.cell-btn.o { color: var(--c-gold); background: #FDFBF4; }
.cell-btn.r { color: var(--c-primary); background: var(--c-gold-light); }
.cell-btn:hover { background: #F1E9D6; }
.cell-btn.o::after { content: '○'; }
.cell-btn.r::after { content: '●'; }

.mapping-input {
  width: 100%; background: transparent; border: 1px solid transparent; border-bottom: 1px dashed rgba(168,121,59,0.3);
  border-radius: 4px 4px 0 0; padding: 3px 6px; margin-bottom: 2px; transition: all 0.2s; font-size: var(--fs-input);
}
.mapping-input:focus, .mapping-input:hover { background: #fff !important; border: 1px solid var(--c-gold) !important; outline: none; }
</style>