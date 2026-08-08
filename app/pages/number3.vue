<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { ref, onMounted, computed } from 'vue'

const route = useRoute()
const router = useRouter()

<<<<<<< Updated upstream
// ================= State ข้อมูลฟอร์มหน้า 3 =================
const programId = ref<string | null>(null) // รับ ID จากหน้า 2

onMounted(() => {
  if (route.query.id) {
    programId.value = route.query.id as string
    // [Backend Task]: ยิง API GET /programs/{id}/courses เพื่อดึงโครงสร้างและ Mapping
  }
})

const categories = ref([{ name: 'หมวดวิชาศึกษาทั่วไป', credits: 30 }, { name: 'หมวดวิชาเฉพาะ', credits: 96 }, { name: 'หมวดวิชาเลือกเสรี', credits: 6 }])
function addCategory() { categories.value.push({ name: '', credits: 0 }) }
function removeCategory(i: number) { categories.value.splice(i, 1) }

interface Subject { id: string; code: string; nameTh: string; nameEn: string; credits: string; isHighlight?: boolean }
interface Semester { id: string; year: number; term: number; subjects: Subject[] }
const allSubjects: Subject[] = [{ id: '010313005', code: '010313005', nameEn: 'Physics I', nameTh: 'ฟิสิกส์ I', credits: '3(3-0-6)' }, { id: '010313006', code: '010313006', nameEn: 'Physics Laboratory I', nameTh: 'ปฏิบัติการฟิสิกส์ I', credits: '1(0-2-1)' }, { id: '040203111', code: '040203111', nameEn: 'Engineering Mathematics I', nameTh: 'คณิตศาสตร์วิศวกรรม I', credits: '3(3-0-6)' }, { id: '030543300', code: '030543300', nameEn: 'Electrical and Electronics Drawing', nameTh: 'วงจรไฟฟ้าและอิเล็กทรอนิกส์', credits: '3(2-2-5)', isHighlight: true }, { id: '080103001', code: '080103001', nameEn: 'English I', nameTh: 'ภาษาอังกฤษ I', credits: '3(3-0-6)' }]
const semesters = ref<Semester[]>([{ id: 's1-1', year: 1, term: 1, subjects: [] }, { id: 's1-2', year: 1, term: 2, subjects: [] }, { id: 's2-1', year: 2, term: 1, subjects: [] }, { id: 's2-2', year: 2, term: 2, subjects: [] }, { id: 's3-1', year: 3, term: 1, subjects: [] }, { id: 's3-2', year: 3, term: 2, subjects: [] }, { id: 's4-1', year: 4, term: 1, subjects: [] }, { id: 's4-2', year: 4, term: 2, subjects: [] }])

const showSearch = ref(false); const targetSemId = ref<string | null>(null); const searchQuery = ref(''); const totalCreditsInput = ref<number | null>(null)
const filteredSubjects = computed(() => { const q = searchQuery.value.trim().toLowerCase(); if (!q) return allSubjects; return allSubjects.filter(s => s.code.includes(q) || s.nameEn.toLowerCase().includes(q) || s.nameTh.includes(q)) })
function openSearch(semId: string) { targetSemId.value = semId; searchQuery.value = ''; showSearch.value = true }
function addSubjectToSem(subject: Subject) { const sem = semesters.value.find(s => s.id === targetSemId.value); if (!sem || sem.subjects.find(s => s.id === subject.id)) return; sem.subjects.push({ ...subject }); showSearch.value = false }
function removeSubject(semId: string, subjectId: string) { const sem = semesters.value.find(s => s.id === semId); if (sem) sem.subjects = sem.subjects.filter(s => s.id !== subjectId) }
function semCredits(sem: Semester) { return sem.subjects.reduce((acc, s) => acc + (parseInt(s.credits) || 0), 0) }

// ================= ระบบบันทึกข้อมูล (Save System) =================
const isSavingDraft = ref(false)
const isSavingNext = ref(false)

const saveDraft = async () => {
  isSavingDraft.value = true
  // 💾 DB: บันทึกข้อมูลลง PROGRAM (total_credits), COURSE_CATEGORY และ PROGRAM_COURSE อิงตาม programId.value
  await new Promise(r => setTimeout(r, 1000))
  isSavingDraft.value = false
  alert('บันทึกฉบับร่างเรียบร้อยแล้ว')
}

const saveAndNext = async () => {
  isSavingNext.value = true
  // 💾 DB: บันทึกข้อมูลหน้า 3 ลง Database
  await new Promise(r => setTimeout(r, 1000))
  isSavingNext.value = false
  router.push({ path: '/number4', query: { id: programId.value } })
=======
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase as string

// รายชื่อหัวข้อทั้ง 43 หัวข้อ
const sectionTitles = [
  "ระบบ", "การจัดการศึกษาภาคฤดูร้อน", "การเทียบเคียงหน่วยกิตในระบบทวิภาค", "วัน-เวลาในการดำเนินการเรียนการสอน", "คุณสมบัติของผู้เข้าศึกษา",
  "ปัญหาของนักศึกษาแรกเข้า", "กลยุทธ์ในการดำเนินการเพื่อแก้ไขปัญหาของนักศึกษาแรกเข้า", "แผนการรับนักศึกษาและผู้สำเร็จการศึกษาในระยะ 5 ปี", "งบประมาณรายรับ", "งบประมาณรายจ่าย",
  "ระบบการศึกษา", "การเทียบโอนหน่วยกิต รายวิชาและการลงทะเบียนเรียนข้ามมหาวิทยาลัย", "โครงสร้างหลักสูตร", "รายวิชา — หมวดวิชาศึกษาทั่วไป ก. กลุ่มวิชาภาษา", "รายวิชา — หมวดวิชาศึกษาทั่วไป ข. กลุ่มวิชาบูรณาการ",
  "รายวิชา — หมวดวิชาศึกษาทั่วไป ค. กลุ่มวิชาสังคมศาสตร์และมนุษยศาสตร์", "รายวิชา — หมวดวิชาศึกษาทั่วไป ง. กลุ่มวิชาวิทยาศาสตร์และคณิตศาสตร์", "รายวิชา — หมวดวิชาศึกษาทั่วไป จ. กลุ่มวิชากีฬาและนันทนาการ", "รายวิชา — หมวดวิชาเฉพาะ ก. กลุ่มวิชาแกน", "รายวิชา — กลุ่มวิชาชีพ (บังคับเฉพาะแขนง) แขนงวิชาโทรคมนาคม",
  "รายวิชา — กลุ่มวิชาชีพ (บังคับเฉพาะแขนง) แขนงวิชาคอมพิวเตอร์", "รายวิชา — กลุ่มวิชาชีพ (บังคับเฉพาะแขนง) แขนงวิชาเครื่องมือวัดและควบคุม", "รายวิชา — กลุ่มวิชาชีพ (บังคับเฉพาะแขนง) แขนงวิชาการกระจายเสียงวิทยุและโทรทัศน์", "รายวิชา — กลุ่มวิชาชีพ (เลือกเฉพาะแขนง) ทั้ง 4 แขนงวิชา", "รายวิชา — ค. ประสบการณ์ภาคสนามและวิชาชีพ / ง. กลุ่มวิชาฝึกงาน",
  "รายวิชา — หมวดวิชาเลือกเสรี", "แผนการศึกษา — แขนงวิชาโทรคมนาคม", "แผนการศึกษา — แขนงวิชาคอมพิวเตอร์", "แผนการศึกษา — แขนงวิชาเครื่องมือวัดและควบคุม", "แผนการศึกษา — แขนงวิชาการกระจายเสียงวิทยุและโทรทัศน์",
  "คำอธิบายรายวิชา", "อาจารย์ผู้สอน", "องค์ประกอบเกี่ยวกับประสบการณ์ภาคสนาม", "มาตรฐานผลการเรียนรู้ของประสบการณ์ภาคสนาม", "ช่วงเวลา (ประสบการณ์ภาคสนาม)",
  "การจัดเวลาและตารางสอน (ประสบการณ์ภาคสนาม)", "ข้อกำหนดเกี่ยวกับการทำโครงงานหรืองานวิจัย", "คำอธิบายโดยย่อ (โครงงานหรืองานวิจัย)", "มาตรฐานผลการเรียนรู้ (โครงงานหรืองานวิจัย)", "ช่วงเวลา (โครงงานหรืองานวิจัย)",
  "จำนวนหน่วยกิต (โครงงานหรืองานวิจัย)", "การเตรียมการ (โครงงานหรืองานวิจัย)", "กระบวนการประเมินผล (โครงงานหรืองานวิจัย)"
]

// Section indices (0-based) that are plain textareas with no dedicated
// table — these are stored in the generic program_learning_topic table.
const PLAIN_TEXT_INDICES = [0, 1, 2, 10, 11, 25, 32, 36, 37, 38, 39, 40, 41, 42]
// Section indices that are simple lists — also stored in
// program_learning_topic, but content is a JSON array string.
const LIST_INDICES = [4, 5, 6, 33, 34, 35]
// s3_8 (index 7) is a year-level x calendar-year matrix with no matching
// table shape — also stored as JSON in program_learning_topic.
const MATRIX_INDEX = 7
// 3.14-3.25 — 12 subject-group lists (object arrays), stored as JSON
const SUBJECT_GROUP_INDICES = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
// 3.27-3.30 — 4 branch study-plan tables (object arrays), stored as JSON
const STUDY_PLAN_INDICES = [26, 27, 28, 29]
// 3.31 — course descriptions (object array), stored as JSON
const COURSE_DESC_INDEX = 30

// ================= State ข้อมูลฟอร์ม =================
const form = ref<any>({
  id: null,
  sections: Array(43).fill(''),
  s3_4: { sem1: '', sem2: '', summer: '' },
  s3_5: [''], s3_6: [''], s3_7: [''], s3_34: [''], s3_35: [''], s3_36: [''],
  s3_8: [{ year: 'ชั้นปีที่ 1', y65: '120', y66: '120', y67: '120', y68: '120', y69: '120' }],
  s3_9: [{ detail: 'งบประมาณรายได้', y65: '4,032,000', y66: '4,112,640', y67: '4,194,893', y68: '4,278,790', y69: '4,364,367' }],
  s3_10: [{ category: 'ก. งบดำเนินการ', y65: '', y66: '', y67: '', y68: '', y69: '' }],
  s3_13: [{ group: '1) หมวดวิชาศึกษาทั่วไป', credits: '30' }],
  subjects: Array(12).fill(null).map(() => [{ code: '', credit: '', nameTh: '', nameEn: '', note: '' }]),
  s3_27: [{ sem: 'ปีที่ 1 / ภาค 1', code: '', name: '', credit: '' }],
  s3_28: [{ sem: 'ปีที่ 1 / ภาค 1', code: '', name: '', credit: '' }],
  s3_29: [{ sem: 'ปีที่ 1 / ภาค 1', code: '', name: '', credit: '' }],
  s3_30: [{ sem: 'ปีที่ 1 / ภาค 1', code: '', name: '', credit: '' }],
  s3_31: [{ code: '', credit: '', nameTh: '', nameEn: '', prereq: '', descTh: '', descEn: '' }],
  s3_32: [{ id: null as number | null, name: '', position: '', degree: '', research: '', loadNow: '', loadNew: '' }]
})

const YEAR_COLS = ['y65', 'y66', 'y67', 'y68', 'y69']
const YEAR_LABELS: Record<string, string> = { y65: '2565', y66: '2566', y67: '2567', y68: '2568', y69: '2569' }

// ================= Load existing program =================
const isLoading = ref(false)
const loadError = ref('')

function safeParseArray(json: string | null | undefined, fallback: any) {
  if (!json) return fallback
  try {
    const parsed = JSON.parse(json)
    return Array.isArray(parsed) && parsed.length ? parsed : fallback
  } catch {
    return fallback
  }
}

async function loadProgram(id: string | number) {
  isLoading.value = true
  loadError.value = ''
  programId.value = String(id)
  form.value.id = id
  try {
    const data: any = await $fetch(`${API_BASE}/programs/${id}`)

    // plain-text + list + matrix sections, from program_learning_topic
    const topics: any[] = data.learning_topics ?? []
    const byNo = (no: string) => topics.find(t => t.topic_no === no)

    PLAIN_TEXT_INDICES.forEach(i => {
      form.value.sections[i] = byNo(`3.${i + 1}`)?.content ?? ''
    })
    LIST_INDICES.forEach(i => {
      const key = `s3_${i + 1}`
      form.value[key] = safeParseArray(byNo(`3.${i + 1}`)?.content, [''])
    })
    form.value.s3_8 = safeParseArray(
      byNo(`3.${MATRIX_INDEX + 1}`)?.content,
      [{ year: 'ชั้นปีที่ 1', y65: '', y66: '', y67: '', y68: '', y69: '' }]
    )

    // 3.14-3.25 — subject groups
    SUBJECT_GROUP_INDICES.forEach((i, groupIdx) => {
      form.value.subjects[groupIdx] = safeParseArray(
        byNo(`3.${i + 1}`)?.content,
        [{ code: '', credit: '', nameTh: '', nameEn: '', note: '' }]
      )
    })

    // 3.27-3.30 — branch study plans
    STUDY_PLAN_INDICES.forEach(i => {
      const key = `s3_${i + 1}`
      form.value[key] = safeParseArray(
        byNo(`3.${i + 1}`)?.content,
        [{ sem: 'ปีที่ 1 / ภาค 1', code: '', name: '', credit: '' }]
      )
    })

    // 3.31 — course descriptions
    form.value.s3_31 = safeParseArray(
      byNo(`3.${COURSE_DESC_INDEX + 1}`)?.content,
      [{ code: '', credit: '', nameTh: '', nameEn: '', prereq: '', descTh: '', descEn: '' }]
    )

    // 3.4 — program_schedule
    const schedules: any[] = data.schedules ?? []
    const byType = (t: string) => schedules.find(s => s.semester_type === t)?.schedule_text ?? ''
    form.value.s3_4 = { sem1: byType('semester1'), sem2: byType('semester2'), summer: byType('summer') }

    // 3.9 / 3.10 — budget, un-flatten rows back into the year-columns table
    const groupByLabel = (rows: any[], labelKey: string) => {
      const grouped: Record<string, any> = {}
      rows.forEach(r => {
        const label = r[labelKey] ?? ''
        if (!grouped[label]) grouped[label] = { [labelKey]: label, y65: '', y66: '', y67: '', y68: '', y69: '' }
        const col = Object.keys(YEAR_LABELS).find(k => YEAR_LABELS[k] === r.year_label)
        if (col) grouped[label][col] = r.amount != null ? String(r.amount) : ''
      })
      return Object.values(grouped)
    }
    form.value.s3_9 = data.budget_incomes?.length ? groupByLabel(data.budget_incomes, 'detail') : form.value.s3_9
    form.value.s3_10 = data.budget_expenses?.length ? groupByLabel(data.budget_expenses, 'category') : form.value.s3_10

    // 3.13 — course_category
    form.value.s3_13 = data.course_categories?.length
      ? [...data.course_categories].sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((c: any) => ({ group: c.name_th ?? '', credits: c.required_credits != null ? String(c.required_credits) : '' }))
      : form.value.s3_13

    // 3.32 — reuses the same program_instructor rows as page 1, merged in place
    form.value.s3_32 = data.instructors?.length
      ? data.instructors.map((x: any) => ({
          id: x.id,
          name: x.name ?? '',
          position: x.position ?? '',
          degree: x.degree ?? '',
          research: x.research ?? '',
          loadNow: x.load_now != null ? String(x.load_now) : '',
          loadNew: x.load_new != null ? String(x.load_new) : ''
        }))
      : [{ id: null, name: '', position: '', degree: '', research: '', loadNow: '', loadNew: '' }]
  } catch (err: any) {
    console.error('Failed to load program', err)
    const status = err?.response?.status ?? err?.statusCode
    if (status === 404) {
      loadError.value = 'ไม่พบข้อมูลหลักสูตรนี้แล้ว กำลังพากลับไปหน้า 1'
      router.replace({ path: '/number1' })
    } else {
      loadError.value = 'โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่'
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (route.query.id) loadProgram(route.query.id as string)
})

// ================= AI Integration =================
const handleAIGenerate = (section: string, payload?: any) => {
  console.log('Trigger AI Generation for:', section, payload)
  alert(`กำลังเรียกใช้ AI สำหรับหมวด: ${section}\nข้อมูลอ้างอิง: ${payload || 'ไม่มี'}\n(รอ Backend เชื่อมต่อ API)`)
}

// ================= Helper Functions =================
const addList = (key: string) => { form.value[key].push('') }
const removeList = (key: string, idx: number) => { form.value[key].splice(idx, 1); if (form.value[key].length === 0) form.value[key].push('') }

const addTable = (key: string, emptyObj: any) => { form.value[key].push(emptyObj) }
const removeTable = (key: string, idx: number, emptyObj: any) => { form.value[key].splice(idx,1); if(form.value[key].length === 0) form.value[key].push(emptyObj) }

const addSubject = (idx: number) => { form.value.subjects[idx].push({ code: '', credit: '', nameTh: '', nameEn: '', note: '' }) }
const removeSubject = (idx: number, itemIdx: number) => { form.value.subjects[idx].splice(itemIdx, 1); if(form.value.subjects[idx].length === 0) form.value.subjects[idx].push({ code: '', credit: '', nameTh: '', nameEn: '', note: '' }) }

const addS3_31 = () => { form.value.s3_31.push({ code: '', credit: '', nameTh: '', nameEn: '', prereq: '', descTh: '', descEn: '' }) }
const removeS3_31 = (idx: number) => { form.value.s3_31.splice(idx, 1); if(form.value.s3_31.length === 0) form.value.s3_31.push({ code: '', credit: '', nameTh: '', nameEn: '', prereq: '', descTh: '', descEn: '' }) }

const deletedInstructorIds: number[] = []
const addS3_32 = () => { form.value.s3_32.push({ id: null, name: '', position: '', degree: '', research: '', loadNow: '', loadNew: '' }) }
const removeS3_32 = (idx: number) => {
  const removed = form.value.s3_32[idx]
  if (removed?.id) deletedInstructorIds.push(removed.id)
  form.value.s3_32.splice(idx, 1)
  if(form.value.s3_32.length === 0) form.value.s3_32.push({ id: null, name: '', position: '', degree: '', research: '', loadNow: '', loadNew: '' })
}

const doneState = ref<Record<number, boolean>>({})
const toggleDone = (index: number) => { doneState.value[index] = !doneState.value[index] }

// ================= Save helpers =================
async function replaceChildren(id: string | number, resource: string, items: any[]) {
  const existing: any[] = await $fetch(`${API_BASE}/programs/${id}/${resource}/`)
  await Promise.all(existing.map(e => $fetch(`${API_BASE}/programs/${id}/${resource}/${e.id}`, { method: 'DELETE' })))
  for (const item of items) {
    await $fetch(`${API_BASE}/programs/${id}/${resource}/`, { method: 'POST', body: item })
  }
}

function flattenYearTable(rows: any[], labelKey: string) {
  const out: any[] = []
  rows.forEach((row, i) => {
    YEAR_COLS.forEach(col => {
      const raw = row[col]
      if (raw === '' || raw == null) return
      const amount = Number(String(raw).replace(/,/g, ''))
      if (Number.isNaN(amount)) return
      out.push({ [labelKey]: row[labelKey] || '', year_label: YEAR_LABELS[col], amount, sort_order: i })
    })
  })
  return out
}

async function saveAll() {
  const id = form.value.id
  if (!id) throw new Error('ต้องกรอกหน้า 1 และบันทึกก่อน จึงจะมี program id')

  // plain-text + list + matrix sections -> program_learning_topic
  const topicItems: any[] = []
  PLAIN_TEXT_INDICES.forEach(i => {
    if (form.value.sections[i]?.trim()) {
      topicItems.push({ topic_no: `3.${i + 1}`, title: sectionTitles[i], content: form.value.sections[i], sort_order: i })
    }
  })
  LIST_INDICES.forEach(i => {
    const items = (form.value[`s3_${i + 1}`] as string[]).filter(v => v.trim())
    if (items.length) {
      topicItems.push({ topic_no: `3.${i + 1}`, title: sectionTitles[i], content: JSON.stringify(items), sort_order: i })
    }
  })
  const matrixRows = form.value.s3_8.filter((r: any) => r.year.trim() || YEAR_COLS.some(c => r[c]))
  if (matrixRows.length) {
    topicItems.push({
      topic_no: `3.${MATRIX_INDEX + 1}`, title: sectionTitles[MATRIX_INDEX],
      content: JSON.stringify(matrixRows), sort_order: MATRIX_INDEX
    })
  }

  // 3.14-3.25 — subject groups
  SUBJECT_GROUP_INDICES.forEach((i, groupIdx) => {
    const items = form.value.subjects[groupIdx].filter((s: any) => s.code.trim() || s.nameTh.trim() || s.nameEn.trim())
    if (items.length) {
      topicItems.push({ topic_no: `3.${i + 1}`, title: sectionTitles[i], content: JSON.stringify(items), sort_order: i })
    }
  })

  // 3.27-3.30 — branch study plans
  STUDY_PLAN_INDICES.forEach(i => {
    const items = (form.value[`s3_${i + 1}`] as any[]).filter(r => r.code.trim() || r.name.trim())
    if (items.length) {
      topicItems.push({ topic_no: `3.${i + 1}`, title: sectionTitles[i], content: JSON.stringify(items), sort_order: i })
    }
  })

  // 3.31 — course descriptions
  const courseDescItems = form.value.s3_31.filter((c: any) => c.code.trim() || c.nameTh.trim() || c.nameEn.trim())
  if (courseDescItems.length) {
    topicItems.push({
      topic_no: `3.${COURSE_DESC_INDEX + 1}`, title: sectionTitles[COURSE_DESC_INDEX],
      content: JSON.stringify(courseDescItems), sort_order: COURSE_DESC_INDEX
    })
  }
  await replaceChildren(id, 'learning-topics', topicItems)

  // 3.4 -> program_schedule
  const scheduleItems = [
    { semester_type: 'semester1', schedule_text: form.value.s3_4.sem1 || null },
    { semester_type: 'semester2', schedule_text: form.value.s3_4.sem2 || null },
    { semester_type: 'summer', schedule_text: form.value.s3_4.summer || null }
  ].filter(s => s.schedule_text)
  await replaceChildren(id, 'schedule', scheduleItems)

  // 3.9 / 3.10 -> budget income / expense, flattened
  await replaceChildren(id, 'budget-income', flattenYearTable(form.value.s3_9, 'detail'))
  await replaceChildren(id, 'budget-expense', flattenYearTable(form.value.s3_10, 'category'))

  // 3.13 -> course_category
  const categoryItems = form.value.s3_13
    .filter((c: any) => c.group.trim())
    .map((c: any, i: number) => ({
      name_th: c.group,
      required_credits: c.credits ? Number(c.credits) : null,
      sort_order: i
    }))
  await replaceChildren(id, 'course-categories', categoryItems)

  // 3.32 -> program_instructor, merged in place (shared with page 1)
  for (const del of deletedInstructorIds) {
    await $fetch(`${API_BASE}/programs/${id}/instructors/${del}`, { method: 'DELETE' }).catch(() => {})
  }
  deletedInstructorIds.length = 0

  for (const item of form.value.s3_32) {
    if (!item.name.trim()) continue
    const body = {
      name: item.name,
      position: item.position || null,
      degree: item.degree || null,
      research: item.research || null,
      load_now: item.loadNow ? Number(item.loadNow) : null,
      load_new: item.loadNew ? Number(item.loadNew) : null
    }
    if (item.id) {
      const saved: any = await $fetch(`${API_BASE}/programs/${id}/instructors/${item.id}`, { method: 'PUT', body })
      item.id = saved.id
    } else {
      const saved: any = await $fetch(`${API_BASE}/programs/${id}/instructors/`, {
        method: 'POST',
        body: { ...body, branch: '', instructor_type: 'responsible', sort_order: 0 }
      })
      item.id = saved.id
    }
  }
}

// ================= ระบบบันทึกข้อมูล =================
const isSavingDraft = ref(false)
const isSavingNext = ref(false)
const saveError = ref('')

const saveDraft = async () => {
  isSavingDraft.value = true
  saveError.value = ''
  try {
    await saveAll()
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
    await saveAll()
    router.push({ path: '/number4', query: { id: programId.value } })
  } catch (err) {
    console.error('Save and next failed', err)
    saveError.value = 'บันทึกไม่สำเร็จ กรุณาลองใหม่'
  } finally {
    isSavingNext.value = false
  }
}

const scrollToSec = (id: string) => {
  const el = document.getElementById(id)
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.classList.add('pulse'); setTimeout(() => el.classList.remove('pulse'), 1200) }
>>>>>>> Stashed changes
}
// =============================================================
</script>

<template>
  <div class="w-full p-4 md:p-6">
    <UForm class="w-full">
      <div class="w-full shadow-md border border-gray-200 rounded-2xl overflow-hidden bg-white">
        
        <div class="bg-[#1a2744] px-6 py-5 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-[#c8a84b] flex items-center justify-center text-white font-bold">3</div>
          <p class="text-white font-bold text-xl tracking-wide font-sans m-0">โครงสร้างหลักสูตร รายวิชา และหน่วยกิต</p>
        </div>

        <div class="p-6 md:p-8 space-y-8">
          <!-- ❗❗❗ คอมเมนต์อ้างอิงตาม ER Diagram (image_ed9000.jpg) ❗❗❗ -->

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-200 shadow-sm">
            <p class="text-[#1a2744] font-bold text-lg border-b-2 border-[#c8a84b] pb-2 inline-block mb-4 m-0">1. จำนวนหน่วยกิตรวมตลอดหลักสูตร</p>
            <!-- ✅ DB: ตาราง PROGRAM (total_credits) -->
            <UFormField label="จำนวนหน่วยกิตรวม" :ui="{ label: 'text-gray-800 font-bold' }">
              <UInput v-model="totalCreditsInput" type="number" class="w-full md:w-1/3 bg-white" placeholder="เช่น 138" />
            </UFormField>
          </div>

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-200 shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <p class="text-[#1a2744] font-bold text-lg border-b-2 border-[#c8a84b] pb-2 m-0">2. โครงสร้างหลักสูตร</p>
              <UButton variant="outline" icon="i-heroicons-plus" class="border border-[#1a2744] text-[#1a2744] bg-white hover:bg-gray-50" @click="addCategory">
                เพิ่มหมวดวิชา
              </UButton>
            </div>
            
            <div v-for="(cat, i) in categories" :key="i" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-end bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <!-- ✅ DB: ตาราง COURSE_CATEGORY (program_id, name_th) -->
              <UFormField label="หมวดวิชา" :ui="{ label: 'text-gray-700 font-bold text-sm' }">
                <UInput v-model="cat.name" class="w-full bg-white" placeholder="เช่น หมวดวิชาศึกษาทั่วไป" />
              </UFormField>
              <div class="flex gap-3 items-end">
                <!-- ✅ DB: ตาราง COURSE_CATEGORY (required_credits) -->
                <UFormField label="จำนวนหน่วยกิต" :ui="{ label: 'text-gray-700 font-bold text-sm' }" class="flex-1">
                  <UInput v-model.number="cat.credits" type="number" class="w-full bg-white" placeholder="30" />
                </UFormField>
                <UButton icon="i-heroicons-trash" color="neutral" variant="soft" class="mb-0.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" @click="removeCategory(i)" />
              </div>
            </div>

            <div class="flex justify-between items-center mt-4 bg-[#243360] text-white rounded-lg p-4 shadow-inner">
              <p class="font-bold text-base m-0">รวมทั้งหมด</p>
              <p class="font-bold text-xl text-[#e8c96a] m-0">{{ categories.reduce((a, c) => a + (c.credits || 0), 0) }} <span class="text-sm font-normal text-white">หน่วยกิต</span></p>
            </div>
          </div>

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-200 shadow-sm">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 border-b-2 border-[#d8d2c6] pb-3">
              <div class="flex items-center gap-2">
                <p class="text-[#1a2744] font-bold text-lg m-0">3. แผนการศึกษา (Curriculum Mapping)</p>
                <UBadge variant="soft" class="font-bold rounded-lg bg-yellow-100 text-yellow-700"><UIcon name="i-heroicons-sparkles" class="mr-1"/> AI Assisted</UBadge>
              </div>
              <p class="text-gray-500 text-sm mt-2 md:mt-0 flex items-center gap-1 m-0">
                <UIcon name="i-heroicons-information-circle" class="w-5 h-5"/> ลากวางเพื่อย้ายวิชาระหว่างภาค
              </p>
            </div>

            <!-- ❌ DB: ตาราง PROGRAM_COURSE เชื่อมกับ PROGRAM_SEMESTER และ COURSE -->
            <div class="overflow-x-auto pb-4 custom-scrollbar w-full">
              <div class="flex gap-4 min-w-max px-2">
                <div v-for="sem in semesters" :key="sem.id" class="flex flex-col w-64 shadow-sm">
                  <div class="bg-[#1a2744] text-white text-center py-2 px-1 rounded-t-lg">
                    <p class="text-sm font-bold m-0">ปีที่ {{ sem.year }}</p>
                    <p class="text-xs text-[#e8c96a] m-0">ภาคเรียนที่ {{ sem.term }}</p>
                  </div>
                  <VueDraggable v-model="sem.subjects" group="subjects" :animation="200" ghost-class="opacity-30" class="flex-1 min-h-[10rem] bg-white border-x border-gray-200 p-2 space-y-2">
                    <div v-for="subject in sem.subjects" :key="subject.id" class="relative group rounded-lg border text-xs p-3 cursor-grab active:cursor-grabbing select-none transition-shadow hover:shadow-md" :class="subject.isHighlight ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'">
                      <button class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white hidden group-hover:flex items-center justify-center text-[10px] z-10 shadow-sm" @click.stop="removeSubject(sem.id, subject.id)">✕</button>
                      <p class="font-mono font-bold text-blue-900 text-xs mb-1 m-0">{{ subject.code }}</p>
                      <p class="font-medium leading-tight line-clamp-2 text-gray-800 text-xs mb-2 m-0">{{ subject.nameEn }}</p>
                      <UBadge color="neutral" variant="solid" class="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 border border-gray-200">{{ subject.credits }}</UBadge>
                    </div>
                  </VueDraggable>
                  <div class="bg-gray-50 border border-t-0 border-gray-200 rounded-b-lg px-3 py-2 flex items-center justify-between">
                    <span class="text-xs text-gray-600 font-bold m-0">{{ semCredits(sem) }} <span class="font-normal text-[10px]">หน่วยกิต</span></span>
                    <UButton icon="i-heroicons-plus" size="sm" color="neutral" variant="soft" class="rounded-full bg-white shadow-sm hover:bg-gray-100 border border-gray-200" @click="openSearch(sem.id)" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ปุ่ม Action -->
          <div class="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
            <UButton :to="`/number2?id=${programId || ''}`" variant="ghost" class="text-gray-500 hover:text-[#1a2744] px-6 py-3 text-base bg-white hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 w-full md:w-auto text-center justify-center">← ย้อนกลับ</UButton>
            <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <UButton color="neutral" variant="outline" class="px-6 py-3 text-base font-bold rounded-xl border-gray-300 hover:bg-gray-50 bg-white justify-center" :loading="isSavingDraft" @click="saveDraft()">
                <UIcon name="i-heroicons-document-text" class="mr-2 w-5 h-5" /> บันทึกฉบับร่าง
              </UButton>
              <UButton class="bg-[#1a2744] hover:bg-[#243360] text-white px-8 py-3 text-lg font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-1 justify-center" :loading="isSavingNext" @click="saveAndNext()">
                บันทึกและถัดไป <UIcon name="i-heroicons-arrow-right" class="ml-2 w-5 h-5"/>
              </UButton>
            </div>
          </div>

        </div>
      </div>
    </UForm>
  </div>

  <!-- Search Modal -->
  <UModal v-model:open="showSearch" title="ค้นหารายวิชา" :ui="{ content: 'max-w-2xl' }">
    <template #body>
      <UInput v-model="searchQuery" placeholder="ค้นหารหัสวิชา หรือชื่อวิชา..." icon="i-heroicons-magnifying-glass" autofocus size="lg" class="mb-4" />
      <div class="max-h-96 overflow-y-auto space-y-2 pr-1">
        <div v-for="subject in filteredSubjects" :key="subject.id" class="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all" @click="addSubjectToSem(subject)">
          <div class="flex items-center gap-3">
            <UBadge :label="subject.code" color="neutral" :class="subject.isHighlight ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'" variant="soft" size="sm" />
            <div>
              <p class="font-bold text-sm text-gray-900 m-0">{{ subject.nameEn }}</p>
              <p class="text-xs text-gray-500 m-0">{{ subject.nameTh }}</p>
            </div>
          </div>
          <UBadge :label="subject.credits" color="neutral" variant="solid" size="sm" class="bg-gray-100 text-gray-700 border border-gray-200" />
        </div>
        <div v-if="filteredSubjects.length === 0" class="text-center py-10 text-gray-400">
          <UIcon name="i-heroicons-magnifying-glass" class="w-8 h-8 mx-auto mb-2" />
          <p class="text-sm m-0">ไม่พบรายวิชาที่ค้นหา</p>
        </div>
      </div>
    </template>
  </UModal>
</template>