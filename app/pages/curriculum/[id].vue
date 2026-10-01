<!-- pages/curriculum/[id].vue -->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// === Vue Flow Imports ===
import { VueFlow, useVueFlow, Handle, Position, MarkerType, ConnectionMode } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'

const route = useRoute()
const router = useRouter()
const isNew = route.query.type === 'new'

// === Tab System ===
const activeTab = ref<'structure' | 'flow'>('structure')

const curriculum = ref({
  id: route.params.id,
  name: '',
  type: isNew ? 'สร้างหลักสูตรใหม่' : 'ปรับปรุงหลักสูตร',
  totalCredit: 132
})

// คลังวิชา 
const courseBank = ref([
  { code: '080103063', nameTh: 'การใช้ภาษาอังกฤษ', cat: 'gened', credits: '3(3-0-6)', cVal: 3, pre: [] },
  { code: '080203914', nameTh: 'ผู้ประกอบการนวัตกรรม', cat: 'gened', credits: '3(3-0-6)', cVal: 3, pre: [] },
  { code: '080303701', nameTh: 'กระบวนการคิดเชิงออกแบบ', cat: 'gened', credits: '3(3-0-6)', cVal: 3, pre: [] },
  { code: '080103001', nameTh: 'ภาษาอังกฤษ 1', cat: 'gened', credits: '3(3-0-6)', cVal: 3, pre: [] },
  { code: '080103002', nameTh: 'ภาษาอังกฤษ 2', cat: 'gened', credits: '3(3-0-6)', cVal: 3, pre: ['080103001'] },
  { code: '030103300', nameTh: 'Engineering Drawing', cat: 'core', credits: '3(2-2-5)', cVal: 3, pre: [] },
  { code: '040113001', nameTh: 'Chemistry for Engineers', cat: 'basic', credits: '3(3-0-6)', cVal: 3, pre: [] },
  { code: '040203111', nameTh: 'Engineering Mathematics I', cat: 'basic', credits: '3(3-0-6)', cVal: 3, pre: [] },
  { code: '030413100', nameTh: 'Electric Circuit Analysis I', cat: 'core', credits: '3(3-0-6)', cVal: 3, pre: ['040203111'] },
  { code: '030513900', nameTh: 'Computer Programming', cat: 'core', credits: '3(2-2-5)', cVal: 3, pre: [] }
])

const searchCourse = ref('')
const filteredBank = computed(() => {
  const q = searchCourse.value.trim().toLowerCase()
  return courseBank.value.filter(c => c.code.includes(q) || c.nameTh.toLowerCase().includes(q))
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
  return node.children.reduce((sum: number, child: any) => sum + (child.type === 'credit' ? (child.req || 0) : 0), 0)
}
const getL1ReqSum = () => { return structure.value.reduce((sum, l1) => sum + (l1.type === 'credit' ? (l1.req || 0) : 0), 0) }
const getCourseCredit = (code: string) => { const c = courseBank.value.find(x => x.code === code); return c ? c.cVal : 0 }
const getSlotSum = (slotId: string) => (slots.value[slotId] || []).reduce((sum, code) => sum + getCourseCredit(code), 0)

const getDynamicReq = (node: any): number => {
  if (node.type === 'hour') return node.req
  if (node.children && node.children.length > 0) {
    let sum = 0; node.children.forEach((child: any) => { sum += getDynamicReq(child) })
    node.req = sum; return sum
  }
  return node.req || 0
}

const grandTotalCredit = computed(() => { let total = 0; structure.value.forEach(l1 => { total += getDynamicReq(l1) }); return total })
const totalSelectedCredits = computed(() => { let sum = 0; for (const key in slots.value) { if (key !== 'g24') sum += getSlotSum(key) } return sum })

const findNode = (nodes: any[], id: string): any => {
  for (const n of nodes) { if (n.id === id) return n; if (n.children) { const found = findNode(n.children, id); if (found) return found } } return null
}

const isCourseAlreadyAdded = (code: string) => {
  for (const key in slots.value) { if (slots.value[key].includes(code)) return true } return false
}

const checkLimit = (slotId: string, addedCode: string) => {
  const node = findNode(structure.value, slotId)
  if (!node || node.req === undefined || node.type === 'hour') return true
  if (getSlotSum(slotId) + getCourseCredit(addedCode) > node.req) { alert(`ไม่สามารถเพิ่มวิชานี้ได้!\nหน่วยกิตรวมกลุ่มนี้จะเกินที่กำหนดไว้ (${node.req} นก.)`); return false }
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

  if (!checkLimit(toSlot, code)) { dragItem.value = null; dragOverSlot.value = null; return }

  if (fromSlot && fromSlot !== toSlot) {
    const idx = slots.value[fromSlot].indexOf(code)
    if (idx !== -1) slots.value[fromSlot].splice(idx, 1)
  }
  
  if (!slots.value[toSlot].includes(code)) { slots.value[toSlot].push(code) }
  
  dragItem.value = null; dragOverSlot.value = null;
}

const removeCourse = (slotId: string, index: number) => slots.value[slotId].splice(index, 1)

const isPickModalOpen = ref(false)
const activePickSlot = ref<string | null>(null)
const searchPick = ref('')
const openPickModal = (slotId: string) => { activePickSlot.value = slotId; searchPick.value = ''; isPickModalOpen.value = true; }
const filteredPickBank = computed(() => {
  const q = searchPick.value.trim().toLowerCase()
  return courseBank.value.filter(c => c.code.includes(q) || c.nameTh.toLowerCase().includes(q))
})
const addCourseFromModal = (code: string) => {
  if (!activePickSlot.value) return
  if (isCourseAlreadyAdded(code)) { alert(`วิชา ${code} ถูกเพิ่มไปแล้ว (ไม่สามารถใส่ซ้ำได้)`); return }
  if (!checkLimit(activePickSlot.value, code)) return
  slots.value[activePickSlot.value].push(code)
}

// ==========================================
// 🔀 ส่วนที่ 2: ระบบแผนภูมิ Vue Flow (TAB 2)
// ==========================================
const { fitView, setViewport } = useVueFlow()

const FLOW_COLS = [
  { label: 'ภาคการศึกษาที่ 1' }, { label: 'ภาคการศึกษาที่ 2' },
  { label: 'ภาคการศึกษาที่ 3' }, { label: 'ภาคการศึกษาที่ 4' },
  { label: 'ภาคการศึกษาที่ 5' }, { label: 'ภาคการศึกษาที่ 6' },
  { label: 'ภาคการศึกษาที่ 7' }, { label: 'ภาคการศึกษาที่ 8' }
]

const vueFlowNodes = ref<any[]>([])
const vueFlowEdges = ref<any[]>([])
const selectedCourseForFlow = ref('')

const initFlowMap = () => {
  const headers = FLOW_COLS.map((col, idx) => ({
    id: `header-${idx}`, type: 'semesterHeader',
    position: { x: idx * 260, y: 0 }, data: { label: col.label }, 
    draggable: false, selectable: false, connectable: false
  }))
  vueFlowNodes.value = [...headers]
}

// 🌟 แก้ไขสไตล์เส้นตรงนี้ เพิ่ม fill: 'none' เพื่อป้องกันการเทสีในช่องโค้ง
const EDGE_STYLE = { stroke: '#4a3319', strokeWidth: 3, fill: 'none' }
const EDGE_MARKER = { type: MarkerType.ArrowClosed, color: '#4a3319' }

const generateAutoEdges = () => {
  vueFlowNodes.value.forEach(node => {
    if (node.type !== 'customCourse') return
    const c = courseBank.value.find(x => x.code === node.data.code)
    if (c && c.pre && c.pre.length > 0) {
      c.pre.forEach(preCode => {
        const preNode = vueFlowNodes.value.find(n => n.data?.code === preCode)
        if (preNode) {
          const edgeId = `e-auto-${preNode.id}-${node.id}`
          const edgeExists = vueFlowEdges.value.some(e => e.source === preNode.id && e.target === node.id)
          if (!edgeExists) {
            vueFlowEdges.value.push({
              id: edgeId, source: preNode.id, target: node.id,
              sourceHandle: 'right', targetHandle: 'left',
              animated: false, style: EDGE_STYLE, markerEnd: EDGE_MARKER
            })
          }
        }
      })
    }
  })
}

const syncStructureToFlow = () => {
  let addedCount = 0
  const allSelectedCodes = new Set<string>()
  for (const key in slots.value) { slots.value[key].forEach(code => allSelectedCodes.add(code)) }

  const existing = vueFlowNodes.value.filter(n => n.position.x === 0 && n.type !== 'semesterHeader')
  let newY = existing.length > 0 ? Math.max(...existing.map(n => n.position.y)) + 100 : 100

  allSelectedCodes.forEach(code => {
    const isAlreadyInFlow = vueFlowNodes.value.some(n => n.data?.code === code)
    if (!isAlreadyInFlow) {
      const c = courseBank.value.find(x => x.code === code)
      if (c) {
        while (vueFlowNodes.value.some(n => n.position.x === 0 && n.position.y === newY)) { newY += 100 }
        vueFlowNodes.value.push({
          id: `node_${c.code}_${Date.now()}_${Math.floor(Math.random()*1000)}`, 
          type: 'customCourse', position: { x: 0, y: newY },
          data: { name: c.nameTh, code: c.code, cat: c.cat, credits: c.credits }
        })
        addedCount++
      }
    }
  })
  if (addedCount > 0) generateAutoEdges()
}

watch(activeTab, (newTab) => { 
  if (newTab === 'flow') {
    syncStructureToFlow()
  }
})

const addNodeToFlow = () => {
  if (!selectedCourseForFlow.value) return alert('กรุณาเลือกวิชาจากคลัง')
  const isAlreadyInFlow = vueFlowNodes.value.some(n => n.data?.code === selectedCourseForFlow.value)
  if (isAlreadyInFlow) return alert(`วิชารหัส ${selectedCourseForFlow.value} อยู่ในกระดานแล้ว`)

  const c = courseBank.value.find(x => x.code === selectedCourseForFlow.value)
  if (!c) return

  const existing = vueFlowNodes.value.filter(n => n.position.x === 0 && n.type !== 'semesterHeader')
  let newY = existing.length > 0 ? Math.max(...existing.map(n => n.position.y)) + 100 : 100
  
  while (vueFlowNodes.value.some(n => n.position.x === 0 && n.position.y === newY)) { newY += 100 }

  vueFlowNodes.value.push({
    id: `node_${c.code}_${Date.now()}`, type: 'customCourse', position: { x: 0, y: newY },
    data: { name: c.nameTh, code: c.code, cat: c.cat, credits: c.credits }
  })
  generateAutoEdges()
}

const draggedNodeInitialPos = ref<Record<string, {x: number, y: number}>>({})
const onNodeDragStart = (event: any) => { draggedNodeInitialPos.value[event.node.id] = { ...event.node.position } }
const onNodeDragStop = (event: any) => {
  const draggedNode = event.node
  const nodes = vueFlowNodes.value
  
  if (draggedNode.position.y < 80) {
    if (draggedNodeInitialPos.value[draggedNode.id]) draggedNode.position = { ...draggedNodeInitialPos.value[draggedNode.id] }
    delete draggedNodeInitialPos.value[draggedNode.id]; return
  }
  
  const isOverlapping = nodes.some(n => n.id !== draggedNode.id && n.type === 'customCourse' && n.position.x === draggedNode.position.x && n.position.y === draggedNode.position.y)
  if (isOverlapping && draggedNodeInitialPos.value[draggedNode.id]) {
    draggedNode.position = { ...draggedNodeInitialPos.value[draggedNode.id] }
    alert('ไม่สามารถวางวิชาทับกันได้')
  }
  delete draggedNodeInitialPos.value[draggedNode.id]
}

const onConnectEdge = (params: any) => {
  vueFlowEdges.value.push({
    id: `e-${params.source}-${params.target}-${Date.now()}`,
    source: params.source, target: params.target,
    sourceHandle: params.sourceHandle, targetHandle: params.targetHandle,
    animated: false, style: EDGE_STYLE, markerEnd: EDGE_MARKER
  })
}

const onEdgeDoubleClick = (event: any) => { vueFlowEdges.value = vueFlowEdges.value.filter(e => e.id !== event.edge.id) }
const removeFlowNode = (id: string) => {
  vueFlowNodes.value = vueFlowNodes.value.filter(n => n.id !== id)
  vueFlowEdges.value = vueFlowEdges.value.filter(e => e.source !== id && e.target !== id)
}

onMounted(() => { initFlowMap() })

// ==========================================
// 📷 ส่วนที่ 3: ระบบบันทึกภาพถ่าย (html-to-image)
// ==========================================
const isCapturing = ref(false)
const saveFlowAsImage = async () => {
  isCapturing.value = true
  try {
    const htmlToImage = await import('html-to-image')
    const flowBoard = document.querySelector('.vue-flow-board') as HTMLElement
    
    if (!flowBoard) return

    let maxX = 0; let maxY = 0;
    vueFlowNodes.value.forEach(n => {
      if (n.position.x > maxX) maxX = n.position.x
      if (n.position.y > maxY) maxY = n.position.y
    })
    
    const exactWidth = Math.max(maxX + 280, 2080) 
    const exactHeight = Math.max(maxY + 150, 400) 

    const controls = document.querySelector('.vue-flow__panel') as HTMLElement
    if (controls) controls.style.display = 'none'

    const origWidth = flowBoard.style.width
    const origHeight = flowBoard.style.height
    flowBoard.style.width = `${exactWidth}px`
    flowBoard.style.height = `${exactHeight}px`

    if (setViewport) setViewport({ x: 0, y: 0, zoom: 1 })
    
    const nodes = document.querySelectorAll('.course-node')
    nodes.forEach((n: any) => n.style.boxShadow = 'none')

    await new Promise(r => setTimeout(r, 600)) 

    const dataUrl = await htmlToImage.toPng(flowBoard, { 
      backgroundColor: '#f8f5f0',
      width: exactWidth,
      height: exactHeight,
      style: {
        width: `${exactWidth}px`,
        height: `${exactHeight}px`,
        transform: 'scale(1)'
      }
    })
    
    flowBoard.style.width = origWidth
    flowBoard.style.height = origHeight
    nodes.forEach((n: any) => n.style.boxShadow = '')
    if (controls) controls.style.display = ''
    if (fitView) fitView({ padding: 0.1, duration: 300 })

    const link = document.createElement('a')
    link.download = `curriculum-flow-${curriculum.value.id}.png`
    link.href = dataUrl
    link.click()

  } catch (error) {
    alert('เกิดข้อผิดพลาดในการบันทึกรูปภาพ กรุณาตรวจสอบว่าติดตั้ง html-to-image แล้ว')
  } finally {
    isCapturing.value = false
  }
}

const isSaving = ref(false)
const saveCurriculum = () => {
  isSaving.value = true
  const payload = {
    curriculum_id: curriculum.value.id,
    name: curriculum.value.name,
    total_credit: curriculum.value.totalCredit,
    structure: structure.value,
    selected_courses: slots.value,
    flow_map: {
      nodes: vueFlowNodes.value.filter(n => n.type !== 'semesterHeader'),
      edges: vueFlowEdges.value
    }
  }
  setTimeout(() => { alert('บันทึกข้อมูลหลักสูตรและแผนภูมิเรียบร้อยแล้ว!'); isSaving.value = false }, 800)
}
</script>

<template>
  <div class="builder-container">
    
    <div class="row mb-4">
      <button class="back" @click="router.push('/')">‹ กลับหน้าแรก</button>
    </div>

    <h1 class="pt text-[var(--acc)] text-2xl font-bold mb-2">{{ curriculum.type }}</h1>
    
    <h2 class="fl">ชื่อหลักสูตร</h2>
    <input v-model="curriculum.name" class="pname" placeholder="ชื่อโปรเจกต์หลักสูตร (เช่น วิศวกรรมคอมพิวเตอร์ หลักสูตรใหม่ พ.ศ. 2570)">
    
    <div class="mute mt-2 flex justify-between items-center">
      <div>
        <span class="tag bg-[var(--btn)] text-white px-2 py-1 rounded-md text-xs">ประธานหลักสูตร</span> 
        องค์ประกอบที่ 3 โครงสร้างหลักสูตร และแผนภูมิ
      </div>
      <button class="btn p flex items-center gap-2" @click="saveCurriculum" :disabled="isSaving">
        <UIcon v-if="isSaving" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
        <UIcon v-else name="i-heroicons-document-check" class="w-4 h-4" />
        {{ isSaving ? 'กำลังบันทึก...' : 'บันทึกหลักสูตร' }}
      </button>
    </div>

    <!-- 🌟 ระบบ Tab สลับหน้าต่าง -->
    <div class="tabs-container mt-6 mb-6">
      <button class="tab-btn" :class="{ 'active': activeTab === 'structure' }" @click="activeTab = 'structure'">
        <UIcon name="i-heroicons-list-bullet" class="w-5 h-5 mr-1" /> โครงสร้างหลักสูตร
      </button>
      <button class="tab-btn" :class="{ 'active': activeTab === 'flow' }" @click="activeTab = 'flow'">
        <UIcon name="i-heroicons-arrow-path-rounded-square" class="w-5 h-5 mr-1" /> แผนภูมิความต่อเนื่อง
      </button>
    </div>

    <!-- ===================================== -->
    <!-- 📍 TAB 1: โครงสร้างหลักสูตร (ลากวาง) -->
    <!-- ===================================== -->
    <div v-show="activeTab === 'structure'" class="split">
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
          <div v-for="c in filteredBank" :key="c.code" class="pi" draggable="true" @dragstart="handleDragStart(c.code, null)">
            <b class="text-[var(--ink)]">{{ c.code }}</b> <span class="mute">{{ c.credits }}</span><br>
            <span class="text-[var(--mute)] text-xs">{{ c.nameTh }}</span>
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
            </div>
            <button class="add" style="margin:0;" @click="addCourseFromModal(c.code)">เพิ่ม {{ c.credits }}</button>
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
    <div v-show="activeTab === 'flow'" class="flow-container fade-in">
      <div class="control-panel">
        <div class="flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <label class="text-[var(--acc)] font-bold text-sm">เพิ่มรายวิชาลงในกระดาน:</label>
            <div class="flex gap-2 w-full max-w-md mt-1">
              <select v-model="selectedCourseForFlow" class="in flex-1">
                <option value="" disabled>-- เลือกวิชาจากคลัง --</option>
                <option v-for="c in courseBank" :key="c.code" :value="c.code">[{{ c.code }}] {{ c.nameTh }}</option>
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
          วิชาที่ลากลงโครงสร้างจะถูกดึงมารอไว้ที่นี่อัตโนมัติ โยงเส้นได้โดยลากจากจุดด้านข้าง และดับเบิ้ลคลิกเส้นเพื่อลบ
        </div>
      </div>

      <div class="vue-flow-board">
        <VueFlow 
          v-model:nodes="vueFlowNodes" 
          v-model:edges="vueFlowEdges" 
          :default-viewport="{ zoom: 0.8 }" 
          :min-zoom="0.2" :max-zoom="1.5" 
          :snap-to-grid="true" :snap-grid="[260, 100]"
          :connection-mode="ConnectionMode.Loose" 
          @connect="onConnectEdge"
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
              <Handle id="top" type="source" :position="Position.Top" class="flow-handle top" />
              <Handle id="left" type="source" :position="Position.Left" class="flow-handle left" />
              <Handle id="right" type="source" :position="Position.Right" class="flow-handle right" />
              <Handle id="bottom" type="source" :position="Position.Bottom" class="flow-handle bottom" />
              
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
        </VueFlow>
      </div>
    </div>

  </div>
</template>

<style scoped>
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
.pal { position: sticky; top: 20px; background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 16px; max-height: 85vh; overflow-y: auto; }
.pi { padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px; cursor: grab; font-size: 13.5px; background: #fff; transition: 0.15s; }
.pi:hover { border-color: var(--acc); box-shadow: 0 2px 8px rgba(156,120,83,0.1); }
.pi:active { cursor: grabbing; }

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

/* จุดเชื่อมเส้น (Handle) */
.flow-handle { width: 12px !important; height: 12px !important; background: var(--acc) !important; border: 2px solid #fff !important; opacity: 0; transition: 0.2s; }
.course-node:hover .flow-handle { opacity: 1; }
.flow-handle.left { left: -6px; } .flow-handle.right { right: -6px; }
.flow-handle.top { top: -6px; } .flow-handle.bottom { bottom: -6px; }

/* บังคับ SVG Path ใน Vue Flow ไม่ให้มีพื้นหลัง */
:deep(.vue-flow__edge-path) { fill: none !important; }

/* Modal ค้นหาวิชาแบบกดคลิก */
.ov { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 50; }
.modal { background: var(--panel); border-radius: 14px; width: min(600px, 100%); max-height: 90vh; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: flex; flex-direction: column; }
</style>