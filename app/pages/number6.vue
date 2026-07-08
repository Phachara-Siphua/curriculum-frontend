<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  qualifications: '',
  selectionCriteria: '',
  otherConditions: ''
})
</script>

<template>
  <UForm :state="form" class="p-4 md:p-8">
    <UCard class="w-full shadow-md" :ui="{ root: 'bg-white', header: 'bg-blue-950 p-4' }">
      <template #header>
        <p class="text-white font-semibold text-lg">
          องค์ประกอบที่ 6: คุณสมบัติของผู้เข้าศึกษา
        </p>
      </template>

      <div class="space-y-6">
        <UFormField label="คุณสมบัติของผู้เข้าศึกษา *" :ui="{ label: 'text-blue-950 font-bold text-base' }">
          <UTextarea v-model="form.qualifications" placeholder="ระบุคุณสมบัติขั้นต่ำของผู้สมัคร เช่น วุฒิการศึกษา ผลการเรียน ฯลฯ" :rows="4" class="w-full bg-gray-50" />
        </UFormField>

        <UFormField label="หลักเกณฑ์การคัดเลือกผู้เข้าศึกษา" :ui="{ label: 'text-blue-950 font-bold text-base' }">
          <UTextarea v-model="form.selectionCriteria" placeholder="ระบุวิธีการคัดเลือก เช่น การสอบ สัมภาษณ์ ฯลฯ" :rows="3" class="w-full bg-gray-50" />
        </UFormField>

        <UFormField label="เงื่อนไขและข้อกำหนดอื่นๆ" :ui="{ label: 'text-blue-950 font-bold text-base' }">
          <UTextarea v-model="form.otherConditions" placeholder="ระบุเงื่อนไขพิเศษ (ถ้ามี)" :rows="3" class="w-full bg-gray-50" />
        </UFormField>

        <div class="mt-8 flex">
          <UButton to="/number7" class="bg-blue-950 text-white px-6 py-2 text-base font-medium">ถัดไป</UButton>
        </div>
      </div>
    </UCard>
  </UForm>
</template>