<!-- pages/courses.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const API_BASE = useApiBase()

// 1. Live courses from MariaDB database
const courses = ref<any[]>([])
const isLoading = ref(false)

// 2. ดึงข้อมูลรายวิชาทั้งหมดจากฐานข้อมูลจริง
const fetchCourses = async () => {
  isLoading.value = true
  try {
    const data = await $fetch<any[]>(`${API_BASE}/courses/`)
    courses.value = (data || []).map(c => ({
      code: c.id,
      nameTh: c.name_th || '',
      nameEn: c.name_en || '',
      credits: c.credits || `${c.credit_total || 0}(${c.credit_lecture || 0}-${c.credit_lab || 0}-${c.credit_selfstudy || 0})`,
      pre: c.prerequisites || [],
      co: c.corequisites || [],
      by: c.created_by ? `User ${c.created_by}` : 'User',
      descTh: c.description_th || '',
      descEn: c.description_en || ''
    }))
  } catch (err: any) {
    console.error('Failed to load courses from DB:', err)
  } finally {
    isLoading.value = false
  }
}

const searchQuery = ref('')
const filteredCourses = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return courses.value.filter(c => 
    c.code.toLowerCase().includes(q) || c.nameTh.toLowerCase().includes(q) || c.nameEn.toLowerCase().includes(q)
  )
})

const isModalOpen = ref(false)
const modalMode = ref<'add' | 'edit'>('add')

const activeCourse = ref({
  code: '', nameTh: '', nameEn: '',
  cTotal: '', cLec: '', cLab: '', cSelf: '',
  pre: [] as string[], co: [] as string[],
  descTh: '', descEn: ''
})

const openAddModal = () => {
  modalMode.value = 'add'
  activeCourse.value = { code: '', nameTh: '', nameEn: '', cTotal: '', cLec: '', cLab: '', cSelf: '', pre: [], co: [], descTh: '', descEn: '' }
  aiModalOpen.value = false
  aiVersions.value = []
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
  aiModalOpen.value = false
  aiVersions.value = []
  isModalOpen.value = true
}

// === Tag Input: Pre / Co Dropdown ===
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

onMounted(() => {
  fetchCourses()
  document.addEventListener('click', closeDropdowns)
})
onUnmounted(() => { document.removeEventListener('click', closeDropdowns) })

// === 🌟 ยิง API ไปหา AI จริง (Ollama Gemma 3) ===
const isGenerating = ref(false)
const aiModalOpen = ref(false)
const aiVersions = ref<any[]>([])
const aiDraftTh = ref('')
const aiDraftEn = ref('')
let aiSession = 0
let aiController: AbortController | null = null

const openAiDescModal = () => {
  if (!activeCourse.value.nameTh && !activeCourse.value.nameEn) {
    alert('กรุณากรอกชื่อวิชาภาษาไทยหรืออังกฤษก่อน เพื่อให้ AI นำไปร่างคำอธิบายได้')
    return
  }
  aiSession += 1
  aiDraftTh.value = activeCourse.value.descTh
  aiDraftEn.value = activeCourse.value.descEn
  aiController?.abort()
  aiController = new AbortController()
  isGenerating.value = false
  aiVersions.value = []
  aiModalOpen.value = true
  void generateAIDesc()
}

const closeAiDescModal = () => {
  aiSession += 1
  aiController?.abort()
  aiController = null
  activeCourse.value.descTh = aiDraftTh.value
  activeCourse.value.descEn = aiDraftEn.value
  aiModalOpen.value = false
  aiVersions.value = []
  isGenerating.value = false
}

const handleAiModalOpen = (open: boolean) => {
  if (open) aiModalOpen.value = true
  else closeAiDescModal()
}

const describeAiError = (err: any) => {
  const status = err?.statusCode ?? err?.status ?? err?.response?.status
  if (status === 502 || status === 504) {
    return 'AI ใช้เวลานานเกินกำหนด (โมเดลอาจกำลังโหลดหรือเครื่องทำงานหนัก) กรุณารอสักครู่แล้วกด “ให้ AI ร่าง” อีกครั้ง'
  }
  if (status === 503) return 'บริการ AI ยังไม่พร้อมใช้งาน กรุณาลองใหม่ภายหลัง'
  return err?.data?.detail || err?.message || 'ไม่ทราบสาเหตุ'
}

const generateAIDesc = async () => {
  if (!activeCourse.value.nameTh && !activeCourse.value.nameEn) {
    alert('กรุณากรอกชื่อวิชาภาษาไทยหรืออังกฤษก่อน เพื่อให้ AI นำไปร่างคำอธิบายได้')
    return
  }
  // กันการกดซ้ำระหว่างรอ: การ abort ฝั่ง browser ไม่ได้หยุดงานที่ Ollama
  // ถ้าส่งคำขอใหม่ งานจะไปต่อคิวและทำให้รอนานขึ้น
  if (isGenerating.value) return
  if (!aiController) aiController = new AbortController()
  const controller = aiController
  const session = aiSession
  isGenerating.value = true

  try {
    const res = await $fetch<any>(`${API_BASE}/ai/generate/course-description`, {
      method: 'POST',
      signal: controller.signal,
      body: {
        target: 'course_description',
        language: 'both',
        context: {
          course_name: activeCourse.value.nameTh || activeCourse.value.nameEn,
          course_code: activeCourse.value.code,
          credits: `${activeCourse.value.cTotal || 0}(${activeCourse.value.cLec || 0}-${activeCourse.value.cLab || 0}-${activeCourse.value.cSelf || 0})`,
          current_desc_th: aiDraftTh.value,
          current_desc_en: aiDraftEn.value,
          instruction: aiDraftTh.value || aiDraftEn.value
            ? 'กรุณานำ keywords หรือเนื้อหาเบื้องต้นที่ให้ไว้ มาขยายความและร่างเป็นคำอธิบายรายวิชาที่สมบูรณ์และเป็นทางการ'
            : 'กรุณาร่างคำอธิบายรายวิชาโดยอิงจากชื่อวิชาและหน่วยกิตที่ให้ไว้'
        }
      }
    })

    if (controller.signal.aborted || session !== aiSession) return
    if (res && res.result) {
      aiVersions.value.unshift({
        id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        th: res.result.th || '',
        en: res.result.en || '',
        createdAt: Date.now()
      })
    }
  } catch (err: any) {
    if (!controller.signal.aborted) {
      console.error('AI Error:', err)
      alert('AI ร่างคำอธิบายไม่สำเร็จ: ' + describeAiError(err))
    }
  } finally {
    if (session === aiSession && !controller.signal.aborted) isGenerating.value = false
  }
}

const applyAIDraft = (version: any) => {
  activeCourse.value.descTh = version.th || ''
  activeCourse.value.descEn = version.en || ''
  aiDraftTh.value = version.th || ''
  aiDraftEn.value = version.en || ''
}

// === 🛠️ บันทึกข้อมูลเข้า MariaDB Database (POST / PUT) ===
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

  const payload = {
    id: activeCourse.value.code.trim(),
    name_th: activeCourse.value.nameTh.trim(),
    name_en: activeCourse.value.nameEn.trim(),
    credits: `${t}(${l}-${p}-${s})`,
    credit_total: t,
    credit_lecture: l,
    credit_lab: p,
    credit_selfstudy: s,
    prerequisites: activeCourse.value.pre,
    corequisites: activeCourse.value.co,
    description_th: activeCourse.value.descTh.trim(),
    description_en: activeCourse.value.descEn.trim()
  }

  try {
    if (modalMode.value === 'add') {
      await $fetch(`${API_BASE}/courses/`, {
        method: 'POST',
        body: payload
      })
      alert('บันทึกรายวิชาลงฐานข้อมูลสำเร็จ!')
    } else {
      await $fetch(`${API_BASE}/courses/${payload.id}`, {
        method: 'PUT',
        body: payload
      })
      alert('อัปเดตข้อมูลรายวิชาสำเร็จ!')
    }
    
    // รีเฟรชรายการรายวิชาจากฐานข้อมูลทันที
    await fetchCourses()
    isModalOpen.value = false
  } catch (err: any) {
    console.error('Save error:', err)
    alert('ไม่สามารถบันทึกข้อมูลได้: ' + (err?.data?.detail || err.message))
  }
}

// === 🗑️ ลบรายวิชาออกจาก MariaDB Database (DELETE) ===
const deleteCourse = async () => {
  if (!confirm(`คุณต้องการลบรายวิชา ${activeCourse.value.code} ออกจากฐานข้อมูลหรือไม่?`)) return

  try {
    await $fetch(`${API_BASE}/courses/${activeCourse.value.code}`, {
      method: 'DELETE'
    })
    alert('ลบรายวิชาสำเร็จ!')
    await fetchCourses()
    isModalOpen.value = false
  } catch (err: any) {
    console.error('Delete error:', err)
    alert('ไม่สามารถลบข้อมูลได้: ' + (err?.data?.detail || err.message))
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
          <tr v-if="filteredCourses.length === 0"><td colspan="6" class="empty-cell">{{ isLoading ? 'กำลังโหลดข้อมูลจากฐานข้อมูล...' : 'ไม่พบข้อมูลรายวิชา' }}</td></tr>
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

    <!-- Modal: เพิ่ม / แก้ไขรายวิชา -->
    <div v-if="isModalOpen" class="ov">
      <div class="modal custom-scrollbar">
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
          <button type="button" class="ai" title="AI รันบนเครื่องนี้ อาจใช้เวลา 1–5 นาที (ครั้งแรกอาจนานกว่า)" @click="openAiDescModal">
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4" />
            <span>ให้ AI ร่างคำอธิบาย</span>
          </button>
        </div>

        <div class="form-row mt-2">
          <span class="sub-label">คำอธิบายรายวิชา (ภาษาไทย)</span>
          <textarea v-model="activeCourse.descTh" class="in desc-box" placeholder="ระบุคำอธิบายรายวิชาภาษาไทย..."></textarea>
        </div>
        <div class="form-row">
          <span class="sub-label">Course Description (English)</span>
          <textarea v-model="activeCourse.descEn" class="in desc-box" placeholder="Enter course description in English..."></textarea>
        </div>

        <!-- ปุ่มบันทึก และ ลบ -->
        <div class="modal-acts">
          <button v-if="modalMode === 'edit'" class="btn" style="color: #ef4444; border-color: #fca5a5;" @click="deleteCourse">ลบรายวิชานี้</button>
          <button class="btn p flex-1" style="padding: 12px; font-size: 15px;" @click="saveCourse">บันทึกข้อมูลรายวิชา</button>
        </div>
      </div>
    </div>

    <AiAssistModal
      :open="aiModalOpen"
      title="AI ช่วยร่างคำอธิบายรายวิชา"
      left-title="คำอธิบายปัจจุบัน"
      right-title="ฉบับร่างจาก AI"
      :loading="isGenerating"
      :versions="aiVersions"
      @update:open="handleAiModalOpen"
      @generate="generateAIDesc"
      @apply="applyAIDraft"
    >
      <template #left>
        <label class="ai-course-label">คำอธิบายภาษาไทย</label>
        <textarea v-model="aiDraftTh" class="ai-course-textarea" rows="8" placeholder="ระบุคำอธิบายรายวิชาภาษาไทย..." />
        <label class="ai-course-label mt-3">Course Description (English)</label>
        <textarea v-model="aiDraftEn" class="ai-course-textarea" rows="8" placeholder="Enter course description in English..." />
        <p class="ai-course-hint">ข้อความด้านซ้ายจะถูกส่งให้ AI ใช้เป็น keywords และจะถูกบันทึกกลับเมื่อปิดหน้าต่าง</p>
      </template>
      <template #version="{ version }">
        <div class="ai-course-version">
          <b>ภาษาไทย</b>
          <div>{{ version.th || '—' }}</div>
          <b class="mt-3">English</b>
          <div>{{ version.en || '—' }}</div>
        </div>
      </template>
    </AiAssistModal>

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

.ai-course-label { display: block; margin-bottom: 6px; color: #4f463c; font-size: 13.5px; font-weight: 600; }
.ai-course-textarea { width: 100%; min-height: 170px; border: 1px solid var(--line); border-radius: 8px; background: #fff; padding: 11px 12px; color: var(--ink); font-size: 14px; line-height: 1.65; resize: vertical; }
.ai-course-textarea:focus { outline: none; border-color: var(--acc); box-shadow: 0 0 0 2px rgba(156, 120, 83, 0.12); }
.ai-course-hint { margin: 9px 0 0; color: #5f554a; font-size: 12.5px; line-height: 1.55; }
.ai-course-version { display: flex; flex-direction: column; gap: 3px; }
.ai-course-version b { color: #4f463c; font-size: 12.5px; }

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

.modal-acts { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 16px; }

@media (max-width: 640px) {
  .search-wrap { width: 100%; }
}
</style>