<script setup lang="ts">
import { ref } from 'vue'
const router = useRouter()

const form = ref({ 
  philosophy: '', 
  importance: '', 
  objectives: '', 
  uniqueness: '', 
  careers: '', 
  plos: [{ code: '', domain: 'ด้านความรู้ (Knowledge)', description: '' }], 
  ylos: [{ year: '1', description: '' }] 
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

// ระบบ AI สำหรับ YLO (แทน CLO)
const isGenYlo = ref(false); const showAiYlo = ref(false);
const aiYloData = ref([
  { year: '1', description: 'สามารถอธิบายหลักการพื้นฐานทางวิศวกรรมและการทำงานของระบบได้' },
  { year: '2', description: 'สามารถประยุกต์ใช้เครื่องมือและเทคโนโลยีในการแก้ปัญหาเบื้องต้นได้' },
  { year: '3', description: 'สามารถวิเคราะห์และออกแบบระบบงานในภาคอุตสาหกรรมได้' },
  { year: '4', description: 'สามารถสร้างสรรค์นวัตกรรมและโครงงานที่นำไปใช้งานได้จริง' }
])
const genYlo = async () => { isGenYlo.value = true; await new Promise(r => setTimeout(r, 1500)); isGenYlo.value = false; showAiYlo.value = true }
const saveYlo = () => { form.value.ylos = JSON.parse(JSON.stringify(aiYloData.value)); showAiYlo.value = false }
const closeAiYlo = () => { showAiYlo.value = false }
// ===================================================

const addPlo = () => { form.value.plos.push({ code: '', domain: 'ด้านความรู้ (Knowledge)', description: '' }) }
const removePlo = (index: number) => { form.value.plos.splice(index, 1) }

// ฟังก์ชัน Add/Remove สำหรับ YLO
const addYlo = () => { form.value.ylos.push({ year: '', description: '' }) }
const removeYlo = (index: number) => { form.value.ylos.splice(index, 1) }

// ================= ระบบบันทึกข้อมูล (Save System) =================
const isSavingDraft = ref(false)
const isSavingNext = ref(false)

const saveDraft = async () => {
  isSavingDraft.value = true
  // 💾 DB: ให้ Backend ยิง API บันทึกข้อมูลหน้า 2 ลงตาราง Program, PEO, PLO, YLO (ตั้ง status = 'draft')
  await new Promise(r => setTimeout(r, 1000))
  isSavingDraft.value = false
  alert('บันทึกฉบับร่างเรียบร้อยแล้ว')
}

const saveAndNext = async () => {
  isSavingNext.value = true
  // 💾 DB: ให้ Backend ยิง API บันทึกข้อมูลหน้า 2
  await new Promise(r => setTimeout(r, 1000))
  isSavingNext.value = false
  router.push('/number3') // เปลี่ยนไปหน้า 3
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

          <!-- ❗❗❗ ✅= ไม่ใช้ AI | ❌= ใช้ AI | ❓= ไม่แน่ใจ ❗❗❗ -->

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-100 space-y-8 shadow-sm">
            
            <!-- ✅ ปรัชญาของหลักสูตร ไม่ใช้ AI | 💾 DB: ❓ ไม่แน่ใจ (ต้องเพิ่มคอลัมน์ philosophy ในตาราง Program) -->
            <UFormField label="ปรัชญาของหลักสูตร *" :ui="{ label: 'text-gray-800 font-bold' }">
              <UTextarea v-model="form.philosophy" placeholder="ระบุปรัชญาของหลักสูตร" :rows="3" class="w-full bg-white" />
            </UFormField>

            <UDivider />

            <!-- ❌ ความสำคัญของหลักสูตร ใช้ AI ช่วยร่างจากข่าว/งานวิจัย | 💾 DB: ❓ ไม่แน่ใจ (ต้องเพิ่มคอลัมน์ importance ในตาราง Program) -->
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

            <!-- ❌ วัตถุประสงค์ (PEOs) ใช้ AI ร่างจาก PLO + บริบท | 💾 DB: ตาราง PEO (peo_code, description_th) -->
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

            <!-- ❌ จุดเด่นเฉพาะของหลักสูตร ใช้ AI ช่วยวิเคราะห์ | 💾 DB: ❓ ไม่แน่ใจ (ต้องเพิ่มคอลัมน์ uniqueness ในตาราง Program) -->
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

            <!-- ❌ อาชีพหลังสำเร็จการศึกษา ใช้ AI แนะนำ | 💾 DB: ❓ ไม่แน่ใจ (ต้องเพิ่มคอลัมน์ career_opportunities ในตาราง Program) -->
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

          <!-- ❌ PLO (ใช้ AI เสนอรายการจาก TQF) | 💾 DB: ตาราง PLO (plo_code, plo_type, description_th) -->
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

          <!-- ❌ YLO (ใช้ AI ช่วยสร้างจากรายวิชา) | 💾 DB: ตาราง YLO (ต้องสร้างตารางเก็บ year, description) -->
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

          <!-- ปุ่ม Action (เพิ่มปุ่ม Save Draft) -->
          <div class="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
            <UButton to="/number1" variant="ghost" class="text-gray-500 hover:text-[#1a2744] px-6 py-3 text-base bg-white hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 w-full md:w-auto text-center justify-center">← ย้อนกลับ</UButton>
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
</template>