<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  stdGrad: '',
  stdStudent: '',
  stdFaculty: '',
  teachingQuality: '',
  learningSupport: '',
  kpis: '',
  qualityPlan: '',
  riskMgmt: '',
  complaints: '',
  dataReview: '',
  communication: ''
})
</script>

<template>
  <div class="w-full p-4 md:p-8">
    <UForm :state="form" class="w-full max-w-5xl mx-auto">
      <UCard class="card-main" :ui="{ header: 'p-0', body: 'px-6 py-8' }">
        <template #header>
          <div class="card-header-blue">
            <div class="w-8 h-8 rounded-lg bg-[#c8a84b] flex items-center justify-center text-white font-bold">8</div>
            <p class="text-heading">การประกันคุณภาพและการพัฒนาหลักสูตร</p>
          </div>
        </template>

        <div class="space-y-8">
          <!-- ❗❗❗ ✅ = ไม่ใช้ AI | ❌ = ใช้ AI | ❓ = ไม่แน่ใจ ❗❗❗ -->

          <!-- องค์ประกอบที่ 8 -->
          <!-- ✅ ไม่ใช้ AI | 💾 DB: ส่วน KPI เก็บลงตาราง Quality_KPI | ส่วนอื่นๆ ❓ ไม่มีตารางรองรับ -->
          <div class="box-content">
            <p class="title-sub">องค์ประกอบที่ 8: การประกันคุณภาพหลักสูตร</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <UFormField label="การกำกับมาตรฐาน (บัณฑิต)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UTextarea v-model="form.stdGrad" placeholder="ระบุมาตรฐานและการควบคุมคุณภาพบัณฑิต" :rows="3" class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>

              <UFormField label="การกำกับมาตรฐาน (นักศึกษา)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UTextarea v-model="form.stdStudent" placeholder="ระบุมาตรฐานและการควบคุมคุณภาพนักศึกษา" :rows="3" class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>

              <UFormField label="การกำกับมาตรฐาน (อาจารย์)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UTextarea v-model="form.stdFaculty" placeholder="ระบุมาตรฐานและการควบคุมคุณภาพอาจารย์" :rows="3" class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>

              <UFormField label="ตัวบ่งชี้ผลการดำเนินงาน (KPIs)" :ui="{ label: 'text-gray-800 font-bold' }">
                <UTextarea v-model="form.kpis" placeholder="ระบุ KPIs เช่น อัตราการสำเร็จการศึกษา อัตราการมีงานทำ ฯลฯ" :rows="3" class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>
            </div>
          </div>

          <!-- องค์ประกอบที่ 9 -->
          <!-- ✅ ไม่ใช้ AI | 💾 DB: ❓ ไม่มีตารางเก็บข้อมูลส่วนนี้ (ต้องสร้างตาราง Quality_Assurance) -->
          <div class="box-content bg-gray-50 border-gray-200">
            <p class="title-sub text-gray-700 border-gray-400">องค์ประกอบที่ 9: ระบบและกลไกในการพัฒนาหลักสูตร</p>
            <div class="space-y-5">
              <UFormField label="การวางแผนคุณภาพและการควบคุมคุณภาพ" :ui="{ label: 'text-gray-800 font-bold' }">
                <UTextarea v-model="form.qualityPlan" placeholder="ระบุแผนและการควบคุมคุณภาพหลักสูตร" :rows="2" class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>

              <UFormField label="การบริหารความเสี่ยง" :ui="{ label: 'text-gray-800 font-bold' }">
                <UTextarea v-model="form.riskMgmt" placeholder="ระบุความเสี่ยงที่อาจเกิดขึ้นและแนวทางบริหารจัดการ" :rows="2" class="w-full" :ui="{ base: 'bg-white' }" />
              </UFormField>
            </div>
          </div>

          <!-- ปุ่ม Action สุดท้าย -->
          <div class="pt-6 border-t border-gray-200 flex justify-between items-center">
            <UButton to="/number7" variant="ghost" class="btn-back">← ย้อนกลับ</UButton>
            <UButton class="bg-[#c8a84b] hover:bg-[#e8c96a] text-[#1a2744] px-8 py-3 text-lg font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-1">
              <UIcon name="i-heroicons-document-check" class="mr-2 w-6 h-6"/> สรุปและส่งออกข้อมูล
            </UButton>
          </div>
        </div>
      </UCard>
    </UForm>
  </div>
</template>