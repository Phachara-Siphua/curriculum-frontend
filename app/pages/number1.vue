<!-- pages/number1.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const route = useRoute()
const router = useRouter()

// Base URL of the FastAPI backend.
// Set this in nuxt.config.ts:
//   runtimeConfig: { public: { apiBase: 'http://localhost:8000' } }
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase as string

// ================= State ข้อมูลฟอร์มหน้า 1 =================
const form = ref({
  id: null as string | number | null, 
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
  // 1.6 — field names match the backend's `committee` / `approval_date` columns
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
      // The row this id pointed to is gone (deleted, or the id was stale).
      // Fall back to a blank/new program instead of being stuck forever
      // trying to PUT a program that no longer exists.
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

// 💾 เมื่อหน้าเว็บโหลด ให้ดึงข้อมูลมาแสดง ถ้ามี id แนบมากับ URL
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

// The child routers only expose add-one / delete-one, not update-one,
// so "sync" here means: wipe what's on the server for this program,
// then re-add whatever's currently in the form.
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

// ================= ระบบบันทึกข้อมูล (Save System) =================
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

    // Reflect the DB's auto-increment id in the URL so a refresh,
    // bookmark, or shared link keeps pointing at this same program
    // instead of starting a new one.
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
const scrollToSec = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    el.classList.add('pulse')
    setTimeout(() => el.classList.remove('pulse'), 1200)
  }
}

// สถานะการกรอกข้อมูลแต่ละหัวข้อ (1.1 - 1.13)
const doneState = ref({
  s1_1: false, s1_2: false, s1_3: false, s1_4: false, s1_5: false,
  s1_6: false, s1_7: false, s1_8: false, s1_9: false, s1_10: false,
  s1_11: false, s1_12: false, s1_13: false
})
const toggleDone = (key: keyof typeof doneState.value) => { doneState.value[key] = !doneState.value[key] }
</script>

<template>
  <div class="page-shell">
    <form @submit.prevent class="w-full">
      
      <!-- Breadcrumb & Title -->
      <div class="crumb">
        <span>เล่มหลักสูตร</span> › <b>หมวดที่ 1</b>
        <span class="page-badge">หน้า 2 / 9</span>
      </div>
      <div class="doc-head">
        <div class="doc-eyebrow">หมวดที่ 1</div>
        <h1 class="doc-title">ข้อมูลทั่วไป</h1>
      </div>

      <!-- TOC Card -->
      <div class="toc-card">
        <div class="toc-label">หัวข้อในหน้านี้ — คลิกเพื่อกระโดดไปยังหัวข้อ</div>
        <!-- ใช้ grid-cols-3 เพื่อให้จัดเรียงได้เหมือนในรูป Mockup -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-[4px_18px]">
          <div class="toc-item" :class="{ 'filled': doneState.s1_1 }" @click="scrollToSec('sec-1-1')"><div class="toc-dot"></div><span class="toc-num">1.1</span><span class="lbl">รหัสและชื่อหลักสูตร</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s1_2 }" @click="scrollToSec('sec-1-2')"><div class="toc-dot"></div><span class="toc-num">1.2</span><span class="lbl">ชื่อปริญญาและสาขาวิชา</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s1_3 }" @click="scrollToSec('sec-1-3')"><div class="toc-dot"></div><span class="toc-num">1.3</span><span class="lbl">วิชาเอก</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s1_4 }" @click="scrollToSec('sec-1-4')"><div class="toc-dot"></div><span class="toc-num">1.4</span><span class="lbl">จำนวนหน่วยกิตที่เรียนตลอดหลักสูตร</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s1_5 }" @click="scrollToSec('sec-1-5')"><div class="toc-dot"></div><span class="toc-num">1.5</span><span class="lbl">รูปแบบของหลักสูตร</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s1_6 }" @click="scrollToSec('sec-1-6')"><div class="toc-dot"></div><span class="toc-num">1.6</span><span class="lbl">สถานภาพของหลักสูตรและการพิจารณา...</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s1_7 }" @click="scrollToSec('sec-1-7')"><div class="toc-dot"></div><span class="toc-num">1.7</span><span class="lbl">ความพร้อมในการเผยแพร่หลักสูตร...</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s1_8 }" @click="scrollToSec('sec-1-8')"><div class="toc-dot"></div><span class="toc-num">1.8</span><span class="lbl">อาชีพที่สามารถประกอบได้หลังสำเร็จ...</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s1_9 }" @click="scrollToSec('sec-1-9')"><div class="toc-dot"></div><span class="toc-num">1.9</span><span class="lbl">ชื่อ-นามสกุล ตำแหน่ง และคุณวุฒิ...</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s1_10 }" @click="scrollToSec('sec-1-10')"><div class="toc-dot"></div><span class="toc-num">1.10</span><span class="lbl">สถานที่จัดการเรียนการสอน</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s1_11 }" @click="scrollToSec('sec-1-11')"><div class="toc-dot"></div><span class="toc-num">1.11</span><span class="lbl">สถานการณ์ภายนอกหรือการพัฒนา...</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s1_12 }" @click="scrollToSec('sec-1-12')"><div class="toc-dot"></div><span class="toc-num">1.12</span><span class="lbl">ผลกระทบจากข้อ 11.1 และ 11.2 ต่อ...</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s1_13 }" @click="scrollToSec('sec-1-13')"><div class="toc-dot"></div><span class="toc-num">1.13</span><span class="lbl">ความสัมพันธ์กับหลักสูตรอื่นที่เปิดสอ...</span></div>
        </div>
      </div>

      <!-- Main Paper Card -->
      <div class="paper-card">
        
        <!-- 1.1 รหัสและชื่อหลักสูตร -->
        <section class="topic-sec" id="sec-1-1">
          <div class="sec-head">
            <div class="sec-number">1.1</div><h2 class="sec-title">รหัสและชื่อหลักสูตร</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_1 }" @click="toggleDone('s1_1')">{{ doneState.s1_1 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div class="fs-grid full">
              <div class="fs-field">
                <label>รหัสหลักสูตร</label>
                <input v-model="form.programCode" type="text" />
              </div>
              <div class="fs-field">
                <label>ชื่อหลักสูตร <span class="lang-tag">ภาษาไทย</span></label>
                <input v-model="form.nameTh" type="text" />
              </div>
              <div class="fs-field">
                <label>Program Name <span class="lang-tag">English</span></label>
                <input v-model="form.nameEn" type="text" />
              </div>
            </div>
          </div>
        </section>

        <!-- 1.2 ชื่อปริญญาและสาขาวิชา -->
        <section class="topic-sec" id="sec-1-2">
          <div class="sec-head">
            <div class="sec-number">1.2</div><h2 class="sec-title">ชื่อปริญญาและสาขาวิชา</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_2 }" @click="toggleDone('s1_2')">{{ doneState.s1_2 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div class="fs-grid">
              <div class="fs-field">
                <label>ชื่อเต็ม <span class="lang-tag">ภาษาไทย</span></label>
                <input v-model="form.degreeFullTh" type="text" placeholder="เช่น วิศวกรรมศาสตรบัณฑิต (...)" />
              </div>
              <div class="fs-field">
                <label>ชื่อย่อ <span class="lang-tag">ภาษาไทย</span></label>
                <input v-model="form.degreeAbbrTh" type="text" placeholder="เช่น วศ.บ. (...)" />
              </div>
              <div class="fs-field">
                <label>Full Name <span class="lang-tag">English</span></label>
                <input v-model="form.degreeFullEn" type="text" placeholder="e.g. Bachelor of Engineering (...)" />
              </div>
              <div class="fs-field">
                <label>Abbreviation <span class="lang-tag">English</span></label>
                <input v-model="form.degreeAbbrEn" type="text" placeholder="e.g. B.Eng. (...)" />
              </div>
            </div>
          </div>
        </section>

        <!-- 1.3 วิชาเอก -->
        <section class="topic-sec" id="sec-1-3">
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
        <section class="topic-sec" id="sec-1-4">
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
        <section class="topic-sec" id="sec-1-5">
          <div class="sec-head">
            <div class="sec-number">1.5</div><h2 class="sec-title">รูปแบบของหลักสูตร</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_5 }" @click="toggleDone('s1_5')">{{ doneState.s1_5 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <p class="sec-hint">5.1 รูปแบบ · 5.2 ประเภทของหลักสูตร · 5.3 ภาษาที่ใช้ · 5.4 การรับเข้าศึกษา · 5.5 ความร่วมมือ · 5.6 การให้ปริญญา</p>
          <div class="sec-body">
            <div class="fs-grid">
              <div class="fs-field" style="grid-column: 1 / -1;">
                <label>5.1 รูปแบบ</label>
                <textarea v-model="form.format" class="field" placeholder="เช่น หลักสูตรระดับปริญญาตรี 4 ปี จัดการเรียนการสอนแบบ..."></textarea>
              </div>
              <div class="fs-field" style="grid-column: 1 / -1;">
                <label>5.2 ประเภทของหลักสูตร</label>
                <input v-model="form.ptype" type="text" placeholder="เช่น หลักสูตรปริญญาตรีทางวิชาการ" />
              </div>
              <div class="fs-field" style="grid-column: 1 / -1;">
                <label>5.3 ภาษาที่ใช้</label>
                <div class="radio-group">
                  <label class="radio-option" :class="{ 'sel': form.language === 'ภาษาไทย' }">
                    <input type="radio" v-model="form.language" value="ภาษาไทย" /> ภาษาไทย
                  </label>
                  <label class="radio-option" :class="{ 'sel': form.language === 'ภาษาไทยและภาษาอังกฤษ' }">
                    <input type="radio" v-model="form.language" value="ภาษาไทยและภาษาอังกฤษ" /> ภาษาไทยและภาษาอังกฤษ
                  </label>
                  <label class="radio-option" :class="{ 'sel': form.language === 'ภาษาอังกฤษ' }">
                    <input type="radio" v-model="form.language" value="ภาษาอังกฤษ" /> ภาษาอังกฤษ
                  </label>
                </div>
              </div>
              <div class="fs-field" style="grid-column: 1 / -1;">
                <label>5.4 การรับเข้าศึกษา</label>
                <input v-model="form.admission" type="text" placeholder="เช่น รับนักศึกษาไทยและนักศึกษาต่างชาติที่สามารถใช้ภาษาไทยได้" />
              </div>
              <div class="fs-field" style="grid-column: 1 / -1;">
                <label>5.5 ความร่วมมือกับสถาบันอื่น</label>
                <input v-model="form.cooperation" type="text" placeholder="เช่น ไม่มี หรือ มีความร่วมมือกับ..." />
              </div>
              <div class="fs-field" style="grid-column: 1 / -1;">
                <label>5.6 การให้ปริญญาแก่ผู้สำเร็จการศึกษา</label>
                <input v-model="form.degreeGrant" type="text" placeholder="เช่น ให้ปริญญาเพียงสาขาวิชาเดียว" />
              </div>
            </div>
          </div>
        </section>

        <!-- 1.6 สถานภาพของหลักสูตรและการพิจารณาอนุมัติ -->
        <section class="topic-sec" id="sec-1-6">
          <div class="sec-head">
            <div class="sec-number">1.6</div><h2 class="sec-title">สถานภาพของหลักสูตรและการพิจารณาอนุมัติ/เห็นชอบ</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_6 }" @click="toggleDone('s1_6')">{{ doneState.s1_6 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div>
              <div class="slist-item" v-for="(item, i) in form.approvals" :key="i">
                <div class="slist-num">{{ i + 1 }}</div>
                <div class="slist-fields fs-grid">
                  <div class="fs-field" style="grid-column: span 1;">
                    <label>คณะกรรมการ/ที่ประชุม</label>
                    <input v-model="item.committee" type="text" placeholder="เช่น สภาวิชาการ มหาวิทยาลัย..." />
                  </div>
                  <div class="fs-field" style="grid-column: span 1;">
                    <label>วัน เดือน ปี</label>
                    <input v-model="item.approvalDate" type="date" />
                  </div>
                  <div class="fs-field" style="grid-column: 1 / -1;">
                    <label>มติ/หมายเหตุ</label>
                    <input v-model="item.note" type="text" placeholder="เช่น ให้ความเห็นชอบ (การประชุมครั้งที่ 10/2564)" />
                  </div>
                </div>
                <button type="button" class="slist-del" @click="removeApproval(i)">✕</button>
              </div>
              <button type="button" class="add-row" @click="addApproval()">+ เพิ่มรายการ</button>
            </div>
          </div>
        </section>

        <!-- 1.7 ความพร้อมในการเผยแพร่ -->
        <section class="topic-sec" id="sec-1-7">
          <div class="sec-head">
            <div class="sec-number">1.7</div><h2 class="sec-title">ความพร้อมในการเผยแพร่หลักสูตรที่มีคุณภาพและมาตรฐาน</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_7 }" @click="toggleDone('s1_7')">{{ doneState.s1_7 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div class="fs-grid full">
              <div class="fs-field">
                <textarea v-model="form.readiness" class="field" placeholder="ระบุความพร้อมในการเผยแพร่..."></textarea>
              </div>
            </div>
          </div>
        </section>

        <!-- 1.8 อาชีพที่สามารถประกอบได้ -->
        <section class="topic-sec" id="sec-1-8">
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

        <!-- 1.9 อาจารย์ผู้รับผิดชอบหลักสูตร -->
        <section class="topic-sec" id="sec-1-9">
          <div class="sec-head">
            <div class="sec-number">1.9</div><h2 class="sec-title">ชื่อ-นามสกุล ตำแหน่ง และคุณวุฒิการศึกษาของอาจารย์ผู้รับผิดชอบหลักสูตร</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_9 }" @click="toggleDone('s1_9')">{{ doneState.s1_9 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div>
              <div class="slist-item" v-for="(item, i) in form.instructors" :key="i">
                <div class="slist-num">{{ i + 1 }}</div>
                <div class="slist-fields fs-grid">
                  <div class="fs-field" style="grid-column: span 1;">
                    <label>ชื่อ-นามสกุล</label>
                    <input v-model="item.name" type="text" />
                  </div>
                  <div class="fs-field" style="grid-column: span 1;">
                    <label>ตำแหน่งทางวิชาการ</label>
                    <select v-model="item.position">
                      <option value="" disabled>-- เลือกตำแหน่ง --</option>
                      <option v-for="pos in positionOptions" :key="pos" :value="pos">{{ pos }}</option>
                    </select>
                  </div>
                  <div class="fs-field" style="grid-column: 1 / -1;">
                    <label>คุณวุฒิการศึกษา (เรียงจากสูงสุด พร้อมสถาบันและปี พ.ศ.)</label>
                    <textarea v-model="item.degree" class="field"></textarea>
                  </div>
                  <div class="fs-field" style="grid-column: 1 / -1;">
                    <label>แขนงวิชาที่สังกัด</label>
                    <select v-model="item.branch">
                      <option value="" disabled>-- เลือกแขนง --</option>
                      <option v-for="br in branchOptions" :key="br" :value="br">{{ br }}</option>
                    </select>
                  </div>
                </div>
                <button type="button" class="slist-del" @click="removeInstructor(i)">✕</button>
              </div>
              <button type="button" class="add-row" @click="addInstructor()">+ เพิ่มรายการอาจารย์</button>
            </div>
          </div>
        </section>

        <!-- 1.10 สถานที่จัดการเรียนการสอน -->
        <section class="topic-sec" id="sec-1-10">
          <div class="sec-head">
            <div class="sec-number">1.10</div><h2 class="sec-title">สถานที่จัดการเรียนการสอน</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_10 }" @click="toggleDone('s1_10')">{{ doneState.s1_10 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div class="fs-grid full">
              <div class="fs-field">
                <input v-model="form.location" type="text" placeholder="ระบุสถานที่..." />
              </div>
            </div>
          </div>
        </section>

        <!-- 1.11 สถานการณ์ภายนอก -->
        <section class="topic-sec" id="sec-1-11">
          <div class="sec-head">
            <div class="sec-number">1.11</div><h2 class="sec-title">สถานการณ์ภายนอกหรือการพัฒนาที่จำเป็นต้องนำมาพิจารณาในการวางแผนหลักสูตร</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_11 }" @click="toggleDone('s1_11')">{{ doneState.s1_11 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div class="fs-grid full">
              <div class="fs-field">
                <label>11.1 สถานการณ์หรือการพัฒนาทางเศรษฐกิจ</label>
                <textarea v-model="form.econSituation" class="field"></textarea>
              </div>
              <div class="fs-field">
                <label>11.2 สถานการณ์หรือการพัฒนาทางสังคมและวัฒนธรรม</label>
                <textarea v-model="form.socialSituation" class="field"></textarea>
              </div>
            </div>
          </div>
        </section>

        <!-- 1.12 ผลกระทบจากข้อ 11.1 และ 11.2 -->
        <section class="topic-sec" id="sec-1-12">
          <div class="sec-head">
            <div class="sec-number">1.12</div><h2 class="sec-title">ผลกระทบจากข้อ 11.1 และ 11.2 ต่อการพัฒนาหลักสูตรและความเกี่ยวข้องกับพันธกิจของมหาวิทยาลัย</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_12 }" @click="toggleDone('s1_12')">{{ doneState.s1_12 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div class="fs-grid full">
              <div class="fs-field">
                <label>12.1 การพัฒนาหลักสูตร</label>
                <textarea v-model="form.devPlan" class="field"></textarea>
              </div>
              <div class="fs-field">
                <label>12.2 ความเกี่ยวข้องกับพันธกิจของมหาวิทยาลัย</label>
                <textarea v-model="form.universityMission" class="field"></textarea>
              </div>
            </div>
          </div>
        </section>

        <!-- 1.13 ความสัมพันธ์กับหลักสูตรอื่น -->
        <section class="topic-sec" id="sec-1-13">
          <div class="sec-head">
            <div class="sec-number">1.13</div><h2 class="sec-title">ความสัมพันธ์กับหลักสูตรอื่นที่เปิดสอนในคณะ/ภาควิชาอื่นของมหาวิทยาลัย</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s1_13 }" @click="toggleDone('s1_13')">{{ doneState.s1_13 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div class="fs-grid full">
              <div class="fs-field">
                <label>13.1 กลุ่มวิชา/รายวิชาในหลักสูตรนี้ที่เปิดสอนโดยคณะ/ภาควิชาอื่น</label>
                <textarea v-model="form.otherCoursesIn" class="field"></textarea>
              </div>
              <div class="fs-field">
                <label>13.2 กลุ่มวิชา/รายวิชาที่เปิดสอนให้ภาควิชา/หลักสูตรอื่นต้องมาเรียน</label>
                <textarea v-model="form.otherCoursesOut" class="field"></textarea>
              </div>
              <div class="fs-field">
                <label>13.3 การบริหารจัดการ</label>
                <textarea v-model="form.administration" class="field"></textarea>
              </div>
            </div>
          </div>
        </section>

      </div>

      <!-- Action Footer -->
      <div v-if="saveError" style="color:#9C4132; font-size:12.8px; margin-bottom:8px;">{{ saveError }}</div>
      <div class="page-footer">
        <button type="button" @click="router.push(`/?id=${form.id || ''}`)" class="nav-btn">
          ← <span>ข้อมูลสถาบันอุดมศึกษา</span>
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
.toc-grid { display: grid; gap: 4px 18px; }
.toc-item { display: flex; align-items: center; gap: 9px; padding: 7px 8px; border-radius: 7px; cursor: pointer; font-size: 13px; color: #26241E; border: 1px solid transparent; transition: all 0.2s; }
.toc-item:hover { background: #F3EFE4; }
.toc-num { font-family: 'Noto Serif Thai', serif; font-weight: 700; color: #A8793B; font-size: 12.5px; min-width: 28px; flex: none; }
.toc-dot { width: 7px; height: 7px; border-radius: 50%; background: #E3DCC9; flex: none; transition: background 0.2s; }
.toc-item.filled .toc-dot { background: #3F6B52; }
.toc-item span.lbl { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.paper-card { background: #fff; border: 1px solid #E3DCC9; border-radius: 10px; box-shadow: 0 18px 40px -18px rgba(27,42,74,.28); padding: 8px 42px 20px; position: relative; }

.topic-sec { padding: 26px 0 30px; border-bottom: 1px solid #E3DCC9; position: relative; }
.topic-sec:last-child { border-bottom: none; }
.topic-sec.pulse { animation: pulseSec 1.1s ease; }
@keyframes pulseSec { 0% { background: #EEE0C6; } 100% { background: transparent; } }

.sec-head { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 6px; }
.sec-number { font-family: 'Noto Serif Thai', serif; font-weight: 700; color: #A8793B; font-size: 17px; min-width: 44px; flex: none; }
.sec-title { font-size: 16.5px; font-weight: 600; color: #1B2A4A; flex: 1; margin: 0; line-height: 1.4; }
.sec-check { flex: none; border: 1px solid #E3DCC9; background: #fff; color: #736F60; border-radius: 7px; padding: 6px 12px; font-size: 11.8px; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s; }
.sec-check.on { background: #E4EEE7 !important; border-color: #3F6B52 !important; color: #3F6B52 !important; }
.sec-hint { font-size: 12.8px; color: #736F60; line-height: 1.7; margin: 2px 0 14px; padding-left: 56px; }
.sec-body { padding-left: 56px; }
@media (max-width:720px){ .sec-hint, .sec-body { padding-left: 0; } }

.fs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.fs-grid.full { grid-template-columns: 1fr; }
.fs-field label { display: block; font-size: 12.6px; font-weight: 600; color: #1B2A4A; margin-bottom: 6px; }
.fs-field label .lang-tag { font-size: 10.6px; font-weight: 500; background: #EEF1F9; color: #4D5FA8; padding: 1px 7px; border-radius: 4px; margin-left: 6px; }

/* Input, Select, Textarea */
.fs-field input[type=text], .fs-field input[type=number], .fs-field select, textarea.field {
  width: 100%; border: 1px solid #E3DCC9 !important; border-radius: 8px !important; 
  padding: 9px 12px !important; font-size: 13.6px !important; background: #FEFDFA !important; 
  color: #26241E !important; font-family: 'Sarabun', sans-serif !important; box-shadow: none !important; transition: all 0.2s; 
}
textarea.field { min-height: 100px; resize: vertical; line-height: 1.7; }
.fs-field select { cursor: pointer; }
.fs-field input:focus, .fs-field select:focus, textarea.field:focus { 
  outline: none !important; border-color: #A8793B !important; box-shadow: 0 0 0 3px #EEE0C6 !important; 
}

/* Radio Group */
.radio-group { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 2px; }
.radio-option { display: flex; align-items: center; gap: 7px; padding: 7px 14px; border: 1.4px solid #E3DCC9; border-radius: 20px; cursor: pointer; font-size: 12.8px; color: #26241E; background: #fff; transition: all 0.12s; }
.radio-option:hover { border-color: #A8793B; }
.radio-option.sel { border-color: #A8793B; background: #EEE0C6; color: #1B2A4A; font-weight: 600; }
.radio-option input { accent-color: #A8793B; }

/* Dynamic List Editor */
.list-editor .list-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 9px; }
.list-num { width: 24px; height: 24px; flex: none; margin-top: 3px; border-radius: 50%; background: #F3EFE4; display: flex; align-items: center; justify-content: center; font-size: 11.5px; font-weight: 700; color: #1B2A4A; font-family: 'Noto Serif Thai', serif; }
.list-row input { flex: 1; border: 1px solid #E3DCC9 !important; border-radius: 7px !important; padding: 9px 12px !important; font-size: 13.8px !important; background: #FEFDFA !important; box-shadow: none !important; outline: none !important; }
.list-row input:focus { border-color: #A8793B !important; box-shadow: 0 0 0 3px #EEE0C6 !important; }
.row-del { width: 30px; height: 30px; flex: none; border: 1px solid #E3DCC9; background: #fff; border-radius: 7px; color: #9C4132; font-size: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
.row-del:hover { background: #FBECE8; }
.add-row { margin-top: 6px; border: 1px dashed #C9BFA2; background: #FDFBF4; color: #A8793B; border-radius: 7px; padding: 8px 14px; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: 0.2s; }
.add-row:hover { background: #EEE0C6; }

/* Structured List */
.slist-item { display: flex; gap: 12px; align-items: flex-start; background: #F3EFE4; border: 1px solid #E3DCC9; border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; }
.slist-num { width: 26px; height: 26px; flex: none; border-radius: 50%; background: #1B2A4A; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; margin-top: 2px; font-family: 'Noto Serif Thai', serif; }
.slist-fields { flex: 1; min-width: 0; }
.slist-fields .fs-grid { margin-bottom: 0; }
.slist-fields .fs-field { margin-bottom: 10px; }
.slist-fields .fs-field:last-child { margin-bottom: 0; }
.slist-fields .fs-field input, .slist-fields .fs-field select, .slist-fields .fs-field textarea { background: #fff !important; }
.slist-del { flex: none; border: none; background: none; color: #9C4132; font-size: 17px; margin-top: 2px; border-radius: 5px; padding: 3px 6px; cursor: pointer; transition: 0.2s; }
.slist-del:hover { background: #FBECE8; }

.page-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 22px; }
.nav-btn { border: 1px solid #E3DCC9; background: #fff; border-radius: 8px; padding: 10px 16px; font-size: 13px; font-weight: 600; color: #1B2A4A; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
.nav-btn:hover:not([disabled]) { border-color: #A8793B; color: #A8793B; }
.nav-btn[disabled] { opacity: .35; pointer-events: none; }

.btn-brass { background: #1B2A4A; transition: all 0.2s; }
.btn-brass:hover { background: #2C3E63; }
</style>