<script setup lang="ts">
import { ref, onMounted } from 'vue'
const route = useRoute()
const router = useRouter()

// ================= State ข้อมูลฟอร์มหน้า 1 =================
const form = ref({
  id: null as string | number | null, // สำหรับเก็บ program_id (PK ของตาราง PROGRAM)
  programCode: '', 
  nameTh: '', 
  nameEn: '', 
  degreeTh: '', 
  degreeAbbrTh: '', 
  degreeEn: '', 
  degreeAbbrEn: '',
  major: '', 
  durationYears: null as number | null, 
  programCategory: '', 
  language: '', 
  admission: '', 
  openYear: '', 
  approvalDetails: ''
})

const programTypeItems = ['หลักสูตรใหม่', 'หลักสูตรปรับปรุง']
const programTypeValue = ref('หลักสูตรใหม่')
const programFormatItems = ['หลักสูตรระดับปริญญาตรี', 'หลักสูตรระดับปริญญาโท', 'หลักสูตรระดับปริญญาเอก']
const programFormatValue = ref('หลักสูตรระดับปริญญาตรี')
const degreeGrantItems = ['ให้ปริญญาเพียงสาขาวิชาเดียว', 'ให้ปริญญาร่วมกับสถาบันอื่น']
const degreeGrantValue = ref('ให้ปริญญาเพียงสาขาวิชาเดียว')

// 💾 เมื่อหน้าเว็บโหลด ให้ดึงข้อมูลมาแสดง ถ้ามี id แนบมากับ URL
onMounted(() => {
  if (route.query.id) {
    form.value.id = route.query.id as string
    // [Backend Task]: ยิง API GET /programs/{id} เพื่อดึงข้อมูลมาแสดง
  }
})

// ================= ระบบบันทึกข้อมูล (Save System) =================
const isSavingDraft = ref(false)
const isSavingNext = ref(false)

const saveDraft = async () => {
  isSavingDraft.value = true
  // [Backend Task]: ยิง API POST (ถ้า id=null) หรือ PUT (ถ้ามี id) ไปอัปเดตตาราง PROGRAM (status = 'draft')
  await new Promise(r => setTimeout(r, 1000))
  if (!form.value.id) form.value.id = 1 // สมมติว่าได้ ID จาก Backend กลับมา
  isSavingDraft.value = false
  alert(`บันทึกฉบับร่างเรียบร้อยแล้ว (Program ID: ${form.value.id})`)
}

const saveAndNext = async () => {
  isSavingNext.value = true
  // [Backend Task]: ยิง API บันทึกข้อมูลตาราง PROGRAM
  await new Promise(r => setTimeout(r, 1000))
  if (!form.value.id) form.value.id = 1 // สมมติว่าเซฟแล้วได้ ID กลับมา
  isSavingNext.value = false
  
  // แนบ id ข้ามไปหน้า 2 
  router.push({ path: '/number2', query: { id: form.value.id } })
}
// =============================================================
</script>

<template>
  <div class="w-full p-4 md:p-6">
    <UForm :state="form" class="w-full">
      <div class="w-full shadow-md border border-gray-200 rounded-2xl overflow-hidden bg-white">
        
        <div class="bg-[#1a2744] px-6 py-5 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-[#c8a84b] flex items-center justify-center text-white font-bold">1</div>
          <p class="text-white font-bold text-xl tracking-wide font-sans m-0">ชื่อปริญญา ประกาศนียบัตรบัณฑิต และสาขาวิชา</p>
        </div>

        <div class="p-6 md:p-8 space-y-8">
          <!-- ❗❗❗ คอมเมนต์อ้างอิงตาม ER Diagram (image_ed9000.jpg) ❗❗❗ -->

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
            <p class="text-[#1a2744] font-bold text-lg border-b-2 border-[#c8a84b] pb-2 inline-block m-0">1. รหัสและชื่อหลักสูตร</p>
            <div class="space-y-4">
              <!-- ✅ DB: ตาราง PROGRAM (program_code) -->
              <UFormField label="รหัสหลักสูตร" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.programCode" class="w-full bg-white" placeholder="รหัสหลักสูตร" />
              </UFormField>
              <!-- ✅ DB: ตาราง PROGRAM (name_th) -->
              <UFormField label="ชื่อหลักสูตร (ภาษาไทย)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.nameTh" class="w-full bg-white" placeholder="ชื่อเต็มภาษาไทย" />
              </UFormField>
              <!-- ✅ DB: ตาราง PROGRAM (name_en) -->
              <UFormField label="Program Name (English)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.nameEn" class="w-full bg-white" placeholder="Full program name in English" />
              </UFormField>
            </div>
          </div>

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-200 shadow-sm">
            <p class="text-[#1a2744] font-bold text-lg border-b-2 border-[#c8a84b] pb-2 inline-block mb-4 m-0">2. ชื่อปริญญาและสาขาวิชา</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- ✅ DB: ตาราง PROGRAM (degree_name_th) -->
              <UFormField label="ชื่อเต็ม (ภาษาไทย)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.degreeTh" class="w-full bg-white" placeholder="เช่น วิศวกรรมศาสตรบัณฑิต (...)" />
              </UFormField>
              <!-- ✅ DB: ตาราง PROGRAM (degree_abbr_th) -->
              <UFormField label="ชื่อย่อ (ภาษาไทย)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.degreeAbbrTh" class="w-full bg-white" placeholder="เช่น วศ.บ. (...)" />
              </UFormField>
              <!-- ✅ DB: ตาราง PROGRAM (degree_name_en) -->
              <UFormField label="Full Name (English)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.degreeEn" class="w-full bg-white" placeholder="e.g. Bachelor of Engineering (...)" />
              </UFormField>
              <!-- ✅ DB: ตาราง PROGRAM (degree_abbr_en) -->
              <UFormField label="Abbreviation (English)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.degreeAbbrEn" class="w-full bg-white" placeholder="e.g. B.Eng. (...)" />
              </UFormField>
            </div>
          </div>

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-200 shadow-sm">
            <p class="text-[#1a2744] font-bold text-lg border-b-2 border-[#c8a84b] pb-2 inline-block mb-4 m-0">3. วิชาเอก</p>
            <!-- ✅ DB: ตาราง PROGRAM (major) -->
            <UFormField label="วิชาเอก (ถ้ามี)" :ui="{ label: 'text-gray-800 font-bold' }">
              <UInput v-model="form.major" class="w-full bg-white" placeholder="ระบุวิชาเอก หรือ 'ไม่มี'" />
            </UFormField>
          </div>

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
            <p class="text-[#1a2744] font-bold text-lg border-b-2 border-[#c8a84b] pb-2 inline-block mb-2 m-0">4. รูปแบบของหลักสูตร</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- ✅ DB: ตาราง PROGRAM (program_format) -->
              <UFormField label="4.1 รูปแบบ" :ui="{ label: 'text-gray-800 font-bold' }">
                <USelectMenu v-model="programFormatValue" :items="programFormatItems" class="w-full bg-white" />
              </UFormField>
              <!-- ✅ DB: ตาราง PROGRAM (duration_years) -->
              <UFormField label="ระยะเวลา (ปี)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.durationYears" class="w-full bg-white" type="number" placeholder="4" />
              </UFormField>
            </div>
            <!-- ✅ DB: ตาราง PROGRAM (program_category) *ต้องสร้างเพิ่ม -->
            <UFormField label="4.2 ประเภทหลักสูตร" :ui="{ label: 'text-gray-800 font-bold' }">
              <UInput v-model="form.programCategory" class="w-full bg-white" placeholder="เช่น หลักสูตรปริญญาตรีทางวิชาการ" />
            </UFormField>
            <!-- ✅ DB: ตาราง PROGRAM (language) -->
            <UFormField label="4.3 ภาษาที่ใช้" :ui="{ label: 'text-gray-800 font-bold' }">
              <UInput v-model="form.language" class="w-full bg-white" placeholder="เช่น ภาษาไทยและภาษาอังกฤษ" />
            </UFormField>
            <!-- ✅ DB: ตาราง PROGRAM_ADMISSION (selection_criteria หรือตารางอื่นที่เหมาะสม) -->
            <UFormField label="4.4 การรับเข้าศึกษา" :ui="{ label: 'text-gray-800 font-bold' }">
              <UInput v-model="form.admission" class="w-full bg-white" placeholder="เช่น รับนักศึกษาไทยและต่างประเทศ..." />
            </UFormField>
            <!-- ✅ DB: ตาราง PROGRAM (degree_granting) -->
            <UFormField label="4.6 การให้ปริญญาแก่ผู้สำเร็จการศึกษา" :ui="{ label: 'text-gray-800 font-bold' }">
              <USelectMenu v-model="degreeGrantValue" :items="degreeGrantItems" class="w-full bg-white" />
            </UFormField>
          </div>

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
            <p class="text-[#1a2744] font-bold text-lg border-b-2 border-[#c8a84b] pb-2 inline-block mb-2 m-0">5. สถานภาพและการอนุมัติ</p>
            <!-- ✅ DB: ตาราง PROGRAM (program_type) -->
            <UFormField label="ประเภทหลักสูตร" :ui="{ label: 'text-gray-800 font-bold' }">
              <USelectMenu v-model="programTypeValue" :items="programTypeItems" class="w-full bg-white" />
            </UFormField>
            <!-- ✅ DB: ตาราง PROGRAM (open_year) -->
            <UFormField label="เปิดสอนปีการศึกษา" :ui="{ label: 'text-gray-800 font-bold' }">
              <UInput v-model="form.openYear" class="w-full bg-white" placeholder="เช่น ภาคการศึกษาที่ 1 ปีการศึกษา 2568" />
            </UFormField>
            <!-- ✅ DB: *ต้องเพิ่มคอลัมน์ approval_details ใน PROGRAM -->
            <UFormField label="รายละเอียดการผ่านการพิจารณา" :ui="{ label: 'text-gray-800 font-bold' }">
              <UTextarea v-model="form.approvalDetails" class="w-full bg-white" :rows="4" placeholder="ระบุวาระ วันเดือนปีที่ผ่านการพิจารณา" />
            </UFormField>
          </div>

          <!-- ปุ่ม Action -->
          <div class="pt-6 border-t border-gray-200 flex justify-end gap-4 mt-8">
            <UButton color="neutral" variant="outline" class="px-6 py-3 text-base font-bold rounded-xl border-gray-300 hover:bg-gray-50 bg-white" :loading="isSavingDraft" @click="saveDraft()">
              <UIcon name="i-heroicons-document-text" class="mr-2 w-5 h-5" /> บันทึกฉบับร่าง
            </UButton>
            <UButton class="bg-[#1a2744] hover:bg-[#243360] text-white px-8 py-3 text-lg font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-1" :loading="isSavingNext" @click="saveAndNext()">
              บันทึกและถัดไป <UIcon name="i-heroicons-arrow-right" class="ml-2 w-5 h-5"/>
            </UButton>
          </div>

        </div>
      </div>
    </UForm>
  </div>
</template>