<!-- pages/number4.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const programId = ref<string | null>(null)

// รายชื่อหัวข้อทั้ง 12 หัวข้อของหมวด 4
const sectionTitles = [
  "การพัฒนาคุณลักษณะพิเศษของนักศึกษา",
  "การพัฒนาผลการเรียนรู้ด้านคุณธรรม จริยธรรม",
  "การพัฒนาผลการเรียนรู้ด้านความรู้",
  "การพัฒนาผลการเรียนรู้ด้านทักษะทางปัญญา",
  "การพัฒนาผลการเรียนรู้ด้านทักษะความสัมพันธ์ระหว่างบุคคลและความรับผิดชอบ",
  "การพัฒนาผลการเรียนรู้ด้านทักษะการวิเคราะห์เชิงตัวเลข การสื่อสาร และการใช้เทคโนโลยีสารสนเทศ",
  "ผลการเรียนรู้ในตารางของรายวิชา มีความหมายดังนี้",
  "ผลการเรียนรู้ที่คาดหวัง (ELO) ของหลักสูตรตามกรอบมาตรฐาน",
  "ผลการเรียนรู้ที่คาดหวังหลัก",
  "ผลการเรียนรู้ที่คาดหวังเฉพาะแขนงวิชา",
  "ตารางแสดงความสัมพันธ์ระหว่างผลการเรียนรู้ตาม TQF กับ ELO",
  "แผนที่แสดงการกระจายความรับผิดชอบมาตรฐานผลการเรียนรู้จากหลักสูตรสู่รายวิชา (Curriculum Mapping)"
]

// ================= State ข้อมูลฟอร์ม =================
const form = ref<any>({
  id: null,
  s4_1: [{ trait: '', strategy: '' }],
  s4_2: { outcomes: '', strategy: '', assessment: '' },
  s4_3: { outcomes: '', strategy: '', assessment: '' },
  s4_4: { outcomes: '', strategy: '', assessment: '' },
  s4_5: { outcomes: '', strategy: '', assessment: '' },
  s4_6: { outcomes: '', strategy: '', assessment: '' },
  s4_7: { d1: '', d2: '', d3: '', d4: '', d5: '' },
  s4_8: '',
  s4_9: [{ code: '', type: '', desc: '' }],
  s4_10: [{ code: '', branch: '', desc: '' }],
  s4_11: [{ code: '', d1: '', d2: '', d3: '', d4: '', d5: '' }],
  mapState: {} as Record<string, string>
})

const eloTypes = ['S — เฉพาะทาง (Specific)', 'G — ทั่วไป (General)']
const branchOptions = ['แขนงวิชาโทรคมนาคม (T)', 'แขนงวิชาคอมพิวเตอร์ (C)', 'แขนงวิชาเครื่องมือวัดและควบคุม (I)', 'แขนงวิชาการกระจายเสียงวิทยุและโทรทัศน์ (B)']

// ================= AI Integration =================
const handleAIGenerate = (section: string, payload?: any) => {
  // TODO: สำหรับ Backend นำไปต่อ API สร้างเนื้อหาด้วย AI
  console.log('Trigger AI Generation for:', section, payload)
  alert(`กำลังเรียกใช้ AI สำหรับหมวด: ${section}\n(รอ Backend เชื่อมต่อ API)`)
}

// ================= Helper Functions =================
const addList = (key: string, emptyObj: any) => { form.value[key].push({...emptyObj}) }
const removeList = (key: string, idx: number, emptyObj: any) => { 
  form.value[key].splice(idx, 1); 
  if (form.value[key].length === 0) form.value[key].push({...emptyObj}) 
}

const doneState = ref<Record<number, boolean>>({})
const toggleDone = (index: number) => { doneState.value[index] = !doneState.value[index] }

onMounted(() => { if (route.query.id) { programId.value = route.query.id as string; form.value.id = route.query.id as string } })

const isSavingDraft = ref(false); const isSavingNext = ref(false)
const saveDraft = async () => { isSavingDraft.value = true; await new Promise(r => setTimeout(r, 1000)); isSavingDraft.value = false; }
const saveAndNext = async () => { isSavingNext.value = true; await new Promise(r => setTimeout(r, 1000)); isSavingNext.value = false; router.push({ path: '/number5', query: { id: programId.value } }) }

const scrollToSec = (id: string) => {
  const el = document.getElementById(id)
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.classList.add('pulse'); setTimeout(() => el.classList.remove('pulse'), 1200) }
}

// ================= 4.12 Curriculum Mapping Data =================
const MAP_DOMAINS = [
  {id:'d1', label:'1. คุณธรรม จริยธรรม'}, {id:'d2', label:'2. ความรู้'}, {id:'d3', label:'3. ทักษะทางปัญญา'},
  {id:'d4', label:'4. ทักษะความสัมพันธ์'}, {id:'d5', label:'5. ทักษะวิเคราะห์เชิงตัวเลขฯ'}
]
const MAP_SUBCOLS = [1,2,3,4,5]
const MAP_COURSE_GROUPS = [
  {group:'ก. กลุ่มวิชาภาษา (หมวดวิชาศึกษาทั่วไป)', courses:[
    {code:'080103001', nameTh:'ภาษาอังกฤษ 1', nameEn:'English I', credits:'3(3-0-6)'},
    {code:'080103002', nameTh:'ภาษาอังกฤษ 2', nameEn:'English II', credits:'3(3-0-6)'}
  ]},
  {group:'ก. กลุ่มวิชาแกน (หมวดวิชาเฉพาะ)', courses:[
    {code:'040203111', nameTh:'คณิตศาสตร์วิศวกรรม 1', nameEn:'Engineering Mathematics I', credits:'3(3-0-6)'},
    {code:'030413100', nameTh:'การวิเคราะห์วงจรไฟฟ้า 1', nameEn:'Electric Circuit Analysis I', credits:'3(3-0-6)'}
  ]}
]

const cycleCell = (key: string) => {
  const cur = form.value.mapState[key] || '';
  form.value.mapState[key] = cur === '' ? 'o' : cur === 'o' ? 'r' : '';
}
</script>

<template>
  <div class="page-shell">
    <form @submit.prevent class="w-full">
      
      <!-- Breadcrumb & Title -->
      <div class="crumb">
        <span>เล่มหลักสูตร</span> › <b class="text-[#1B2A4A] font-semibold">หมวดที่ 4</b>
        <span class="page-badge">หน้า 5 / 9</span>
      </div>
      <div class="doc-head">
        <div class="doc-eyebrow">หมวดที่ 4</div>
        <h1 class="doc-title">ผลการเรียนรู้ กลยุทธ์การสอนและการประเมินผล</h1>
      </div>

      <!-- TOC Card -->
      <div class="toc-card">
        <div class="toc-label">หัวข้อในหน้านี้ — คลิกเพื่อกระโดดไปยังหัวข้อ (รวม 12 หัวข้อ)</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-[4px_18px]">
          <div v-for="(title, i) in sectionTitles" :key="i" class="toc-item" :class="{ 'filled': doneState[i] }" @click="scrollToSec(`sec-4-${i+1}`)">
            <div class="toc-dot"></div>
            <span class="toc-num">4.{{ i + 1 }}</span>
            <span class="lbl">{{ title }}</span>
          </div>
        </div>
      </div>

      <!-- Main Paper Card -->
      <div class="paper-card">
        
        <!-- 4.1 การพัฒนาคุณลักษณะพิเศษ -->
        <section class="topic-sec" id="sec-4-1">
          <div class="sec-head">
            <div class="sec-number">4.1</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <h2 class="sec-title pt-1">{{ sectionTitles[0] }}</h2>
              <button type="button" class="sec-check" :class="{ 'on': doneState[0] }" @click="toggleDone(0)">{{ doneState[0] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body">
            <div v-for="(item, idx) in form.s4_1" :key="idx" class="slist-item">
              <div class="slist-num">{{ idx + 1 }}</div>
              <div class="slist-fields fs-grid full">
                <div class="fs-field"><label>คุณลักษณะพิเศษ</label><textarea v-model="item.trait" class="field" style="min-height:60px"></textarea></div>
                <div class="fs-field"><label>กลยุทธ์หรือกิจกรรมของนักศึกษา</label><textarea v-model="item.strategy" class="field" style="min-height:60px"></textarea></div>
              </div>
              <button type="button" class="slist-del" @click="removeList('s4_1', idx, {trait:'', strategy:''})">✕</button>
            </div>
            <button type="button" class="add-row" @click="addList('s4_1', {trait:'', strategy:''})">+ เพิ่มรายการ</button>
          </div>
        </section>

        <!-- 4.2 - 4.6 โดเมนการเรียนรู้ทั้ง 5 ด้าน -->
        <section v-for="i in 5" :key="i" :id="`sec-4-${i+1}`" class="topic-sec">
          <div class="sec-head">
            <div class="sec-number">4.{{ i+1 }}</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <h2 class="sec-title pt-1">{{ sectionTitles[i] }}</h2>
              <button type="button" class="sec-check" :class="{ 'on': doneState[i] }" @click="toggleDone(i)">{{ doneState[i] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body">
            <div class="fs-grid full">
              <div class="fs-field"><label>ผลการเรียนรู้ที่คาดหวังด้านนี้</label><textarea v-model="form[`s4_${i+1}`].outcomes" class="field" style="min-height:80px"></textarea></div>
              <div class="fs-field"><label>กลยุทธ์การสอนที่ใช้พัฒนาการเรียนรู้</label><textarea v-model="form[`s4_${i+1}`].strategy" class="field" style="min-height:80px"></textarea></div>
              <div class="fs-field"><label>กลยุทธ์การประเมินผลการเรียนรู้</label><textarea v-model="form[`s4_${i+1}`].assessment" class="field" style="min-height:80px"></textarea></div>
            </div>
          </div>
        </section>

        <!-- 4.7 ความหมายในตารางรายวิชา -->
        <section class="topic-sec" id="sec-4-7">
          <div class="sec-head">
            <div class="sec-number">4.7</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <h2 class="sec-title pt-1">{{ sectionTitles[6] }}</h2>
              <button type="button" class="sec-check" :class="{ 'on': doneState[6] }" @click="toggleDone(6)">{{ doneState[6] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <p class="sec-hint">คำอธิบายความหมายของตัวเลข 1-5 ในแต่ละด้าน ที่ปรากฏในตาราง Curriculum Mapping</p>
          <div class="sec-body">
            <div class="fs-grid full">
              <div class="fs-field" v-for="d in 5" :key="d">
                <label>{{ d }}. {{ MAP_DOMAINS[d-1].label.split('. ')[1] }}</label>
                <textarea v-model="(form.s4_7 as any)[`d${d}`]" class="field" style="min-height:60px"></textarea>
              </div>
            </div>
          </div>
        </section>

        <!-- 4.8 ELO ตามกรอบมาตรฐาน (มีปุ่ม AI) -->
        <section class="topic-sec border-l-4 border-l-[#A8793B] pl-[20px] -ml-[24px] bg-[#FDFBF4]" id="sec-4-8">
          <div class="sec-head">
            <div class="sec-number">4.8</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">{{ sectionTitles[7] }}</h2>
                <span class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState[7] }" @click="toggleDone(7)">{{ doneState[7] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body md:pl-[56px] mt-4 md:mt-0">
            <div class="fs-grid full">
              <div class="fs-field">
                <textarea v-model="form.s4_8" class="field bg-white" style="min-height: 80px;"></textarea>
                <button type="button" class="ai-btn mt-2" @click="handleAIGenerate('elo_standard')"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> AI ช่วยร่าง ELO มาตรฐาน</button>
              </div>
            </div>
          </div>
        </section>

        <!-- 4.9 ผลการเรียนรู้ที่คาดหวังหลัก (มีปุ่ม AI) -->
        <section class="topic-sec border-l-4 border-l-[#A8793B] pl-[20px] -ml-[24px] bg-[#FDFBF4]" id="sec-4-9">
          <div class="sec-head">
            <div class="sec-number">4.9</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">{{ sectionTitles[8] }}</h2>
                <span class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState[8] }" @click="toggleDone(8)">{{ doneState[8] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body md:pl-[56px] mt-4 md:mt-0">
            <div v-for="(item, idx) in form.s4_9" :key="idx" class="slist-item !bg-white">
              <div class="slist-num">{{ idx + 1 }}</div>
              <div class="slist-fields fs-grid">
                <div class="fs-field"><label>รหัส ELO</label><input v-model="item.code" type="text" class="!bg-[#FEFDFA]" placeholder="เช่น ELO1"/></div>
                <div class="fs-field"><label>ประเภท</label>
                  <select v-model="item.type" class="!bg-[#FEFDFA]"><option value="" disabled>-- เลือกประเภท --</option><option v-for="t in eloTypes" :key="t" :value="t">{{ t }}</option></select>
                </div>
                <div class="fs-field" style="grid-column: 1 / -1;"><label>รายละเอียด</label><textarea v-model="item.desc" class="field !bg-[#FEFDFA]" style="min-height:60px"></textarea></div>
              </div>
              <button type="button" class="slist-del" @click="removeList('s4_9', idx, {code:'', type:'', desc:''})">✕</button>
            </div>
            <button type="button" class="add-row" @click="addList('s4_9', {code:'', type:'', desc:''})">+ เพิ่ม ELO หลัก</button>
            <button type="button" class="ai-btn ml-2" @click="handleAIGenerate('elo_main')"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> AI ช่วยคิด ELO หลัก</button>
          </div>
        </section>

        <!-- 4.10 ผลการเรียนรู้ที่คาดหวังเฉพาะแขนง (มีปุ่ม AI) -->
        <section class="topic-sec border-l-4 border-l-[#A8793B] pl-[20px] -ml-[24px] bg-[#FDFBF4]" id="sec-4-10">
          <div class="sec-head">
            <div class="sec-number">4.10</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">{{ sectionTitles[9] }}</h2>
                <span class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState[9] }" @click="toggleDone(9)">{{ doneState[9] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body md:pl-[56px] mt-4 md:mt-0">
            <div v-for="(item, idx) in form.s4_10" :key="idx" class="slist-item !bg-white">
              <div class="slist-num">{{ idx + 1 }}</div>
              <div class="slist-fields fs-grid">
                <div class="fs-field"><label>รหัส ELO</label><input v-model="item.code" type="text" class="!bg-[#FEFDFA]" placeholder="เช่น ELO T.1"/></div>
                <div class="fs-field"><label>แขนงวิชา</label>
                  <select v-model="item.branch" class="!bg-[#FEFDFA]"><option value="" disabled>-- เลือกแขนง --</option><option v-for="b in branchOptions" :key="b" :value="b">{{ b }}</option></select>
                </div>
                <div class="fs-field" style="grid-column: 1 / -1;"><label>รายละเอียด</label><textarea v-model="item.desc" class="field !bg-[#FEFDFA]" style="min-height:60px"></textarea></div>
              </div>
              <button type="button" class="slist-del" @click="removeList('s4_10', idx, {code:'', branch:'', desc:''})">✕</button>
            </div>
            <button type="button" class="add-row" @click="addList('s4_10', {code:'', branch:'', desc:''})">+ เพิ่ม ELO เฉพาะแขนง</button>
            <button type="button" class="ai-btn ml-2" @click="handleAIGenerate('elo_branch')"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> AI ช่วยคิด ELO แขนงวิชา</button>
          </div>
        </section>

        <!-- 4.11 ตารางความสัมพันธ์ TQF กับ ELO -->
        <section class="topic-sec" id="sec-4-11">
          <div class="sec-head">
            <div class="sec-number">4.11</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <h2 class="sec-title pt-1">{{ sectionTitles[10] }}</h2>
              <button type="button" class="sec-check" :class="{ 'on': doneState[10] }" @click="toggleDone(10)">{{ doneState[10] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="sec-body">
            <div class="overflow-x-auto">
              <table class="builder" style="min-width: 800px;">
                <thead>
                  <tr>
                    <th rowspan="2">รหัส ELO</th>
                    <th colspan="5" class="text-center">ผลการเรียนรู้ตามกรอบมาตรฐานฯ (TQF)</th>
                    <th rowspan="2" style="width:40px"></th>
                  </tr>
                  <tr>
                    <th style="font-size: 11px;">1.คุณธรรมจริยธรรม</th><th style="font-size: 11px;">2.ความรู้</th><th style="font-size: 11px;">3.ทักษะทางปัญญา</th>
                    <th style="font-size: 11px;">4.ความสัมพันธ์ฯ</th><th style="font-size: 11px;">5.วิเคราะห์เชิงตัวเลขฯ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, idx) in form.s4_11" :key="idx">
                    <td><input v-model="row.code" type="text" placeholder="ELO1"></td>
                    <td><input v-model="row.d1" type="text" class="text-center"></td>
                    <td><input v-model="row.d2" type="text" class="text-center"></td>
                    <td><input v-model="row.d3" type="text" class="text-center"></td>
                    <td><input v-model="row.d4" type="text" class="text-center"></td>
                    <td><input v-model="row.d5" type="text" class="text-center"></td>
                    <td><button type="button" class="table-del" @click="removeList('s4_11', idx, {code:'',d1:'',d2:'',d3:'',d4:'',d5:''})">✕</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button type="button" class="add-row mt-2" @click="addList('s4_11', {code:'',d1:'',d2:'',d3:'',d4:'',d5:''})">+ เพิ่มแถว</button>
          </div>
        </section>

        <!-- 4.12 Curriculum Mapping (มีปุ่ม AI) -->
        <section class="topic-sec border-l-4 border-l-[#A8793B] pl-[20px] -ml-[24px] bg-[#FDFBF4]" id="sec-4-12">
          <div class="sec-head">
            <div class="sec-number">4.12</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <div class="flex items-center gap-2">
                <h2 class="sec-title pt-1">{{ sectionTitles[11] }}</h2>
                <span class="text-[10.5px] text-[#A8793B] bg-[#EEE0C6] px-[8px] py-[2px] rounded-full font-bold flex items-center gap-1"><UIcon name="i-heroicons-sparkles" class="w-3 h-3"/> AI Assisted</span>
              </div>
              <button type="button" class="sec-check" :class="{ 'on': doneState[11] }" @click="toggleDone(11)">{{ doneState[11] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}</button>
            </div>
          </div>
          <div class="pl-0 md:pl-[56px] mt-4">
            
            <div class="map-legend">
              <div class="it"><div class="chip r">●</div> ความรับผิดชอบหลัก</div>
              <div class="it"><div class="chip i">○</div> ความรับผิดชอบรอง</div>
              <div class="it text-[#736F60]">คลิกที่ช่องตารางเพื่อสลับสถานะ: ว่าง → ○ → ● → ว่าง</div>
            </div>

            <button type="button" class="ai-btn mb-4" @click="handleAIGenerate('curriculum_mapping')"><UIcon name="i-heroicons-sparkles" class="w-4 h-4"/> AI ช่วยประเมินและทำ Mapping อัตโนมัติ</button>

            <div class="map-scroll custom-scrollbar">
              <table class="mapping">
                <thead>
                  <tr class="domain-row">
                    <th class="corner course-meta" rowspan="2">รหัส / ชื่อวิชา (ไทย-อังกฤษ) / หน่วยกิต</th>
                    <th v-for="d in MAP_DOMAINS" :key="d.id" :colspan="MAP_SUBCOLS.length">{{ d.label }}</th>
                  </tr>
                  <tr class="sub-row">
                    <template v-for="d in MAP_DOMAINS" :key="'sub'+d.id">
                      <th v-for="n in MAP_SUBCOLS" :key="n">{{ n }}</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="grp in MAP_COURSE_GROUPS" :key="grp.group">
                    <tr class="group-row"><th :colspan="MAP_DOMAINS.length * MAP_SUBCOLS.length + 1">{{ grp.group }}</th></tr>
                    <tr v-for="c in grp.courses" :key="c.code">
                      <th class="course-meta">
                        {{ c.nameTh }}
                        <span class="code">{{ c.code }} · {{ c.nameEn }}</span>
                        <span class="credits">{{ c.credits }}</span>
                      </th>
                      <template v-for="d in MAP_DOMAINS" :key="'td'+d.id">
                        <td v-for="n in MAP_SUBCOLS" :key="'td'+d.id+'-'+n">
                          <button type="button" class="cell-btn" :class="form.mapState[`${c.code}|${d.id}-${n}`] || ''" @click="cycleCell(`${c.code}|${d.id}-${n}`)"></button>
                        </td>
                      </template>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>

          </div>
        </section>

      </div>

      <!-- Action Footer -->
      <div class="page-footer">
        <button type="button" @click="router.push(`/number3?id=${programId || ''}`)" class="nav-btn">
          ← <span>ระบบการจัดการศึกษา โครงสร้าง</span>
        </button>
        <div class="flex flex-col md:flex-row gap-3">
          <button type="button" @click="saveDraft()" :disabled="isSavingDraft" class="nav-btn">
            <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-1" /> {{ isSavingDraft ? 'กำลังบันทึก...' : 'บันทึกฉบับร่าง' }}
          </button>
          <button type="button" @click="saveAndNext()" :disabled="isSavingNext" class="btn-brass force-white-btn" style="border:none;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;cursor:pointer;">
            <span style="color:#ffffff !important;">{{ isSavingNext ? 'กำลังบันทึก...' : 'หลักเกณฑ์ในการประเมินผล' }}</span> <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-white" />
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
.toc-item { display: flex; align-items: center; gap: 9px; padding: 7px 8px; border-radius: 7px; cursor: pointer; font-size: 13px; color: #26241E; border: 1px solid transparent; transition: all 0.2s; }
.toc-item:hover { background: #F3EFE4; }
.toc-num { font-family: 'Noto Serif Thai', serif; font-weight: 700; color: #A8793B; font-size: 12.5px; min-width: 24px; flex: none; }
.toc-dot { width: 7px; height: 7px; border-radius: 50%; background: #E3DCC9; flex: none; transition: background 0.2s; }
.toc-item.filled .toc-dot { background: #3F6B52; }
.toc-item span.lbl { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.paper-card { background: #fff; border: 1px solid #E3DCC9; border-radius: 10px; box-shadow: 0 18px 40px -18px rgba(27,42,74,.28); padding: 8px 42px 20px; position: relative; }

.topic-sec { padding: 26px 0 30px; border-bottom: 1px solid #E3DCC9; position: relative; }
.topic-sec:last-child { border-bottom: none; }
.topic-sec.pulse { animation: pulseSec 1.1s ease; }
@keyframes pulseSec { 0% { background: #EEE0C6; } 100% { background: transparent; } }

.sec-head { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 6px; }
.sec-number { font-family: 'Noto Serif Thai', serif; font-weight: 700; color: #A8793B; font-size: 17px; min-width: 32px; flex: none; }
.sec-title { font-size: 16.5px; font-weight: 600; color: #1B2A4A; flex: 1; margin: 0; line-height: 1.4; }
.sec-check { flex: none; border: 1px solid #E3DCC9; background: #fff; color: #736F60; border-radius: 7px; padding: 6px 12px; font-size: 11.8px; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s; }
.sec-check.on { background: #E4EEE7 !important; border-color: #3F6B52 !important; color: #3F6B52 !important; }
.sec-hint { font-size: 12.8px; color: #736F60; line-height: 1.7; margin: 2px 0 14px; padding-left: 44px; }
.sec-body { padding-left: 44px; }
@media (max-width:720px){ .sec-body, .sec-hint { padding-left: 0; } }

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
.add-row { margin-top: 6px; border: 1px dashed #C9BFA2; background: #FDFBF4; color: #A8793B; border-radius: 7px; padding: 8px 14px; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: 0.2s; }
.add-row:hover { background: #EEE0C6; }

/* Table Builder */
table.builder { width: 100%; border-collapse: collapse; margin-top: 4px; }
table.builder th { background: #1B2A4A; color: #EFE7D6; font-size: 12.3px; font-weight: 600; text-align: left; padding: 9px 12px; border: 1px solid #1B2A4A; }
table.builder td { border: 1px solid #E3DCC9; padding: 5px 6px; }
table.builder td input { width: 100%; border: 1px solid transparent !important; background: transparent !important; padding: 6px 8px !important; font-size: 13.4px !important; border-radius: 5px !important; }
table.builder td input:focus { outline: none !important; border-color: #A8793B !important; background: #EEE0C6 !important; }
table.builder tr:nth-child(even) td { background: #FCFAF4; }
.table-del { border: none; background: none; color: #9C4132; font-size: 14px; width: 100%; text-align: center; cursor: pointer;}

/* ---------- MAPPING ---------- */
.map-legend { display: flex; gap: 18px; flex-wrap: wrap; margin-bottom: 16px; font-size: 12.5px; color: #736F60; }
.map-legend .it { display: flex; align-items: center; gap: 7px; }
.chip { width: 22px; height: 22px; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; border: 1px solid #E3DCC9; }
.chip.r { background: #1B2A4A; color: #fff; border-color: #1B2A4A; }
.chip.i { background: #EEE0C6; color: #A8793B; border-color: #A8793B; }
.map-scroll { overflow: auto; border: 1px solid #E3DCC9; border-radius: 10px; max-height: 480px; }
table.mapping { border-collapse: separate; border-spacing: 0; font-size: 12.6px; min-width: 1000px; }
table.mapping th, table.mapping td { border-bottom: 1px solid #E3DCC9; border-right: 1px solid #E3DCC9; white-space: nowrap; }
table.mapping thead th { position: sticky; top: 0; background: #1B2A4A; color: #fff; padding: 10px 12px; font-weight: 600; z-index: 2; }
table.mapping thead th.corner { left: 0; z-index: 4; background: #1B2A4A; }
table.mapping tbody th { position: sticky; left: 0; background: #F3EFE4; text-align: left; padding: 10px 14px; font-weight: 600; color: #1B2A4A; z-index: 1; max-width: 230px; white-space: normal; line-height: 1.4; }
table.mapping td { text-align: center; padding: 0; }
.cell-btn { width: 100%; height: 38px; border: none; background: transparent; font-size: 13px; font-weight: 700; color: transparent; cursor: pointer; transition: 0.1s; }
.cell-btn.i { color: #A8793B; background: #FDFBF4; }
.cell-btn.r { color: #1B2A4A; background: #EEE0C6; }
.cell-btn:hover { background: #F1E9D6; }
.cell-btn.o::after { content: '○'; }
.cell-btn.r::after { content: '●'; }

.page-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 22px; }
.nav-btn { border: 1px solid #E3DCC9; background: #fff; border-radius: 8px; padding: 10px 16px; font-size: 13px; font-weight: 600; color: #1B2A4A; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
.nav-btn:hover:not([disabled]) { border-color: #A8793B; color: #A8793B; }
.nav-btn[disabled] { opacity: .35; pointer-events: none; }

.btn-brass { background: #1B2A4A; transition: all 0.2s; }
.btn-brass:hover { background: #2C3E63; }
</style>