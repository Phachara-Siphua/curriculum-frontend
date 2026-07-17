<script setup lang="ts">
import { ref } from 'vue'

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
  <div class="w-full p-4 md:p-8">
    <UForm :state="form" class="w-full max-w-5xl mx-auto">
      <UCard class="card-main" :ui="{ header: 'p-0', body: 'px-6 py-8' }">
        <template #header>
          <div class="card-header-blue">
            <div class="w-8 h-8 rounded-lg bg-[#c8a84b] flex items-center justify-center text-white font-bold">4</div>
            <p class="text-heading">การจัดกระบวนการเรียนรู้</p>
          </div>
        </template>

        <div class="space-y-8">
          <!-- ❗❗❗ ✅ = ไม่ใช้ AI | ❌ = ใช้ AI | ❓ = ไม่แน่ใจ ❗❗❗ -->

          <!-- 1. ข้อมูลทั่วไปการศึกษา -->
          <!-- ✅ ไม่ใช้ AI | 💾 DB: ❓ ไม่แน่ใจ (ใน Schema ยังไม่มีตารางเก็บข้อมูลส่วนนี้ อาจต้องสร้างตาราง Program_Management) -->
          <div class="box-content">
            <p class="title-sub">ระบบและเวลาการศึกษา</p>
            <div class="space-y-4">
              <UFormField label="ระบบการจัดการศึกษา" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.eduSystem" placeholder="เช่น ระบบทวิภาค" class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <UFormField label="การจัดการศึกษาภาคฤดูร้อน" :ui="{ label: 'text-gray-800 font-bold' }">
                  <UTextarea v-model="form.summerEdu" placeholder="ระบุการจัดการศึกษาฤดูร้อน" :rows="2" class="w-full" :ui="{ base: 'bg-white' }" />
                </UFormField>
                <UFormField label="การเทียบเคียงหน่วยกิตในระบบทวิภาค" :ui="{ label: 'text-gray-800 font-bold' }">
                  <UTextarea v-model="form.creditTransfer" placeholder="ระบุการเทียบเคียงหน่วยกิต (ถ้ามี)" :rows="2" class="w-full" :ui="{ base: 'bg-white' }" />
                </UFormField>
              </div>
              <UFormField label="วัน-เวลาในการดำเนินการเรียนการสอน" :ui="{ label: 'text-gray-800 font-bold' }">
                <UInput v-model="form.schedule" placeholder="เช่น วันจันทร์ – ศุกร์ เวลา 08.00-17.00 น." class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>
            </div>
          </div>

          <!-- 2. ปัญหาและกลยุทธ์นักศึกษา -->
          <!-- ❌ ใช้ AI ช่วยบางส่วน (AI เสนอแนะกลยุทธ์จากปัญหา) | 💾 DB: ❓ ไม่แน่ใจ (ต้องเพิ่มคอลัมน์เก็บข้อมูล) -->
          <div class="box-content relative">
            <div class="flex justify-between items-center mb-2">
              <p class="title-sub mb-0">ปัญหาและกลยุทธ์การพัฒนานักศึกษา</p>
              <UBadge color="yellow" variant="soft" class="font-bold rounded-lg"><UIcon name="i-heroicons-sparkles" class="mr-1"/> AI Assisted</UBadge>
            </div>
            <div class="space-y-4">
              <UFormField label="ปัญหาของนักศึกษาแรกเข้า" :ui="{ label: 'text-gray-800 font-bold' }">
                <UTextarea v-model="form.freshmanIssues" placeholder="ระบุปัญหาที่พบและแนวทางแก้ไข" :rows="3" class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>
              <UFormField label="กลยุทธ์ในการดำเนินการเพื่อแก้ไขปัญหา" :ui="{ label: 'text-gray-800 font-bold' }">
                <UTextarea v-model="form.strategies" placeholder="ระบุกลยุทธ์ในการแก้ไขปัญหาข้อจำกัดของนักศึกษา" :rows="3" class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>
            </div>
          </div>

          <!-- 3. การพัฒนากระบวนการเรียนรู้ -->
          <!-- ❌ ใช้ AI ช่วยบางส่วน (AI เสนอแนะแนวทางจัด Growth Mindset) | 💾 DB: ❓ ไม่แน่ใจ -->
          <div class="box-content relative">
            <div class="flex justify-between items-center mb-2">
              <p class="title-sub mb-0">การพัฒนากระบวนการเรียนรู้</p>
              <UBadge color="yellow" variant="soft" class="font-bold rounded-lg"><UIcon name="i-heroicons-sparkles" class="mr-1"/> AI Assisted</UBadge>
            </div>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <UFormField label="ประสบการณ์ภาคสนาม / สหกิจศึกษา" :ui="{ label: 'text-gray-800 font-bold' }">
                  <UTextarea v-model="form.fieldwork" placeholder="ระบุประสบการณ์ภาคสนาม (ถ้ามี)" :rows="3" class="w-full" :ui="{ base: 'bg-white' }" />
                </UFormField>
                <UFormField label="ข้อกำหนดเกี่ยวกับการทำโครงงาน/วิจัย" :ui="{ label: 'text-gray-800 font-bold' }">
                  <UTextarea v-model="form.research" placeholder="ระบุข้อกำหนดการทำโครงงาน" :rows="3" class="w-full" :ui="{ base: 'bg-white' }" />
                </UFormField>
              </div>
              <UFormField label="กระบวนการเรียนรู้ที่กระตุ้นให้เกิด Growth Mindset" :ui="{ label: 'text-gray-800 font-bold' }">
                <UTextarea v-model="form.growthMindset" placeholder="ระบุกระบวนการจัดการเรียนรู้ที่ส่งเสริม Growth Mindset" :rows="3" class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>
              <UFormField label="การเรียนรู้ที่เชื่อมโยงกับการทำงานจริง" :ui="{ label: 'text-gray-800 font-bold' }">
                <UTextarea v-model="form.realWorldLearning" placeholder="ระบุกระบวนการจัดการเรียนรู้ที่เชื่อมโยงกับโลกของการทำงาน" :rows="3" class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>
            </div>
          </div>

          <!-- ปุ่ม Action -->
          <div class="pt-6 border-t border-gray-200 flex justify-between">
            <UButton to="/number3" variant="ghost" class="btn-back">← ย้อนกลับ</UButton>
            <UButton to="/number5" class="btn-primary">
              ถัดไป <UIcon name="i-heroicons-arrow-right" class="ml-2 w-5 h-5"/>
            </UButton>
          </div>

        </div>
      </UCard>
    </UForm>
  </div>
</template>