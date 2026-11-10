<!-- pages/curriculum/[id].vue -->
<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  createObe2,
  normalizeObe2,
  buildObe2Payload,
  parseJsonValue
} from '~/utils/obe2'

// === Vue Flow Imports ===
import { VueFlow, useVueFlow, Handle, Position, MarkerType, ConnectionMode } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import FlowArrow from '~/components/FlowArrow.vue'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

const route = useRoute()
const router = useRouter()

const goHome = () => {
  if (import.meta.client) window.location.assign('/')
}

// ใช้ API base กลาง (รองรับการเข้าผ่าน LAN ด้วย)
const API_BASE = useApiBase()

// === View System ===
const activeTab = ref<'structure' | 'flow'>('structure')
const activeView = ref<'sections' | 'structure' | 'flow'>('sections')
const activeSection = ref('1.1')
const programId = ref<number | null>(null)
const isNewProgram = ref(route.query.type === 'new')

const curriculum = ref({
  id: route.params.id,
  name: '',
  type: 'สร้างหลักสูตรใหม่',
  totalCredit: 132
})

// OBE 2 components 1–2 (sections 1.1–2.7)
const obe2 = ref(createObe2())

const printCurriculumMeta = computed(() => ({
  ...curriculum.value,
  name: curriculum.value.name || obe2.value.nameTh
}))

// Sidebar groups follow the user's requested order. 2.3 (PEO) intentionally
// sits after 2.6 and contains the 6.7 PLO–PEO matrix.
const navGroups = [
  {
    key: 'c1',
    badge: '1',
    title: 'ข้อมูลทั่วไป',
    items: [
      { id: '1.1', code: '1.1', title: 'รหัสและชื่อหลักสูตร' },
      { id: '1.2', code: '1.2', title: 'ชื่อปริญญาและสาขาวิชา' },
      { id: '1.3', code: '1.3', title: 'วิชาเอก' },
      { id: '1.4', code: '1.4', title: 'รูปแบบของหลักสูตร' },
      { id: '1.5', code: '1.5', title: 'สถานภาพของหลักสูตรและการพิจารณาอนุมัติ/เห็นชอบ' }
    ]
  },
  {
    key: 'c2',
    badge: '2',
    title: 'ข้อมูลเฉพาะของหลักสูตร',
    items: [
      { id: '2.1', code: '2.1', title: 'ปรัชญาของหลักสูตร' },
      { id: '2.2', code: '2.2', title: 'ความสำคัญของหลักสูตร' },
      { id: '2.4', code: '2.4', title: 'จุดเด่นเฉพาะของหลักสูตร' },
      { id: '2.5', code: '2.5', title: 'อาชีพที่สามารถประกอบได้หลังสำเร็จการศึกษา' },
      { id: '2.6', code: '2.6', title: 'ผลลัพธ์การเรียนรู้' },
      { id: '2.3', code: '2.3', title: 'วัตถุประสงค์ของหลักสูตร (PEO)' },
      { id: '2.7', code: '2.7', title: 'ความคาดหวังของผลลัพธ์การเรียนรู้' }
    ]
  },
  {
    key: 'c3',
    badge: '3',
    title: 'องค์ประกอบที่ 3',
    items: [
      { id: 'structure', code: '3', title: 'โครงสร้างหลักสูตรและรายวิชา' }
    ]
  },
  {
    key: 'app',
    badge: 'ผ',
    title: 'ภาคผนวก',
    items: [
      { id: 'flow', code: '2', title: 'แผนภูมิความต่อเนื่องของหลักสูตร' }
    ]
  }
]

const selectView = (id: string) => {
  if (id === 'structure') {
    activeView.value = 'structure'
    activeTab.value = 'structure'
  } else if (id === 'flow') {
    activeView.value = 'flow'
    activeTab.value = 'flow'
  } else {
    activeView.value = 'sections'
    activeSection.value = id
  }
  scrollContentTop()
}

const scrollContentTop = () => {
  if (!import.meta.client) return
  nextTick(() => {
    document.querySelector('.builder-content')?.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

const hasText = (value: any) => typeof value === 'string' && value.trim().length > 0

const isSectionDone = (id: string) => {
  const d = obe2.value
  switch (id) {
    case '1.1': return hasText(d.programCode) || hasText(d.nameTh)
    case '1.2': return hasText(d.degreeNameTh) || hasText(d.degreeNameEn)
    case '1.3': return d.majors.some((x: string) => hasText(x))
    case '1.4': return hasText(d.programFormat) || hasText(d.programType)
    case '1.5': return hasText(d.approvalStatus) || d.approvals.some((a: any) => hasText(a.committee))
    case '2.1': return hasText(d.philosophy)
    case '2.2': return [d.importanceOverview, d.importanceEconomic, d.importanceSocial, d.impactDevelopment, d.universityMission, d.curriculumRelationExternal, d.curriculumRelationInternal, d.curriculumRelationManagement].some((value: string) => hasText(value))
    case '2.4': return hasText(d.uniqueness)
    case '2.5': return d.careers.some((x: string) => hasText(x))
    case '2.6': return d.plos.some((p: any) => hasText(p.description))
    case '2.3': return d.peos.some((p: any) => hasText(p.description))
    case '2.7': return d.ylos.some((y: any) => hasText(y.description))
    case 'structure': return Object.values(slots.value).some((codes: any) => Array.isArray(codes) && codes.length > 0)
    case 'flow': return vueFlowNodes.value.some(n => n.type === 'customCourse')
    default: return false
  }
}

// คลังวิชา (ดึงจาก API)
const courseBank = ref<any[]>([])
const isLoadingBank = ref(false)

const fetchCourseBank = async () => {
  isLoadingBank.value = true
  try {
    const data = await $fetch<any[]>(`${API_BASE}/courses/`)
    courseBank.value = (data || []).map(c => {
      const parsed = parseInt(c.credit_total)
      const fromText = parseInt(String(c.credits || '').split('(')[0])
      return {
        code: c.id,
        nameTh: c.name_th || '',
        nameEn: c.name_en || '',
        credits: c.credits || '',
        cVal: Number.isFinite(parsed) ? parsed : (Number.isFinite(fromText) ? fromText : 0),
        cat: 'core',
        pre: c.prerequisites || [],
        co: c.corequisites || [],
        descTh: c.description_th || '',
        descEn: c.description_en || ''
      }
    })
  } catch (err) {
    console.error('Failed to fetch course bank:', err)
  } finally {
    isLoadingBank.value = false
  }
}

const categoryMap = ref<Record<string, number>>({})

const flattenStructure = (nodes: any[], out: any[] = []): any[] => {
  for (const node of nodes || []) {
    out.push(node)
    if (node.children?.length) flattenStructure(node.children, out)
  }
  return out
}

// เติมข้อมูลจาก builder state ที่บันทึกไว้ (structure/slots/flow)
const applyBuilderState = (state: any) => {
  if (!state) return

  if (state.name_th) {
    if (!obe2.value.nameTh) obe2.value.nameTh = state.name_th
    if (!curriculum.value.name) curriculum.value.name = state.name_th
  } else {
    if (!curriculum.value.name) curriculum.value.name = obe2.value.nameTh || state.name_en || curriculum.value.name
  }
  if (state.total_credits !== null && state.total_credits !== undefined) curriculum.value.totalCredit = state.total_credits

  if (Array.isArray(state.structure) && state.structure.length) {
    structure.value = state.structure
  }

  if (state.slots && typeof state.slots === 'object') {
    const next: Record<string, string[]> = {}
    Object.keys(slots.value).forEach(k => { next[k] = [] })
    Object.entries(state.slots).forEach(([key, codes]) => {
      next[key] = Array.isArray(codes) ? [...codes] as string[] : []
    })
    slots.value = next
  }

  // map category_id ของ DB เข้ากับ slot ตามลำดับ node ใน structure
  const flat = flattenStructure(structure.value)
  const categories = [...(state.categories || [])].sort((a: any, b: any) => a.sort_order - b.sort_order)
  categories.forEach((cat: any, index: number) => {
    const node = flat[index]
    if (node?.id) categoryMap.value[node.id] = cat.id
  })

  // รองรับข้อมูลเก่าที่ไม่มี state: กู้รายวิชาจาก category-assignments
  if ((!state.slots || Object.keys(state.slots).length === 0) && Array.isArray(state.assignments)) {
    state.assignments.forEach((assignment: any) => {
      const entry = Object.entries(categoryMap.value).find(([, id]) => id === assignment.category_id)
      const slotId = entry?.[0]
      if (slotId && slots.value[slotId] && !slots.value[slotId].includes(assignment.course_id)) {
        slots.value[slotId].push(assignment.course_id)
      }
    })
  }

  if (state.flow_map?.nodes?.length) {
    vueFlowNodes.value = [
      ...makeHeaderNodes(),
      ...state.flow_map.nodes.filter((n: any) => n?.type === 'customCourse')
    ]
    vueFlowEdges.value = Array.isArray(state.flow_map.edges)
      ? state.flow_map.edges.map((edge: any) => ({
          ...edge,
          type: 'flowArrow',
          deletable: false,
          data: { ...(edge?.data || {}), autoPrerequisite: true }
        }))
      : []
  }
}

const asArray = (value: any) => (Array.isArray(value) ? value : [])

// แปลงข้อมูล Program ที่มีอยู่ให้เป็นรูปแบบ OBE 2 sections 1–2
const applyProgramData = (program: any) => {
  if (!program) return

  programId.value = Number(program.id) || null
  isNewProgram.value = false
  curriculum.value.type = 'สร้างหลักสูตรใหม่'
  if (program.total_credits !== null && program.total_credits !== undefined) {
    curriculum.value.totalCredit = program.total_credits
  }

  // ข้อมูลหลัก (1–2) ถูกเก็บแบบ blob ไว้ใน learning-topics เพื่อให้ mapping
  // ตารางทุกตัว round-trip ได้ครบ ส่วนข้อมูลด้านล่างเป็น fallback ของหลักสูตรเก่า
  const blob = asArray(program.learning_topics).find((topic: any) => topic.topic_no === 'obe2')
  if (blob?.content) {
    const parsed = parseJsonValue(blob.content, null)
    if (parsed && typeof parsed === 'object') {
      const merged = normalizeObe2(parsed)
      if (!merged.nameTh) merged.nameTh = program.name_th || ''
      obe2.value = merged
      return
    }
  }

  const objectives = parseJsonValue(program.objectives, null)
  const peos = Array.isArray(objectives)
    ? objectives.map((item: any, index: number) => ({
        code: item?.code || `PEO ${index + 1}`,
        description: item?.description || item?.desc || String(item || '')
      }))
    : (program.objectives
        ? [{ code: 'PEO 1', description: String(program.objectives) }]
        : [])

  obe2.value = normalizeObe2({
    programCode: program.program_code || '',
    nameTh: program.name_th || '',
    nameEn: program.name_en || '',
    degreeNameTh: program.degree_name_th || '',
    degreeAbbrTh: program.degree_abbr_th || '',
    degreeNameEn: program.degree_name_en || '',
    degreeAbbrEn: program.degree_abbr_en || '',
    majors: asArray(program.majors).map((row: any) => row.major_name || row.name || '').filter(Boolean),
    programFormat: program.program_format || '',
    durationYears: program.duration_years ? String(program.duration_years) : '',
    programCategory: program.program_category || '',
    programType: program.program_type || '',
    language: program.language || 'ภาษาไทย',
    admissionReq: program.admission_req || '',
    cooperation: program.cooperation || '',
    degreeGranting: program.degree_granting || '',
    approvalStatus: program.approval_details || '',
    approvals: asArray(program.approvals).map((row: any) => ({
      committee: row.committee_name || row.committee || '',
      approvalDate: row.approval_date || '',
      note: row.note || row.decision || ''
    })),
    philosophy: program.philosophy || '',
    importanceOverview: program.importance || '',
    importanceEconomic: program.economic_situation || '',
    importanceSocial: program.social_situation || '',
    impactDevelopment: program.development_plan || '',
    universityMission: program.university_mission || '',
    developmentPlans: asArray(program.development_plans).map((row: any) => ({
      plan: row.plan || row.plan_name || '',
      strategy: row.strategy || '',
      indicator: row.indicator || row.kpi || ''
    })),
    uniqueness: program.uniqueness || '',
    careers: asArray(program.careers_list).map((row: any) => row.career_name || row.name || '').filter(Boolean),
    plos: asArray(program.plos).map((row: any) => ({
      code: row.plo_code || row.code || '',
      type: row.outcome_type === 'G' ? 'G' : 'S',
      description: row.description_th || row.description || '',
      teaching: '',
      assessment: ''
    })),
    ylos: asArray(program.ylos).map((row: any, index: number) => ({
      year: row.year ? String(row.year) : '1',
      code: `YLO ${row.year || 1}.${index + 1}`,
      description: row.description || ''
    })),
    peos
  })
}

const fetchProgram = async () => {
  const rawId = Number(route.params.id)

  // id ที่ได้จาก Date.now() (หน้า "สร้างใหม่") ไม่ใช่ id ในฐานข้อมูล
  if (!Number.isSafeInteger(rawId) || rawId <= 0 || rawId > 2_147_483_647) {
    isNewProgram.value = true
    curriculum.value.type = 'สร้างหลักสูตรใหม่'
    initFlowMap()
    return
  }

  const [programResult, stateResult] = await Promise.allSettled([
    $fetch<any>(`${API_BASE}/programs/${rawId}`),
    $fetch<any>(`${API_BASE}/programs/${rawId}/builder`)
  ])

  if (programResult.status === 'fulfilled') {
    applyProgramData(programResult.value)
  }

  if (stateResult.status === 'fulfilled') {
    programId.value = rawId
    isNewProgram.value = false
    applyBuilderState(stateResult.value)
  } else if (programResult.status === 'rejected') {
    const err: any = stateResult.reason
    if (err?.status === 404 || err?.response?.status === 404) {
      isNewProgram.value = true
      curriculum.value.type = 'สร้างหลักสูตรใหม่'
      initFlowMap()
    } else {
      console.error('Failed to fetch program:', err)
    }
  }
}

onMounted(async () => {
  await fetchCourseBank()
  await fetchProgram()
  if (!vueFlowNodes.value.length) initFlowMap()
  syncStructureToFlow()
  if (activeView.value === 'flow') {
    nextTick(() => { fitView({ padding: 0.1, duration: 300 }) })
  }
})

const searchCourse = ref('')
const filteredBank = computed(() => {
  const q = searchCourse.value.trim().toLowerCase()
  return courseBank.value.filter(c => {
    const code = String(c.code ?? '')
    const name = String(c.nameTh ?? '').toLowerCase()
    return code.includes(q) || name.includes(q)
  })
})

// ==========================================
// 🏗️ ส่วนที่ 1: ระบบจัดการโครงสร้างหลักสูตร (TAB 1)
// ==========================================
const structure = ref([
  { id: 'g1', title: '1) หมวดวิชาศึกษาทั่วไป', req: 24, type: 'credit', children: [
    { id: 'g11', title: '1.1 วิชาบังคับ', req: 13, type: 'credit', children: [
      { id: 'g11a', title: 'กลุ่มเสริมสร้างทักษะการใช้ภาษาและการสื่อสาร', req: 6, type: 'credit' },
      { id: 'g11b', title: 'กลุ่มเสริมสร้างทักษะการเป็นผู้ประกอบการและสร้างนวัตกรรม', req: 6, type: 'credit' },
      { id: 'g11c', title: 'กลุ่มเสริมสร้างคุณภาพชีวิตและวิถีพลเมืองที่ดี', note: 'เลือกเรียนจากชุดวิชากีฬาและนันทนาการ 1 วิชา', req: 1, type: 'credit' }
    ]},
    { id: 'g12', title: '1.2 วิชาเลือก', note: 'โดยเลือกจากกลุ่มวิชาดังต่อไปนี้', req: 11, type: 'credit', children: [
      { id: 'g12a', title: 'กลุ่มเสริมสร้างทักษะการใช้ภาษาและการสื่อสาร' },
      { id: 'g12b', title: 'กลุ่มเสริมสร้างทักษะการเป็นผู้ประกอบการและสร้างนวัตกรรม' },
      { id: 'g12c', title: 'กลุ่มเสริมสร้างคุณภาพชีวิตและวิถีพลเมืองที่ดี' },
      { id: 'g12d', title: 'กลุ่มเสริมสร้างทักษะในศตวรรษที่ 21' }
    ]}
  ]},
  { id: 'g2', title: '2) หมวดวิชาเฉพาะ', req: 102, type: 'credit', children: [
    { id: 'g21', title: '2.1 กลุ่มวิชาแกน', req: 38, type: 'credit' },
    { id: 'g22', title: '2.2 กลุ่มวิชาชีพ', req: 58, type: 'credit', children: [
      { id: 'g22a', title: 'วิชาชีพบังคับ', req: 43, type: 'credit' },
      { id: 'g22b', title: 'วิชาชีพเลือก', req: 15, type: 'credit' }
    ]},
    { id: 'g23', title: '2.3 กลุ่มวิชาสหกิจศึกษา', req: 6, type: 'credit' },
    { id: 'g24', title: '2.4 กลุ่มวิชาฝึกประสบการณ์วิชาชีพ', req: 240, type: 'hour', note: '(ชั่วโมง)' }
  ]},
  { id: 'g3', title: '3) หมวดวิชาเลือกเสรี', req: 6, type: 'credit' }
])

const slots = ref<Record<string, string[]>>({
  g11a: [], g11b: [], g11c: [], g12a: [], g12b: [], g12c: [], g12d: [], g21: [], g22a: [], g22b: [], g23: [], g24: [], g3: []
})

const getChildrenReqSum = (node: any) => {
  if (!node.children || node.children.length === 0) return 0
  return node.children.reduce((sum: number, child: any) => sum + (child.type === 'credit' ? (Number(child.req) || 0) : 0), 0)
}
const getL1ReqSum = () => { return structure.value.reduce((sum, l1) => sum + (l1.type === 'credit' ? (Number(l1.req) || 0) : 0), 0) }
const getCourseCredit = (code: string) => { const c = courseBank.value.find(x => x.code === code); return c ? c.cVal : 0 }
const getSlotSum = (slotId: string) => (slots.value[slotId] || []).reduce((sum, code) => sum + getCourseCredit(code), 0)

// คำนวณหน่วยกิตรวมโดยไม่แก้ไขค่า req ที่ผู้ใช้กรอก และไม่เอา "ชั่วโมง" มาบวกเป็นหน่วยกิต
const getDynamicReq = (node: any): number => {
  if (!node || node.type === 'hour') return 0
  if (node.children && node.children.length > 0) {
    return node.children.reduce((sum: number, child: any) => sum + getDynamicReq(child), 0)
  }
  return Number(node.req) || 0
}

const grandTotalCredit = computed(() => { let total = 0; structure.value.forEach(l1 => { total += getDynamicReq(l1) }); return total })
const totalSelectedCredits = computed(() => { let sum = 0; for (const key in slots.value) { if (key !== 'g24') sum += getSlotSum(key) } return sum })

const findNode = (nodes: any[], id: string): any => {
  for (const n of nodes) { if (n.id === id) return n; if (n.children) { const found = findNode(n.children, id); if (found) return found } } return null
}

const getAllSelectedCourseCodes = (): Set<string> => {
  const selected = new Set<string>()
  for (const key in slots.value) {
    if (Array.isArray(slots.value[key])) {
      slots.value[key].forEach(sc => selected.add(String(sc).trim()))
    }
  }
  return selected
}

const getMissingPrerequisites = (code: string) => {
  const c = courseBank.value.find(x => String(x.code).trim() === String(code).trim())
  if (!c || !c.pre || !c.pre.length) return []
  const selected = getAllSelectedCourseCodes()
  return c.pre.filter((preCode: string) => !selected.has(String(preCode).trim()))
}

const getDependentCoursesInCurriculum = (code: string) => {
  const cleanCode = String(code).trim()
  const selected = getAllSelectedCourseCodes()
  return courseBank.value.filter(c => 
    selected.has(String(c.code).trim()) && 
    (c.pre || []).some((preCode: string) => String(preCode).trim() === cleanCode)
  )
}

const isCourseAlreadyAdded = (code: string) => {
  const cleanCode = String(code).trim()
  for (const key in slots.value) {
    if (Array.isArray(slots.value[key]) && slots.value[key].map(x => String(x).trim()).includes(cleanCode)) return true
  }
  return false
}

const checkPrerequisites = (code: string, action = 'เพิ่ม') => {
  const missing = getMissingPrerequisites(code)
  if (missing.length) {
    const names = missing.map(m => {
      const mc = courseBank.value.find(x => String(x.code).trim() === String(m).trim())
      return mc ? `[${mc.code}] ${mc.nameTh}` : m
    }).join('\n- ')
    alert(`ไม่สามารถ${action}วิชา [${code}] ได้!\nเนื่องจากมีวิชาบังคับก่อนที่ยังไม่ได้เพิ่มในหลักสูตร:\n- ${names}\nกรุณาเพิ่มวิชาบังคับก่อนเหล่านี้ในโครงสร้างหลักสูตรก่อน`)
    return false
  }
  return true
}

const checkLimit = (slotId: string, addedCode: string) => {
  const node = findNode(structure.value, slotId)
  if (!node || node.req === undefined || node.type === 'hour') return true
  if (getSlotSum(slotId) + getCourseCredit(addedCode) > node.req) {
    alert(`ไม่สามารถเพิ่มวิชานี้ได้!\nหน่วยกิตรวมกลุ่มนี้จะเกินที่กำหนดไว้ (${node.req} นก.)`)
    return false
  }
  return true
}

const dragItem = ref<{ code: string, fromSlot: string | null } | null>(null)
const dragOverSlot = ref<string | null>(null)

const handleDragStart = (code: string, fromSlot: string | null = null) => { dragItem.value = { code, fromSlot } }

const handleDrop = (toSlot: string) => {
  if (!dragItem.value) return
  const { code, fromSlot } = dragItem.value

  if (!fromSlot && isCourseAlreadyAdded(code)) {
    alert(`วิชา ${code} ถูกเพิ่มในหลักสูตรไปแล้ว (ไม่สามารถใส่ซ้ำได้)`)
    dragItem.value = null; dragOverSlot.value = null; return
  }
  if (!fromSlot && !checkPrerequisites(code, 'เพิ่ม')) {
    dragItem.value = null; dragOverSlot.value = null; return
  }

  if (!checkLimit(toSlot, code)) { dragItem.value = null; dragOverSlot.value = null; return }

  if (fromSlot && fromSlot !== toSlot) {
    const idx = slots.value[fromSlot].indexOf(code)
    if (idx !== -1) slots.value[fromSlot].splice(idx, 1)
  }

  if (!slots.value[toSlot].includes(code)) { slots.value[toSlot].push(code) }

  syncStructureToFlow()

  dragItem.value = null; dragOverSlot.value = null;
}

const removeFlowNodeByCode = (code: string) => {
  const cleanCode = String(code).trim()
  const node = vueFlowNodes.value.find(n => n.type === 'customCourse' && String(n.data?.code || '').trim() === cleanCode)
  if (node) {
    vueFlowNodes.value = vueFlowNodes.value.filter(n => n.id !== node.id)
    vueFlowEdges.value = vueFlowEdges.value.filter(e => e.source !== node.id && e.target !== node.id)
  }
}

const removeCourse = (slotId: string, index: number) => {
  const code = slots.value[slotId]?.[index]
  if (!code) return

  // ตรวจสอบว่ามีวิชาอื่นในหลักสูตรที่ต้องเรียนต่อจากวิชานี้หรือไม่
  const dependents = getDependentCoursesInCurriculum(code)
  if (dependents.length > 0) {
    const depNames = dependents.map(d => `[${d.code}] ${d.nameTh}`).join('\n- ')
    alert(`ไม่สามารถลบวิชา [${code}] ได้!\nเนื่องจากเป็นวิชาบังคับก่อนของวิชาต่อไปนี้ในหลักสูตร:\n- ${depNames}\nกรุณาลบวิชาต่อเนื่องเหล่านี้ออกก่อน`)
    return
  }

  slots.value[slotId].splice(index, 1)
  removeFlowNodeByCode(code)
}

const isPickModalOpen = ref(false)
const activePickSlot = ref<string | null>(null)
const searchPick = ref('')
const openPickModal = (slotId: string) => { activePickSlot.value = slotId; searchPick.value = ''; isPickModalOpen.value = true; }
const filteredPickBank = computed(() => {
  const q = searchPick.value.trim().toLowerCase()
  return courseBank.value.filter(c => {
    const code = String(c.code ?? '')
    const name = String(c.nameTh ?? '').toLowerCase()
    return code.includes(q) || name.includes(q)
  })
})
const addCourseFromModal = (code: string) => {
  if (!activePickSlot.value) return
  if (isCourseAlreadyAdded(code)) { alert(`วิชา ${code} ถูกเพิ่มไปแล้ว (ไม่สามารถใส่ซ้ำได้)`); return }
  if (!checkPrerequisites(code, 'เพิ่ม')) return
  if (!checkLimit(activePickSlot.value, code)) return
  slots.value[activePickSlot.value].push(code)
  syncStructureToFlow()
}

// ==========================================
// 🔀 ส่วนที่ 2: ระบบแผนภูมิ Vue Flow (TAB 2)
// ==========================================
const { fitView, setViewport, addNodes } = useVueFlow()

const FLOW_COLS = [
  { label: 'ภาคการศึกษาที่ 1' }, { label: 'ภาคการศึกษาที่ 2' },
  { label: 'ภาคการศึกษาที่ 3' }, { label: 'ภาคการศึกษาที่ 4' },
  { label: 'ภาคการศึกษาที่ 5' }, { label: 'ภาคการศึกษาที่ 6' },
  { label: 'ภาคการศึกษาที่ 7' }, { label: 'ภาคการศึกษาที่ 8' }
]

const vueFlowNodes = ref<any[]>([])
const vueFlowEdges = ref<any[]>([])
const selectedCourseForFlow = ref('')

const makeHeaderNodes = () => FLOW_COLS.map((col, idx) => ({
  id: `header-${idx}`, type: 'semesterHeader',
  position: { x: idx * 260, y: 0 }, data: { label: col.label },
  draggable: false, selectable: false, connectable: false
}))

const initFlowMap = () => {
  vueFlowNodes.value = [...makeHeaderNodes()]
}

const EDGE_STYLE = { stroke: '#4a3319', strokeWidth: 2.5, fill: 'none' }

const deduplicateFlowNodes = () => {
  const seen = new Set<string>()
  vueFlowNodes.value = vueFlowNodes.value.filter((node: any) => {
    if (node?.type !== 'customCourse') return true
    const code = String(node?.data?.code || '').trim()
    if (!code) return true
    if (seen.has(code)) return false
    seen.add(code)
    return true
  })
}

const deduplicateFlowEdges = () => {
  const seen = new Set<string>()
  vueFlowEdges.value = vueFlowEdges.value.filter((edge: any) => {
    if (!edge?.source || !edge?.target) return true
    const key = String(edge.source) + "->" + String(edge.target)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const calculateDefaultPosition = (code: string) => {
  const c = courseBank.value.find(x => String(x.code).trim() === String(code).trim())
  let minCol = 0
  if (c && c.pre && c.pre.length > 0) {
    for (const preCode of c.pre) {
      const preNode = vueFlowNodes.value.find(n => n.type === 'customCourse' && String(n.data?.code || '').trim() === String(preCode).trim())
      if (preNode) {
        const preCol = Math.round((preNode.position?.x || 0) / 260)
        minCol = Math.max(minCol, preCol + 1)
      }
    }
  }
  const col = Math.min(7, minCol)
  const x = col * 260
  let y = 100
  while (vueFlowNodes.value.some(n => n.type === 'customCourse' && n.position?.x === x && n.position?.y === y)) {
    y += 100
  }
  return { x, y }
}

const generateAutoEdges = () => {
  vueFlowNodes.value.forEach(node => {
    if (node.type !== 'customCourse') return
    const c = courseBank.value.find(x => String(x.code).trim() === String(node.data?.code || '').trim())
    if (c && c.pre && c.pre.length > 0) {
      c.pre.forEach((preCode: string) => {
        const preNode = vueFlowNodes.value.find(n => n.type === 'customCourse' && String(n.data?.code || '').trim() === String(preCode).trim())
        if (preNode) {
          const edgeId = `e-auto-${preNode.id}-${node.id}`
          const existingEdge = vueFlowEdges.value.find(e => e.source === preNode.id && e.target === node.id)
          if (!existingEdge) {
            vueFlowEdges.value.push({
              id: edgeId,
              type: 'flowArrow',
              source: preNode.id,
              target: node.id,
              sourceHandle: 'right',
              targetHandle: 'left',
              animated: false,
              deletable: false,
              data: { autoPrerequisite: true }
            })
          } else {
            existingEdge.type = 'flowArrow'
            existingEdge.deletable = false
            existingEdge.data = { ...(existingEdge.data || {}), autoPrerequisite: true }
          }
        }
      })
    }
  })
}

const syncStructureToFlow = () => {
  if (!vueFlowNodes.value.some(n => n.type === 'semesterHeader')) {
    vueFlowNodes.value = [...makeHeaderNodes(), ...vueFlowNodes.value]
  }

  const allSelectedCodes = getAllSelectedCourseCodes()

  // 1. ลบวิชาออกจาก Flow หากถูกลบออกจากโครงสร้างหลักสูตร (Structure)
  const nodesToRemove = vueFlowNodes.value.filter(n => n.type === 'customCourse' && !allSelectedCodes.has(String(n.data?.code || '').trim()))
  if (nodesToRemove.length > 0) {
    const removeIds = new Set(nodesToRemove.map(n => n.id))
    vueFlowNodes.value = vueFlowNodes.value.filter(n => !removeIds.has(n.id))
    vueFlowEdges.value = vueFlowEdges.value.filter(e => !removeIds.has(e.source) && !removeIds.has(e.target))
  }

  // 2. เพิ่มวิชาจากโครงสร้างที่ยังไม่อยู่ใน Flow
  const existingCodes = new Set(vueFlowNodes.value.filter(n => n.type === 'customCourse').map(n => String(n.data?.code || '').trim()))

  allSelectedCodes.forEach(code => {
    if (!existingCodes.has(code)) {
      const c = courseBank.value.find(x => String(x.code).trim() === code)
      if (c) {
        const pos = calculateDefaultPosition(code)
        vueFlowNodes.value.push({
          id: `node_${c.code}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          type: 'customCourse',
          position: pos,
          data: { name: c.nameTh, code: c.code, cat: c.cat, credits: c.credits }
        })
        existingCodes.add(code)
      }
    }
  })

  // 3. สร้างเส้นโยงวิชาบังคับก่อนอัตโนมัติ
  generateAutoEdges()
  deduplicateFlowNodes()
  deduplicateFlowEdges()
}

watch(activeView, async (newView) => {
  if (newView === 'flow') {
    syncStructureToFlow()
    await nextTick()
    setTimeout(() => {
      fitView({ padding: 0.1, duration: 300 })
    }, 50)
  }
})

const addNodeToFlow = () => {
  if (!selectedCourseForFlow.value) return alert('กรุณาเลือกวิชาจากคลัง')
  const code = selectedCourseForFlow.value
  const isAlreadyInFlow = vueFlowNodes.value.some(n => String(n.data?.code || '').trim() === String(code).trim())
  if (isAlreadyInFlow) return alert(`วิชารหัส ${code} อยู่ในกระดานแล้ว`)

  if (!checkPrerequisites(code, 'เพิ่ม')) return

  // เพิ่มลงในโครงสร้างหลักสูตรด้วยเพื่อความสอดคล้องกัน 100%
  if (!isCourseAlreadyAdded(code)) {
    const targetSlot = slots.value.g22a ? 'g22a' : Object.keys(slots.value)[0]
    if (targetSlot) slots.value[targetSlot].push(code)
  }

  const c = courseBank.value.find(x => String(x.code).trim() === String(code).trim())
  if (c) {
    const pos = calculateDefaultPosition(code)
    vueFlowNodes.value.push({
      id: `node_${c.code}_${Date.now()}`,
      type: 'customCourse',
      position: pos,
      data: { name: c.nameTh, code: c.code, cat: c.cat, credits: c.credits }
    })
    generateAutoEdges()
  }
  selectedCourseForFlow.value = ''
}

const draggedNodeInitialPos = ref<Record<string, {x: number, y: number}>>({})
const onNodeDragStart = (event: any) => { draggedNodeInitialPos.value[event.node.id] = { ...event.node.position } }
const onNodeDragStop = (event: any) => {
  const draggedNode = event.node
  if (!draggedNode || draggedNode.type !== 'customCourse') {
    delete draggedNodeInitialPos.value[draggedNode?.id]
    return
  }

  const initial = draggedNodeInitialPos.value[draggedNode.id] || { x: 0, y: 100 }
  const code = String(draggedNode.data?.code || '').trim()
  const c = courseBank.value.find(x => String(x.code).trim() === code)

  // 1. Snap ตำแหน่ง X ไปยังภาคการศึกษา 1–8
  const targetCol = Math.max(0, Math.min(7, Math.round(draggedNode.position.x / 260)))
  const targetX = targetCol * 260

  // 2. ตรวจสอบเงื่อนไขวิชาบังคับก่อน (Prerequisite Validation)
  // 2A: ตรวจสอบว่าวิชานี้ถูกวางก่อนหรือเท่ากับวิชาบังคับก่อนหรือไม่
  if (c && c.pre && c.pre.length > 0) {
    for (const preCode of c.pre) {
      const cleanPre = String(preCode).trim()
      const preNode = vueFlowNodes.value.find(n => n.type === 'customCourse' && String(n.data?.code || '').trim() === cleanPre)
      if (preNode && preNode.id !== draggedNode.id) {
        const preCol = Math.round((preNode.position?.x || 0) / 260)
        if (targetCol <= preCol) {
          alert(`ไม่สามารถวางวิชา [${code}] ${c.nameTh} ในภาคการศึกษาที่ ${targetCol + 1} ได้!\nเนื่องจากวิชาบังคับก่อน [${cleanPre}] ${preNode.data?.name || ''} อยู่ในภาคการศึกษาที่ ${preCol + 1}\n(วิชานี้ต้องเรียนหลังวิชาบังคับก่อนอย่างน้อย 1 ภาคการศึกษา)`)
          draggedNode.position = { ...initial }
          delete draggedNodeInitialPos.value[draggedNode.id]
          return
        }
      }
    }
  }

  // 2B: ตรวจสอบว่าวิชานี้ถูกวางหลังหรือเท่ากับวิชาที่ต้องเรียนต่อเนื่องจากวิชานี้หรือไม่
  const dependents = vueFlowNodes.value.filter(n => {
    if (n.id === draggedNode.id || n.type !== 'customCourse') return false
    const depCourse = courseBank.value.find(x => String(x.code).trim() === String(n.data?.code || '').trim())
    return (depCourse?.pre || []).some((pc: string) => String(pc).trim() === code)
  })
  for (const depNode of dependents) {
    const depCol = Math.round((depNode.position?.x || 0) / 260)
    if (targetCol >= depCol) {
      alert(`ไม่สามารถวางวิชา [${code}] ${c?.nameTh || ''} ในภาคการศึกษาที่ ${targetCol + 1} ได้!\nเนื่องจากเป็นวิชาบังคับก่อนของ [${depNode.data?.code}] ${depNode.data?.name || ''} ในภาคการศึกษาที่ ${depCol + 1}\n(ต้องเรียนก่อนวิชาต่อเนื่องอย่างน้อย 1 ภาคการศึกษา)`)
      draggedNode.position = { ...initial }
      delete draggedNodeInitialPos.value[draggedNode.id]
      return
    }
  }

  // 3. Snap ตำแหน่ง Y เป็นแถว (y >= 100, step 100) และป้องกันไม่ให้กล่องวิชาวางทับกัน
  let targetY = Math.max(100, Math.round(draggedNode.position.y / 100) * 100)
  while (vueFlowNodes.value.some(n => n.id !== draggedNode.id && n.type === 'customCourse' && n.position.x === targetX && n.position.y === targetY)) {
    targetY += 100
  }

  draggedNode.position = { x: targetX, y: targetY }
  delete draggedNodeInitialPos.value[draggedNode.id]
}

const onEdgeDoubleClick = (event: any) => {
  const edge = event.edge
  // ห้ามลบเส้นที่มาจากวิชาบังคับก่อน (สร้างอัตโนมัติ)
  if (edge?.data?.autoPrerequisite || String(edge?.id || '').startsWith('e-auto-')) return
  vueFlowEdges.value = vueFlowEdges.value.filter(e => e.id !== edge.id)
}

const removeFlowNode = (id: string) => {
  const node = vueFlowNodes.value.find(n => n.id === id)
  if (!node) return
  const code = node.data?.code
  if (code) {
    const dependents = getDependentCoursesInCurriculum(code)
    if (dependents.length > 0) {
      const depNames = dependents.map(d => `[${d.code}] ${d.nameTh}`).join('\n- ')
      alert(`ไม่สามารถลบวิชา [${code}] ได้!\nเนื่องจากเป็นวิชาบังคับก่อนของวิชาต่อไปนี้ในหลักสูตร:\n- ${depNames}\nกรุณาลบวิชาต่อเนื่องเหล่านี้ออกก่อน`)
      return
    }
    // ลบออกจาก slots โครงสร้างหลักสูตรด้วยเพื่อให้สอดคล้องกัน 100%
    for (const key in slots.value) {
      if (Array.isArray(slots.value[key])) {
        const idx = slots.value[key].indexOf(code)
        if (idx !== -1) slots.value[key].splice(idx, 1)
      }
    }
  }
  vueFlowNodes.value = vueFlowNodes.value.filter(n => n.id !== id)
  vueFlowEdges.value = vueFlowEdges.value.filter(e => e.source !== id && e.target !== id)
}

// ==========================================
// 📷 ส่วนที่ 3: ระบบบันทึกภาพถ่าย (html-to-image)
// ==========================================
const isCapturing = ref(false)
const isPrinting = ref(false)
const flowImage = ref('')

// จับภาพกระดาน Vue Flow และคืนค่าเป็น data URL (ใช้ทั้งบันทึกรูปและพิมพ์ PDF)
const captureFlowBoard = async (backgroundColor = '#f8f5f0', forPrint = false): Promise<string | null> => {
  const htmlToImage = await import('html-to-image')
  const flowBoard = document.querySelector('.vue-flow-board') as HTMLElement | null
  if (!flowBoard) return null

  let maxX = 0; let maxY = 0;
  vueFlowNodes.value.forEach(n => {
    if (n.position?.x > maxX) maxX = n.position.x
    if (n.position?.y > maxY) maxY = n.position.y
  })

  const exactWidth = Math.max(maxX + 280, 2080)
  const exactHeight = Math.max(maxY + 150, 400)

  const controls = document.querySelector('.vue-flow__panel') as HTMLElement | null
  const nodes = document.querySelectorAll('.course-node')

  const origWidth = flowBoard.style.width
  const origHeight = flowBoard.style.height
  const origBorder = flowBoard.style.border
  const origBorderRadius = flowBoard.style.borderRadius
  const origBoxShadow = flowBoard.style.boxShadow
  const origBackground = flowBoard.style.background

  try {
    if (controls) controls.style.display = 'none'

    flowBoard.style.width = `${exactWidth}px`
    flowBoard.style.height = `${exactHeight}px`

    // ตอนพิมพ์ให้พื้นหลังขาวและไม่มีกรอบกระดาน เพื่อให้เหมือนเอกสารทางการ
    if (forPrint) {
      flowBoard.style.border = 'none'
      flowBoard.style.borderRadius = '0'
      flowBoard.style.boxShadow = 'none'
      flowBoard.style.background = '#ffffff'
    }

    if (setViewport) setViewport({ x: 0, y: 0, zoom: 1 })

    nodes.forEach((n: any) => n.style.boxShadow = 'none')

    await nextTick()
    await new Promise(r => setTimeout(r, 600))

    return await htmlToImage.toPng(flowBoard, {
      backgroundColor,
      width: exactWidth,
      height: exactHeight,
      pixelRatio: 1.5,
      style: {
        width: `${exactWidth}px`,
        height: `${exactHeight}px`,
        transform: 'scale(1)'
      }
    })
  } finally {
    flowBoard.style.width = origWidth
    flowBoard.style.height = origHeight
    flowBoard.style.border = origBorder
    flowBoard.style.borderRadius = origBorderRadius
    flowBoard.style.boxShadow = origBoxShadow
    flowBoard.style.background = origBackground
    nodes.forEach((n: any) => n.style.boxShadow = '')
    if (controls) controls.style.display = ''
    if (fitView) fitView({ padding: 0.1, duration: 300 })
  }
}

const saveFlowAsImage = async () => {
  isCapturing.value = true
  try {
    const dataUrl = await captureFlowBoard('#f8f5f0')
    if (!dataUrl) return

    const link = document.createElement('a')
    link.download = `curriculum-flow-${curriculum.value.id}.png`
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Capture error:', error)
    alert('เกิดข้อผิดพลาดในการบันทึกรูปภาพ กรุณาตรวจสอบว่าติดตั้ง html-to-image แล้ว')
  } finally {
    isCapturing.value = false
  }
}

const printCurriculum = async () => {
  if (isPrinting.value) return

  isPrinting.value = true
  const previousTab = activeTab.value
  const previousView = activeView.value

  try {
    // ต้องทำให้แผงแผนภูมิแสดงก่อน html-to-image จึงจะจับภาพได้
    syncStructureToFlow()
    activeTab.value = 'flow'
    activeView.value = 'flow'
    await nextTick()
    await new Promise(r => setTimeout(r, 300))

    try {
      flowImage.value = (await captureFlowBoard('#ffffff', true)) || ''
    } catch (captureError) {
      // ถ้าจับภาพแผนภูมิไม่ได้ ก็ยังพิมพ์องค์ประกอบที่ 3 ได้
      console.error('Flow capture error:', captureError)
      flowImage.value = ''
    }

    // กลับไปแท็บเดิมหลังจับภาพ
    activeTab.value = previousTab
    activeView.value = previousView
    await nextTick()

    // รอให้ <img> ในเอกสารพิมพ์โหลดข้อมูลก่อนเปิดหน้าต่างพิมพ์
    await new Promise(r => setTimeout(r, 300))
    window.print()
  } catch (error) {
    console.error('Print preparation error:', error)
    alert('ไม่สามารถเตรียมเอกสารสำหรับพิมพ์ได้ กรุณาลองใหม่อีกครั้ง')
  } finally {
    isPrinting.value = false
  }
}

// แทนที่รายการลูกทั้งหมด (API ของแต่ละ resource เป็น POST/DELETE ไม่มี PUT)
const replaceChildResource = async (
  id: number,
  resource: string,
  payloads: any[]
) => {
  const existing = await $fetch<any[]>(`${API_BASE}/programs/${id}/${resource}/`)
  await Promise.all(
    (existing || []).map(row =>
      $fetch(`${API_BASE}/programs/${id}/${resource}/${row.id}`, { method: 'DELETE' })
    )
  )
  for (const body of payloads) {
    await $fetch(`${API_BASE}/programs/${id}/${resource}/`, { method: 'POST', body })
  }
}

const saveObe2Sections = async (id: number) => {
  const d = obe2.value
  const errors: string[] = []
  const run = async (label: string, task: () => Promise<any>) => {
    try {
      await task()
    } catch (err) {
      console.error(`Save OBE2 ${label} failed:`, err)
      errors.push(label)
    }
  }

  await run('ข้อมูลหลักสูตร', () => $fetch(`${API_BASE}/programs/${id}`, {
    method: 'PUT',
    body: buildObe2Payload(d, Number(curriculum.value.totalCredit) || 0)
  }))

  await run('วิชาเอก', () => replaceChildResource(
    id,
    'majors',
    d.majors.map((x: string) => x.trim()).filter(Boolean)
      .map((major_name, sort_order) => ({ major_name, sort_order }))
  ))

  await run('อาชีพ', () => replaceChildResource(
    id,
    'careers',
    d.careers.map((x: string) => x.trim()).filter(Boolean)
      .map((career_name, sort_order) => ({ career_name, sort_order }))
  ))

  await run('การอนุมัติ', () => replaceChildResource(
    id,
    'approvals',
    d.approvals.filter((row: any) => row.committee || row.approvalDate || row.note)
      .map((row: any, sort_order: number) => ({
        committee: row.committee || null,
        approval_date: row.approvalDate || null,
        note: row.note || null,
        sort_order
      }))
  ))

  await run('แผนพัฒนา', () => replaceChildResource(
    id,
    'development-plans',
    d.developmentPlans.filter((row: any) => row.plan || row.strategy || row.indicator)
      .map((row: any, sort_order: number) => ({
        plan: row.plan || null,
        strategy: row.strategy || null,
        indicator: row.indicator || null,
        sort_order
      }))
  ))

  await run('PLOs', () => replaceChildResource(
    id,
    'plo',
    d.plos.filter((row: any) => row.code || row.description)
      .map((row: any, sort_order: number) => ({
        plo_code: row.code || null,
        domain: 'PLO',
        description_th: row.description || null,
        sort_order,
        outcome_type: row.type || 'S',
        branch: ''
      }))
  ))

  await run('YLOs', () => replaceChildResource(
    id,
    'ylo',
    d.ylos.filter((row: any) => row.description)
      .map((row: any) => ({
        year: Number(row.year) || null,
        description: row.description,
        branch: ''
      }))
  ))

  // เก็บ blob ครบทุกฟิลด์ (รวม mapping 6.4–6.7 และ 7.2)
  await run('ข้อมูล OBE2', async () => {
    const topics = await $fetch<any[]>(`${API_BASE}/programs/${id}/learning-topics/`)
    await Promise.all(
      (topics || [])
        .filter(topic => topic.topic_no === 'obe2')
        .map(topic => $fetch(`${API_BASE}/programs/${id}/learning-topics/${topic.id}`, { method: 'DELETE' }))
    )
    await $fetch(`${API_BASE}/programs/${id}/learning-topics/`, {
      method: 'POST',
      body: {
        topic_no: 'obe2',
        title: 'OBE2 Sections 1-2',
        content: JSON.stringify(d),
        sort_order: 0
      }
    })
  })

  return errors
}

const isSaving = ref(false)
const saveCurriculum = async () => {
  if (!obe2.value.nameTh.trim() && !curriculum.value.name.trim()) {
    alert('กรุณากรอกชื่อหลักสูตร (ด้านบนหรือหัวข้อ 1.1) ก่อนบันทึก')
    return
  }

  isSaving.value = true
  try {
    let id = programId.value

    // หลักสูตรใหม่: สร้าง program ก่อน แล้วค่อยบันทึก state ทั้งก้อน
    if (!id) {
      const created = await $fetch<any>(`${API_BASE}/programs/`, {
        method: 'POST',
        body: {
          name_th: (obe2.value.nameTh.trim() || curriculum.value.name.trim()),
          total_credits: Number(curriculum.value.totalCredit) || 0,
          curriculum_type: 'new'
        }
      })
      id = created.id
      programId.value = id
      curriculum.value.id = String(id)
      isNewProgram.value = false
      curriculum.value.type = 'สร้างหลักสูตรใหม่'
      await router.replace({ path: `/curriculum/${id}`, query: { type: 'new' } })
    }

    const sectionErrors = await saveObe2Sections(id)

    const response = await $fetch<any>(`${API_BASE}/programs/${id}/builder`, {
      method: 'PUT',
      body: {
        name_th: (curriculum.value.name.trim() || obe2.value.nameTh.trim()),
        total_credits: Number(curriculum.value.totalCredit) || 0,
        structure: structure.value,
        slots: slots.value,
        flow_map: {
          // เก็บเฉพาะข้อมูลที่ serialize ได้ (ตัว node ของ Vue Flow มี field ภายในที่อ้าง DOM)
          nodes: vueFlowNodes.value
            .filter(n => n.type === 'customCourse')
            .map(n => ({
              id: n.id,
              type: n.type,
              position: { x: n.position?.x ?? 0, y: n.position?.y ?? 0 },
              data: n.data
            })),
          edges: vueFlowEdges.value.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            sourceHandle: e.sourceHandle ?? null,
            targetHandle: e.targetHandle ?? null,
            type: e.type,
            animated: !!e.animated,
            style: e.style,
            markerEnd: e.markerEnd,
            label: e.label,
            deletable: e.deletable,
            data: e.data
          }))
        }
      }
    })

    if (response?.missing_courses?.length) {
      alert(`บันทึกหลักสูตรแล้ว แต่ข้ามวิชาที่ไม่มีในคลังวิชา: ${response.missing_courses.join(', ')}`)
    } else if (sectionErrors.length) {
      alert(`บันทึกโครงสร้างและแผนภูมิแล้ว แต่บางส่วนของข้อมูลหลักสูตรบันทึกไม่สำเร็จ: ${sectionErrors.join(', ')}`)
    } else {
      alert('บันทึกข้อมูลหลักสูตร องค์ประกอบที่ 3 และแผนภูมิเรียบร้อยแล้ว!')
    }
  } catch (err: any) {
    console.error('Save error:', err)
    alert('ไม่สามารถบันทึกข้อมูลได้: ' + (err?.data?.detail || err?.message || 'โปรดตรวจสอบการเชื่อมต่อ API'))
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="builder-container">

    <aside class="obe-nav">
      <button type="button" class="nav-home" @click="goHome">‹ กลับหน้าแรก</button>

      <div v-for="group in navGroups" :key="group.key" class="nav-group">
        <div class="nav-group-title">
          <span class="nav-badge">{{ group.badge }}</span>
          {{ group.title }}
        </div>
        <button
          v-for="item in group.items"
          :key="item.id"
          type="button"
          class="nav-item"
          :class="{ active: (activeView === 'sections' && activeSection === item.id) || activeView === item.id }"
          @click="selectView(item.id)"
        >
          <span class="nav-code">{{ item.code }}</span>
          <span class="nav-label">{{ item.title }}</span>
          <span v-if="isSectionDone(item.id)" class="done-dot" title="มีข้อมูลแล้ว">✓</span>
        </button>
      </div>

      <div class="nav-hint">บันทึกเพื่อเก็บข้อมูลหลักสูตรพร้อมโครงสร้างและแผนภูมิ</div>
    </aside>

    <div class="builder-main">
      <div class="builder-header">
        <h1 class="pt text-[var(--acc)] text-2xl font-bold mb-2">{{ curriculum.type }}</h1>

        <div class="title-field">
          <label class="fl">ชื่อหลักสูตร</label>
          <input v-model="curriculum.name" class="pname" placeholder="ชื่อโปรเจกต์หลักสูตร (เช่น วิศวกรรมคอมพิวเตอร์ หลักสูตรใหม่ พ.ศ. 2570)">
        </div>

        <div class="mute mt-2 flex justify-between items-center gap-3 flex-wrap">
          <div>
            <span class="tag bg-[var(--btn)] text-white px-2 py-1 rounded-md text-xs">ประธานหลักสูตร</span>
            ข้อมูลหลักสูตร โครงสร้างหลักสูตร และแผนภูมิความต่อเนื่อง
          </div>
          <div class="flex flex-wrap items-center justify-end gap-2">
            <button
              class="btn flex items-center gap-2"
              title="พิมพ์องค์ประกอบที่ 3 และภาคผนวก 2 เป็น PDF"
              @click="printCurriculum"
              :disabled="isPrinting || isSaving"
            >
              <UIcon v-if="isPrinting" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
              <UIcon v-else name="i-heroicons-printer" class="w-4 h-4" />
              {{ isPrinting ? 'กำลังเตรียม PDF...' : 'พิมพ์เป็น PDF' }}
            </button>

            <button class="btn p flex items-center gap-2" @click="saveCurriculum" :disabled="isSaving || isPrinting">
              <UIcon v-if="isSaving" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
              <UIcon v-else name="i-heroicons-document-check" class="w-4 h-4" />
              {{ isSaving ? 'กำลังบันทึก...' : 'บันทึกหลักสูตร' }}
            </button>
          </div>
        </div>
      </div>

      <div class="builder-content">
        <div v-show="activeView === 'sections'" class="sections-view fade-in">
          <Obe2Sections v-model="obe2" :section="activeSection" />
        </div>

        <!-- ===================================== -->
        <!-- 📍 TAB 1: โครงสร้างหลักสูตร (ลากวาง) -->
        <!-- ===================================== -->
        <div v-show="activeView === 'structure'" class="split">
      <div id="tree">
        <div class="rw d1 items-start border-b border-[var(--line)] pb-4 mb-4 mt-2">
          <div class="flex flex-col">
            <span class="lb text-[17px] font-bold text-[var(--ink)]">จำนวนหน่วยกิตรวมตลอดหลักสูตร</span>
            <span v-if="getL1ReqSum() > curriculum.totalCredit" class="text-[var(--danger)] text-[12.5px] mt-1 font-medium">
              ⚠️ หมวดวิชาทั้งหมดรวมกัน ({{getL1ReqSum()}}) เกินหน่วยกิตรวม ({{curriculum.totalCredit}})
            </span>
          </div>
          <span class="cx mt-1">
            <span class="sel" :class="{'text-[var(--ok)] font-bold': totalSelectedCredits === grandTotalCredit}">เลือกแล้ว {{ totalSelectedCredits }}</span>
            <input type="number" v-model="curriculum.totalCredit" class="gb">
            <b class="text-[var(--mute)] text-sm">หน่วยกิต</b>
          </span>
        </div>

        <template v-for="l1 in structure" :key="l1.id">
          <div class="rw d1 mt-4 items-start">
            <div class="flex flex-col">
              <span class="lb font-bold text-[var(--ink)]">{{ l1.title }}</span>
              <span v-if="getChildrenReqSum(l1) > l1.req" class="text-[var(--danger)] text-[12.5px] mt-1 font-medium">
                ⚠️ หมวดย่อยรวมกัน ({{getChildrenReqSum(l1)}}) เกินยอดของหมวดนี้ ({{l1.req}})
              </span>
            </div>
            <span class="cx mt-1" v-if="l1.req !== undefined">
              <input type="number" v-model="l1.req" class="gb sm">
              <b class="text-[var(--mute)] text-sm font-medium">หน่วยกิต</b>
            </span>
          </div>

            <template v-if="l1.children">
              <template v-for="l2 in l1.children" :key="l2.id">
                <div class="rw d2 mt-2 items-start">
                  <div class="flex flex-col">
                    <span><span class="font-semibold text-[var(--ink)]">{{ l2.title }}</span> <span v-if="l2.note" class="mute text-xs ml-1 font-normal">({{ l2.note }})</span></span>
                    <span v-if="getChildrenReqSum(l2) > l2.req" class="text-[var(--danger)] text-[12px] mt-1 font-medium">
                      ⚠️ กลุ่มย่อยรวมกัน ({{getChildrenReqSum(l2)}}) เกินยอดของกลุ่มนี้ ({{l2.req}})
                    </span>
                  </div>
                  <span class="cx mt-1" v-if="l2.req !== undefined">
                    <input type="number" v-model="l2.req" class="gb sm">
                    <b class="text-[var(--mute)] text-xs font-medium">{{ l2.type === 'hour' ? 'ชั่วโมง' : 'หน่วยกิต' }}</b>
                  </span>
                </div>

                <template v-if="l2.children">
                  <template v-for="l3 in l2.children" :key="l3.id">
                    <div class="rw d2 mt-2 pl-[40px]">
                      <span><span class="font-medium text-[var(--ink)]">{{ l3.title }}</span> <span v-if="l3.note" class="mute text-xs ml-1 font-normal">({{ l3.note }})</span></span>
                      <span class="cx" v-if="l3.req !== undefined">
                        <span class="sel text-xs" :class="{'text-[var(--ok)] font-bold': getSlotSum(l3.id) >= l3.req}">เลือกแล้ว {{ getSlotSum(l3.id) }}</span>
                        <input type="number" v-model="l3.req" class="gb sm">
                        <b class="text-[var(--mute)] text-xs font-medium">{{ l3.type === 'hour' ? 'ชั่วโมง' : 'หน่วยกิต' }}</b>
                      </span>
                    </div>

                    <div class="sl pl-[40px]">
                      <div class="slot" :class="{ 'over': dragOverSlot === l3.id }" @dragover.prevent="dragOverSlot = l3.id" @dragleave="dragOverSlot = null" @drop="handleDrop(l3.id)">
                        <div v-if="!slots[l3.id]?.length">
                          <span class="mute text-xs mb-2 block">ยังไม่มีรายวิชา</span>
                          <button class="add" @click="openPickModal(l3.id)">＋ เพิ่มรายวิชาจากคลัง</button>
                        </div>

                        <div v-for="(code, idx) in slots[l3.id]" :key="idx" class="crs" draggable="true" @dragstart="handleDragStart(code, l3.id)">
                          <span class="flex-1">
                            <b class="text-[var(--ink)]">{{ code }}</b> {{ courseBank.find(c => c.code === code)?.nameTh }}
                            <div class="mute text-xs">{{ courseBank.find(c => c.code === code)?.credits }}</div>
                          </span>
                          <button class="x" @click="removeCourse(l3.id, idx)">✕</button>
                        </div>
                        <button v-if="slots[l3.id]?.length" class="add mt-2" @click="openPickModal(l3.id)">＋ เพิ่มรายวิชาจากคลัง</button>
                      </div>
                    </div>
                  </template>
                </template>

                <template v-else>
                  <div class="sl pl-[20px]">
                    <div class="slot" :class="{ 'over': dragOverSlot === l2.id }" @dragover.prevent="dragOverSlot = l2.id" @dragleave="dragOverSlot = null" @drop="handleDrop(l2.id)">
                      <div v-if="!slots[l2.id]?.length">
                        <span class="mute text-xs mb-2 block">ยังไม่มีรายวิชา</span>
                        <button class="add" @click="openPickModal(l2.id)">＋ เพิ่มรายวิชาจากคลัง</button>
                      </div>

                      <div v-for="(code, idx) in slots[l2.id]" :key="idx" class="crs" draggable="true" @dragstart="handleDragStart(code, l2.id)">
                        <span class="flex-1">
                          <b class="text-[var(--ink)]">{{ code }}</b> {{ courseBank.find(c => c.code === code)?.nameTh }}
                          <div class="mute text-xs">{{ courseBank.find(c => c.code === code)?.credits }}</div>
                        </span>
                        <button class="x" @click="removeCourse(l2.id, idx)">✕</button>
                      </div>
                      <button v-if="slots[l2.id]?.length" class="add mt-2" @click="openPickModal(l2.id)">＋ เพิ่มรายวิชาจากคลัง</button>
                    </div>
                  </div>
                </template>
              </template>
            </template>

            <template v-else>
               <div class="sl">
                <div class="slot" :class="{ 'over': dragOverSlot === l1.id }" @dragover.prevent="dragOverSlot = l1.id" @dragleave="dragOverSlot = null" @drop="handleDrop(l1.id)">
                  <div v-if="!slots[l1.id]?.length">
                    <span class="mute text-xs mb-2 block">ยังไม่มีรายวิชา</span>
                    <button class="add" @click="openPickModal(l1.id)">＋ เพิ่มรายวิชาจากคลัง</button>
                  </div>

                  <div v-for="(code, idx) in slots[l1.id]" :key="idx" class="crs" draggable="true" @dragstart="handleDragStart(code, l1.id)">
                    <span class="flex-1">
                      <b class="text-[var(--ink)]">{{ code }}</b> {{ courseBank.find(c => c.code === code)?.nameTh }}
                      <div class="mute text-xs">{{ courseBank.find(c => c.code === code)?.credits }}</div>
                    </span>
                    <button class="x" @click="removeCourse(l1.id, idx)">✕</button>
                  </div>
                  <button v-if="slots[l1.id]?.length" class="add mt-2" @click="openPickModal(l1.id)">＋ เพิ่มรายวิชาจากคลัง</button>
                </div>
              </div>
            </template>
          </template>
      </div>

      <aside class="pal">
        <b class="text-[var(--ink)]">คลังวิชา</b>
        <div class="mute text-xs mt-1 mb-3">ลากวิชาไปวางในกลุ่มที่ต้องการ</div>
        <input v-model="searchCourse" class="in text-sm" placeholder="ค้นหาวิชา">

        <div class="palette-list custom-scrollbar mt-3 flex flex-col gap-2">
          <div
            v-for="c in filteredBank"
            :key="c.code"
            class="pi"
            :class="{
              'is-added': isCourseAlreadyAdded(c.code),
              'opacity-60': getMissingPrerequisites(c.code).length > 0 && !isCourseAlreadyAdded(c.code)
            }"
            :draggable="!isCourseAlreadyAdded(c.code)"
            :title="isCourseAlreadyAdded(c.code) ? 'วิชานี้ถูกเพิ่มในโครงสร้างหลักสูตรแล้ว' : ''"
            @dragstart="handleDragStart(c.code, null)"
          >
            <div class="flex justify-between items-center gap-1">
              <b class="text-[var(--ink)]">{{ c.code }}</b>
              <div class="flex items-center gap-1.5">
                <span v-if="isCourseAlreadyAdded(c.code)" class="badge-added">✓ เพิ่มแล้ว</span>
                <span class="mute text-xs">{{ c.credits }}</span>
              </div>
            </div>
            <span class="text-[var(--mute)] text-xs block truncate">{{ c.nameTh }}</span>
            <div
              v-if="getMissingPrerequisites(c.code).length && !isCourseAlreadyAdded(c.code)"
              class="text-[10px] text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 mt-1 border border-amber-200"
            >
              ⚠️ ต้องมี: {{ getMissingPrerequisites(c.code).join(', ') }}
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- 🟡 Modal ค้นหาเลือกวิชาแบบกดคลิก (TAB 1) -->
    <div v-if="isPickModalOpen" class="ov" @click.self="isPickModalOpen = false">
      <div class="modal custom-scrollbar">
        <h3 class="mb-4 text-lg font-bold">เลือกรายวิชาจากคลัง</h3>
        <input v-model="searchPick" class="in mb-4" placeholder="ค้นหารหัสหรือชื่อวิชา">

        <div class="overflow-y-auto max-h-[400px] border-t border-[var(--line)] pt-2 custom-scrollbar">
          <div v-if="filteredPickBank.length === 0" class="mute text-center py-4">ไม่พบรายวิชา</div>
          <div v-for="c in filteredPickBank" :key="c.code" class="flex justify-between items-center p-3 border-b border-[var(--line)] hover:bg-[var(--soft)] transition-colors">
            <div>
              <b class="text-[var(--ink)]">{{ c.code }}</b> <span class="text-sm">{{ c.nameTh }}</span>
              <div class="mute text-xs">{{ c.nameEn }}</div>
              <div
                v-if="getMissingPrerequisites(c.code).length && !isCourseAlreadyAdded(c.code)"
                class="text-xs text-amber-700 bg-amber-50 rounded px-1.5 py-0.5 mt-1 border border-amber-200 inline-block"
              >
                ⚠️ ยังไม่ได้เพิ่มวิชาบังคับก่อน: {{ getMissingPrerequisites(c.code).join(', ') }}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                v-if="isCourseAlreadyAdded(c.code)"
                class="badge-added-modal"
              >
                ✓ เพิ่มแล้ว
              </span>
              <button
                v-else
                class="add"
                style="margin:0;"
                :class="{ 'opacity-60': getMissingPrerequisites(c.code).length }"
                @click="addCourseFromModal(c.code)"
              >
                เพิ่ม {{ c.credits }}
              </button>
            </div>
          </div>
        </div>

        <div class="acts mt-4">
          <button class="btn" @click="isPickModalOpen = false">ปิดหน้าต่าง</button>
        </div>
      </div>
    </div>

    <!-- ===================================== -->
    <!-- 📍 TAB 2: แผนภูมิความต่อเนื่อง (Vue Flow) -->
    <!-- ===================================== -->
    <div v-show="activeView === 'flow'" class="flow-container fade-in">
      <div class="control-panel">
        <div class="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <label class="text-[var(--acc)] font-bold text-sm">เพิ่มรายวิชาลงในกระดาน:</label>
            <div class="flex gap-2 w-full max-w-md mt-1">
              <select v-model="selectedCourseForFlow" class="in flex-1">
                <option value="" disabled>-- เลือกวิชาจากคลัง --</option>
                <option v-for="c in courseBank" :key="c.code" :value="c.code">
                  [{{ c.code }}] {{ c.nameTh }} {{ getMissingPrerequisites(c.code).length ? '(⚠️ ขาดวิชาบังคับก่อน: ' + getMissingPrerequisites(c.code).join(', ') + ')' : '' }}
                </option>
              </select>
              <button @click="addNodeToFlow" class="btn p whitespace-nowrap">เพิ่มลงกระดาน</button>
            </div>
          </div>

          <!-- 📷 ปุ่มบันทึกรูปเฉพาะในแท็บนี้ -->
          <button class="btn flex items-center justify-center gap-2 whitespace-nowrap bg-white" @click="saveFlowAsImage" :disabled="isCapturing">
            <UIcon v-if="isCapturing" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
            <UIcon v-else name="i-heroicons-photo" class="w-5 h-5 text-[var(--acc)]" />
            <span class="font-semibold text-[var(--ink)]">{{ isCapturing ? 'กำลังเตรียมรูปภาพ...' : 'บันทึกเป็นรูป' }}</span>
          </button>
        </div>

        <div class="mute text-xs mt-3">
          <UIcon name="i-heroicons-light-bulb" class="inline w-3 h-3 text-[var(--acc)]" />
          วิชาที่ลากลงโครงสร้างจะถูกดึงมารอไว้ที่นี่อัตโนมัติ
        </div>
      </div>

      <div class="vue-flow-board">
        <VueFlow
          v-model:nodes="vueFlowNodes"
          v-model:edges="vueFlowEdges"
          :default-viewport="{ zoom: 0.8 }"
          :min-zoom="0.2" :max-zoom="1.5"
          :snap-to-grid="true" :snap-grid="[260, 100]"
          :nodes-connectable="false"
          :connect-on-click="false"
          :connection-mode="ConnectionMode.Loose"
          @edge-double-click="onEdgeDoubleClick"
          @node-drag-start="onNodeDragStart"
          @node-drag-stop="onNodeDragStop"
        >
          <Background pattern-color="#e3dcd1" :gap="20" />
          <Controls />

          <template #node-semesterHeader="props">
            <div class="header-node">{{ props.data.label }}</div>
          </template>

          <template #node-customCourse="props">
            <div class="course-node shadow-md">
              <Handle id="left" type="target" :position="Position.Left" class="flow-handle left" :connectable="false" />
              <Handle id="right" type="source" :position="Position.Right" class="flow-handle right" :connectable="false" />

              <div class="node-top" :class="'cat-' + props.data.cat">
                <span class="font-bold">{{ props.data.code }}</span>
                <span class="text-xs">{{ props.data.credits }}</span>
              </div>
              <div class="node-bot">
                <span class="text-[13px] font-medium leading-tight">{{ props.data.name }}</span>
              </div>
              <button class="del-node" @click.stop="removeFlowNode(props.id)">✕</button>
            </div>
          </template>

          <template #edge-flowArrow="edgeProps">
            <FlowArrow v-bind="edgeProps" />
          </template>
        </VueFlow>
      </div>
    </div>
      </div>
    </div>

  </div>

  <!-- เอกสารสำหรับพิมพ์/บันทึกเป็น PDF (ซ่อนบนหน้าจอ) -->
  <CurriculumPrint
    :structure="structure"
    :slots="slots"
    :course-bank="courseBank"
    :curriculum="printCurriculumMeta"
    :obe2="obe2"
    :flow-image="flowImage"
  />
</template>

<style scoped>
/* Builder: the OBE topic menu now occupies the app's left sidebar area. */
.builder-container { flex: 1; min-width: 0; min-height: 0; display: flex; align-items: stretch; overflow: hidden; }
.builder-main { flex: 1; min-width: 0; height: 100%; display: flex; flex-direction: column; }
.builder-header { flex: none; padding: 22px 36px 16px; border-bottom: 1px solid var(--line); background: var(--bg); }
.builder-header .mute { font-size: 14px; color: #5f554a; line-height: 1.6; }
.builder-content { flex: 1; min-height: 0; min-width: 0; overflow-y: auto; padding: 20px 36px 60px; }
.title-field { display: flex; flex-direction: column; gap: 2px; }
.obe-nav { width: 286px; flex: none; height: 100%; position: static; overflow-y: auto; background: var(--panel); border: 0; border-right: 1px solid var(--line); border-radius: 0; padding: 18px 12px 24px; box-shadow: none; }
.nav-home { width: 100%; display: flex; align-items: center; padding: 9px 11px; margin-bottom: 12px; border: 1px solid var(--line); border-radius: 9px; background: #fff; color: #5f554a; font-size: 13.5px; font-weight: 500; transition: 0.15s; }
.nav-home:hover { border-color: var(--acc); color: var(--acc); background: var(--soft); }
.nav-group { margin-bottom: 10px; }
.nav-group-title { display: flex; align-items: center; gap: 7px; padding: 9px 8px 5px; color: #5f554a; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2px; }
.nav-badge { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: var(--soft); color: var(--btn); font-size: 11px; font-weight: 700; }
.nav-item { width: 100%; display: flex; align-items: flex-start; gap: 8px; padding: 9px 9px; border: 1px solid transparent; border-radius: 8px; background: none; color: var(--ink); text-align: left; transition: 0.15s; }
.nav-item:hover { background: #fbf7f0; border-color: var(--line); }
.nav-item.active { background: var(--soft); border-color: #e2d2bd; }
.nav-code { flex: none; min-width: 27px; color: var(--acc); font-size: 12px; font-weight: 700; padding-top: 1px; }
.nav-label { flex: 1; font-size: 13.5px; line-height: 1.5; }
.nav-item.active .nav-label { color: var(--btn); font-weight: 600; }
.done-dot { flex: none; width: 16px; height: 16px; border-radius: 50%; background: #e8f3e8; color: #15803d; font-size: 10.5px; display: inline-flex; align-items: center; justify-content: center; margin-top: 1px; }
.nav-hint { margin: 8px 6px 2px; padding-top: 10px; border-top: 1px dashed var(--line); color: #5f554a; font-size: 11.5px; line-height: 1.55; }

@media (max-width: 1100px) {
  .obe-nav { width: 240px; }
  .nav-label { font-size: 12.5px; }
}
@media (max-width: 860px) {
  .builder-container { flex-direction: column; }
  .obe-nav { width: 100%; height: auto; max-height: 38vh; border-right: none; border-bottom: 1px solid var(--line); padding: 12px; }
  .builder-main { height: auto; flex: 1; min-height: 0; }
  .builder-header { padding: 16px; }
  .builder-content { padding: 14px 16px 40px; }
  .nav-group { margin-bottom: 6px; }
  .nav-item { padding: 7px; }
}

/* Tabs System */
.tabs-container { display: flex; gap: 4px; border-bottom: 2px solid var(--line); }
.tab-btn { padding: 10px 20px; font-size: 15px; font-weight: 600; color: var(--mute); background: none; border: none; border-bottom: 3px solid transparent; margin-bottom: -2px; display: flex; align-items: center; transition: 0.2s; cursor: pointer; }
.tab-btn:hover { color: var(--acc); background: #fdfaf5; }
.tab-btn.active { color: var(--acc); border-color: var(--acc); background: var(--soft); }

.fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

/* โครงสร้างหลัก (TAB 1) */
.pname { width: 100%; font-size: 18px; font-weight: 500; padding: 12px 16px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); margin-top: 6px; }
.pname:focus { border-color: var(--acc); outline: none; box-shadow: 0 0 0 2px rgba(156,120,83,0.15); }
.split { display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: start; }
#tree { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 24px; }
.pal { position: sticky; top: 20px; background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 16px; max-height: 320px; overflow-y: auto; }
.pi { padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px; cursor: grab; font-size: 13.5px; background: #fff; transition: 0.15s; }
.pi:hover { border-color: var(--acc); box-shadow: 0 2px 8px rgba(156,120,83,0.1); }
.pi:active { cursor: grabbing; }
.pi.is-added { background: #fbf9f5; border-color: #86efac; cursor: default; }
.pi.is-added:hover { box-shadow: none; border-color: #86efac; }
.badge-added { font-size: 10.5px; font-weight: 600; color: #166534; background: #dcfce7; border: 1px solid #86efac; border-radius: 4px; padding: 1px 5px; white-space: nowrap; }
.badge-added-modal { font-size: 11.5px; font-weight: 600; color: #166534; background: #dcfce7; border: 1px solid #86efac; border-radius: 6px; padding: 4px 10px; display: inline-flex; align-items: center; gap: 4px; }

.rw { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 6px 0; }
.rw.d1 { padding-left: 0; } .rw.d2 { padding-left: 20px; }
.gb { width: 56px; height: 34px; border: 1px solid var(--line); border-radius: 8px; text-align: center; font-weight: 600; color: var(--ink); outline: none; display: flex; align-items: center; justify-content: center; }
.gb.sm { width: 44px; height: 28px; font-size: 13.5px; }
.cx { display: flex; align-items: center; gap: 10px; white-space: nowrap; font-size: 14px; }
.sl { margin: 4px 0 16px 20px; }
.slot { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 14px; transition: 0.2s; }
.slot.over { outline: 2px dashed var(--acc); background: var(--soft); }

.crs { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 8px 12px; border: 1px solid var(--line); border-radius: 8px; font-size: 14px; background: #fff; margin-bottom: 8px; cursor: grab; box-shadow: 0 1px 2px rgba(0,0,0,0.03); transition: 0.15s; }
.crs:hover { border-color: var(--acc); }
.crs:active { cursor: grabbing; }
.x { border: 0; background: none; color: var(--mute); font-size: 16px; font-weight: bold; transition: 0.15s; padding: 0 6px; }
.x:hover { color: var(--danger); transform: scale(1.1); }

.add { border: 1px dashed var(--mute); background: none; color: var(--ink); border-radius: 8px; padding: 6px 14px; font-size: 13px; font-weight: 500; transition: 0.2s; }
.add:hover { border-color: var(--acc); color: var(--acc); background: var(--soft); border-style: solid; }

/* 🌟 กระดาน Vue Flow (TAB 2) */
.flow-container { display: flex; flex-direction: column; gap: 16px; }
.control-panel { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 16px; }
.vue-flow-board { height: 600px; background: #f8f5f0; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; box-shadow: inset 0 2px 10px rgba(0,0,0,0.03); }

/* สไตล์กล่องและหัวตารางใน Flow */
.header-node { font-size: 14px; font-weight: 600; color: var(--mute); text-align: center; width: 220px; padding-bottom: 8px; border-bottom: 2px solid var(--line); }

.course-node { background: #fff; border: 1.5px solid var(--ink); width: 220px; position: relative; transition: 0.15s; }
.course-node:active { transform: scale(1.02); z-index: 10; box-shadow: 0 8px 20px rgba(0,0,0,0.15); }

.node-top { display: flex; justify-content: space-between; padding: 4px 8px; font-size: 13px; border-bottom: 1.5px solid var(--ink); color: #fff; }
.node-top.cat-gened { background: #6f6961; }
.node-top.cat-basic { background: #86643f; }
.node-top.cat-core { background: #9C7853; }
.node-top.cat-elective { background: #c2a785; color: var(--ink); }

.node-bot { padding: 8px; text-align: center; min-height: 48px; display: flex; align-items: center; justify-content: center; color: var(--ink); }

/* ปุ่มลบกล่องใน Flow */
.del-node { position: absolute; top: -10px; right: -10px; background: #fff; border: 1px solid var(--danger); color: var(--danger); width: 22px; height: 22px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 12px; opacity: 0; cursor: pointer; transition: 0.2s; }
.course-node:hover .del-node { opacity: 1; }
.del-node:hover { background: var(--danger); color: #fff; }

/* จุดเชื่อมเส้น (Handle) - ซ่อนและปิดการลากเชื่อมเอง */
.flow-handle { width: 0 !important; height: 0 !important; background: transparent !important; border: none !important; opacity: 0 !important; pointer-events: none !important; cursor: default !important; }
.flow-handle.left { left: 0; } .flow-handle.right { right: 0; }

/* บังคับ SVG Path ใน Vue Flow ไม่ให้มีพื้นหลัง */
:deep(.vue-flow__edge-path) { fill: none !important; }

/* Modal ค้นหาวิชาแบบกดคลิก */
.ov { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 50; }
.modal { background: var(--panel); border-radius: 14px; width: min(600px, 100%); max-height: 90vh; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
</style>
