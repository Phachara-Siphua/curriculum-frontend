<!-- pages/courses.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const courses = ref([
  { code: '080103001', nameTh: 'ภาษาอังกฤษ 1', nameEn: 'English I', credits: '3(3-0-6)', pre: [], co: [], by: 'User', descTh: 'ทักษะการฟัง การพูด การอ่าน และการเขียน การสื่อสารในงานและกิจวัตรประจำวันแบบง่าย', descEn: 'Listening, speaking, reading and writing skills; communicating in simple and routine tasks.' },
  { code: '080103002', nameTh: 'ภาษาอังกฤษ 2', nameEn: 'English II', credits: '3(3-0-6)', pre: ['080103001'], co: [], by: 'User', descTh: 'ทักษะการฟัง การพูด การอ่าน และการเขียน การสื่อสาร และการแสดงความคิดเห็นในหัวข้อที่คุ้นเคย', descEn: 'Listening, speaking, reading and writing skills; communicating and giving opinions toward familiar topics.' },
  { code: '030543301', nameTh: 'การออกแบบดิจิทัลและลอจิก', nameEn: 'Digital and Logic Design', credits: '3(2-2-5)', pre: [], co: [], by: 'User', descTh: 'หลักการและทฤษฎีเบื้องต้นของระบบดิจิทัล ระบบเลขฐานสอง พีชคณิตบูลีนและการลดรูป', descEn: 'Fundamental principles and theory of digital system; binary system; Boolean algebra.' }
])

const searchQuery = ref('')
const filteredCourses = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return courses.value.filter(c => 
    c.code.toLowerCase().includes(q) || c.nameTh.toLowerCase().includes(q) || c.nameEn.toLowerCase().includes(q)
  )
})

const isModalOpen = ref(false)
const modalMode = ref<'add' | 'edit'>('add')

// 🛠 TO BACKEND: ตัวแปรฟอร์มรายวิชาที่ต้องส่งเข้า API
const activeCourse = ref({
  code: '', nameTh: '', nameEn: '',
  cTotal: '', cLec: '', cLab: '', cSelf: '',
  pre: [] as string[], co: [] as string[],
  descTh: '', descEn: ''
})

const openAddModal = () => {
  modalMode.value = 'add'
  activeCourse.value = { code: '', nameTh: '', nameEn: '', cTotal: '', cLec: '', cLab: '', cSelf: '', pre: [], co: [], descTh: '', descEn: '' }
  showAIPreview.value = false // ปิดหน้าต่างพรีวิว AI
  isModalOpen.value = true
}

const openEditModal = (c: any) => {
  modalMode.value = 'edit'
  const crMatch = c.credits.match(/(\d+)\((\d+)-(\d+)-(\d+)\)/)
  let cTotal = '', cLec = '', cLab = '', cSelf = ''
  if (crMatch) { cTotal = crMatch[1]; cLec = crMatch[2]; cLab = crMatch[3]; cSelf = crMatch[4]; }
  
  activeCourse.value = {
    code: c.code, nameTh: c.nameTh, nameEn: c.nameEn,
    cTotal, cLec, cLab, cSelf, pre: [...c.pre], co: [...c.co],
    descTh: c.descTh, descEn: c.descEn
  }
  showAIPreview.value = false // ปิดหน้าต่างพรีวิว AI
  isModalOpen.value = true
}

// === ระบบ Tag Input และ Click Outside ===
const searchPre = ref('')
const searchCo = ref('')
const preDropdown = ref(false)
const coDropdown = ref(false)

const preResults = computed(() => {
  const q = searchPre.value.toLowerCase()
  return courses.value.filter(c => c.code !== activeCourse.value.code && !activeCourse.value.pre.includes(c.code) && (c.code.includes(q) || c.nameTh.toLowerCase().includes(q)))
})

const coResults = computed(() => {
  const q = searchCo.value.toLowerCase()
  return courses.value.filter(c => c.code !== activeCourse.value.code && !activeCourse.value.co.includes(c.code) && (c.code.includes(q) || c.nameTh.toLowerCase().includes(q)))
})

const addPre = (code: string) => { activeCourse.value.pre.push(code); searchPre.value = ''; preDropdown.value = false; }
const removePre = (index: number) => { activeCourse.value.pre.splice(index, 1) }
const addCo = (code: string) => { activeCourse.value.co.push(code); searchCo.value = ''; coDropdown.value = false; }
const removeCo = (index: number) => { activeCourse.value.co.splice(index, 1) }

const closeDropdowns = (e: Event) => {
  const target = e.target as HTMLElement
  if (!target.closest('.pre-box')) preDropdown.value = false
  if (!target.closest('.co-box')) coDropdown.value = false
}

onMounted(() => { document.addEventListener('click', closeDropdowns) })
onUnmounted(() => { document.removeEventListener('click', closeDropdowns) })

// === 🌟 ระบบ AI Preview (ร่างคำอธิบายและตรวจสอบ/แก้ไขก่อนใช้) ===
const isGenerating = ref(false)
const showAIPreview = ref(false)
const aiDraftTh = ref('')
const aiDraftEn = ref('')

const generateAIDesc = async () => {
  if (!activeCourse.value.nameTh && !activeCourse.value.nameEn) {
    alert('กรุณากรอกชื่อวิชาภาษาไทยหรืออังกฤษก่อน เพื่อให้ AI นำไปร่างคำอธิบายได้')
    return
  }
  
  isGenerating.value = true
  showAIPreview.value = false
  
  // 🛠️ TO BACKEND: จุดยิง API ไปหา AI
  setTimeout(() => {
    aiDraftTh.value = `หลักการและทฤษฎีเบื้องต้นของ ${activeCourse.value.nameTh} องค์ประกอบและการทำงาน การวิเคราะห์และการประยุกต์ใช้งานเชิงวิศวกรรม`
    aiDraftEn.value = `Fundamental principles and theory of ${activeCourse.value.nameEn || 'the subject'}; analytical methods and engineering applications.`
    
    isGenerating.value = false
    showAIPreview.value = true // เปิดกล่องพรีวิวเมื่อเจนเสร็จ
  }, 1200)
}

const applyAIDraft = () => {
  activeCourse.value.descTh = aiDraftTh.value
  activeCourse.value.descEn = aiDraftEn.value
  showAIPreview.value = false // ปิดกล่องหลังใช้
}

const cancelAIDraft = () => {
  showAIPreview.value = false // ปิดกล่องโดยไม่เปลี่ยนแปลงอะไร
}

// === 🛠️ TO BACKEND: ฟังก์ชันสำหรับบันทึกข้อมูลเข้า Database ===
const saveCourse = async () => {
  if (!activeCourse.value.code.trim() || !activeCourse.value.nameTh.trim()) {
    alert('กรุณากรอกรหัสวิชาและชื่อวิชา')
    return
  }

  const t = parseInt(activeCourse.value.cTotal) || 0
  const l = parseInt(activeCourse.value.cLec) || 0
  const p = parseInt(activeCourse.value.cLab) || 0
  const s = parseInt(activeCourse.value.cSelf) || 0

  if (t < 0 || l < 0 || p < 0 || s < 0) {
    alert('หน่วยกิตต้องไม่ติดลบ!')
    return
  }

  if (l + p !== t) {
    alert(`หน่วยกิตไม่สอดคล้องกัน!\nผลรวมของ ทฤษฎี (${l}) + ปฏิบัติ (${p}) ต้องเท่ากับหน่วยกิตรวม (${t})`)
    return
  }

  const payload = {
    course_id: activeCourse.value.code.trim(),
    name_th: activeCourse.value.nameTh.trim(),
    name_en: activeCourse.value.nameEn.trim(),
    credit_total: t,
    credit_lecture: l,
    credit_lab: p,
    credit_self: s,
    prerequisites: activeCourse.value.pre,
    corequisites: activeCourse.value.co,
    description_th: activeCourse.value.descTh.trim(),
    description_en: activeCourse.value.descEn.trim()
  }

  try {
    const creditString = `${payload.credit_total}(${payload.credit_lecture}-${payload.credit_lab}-${payload.credit_self})`
    
    if (modalMode.value === 'add') {
      if (courses.value.some(c => c.code === payload.course_id)) { alert('รหัสวิชานี้มีอยู่ในคลังแล้ว'); return }
      courses.value.unshift({ code: payload.course_id, nameTh: payload.name_th, nameEn: payload.name_en, credits: creditString, pre: payload.prerequisites, co: payload.corequisites, by: 'User', descTh: payload.description_th, descEn: payload.description_en })
    } else {
      const idx = courses.value.findIndex(c => c.code === payload.course_id)
      if (idx !== -1) courses.value[idx] = { ...courses.value[idx], nameTh: payload.name_th, nameEn: payload.name_en, credits: creditString, pre: payload.prerequisites, co: payload.corequisites, descTh: payload.description_th, descEn: payload.description_en }
    }
    
    isModalOpen.value = false
  } catch (err) {
    alert('ไม่สามารถบันทึกข้อมูลได้')
  }
}
</script>

<template>
  <div>
    <!-- หัวหน้ากระดาษ + ค้นหา -->
    <div class="page-header">
      <div>
        <h1 class="text-[var(--ink)]">คลังวิชา</h1>
        <div class="mute">รายวิชาที่ทุกคนสร้างไว้ ใช้ร่วมกันได้ในทุกหลักสูตร ({{ courses.length }} วิชา) · คลิกที่แถวเพื่อแก้ไข</div>
      </div>
      <div class="header-actions">
        <div class="search-wrap">
          <UIcon name="i-heroicons-magnifying-glass" class="search-ico" />
          <input v-model="searchQuery" class="in search-in" placeholder="ค้นหารหัส หรือชื่อวิชา...">
        </div>
        <button class="btn p" @click="openAddModal">＋ เพิ่มรายวิชา</button>
      </div>
    </div>

    <!-- ตารางรายวิชา -->
    <div class="wrap custom-scrollbar">
      <table class="tbl">
        <thead>
          <tr>
            <th style="width: 130px;">รหัสวิชา</th>
            <th style="min-width: 260px;">ชื่อวิชา</th>
            <th style="width: 120px;">หน่วยกิต</th>
            <th style="width: 160px;">วิชาบังคับก่อน</th>
            <th style="width: 160px;">เรียนร่วมกัน</th>
            <th style="width: 90px;">ผู้สร้าง</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredCourses.length === 0"><td colspan="6" class="empty-cell">ไม่พบข้อมูลรายวิชา</td></tr>
          <tr v-for="c in filteredCourses" :key="c.code" @click="openEditModal(c)" class="data-row">
            <td class="code-col">{{ c.code }}</td>
            <td>
              <div class="font-medium text-[var(--ink)]">{{ c.nameTh }}</div>
              <div class="mute text-xs">{{ c.nameEn }}</div>
            </td>
            <td><span class="badge">{{ c.credits }}</span></td>
            <td class="text-sm mute">{{ c.pre.join(', ') || '–' }}</td>
            <td class="text-sm mute">{{ c.co.join(', ') || '–' }}</td>
            <td class="text-sm mute">{{ c.by }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 🟢 Modal: เพิ่ม / แก้ไขรายวิชา -->
    <div v-if="isModalOpen" class="ov">
      <div class="modal custom-scrollbar">
        <!-- ปุ่มกากบาทปิดหน้าต่างมุมขวาบน -->
        <button class="close-x" @click="isModalOpen = false">✕</button>

        <h3 class="modal-title">{{ modalMode === 'add' ? 'เพิ่มรายวิชาเข้าคลังวิชา' : 'แก้ไขรายวิชา' }}</h3>

        <div class="form-row">
          <label class="form-label">รหัสวิชา</label>
          <input 
            v-model="activeCourse.code" 
            @input="activeCourse.code = activeCourse.code.replace(/[^0-9]/g, '')"
            inputmode="numeric"
            class="in" 
            placeholder="เช่น 080103001" 
            :disabled="modalMode === 'edit'"
          >
        </div>

        <div class="form-row">
          <label class="form-label">ชื่อวิชา (ภาษาไทย)</label>
          <input v-model="activeCourse.nameTh" class="in" placeholder="เช่น ภาษาอังกฤษ 1">
        </div>

        <div class="form-row">
          <label class="form-label">ชื่อวิชา (ภาษาอังกฤษ)</label>
          <input v-model="activeCourse.nameEn" class="in" placeholder="เช่น English I">
        </div>

        <div class="form-row">
          <label class="form-label">หน่วยกิต (รวม - ทฤษฎี - ปฏิบัติ - ศึกษาด้วยตนเอง)</label>
          <div class="credit-grid">
            <div class="credit-col"><span class="sub-label">รวม</span><input type="number" min="0" v-model="activeCourse.cTotal" class="in text-center" placeholder="3"></div>
            <div class="credit-col"><span class="sub-label">ทฤษฎี</span><input type="number" min="0" v-model="activeCourse.cLec" class="in text-center" placeholder="3"></div>
            <div class="credit-col"><span class="sub-label">ปฏิบัติ</span><input type="number" min="0" v-model="activeCourse.cLab" class="in text-center" placeholder="0"></div>
            <div class="credit-col"><span class="sub-label">ศึกษาเอง</span><input type="number" min="0" v-model="activeCourse.cSelf" class="in text-center" placeholder="6"></div>
          </div>
        </div>

        <!-- Tag Input: วิชาบังคับก่อน -->
        <div class="form-row relative pre-box">
          <label class="form-label">วิชาบังคับก่อน (เลือกได้หลายวิชา)</label>
          <div class="tag-input-box" @click="preDropdown = true; $refs.preInput.focus()">
            <span v-for="(code, idx) in activeCourse.pre" :key="code" class="tag-item">
              {{ code }} <button type="button" @click.stop="removePre(idx)">✕</button>
            </span>
            <input ref="preInput" v-model="searchPre" class="tag-input" placeholder="พิมพ์หรือเลือกวิชา...">
          </div>
          <div v-if="preDropdown && preResults.length" class="dropdown-list">
            <button v-for="res in preResults" :key="res.code" type="button" @click="addPre(res.code)">
              {{ res.code }} {{ res.nameTh }} <span class="mute">{{ res.credits }}</span>
            </button>
          </div>
        </div>

        <!-- Tag Input: เรียนร่วมกัน -->
        <div class="form-row relative co-box">
          <label class="form-label">เรียนร่วมกัน (เลือกได้หลายวิชา)</label>
          <div class="tag-input-box" @click="coDropdown = true; $refs.coInput.focus()">
            <span v-for="(code, idx) in activeCourse.co" :key="code" class="tag-item">
              {{ code }} <button type="button" @click.stop="removeCo(idx)">✕</button>
            </span>
            <input ref="coInput" v-model="searchCo" class="tag-input" placeholder="พิมพ์หรือเลือกวิชา...">
          </div>
          <div v-if="coDropdown && coResults.length" class="dropdown-list">
            <button v-for="res in coResults" :key="res.code" type="button" @click="addCo(res.code)">
              {{ res.code }} {{ res.nameTh }} <span class="mute">{{ res.credits }}</span>
            </button>
          </div>
        </div>

        <div class="ai-header">
          <label class="form-label" style="margin: 0;">คำอธิบายรายวิชา (Course Description)</label>
          <button type="button" class="ai" @click="generateAIDesc" :disabled="isGenerating">
            <UIcon v-if="isGenerating" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
            <UIcon v-else name="i-heroicons-sparkles" class="w-4 h-4" />
            <span>{{ isGenerating ? 'กำลังร่างเนื้อหา...' : 'ให้ AI ร่างคำอธิบาย' }}</span>
          </button>
        </div>

        <!-- 🌟 กล่อง Preview แสดงผลร่างจาก AI (แก้ไขข้อความได้ก่อนกดใช้) -->
        <div v-if="showAIPreview" class="ai-preview-box">
          <div class="text-[14px] font-semibold text-[var(--acc)] mb-3 flex items-center gap-1.5">
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4" /> ตัวอย่างร่างจาก AI (สามารถพิมพ์แก้ไขได้ก่อนกดใช้งาน)
          </div>
          
          <span class="sub-label text-[var(--acc)] font-medium">คำอธิบายภาษาไทย (แก้ไขได้):</span>
          <textarea v-model="aiDraftTh" class="in desc-box mb-3" style="background: #fff; min-height: 80px; border-color: var(--line) !important;"></textarea>
          
          <span class="sub-label text-[var(--acc)] font-medium">คำอธิบายภาษาอังกฤษ (แก้ไขได้):</span>
          <textarea v-model="aiDraftEn" class="in desc-box mb-2" style="background: #fff; min-height: 80px; border-color: var(--line) !important;"></textarea>
          
          <div class="flex gap-2 justify-end mt-2 pt-3 border-t border-[var(--acc)] border-opacity-20">
            <button class="btn" style="padding: 5px 12px; font-size: 13px;" @click="cancelAIDraft">ยกเลิก</button>
            <button class="btn p" style="padding: 5px 12px; font-size: 13px;" @click="applyAIDraft">
              <UIcon name="i-heroicons-check" class="w-4 h-4 mr-1 inline-block" /> ใช้คำอธิบายนี้
            </button>
          </div>
        </div>

        <div class="form-row mt-2">
          <span class="sub-label">คำอธิบายรายวิชา (ภาษาไทย)</span>
          <textarea v-model="activeCourse.descTh" class="in desc-box" placeholder="ระบุคำอธิบายรายวิชาภาษาไทย..."></textarea>
        </div>
        <div class="form-row">
          <span class="sub-label">Course Description (English)</span>
          <textarea v-model="activeCourse.descEn" class="in desc-box" placeholder="Enter course description in English..."></textarea>
        </div>

        <!-- ปุ่มบันทึก -->
        <div class="modal-acts">
          <button class="btn p w-full" style="padding: 12px; font-size: 15px;" @click="saveCourse">บันทึกข้อมูลรายวิชา</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 14px; margin-bottom: 20px; }
.header-actions { display: flex; align-items: center; gap: 10px; }
.search-wrap { position: relative; width: 260px; }
.search-ico { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--mute); }
.search-in { padding-left: 32px; background: #fff !important; }

.badge { display: inline-block; padding: 2px 8px; background: var(--chip); border-radius: 6px; font-size: 12.5px; font-weight: 500; color: var(--ink); border: 1px solid var(--line); }
.code-col { font-weight: 600; color: var(--acc); font-size: 15px; }
.empty-cell { text-align: center; padding: 36px !important; color: var(--mute); font-size: 14px; }
.data-row { cursor: pointer; transition: 0.15s; }
.data-row:hover td { background-color: var(--soft); opacity: 0.8; }

/* Modal Styles */
.ov { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; padding: 16px; z-index: 50; }
.modal { background: var(--panel); border: 1px solid var(--line); border-radius: 14px; width: min(720px, 100%); max-height: 90vh; overflow-y: auto; padding: 32px 36px; box-shadow: 0 12px 32px rgba(0,0,0,0.15); position: relative; }

.close-x { position: absolute; top: 18px; right: 24px; font-size: 20px; color: var(--mute); background: none; border: none; font-weight: bold; cursor: pointer; transition: 0.15s; }
.close-x:hover { color: var(--danger); transform: scale(1.1); }

.modal-title { font-size: 20px; font-weight: 700; color: var(--ink); margin: 0 0 24px; border-bottom: 1px solid var(--line); padding-bottom: 12px; }

.form-row { margin-bottom: 16px; }
.form-label { display: block; font-size: 13.5px; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
.sub-label { display: block; font-size: 12px; color: var(--mute); margin-bottom: 4px; font-weight: 500; }

.credit-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.credit-col { display: flex; flex-direction: column; }
.text-center { text-align: center; }

/* Tag Input Styles */
.relative { position: relative; }
.tag-input-box { display: flex; flex-wrap: wrap; gap: 6px; border: 1px solid var(--line); border-radius: 8px; padding: 6px; background: #fff; min-height: 42px; cursor: text; transition: 0.2s; }
.tag-input-box:focus-within { border-color: var(--acc); box-shadow: 0 0 0 3px rgba(156,120,83,0.15); }
.tag-item { background: var(--soft); color: var(--acc); border: 1px solid var(--line); border-radius: 6px; padding: 2px 8px; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 4px; }
.tag-item button { background: none; border: none; padding: 0 2px; color: var(--mute); transition: 0.15s; }
.tag-item button:hover { color: var(--danger); transform: scale(1.2); }
.tag-input { flex: 1; min-width: 150px; border: none; background: none; padding: 2px 6px; outline: none; font-size: 14px; color: var(--ink); }
.dropdown-list { position: absolute; top: 100%; left: 0; right: 0; background: var(--panel); border: 1px solid var(--line); border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); z-index: 10; margin-top: 4px; max-height: 200px; overflow-y: auto; padding: 4px 0; }
.dropdown-list button { display: block; width: 100%; text-align: left; padding: 8px 12px; border: none; background: none; font-size: 14px; color: var(--ink); transition: 0.15s; }
.dropdown-list button:hover { background: var(--soft); color: var(--acc); }

.ai-header { display: flex; justify-content: space-between; align-items: center; margin: 24px 0 8px; flex-wrap: wrap; gap: 8px; border-top: 1px solid var(--line); padding-top: 20px; }

/* 🌟 สไตล์สำหรับกล่อง Preview ของ AI */
.ai-preview-box { background: #fdfaf5; border: 1.5px dashed var(--acc); border-radius: 8px; padding: 16px; margin-bottom: 16px; animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

.desc-box { min-height: 100px; resize: vertical; line-height: 1.55; font-size: 13.5px; margin-bottom: 8px; }

.modal-acts { display: flex; justify-content: flex-end; gap: 8px; margin-top: 24px; padding-top: 16px; }

@media (max-width: 640px) {
  .search-wrap { width: 100%; }
}
</style>