<script setup lang="ts">
import { ref } from 'vue'
const router = useRouter()

const form = ref({
  programCode: '', nameTh: '', nameEn: '', degreeTh: '', degreeAbbrTh: '', degreeEn: '', degreeAbbrEn: '',
  major: '', durationYears: null, programCategory: '', language: '', admission: '', cooperation: '', openYear: '', approvalDetails: ''
})

const programTypeItems = ['หลักสูตรใหม่', 'หลักสูตรปรับปรุง']
const programTypeValue = ref('หลักสูตรใหม่')
const programFormatItems = ['หลักสูตรระดับปริญญาตรี', 'หลักสูตรระดับปริญญาโท', 'หลักสูตรระดับปริญญาเอก']
const programFormatValue = ref('หลักสูตรระดับปริญญาตรี')
const degreeGrantItems = ['ให้ปริญญาเพียงสาขาวิชาเดียว', 'ให้ปริญญาร่วมกับสถาบันอื่น']
const degreeGrantValue = ref('ให้ปริญญาเพียงสาขาวิชาเดียว')

// ================= ระบบบันทึกข้อมูล (Save System) =================
const isSavingDraft = ref(false)
const isSavingNext = ref(false)

const saveDraft = async () => {
  isSavingDraft.value = true
  // 💾 DB: ให้ Backend ยิง API บันทึกข้อมูลหน้า 1 ลงตาราง Program โดยตั้ง status = 'draft'
  await new Promise(r => setTimeout(r, 1000))
  isSavingDraft.value = false
  alert('บันทึกฉบับร่างเรียบร้อยแล้ว')
}

const saveAndNext = async () => {
  isSavingNext.value = true
  // 💾 DB: ให้ Backend ยิง API บันทึกข้อมูลหน้า 1 
  await new Promise(r => setTimeout(r, 1000))
  isSavingNext.value = false
  router.push('/number2') // เปลี่ยนไปหน้า 2
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
          <!-- ❗❗❗ ✅= ไม่ใช้ AI | ❌= ใช้ AI | ❓= ไม่แน่ใจ ❗❗❗ -->

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
            <p class="text-[#1a2744] font-bold text-lg border-b-2 border-[#c8a84b] pb-2 inline-block m-0">1. รหัสและชื่อหลักสูตร</p>
            <div class="space-y-4">
              <!-- ✅ ไม่ใช้ AI | 💾 DB: ตาราง Program (คอลัมน์ program_code) -->
              <UFormField label="รหัสหลักสูตร" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.programCode" class="w-full bg-white" placeholder="รหัสหลักสูตร" />
              </UFormField>

              <!-- ✅ ไม่ใช้ AI | 💾 DB: ตาราง Program (คอลัมน์ name_th) -->
              <UFormField label="ชื่อหลักสูตร (ภาษาไทย)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.nameTh" class="w-full bg-white" placeholder="ชื่อเต็มภาษาไทย" />
              </UFormField>

              <!-- ✅ ไม่ใช้ AI | 💾 DB: ตาราง Program (คอลัมน์ name_en) -->
              <UFormField label="Program Name (English)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.nameEn" class="w-full bg-white" placeholder="Full program name in English" />
              </UFormField>
            </div>
          </div>

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-200 shadow-sm">
            <p class="text-[#1a2744] font-bold text-lg border-b-2 border-[#c8a84b] pb-2 inline-block mb-4 m-0">2. ชื่อปริญญาและสาขาวิชา</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- ✅ ไม่ใช้ AI | 💾 DB: ตาราง Program (คอลัมน์ degree_name_th) -->
              <UFormField label="ชื่อเต็ม (ภาษาไทย)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.degreeTh" class="w-full bg-white" placeholder="เช่น วิศวกรรมศาสตรบัณฑิต (...)" />
              </UFormField>

              <!-- ✅ ไม่ใช้ AI | 💾 DB: ❓ เพิ่มคอลัมน์ degree_abbr_th ในตาราง Program -->
              <UFormField label="ชื่อย่อ (ภาษาไทย)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.degreeAbbrTh" class="w-full bg-white" placeholder="เช่น วศ.บ. (...)" />
              </UFormField>

              <!-- ✅ ไม่ใช้ AI | 💾 DB: ตาราง Program (คอลัมน์ degree_name_en) -->
              <UFormField label="Full Name (English)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.degreeEn" class="w-full bg-white" placeholder="e.g. Bachelor of Engineering (...)" />
              </UFormField>

              <!-- ✅ ไม่ใช้ AI | 💾 DB: ❓ เพิ่มคอลัมน์ degree_abbr_en ในตาราง Program -->
              <UFormField label="Abbreviation (English)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.degreeAbbrEn" class="w-full bg-white" placeholder="e.g. B.Eng. (...)" />
              </UFormField>
            </div>
          </div>

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-200 shadow-sm">
            <p class="text-[#1a2744] font-bold text-lg border-b-2 border-[#c8a84b] pb-2 inline-block mb-4 m-0">3. วิชาเอก</p>
            <!-- ✅ ไม่ใช้ AI | 💾 DB: ❓ เพิ่มคอลัมน์ major ในตาราง Program -->
            <UFormField label="วิชาเอก (ถ้ามี)" :ui="{ label: 'text-gray-800 font-bold' }">
              <UInput v-model="form.major" class="w-full bg-white" placeholder="ระบุวิชาเอก หรือ 'ไม่มี'" />
            </UFormField>
          </div>

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
            <p class="text-[#1a2744] font-bold text-lg border-b-2 border-[#c8a84b] pb-2 inline-block mb-2 m-0">4. รูปแบบของหลักสูตร</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- ✅ ไม่ใช้ AI | 💾 DB: ❓ เพิ่มคอลัมน์ program_format ในตาราง Program -->
              <UFormField label="4.1 รูปแบบ" :ui="{ label: 'text-gray-800 font-bold' }">
                <USelectMenu v-model="programFormatValue" :items="programFormatItems" class="w-full bg-white" />
              </UFormField>

              <!-- ✅ ไม่ใช้ AI | 💾 DB: ตาราง Program (คอลัมน์ duration_years) -->
              <UFormField label="ระยะเวลา (ปี)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.durationYears" class="w-full bg-white" type="number" placeholder="4" />
              </UFormField>
            </div>

            <!-- ✅ ไม่ใช้ AI | 💾 DB: ❓ เพิ่มคอลัมน์ program_category ในตาราง Program -->
            <UFormField label="4.2 ประเภทหลักสูตร" :ui="{ label: 'text-gray-800 font-bold' }">
              <UInput v-model="form.programCategory" class="w-full bg-white" placeholder="เช่น หลักสูตรปริญญาตรีทางวิชาการ" />
            </UFormField>

            <!-- ✅ ไม่ใช้ AI | 💾 DB: ❓ เพิ่มคอลัมน์ language ในตาราง Program -->
            <UFormField label="4.3 ภาษาที่ใช้" :ui="{ label: 'text-gray-800 font-bold' }">
              <UInput v-model="form.language" class="w-full bg-white" placeholder="เช่น ภาษาไทยและภาษาอังกฤษ" />
            </UFormField>

            <!-- ✅ ไม่ใช้ AI | 💾 DB: ❓ เพิ่มคอลัมน์ admission_req ในตาราง Program -->
            <UFormField label="4.4 การรับเข้าศึกษา" :ui="{ label: 'text-gray-800 font-bold' }">
              <UInput v-model="form.admission" class="w-full bg-white" placeholder="เช่น รับนักศึกษาไทยและต่างประเทศ..." />
            </UFormField>

            <!-- ✅ ไม่ใช้ AI | 💾 DB: ❓ เพิ่มคอลัมน์ degree_granting ในตาราง Program -->
            <UFormField label="4.6 การให้ปริญญาแก่ผู้สำเร็จการศึกษา" :ui="{ label: 'text-gray-800 font-bold' }">
              <USelectMenu v-model="degreeGrantValue" :items="degreeGrantItems" class="w-full bg-white" />
            </UFormField>
          </div>

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-200 space-y-4 shadow-sm">
            <p class="text-[#1a2744] font-bold text-lg border-b-2 border-[#c8a84b] pb-2 inline-block mb-2 m-0">5. สถานภาพและการอนุมัติ</p>
            
            <!-- ✅ ไม่ใช้ AI | 💾 DB: ตาราง Program (คอลัมน์ status) -->
            <UFormField label="ประเภทหลักสูตร" :ui="{ label: 'text-gray-800 font-bold' }">
              <USelectMenu v-model="programTypeValue" :items="programTypeItems" class="w-full bg-white" />
            </UFormField>

            <!-- ✅ ไม่ใช้ AI | 💾 DB: ❓ เพิ่มคอลัมน์ open_year ในตาราง Program -->
            <UFormField label="เปิดสอนปีการศึกษา" :ui="{ label: 'text-gray-800 font-bold' }">
              <UInput v-model="form.openYear" class="w-full bg-white" placeholder="เช่น ภาคการศึกษาที่ 1 ปีการศึกษา 2568" />
            </UFormField>

            <!-- ✅ ไม่ใช้ AI | 💾 DB: ตาราง Program (คอลัมน์ Approved_date หรือ แยกตาราง Approval_History) -->
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