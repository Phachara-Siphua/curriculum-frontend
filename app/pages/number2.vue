<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  philosophy: '',
  importance: '',
  objectives: '',
  uniqueness: '',
  careers: '',
  plos: [
    { code: '', domain: 'ด้านความรู้ (Knowledge)', description: '' }
  ],
  clos: [
    { code: '', name: '', description: '' }
  ]
})

const domainOptions = ref([
  'ด้านความรู้ (Knowledge)',
  'ด้านทักษะ (Skill)',
  'ด้านทัศนคติ (Attitude)',
  'ด้านสมรรถนะ (Competency)'
])

// ----- ส่วนจำลองระบบ AI สำหรับ "วัตถุประสงค์ของหลักสูตร" -----
const isGeneratingObj = ref(false)
const showAiObjResult = ref(false)
const aiObjText = ref('')

const generateObjective = async () => {
  isGeneratingObj.value = true
  
  // จำลองระยะเวลาที่ Backend ประมวลผล AI (2 วินาที)
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // จำลองผลลัพธ์ที่ได้จาก AI (เพื่อนฝั่ง Backend จะเอา API Response มาใส่ตรงนี้)
  aiObjText.value = '1. เพื่อผลิตบัณฑิตที่มีความรู้ความเข้าใจในศาสตร์เทคโนโลยีวิศวกรรมอิเล็กทรอนิกส์\n2. เพื่อสร้างวิศวกรที่มีความสามารถในการประยุกต์ใช้เทคโนโลยีปัญญาประดิษฐ์ในอุตสาหกรรม\n3. เพื่อปลูกฝังคุณธรรม จริยธรรม และจรรยาบรรณวิชาชีพวิศวกร'
  
  isGeneratingObj.value = false
  showAiObjResult.value = true
}

const saveAiObjective = () => {
  // นำข้อความจากกล่อง AI ไปใส่ในฟอร์มจริง
  form.value.objectives = aiObjText.value
  showAiObjResult.value = false // ปิดกล่อง AI
}

const resetAiObjective = () => {
  aiObjText.value = ''
  showAiObjResult.value = false // ปิดกล่อง AI
}
// --------------------------------------------------------

// ฟังก์ชันสำหรับจัดการ PLO / CLO
const addPlo = () => {
  form.value.plos.push({ code: '', domain: 'ด้านความรู้ (Knowledge)', description: '' })
}
const removePlo = (index: number) => {
  form.value.plos.splice(index, 1)
}
const addClo = () => {
  form.value.clos.push({ code: '', name: '', description: '' })
}
const removeClo = (index: number) => {
  form.value.clos.splice(index, 1)
}
</script>

<template>
  <div class="w-full p-4 md:p-6">
    <UForm :state="form" class="w-full">
      <UCard
        class="w-full shadow-sm border border-gray-200 rounded-xl"
        :ui="{ root: 'bg-white', header: 'bg-blue-950 px-6 py-4', body: 'px-6 py-6' }"
      >
        <template #header>
          <p class="text-white font-semibold text-lg">
            องค์ประกอบที่ 2: ปรัชญา วัตถุประสงค์ ผลลัพธ์การเรียนรู้
          </p>
        </template>

        <div class="space-y-6">
          <UFormField label="ปรัชญาของหลักสูตร *" :ui="{ label: 'text-black font-bold text-base' }">
            <UTextarea v-model="form.philosophy" placeholder="ระบุปรัชญาของหลักสูตร" :rows="3" class="w-full" :ui="{ base: 'bg-gray-50' }" />
          </UFormField>

          <UFormField label="ความสำคัญของหลักสูตร" :ui="{ label: 'text-black font-bold text-base' }">
            <UTextarea v-model="form.importance" placeholder="ระบุความสำคัญและเหตุผลในการจัดทำหลักสูตร" :rows="3" class="w-full" :ui="{ base: 'bg-gray-50' }" />
          </UFormField>

          <!-- ================= ส่วนของวัตถุประสงค์ + ระบบ AI ================= -->
          <div class="space-y-3">
            <UFormField label="วัตถุประสงค์ของหลักสูตร" :ui="{ label: 'text-black font-bold text-base' }">
              <UTextarea v-model="form.objectives" placeholder="ระบุวัตถุประสงค์ของหลักสูตร" :rows="3" class="w-full" :ui="{ base: 'bg-gray-50' }" />
            </UFormField>

            <!-- กล่องแสดงผลลัพธ์จาก AI -->
            <!-- ปุ่มเรียก AI -->
            <UButton 
              color="success" 
              icon="i-heroicons-sparkles" 
              :loading="isGeneratingObj"
              @click="generateObjective"
              class="font-bold px-4 py-2"
            >
              ลอง Generate วัตถุประสงค์ (Mock)
            </UButton>

            <!-- กล่องแสดงผลลัพธ์จาก AI -->
            <UCard 
              v-if="showAiObjResult" 
              class="w-full shadow-sm border border-blue-200 bg-[#f8fbff]"
              :ui="{ header: 'py-3 border-b border-blue-100', footer: 'py-3 border-t border-blue-100' }"
            >
              <template #header>
                <div class="flex justify-between items-center">
                  <p class="text-blue-900 font-bold flex items-center gap-2">
                    <UIcon name="i-heroicons-sparkles" class="w-5 h-5" />
                    ผลลัพธ์จาก AI
                  </p>
                  <!-- เปลี่ยน color="green" เป็น "success" -->
                  <UBadge color="success" variant="subtle" size="sm">แก้ไขได้</UBadge>
                </div>
              </template>

              <UFormField label="วัตถุประสงค์ (ภาษาไทย)" :ui="{ label: 'text-gray-700 font-bold text-sm' }">
                <UTextarea v-model="aiObjText" :rows="4" class="w-full bg-white" />
              </UFormField>

              <template #footer>
                <div class="flex gap-2">
                  <!-- เปลี่ยน color="gray" เป็น "neutral" -->
                  <UButton color="neutral" variant="solid" class="bg-gray-600 text-white font-bold px-6" @click="saveAiObjective">บันทึกลงฟอร์ม</UButton>
                  <!-- เปลี่ยน color="white" เป็น "neutral" และใช้ variant="outline" -->
                  <UButton color="neutral" variant="outline" class="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50" @click="resetAiObjective">ยกเลิก</UButton>
                </div>
              </template>
            </UCard>
          </div>
          <!-- ========================================================= -->

          <UFormField label="จุดเด่นเฉพาะของหลักสูตร" :ui="{ label: 'text-black font-bold text-base' }">
            <UTextarea v-model="form.uniqueness" placeholder="ระบุจุดเด่นที่โดดเด่นของหลักสูตร" :rows="3" class="w-full" :ui="{ base: 'bg-gray-50' }" />
          </UFormField>

          <UFormField label="อาชีพที่สามารถประกอบได้หลังสำเร็จการศึกษา" :ui="{ label: 'text-black font-bold text-base' }">
            <UTextarea v-model="form.careers" placeholder="ระบุอาชีพที่สามารถประกอบได้ เช่น วิศวกร นักวิจัย ฯลฯ" :rows="3" class="w-full" :ui="{ base: 'bg-gray-50' }" />
          </UFormField>

          <UDivider class="my-8" />

          <!-- ส่วน PROGRAM LEARNING OUTCOMES (PLOS) -->
          <div>
            <p class="text-black font-bold text-base mb-1 uppercase tracking-wide flex items-center gap-4">
              PROGRAM LEARNING OUTCOMES (PLOS)
              <span class="h-px bg-gray-200 flex-1"></span>
            </p>
            <p class="text-sm text-gray-500 mb-4">ผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตร — กด "+ เพิ่ม PLO" เพื่อเพิ่มรายการ</p>

            <div v-for="(plo, index) in form.plos" :key="index" class="relative flex gap-4 p-5 mb-4 bg-[#faf8f4] border border-[#d8d2c6] rounded-xl group transition-all hover:shadow-sm">
              <button @click="removePlo(index)" type="button" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 shadow-sm border border-gray-200">
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5 block" />
              </button>
              
              <div class="w-8 h-8 rounded-full bg-blue-950 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-1 shadow-sm">
                {{ index + 1 }}
              </div>
              
              <div class="flex-1 space-y-4 pr-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UFormField label="รหัส PLO" :ui="{ label: 'text-black text-sm font-bold' }">
                    <UInput v-model="plo.code" placeholder="เช่น PLO1" class="w-full bg-white" />
                  </UFormField>
                  <UFormField label="ด้าน" :ui="{ label: 'text-black text-sm font-bold' }">
                    <UInputMenu v-model="plo.domain" :items="domainOptions" :searchable="false" class="w-full bg-white" />
                  </UFormField>
                </div>
                <UFormField label="ผลลัพธ์การเรียนรู้" :ui="{ label: 'text-black text-sm font-bold' }">
                  <UTextarea v-model="plo.description" placeholder="ระบุผลลัพธ์การเรียนรู้ที่คาดหวัง" :rows="2" class="w-full bg-white" />
                </UFormField>
              </div>
            </div>

            <button @click="addPlo" type="button" class="mt-4 flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-dashed border-blue-950 text-blue-950 font-bold rounded-lg hover:bg-blue-50 transition-colors text-sm w-max">
              <UIcon name="i-heroicons-plus" class="w-5 h-5" /> เพิ่ม PLO
            </button>
          </div>

          <UDivider class="my-8" />

          <!-- ส่วน COURSE LEARNING OUTCOMES (CLOS) -->
          <div>
            <p class="text-black font-bold text-base mb-1 uppercase tracking-wide flex items-center gap-4">
               COURSE LEARNING OUTCOMES (CLOS) ตัวอย่าง
               <span class="h-px bg-gray-200 flex-1"></span>
            </p>
            <p class="text-sm text-gray-500 mb-4">ผลลัพธ์การเรียนรู้ระดับรายวิชา</p>

            <div v-for="(clo, index) in form.clos" :key="index" class="relative flex gap-4 p-5 mb-4 bg-[#faf8f4] border border-[#d8d2c6] rounded-xl group transition-all hover:shadow-sm">
              <button @click="removeClo(index)" type="button" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 shadow-sm border border-gray-200">
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5 block" />
              </button>
              
              <div class="w-8 h-8 rounded-full bg-blue-950 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-1 shadow-sm">
                {{ index + 1 }}
              </div>
              
              <div class="flex-1 space-y-4 pr-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UFormField label="รหัสวิชา" :ui="{ label: 'text-black text-sm font-bold' }">
                    <UInput v-model="clo.code" placeholder="เช่น EE101" class="w-full bg-white" />
                  </UFormField>
                  <UFormField label="ชื่อวิชา" :ui="{ label: 'text-black text-sm font-bold' }">
                    <UInput v-model="clo.name" placeholder="ชื่อวิชา" class="w-full bg-white" />
                  </UFormField>
                </div>
                <UFormField label="CLO" :ui="{ label: 'text-black text-sm font-bold' }">
                  <UTextarea v-model="clo.description" placeholder="ระบุ CLO ของวิชานี้" :rows="2" class="w-full bg-white" />
                </UFormField>
              </div>
            </div>

            <button @click="addClo" type="button" class="mt-4 flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-dashed border-blue-950 text-blue-950 font-bold rounded-lg hover:bg-blue-50 transition-colors text-sm w-max">
              <UIcon name="i-heroicons-plus" class="w-5 h-5" /> เพิ่ม CLO
            </button>
          </div>

          <!-- ปุ่มถัดไป -->
          <div class="mt-8 border-t border-gray-200 pt-6">
            <UButton to="/number3" class="bg-blue-950 hover:bg-blue-900 text-white px-8 py-2.5 text-base font-medium rounded-lg">
              ถัดไป
            </UButton>
          </div>
        </div>
      </UCard>
    </UForm>
  </div>
</template>