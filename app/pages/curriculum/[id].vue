<!-- pages/curriculum/[id].vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isNew = route.query.type === 'new'

const curriculum = ref({
  id: route.params.id,
  name: '',
  type: isNew ? 'สร้างหลักสูตรใหม่' : 'ปรับปรุงหลักสูตร',
  totalCredit: 132
})

// คลังวิชาจำลอง
const courseBank = ref([
  { code: '080103063', nameTh: 'การใช้ภาษาอังกฤษ', nameEn: 'Practical English', credits: '3(3-0-6)', cVal: 3 },
  { code: '080203914', nameTh: 'ผู้ประกอบการนวัตกรรม', nameEn: 'Innovative Technopreneurs', credits: '3(3-0-6)', cVal: 3 },
  { code: '080303701', nameTh: 'กระบวนการคิดเชิงออกแบบ', nameEn: 'Design Thinking', credits: '3(3-0-6)', cVal: 3 },
  { code: '080303401', nameTh: 'คาราโอเกะ', nameEn: 'Karaoke', credits: '1(0-2-1)', cVal: 1 },
  { code: '080303509', nameTh: 'เปตอง', nameEn: 'Pétanque', credits: '1(0-2-1)', cVal: 1 },
  { code: '080103018', nameTh: 'ภาษาอังกฤษเพื่อการทำงาน', nameEn: 'English for Work', credits: '3(3-0-6)', cVal: 3 },
  { code: '080103001', nameTh: 'ภาษาอังกฤษ 1', nameEn: 'English I', credits: '3(3-0-6)', cVal: 3 },
  { code: '080103002', nameTh: 'ภาษาอังกฤษ 2', nameEn: 'English II', credits: '3(3-0-6)', cVal: 3 },
  { code: '030413100', nameTh: 'การวิเคราะห์วงจรไฟฟ้า 1', nameEn: 'Electric Circuit Analysis I', credits: '3(3-0-6)', cVal: 3 }
])

const searchCourse = ref('')
const filteredBank = computed(() => {
  const q = searchCourse.value.trim().toLowerCase()
  return courseBank.value.filter(c => c.code.includes(q) || c.nameTh.toLowerCase().includes(q))
})

// โครงสร้างหลักสูตรและหน่วยกิตที่ตั้งค่าไว้
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

// === 🌟 1. ระบบตรวจสอบความสอดคล้องของหน่วยกิต (Hierarchy Validation) ===
const getChildrenReqSum = (node: any) => {
  if (!node.children || node.children.length === 0) return 0
  return node.children.reduce((sum: number, child: any) => sum + (child.type === 'credit' ? (child.req || 0) : 0), 0)
}

const getL1ReqSum = () => {
  return structure.value.reduce((sum, l1) => sum + (l1.type === 'credit' ? (l1.req || 0) : 0), 0)
}

// === 🌟 2. คำนวณหน่วยกิตรายวิชาที่อยู่ในตระกร้า ===
const getCourseCredit = (code: string) => {
  const c = courseBank.value.find(x => x.code === code)
  return c ? c.cVal : 0
}

const getSlotSum = (slotId: string) => (slots.value[slotId] || []).reduce((sum, code) => sum + getCourseCredit(code), 0)

const totalSelectedCredits = computed(() => {
  let sum = 0
  for (const key in slots.value) { if (key !== 'g24') sum += getSlotSum(key) } // ข้ามชั่วโมง
  return sum
})

// === 🌟 3. ตรวจสอบการลากลงตระกร้า (ไม่ให้เกินโควตา และ ห้ามซ้ำ) ===
const findNode = (nodes: any[], id: string): any => {
  for (const n of nodes) {
    if (n.id === id) return n
    if (n.children) { const found = findNode(n.children, id); if (found) return found }
  }
  return null
}

const isCourseAlreadyAdded = (code: string) => {
  for (const key in slots.value) {
    if (slots.value[key].includes(code)) return true
  }
  return false
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

// === Drag & Drop Logic ===
const dragItem = ref<{ code: string, fromSlot: string | null } | null>(null)
const dragOverSlot = ref<string | null>(null)

const handleDragStart = (code: string, fromSlot: string | null = null) => { dragItem.value = { code, fromSlot } }

const handleDrop = (toSlot: string) => {
  if (!dragItem.value) return
  const { code, fromSlot } = dragItem.value
  
  // เช็คว่าวิชาซ้ำไหม (ถ้าลากมาจากคลัง)
  if (!fromSlot && isCourseAlreadyAdded(code)) {
    alert(`วิชา ${code} ถูกเพิ่มในหลักสูตรไปแล้ว (ไม่สามารถใส่ซ้ำได้)`)
    dragItem.value = null; dragOverSlot.value = null; return
  }

  // เช็คหน่วยกิตเกินลิมิตไหม
  if (!checkLimit(toSlot, code)) {
    dragItem.value = null; dragOverSlot.value = null; return
  }

  // ลบจากกล่องเดิมถ้าเป็นการลากย้ายกล่อง
  if (fromSlot && fromSlot !== toSlot) {
    const idx = slots.value[fromSlot].indexOf(code)
    if (idx !== -1) slots.value[fromSlot].splice(idx, 1)
  }
  
  if (!slots.value[toSlot].includes(code)) {
    slots.value[toSlot].push(code)
  }
  
  dragItem.value = null; dragOverSlot.value = null;
}

const removeCourse = (slotId: string, index: number) => slots.value[slotId].splice(index, 1)

// === Modal ค้นหา ===
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
  if (isCourseAlreadyAdded(code)) {
    alert(`วิชา ${code} ถูกเพิ่มไปแล้ว (ไม่สามารถใส่ซ้ำได้)`)
    return
  }
  if (!checkLimit(activePickSlot.value, code)) return
  slots.value[activePickSlot.value].push(code)
}

// === 🛠️ TO BACKEND: บันทึกข้อมูลหลักสูตร ===
const isSaving = ref(false)
const saveCurriculum = async () => {
  if (!curriculum.value.name) {
    alert('กรุณากรอกชื่อหลักสูตรก่อนบันทึก')
    return
  }

  isSaving.value = true
  
  // ชุดข้อมูลเตรียมส่ง API
  const payload = {
    curriculum_id: curriculum.value.id,
    name: curriculum.value.name,
    total_credit: curriculum.value.totalCredit,
    structure: structure.value,
    selected_courses: slots.value
  }

  try {
    // await $fetch('/api/curriculums/save', { method: 'POST', body: payload })
    setTimeout(() => {
      alert('บันทึกข้อมูลหลักสูตรเรียบร้อยแล้ว!')
      isSaving.value = false
    }, 800)
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการบันทึก')
    isSaving.value = false
  }
}
</script>

<template>
  <div class="builder-container">
    
    <div class="row" style="margin-bottom: 20px;">
      <button class="back" @click="router.push('/')">‹ กลับหน้าแรก</button>
    </div>

    <h1 class="pt">{{ curriculum.type }}</h1>
    
    <h2 class="fl">ชื่อหลักสูตร</h2>
    <input v-model="curriculum.name" class="pname" placeholder="ชื่อโปรเจกต์หลักสูตร (เช่น วิศวกรรมคอมพิวเตอร์ หลักสูตรใหม่ พ.ศ. 2570)">
    <div class="mute mt-2">
      <span class="tag chair">ประธานหลักสูตร</span> 
      องค์ประกอบที่ 3 โครงสร้างหลักสูตร รายวิชาและหน่วยกิต
    </div>

    <div class="row mt-6">
      <h2 class="fl">โครงสร้างหลักสูตร</h2>
      <button class="btn p flex items-center gap-2" @click="saveCurriculum" :disabled="isSaving">
        <UIcon v-if="isSaving" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
        <UIcon v-else name="i-heroicons-document-check" class="w-4 h-4" />
        {{ isSaving ? 'กำลังบันทึก...' : 'บันทึกหลักสูตร' }}
      </button>
    </div>

    <div class="split">
      <!-- 🟢 ฝั่งซ้าย: โครงสร้าง (Tree) -->
      <div id="tree">
        
        <!-- 🌟 ยอดรวมหน่วยกิตทั้งหมด -->
        <div class="rw d1 items-start" style="border-bottom: 1px solid var(--line); padding-bottom: 16px; margin-bottom: 24px;">
          <div class="flex flex-col">
            <span class="lb text-[17px] font-bold text-[var(--ink)]">จำนวนหน่วยกิตรวมตลอดหลักสูตร</span>
            <!-- แจ้งเตือนถ้ายอด L1 รวมกันเกินยอดหลักสูตร -->
            <span v-if="getL1ReqSum() > curriculum.totalCredit" class="text-[var(--danger)] text-[12.5px] mt-1 font-medium">
              ⚠️ หมวดวิชาทั้งหมดรวมกัน ({{getL1ReqSum()}}) เกินหน่วยกิตรวมหลักสูตร ({{curriculum.totalCredit}})
            </span>
          </div>
          <span class="cx mt-1">
            <span class="sel" :class="{'done': totalSelectedCredits === curriculum.totalCredit}">เลือกแล้ว {{ totalSelectedCredits }}</span>
            <input type="number" v-model="curriculum.totalCredit" class="gb">
            <b class="text-[var(--mute)] text-sm">หน่วยกิต</b>
          </span>
        </div>

        <template v-for="l1 in structure" :key="l1.id">
          
          <div class="rw d1 mt-4 items-start">
            <div class="flex flex-col">
              <span class="lb font-bold text-[var(--ink)]">{{ l1.title }}</span>
              <!-- แจ้งเตือนถ้ายอด L2 รวมกันเกินยอดหมวด L1 -->
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
                  <!-- แจ้งเตือนถ้ายอด L3 รวมกันเกินยอดกลุ่ม L2 -->
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
                      <span class="sel" :class="{'done': getSlotSum(l3.id) >= l3.req}">เลือกแล้ว {{ getSlotSum(l3.id) }}</span>
                      <input type="number" v-model="l3.req" class="gb sm">
                      <b class="text-[var(--mute)] text-xs font-medium">{{ l3.type === 'hour' ? 'ชั่วโมง' : 'หน่วยกิต' }}</b>
                    </span>
                  </div>

                  <!-- 📥 Dropzone L3 -->
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
                <!-- 📥 Dropzone L2 -->
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
             <!-- 📥 Dropzone L1 -->
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

      <!-- 🔵 ฝั่งขวา (คลังวิชา) -->
      <aside class="pal">
        <b class="text-[var(--ink)]">คลังวิชา</b>
        <div class="mute text-xs mt-1 mb-3">ลากวิชาไปวางในกลุ่มที่ต้องการ หรือลากย้ายระหว่างกลุ่ม</div>
        
        <input v-model="searchCourse" class="in text-sm" placeholder="ค้นหาวิชา">
        
        <div class="mt-2 flex flex-col gap-2">
          <div v-for="c in filteredBank" :key="c.code" class="pi" draggable="true" @dragstart="handleDragStart(c.code, null)">
            <b class="text-[var(--ink)]">{{ c.code }}</b> <span class="mute">{{ c.credits }}</span><br>
            <span class="text-[var(--mute)]">{{ c.nameTh }}</span>
          </div>
        </div>
      </aside>
    </div>

    <!-- 🟡 Modal ค้นหาเลือกวิชา -->
    <div v-if="isPickModalOpen" class="ov" @click.self="isPickModalOpen = false">
      <div class="modal custom-scrollbar">
        <h3 class="mb-4">เลือกรายวิชาจากคลัง</h3>
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

  </div>
</template>

<style scoped>
.back { border: 0; background: none; color: var(--mute); padding: 0; font-weight: 500; font-size: 14px; transition: 0.15s; }
.back:hover { color: var(--acc); }

.pname { width: 100%; font-size: 18px; font-weight: 500; padding: 12px 16px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); margin-top: 6px; }
.pname:focus { border-color: var(--acc); outline: none; box-shadow: 0 0 0 2px rgba(156,120,83,0.15); }
.pt { font-size: 26px; font-weight: 700; color: var(--acc); margin: 0 0 10px; }
.fl { font-size: 18px; font-weight: 700; color: var(--ink); margin: 0; }
.mt-2 { margin-top: 8px; } .mt-4 { margin-top: 16px; } .mt-6 { margin-top: 24px; }
.tag { display: inline-block; font-size: 12px; padding: 2px 10px; border-radius: 12px; background: var(--chip); margin-right: 6px; font-weight: 600; }
.tag.chair { background: var(--btn); color: var(--onbtn); }

.split { display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: start; }
#tree { background: var(--bg); padding-bottom: 20px; }
.pal { position: sticky; top: 20px; background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 16px; max-height: 85vh; overflow-y: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.pi { padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px; cursor: grab; font-size: 13.5px; background: #fff; transition: 0.15s; }
.pi:hover { border-color: var(--acc); box-shadow: 0 2px 8px rgba(156,120,83,0.1); }
.pi:active { cursor: grabbing; }

.rw { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 6px 0; font-size: 15px; }
.rw.d1 { padding-left: 0; }
.rw.d2 { padding-left: 20px; }
.nt { font-size: 13px; font-weight: 500; padding: 0 0 6px 20px; }

.cx { display: flex; align-items: center; gap: 10px; white-space: nowrap; font-size: 14px; }

.gb { width: 56px; height: 34px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); text-align: center; font-weight: 600; color: var(--ink); outline: none; transition: 0.2s; display: flex; align-items: center; justify-content: center; }
.gb.sm { width: 44px; height: 28px; font-size: 13.5px; border-radius: 6px; }
input.gb:focus { border-color: var(--acc); box-shadow: 0 0 0 2px rgba(156,120,83,0.2); }

.sel { font-size: 13px; color: var(--mute); font-weight: 500; }
.sel.done { color: var(--ok); font-weight: 600; }

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

/* Modal */
.ov { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 50; }
.modal { background: var(--panel); border-radius: 14px; width: min(600px, 100%); max-height: 90vh; padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: flex; flex-direction: column; }

@media (max-width: 768px) {
  .split { grid-template-columns: 1fr; }
  .pal { position: relative; top: 0; max-height: 400px; }
}
</style>