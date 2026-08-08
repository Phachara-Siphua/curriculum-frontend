<script setup lang="ts">
import { ref, onMounted } from 'vue'
const route = useRoute()
const router = useRouter()

<<<<<<< Updated upstream
=======
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase as string

// Same branch labels used for instructors on page 1 — keep these consistent
// across the app, since `ylo.branch` / `course_category.branch` / etc. all
// key off this exact text.
const YLO_BRANCH: Record<'Telecom' | 'Computer' | 'Instrument' | 'Broadcast', string> = {
  Telecom: 'แขนงวิชาโทรคมนาคม',
  Computer: 'แขนงวิชาคอมพิวเตอร์',
  Instrument: 'แขนงวิชาเครื่องมือวัดและควบคุม',
  Broadcast: 'แขนงวิชาการกระจายเสียงวิทยุและโทรทัศน์'
}

>>>>>>> Stashed changes
// ================= State ข้อมูลฟอร์มหน้า 2 =================
const form = ref({ 
  id: null as string | number | null,
  philosophy: '', 
  importance: '', 
  objectives: '', 
  uniqueness: '', 
  careers: '', 
  plos: [{ code: '', domain: 'ด้านความรู้ (Knowledge)', description: '' }], 
  ylos: [{ year: '1', description: '' }] 
})

<<<<<<< Updated upstream
// 💾 เมื่อหน้าเว็บโหลด ให้เช็ก id เพื่อดึงข้อมูลเดิมมาโชว์
=======
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

    // YLO by branch — loaded from the real `ylo` table, grouped by branch
    try {
      const ylos: any[] = await $fetch(`${API_BASE}/programs/${id}/ylo/`)
      const byBranch = (branch: string) =>
        ylos
          .filter(y => y.branch === branch)
          .map(y => ({ year: y.year != null ? String(y.year) : '', desc: y.description ?? '' }))

      form.value.yloTelecom = byBranch(YLO_BRANCH.Telecom).length ? byBranch(YLO_BRANCH.Telecom) : [{ year: '', desc: '' }]
      form.value.yloComputer = byBranch(YLO_BRANCH.Computer).length ? byBranch(YLO_BRANCH.Computer) : [{ year: '', desc: '' }]
      form.value.yloInstrument = byBranch(YLO_BRANCH.Instrument).length ? byBranch(YLO_BRANCH.Instrument) : [{ year: '', desc: '' }]
      form.value.yloBroadcast = byBranch(YLO_BRANCH.Broadcast).length ? byBranch(YLO_BRANCH.Broadcast) : [{ year: '', desc: '' }]
    } catch (err) {
      console.error('Failed to load YLO', err)
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

>>>>>>> Stashed changes
onMounted(() => {
  if (route.query.id) {
    form.value.id = route.query.id as string
    // [Backend Task]: ยิง API GET /programs/{id}/details เพื่อดึงข้อมูล PROGRAM, PLO, YLO มาแสดง
  }
})

const domainOptions = ['ด้านความรู้ (Knowledge)', 'ด้านทักษะ (Skill)', 'ด้านทัศนคติ (Attitude)', 'ด้านสมรรถนะ (Competency)']

// ================= AI Mock States =================
const isGenImp = ref(false); const showAiImp = ref(false); const aiImpText = ref('')
const genImp = async () => { isGenImp.value = true; await new Promise(r => setTimeout(r, 1500)); aiImpText.value = 'เพื่อตอบสนองความต้องการของภาคอุตสาหกรรมยุคใหม่ที่เน้นการประยุกต์ใช้เทคโนโลยีดิจิทัล...'; isGenImp.value = false; showAiImp.value = true }
const saveImp = () => { form.value.importance = aiImpText.value; showAiImp.value = false }
const closeAiImp = () => { showAiImp.value = false }

const isGenObj = ref(false); const showAiObj = ref(false); const aiObjText = ref('')
const genObj = async () => { isGenObj.value = true; await new Promise(r => setTimeout(r, 1500)); aiObjText.value = '1. เพื่อผลิตบัณฑิตที่มีความรู้ความเข้าใจในศาสตร์เทคโนโลยีวิศวกรรมอิเล็กทรอนิกส์\n2. เพื่อสร้างวิศวกรที่มีความสามารถในการประยุกต์ใช้เทคโนโลยีปัญญาประดิษฐ์'; isGenObj.value = false; showAiObj.value = true }
const saveObj = () => { form.value.objectives = aiObjText.value; showAiObj.value = false }
const closeAiObj = () => { showAiObj.value = false }

const isGenUni = ref(false); const showAiUni = ref(false); const aiUniText = ref('')
const genUni = async () => { isGenUni.value = true; await new Promise(r => setTimeout(r, 1500)); aiUniText.value = 'มุ่งเน้นการปฏิบัติงานจริงผ่านโครงการสหกิจศึกษา ร่วมกับบริษัทชั้นนำ...'; isGenUni.value = false; showAiUni.value = true }
const saveUni = () => { form.value.uniqueness = aiUniText.value; showAiUni.value = false }
const closeAiUni = () => { showAiUni.value = false }

const isGenCar = ref(false); const showAiCar = ref(false); const aiCarText = ref('')
const genCar = async () => { isGenCar.value = true; await new Promise(r => setTimeout(r, 1500)); aiCarText.value = '1. วิศวกรอิเล็กทรอนิกส์\n2. นักพัฒนาระบบ AI'; isGenCar.value = false; showAiCar.value = true }
const saveCar = () => { form.value.careers = aiCarText.value; showAiCar.value = false }
const closeAiCar = () => { showAiCar.value = false }

const isGenPlo = ref(false); const showAiPlo = ref(false); 
const aiPloData = ref([{ code: 'PLO1', domain: 'ด้านความรู้ (Knowledge)', description: 'อธิบายหลักการทำงานของระบบ AI ได้' }])
const genPlo = async () => { isGenPlo.value = true; await new Promise(r => setTimeout(r, 1500)); isGenPlo.value = false; showAiPlo.value = true }
const savePlo = () => { form.value.plos = JSON.parse(JSON.stringify(aiPloData.value)); showAiPlo.value = false }
const closeAiPlo = () => { showAiPlo.value = false }

// ระบบ AI สำหรับ YLO
const isGenYlo = ref(false); const showAiYlo = ref(false);
const aiYloData = ref([
  { year: '1', description: 'สามารถอธิบายหลักการพื้นฐานทางวิศวกรรมและการทำงานของระบบได้' },
  { year: '2', description: 'สามารถประยุกต์ใช้เครื่องมือและเทคโนโลยีในการแก้ปัญหาเบื้องต้นได้' }
])
const genYlo = async () => { isGenYlo.value = true; await new Promise(r => setTimeout(r, 1500)); isGenYlo.value = false; showAiYlo.value = true }
const saveYlo = () => { form.value.ylos = JSON.parse(JSON.stringify(aiYloData.value)); showAiYlo.value = false }
const closeAiYlo = () => { showAiYlo.value = false }
// ===================================================

const addPlo = () => { form.value.plos.push({ code: '', domain: 'ด้านความรู้ (Knowledge)', description: '' }) }
const removePlo = (index: number) => { form.value.plos.splice(index, 1) }

<<<<<<< Updated upstream
const addYlo = () => { form.value.ylos.push({ year: '', description: '' }) }
const removeYlo = (index: number) => { form.value.ylos.splice(index, 1) }
=======
  // 2.5 - 2.8 — YLO by branch, real rows in the `ylo` table
  const yloItems = [
    ...form.value.yloTelecom.map(y => ({ ...y, branch: YLO_BRANCH.Telecom })),
    ...form.value.yloComputer.map(y => ({ ...y, branch: YLO_BRANCH.Computer })),
    ...form.value.yloInstrument.map(y => ({ ...y, branch: YLO_BRANCH.Instrument })),
    ...form.value.yloBroadcast.map(y => ({ ...y, branch: YLO_BRANCH.Broadcast }))
  ]
    .filter(y => y.year.toString().trim() || y.desc.trim())
    .map(y => ({
      year: y.year ? Number(y.year) : null,
      description: y.desc || null,
      branch: y.branch
    }))

  await replaceChildren(id, 'ylo', yloItems)
>>>>>>> Stashed changes

// ================= ระบบบันทึกข้อมูล (Save System) =================
const isSavingDraft = ref(false)
const isSavingNext = ref(false)

const saveDraft = async () => {
  isSavingDraft.value = true
  // 💾 DB: อัปเดตข้อมูลตาราง PROGRAM, PLO, YLO
  await new Promise(r => setTimeout(r, 1000))
  isSavingDraft.value = false
  alert('บันทึกฉบับร่างเรียบร้อยแล้ว')
}

const saveAndNext = async () => {
  isSavingNext.value = true
  // 💾 DB: อัปเดตข้อมูลหน้า 2
  await new Promise(r => setTimeout(r, 1000))
  isSavingNext.value = false

  // แนบ id ไปหน้า 3 ต่อ 
  router.push({ path: '/number3', query: { id: form.value.id } })
}
// =============================================================
</script>

<template>
  <div class="w-full p-4 md:p-6">
    <UForm :state="form" class="w-full">
      <div class="w-full shadow-md border border-gray-200 rounded-2xl overflow-hidden bg-white">
        <div class="bg-[#1a2744] px-6 py-5 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-[#c8a84b] flex items-center justify-center text-white font-bold">2</div>
          <p class="text-white font-bold text-xl tracking-wide font-sans m-0">ปรัชญา วัตถุประสงค์ ผลลัพธ์การเรียนรู้</p>
        </div>

        <div class="p-6 md:p-8 space-y-8">

          <!-- ❗❗❗ คอมเมนต์อ้างอิงตาม ER Diagram (image_ed9000.jpg) ❗❗❗ -->

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-100 space-y-8 shadow-sm">
            
            <!-- ✅ DB: ตาราง PROGRAM (philosophy) -->
            <UFormField label="ปรัชญาของหลักสูตร *" :ui="{ label: 'text-gray-800 font-bold' }">
              <UTextarea v-model="form.philosophy" placeholder="ระบุปรัชญาของหลักสูตร" :rows="3" class="w-full bg-white" />
            </UFormField>

            <UDivider />

            <!-- ❌ DB: ตาราง PROGRAM (importance) -->
            <div class="p-5 border border-[#c8a84b] rounded-xl bg-white shadow-sm space-y-4">
              <div class="flex justify-between items-center mb-2">
                <p class="text-gray-800 font-bold text-sm m-0">ความสำคัญของหลักสูตร</p>
                <UBadge variant="soft" class="font-bold rounded-lg bg-yellow-100 text-yellow-700"><UIcon name="i-heroicons-sparkles" class="mr-1" /> AI Assisted</UBadge>
              </div>
              <UTextarea v-model="form.importance" placeholder="ระบุความสำคัญและเหตุผลในการจัดทำหลักสูตร" :rows="3" class="w-full bg-white" />
              <UButton variant="outline" icon="i-heroicons-sparkles" :loading="isGenImp" @click="genImp()" class="font-bold px-4 py-2 border-[#1a2744] text-[#1a2744] bg-white hover:bg-gray-50">ลอง Generate ความสำคัญ (Mock)</UButton>
              <div v-if="showAiImp" class="p-4 border border-blue-200 bg-[#f8fbff] rounded-xl space-y-3">
                <div class="flex justify-between items-center"><p class="text-blue-900 font-bold flex items-center gap-2 m-0"><UIcon name="i-heroicons-sparkles" /> ผลลัพธ์จาก AI</p><UBadge class="bg-green-100 text-green-700">แก้ไขได้</UBadge></div>
                <UTextarea v-model="aiImpText" :rows="3" class="w-full bg-white" />
                <div class="flex gap-2">
                  <UButton class="bg-gray-600 hover:bg-gray-700 text-white font-bold" @click="saveImp()">บันทึกลงฟอร์ม</UButton>
                  <UButton variant="ghost" class="text-gray-500 hover:bg-gray-100" @click="closeAiImp()">ยกเลิก</UButton>
                </div>
              </div>
            </div>

            <!-- ❌ DB: ตาราง PROGRAM (objectives) -->
            <div class="p-5 border border-[#c8a84b] rounded-xl bg-white shadow-sm space-y-4">
              <div class="flex justify-between items-center mb-2">
                <p class="text-gray-800 font-bold text-sm m-0">วัตถุประสงค์ของหลักสูตร (PEOs)</p>
                <UBadge variant="soft" class="font-bold rounded-lg bg-yellow-100 text-yellow-700"><UIcon name="i-heroicons-sparkles" class="mr-1" /> AI Assisted</UBadge>
              </div>
              <UTextarea v-model="form.objectives" placeholder="ระบุวัตถุประสงค์ของหลักสูตร" :rows="3" class="w-full bg-white" />
              <UButton variant="outline" icon="i-heroicons-sparkles" :loading="isGenObj" @click="genObj()" class="font-bold px-4 py-2 border-[#1a2744] text-[#1a2744] bg-white hover:bg-gray-50">ลอง Generate วัตถุประสงค์ (Mock)</UButton>
              <div v-if="showAiObj" class="mt-4 p-4 border border-blue-200 bg-[#f8fbff] rounded-xl space-y-3">
                <div class="flex justify-between items-center"><p class="text-blue-900 font-bold flex items-center gap-2 m-0"><UIcon name="i-heroicons-sparkles" /> ผลลัพธ์จาก AI</p><UBadge class="bg-green-100 text-green-700">แก้ไขได้</UBadge></div>
                <UTextarea v-model="aiObjText" :rows="3" class="w-full bg-white" />
                <div class="flex gap-2">
                  <UButton class="bg-gray-600 hover:bg-gray-700 text-white font-bold" @click="saveObj()">บันทึกลงฟอร์ม</UButton>
                  <UButton variant="ghost" class="text-gray-500 hover:bg-gray-100" @click="closeAiObj()">ยกเลิก</UButton>
                </div>
              </div>
            </div>

            <!-- ❌ DB: ตาราง PROGRAM (uniqueness) -->
            <div class="p-5 border border-[#c8a84b] rounded-xl bg-white shadow-sm space-y-4">
              <div class="flex justify-between items-center mb-2">
                <p class="text-gray-800 font-bold text-sm m-0">จุดเด่นเฉพาะของหลักสูตร</p>
                <UBadge variant="soft" class="font-bold rounded-lg bg-yellow-100 text-yellow-700"><UIcon name="i-heroicons-sparkles" class="mr-1" /> AI Assisted</UBadge>
              </div>
              <UTextarea v-model="form.uniqueness" placeholder="ระบุจุดเด่นที่โดดเด่นของหลักสูตร" :rows="3" class="w-full bg-white" />
              <UButton variant="outline" icon="i-heroicons-sparkles" :loading="isGenUni" @click="genUni()" class="font-bold px-4 py-2 border-[#1a2744] text-[#1a2744] bg-white hover:bg-gray-50">ลอง Generate จุดเด่น (Mock)</UButton>
              <div v-if="showAiUni" class="p-4 border border-blue-200 bg-[#f8fbff] rounded-xl space-y-3">
                <div class="flex justify-between items-center"><p class="text-blue-900 font-bold flex items-center gap-2 m-0"><UIcon name="i-heroicons-sparkles" /> ผลลัพธ์จาก AI</p><UBadge class="bg-green-100 text-green-700">แก้ไขได้</UBadge></div>
                <UTextarea v-model="aiUniText" :rows="3" class="w-full bg-white" />
                <div class="flex gap-2">
                  <UButton class="bg-gray-600 hover:bg-gray-700 text-white font-bold" @click="saveUni()">บันทึกลงฟอร์ม</UButton>
                  <UButton variant="ghost" class="text-gray-500 hover:bg-gray-100" @click="closeAiUni()">ยกเลิก</UButton>
                </div>
              </div>
            </div>

            <!-- ❌ DB: ตาราง PROGRAM (careers) -->
            <div class="p-5 border border-[#c8a84b] rounded-xl bg-white shadow-sm space-y-4">
              <div class="flex justify-between items-center mb-2">
                <p class="text-gray-800 font-bold text-sm m-0">อาชีพที่สามารถประกอบได้หลังสำเร็จการศึกษา</p>
                <UBadge variant="soft" class="font-bold rounded-lg bg-yellow-100 text-yellow-700"><UIcon name="i-heroicons-sparkles" class="mr-1" /> AI Assisted</UBadge>
              </div>
              <UTextarea v-model="form.careers" placeholder="ระบุอาชีพที่สามารถประกอบได้" :rows="3" class="w-full bg-white" />
              <UButton variant="outline" icon="i-heroicons-sparkles" :loading="isGenCar" @click="genCar()" class="font-bold px-4 py-2 border-[#1a2744] text-[#1a2744] bg-white hover:bg-gray-50">ลอง Generate อาชีพ (Mock)</UButton>
              <div v-if="showAiCar" class="p-4 border border-blue-200 bg-[#f8fbff] rounded-xl space-y-3">
                <div class="flex justify-between items-center"><p class="text-blue-900 font-bold flex items-center gap-2 m-0"><UIcon name="i-heroicons-sparkles" /> ผลลัพธ์จาก AI</p><UBadge class="bg-green-100 text-green-700">แก้ไขได้</UBadge></div>
                <UTextarea v-model="aiCarText" :rows="3" class="w-full bg-white" />
                <div class="flex gap-2">
                  <UButton class="bg-gray-600 hover:bg-gray-700 text-white font-bold" @click="saveCar()">บันทึกลงฟอร์ม</UButton>
                  <UButton variant="ghost" class="text-gray-500 hover:bg-gray-100" @click="closeAiCar()">ยกเลิก</UButton>
                </div>
              </div>
            </div>
          </div>

          <!-- ❌ DB: ตาราง PLO (program_id, plo_code, domain(ถ้ามี), description_th) -->
          <div class="bg-[#faf8f4] p-6 rounded-xl border-2 border-[#c8a84b] shadow-sm">
            <div class="flex justify-between items-center border-b-2 border-[#d8d2c6] pb-3 mb-4">
              <div>
                <p class="text-[#1a2744] font-bold text-lg m-0">PROGRAM LEARNING OUTCOMES (PLOS)</p>
                <p class="text-sm text-gray-500 m-0">ผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตร</p>
              </div>
              <UBadge variant="soft" class="font-bold rounded-lg bg-yellow-100 text-yellow-700"><UIcon name="i-heroicons-sparkles" class="mr-1" /> AI Assisted</UBadge>
            </div>
            <div class="mb-4">
              <UButton variant="outline" icon="i-heroicons-sparkles" :loading="isGenPlo" @click="genPlo()" class="font-bold px-4 py-2 border-[#1a2744] text-[#1a2744] bg-white hover:bg-gray-50">ลองให้ AI สร้างรายการ PLO ให้ (Mock)</UButton>
            </div>
            <div v-if="showAiPlo" class="p-4 border border-blue-200 bg-[#f8fbff] rounded-xl space-y-3 mb-4">
               <div class="flex justify-between items-center"><p class="text-blue-900 font-bold flex items-center gap-2 m-0"><UIcon name="i-heroicons-sparkles" /> โครงร่าง PLO จาก AI</p><UBadge class="bg-green-100 text-green-700">แก้ไขได้</UBadge></div>
               <div v-for="(aiPlo, i) in aiPloData" :key="i" class="flex flex-col md:flex-row gap-4 p-4 bg-white border border-blue-100 rounded-lg">
                 <UInput v-model="aiPlo.code" class="w-full md:w-24" />
                 <USelectMenu v-model="aiPlo.domain" :items="domainOptions" class="w-full md:w-64" />
                 <UInput v-model="aiPlo.description" class="flex-1" />
               </div>
               <div class="flex gap-2">
                 <UButton class="bg-gray-600 hover:bg-gray-700 text-white font-bold" @click="savePlo()">แทนที่ PLO เดิมด้วยข้อมูลนี้</UButton>
                 <UButton variant="ghost" class="text-gray-500 hover:bg-gray-100" @click="closeAiPlo()">ยกเลิก</UButton>
               </div>
            </div>
            
            <div v-for="(plo, index) in form.plos" :key="'plo'+index" class="relative bg-white p-5 border border-gray-200 rounded-xl shadow-sm group mb-4">
              <button @click="removePlo(index)" type="button" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 bg-gray-50 rounded-full p-1"><UIcon name="i-heroicons-x-mark" class="w-5 h-5 block" /></button>
              <div class="w-8 h-8 rounded-lg bg-[#1a2744] text-[#e8c96a] flex items-center justify-center text-sm font-bold mb-4">{{ index + 1 }}</div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <UFormField label="รหัส PLO" :ui="{ label: 'text-gray-700 font-bold text-sm' }">
                  <UInput v-model="plo.code" placeholder="เช่น PLO1" class="w-full bg-white" />
                </UFormField>
                <UFormField label="ด้าน" :ui="{ label: 'text-gray-700 font-bold text-sm' }">
                  <USelectMenu v-model="plo.domain" :items="domainOptions" class="w-full bg-white" />
                </UFormField>
              </div>
              <UFormField label="ผลลัพธ์การเรียนรู้" :ui="{ label: 'text-gray-700 font-bold text-sm' }">
                <UTextarea v-model="plo.description" placeholder="ระบุผลลัพธ์การเรียนรู้ที่คาดหวัง" :rows="2" class="w-full bg-white" />
              </UFormField>
            </div>
            <UButton @click="addPlo()" variant="outline" icon="i-heroicons-plus" class="border border-[#1a2744] text-[#1a2744] bg-white hover:bg-gray-50">เพิ่ม PLO เอง</UButton>
          </div>

          <!-- ❌ DB: ตาราง YLO (program_id, year, description) -->
          <div class="bg-[#faf8f4] p-6 rounded-xl border-2 border-[#c8a84b] shadow-sm">
            <div class="flex justify-between items-center border-b-2 border-[#d8d2c6] pb-3 mb-4">
              <div>
                <p class="text-[#1a2744] font-bold text-lg m-0">YEARLY LEARNING OUTCOMES (YLOS)</p>
                <p class="text-sm text-gray-500 m-0">ความคาดหวังของผลลัพธ์การเรียนรู้เมื่อสิ้นปีการศึกษา</p>
              </div>
              <UBadge variant="soft" class="font-bold rounded-lg bg-yellow-100 text-yellow-700"><UIcon name="i-heroicons-sparkles" class="mr-1" /> AI Assisted</UBadge>
            </div>
            <div class="mb-4">
              <UButton variant="outline" icon="i-heroicons-sparkles" :loading="isGenYlo" @click="genYlo()" class="font-bold px-4 py-2 border-[#1a2744] text-[#1a2744] bg-white hover:bg-gray-50">ลองให้ AI สร้างรายการ YLO ให้ (Mock)</UButton>
            </div>
            <div v-if="showAiYlo" class="p-4 border border-blue-200 bg-[#f8fbff] rounded-xl space-y-3 mb-4">
               <div class="flex justify-between items-center"><p class="text-blue-900 font-bold flex items-center gap-2 m-0"><UIcon name="i-heroicons-sparkles" /> โครงร่าง YLO จาก AI</p><UBadge class="bg-green-100 text-green-700">แก้ไขได้</UBadge></div>
               <div v-for="(aiYlo, i) in aiYloData" :key="i" class="flex flex-col md:flex-row gap-4 p-4 bg-white border border-blue-100 rounded-lg">
                 <UFormField label="ชั้นปีที่" :ui="{ label: 'text-gray-700 font-bold text-xs' }" class="w-full md:w-32">
                   <UInput v-model="aiYlo.year" class="w-full" />
                 </UFormField>
                 <UFormField label="ความคาดหวังของผลลัพธ์การเรียนรู้ (YLO)" :ui="{ label: 'text-gray-700 font-bold text-xs' }" class="flex-1">
                   <UInput v-model="aiYlo.description" class="w-full" />
                 </UFormField>
               </div>
               <div class="flex gap-2">
                 <UButton class="bg-gray-600 hover:bg-gray-700 text-white font-bold" @click="saveYlo()">แทนที่ YLO เดิมด้วยข้อมูลนี้</UButton>
                 <UButton variant="ghost" class="text-gray-500 hover:bg-gray-100" @click="closeAiYlo()">ยกเลิก</UButton>
               </div>
            </div>
            <div v-for="(ylo, index) in form.ylos" :key="'ylo'+index" class="relative bg-white p-5 border border-gray-200 rounded-xl shadow-sm group mb-4">
              <button @click="removeYlo(index)" type="button" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 bg-gray-50 rounded-full p-1"><UIcon name="i-heroicons-x-mark" class="w-5 h-5 block" /></button>
              <div class="w-8 h-8 rounded-lg bg-[#1a2744] text-[#e8c96a] flex items-center justify-center text-sm font-bold mb-4">{{ index + 1 }}</div>
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <UFormField label="ชั้นปีที่" :ui="{ label: 'text-gray-700 font-bold text-sm' }" class="md:col-span-1">
                  <UInput v-model="ylo.year" placeholder="เช่น 1, 2, 3, 4" class="w-full bg-white" />
                </UFormField>
                <UFormField label="ความคาดหวังของผลลัพธ์การเรียนรู้ (YLO)" :ui="{ label: 'text-gray-700 font-bold text-sm' }" class="md:col-span-3">
                  <UTextarea v-model="ylo.description" placeholder="ระบุ YLO ของชั้นปีนี้" :rows="2" class="w-full bg-white" />
                </UFormField>
              </div>
            </div>
            <UButton @click="addYlo()" variant="outline" icon="i-heroicons-plus" class="border border-[#1a2744] text-[#1a2744] bg-white hover:bg-gray-50">เพิ่ม YLO เอง</UButton>
          </div>

          <!-- ปุ่ม Action (ย้อนกลับให้คง id ไว้ด้วย) -->
          <div class="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
            <UButton :to="`/number1?id=${form.id || ''}`" variant="ghost" class="text-gray-500 hover:text-[#1a2744] px-6 py-3 text-base bg-white hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 w-full md:w-auto text-center justify-center">← ย้อนกลับ</UButton>
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
<<<<<<< Updated upstream
    </UForm>
=======

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
                          <td><input v-model="ylo.year" type="number" min="1" placeholder="1, 2, 3..."></td>
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
                          <td><input v-model="ylo.year" type="number" min="1" placeholder="1, 2, 3..."></td>
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
                          <td><input v-model="ylo.year" type="number" min="1" placeholder="1, 2, 3..."></td>
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
                          <td><input v-model="ylo.year" type="number" min="1" placeholder="1, 2, 3..."></td>
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
>>>>>>> Stashed changes
  </div>
</template>