<!-- pages/number2.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const route = useRoute()
const router = useRouter()

const config = useRuntimeConfig()
const API_BASE = config.public.apiBase as string

// ================= State ข้อมูลฟอร์มหน้า 2 =================
const form = ref({ 
  id: null as string | number | null,
  philosophy: '', 
  importance: '', 
  // 2.3 วัตถุประสงค์ของหลักสูตร
  objectives: [{ code: '', desc: '' }], 
  // 2.4 จุดเด่นเฉพาะของหลักสูตร
  uniquenessList: [''],
  // 2.5 - 2.8 ความคาดหวังของผลลัพธ์การเรียนรู้เมื่อสิ้นปีการศึกษา (YLO) แยกตามแขนง
  yloTelecom: [{ year: '', desc: '' }],
  yloComputer: [{ year: '', desc: '' }],
  yloInstrument: [{ year: '', desc: '' }],
  yloBroadcast: [{ year: '', desc: '' }],
  // 2.9 แผนพัฒนาปรับปรุง
  devPlans: [{ plan: '', strategy: '', indicator: '' }]
})

// ================= Load existing program =================
const isLoading = ref(false)
const loadError = ref('')

function safeParse(json: string | null | undefined, fallback: any) {
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
  try {
    const data: any = await $fetch(`${API_BASE}/programs/${id}`)

    form.value.id = data.id
    form.value.philosophy = data.philosophy ?? ''
    form.value.importance = data.importance ?? ''

    // objectives / uniqueness are stored as JSON strings inside
    // the program's own `objectives` / `uniqueness` text columns
    form.value.objectives = safeParse(data.objectives, [{ code: '', desc: '' }])
    form.value.uniquenessList = safeParse(data.uniqueness, [''])

    // YLO by branch is stored as one JSON blob in program_elo_framework.framework
    try {
      const elo: any = await $fetch(`${API_BASE}/programs/${id}/elo-framework`)
      const parsed = elo?.framework ? JSON.parse(elo.framework) : {}
      form.value.yloTelecom = parsed.telecom?.length ? parsed.telecom : [{ year: '', desc: '' }]
      form.value.yloComputer = parsed.computer?.length ? parsed.computer : [{ year: '', desc: '' }]
      form.value.yloInstrument = parsed.instrument?.length ? parsed.instrument : [{ year: '', desc: '' }]
      form.value.yloBroadcast = parsed.broadcast?.length ? parsed.broadcast : [{ year: '', desc: '' }]
    } catch (err) {
      console.error('Failed to load ELO framework', err)
    }

    form.value.devPlans = data.development_plans?.length
      ? [...data.development_plans].sort((a: any, b: any) => a.sort_order - b.sort_order).map((p: any) => ({
          plan: p.plan ?? '', strategy: p.strategy ?? '', indicator: p.indicator ?? ''
        }))
      : [{ plan: '', strategy: '', indicator: '' }]
  } catch (err: any) {
    console.error('Failed to load program', err)

    const status = err?.response?.status ?? err?.statusCode
    if (status === 404) {
      // This program no longer exists — page 2 has nothing to attach to,
      // so send the user back to page 1 to start over instead of letting
      // them fill out a form that can never save.
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
  if (route.query.id) {
    form.value.id = route.query.id as string
    loadProgram(form.value.id)
  }
})

// ================= AI Integration =================
const handleAIGenerate = (section: string, payload?: any) => {
  // TODO: สำหรับ Backend นำไปต่อ API สร้างเนื้อหาด้วย AI
  console.log('Trigger AI Generation for:', section, payload)
  alert(`กำลังเรียกใช้ AI สำหรับหมวด: ${section}\n(รอ Backend เชื่อมต่อ API)`)
}

// ================= List & Table Actions =================
const addObjective = () => form.value.objectives.push({ code: '', desc: '' })
const removeObjective = (i: number) => { form.value.objectives.splice(i, 1); if(form.value.objectives.length === 0) form.value.objectives.push({ code: '', desc: '' }) }

const addUniqueness = () => form.value.uniquenessList.push('')
const removeUniqueness = (i: number) => { form.value.uniquenessList.splice(i, 1); if(form.value.uniquenessList.length === 0) form.value.uniquenessList.push('') }

const addYlo = (branch: 'Telecom' | 'Computer' | 'Instrument' | 'Broadcast') => form.value[`ylo${branch}`].push({ year: '', desc: '' })
const removeYlo = (branch: 'Telecom' | 'Computer' | 'Instrument' | 'Broadcast', i: number) => { 
    form.value[`ylo${branch}`].splice(i, 1); 
    if(form.value[`ylo${branch}`].length === 0) form.value[`ylo${branch}`].push({ year: '', desc: '' }) 
}

const addDevPlan = () => form.value.devPlans.push({ plan: '', strategy: '', indicator: '' })
const removeDevPlan = (i: number) => { form.value.devPlans.splice(i, 1); if(form.value.devPlans.length === 0) form.value.devPlans.push({ plan: '', strategy: '', indicator: '' }) }

// ================= Save helpers =================
async function replaceChildren(programId: string | number, resource: string, items: any[]) {
  const existing: any[] = await $fetch(`${API_BASE}/programs/${programId}/${resource}/`)
  await Promise.all(
    existing.map(e => $fetch(`${API_BASE}/programs/${programId}/${resource}/${e.id}`, { method: 'DELETE' }))
  )
  for (const item of items) {
    await $fetch(`${API_BASE}/programs/${programId}/${resource}/`, { method: 'POST', body: item })
  }
}

async function saveAll() {
  const id = form.value.id
  if (!id) throw new Error('ต้องกรอกหน้า 1 และบันทึกก่อน จึงจะมี program id')

  // 2.1 / 2.2 / 2.3 / 2.4 — plain + JSON-encoded fields on the program row
  await $fetch(`${API_BASE}/programs/${id}`, {
    method: 'PUT',
    body: {
      philosophy: form.value.philosophy || null,
      importance: form.value.importance || null,
      objectives: JSON.stringify(form.value.objectives.filter(o => o.code.trim() || o.desc.trim())),
      uniqueness: JSON.stringify(form.value.uniquenessList.filter(u => u.trim()))
    }
  })

  // 2.5 - 2.8 — YLO by branch, one JSON blob
  await $fetch(`${API_BASE}/programs/${id}/elo-framework`, {
    method: 'PUT',
    body: {
      framework: JSON.stringify({
        telecom: form.value.yloTelecom.filter(y => y.year.trim() || y.desc.trim()),
        computer: form.value.yloComputer.filter(y => y.year.trim() || y.desc.trim()),
        instrument: form.value.yloInstrument.filter(y => y.year.trim() || y.desc.trim()),
        broadcast: form.value.yloBroadcast.filter(y => y.year.trim() || y.desc.trim())
      })
    }
  })

  // 2.9 — real child table, same replace-all pattern as page 1
  await replaceChildren(
    id, 'development-plans',
    form.value.devPlans
      .filter(p => p.plan.trim() || p.strategy.trim() || p.indicator.trim())
      .map((p, i) => ({ plan: p.plan || null, strategy: p.strategy || null, indicator: p.indicator || null, sort_order: i }))
  )
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
    router.push({ path: '/number3', query: { id: form.value.id } })
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
}

const doneState = ref({
  s2_1: false, s2_2: false, s2_3: false, s2_4: false, s2_5: false, s2_6: false, s2_7: false, s2_8: false, s2_9: false
})
const toggleDone = (key: keyof typeof doneState.value) => { doneState.value[key] = !doneState.value[key] }
</script>

<template>
  <div class="page-shell">
    <form @submit.prevent class="w-full">
      
      <!-- Breadcrumb & Title -->
      <div class="crumb">
        <span>เล่มหลักสูตร</span> › <b>หมวดที่ 2</b>
        <span class="page-badge">หน้า 3 / 9</span>
      </div>
      <div class="doc-head">
        <div class="doc-eyebrow">หมวดที่ 2</div>
        <h1 class="doc-title">ข้อมูลเฉพาะของหลักสูตร</h1>
      </div>

      <!-- TOC Card -->
      <div class="toc-card">
        <div class="toc-label">หัวข้อในหน้านี้ — คลิกเพื่อกระโดดไปยังหัวข้อ</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-[4px_18px]">
          <div class="toc-item" :class="{ 'filled': doneState.s2_1 }" @click="scrollToSec('sec-2-1')"><div class="toc-dot"></div><span class="toc-num">2.1</span><span class="lbl">ปรัชญาของหลักสูตร</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s2_2 }" @click="scrollToSec('sec-2-2')"><div class="toc-dot"></div><span class="toc-num">2.2</span><span class="lbl text-[#A8793B] font-medium"><UIcon name="i-heroicons-sparkles" class="w-3 h-3 mr-1"/>ความสำคัญของหลักสูตร</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s2_3 }" @click="scrollToSec('sec-2-3')"><div class="toc-dot"></div><span class="toc-num">2.3</span><span class="lbl text-[#A8793B] font-medium"><UIcon name="i-heroicons-sparkles" class="w-3 h-3 mr-1"/>วัตถุประสงค์ของหลักสูตร</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s2_4 }" @click="scrollToSec('sec-2-4')"><div class="toc-dot"></div><span class="toc-num">2.4</span><span class="lbl text-[#A8793B] font-medium"><UIcon name="i-heroicons-sparkles" class="w-3 h-3 mr-1"/>จุดเด่นเฉพาะของหลักสูตร</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s2_5 }" @click="scrollToSec('sec-2-5')"><div class="toc-dot"></div><span class="toc-num">2.5</span><span class="lbl text-[#A8793B] font-medium"><UIcon name="i-heroicons-sparkles" class="w-3 h-3 mr-1"/>ความคาดหวังผลลัพธ์ (YLO) - โทรคมนาคม</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s2_6 }" @click="scrollToSec('sec-2-6')"><div class="toc-dot"></div><span class="toc-num">2.6</span><span class="lbl text-[#A8793B] font-medium"><UIcon name="i-heroicons-sparkles" class="w-3 h-3 mr-1"/>ความคาดหวังผลลัพธ์ (YLO) - คอมพิวเตอร์</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s2_7 }" @click="scrollToSec('sec-2-7')"><div class="toc-dot"></div><span class="toc-num">2.7</span><span class="lbl text-[#A8793B] font-medium"><UIcon name="i-heroicons-sparkles" class="w-3 h-3 mr-1"/>ความคาดหวังผลลัพธ์ (YLO) - วัดและควบคุม</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s2_8 }" @click="scrollToSec('sec-2-8')"><div class="toc-dot"></div><span class="toc-num">2.8</span><span class="lbl text-[#A8793B] font-medium"><UIcon name="i-heroicons-sparkles" class="w-3 h-3 mr-1"/>ความคาดหวังผลลัพธ์ (YLO) - กระจายเสียงฯ</span></div>
          <div class="toc-item" :class="{ 'filled': doneState.s2_9 }" @click="scrollToSec('sec-2-9')"><div class="toc-dot"></div><span class="toc-num">2.9</span><span class="lbl text-[#A8793B] font-medium"><UIcon name="i-heroicons-sparkles" class="w-3 h-3 mr-1"/>แผนพัฒนาปรับปรุง</span></div>
        </div>
      </div>

      <!-- Main Paper Card -->
      <div class="paper-card">
        
        <!-- 2.1 ปรัชญา -->
        <section class="topic-sec" id="sec-2-1">
          <div class="sec-head">
            <div class="sec-number">2.1</div><h2 class="sec-title">ปรัชญาของหลักสูตร</h2>
            <button type="button" class="sec-check" :class="{ 'on': doneState.s2_1 }" @click="toggleDone('s2_1')">{{ doneState.s2_1 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
          </div>
          <div class="sec-body">
            <div class="fs-grid full">
              <div class="fs-field"><textarea v-model="form.philosophy" class="field" placeholder="ระบุปรัชญา..."></textarea></div>
            </div>
          </div>
        </section>

        <!-- 2.2 ความสำคัญ -->
        <section class="topic-sec border-l-4 border-l-[#A8793B] pl-[20px] -ml-[24px] bg-[#FDFBF4]" id="sec-2-2">
          <div class="sec-head">
            <div class="sec-number">2.2</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">ความสำคัญของหลักสูตร</h2>
                <span class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState.s2_2 }" @click="toggleDone('s2_2')">{{ doneState.s2_2 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body md:pl-[56px] mt-4 md:mt-0">
            <div class="fs-grid full">
              <div class="fs-field">
                  <textarea v-model="form.importance" class="field" placeholder="ระบุความสำคัญ..."></textarea>
                  <button type="button" @click="handleAIGenerate('importance')" class="ai-btn"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> AI ช่วยเขียนความสำคัญ</button>
              </div>
            </div>
          </div>
        </section>

        <!-- 2.3 วัตถุประสงค์ -->
        <section class="topic-sec border-l-4 border-l-[#A8793B] pl-[20px] -ml-[24px] bg-[#FDFBF4]" id="sec-2-3">
          <div class="sec-head">
            <div class="sec-number">2.3</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">วัตถุประสงค์ของหลักสูตร</h2>
                <span class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState.s2_3 }" @click="toggleDone('s2_3')">{{ doneState.s2_3 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body md:pl-[56px] mt-4 md:mt-0">
              <div class="slist-item" v-for="(obj, i) in form.objectives" :key="i">
                  <div class="slist-num">{{ i + 1 }}</div>
                  <div class="slist-fields fs-grid">
                      <div class="fs-field" style="grid-column: span 1;"><label>ข้อที่</label><input v-model="obj.code" type="text"></div>
                      <div class="fs-field full" style="grid-column: 1 / -1;"><label>รายละเอียด</label><textarea v-model="obj.desc" class="field" style="min-height:60px"></textarea></div>
                  </div>
                  <button type="button" class="slist-del" @click="removeObjective(i)">✕</button>
              </div>
              <button type="button" class="add-row" @click="addObjective()">+ เพิ่มรายการ</button>
              <button type="button" class="ai-btn ml-2" @click="handleAIGenerate('objectives')"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> AI ช่วยร่างวัตถุประสงค์</button>
          </div>
        </section>

        <!-- 2.4 จุดเด่น -->
        <section class="topic-sec border-l-4 border-l-[#A8793B] pl-[20px] -ml-[24px] bg-[#FDFBF4]" id="sec-2-4">
          <div class="sec-head">
            <div class="sec-number">2.4</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">จุดเด่นเฉพาะของหลักสูตร</h2>
                <span class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState.s2_4 }" @click="toggleDone('s2_4')">{{ doneState.s2_4 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body md:pl-[56px] mt-4 md:mt-0">
            <div class="list-editor">
              <div class="list-row" v-for="(item, i) in form.uniquenessList" :key="i">
                <div class="list-num">{{ i + 1 }}</div>
                <input v-model="form.uniquenessList[i]" type="text" placeholder="ระบุจุดเด่น..." />
                <button type="button" class="row-del" @click="removeUniqueness(i)">✕</button>
              </div>
              <button type="button" class="add-row" @click="addUniqueness()">+ เพิ่มรายการ</button>
              <button type="button" class="ai-btn ml-2" @click="handleAIGenerate('uniqueness')"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> AI ช่วยคิดจุดเด่น</button>
            </div>
          </div>
        </section>

        <!-- 2.5 YLO โทรคมนาคม -->
        <section class="topic-sec border-l-4 border-l-[#A8793B] pl-[20px] -ml-[24px] bg-[#FDFBF4]" id="sec-2-5">
          <div class="sec-head">
            <div class="sec-number">2.5</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">ความคาดหวังของผลลัพธ์การเรียนรู้ (YLO) — โทรคมนาคม</h2>
                <span class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState.s2_5 }" @click="toggleDone('s2_5')">{{ doneState.s2_5 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body md:pl-[56px] mt-4 md:mt-0">
              <table class="builder bg-white">
                  <thead><tr><th style="width:120px">ชั้นปี</th><th>ความคาดหวังของผลลัพธ์การเรียนรู้</th><th style="width:40px"></th></tr></thead>
                  <tbody>
                      <tr v-for="(ylo, i) in form.yloTelecom" :key="i">
                          <td><input v-model="ylo.year" type="text" placeholder="ชั้นปีที่..."></td>
                          <td><input v-model="ylo.desc" type="text" placeholder="ผลลัพธ์การเรียนรู้..."></td>
                          <td><button type="button" class="table-del" @click="removeYlo('Telecom', i)">✕</button></td>
                      </tr>
                  </tbody>
              </table>
              <button type="button" class="add-row" @click="addYlo('Telecom')">+ เพิ่มชั้นปี</button>
              <button type="button" class="ai-btn ml-2" @click="handleAIGenerate('ylo_telecom')"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> AI ช่วยสร้าง YLO</button>
          </div>
        </section>

        <!-- 2.6 YLO คอมพิวเตอร์ -->
        <section class="topic-sec border-l-4 border-l-[#A8793B] pl-[20px] -ml-[24px] bg-[#FDFBF4]" id="sec-2-6">
          <div class="sec-head">
            <div class="sec-number">2.6</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">ความคาดหวังของผลลัพธ์การเรียนรู้ (YLO) — คอมพิวเตอร์</h2>
                <span class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState.s2_6 }" @click="toggleDone('s2_6')">{{ doneState.s2_6 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body md:pl-[56px] mt-4 md:mt-0">
               <table class="builder bg-white">
                  <thead><tr><th style="width:120px">ชั้นปี</th><th>ความคาดหวังของผลลัพธ์การเรียนรู้</th><th style="width:40px"></th></tr></thead>
                  <tbody>
                      <tr v-for="(ylo, i) in form.yloComputer" :key="i">
                          <td><input v-model="ylo.year" type="text" placeholder="ชั้นปีที่..."></td>
                          <td><input v-model="ylo.desc" type="text" placeholder="ผลลัพธ์การเรียนรู้..."></td>
                          <td><button type="button" class="table-del" @click="removeYlo('Computer', i)">✕</button></td>
                      </tr>
                  </tbody>
              </table>
              <button type="button" class="add-row" @click="addYlo('Computer')">+ เพิ่มชั้นปี</button>
              <button type="button" class="ai-btn ml-2" @click="handleAIGenerate('ylo_computer')"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> AI ช่วยสร้าง YLO</button>
          </div>
        </section>
        
        <!-- 2.7 YLO เครื่องมือวัดและควบคุม -->
        <section class="topic-sec border-l-4 border-l-[#A8793B] pl-[20px] -ml-[24px] bg-[#FDFBF4]" id="sec-2-7">
          <div class="sec-head">
            <div class="sec-number">2.7</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">ความคาดหวังของผลลัพธ์การเรียนรู้ (YLO) — เครื่องมือวัดและควบคุม</h2>
                <span class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState.s2_7 }" @click="toggleDone('s2_7')">{{ doneState.s2_7 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body md:pl-[56px] mt-4 md:mt-0">
               <table class="builder bg-white">
                  <thead><tr><th style="width:120px">ชั้นปี</th><th>ความคาดหวังของผลลัพธ์การเรียนรู้</th><th style="width:40px"></th></tr></thead>
                  <tbody>
                      <tr v-for="(ylo, i) in form.yloInstrument" :key="i">
                          <td><input v-model="ylo.year" type="text" placeholder="ชั้นปีที่..."></td>
                          <td><input v-model="ylo.desc" type="text" placeholder="ผลลัพธ์การเรียนรู้..."></td>
                          <td><button type="button" class="table-del" @click="removeYlo('Instrument', i)">✕</button></td>
                      </tr>
                  </tbody>
              </table>
              <button type="button" class="add-row" @click="addYlo('Instrument')">+ เพิ่มชั้นปี</button>
              <button type="button" class="ai-btn ml-2" @click="handleAIGenerate('ylo_instrument')"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> AI ช่วยสร้าง YLO</button>
          </div>
        </section>

        <!-- 2.8 YLO กระจายเสียงฯ -->
        <section class="topic-sec border-l-4 border-l-[#A8793B] pl-[20px] -ml-[24px] bg-[#FDFBF4]" id="sec-2-8">
          <div class="sec-head">
            <div class="sec-number">2.8</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">ความคาดหวังของผลลัพธ์การเรียนรู้ (YLO) — กระจายเสียงวิทยุและโทรทัศน์</h2>
                <span class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState.s2_8 }" @click="toggleDone('s2_8')">{{ doneState.s2_8 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body md:pl-[56px] mt-4 md:mt-0">
               <table class="builder bg-white">
                  <thead><tr><th style="width:120px">ชั้นปี</th><th>ความคาดหวังของผลลัพธ์การเรียนรู้</th><th style="width:40px"></th></tr></thead>
                  <tbody>
                      <tr v-for="(ylo, i) in form.yloBroadcast" :key="i">
                          <td><input v-model="ylo.year" type="text" placeholder="ชั้นปีที่..."></td>
                          <td><input v-model="ylo.desc" type="text" placeholder="ผลลัพธ์การเรียนรู้..."></td>
                          <td><button type="button" class="table-del" @click="removeYlo('Broadcast', i)">✕</button></td>
                      </tr>
                  </tbody>
              </table>
              <button type="button" class="add-row" @click="addYlo('Broadcast')">+ เพิ่มชั้นปี</button>
              <button type="button" class="ai-btn ml-2" @click="handleAIGenerate('ylo_broadcast')"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> AI ช่วยสร้าง YLO</button>
          </div>
        </section>

        <!-- 2.9 แผนพัฒนาปรับปรุง -->
        <section class="topic-sec border-l-4 border-l-[#A8793B] pl-[20px] -ml-[24px] bg-[#FDFBF4]" id="sec-2-9">
          <div class="sec-head">
            <div class="sec-number">2.9</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">แผนพัฒนาปรับปรุง</h2>
                <span class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState.s2_9 }" @click="toggleDone('s2_9')">{{ doneState.s2_9 ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body md:pl-[56px] mt-4 md:mt-0">
               <table class="builder bg-white">
                  <thead><tr><th>แผนการพัฒนา/เปลี่ยนแปลง</th><th>กลยุทธ์</th><th>หลักฐาน/ตัวบ่งชี้</th><th style="width:40px"></th></tr></thead>
                  <tbody>
                      <tr v-for="(plan, i) in form.devPlans" :key="i">
                          <td><input v-model="plan.plan" type="text"></td>
                          <td><input v-model="plan.strategy" type="text"></td>
                          <td><input v-model="plan.indicator" type="text"></td>
                          <td><button type="button" class="table-del" @click="removeDevPlan(i)">✕</button></td>
                      </tr>
                  </tbody>
              </table>
              <button type="button" class="add-row" @click="addDevPlan()">+ เพิ่มแถว</button>
              <button type="button" class="ai-btn ml-2" @click="handleAIGenerate('dev_plan')"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> AI ช่วยร่างแผนพัฒนา</button>
          </div>
        </section>

      </div>

      <!-- Action Footer -->
      <div class="page-footer">
        <button type="button" @click="router.push(`/number1?id=${form.id || ''}`)" class="nav-btn">
          ← <span>ข้อมูลทั่วไป</span>
        </button>
        <div class="flex flex-col md:flex-row gap-3">
          <button type="button" @click="saveDraft()" :disabled="isSavingDraft" class="nav-btn">
            <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-1" /> {{ isSavingDraft ? 'กำลังบันทึก...' : 'บันทึกฉบับร่าง' }}
          </button>
          <button type="button" @click="saveAndNext()" :disabled="isSavingNext" class="btn-brass force-white-btn" style="border:none;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;cursor:pointer;">
            <span style="color:#ffffff !important;">{{ isSavingNext ? 'กำลังบันทึก...' : 'ระบบการจัดการศึกษา' }}</span> <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

    </form>
  </div>
</template>

<style scoped>
/* ================== CSS ถอดแบบ 100% จาก Mockup HTML ================== */
.force-white-btn { color: #ffffff !important; }

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

/* AI Button */
.ai-btn { margin-top: 6px; border: 1px solid #A8793B; background: #FDFBF4; color: #A8793B; border-radius: 7px; padding: 8px 14px; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: 0.2s; }
.ai-btn:hover { background: #EEE0C6; }

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

/* Table Builder */
table.builder { width: 100%; border-collapse: collapse; margin-top: 4px; }
table.builder th { background: #1B2A4A; color: #EFE7D6; font-size: 12.3px; font-weight: 600; text-align: left; padding: 9px 12px; border: 1px solid #1B2A4A; }
table.builder td { border: 1px solid #E3DCC9; padding: 5px 6px; }
table.builder td input { width: 100%; border: 1px solid transparent !important; background: transparent !important; padding: 6px 8px !important; font-size: 13.4px !important; border-radius: 5px !important; }
table.builder td input:focus { outline: none !important; border-color: #A8793B !important; background: #EEE0C6 !important; }
table.builder tr:nth-child(even) td { background: #FCFAF4; }
.table-del { border: none; background: none; color: #9C4132; font-size: 14px; width: 100%; text-align: center; cursor: pointer;}

.page-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 22px; }
.nav-btn { border: 1px solid #E3DCC9; background: #fff; border-radius: 8px; padding: 10px 16px; font-size: 13px; font-weight: 600; color: #1B2A4A; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
.nav-btn:hover:not([disabled]) { border-color: #A8793B; color: #A8793B; }
.nav-btn[disabled] { opacity: .35; pointer-events: none; }

.btn-brass { background: #1B2A4A; transition: all 0.2s; }
.btn-brass:hover { background: #2C3E63; }
</style>