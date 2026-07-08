<script setup lang="ts">
const programTypeItems = ref(['หลักสูตรใหม่', 'หลักสูตรปรับปรุง'])
const programTypeValue = ref('หลักสูตรใหม่')

const programFormatItems = ref([
  'หลักสูตรระดับปริญญาตรี',
  'หลักสูตรระดับปริญญาโท',
  'หลักสูตรระดับปริญญาเอก'
])
const programFormatValue = ref('หลักสูตรระดับปริญญาตรี')

const degreeGrantItems = ref([
  'ให้ปริญญาเพียงสาขาวิชาเดียว',
  'ให้ปริญญาร่วมกับสถาบันอื่น'
])
const degreeGrantValue = ref('ให้ปริญญาเพียงสาขาวิชาเดียว')
</script>

<template>

  <div class="w-full p-4 md:p-6">
    <UForm class="w-full">
      <UCard
        class="w-full shadow-sm border border-gray-200 rounded-xl"
        :ui="{ root: 'bg-white', header: 'bg-blue-950 px-6 py-4', body: 'px-6 py-6' }"
      >
        <template #header>
          <p class="text-white font-semibold text-lg">
            องค์ประกอบที่ 1: ชื่อปริญญา ประกาศนียบัตรบัณฑิต และสาขาวิชา
          </p>
        </template>

        <!-- Section 1: รหัสและชื่อหลักสูตร -->
        <p class="text-blue-950 font-bold text-base mb-3 mt-2">1. รหัสและชื่อหลักสูตร</p>

        <UFormField label="รหัสหลักสูตร" :ui="{ label: 'text-black text-lg' }" class="mb-4">
          <UInput class="w-full" :ui="{ base: 'bg-gray-100' }" placeholder="รหัสหลักสูตร" />
        </UFormField>

        <UFormField label="ชื่อหลักสูตร (ภาษาไทย)" :ui="{ label: 'text-black text-lg' }" class="mb-4">
          <UInput class="w-full" :ui="{ base: 'bg-gray-100' }" placeholder="ชื่อเต็มภาษาไทย" />
        </UFormField>

        <UFormField label="Program Name (English)" :ui="{ label: 'text-black text-lg' }" class="mb-4">
          <UInput class="w-full" :ui="{ base: 'bg-gray-100' }" placeholder="Full program name in English" />
        </UFormField>

        <UDivider class="my-5" />

        <!-- Section 2: ชื่อปริญญาและสาขาวิชา -->
        <p class="text-blue-950 font-bold text-base mb-3">2. ชื่อปริญญาและสาขาวิชา</p>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <UFormField label="ชื่อเต็ม (ภาษาไทย)" :ui="{ label: 'text-black text-lg' }">
            <UInput class="w-full" :ui="{ base: 'bg-gray-100' }" placeholder="เช่น วิศวกรรมศาสตรบัณฑิต (...)" />
          </UFormField>
          <UFormField label="ชื่อย่อ (ภาษาไทย)" :ui="{ label: 'text-black text-lg' }">
            <UInput class="w-full" :ui="{ base: 'bg-gray-100' }" placeholder="เช่น วศ.บ. (...)" />
          </UFormField>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <UFormField label="Full Name (English)" :ui="{ label: 'text-black text-lg' }">
            <UInput class="w-full" :ui="{ base: 'bg-gray-100' }" placeholder="e.g. Bachelor of Engineering (...)" />
          </UFormField>
          <UFormField label="Abbreviation (English)" :ui="{ label: 'text-black text-lg' }">
            <UInput class="w-full" :ui="{ base: 'bg-gray-100' }" placeholder="e.g. B.Eng. (...)" />
          </UFormField>
        </div>

        <UDivider class="my-5" />

        <!-- Section 3: วิชาเอก -->
        <p class="text-blue-950 font-bold text-base mb-3">3. วิชาเอก</p>

        <UFormField label="วิชาเอก (ถ้ามี)" :ui="{ label: 'text-black text-lg' }" class="mb-4">
          <UInput class="w-full" :ui="{ base: 'bg-gray-100' }" placeholder="ระบุวิชาเอก หรือ 'ไม่มี'" />
        </UFormField>

        <UDivider class="my-5" />

        <!-- Section 4: รูปแบบของหลักสูตร -->
        <p class="text-blue-950 font-bold text-base mb-3">4. รูปแบบของหลักสูตร</p>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <UFormField label="4.1 รูปแบบ" :ui="{ label: 'text-black text-lg' }">
            <UInputMenu v-model="programFormatValue" :items="programFormatItems" class="w-full" />
          </UFormField>
          <UFormField label="ระยะเวลา (ปี)" :ui="{ label: 'text-black text-lg' }">
            <UInput class="w-full" :ui="{ base: 'bg-gray-100' }" type="number" placeholder="4" />
          </UFormField>
        </div>

        <UFormField label="4.2 ประเภทหลักสูตร" :ui="{ label: 'text-black text-lg' }" class="mb-4">
          <UInput class="w-full" :ui="{ base: 'bg-gray-100' }" placeholder="เช่น หลักสูตรปริญญาตรีทางวิชาการ" />
        </UFormField>

        <UFormField label="4.3 ภาษาที่ใช้" :ui="{ label: 'text-black text-lg' }" class="mb-4">
          <UInput class="w-full" :ui="{ base: 'bg-gray-100' }" placeholder="เช่น ภาษาไทยและภาษาอังกฤษ" />
        </UFormField>

        <UFormField label="4.4 การรับเข้าศึกษา" :ui="{ label: 'text-black text-lg' }" class="mb-4">
          <UInput class="w-full" :ui="{ base: 'bg-gray-100' }" placeholder="เช่น รับนักศึกษาไทยและนักศึกษาต่างประเทศที่ใช้ภาษาไทยได้" />
        </UFormField>

        <UFormField label="4.5 ความร่วมมือกับสถาบันอื่น" :ui="{ label: 'text-black text-lg' }" class="mb-4">
          <UInput class="w-full" :ui="{ base: 'bg-gray-100' }" placeholder="เช่น ไม่มี หรือ ระบุสถาบันที่ร่วมมือ" />
        </UFormField>

        <UFormField label="4.6 การให้ปริญญาแก่ผู้สำเร็จการศึกษา" :ui="{ label: 'text-black text-lg' }" class="mb-4">
          <UInputMenu v-model="degreeGrantValue" :items="degreeGrantItems" class="w-full" />
        </UFormField>

        <UDivider class="my-5" />

        <!-- Section 5: สถานภาพของหลักสูตร -->
        <p class="text-blue-950 font-bold text-base mb-3">5. สถานภาพของหลักสูตรและการพิจารณาอนุมัติ</p>

        <UFormField label="ประเภทหลักสูตร" :ui="{ label: 'text-black text-lg' }" class="mb-4">
          <UInputMenu v-model="programTypeValue" :items="programTypeItems" class="w-full" />
        </UFormField>

        <UFormField label="เปิดสอนปีการศึกษา" :ui="{ label: 'text-black text-lg' }" class="mb-4">
          <UInput class="w-full" :ui="{ base: 'bg-gray-100' }" placeholder="เช่น ภาคการศึกษาที่ 1 ปีการศึกษา 2568" />
        </UFormField>

        <UFormField label="รายละเอียดการผ่านการพิจารณา" :ui="{ label: 'text-black text-lg' }" class="mb-4">
          <UTextarea
            class="w-full"
            :ui="{ base: 'bg-gray-100' }"
            :rows="5"
            placeholder="ระบุการประชุม วาระ วันเดือนปีที่ผ่านการพิจารณาจากคณะกรรมการต่างๆ"
          />
        </UFormField>

        <UButton class="bg-blue-950 text-white mt-4">ถัดไป</UButton>
      </UCard>
    </UForm>
  </div>
</template>