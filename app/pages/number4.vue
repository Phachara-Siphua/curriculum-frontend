<!-- pages/number4.vue -->
<script setup lang="ts">
const form = ref({
  eduSystem: '',
  summerEdu: '',
  creditTransfer: '',
  schedule: '',
  freshmanIssues: '',
  strategies: '',
  fieldwork: '',
  research: '',
  growthMindset: '',
  realWorldLearning: ''
})
</script>

<template>
  <UForm :state="form">
    <UCard :ui="{ root: 'bg-white shadow-md', header: 'bg-blue-950 p-4' }">
      <template #header>
        <p class="text-white font-semibold text-lg">
          องค์ประกอบที่ 4: การจัดกระบวนการเรียนรู้
        </p>
      </template>

      <div class="space-y-6">
        <UFormField label="ระบบการจัดการศึกษา" :ui="{ label: 'text-blue-950 font-bold text-base' }">
          <UInput v-model="form.eduSystem" placeholder="เช่น ระบบทวิภาค" class="w-full bg-gray-50" />
        </UFormField>

        <UFormField label="การจัดการศึกษาภาคฤดูร้อน" :ui="{ label: 'text-blue-950 font-bold text-base' }">
          <UTextarea v-model="form.summerEdu" placeholder="ระบุการจัดการศึกษาฤดูร้อน" :rows="2" class="w-full bg-gray-50" />
        </UFormField>

        <UFormField label="การเทียบเคียงหน่วยกิตในระบบทวิภาค" :ui="{ label: 'text-blue-950 font-bold text-base' }">
          <UTextarea v-model="form.creditTransfer" placeholder="ระบุการเทียบเคียงหน่วยกิต (ถ้ามี)" :rows="2" class="w-full bg-gray-50" />
        </UFormField>

        <UFormField label="วัน-เวลาในการดำเนินการเรียนการสอน" :ui="{ label: 'text-blue-950 font-bold text-base' }">
          <UInput v-model="form.schedule" placeholder="เช่น วันจันทร์ – ศุกร์ เวลา 08.00-17.00 น." class="w-full bg-gray-50" />
        </UFormField>

        <UFormField label="ปัญหาของนักศึกษาแรกเข้า" :ui="{ label: 'text-blue-950 font-bold text-base' }">
          <UTextarea v-model="form.freshmanIssues" placeholder="ระบุปัญหาที่พบและแนวทางแก้ไข" :rows="3" class="w-full bg-gray-50" />
        </UFormField>

        <UFormField label="กลยุทธ์ในการดำเนินการเพื่อแก้ไขปัญหา" :ui="{ label: 'text-blue-950 font-bold text-base' }">
          <UTextarea v-model="form.strategies" placeholder="ระบุกลยุทธ์ในการแก้ไขปัญหาข้อจำกัดของนักศึกษา" :rows="3" class="w-full bg-gray-50" />
        </UFormField>

        <UFormField label="องค์ประกอบเกี่ยวกับประสบการณ์ภาคสนาม" :ui="{ label: 'text-blue-950 font-bold text-base' }">
          <UTextarea v-model="form.fieldwork" placeholder="ระบุประสบการณ์ภาคสนาม/สหกิจศึกษา (ถ้ามี)" :rows="2" class="w-full bg-gray-50" />
        </UFormField>

        <UFormField label="ข้อกำหนดเกี่ยวกับการทำโครงงานวิจัย" :ui="{ label: 'text-blue-950 font-bold text-base' }">
          <UTextarea v-model="form.research" placeholder="ระบุข้อกำหนดการทำโครงงาน/วิทยานิพนธ์/วิจัย" :rows="2" class="w-full bg-gray-50" />
        </UFormField>

        <UFormField label="การจัดกระบวนการเรียนรู้ที่กระตุ้นให้ผู้เรียนเกิด Growth Mindset" :ui="{ label: 'text-blue-950 font-bold text-base' }">
          <UTextarea v-model="form.growthMindset" placeholder="ระบุกระบวนการจัดการเรียนรู้ที่ส่งเสริม Growth Mindset" :rows="3" class="w-full bg-gray-50" />
        </UFormField>

        <UFormField label="การจัดการเรียนรู้ที่เชื่อมโยงกับการทำงานจริง" :ui="{ label: 'text-blue-950 font-bold text-base' }">
          <UTextarea v-model="form.realWorldLearning" placeholder="ระบุกระบวนการจัดการเรียนรู้ที่เชื่อมโยงกับโลกของการทำงาน" :rows="3" class="w-full bg-gray-50" />
        </UFormField>
      </div>

      <template #footer>
        <div class="flex justify-between items-center mt-4">
          <UButton class="bg-blue-950 text-white mt-4">ถัดไป</UButton>
        </div>
      </template>
    </UCard>
  </UForm>
</template>