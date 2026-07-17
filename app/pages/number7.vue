<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  gradingRules: '',
  achievementVerify: '',
  graduationCriteria: ''
})
</script>

<template>
  <div class="w-full p-4 md:p-8">
    <UForm :state="form" class="w-full max-w-5xl mx-auto">
      <UCard class="card-main" :ui="{ header: 'p-0', body: 'px-6 py-8' }">
        <template #header>
          <div class="card-header-blue">
            <div class="w-8 h-8 rounded-lg bg-[#c8a84b] flex items-center justify-center text-white font-bold">7</div>
            <p class="text-heading">การประเมินผลการเรียนและเกณฑ์การสำเร็จ</p>
          </div>
        </template>

        <div class="space-y-8">
          <!-- ❗❗❗ ✅ = ไม่ใช้ AI | ❌ = ใช้ AI | ❓ = ไม่แน่ใจ ❗❗❗ -->

          <!-- กฎเกณฑ์การประเมิน -->
          <!-- ✅ ไม่ใช้ AI | 💾 DB: ❓ ไม่มีตารางเก็บข้อมูลส่วนนี้ (ต้องเพิ่มคอลัมน์ใน Program หรือสร้างตาราง Academic_Regulation) -->
          <div class="box-content">
            <p class="title-sub">ระเบียบและเกณฑ์การจบการศึกษา</p>
            <div class="space-y-5">
              <UFormField label="กฎระเบียบหรือหลักเกณฑ์ในการให้ระดับคะแนน (เกรด)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UTextarea v-model="form.gradingRules" placeholder="ระบุเกณฑ์การให้คะแนน เช่น A=90-100, B+=85-89 ฯลฯ" :rows="4" class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>

              <UFormField label="กระบวนการทวนสอบมาตรฐานผลสัมฤทธิ์ของนักศึกษา" :ui="{ label: 'text-gray-800 font-bold' }">
                <UTextarea v-model="form.achievementVerify" placeholder="ระบุกระบวนการทวนสอบผลการเรียนรู้" :rows="3" class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>

              <UFormField label="เกณฑ์การสำเร็จการศึกษาตามหลักสูตร" :ui="{ label: 'text-gray-800 font-bold' }">
                <UTextarea v-model="form.graduationCriteria" placeholder="ระบุเกณฑ์จบการศึกษา เช่น เรียนครบหน่วยกิต เกรดเฉลี่ยไม่ต่ำกว่า 2.00 ฯลฯ" :rows="4" class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>
            </div>
          </div>

          <!-- ปุ่ม Action -->
          <div class="pt-6 border-t border-gray-200 flex justify-between">
            <UButton to="/number6" variant="ghost" class="btn-back">← ย้อนกลับ</UButton>
            <UButton to="/number8" class="btn-primary">
              ถัดไป <UIcon name="i-heroicons-arrow-right" class="ml-2 w-5 h-5"/>
            </UButton>
          </div>
        </div>
      </UCard>
    </UForm>
  </div>
</template>