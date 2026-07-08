<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  gradingRules: '',
  achievementVerify: '',
  graduationCriteria: ''
})
</script>

<template>
  <UForm :state="form" class="p-4 md:p-8">
    <UCard class="w-full shadow-md" :ui="{ root: 'bg-white', header: 'bg-blue-950 p-4' }">
      <template #header>
        <p class="text-white font-semibold text-lg">
          องค์ประกอบที่ 7: การประเมินผลการเรียนและเกณฑ์การสำเร็จ
        </p>
      </template>

      <div class="space-y-6">
        <UFormField label="กฎระเบียบหรือหลักเกณฑ์ในการให้ระดับคะแนน (เกรด)" :ui="{ label: 'text-blue-950 font-bold text-base' }">
          <UTextarea v-model="form.gradingRules" placeholder="ระบุเกณฑ์การให้คะแนน เช่น A=90-100, B+=85-89 ฯลฯ" :rows="4" class="w-full bg-gray-50" />
        </UFormField>

        <UFormField label="กระบวนการทวนสอบมาตรฐานผลสัมฤทธิ์ของนักศึกษา" :ui="{ label: 'text-blue-950 font-bold text-base' }">
          <UTextarea v-model="form.achievementVerify" placeholder="ระบุกระบวนการทวนสอบผลการเรียนรู้" :rows="3" class="w-full bg-gray-50" />
        </UFormField>

        <UFormField label="เกณฑ์การสำเร็จการศึกษาตามหลักสูตร" :ui="{ label: 'text-blue-950 font-bold text-base' }">
          <UTextarea v-model="form.graduationCriteria" placeholder="ระบุเกณฑ์จบการศึกษา เช่น เรียนครบหน่วยกิต เกรดเฉลี่ยไม่ต่ำกว่า 2.00 ฯลฯ" :rows="4" class="w-full bg-gray-50" />
        </UFormField>

        <div class="mt-8 flex">
          <UButton to="/number8" class="bg-blue-950 text-white px-6 py-2 text-base font-medium">ถัดไป</UButton>
        </div>
      </div>
    </UCard>
  </UForm>
</template>