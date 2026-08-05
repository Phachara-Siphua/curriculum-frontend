<!-- pages/number3.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const programId = ref<string | null>(null)

// รายชื่อหัวข้อทั้ง 43 หัวข้อ
const sectionTitles = [
  "ระบบ", "การจัดการศึกษาภาคฤดูร้อน", "การเทียบเคียงหน่วยกิตในระบบทวิภาค", "วัน-เวลาในการดำเนินการเรียนการสอน", "คุณสมบัติของผู้เข้าศึกษา",
  "ปัญหาของนักศึกษาแรกเข้า", "กลยุทธ์ในการดำเนินการเพื่อแก้ไขปัญหาของนักศึกษาแรกเข้า", "แผนการรับนักศึกษาและผู้สำเร็จการศึกษาในระยะ 5 ปี", "งบประมาณรายรับ", "งบประมาณรายจ่าย",
  "ระบบการศึกษา", "การเทียบโอนหน่วยกิต รายวิชาและการลงทะเบียนเรียนข้ามมหาวิทยาลัย", "โครงสร้างหลักสูตร", "รายวิชา — หมวดวิชาศึกษาทั่วไป ก. กลุ่มวิชาภาษา", "รายวิชา — หมวดวิชาศึกษาทั่วไป ข. กลุ่มวิชาบูรณาการ",
  "รายวิชา — หมวดวิชาศึกษาทั่วไป ค. กลุ่มวิชาสังคมศาสตร์และมนุษยศาสตร์", "รายวิชา — หมวดวิชาศึกษาทั่วไป ง. กลุ่มวิชาวิทยาศาสตร์และคณิตศาสตร์", "รายวิชา — หมวดวิชาศึกษาทั่วไป จ. กลุ่มวิชากีฬาและนันทนาการ", "รายวิชา — หมวดวิชาเฉพาะ ก. กลุ่มวิชาแกน", "รายวิชา — กลุ่มวิชาชีพ (บังคับเฉพาะแขนง) แขนงวิชาโทรคมนาคม",
  "รายวิชา — กลุ่มวิชาชีพ (บังคับเฉพาะแขนง) แขนงวิชาคอมพิวเตอร์", "รายวิชา — กลุ่มวิชาชีพ (บังคับเฉพาะแขนง) แขนงวิชาเครื่องมือวัดและควบคุม", "รายวิชา — กลุ่มวิชาชีพ (บังคับเฉพาะแขนง) แขนงวิชาการกระจายเสียงวิทยุและโทรทัศน์", "รายวิชา — กลุ่มวิชาชีพ (เลือกเฉพาะแขนง) ทั้ง 4 แขนงวิชา", "รายวิชา — ค. ประสบการณ์ภาคสนามและวิชาชีพ / ง. กลุ่มวิชาฝึกงาน",
  "รายวิชา — หมวดวิชาเลือกเสรี", "แผนการศึกษา — แขนงวิชาโทรคมนาคม", "แผนการศึกษา — แขนงวิชาคอมพิวเตอร์", "แผนการศึกษา — แขนงวิชาเครื่องมือวัดและควบคุม", "แผนการศึกษา — แขนงวิชาการกระจายเสียงวิทยุและโทรทัศน์",
  "คำอธิบายรายวิชา", "อาจารย์ผู้สอน", "องค์ประกอบเกี่ยวกับประสบการณ์ภาคสนาม", "มาตรฐานผลการเรียนรู้ของประสบการณ์ภาคสนาม", "ช่วงเวลา (ประสบการณ์ภาคสนาม)",
  "การจัดเวลาและตารางสอน (ประสบการณ์ภาคสนาม)", "ข้อกำหนดเกี่ยวกับการทำโครงงานหรืองานวิจัย", "คำอธิบายโดยย่อ (โครงงานหรืองานวิจัย)", "มาตรฐานผลการเรียนรู้ (โครงงานหรืองานวิจัย)", "ช่วงเวลา (โครงงานหรืองานวิจัย)",
  "จำนวนหน่วยกิต (โครงงานหรืองานวิจัย)", "การเตรียมการ (โครงงานหรืองานวิจัย)", "กระบวนการประเมินผล (โครงงานหรืองานวิจัย)"
]

// ================= State ข้อมูลฟอร์ม =================
const form = ref<any>({
  id: null,
  sections: Array(43).fill(''),
  s3_4: { sem1: '', sem2: '', summer: '' },
  s3_5: [''], s3_6: [''], s3_7: [''], s3_34: [''], s3_35: [''], s3_36: [''],
  s3_8: [{ year: 'ชั้นปีที่ 1', y65: '120', y66: '120', y67: '120', y68: '120', y69: '120' }],
  s3_9: [{ detail: 'งบประมาณรายได้', y65: '4,032,000', y66: '4,112,640', y67: '4,194,893', y68: '4,278,790', y69: '4,364,367' }],
  s3_10: [{ category: 'ก. งบดำเนินการ', y65: '', y66: '', y67: '', y68: '', y69: '' }],
  s3_13: [{ group: '1) หมวดวิชาศึกษาทั่วไป', credits: '30' }],
  subjects: Array(12).fill(null).map(() => [{ code: '', credit: '', nameTh: '', nameEn: '', note: '' }]),
  s3_27: [{ sem: 'ปีที่ 1 / ภาค 1', code: '', name: '', credit: '' }],
  s3_28: [{ sem: 'ปีที่ 1 / ภาค 1', code: '', name: '', credit: '' }],
  s3_29: [{ sem: 'ปีที่ 1 / ภาค 1', code: '', name: '', credit: '' }],
  s3_30: [{ sem: 'ปีที่ 1 / ภาค 1', code: '', name: '', credit: '' }],
  s3_31: [{ code: '', credit: '', nameTh: '', nameEn: '', prereq: '', descTh: '', descEn: '' }],
  s3_32: [{ name: '', position: '', degree: '', research: '', loadNow: '', loadNew: '' }]
})

// ================= AI Integration =================
const handleAIGenerate = (section: string, payload?: any) => {
  // TODO: สำหรับ Backend นำไปต่อ API สร้างเนื้อหาด้วย AI
  console.log('Trigger AI Generation for:', section, payload)
  alert(`กำลังเรียกใช้ AI สำหรับหมวด: ${section}\nข้อมูลอ้างอิง: ${payload || 'ไม่มี'}\n(รอ Backend เชื่อมต่อ API)`)
}

// ================= Helper Functions =================
const addList = (key: string) => { form.value[key].push('') }
const removeList = (key: string, idx: number) => { form.value[key].splice(idx, 1); if (form.value[key].length === 0) form.value[key].push('') }

const addTable = (key: string, emptyObj: any) => { form.value[key].push(emptyObj) }
const removeTable = (key: string, idx: number, emptyObj: any) => { form.value[key].splice(idx,1); if(form.value[key].length === 0) form.value[key].push(emptyObj) }

const addSubject = (idx: number) => { form.value.subjects[idx].push({ code: '', credit: '', nameTh: '', nameEn: '', note: '' }) }
const removeSubject = (idx: number, itemIdx: number) => { form.value.subjects[idx].splice(itemIdx, 1); if(form.value.subjects[idx].length === 0) form.value.subjects[idx].push({ code: '', credit: '', nameTh: '', nameEn: '', note: '' }) }

const addS3_31 = () => { form.value.s3_31.push({ code: '', credit: '', nameTh: '', nameEn: '', prereq: '', descTh: '', descEn: '' }) }
const removeS3_31 = (idx: number) => { form.value.s3_31.splice(idx, 1); if(form.value.s3_31.length === 0) form.value.s3_31.push({ code: '', credit: '', nameTh: '', nameEn: '', prereq: '', descTh: '', descEn: '' }) }

const addS3_32 = () => { form.value.s3_32.push({ name: '', position: '', degree: '', research: '', loadNow: '', loadNew: '' }) }
const removeS3_32 = (idx: number) => { form.value.s3_32.splice(idx, 1); if(form.value.s3_32.length === 0) form.value.s3_32.push({ name: '', position: '', degree: '', research: '', loadNow: '', loadNew: '' }) }

const doneState = ref<Record<number, boolean>>({})
const toggleDone = (index: number) => { doneState.value[index] = !doneState.value[index] }

onMounted(() => { if (route.query.id) { programId.value = route.query.id as string; form.value.id = route.query.id as string } })

const isSavingDraft = ref(false); const isSavingNext = ref(false)
const saveDraft = async () => { isSavingDraft.value = true; await new Promise(r => setTimeout(r, 1000)); isSavingDraft.value = false; }
const saveAndNext = async () => { isSavingNext.value = true; await new Promise(r => setTimeout(r, 1000)); isSavingNext.value = false; router.push({ path: '/number4', query: { id: programId.value } }) }

const scrollToSec = (id: string) => {
  const el = document.getElementById(id)
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.classList.add('pulse'); setTimeout(() => el.classList.remove('pulse'), 1200) }
}
</script>

<template>
  <div class="page-shell">
    <form @submit.prevent class="w-full">
      
      <!-- Breadcrumb & Title -->
      <div class="crumb">
        <span>เล่มหลักสูตร</span> › <b class="text-[#1B2A4A] font-semibold">หมวดที่ 3</b>
        <span class="page-badge">หน้า 4 / 9</span>
      </div>
      <div class="doc-head">
        <div class="doc-eyebrow">หมวดที่ 3</div>
        <h1 class="doc-title">ระบบการจัดการศึกษา การดำเนินการ และโครงสร้างของหลักสูตร</h1>
      </div>

      <!-- TOC Card -->
      <div class="toc-card">
        <div class="toc-label">หัวข้อในหน้านี้ — คลิกเพื่อกระโดดไปยังหัวข้อ (รวม 43 หัวข้อ)</div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[4px_18px] max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
          <div v-for="(title, i) in sectionTitles" :key="i" class="toc-item" :class="{ 'filled': doneState[i] }" @click="scrollToSec(`sec-3-${i+1}`)">
            <div class="toc-dot"></div>
            <span class="toc-num">3.{{ i + 1 }}</span>
            <span class="lbl">{{ title }}</span>
          </div>
        </div>
      </div>

      <!-- Main Paper Card -->
      <div class="paper-card">
        
        <section v-for="(title, i) in sectionTitles" :key="i" :id="`sec-3-${i+1}`" :class="['topic-sec', i===30 ? 'border-l-4 border-l-[#A8793B] pl-[20px] -ml-[24px] bg-[#FDFBF4]' : '']">
          
          <div class="sec-head">
            <div class="sec-number">3.{{ i + 1 }}</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">{{ title }}</h2>
                <span v-if="i===30" class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState[i] }" @click="toggleDone(i)">
                {{ doneState[i] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}
              </button>
            </div>
          </div>

          <div :class="['sec-body', i===30 ? 'md:pl-[56px] mt-4 md:mt-0' : '']">
            
            <!-- 3.4 วัน-เวลา -->
            <template v-if="i === 3">
              <div class="fs-grid">
                <div class="fs-field"><label>ภาคการศึกษาที่ 1</label><input v-model="form.s3_4.sem1" type="text" /></div>
                <div class="fs-field"><label>ภาคการศึกษาที่ 2</label><input v-model="form.s3_4.sem2" type="text" /></div>
                <div class="fs-field"><label>ภาคการศึกษาฤดูร้อน</label><input v-model="form.s3_4.summer" type="text" /></div>
              </div>
            </template>

            <!-- 3.5, 3.6, 3.7, 3.34, 3.35, 3.36 (List) -->
            <template v-else-if="[4, 5, 6, 33, 34, 35].includes(i)">
              <div class="list-editor">
                <div class="list-row" v-for="(item, idx) in form[`s3_${i+1}`]" :key="idx">
                  <div class="list-num">{{ idx + 1 }}</div>
                  <input v-model="form[`s3_${i+1}`][idx]" type="text" />
                  <button type="button" class="row-del" @click="removeList(`s3_${i+1}`, idx)">✕</button>
                </div>
                <button type="button" class="add-row" @click="addList(`s3_${i+1}`)">+ เพิ่มรายการ</button>
              </div>
            </template>

            <!-- 3.8 แผนการรับนักศึกษา -->
            <template v-else-if="i === 7">
              <table class="builder bg-white">
                <thead><tr><th>ระดับชั้นปี</th><th>2565</th><th>2566</th><th>2567</th><th>2568</th><th>2569</th><th style="width:40px"></th></tr></thead>
                <tbody>
                  <tr v-for="(row, idx) in form.s3_8" :key="idx">
                    <td><input v-model="row.year" type="text"></td><td><input v-model="row.y65" type="text"></td><td><input v-model="row.y66" type="text"></td>
                    <td><input v-model="row.y67" type="text"></td><td><input v-model="row.y68" type="text"></td><td><input v-model="row.y69" type="text"></td>
                    <td><button type="button" class="table-del" @click="removeTable('s3_8', idx, {year:'',y65:'',y66:'',y67:'',y68:'',y69:''})">✕</button></td>
                  </tr>
                </tbody>
              </table>
              <button type="button" class="add-row" @click="addTable('s3_8', {year:'',y65:'',y66:'',y67:'',y68:'',y69:''})">+ เพิ่มแถว</button>
            </template>

            <!-- 3.9 งบประมาณรายรับ -->
            <template v-else-if="i === 8">
              <table class="builder bg-white">
                <thead><tr><th>รายละเอียดรายรับ</th><th>2565</th><th>2566</th><th>2567</th><th>2568</th><th>2569</th><th style="width:40px"></th></tr></thead>
                <tbody>
                  <tr v-for="(row, idx) in form.s3_9" :key="idx">
                    <td><input v-model="row.detail" type="text"></td><td><input v-model="row.y65" type="text"></td><td><input v-model="row.y66" type="text"></td>
                    <td><input v-model="row.y67" type="text"></td><td><input v-model="row.y68" type="text"></td><td><input v-model="row.y69" type="text"></td>
                    <td><button type="button" class="table-del" @click="removeTable('s3_9', idx, {detail:'',y65:'',y66:'',y67:'',y68:'',y69:''})">✕</button></td>
                  </tr>
                </tbody>
              </table>
              <button type="button" class="add-row" @click="addTable('s3_9', {detail:'',y65:'',y66:'',y67:'',y68:'',y69:''})">+ เพิ่มแถว</button>
            </template>

            <!-- 3.10 งบประมาณรายจ่าย -->
            <template v-else-if="i === 9">
              <table class="builder bg-white">
                <thead><tr><th>หมวดเงิน</th><th>2565</th><th>2566</th><th>2567</th><th>2568</th><th>2569</th><th style="width:40px"></th></tr></thead>
                <tbody>
                  <tr v-for="(row, idx) in form.s3_10" :key="idx">
                    <td><input v-model="row.category" type="text"></td><td><input v-model="row.y65" type="text"></td><td><input v-model="row.y66" type="text"></td>
                    <td><input v-model="row.y67" type="text"></td><td><input v-model="row.y68" type="text"></td><td><input v-model="row.y69" type="text"></td>
                    <td><button type="button" class="table-del" @click="removeTable('s3_10', idx, {category:'',y65:'',y66:'',y67:'',y68:'',y69:''})">✕</button></td>
                  </tr>
                </tbody>
              </table>
              <button type="button" class="add-row" @click="addTable('s3_10', {category:'',y65:'',y66:'',y67:'',y68:'',y69:''})">+ เพิ่มแถว</button>
            </template>

            <!-- 3.13 โครงสร้างหลักสูตร -->
            <template v-else-if="i === 12">
              <table class="builder bg-white">
                <thead><tr><th>หมวดวิชา / กลุ่มวิชา</th><th>หน่วยกิต</th><th style="width:40px"></th></tr></thead>
                <tbody>
                  <tr v-for="(row, idx) in form.s3_13" :key="idx">
                    <td><input v-model="row.group" type="text"></td><td><input v-model="row.credits" type="text"></td>
                    <td><button type="button" class="table-del" @click="removeTable('s3_13', idx, {group:'',credits:''})">✕</button></td>
                  </tr>
                </tbody>
              </table>
              <button type="button" class="add-row" @click="addTable('s3_13', {group:'',credits:''})">+ เพิ่มแถว</button>
            </template>

            <!-- 3.14 - 3.25 รายวิชาในหมวดต่างๆ -->
            <template v-else-if="i >= 13 && i <= 24">
              <div v-for="(subj, itemIdx) in form.subjects[i-13]" :key="itemIdx" class="slist-item">
                <div class="slist-num">{{ itemIdx + 1 }}</div>
                <div class="slist-fields fs-grid">
                  <div class="fs-field"><label>รหัสวิชา</label><input v-model="subj.code" type="text" /></div>
                  <div class="fs-field"><label>หน่วยกิต</label><input v-model="subj.credit" type="text" /></div>
                  <div class="fs-field"><label>ชื่อวิชา <span class="lang-tag">ภาษาไทย</span></label><input v-model="subj.nameTh" type="text" /></div>
                  <div class="fs-field"><label>Subject Name <span class="lang-tag">English</span></label><input v-model="subj.nameEn" type="text" /></div>
                  <div class="fs-field" style="grid-column: 1 / -1;"><label>หมายเหตุ</label><input v-model="subj.note" type="text" /></div>
                </div>
                <button type="button" class="slist-del" @click="removeSubject(i-13, itemIdx)">✕</button>
              </div>
              <button type="button" class="add-row" @click="addSubject(i-13)">+ เพิ่มรายวิชา</button>
            </template>

            <!-- 3.27 - 3.30 แผนการศึกษา -->
            <template v-else-if="i >= 26 && i <= 29">
              <table class="builder bg-white">
                <thead><tr><th>ปีที่/ภาคการศึกษา</th><th>รหัสวิชา</th><th>ชื่อวิชา</th><th>หน่วยกิต</th><th style="width:40px"></th></tr></thead>
                <tbody>
                  <tr v-for="(row, idx) in form[`s3_${i+1}`]" :key="idx">
                    <td><input v-model="row.sem" type="text"></td><td><input v-model="row.code" type="text"></td>
                    <td><input v-model="row.name" type="text"></td><td><input v-model="row.credit" type="text"></td>
                    <td><button type="button" class="table-del" @click="removeTable(`s3_${i+1}`, idx, {sem:'',code:'',name:'',credit:''})">✕</button></td>
                  </tr>
                </tbody>
              </table>
              <button type="button" class="add-row" @click="addTable(`s3_${i+1}`, {sem:'',code:'',name:'',credit:''})">+ เพิ่มวิชา</button>
            </template>

            <!-- 3.31 คำอธิบายรายวิชา (มีปุ่ม AI) -->
            <template v-else-if="i === 30">
              <div v-for="(item, idx) in form.s3_31" :key="idx" class="slist-item !bg-white">
                <div class="slist-num">{{ idx + 1 }}</div>
                <div class="slist-fields fs-grid">
                  <div class="fs-field"><label>รหัสวิชา</label><input v-model="item.code" type="text" class="!bg-[#FEFDFA]" /></div>
                  <div class="fs-field"><label>หน่วยกิต</label><input v-model="item.credit" type="text" class="!bg-[#FEFDFA]" /></div>
                  <div class="fs-field"><label>ชื่อวิชา <span class="lang-tag">ภาษาไทย</span></label><input v-model="item.nameTh" type="text" class="!bg-[#FEFDFA]" /></div>
                  <div class="fs-field"><label>Subject Name <span class="lang-tag">English</span></label><input v-model="item.nameEn" type="text" class="!bg-[#FEFDFA]" /></div>
                  <div class="fs-field" style="grid-column: 1 / -1;"><label>วิชาบังคับก่อน</label><input v-model="item.prereq" type="text" class="!bg-[#FEFDFA]" /></div>
                  <div class="fs-field" style="grid-column: 1 / -1;"><label>คำอธิบายรายวิชา (ไทย)</label><textarea v-model="item.descTh" class="field !bg-[#FEFDFA]"></textarea></div>
                  <div class="fs-field" style="grid-column: 1 / -1;"><label>Course Description (English)</label><textarea v-model="item.descEn" class="field !bg-[#FEFDFA]"></textarea></div>
                  <div class="fs-field" style="grid-column: 1 / -1;">
                    <button type="button" @click="handleAIGenerate('course_description', item.nameTh)" class="ai-btn"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> AI ช่วยร่างคำอธิบายวิชานี้</button>
                  </div>
                </div>
                <button type="button" class="slist-del" @click="removeS3_31(idx)">✕</button>
              </div>
              <button type="button" class="add-row" @click="addS3_31()">+ เพิ่มคำอธิบายรายวิชา</button>
            </template>

            <!-- 3.32 อาจารย์ผู้สอน -->
            <template v-else-if="i === 31">
              <div v-for="(item, idx) in form.s3_32" :key="idx" class="slist-item">
                <div class="slist-num">{{ idx + 1 }}</div>
                <div class="slist-fields fs-grid">
                  <div class="fs-field"><label>ชื่อ-นามสกุล</label><input v-model="item.name" type="text" /></div>
                  <div class="fs-field"><label>ตำแหน่งทางวิชาการ</label><input v-model="item.position" type="text" /></div>
                  <div class="fs-field" style="grid-column: 1 / -1;"><label>คุณวุฒิ (สาขาวิชา) — สถาบัน/ประเทศ — ปี พ.ศ.</label><textarea v-model="item.degree" class="field" style="min-height: 60px;"></textarea></div>
                  <div class="fs-field" style="grid-column: 1 / -1;"><label>ผลงานทางวิชาการ</label><input v-model="item.research" type="text" /></div>
                  <div class="fs-field"><label>ภาระสอนเดิม (ชม./สัปดาห์)</label><input v-model="item.loadNow" type="text" /></div>
                  <div class="fs-field"><label>ภาระสอนใหม่ (ชม./สัปดาห์)</label><input v-model="item.loadNew" type="text" /></div>
                </div>
                <button type="button" class="slist-del" @click="removeS3_32(idx)">✕</button>
              </div>
              <button type="button" class="add-row" @click="addS3_32()">+ เพิ่มอาจารย์ผู้สอน</button>
            </template>

            <!-- ข้ออื่นๆ (Textarea) -->
            <template v-else>
              <div class="fs-grid full">
                <div class="fs-field">
                  <textarea v-model="form.sections[i]" class="field" :placeholder="`ระบุข้อมูล ${title}...`"></textarea>
                </div>
              </div>
            </template>

          </div>
        </section>

      </div>

      <!-- Action Footer -->
      <div class="page-footer">
        <button type="button" @click="router.push(`/number2?id=${programId || ''}`)" class="nav-btn">
          ← <span>ข้อมูลเฉพาะของหลักสูตร</span>
        </button>
        <div class="flex flex-col md:flex-row gap-3">
          <button type="button" @click="saveDraft()" :disabled="isSavingDraft" class="nav-btn">
            <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-1" /> {{ isSavingDraft ? 'กำลังบันทึก...' : 'บันทึกฉบับร่าง' }}
          </button>
          <button type="button" @click="saveAndNext()" :disabled="isSavingNext" class="btn-brass force-white-btn" style="border:none;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;cursor:pointer;">
            <span style="color:#ffffff !important;">{{ isSavingNext ? 'กำลังบันทึก...' : 'ผลการเรียนรู้ กลยุทธ์การสอน' }}</span> <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

    </form>
  </div>
</template>

<style scoped>
/* ================== CSS สไตล์เดียวกับหน้าอื่นเพื่อความต่อเนื่อง ================== */
.force-white-btn { color: #ffffff !important; }

.page-shell { max-width: 900px; margin: 0 auto; width: 100%; }

.crumb { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #736F60; margin-bottom: 14px; }
.crumb b { color: #1B2A4A; font-weight: 600; }
.page-badge { margin-left: auto; font-size: 11px; color: #A8793B; border: 1px solid #EEE0C6; background: #fff; padding: 3px 9px; border-radius: 20px; font-weight: 600; }

.doc-head { margin-bottom: 20px; }
.doc-eyebrow { font-size: 12.5px; color: #A8793B; font-weight: 700; letter-spacing: .03em; margin-bottom: 6px; }
.doc-title { font-size: 25px; font-weight: 600; color: #1B2A4A; margin: 0; font-family: 'Noto Serif Thai', serif; }

.toc-card { background: #fff; border: 1px solid #E3DCC9; border-radius: 10px; box-shadow: 0 18px 40px -18px rgba(27,42,74,.28); padding: 18px 24px 20px; margin-bottom: 18px; }
.toc-label { font-size: 11.5px; color: #A8793B; font-weight: 700; letter-spacing: .04em; margin-bottom: 10px; }
.toc-grid { display: grid; gap: 4px 18px; }
.toc-item { display: flex; align-items: center; gap: 9px; padding: 7px 8px; border-radius: 7px; cursor: pointer; font-size: 13px; color: #26241E; border: 1px solid transparent; transition: all 0.2s; }
.toc-item:hover { background: #F3EFE4; }
.toc-num { font-family: 'Noto Serif Thai', serif; font-weight: 700; color: #A8793B; font-size: 12.5px; min-width: 28px; flex: none; }
.toc-dot { width: 7px; height: 7px; border-radius: 50%; background: #E3DCC9; flex: none; transition: background 0.2s; }
.toc-item.filled .toc-dot { background: #3F6B52; }
.toc-item span.lbl { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.paper-card { background: #fff; border: 1px solid #E3DCC9; border-radius: 10px; box-shadow: 0 18px 40px -18px rgba(27,42,74,.28); padding: 8px 42px 20px; position: relative; }

.topic-sec { padding: 26px 0 30px; border-bottom: 1px solid #E3DCC9; position: relative; }
.topic-sec:last-child { border-bottom: none; }
.topic-sec.pulse { animation: pulseSec 1.1s ease; }
@keyframes pulseSec { 0% { background: #EEE0C6; } 100% { background: transparent; } }

.sec-head { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 6px; }
.sec-number { font-family: 'Noto Serif Thai', serif; font-weight: 700; color: #A8793B; font-size: 17px; min-width: 44px; flex: none; }
.sec-title { font-size: 16.5px; font-weight: 600; color: #1B2A4A; flex: 1; margin: 0; line-height: 1.4; }
.sec-check { flex: none; border: 1px solid #E3DCC9; background: #fff; color: #736F60; border-radius: 7px; padding: 6px 12px; font-size: 11.8px; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s; }
.sec-check.on { background: #E4EEE7 !important; border-color: #3F6B52 !important; color: #3F6B52 !important; }
.sec-hint { font-size: 12.8px; color: #736F60; line-height: 1.7; margin: 2px 0 14px; padding-left: 56px; }
.sec-body { padding-left: 56px; }
@media (max-width:720px){ .sec-hint, .sec-body { padding-left: 0; } }

.fs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.fs-grid.full { grid-template-columns: 1fr; }
.fs-field label { display: block; font-size: 12.6px; font-weight: 600; color: #1B2A4A; margin-bottom: 6px; }
.fs-field label .lang-tag { font-size: 10.6px; font-weight: 500; background: #EEF1F9; color: #4D5FA8; padding: 1px 7px; border-radius: 4px; margin-left: 6px; }

/* Input, Select, Textarea */
.fs-field input[type=text], .fs-field input[type=number], .fs-field select, textarea.field {
  width: 100%; border: 1px solid #E3DCC9 !important; border-radius: 8px !important; 
  padding: 9px 12px !important; font-size: 13.6px !important; background: #FEFDFA !important; 
  color: #26241E !important; font-family: 'Sarabun', sans-serif !important; box-shadow: none !important; transition: all 0.2s; 
}
textarea.field { min-height: 100px; resize: vertical; line-height: 1.7; }
.fs-field select { cursor: pointer; }
.fs-field input:focus, .fs-field select:focus, textarea.field:focus { 
  outline: none !important; border-color: #A8793B !important; box-shadow: 0 0 0 3px #EEE0C6 !important; 
}

/* AI Button */
.ai-btn { margin-top: 6px; border: 1px solid #A8793B; background: #FDFBF4; color: #A8793B; border-radius: 7px; padding: 8px 14px; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: 0.2s; }
.ai-btn:hover { background: #EEE0C6; }

/* Dynamic List Editor */
.list-editor .list-row { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 9px; }
.list-num { width: 24px; height: 24px; flex: none; margin-top: 3px; border-radius: 50%; background: #F3EFE4; display: flex; align-items: center; justify-content: center; font-size: 11.5px; font-weight: 700; color: #1B2A4A; font-family: 'Noto Serif Thai', serif; }
.list-row input { flex: 1; border: 1px solid #E3DCC9 !important; border-radius: 7px !important; padding: 9px 12px !important; font-size: 13.8px !important; background: #FEFDFA !important; box-shadow: none !important; outline: none !important; }
.list-row input:focus { border-color: #A8793B !important; box-shadow: 0 0 0 3px #EEE0C6 !important; }
.row-del { width: 30px; height: 30px; flex: none; border: 1px solid #E3DCC9; background: #fff; border-radius: 7px; color: #9C4132; font-size: 15px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
.row-del:hover { background: #FBECE8; }
.add-row { margin-top: 6px; border: 1px dashed #C9BFA2; background: #FDFBF4; color: #A8793B; border-radius: 7px; padding: 8px 14px; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: 0.2s; }
.add-row:hover { background: #EEE0C6; }

/* Structured List */
.slist-item { display: flex; gap: 12px; align-items: flex-start; background: #F3EFE4; border: 1px solid #E3DCC9; border-radius: 10px; padding: 14px 16px; margin-bottom: 12px; }
.slist-num { width: 26px; height: 26px; flex: none; border-radius: 50%; background: #1B2A4A; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; margin-top: 2px; font-family: 'Noto Serif Thai', serif; }
.slist-fields { flex: 1; min-width: 0; }
.slist-fields .fs-grid { margin-bottom: 0; }
.slist-fields .fs-field { margin-bottom: 10px; }
.slist-fields .fs-field:last-child { margin-bottom: 0; }
.slist-fields .fs-field input, .slist-fields .fs-field select, .slist-fields .fs-field textarea { background: #fff !important; }
.slist-del { flex: none; border: none; background: none; color: #9C4132; font-size: 17px; margin-top: 2px; border-radius: 5px; padding: 3px 6px; cursor: pointer; transition: 0.2s; }
.slist-del:hover { background: #FBECE8; }

/* Table Builder */
table.builder { width: 100%; border-collapse: collapse; margin-top: 4px; }
table.builder th { background: #1B2A4A; color: #EFE7D6; font-size: 12.3px; font-weight: 600; text-align: left; padding: 9px 12px; border: 1px solid #1B2A4A; }
table.builder td { border: 1px solid #E3DCC9; padding: 5px 6px; }
table.builder td input { width: 100%; border: 1px solid transparent !important; background: transparent !important; padding: 6px 8px !important; font-size: 13.4px !important; border-radius: 5px !important; }
table.builder td input:focus { outline: none !important; border-color: #A8793B !important; background: #EEE0C6 !important; }
table.builder tr:nth-child(even) td { background: #FCFAF4; }
.table-del { border: none; background: none; color: #9C4132; font-size: 14px; width: 100%; text-align: center; cursor: pointer;}

.page-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 22px; }
.nav-btn { border: 1px solid #E3DCC9; background: #fff; border-radius: 8px; padding: 10px 16px; font-size: 13px; font-weight: 600; color: #1B2A4A; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
.nav-btn:hover:not([disabled]) { border-color: #A8793B; color: #A8793B; }
.nav-btn[disabled] { opacity: .35; pointer-events: none; }

.btn-brass { background: #1B2A4A; transition: all 0.2s; }
.btn-brass:hover { background: #2C3E63; }
</style>