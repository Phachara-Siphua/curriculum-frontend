<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  qualifications: '',
  selectionCriteria: '',
  otherConditions: ''
})
</script>

<template>
  <div class="w-full p-4 md:p-8">
    <UForm :state="form" class="w-full max-w-5xl mx-auto">
      <UCard class="card-main" :ui="{ header: 'p-0', body: 'px-6 py-8' }">
        <template #header>
          <div class="card-header-blue">
            <div class="w-8 h-8 rounded-lg bg-[#c8a84b] flex items-center justify-center text-white font-bold">6</div>
            <p class="text-heading">คุณสมบัติของผู้เข้าศึกษา</p>
          </div>
        </template>

        <div class="space-y-8">
          <!-- ❗❗❗ ✅ = ไม่ใช้ AI | ❌ = ใช้ AI | ❓ = ไม่แน่ใจ ❗❗❗ -->

          <!-- ข้อมูลคุณสมบัติ -->
          <!-- ✅ ไม่ใช้ AI | 💾 DB: ❓ ใน Schema มีแต่ Student_intake (จำนวนรับ) แต่ไม่มีที่เก็บ Text คุณสมบัติ (ต้องเพิ่มคอลัมน์ใน Program หรือสร้างตาราง Admission_Criteria) -->
          <div class="box-content">
            <p class="title-sub">เกณฑ์การรับสมัคร</p>
            <div class="space-y-5">
              <UFormField label="คุณสมบัติของผู้เข้าศึกษา *" :ui="{ label: 'text-gray-800 font-bold' }">
                <UTextarea v-model="form.qualifications" placeholder="ระบุคุณสมบัติขั้นต่ำของผู้สมัคร เช่น วุฒิการศึกษา ผลการเรียน ฯลฯ" :rows="4" class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>

              <UFormField label="หลักเกณฑ์การคัดเลือกผู้เข้าศึกษา" :ui="{ label: 'text-gray-800 font-bold' }">
                <UTextarea v-model="form.selectionCriteria" placeholder="ระบุวิธีการคัดเลือก เช่น การสอบ สัมภาษณ์ ฯลฯ" :rows="3" class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>

              <UFormField label="เงื่อนไขและข้อกำหนดอื่นๆ" :ui="{ label: 'text-gray-800 font-bold' }">
                <UTextarea v-model="form.otherConditions" placeholder="ระบุเงื่อนไขพิเศษ (ถ้ามี)" :rows="3" class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>
            </div>
          </div>

          <!-- ปุ่ม Action -->
          <div class="pt-6 border-t border-gray-200 flex justify-between">
            <UButton to="/number5" variant="ghost" class="btn-back">← ย้อนกลับ</UButton>
            <UButton to="/number7" class="btn-primary">
              ถัดไป <UIcon name="i-heroicons-arrow-right" class="ml-2 w-5 h-5"/>
            </UButton>
          </div>
        </div>
      </UCard>
    </UForm>
  </div>
</template>