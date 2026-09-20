<!-- pages/number1.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSteps } from '~/constants/toc'
const route = useRoute()
const router = useRouter()

// ===== Focus mode =====
const { isFocused, currentIndex, currentStep, isVisible, focusAnchor, next: nextStep, prev: prevStep, showAll, steps } = useFocusMode(getSteps('1'))

const config = useRuntimeConfig()
const API_BASE = config.public.apiBase as string

// ================= State ข้อมูลฟอร์มหน้า 1 =================
const form = ref({
  id: null as string | number | null, 
  
  // 🌟 เพิ่มฟิลด์ข้อมูลสถาบัน
  university: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ',
  campus: 'วิทยาลัยเทคโนโลยีอุตสาหกรรม ภาควิชาเทคโนโลยีวิศวกรรมอิเล็กทรอนิกส์',

  // 1.1
  programCode: '', nameTh: '', nameEn: '', 
  // 1.2
  degreeFullTh: '', degreeAbbrTh: '', degreeFullEn: '', degreeAbbrEn: '',
  // 1.3
  majors: [''] as string[],
  // 1.4
  totalCredits: '',
  // 1.5
  format: '', ptype: '', language: 'ภาษาไทย', admission: '', cooperation: '', degreeGrant: '',
  // 1.6
  approvals: [{ committee: '', approvalDate: '', note: '' }],
  // 1.7
  readiness: '',
  // 1.8
  careers: [''] as string[],
  // 1.9
  instructors: [{ name: '', position: '', degree: '', branch: '' }],
  // 1.10
  location: '',
  // 1.11
  econSituation: '', socialSituation: '',
  // 1.12
  devPlan: '', universityMission: '',
  // 1.13
  otherCoursesIn: '', otherCoursesOut: '', administration: ''
})

const positionOptions = ['ศาสตราจารย์', 'รองศาสตราจารย์', 'ผู้ช่วยศาสตราจารย์', 'อาจารย์']
const branchOptions = ['แขนงวิชาโทรคมนาคม', 'แขนงวิชาคอมพิวเตอร์', 'แขนงวิชาเครื่องมือวัดและควบคุม', 'แขนงวิชาการกระจายเสียงวิทยุและโทรทัศน์']

// ================= Load existing program =================
const isLoading = ref(false)
const loadError = ref('')

async function loadProgram(id: string | number) {
  isLoading.value = true
  loadError.value = ''
  form.value.id = id
  try {
    const data: any = await $fetch(`${API_BASE}/programs/${id}`)

    form.value.id = data.id
    form.value.university = data.university ?? 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ'
    form.value.campus = data.campus ?? 'วิทยาลัยเทคโนโลยีอุตสาหกรรม ภาควิชาเทคโนโลยีวิศวกรรมอิเล็กทรอนิกส์'
    
    form.value.programCode = data.program_code ?? ''
    form.value.nameTh = data.name_th ?? ''
    form.value.nameEn = data.name_en ?? ''
    form.value.degreeFullTh = data.degree_name_th ?? ''
    form.value.degreeAbbrTh = data.degree_abbr_th ?? ''
    form.value.degreeFullEn = data.degree_name_en ?? ''
    form.value.degreeAbbrEn = data.degree_abbr_en ?? ''
    form.value.totalCredits = data.total_credits != null ? String(data.total_credits) : ''
    form.value.format = data.program_format ?? ''
    form.value.ptype = data.program_type ?? ''
    form.value.language = data.language ?? 'ภาษาไทย'
    form.value.admission = data.admission_req ?? ''
    form.value.cooperation = data.cooperation ?? ''
    form.value.degreeGrant = data.degree_granting ?? ''
    form.value.readiness = data.readiness ?? ''
    form.value.location = data.location ?? ''
    form.value.econSituation = data.economic_situation ?? ''
    form.value.socialSituation = data.social_situation ?? ''
    form.value.devPlan = data.development_plan ?? ''
    form.value.universityMission = data.university_mission ?? ''
    form.value.otherCoursesIn = data.other_courses_in ?? ''
    form.value.otherCoursesOut = data.other_courses_out ?? ''
    form.value.administration = data.administration ?? ''

    form.value.majors = data.majors?.length
      ? [...data.majors].sort((a: any, b: any) => a.sort_order - b.sort_order).map((m: any) => m.major_name)
      : ['']

    form.value.careers = data.careers_list?.length
      ? [...data.careers_list].sort((a: any, b: any) => a.sort_order - b.sort_order).map((c: any) => c.career_name)
      : ['']

    form.value.approvals = data.approvals?.length
      ? [...data.approvals].sort((a: any, b: any) => a.sort_order - b.sort_order).map((a: any) => ({
          committee: a.committee ?? '',
          approvalDate: a.approval_date ?? '',
          note: a.note ?? ''
        }))
      : [{ committee: '', approvalDate: '', note: '' }]

    form.value.instructors = data.instructors?.length
      ? [...data.instructors].sort((a: any, b: any) => a.sort_order - b.sort_order).map((x: any) => ({
          name: x.name ?? '',
          position: x.position ?? '',
          degree: x.degree ?? '',
          branch: x.branch ?? ''
        }))
      : [{ name: '', position: '', degree: '', branch: '' }]
  } catch (err: any) {
    console.error('Failed to load program', err)

    const status = err?.response?.status ?? err?.statusCode
    if (status === 404) {
      form.value.id = null
      router.replace({ path: route.path, query: {} })
      loadError.value = 'ไม่พบข้อมูลหลักสูตรนี้ในระบบแล้ว เริ่มกรอกข้อมูลใหม่ได้เลย'
    } else {
      loadError.value = 'โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (route.query.id) {
    loadProgram(route.query.id as string)
  }
})

// ================= List Actions =================
const addMajor = () => form.value.majors.push('')
const removeMajor = (i: number) => { form.value.majors.splice(i, 1); if(form.value.majors.length === 0) form.value.majors.push('') }

const addCareer = () => form.value.careers.push('')
const removeCareer = (i: number) => { form.value.careers.splice(i, 1); if(form.value.careers.length === 0) form.value.careers.push('') }

const addApproval = () => form.value.approvals.push({ committee: '', approvalDate: '', note: '' })
const removeApproval = (i: number) => { form.value.approvals.splice(i, 1); if(form.value.approvals.length === 0) form.value.approvals.push({ committee: '', approvalDate: '', note: '' }) }

const addInstructor = () => form.value.instructors.push({ name: '', position: '', degree: '', branch: '' })
const removeInstructor = (i: number) => { form.value.instructors.splice(i, 1); if(form.value.instructors.length === 0) form.value.instructors.push({ name: '', position: '', degree: '', branch: '' }) }

// ================= Build the /programs payload =================
function buildProgramPayload() {
  return {
    university: form.value.university || null,
    campus: form.value.campus || null,
    program_code: form.value.programCode || null,
    name_th: form.value.nameTh || null,
    name_en: form.value.nameEn || null,
    degree_name_th: form.value.degreeFullTh || null,
    degree_abbr_th: form.value.degreeAbbrTh || null,
    degree_name_en: form.value.degreeFullEn || null,
    degree_abbr_en: form.value.degreeAbbrEn || null,
    total_credits: form.value.totalCredits ? Number(form.value.totalCredits) : null,
    program_format: form.value.format || null,
    program_type: form.value.ptype || null,
    language: form.value.language || null,
    admission_req: form.value.admission || null,
    cooperation: form.value.cooperation || null,
    degree_granting: form.value.degreeGrant || null,
    readiness: form.value.readiness || null,
    location: form.value.location || null,
    economic_situation: form.value.econSituation || null,
    social_situation: form.value.socialSituation || null,
    development_plan: form.value.devPlan || null,
    university_mission: form.value.universityMission || null,
    other_courses_in: form.value.otherCoursesIn || null,
    other_courses_out: form.value.otherCoursesOut || null,
    administration: form.value.administration || null
  }
}

async function replaceChildren(programId: string | number, resource: string, items: any[]) {
  const existing: any[] = await $fetch(`${API_BASE}/programs/${programId}/${resource}/`)
  await Promise.all(
    existing.map(e => $fetch(`${API_BASE}/programs/${programId}/${resource}/${e.id}`, { method: 'DELETE' }))
  )
  for (const item of items) {
    await $fetch(`${API_BASE}/programs/${programId}/${resource}/`, { method: 'POST', body: item })
  }
}

async function saveChildren(programId: string | number) {
  await replaceChildren(
    programId, 'majors',
    form.value.majors.filter(m => m.trim()).map((major_name, i) => ({ major_name, sort_order: i }))
  )
  await replaceChildren(
    programId, 'careers',
    form.value.careers.filter(c => c.trim()).map((career_name, i) => ({ career_name, sort_order: i }))
  )
  await replaceChildren(
    programId, 'approvals',
    form.value.approvals
      .filter(a => a.committee.trim() || a.approvalDate || a.note.trim())
      .map((a, i) => ({
        committee: a.committee || null,
        approval_date: a.approvalDate || null,
        note: a.note || null,
        sort_order: i
      }))
  )
  await replaceChildren(
    programId, 'instructors',
    form.value.instructors
      .filter(x => x.name.trim())
      .map((x, i) => ({
        name: x.name,
        position: x.position || null,
        degree: x.degree || null,
        branch: x.branch || null,
        sort_order: i
      }))
  )
}

async function saveProgram(): Promise<any> {
  const payload = buildProgramPayload()
  if (form.value.id) {
    return await $fetch(`${API_BASE}/programs/${form.value.id}`, { method: 'PUT', body: payload })
  }
  return await $fetch(`${API_BASE}/programs/`, { method: 'POST', body: payload })
}

// ================= ระบบบันทึกข้อมูล =================
const isSavingDraft = ref(false)
const isSavingNext = ref(false)
const saveError = ref('')

const saveDraft = async () => {
  isSavingDraft.value = true
  saveError.value = ''
  try {
    const saved = await saveProgram()
    form.value.id = saved.id
    await saveChildren(saved.id)

    if (route.query.id !== String(saved.id)) {
      router.replace({ path: route.path, query: { id: saved.id } })
    }
  } catch (err) {
    console.error('Save draft failed', err)
    saveError.value = 'บันทึกไม่สำเร็จ กรุณาลองใหม่'
  } finally {
    isSavingDraft.value = false
  }
}

const saveAndNext = async () => {
  isSavingNext.value = true
  saveError.value = ''
  try {
    const saved = await saveProgram()
    form.value.id = saved.id
    await saveChildren(saved.id)
    router.push({ path: '/number2', query: { id: form.value.id } })
  } catch (err) {
    console.error('Save and next failed', err)
    saveError.value = 'บันทึกไม่สำเร็จ กรุณาลองใหม่'
  } finally {
    isSavingNext.value = false
  }
}

// ================= UI State & Actions =================
const doneState = ref({
  s1_0: false, s1_1: false, s1_2: false, s1_3: false, s1_4: false, s1_5: false,
  s1_6: false, s1_7: false, s1_8: false, s1_9: false, s1_10: false,
  s1_11: false, s1_12: false, s1_13: false
})
const keyToAnchor = (key: string) => 'sec-1-' + key.replace('s1_', '')
const toggleDone = (key: keyof typeof doneState.value) => {
  doneState.value[key] = !doneState.value[key]
  if (import.meta.client) {
    localStorage.setItem(`done-${keyToAnchor(key)}`, doneState.value[key] ? '1' : '0')
    window.dispatchEvent(new Event('storage'))
  }
}
onMounted(() => {
  if (!import.meta.client) return
  ;(Object.keys(doneState.value) as (keyof typeof doneState.value)[]).forEach(key => {
    doneState.value[key] = localStorage.getItem(`done-${keyToAnchor(key)}`) === '1'
  })
})
</script>

<template>
  <div class="page-shell">
    <form @submit.prevent class="w-full">
      
      <!-- Breadcrumb & Title -->
      <div class="crumb">
        <span>เล่มหลักสูตร</span> › <b>หมวดที่ 1</b>
        <span class="page-badge">หน้า 1 / 8</span>
      </div>
      <div class="doc-head">
        <div class="doc-eyebrow">หมวดที่ 1</div>
        <h1 class="doc-title">ข้อมูลทั่วไป</h1>
      </div>

      <!-- TOC Card -->
      <div v-if="!isFocused" class="toc-card">
        <div class="toc-label">หัวข้อในหน้านี้ — คลิกเพื่อเลือกกรอกทีละหัวข้อ</div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-[4px_18px]">
          <!-- 🌟 เพิ่มสารบัญข้อมูลสถาบันตรงนี้ -->
          <div class="toc-item" :class="{ 'filled': doneState.s1_0 }" @click="focusAnchor('sec-1-0')"><div class="toc-dot"></div><span class="toc-num"></span><span class="lbl">ข้อมูลสถาบันอุดมศึกษา</span></div>
          
          <div class="toc-item" :class="{ 'filled': doneState.s1_1 }" @click="focusAnchor('sec-1-1')"><div class="toc-dot"></div><span class="toc-num">1.1-1.5</span><span class="lbl">รหัสและรูปแบบของหลักสูตร</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s1_6 }" @click="focusAnchor('sec-1-6')"><div class="toc-dot"></div><span class="toc-num">1.6</span><span class="lbl">สถานภาพของหลักสูตรและการพิจารณา...</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s1_7 }" @click="focusAnchor('sec-1-7')"><div class="toc-dot"></div><span class="toc-num">1.7-1.8</span><span class="lbl">ความพร้อมและอาชีพที่ประกอบได้</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s1_9 }" @click="focusAnchor('sec-1-9')"><div class="toc-dot"></div><span class="toc-num">1.9</span><span class="lbl">ชื่อ-นามสกุล ตำแหน่ง และคุณวุฒิ...</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s1_10 }" @click="focusAnchor('sec-1-10')"><div class="toc-dot"></div><span class="toc-num">1.10-1.13</span><span class="lbl">สถานที่และผลกระทบการพัฒนาหลักสูตร</span></div>
        </div>
      </div>

      <!-- Focus Navigation -->
      <FocusNav :is-focused="isFocused" :current-index="currentIndex" :total="steps.length" :steps="steps" @show-all="showAll" />

      <!-- Main Paper Card -->
      <div class="paper-card">

        <!-- ================= ข้อมูลสถาบันอุดมศึกษา (ใหม่) ================= -->
        <section class="topic-sec" id="sec-1-0" v-show="isVisible('sec-1-0')">
          <div class="sec-head">
            <div class="sec-number text-[#A8793B] text-[20px]">§</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <h2 class="sec-title pt-1">ชื่อสถาบันอุดมศึกษา และ วิทยาเขต/คณะ/ภาควิชา</h2>
              <button type="button" class="sec-check" :class="{ 'on': doneState.s1_0 }" @click="toggleDone('s1_0')">{{ doneState.s1_0 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body mt-4">
            <div class="fs-grid full">
              <div class="fs-field">
                <label>ชื่อสถาบันอุดมศึกษา</label>
                <input v-model="form.university" type="text" />
              </div>
              <div class="fs-field">
                <label>วิทยาเขต/คณะ/ภาควิชา</label>
                <input v-model="form.campus" type="text" />
              </div>
            </div>
          </div>
        </section>
        
        <!-- ================= กลุ่มที่ 1 (1.1 - 1.5) ================= -->
        <!-- 1.1 รหัสและชื่อหลักสูตร -->
        <section class="topic-sec" id="sec-1-1" v-show="isVisible('sec-1-1')">
          <div class="sec-head">
            <div class="sec-number">1.1</div><h2 class="sec-title">รหัสและชื่อหลักสูตร</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_1 }" @click="toggleDone('s1_1')">{{ doneState.s1_1 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div class="fs-grid full">
              <div class="fs-field"><label>รหัสหลักสูตร</label><input v-model="form.programCode" type="text" /></div>
              <div class="fs-field"><label>ชื่อหลักสูตร <span class="lang-tag">ภาษาไทย</span></label><input v-model="form.nameTh" type="text" /></div>
              <div class="fs-field"><label>Program Name <span class="lang-tag">English</span></label><input v-model="form.nameEn" type="text" /></div>
            </div>
          </div>
        </section>

        <!-- 1.2 ชื่อปริญญาและสาขาวิชา -->
        <section class="topic-sec" id="sec-1-2" v-show="isVisible('sec-1-2')">
          <div class="sec-head">
            <div class="sec-number">1.2</div><h2 class="sec-title">ชื่อปริญญาและสาขาวิชา</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_2 }" @click="toggleDone('s1_2')">{{ doneState.s1_2 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div class="fs-grid">
              <div class="fs-field"><label>ชื่อเต็ม <span class="lang-tag">ภาษาไทย</span></label><input v-model="form.degreeFullTh" type="text" placeholder="เช่น วิศวกรรมศาสตรบัณฑิต (...)" /></div>
              <div class="fs-field"><label>ชื่อย่อ <span class="lang-tag">ภาษาไทย</span></label><input v-model="form.degreeAbbrTh" type="text" placeholder="เช่น วศ.บ. (...)" /></div>
              <div class="fs-field"><label>Full Name <span class="lang-tag">English</span></label><input v-model="form.degreeFullEn" type="text" placeholder="e.g. Bachelor of Engineering (...)" /></div>
              <div class="fs-field"><label>Abbreviation <span class="lang-tag">English</span></label><input v-model="form.degreeAbbrEn" type="text" placeholder="e.g. B.Eng. (...)" /></div>
            </div>
          </div>
        </section>

        <!-- 1.3 วิชาเอก -->
        <section class="topic-sec" id="sec-1-3" v-show="isVisible('sec-1-3')">
          <div class="sec-head">
            <div class="sec-number">1.3</div><h2 class="sec-title">วิชาเอก</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_3 }" @click="toggleDone('s1_3')">{{ doneState.s1_3 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <p class="sec-hint">ระบุแขนงวิชา/วิชาเอกที่เปิดสอนในหลักสูตร</p>
          <div class="sec-body">
            <div class="list-editor">
              <div class="list-row" v-for="(major, i) in form.majors" :key="i">
                <div class="list-num">{{ i + 1 }}</div>
                <input v-model="form.majors[i]" type="text" placeholder="ระบุแขนงวิชา/วิชาเอก" />
                <button type="button" class="row-del" @click="removeMajor(i)">✕</button>
              </div>
              <button type="button" class="add-row" @click="addMajor()">+ เพิ่มรายการ</button>
            </div>
          </div>
        </section>

        <!-- 1.4 จำนวนหน่วยกิตที่เรียนตลอดหลักสูตร -->
        <section class="topic-sec" id="sec-1-4" v-show="isVisible('sec-1-4')">
          <div class="sec-head">
            <div class="sec-number">1.4</div><h2 class="sec-title">จำนวนหน่วยกิตที่เรียนตลอดหลักสูตร</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_4 }" @click="toggleDone('s1_4')">{{ doneState.s1_4 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div class="fs-grid full">
              <div class="fs-field">
                <input v-model="form.totalCredits" type="text" placeholder="เช่น 147 หน่วยกิต" />
              </div>
            </div>
          </div>
        </section>

        <!-- 1.5 รูปแบบของหลักสูตร -->
        <section class="topic-sec" id="sec-1-5" v-show="isVisible('sec-1-5')">
          <div class="sec-head">
            <div class="sec-number">1.5</div><h2 class="sec-title">รูปแบบของหลักสูตร</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_5 }" @click="toggleDone('s1_5')">{{ doneState.s1_5 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <p class="sec-hint">5.1 รูปแบบ · 5.2 ประเภทของหลักสูตร · 5.3 ภาษาที่ใช้ · 5.4 การรับเข้าศึกษา · 5.5 ความร่วมมือ · 5.6 การให้ปริญญา</p>
          <div class="sec-body">
            <div class="fs-grid">
              <div class="fs-field" style="grid-column: 1 / -1;"><label>5.1 รูปแบบ</label><textarea v-model="form.format" class="field" placeholder="เช่น หลักสูตรระดับปริญญาตรี 4 ปี จัดการเรียนการสอนแบบ..."></textarea></div>
              <div class="fs-field" style="grid-column: 1 / -1;"><label>5.2 ประเภทของหลักสูตร</label><input v-model="form.ptype" type="text" placeholder="เช่น หลักสูตรปริญญาตรีทางวิชาการ" /></div>
              <div class="fs-field" style="grid-column: 1 / -1;">
                <label>5.3 ภาษาที่ใช้</label>
                <div class="radio-group">
                  <label class="radio-option" :class="{ 'sel': form.language === 'ภาษาไทย' }"><input type="radio" v-model="form.language" value="ภาษาไทย" /> ภาษาไทย</label>
                  <label class="radio-option" :class="{ 'sel': form.language === 'ภาษาไทยและภาษาอังกฤษ' }"><input type="radio" v-model="form.language" value="ภาษาไทยและภาษาอังกฤษ" /> ภาษาไทยและภาษาอังกฤษ</label>
                  <label class="radio-option" :class="{ 'sel': form.language === 'ภาษาอังกฤษ' }"><input type="radio" v-model="form.language" value="ภาษาอังกฤษ" /> ภาษาอังกฤษ</label>
                </div>
              </div>
              <div class="fs-field" style="grid-column: 1 / -1;"><label>5.4 การรับเข้าศึกษา</label><input v-model="form.admission" type="text" placeholder="เช่น รับนักศึกษาไทยและนักศึกษาต่างชาติที่สามารถใช้ภาษาไทยได้" /></div>
              <div class="fs-field" style="grid-column: 1 / -1;"><label>5.5 ความร่วมมือกับสถาบันอื่น</label><input v-model="form.cooperation" type="text" placeholder="เช่น ไม่มี หรือ มีความร่วมมือกับ..." /></div>
              <div class="fs-field" style="grid-column: 1 / -1;"><label>5.6 การให้ปริญญาแก่ผู้สำเร็จการศึกษา</label><input v-model="form.degreeGrant" type="text" placeholder="เช่น ให้ปริญญาเพียงสาขาวิชาเดียว" /></div>
            </div>
          </div>
        </section>

        <!-- ================= กลุ่มที่ 2 (1.6) ================= -->
        <!-- 1.6 สถานภาพของหลักสูตรและการพิจารณาอนุมัติ -->
        <section class="topic-sec" id="sec-1-6" v-show="isVisible('sec-1-6')">
          <div class="sec-head">
            <div class="sec-number">1.6</div><h2 class="sec-title">สถานภาพของหลักสูตรและการพิจารณาอนุมัติ/เห็นชอบ</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_6 }" @click="toggleDone('s1_6')">{{ doneState.s1_6 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div>
              <div class="slist-item" v-for="(item, i) in form.approvals" :key="i">
                <div class="slist-num">{{ i + 1 }}</div>
                <div class="slist-fields fs-grid">
                  <div class="fs-field" style="grid-column: span 1;"><label>คณะกรรมการ/ที่ประชุม</label><input v-model="item.committee" type="text" placeholder="เช่น สภาวิชาการ มหาวิทยาลัย..." /></div>
                  <div class="fs-field" style="grid-column: span 1;"><label>วัน เดือน ปี</label><input v-model="item.approvalDate" type="date" /></div>
                  <div class="fs-field" style="grid-column: 1 / -1;"><label>มติ/หมายเหตุ</label><input v-model="item.note" type="text" placeholder="เช่น ให้ความเห็นชอบ (การประชุมครั้งที่ 10/2564)" /></div>
                </div>
                <button type="button" class="slist-del" @click="removeApproval(i)">✕</button>
              </div>
              <button type="button" class="add-row" @click="addApproval()">+ เพิ่มรายการ</button>
            </div>
          </div>
        </section>

        <!-- ================= กลุ่มที่ 3 (1.7 - 1.8) ================= -->
        <!-- 1.7 ความพร้อมในการเผยแพร่ -->
        <section class="topic-sec" id="sec-1-7" v-show="isVisible('sec-1-7')">
          <div class="sec-head">
            <div class="sec-number">1.7</div><h2 class="sec-title">ความพร้อมในการเผยแพร่หลักสูตรที่มีคุณภาพและมาตรฐาน</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_7 }" @click="toggleDone('s1_7')">{{ doneState.s1_7 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div class="fs-grid full"><div class="fs-field"><textarea v-model="form.readiness" class="field" placeholder="ระบุความพร้อมในการเผยแพร่..."></textarea></div></div>
          </div>
        </section>

        <!-- 1.8 อาชีพที่สามารถประกอบได้ -->
        <section class="topic-sec" id="sec-1-8" v-show="isVisible('sec-1-8')">
          <div class="sec-head">
            <div class="sec-number">1.8</div><h2 class="sec-title">อาชีพที่สามารถประกอบได้หลังสำเร็จการศึกษา</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_8 }" @click="toggleDone('s1_8')">{{ doneState.s1_8 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div class="list-editor">
              <div class="list-row" v-for="(career, i) in form.careers" :key="i">
                <div class="list-num">{{ i + 1 }}</div>
                <input v-model="form.careers[i]" type="text" placeholder="ระบุอาชีพ..." />
                <button type="button" class="row-del" @click="removeCareer(i)">✕</button>
              </div>
              <button type="button" class="add-row" @click="addCareer()">+ เพิ่มรายการ</button>
            </div>
          </div>
        </section>

        <!-- ================= กลุ่มที่ 4 (1.9) ================= -->
        <!-- 1.9 อาจารย์ผู้รับผิดชอบหลักสูตร -->
        <section class="topic-sec" id="sec-1-9" v-show="isVisible('sec-1-9')">
          <div class="sec-head">
            <div class="sec-number">1.9</div><h2 class="sec-title">ชื่อ-นามสกุล ตำแหน่ง และคุณวุฒิการศึกษาของอาจารย์ผู้รับผิดชอบหลักสูตร</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_9 }" @click="toggleDone('s1_9')">{{ doneState.s1_9 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div>
              <div class="slist-item" v-for="(item, i) in form.instructors" :key="i">
                <div class="slist-num">{{ i + 1 }}</div>
                <div class="slist-fields fs-grid">
                  <div class="fs-field" style="grid-column: span 1;"><label>ชื่อ-นามสกุล</label><input v-model="item.name" type="text" /></div>
                  <div class="fs-field" style="grid-column: span 1;"><label>ตำแหน่งทางวิชาการ</label><select v-model="item.position"><option value="" disabled>-- เลือกตำแหน่ง --</option><option v-for="pos in positionOptions" :key="pos" :value="pos">{{ pos }}</option></select></div>
                  <div class="fs-field" style="grid-column: 1 / -1;"><label>คุณวุฒิการศึกษา (เรียงจากสูงสุด พร้อมสถาบันและปี พ.ศ.)</label><textarea v-model="item.degree" class="field"></textarea></div>
                  <div class="fs-field" style="grid-column: 1 / -1;"><label>แขนงวิชาที่สังกัด</label><select v-model="item.branch"><option value="" disabled>-- เลือกแขนง --</option><option v-for="br in branchOptions" :key="br" :value="br">{{ br }}</option></select></div>
                </div>
                <button type="button" class="slist-del" @click="removeInstructor(i)">✕</button>
              </div>
              <button type="button" class="add-row" @click="addInstructor()">+ เพิ่มรายการอาจารย์</button>
            </div>
          </div>
        </section>

        <!-- ================= กลุ่มที่ 5 (1.10 - 1.13) ================= -->
        <!-- 1.10 สถานที่จัดการเรียนการสอน -->
        <section class="topic-sec" id="sec-1-10" v-show="isVisible('sec-1-10')">
          <div class="sec-head">
            <div class="sec-number">1.10</div><h2 class="sec-title">สถานที่จัดการเรียนการสอน</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_10 }" @click="toggleDone('s1_10')">{{ doneState.s1_10 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div class="fs-grid full"><div class="fs-field"><input v-model="form.location" type="text" placeholder="ระบุสถานที่..." /></div></div>
          </div>
        </section>

        <!-- 1.11 สถานการณ์ภายนอก -->
        <section class="topic-sec" id="sec-1-11" v-show="isVisible('sec-1-11')">
          <div class="sec-head">
            <div class="sec-number">1.11</div><h2 class="sec-title">สถานการณ์ภายนอกหรือการพัฒนาที่จำเป็นต้องนำมาพิจารณาในการวางแผนหลักสูตร</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_11 }" @click="toggleDone('s1_11')">{{ doneState.s1_11 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div class="fs-grid full">
              <div class="fs-field"><label>11.1 สถานการณ์หรือการพัฒนาทางเศรษฐกิจ</label><textarea v-model="form.econSituation" class="field"></textarea></div>
              <div class="fs-field"><label>11.2 สถานการณ์หรือการพัฒนาทางสังคมและวัฒนธรรม</label><textarea v-model="form.socialSituation" class="field"></textarea></div>
            </div>
          </div>
        </section>

        <!-- 1.12 ผลกระทบจากข้อ 11.1 และ 11.2 -->
        <section class="topic-sec" id="sec-1-12" v-show="isVisible('sec-1-12')">
          <div class="sec-head">
            <div class="sec-number">1.12</div><h2 class="sec-title">ผลกระทบจากข้อ 11.1 และ 11.2 ต่อการพัฒนาหลักสูตรและความเกี่ยวข้องกับพันธกิจของมหาวิทยาลัย</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_12 }" @click="toggleDone('s1_12')">{{ doneState.s1_12 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div class="fs-grid full">
              <div class="fs-field"><label>12.1 การพัฒนาหลักสูตร</label><textarea v-model="form.devPlan" class="field"></textarea></div>
              <div class="fs-field"><label>12.2 ความเกี่ยวข้องกับพันธกิจของมหาวิทยาลัย</label><textarea v-model="form.universityMission" class="field"></textarea></div>
            </div>
          </div>
        </section>

        <!-- 1.13 ความสัมพันธ์กับหลักสูตรอื่น -->
        <section class="topic-sec" id="sec-1-13" v-show="isVisible('sec-1-13')">
          <div class="sec-head">
            <div class="sec-number">1.13</div><h2 class="sec-title">ความสัมพันธ์กับหลักสูตรอื่นที่เปิดสอนในคณะ/ภาควิชาอื่นของมหาวิทยาลัย</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_13 }" @click="toggleDone('s1_13')">{{ doneState.s1_13 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div class="fs-grid full">
              <div class="fs-field"><label>13.1 กลุ่มวิชา/รายวิชาในหลักสูตรนี้ที่เปิดสอนโดยคณะ/ภาควิชาอื่น</label><textarea v-model="form.otherCoursesIn" class="field"></textarea></div>
              <div class="fs-field"><label>13.2 กลุ่มวิชา/รายวิชาที่เปิดสอนให้ภาควิชา/หลักสูตรอื่นต้องมาเรียน</label><textarea v-model="form.otherCoursesOut" class="field"></textarea></div>
              <div class="fs-field"><label>13.3 การบริหารจัดการ</label><textarea v-model="form.administration" class="field"></textarea></div>
            </div>
          </div>
        </section>

      </div>

      <!-- ปุ่มก่อนหน้า/ถัดไป ระหว่างหัวข้อย่อยภายในหมวดนี้ (โชว์เฉพาะตอนโฟกัส) -->
      <FocusFooter :is-focused="isFocused" :current-index="currentIndex" :steps="steps" @prev="prevStep" @next="nextStep" />

      <!-- Action Footer -->
      <div v-if="saveError" style="color:#9C4132; font-size:12.8px; margin-bottom:8px;">{{ saveError }}</div>
      <div class="page-footer">
        <button type="button" class="nav-btn" disabled>
          ← <span>หน้าแรกสุด</span>
        </button>
        <div class="flex flex-col md:flex-row gap-3">
          <button type="button" @click="saveDraft()" :disabled="isSavingDraft" class="nav-btn">
            <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-1" /> {{ isSavingDraft ? 'กำลังบันทึก...' : 'บันทึกฉบับร่าง' }}
          </button>
          <button type="button" @click="saveAndNext()" :disabled="isSavingNext" class="btn-brass" style="border:none;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;cursor:pointer;">
            <span style="color:#ffffff !important;">{{ isSavingNext ? 'กำลังบันทึก...' : 'ข้อมูลเฉพาะของหลักสูตร' }}</span> <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

    </form>
  </div>
</template>

