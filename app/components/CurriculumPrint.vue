<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  structure: any[]
  slots: Record<string, string[]>
  courseBank: any[]
  curriculum: {
    id: string | number
    name: string
    type: string
    totalCredit: number
  }
  obe2?: any
  flowImage?: string
}>()

// Safe accessor for OBE2 state
const d = computed(() => props.obe2 || {})

const courseMap = computed(() => {
  const map: Record<string, any> = {}
  for (const course of props.courseBank || []) {
    map[course.code] = course
  }
  return map
})

const formatReq = (node: any) => {
  if (!node || node.req === undefined || node.req === null || node.req === '') return ''
  const amount = Number(node.req) || 0
  return node.type === 'hour' ? `${amount} ชั่วโมง` : `${amount} หน่วยกิต`
}

// โครงสร้างหมวดวิชาแบบ Flat
const allNodes = computed(() => {
  const result: any[] = []
  const walk = (nodes: any[], depth: number, path: string[]) => {
    for (const node of nodes || []) {
      const nextPath = [...path, node.title]
      const courses = (props.slots?.[node.id] || []).map((code: string) => ({
        code,
        ...(courseMap.value[code] || {})
      }))
      result.push({
        ...node,
        depth,
        path: nextPath,
        courses
      })
      if (node.children?.length) walk(node.children, depth + 1, nextPath)
    }
  }
  walk(props.structure || [], 0, [])
  return result
})

const courseNodes = computed(() => allNodes.value)
const hasAnyCourse = computed(() => allNodes.value.some((node: any) => node.courses.length > 0))

// รายวิชาทั้งหมดที่ถูกเพิ่มในหลักสูตร (เรียงตามรหัสวิชาเพื่อใช้ในคำอธิบายรายวิชา)
const selectedCourses = computed(() => {
  const codes = new Set<string>()
  for (const k in props.slots) {
    if (Array.isArray(props.slots[k])) {
      props.slots[k].forEach(c => codes.add(String(c).trim()))
    }
  }
  return (props.courseBank || [])
    .filter(c => codes.has(String(c.code).trim()))
    .sort((a, b) => String(a.code).localeCompare(String(b.code)))
})

const summaryDepthClass = (depth: number) => `cp-depth-${Math.min(depth, 3)}`

// Helper สำหรับดึงข้อมูล Array และ Matrix
const peos = computed(() => d.value.peos || [])
const plos = computed(() => d.value.plos || [])
const ylos = computed(() => d.value.ylos || [])
const missions = computed(() => {
  const m = d.value.missions
  if (Array.isArray(m) && m.length) return m
  return ['ด้านวิชาการและวิจัย', 'ด้านบริการวิชาการ', 'ด้านทำนุบำรุงศิลปวัฒนธรรม', 'ด้านการบริหารจัดการ']
})
const graduateAttributes = computed(() => {
  const ga = d.value.graduateAttributes
  if (Array.isArray(ga) && ga.length) return ga
  return [
    'ความรู้ความสามารถทางวิชาชีพ',
    'ทักษะการแก้ปัญหาและการคิดเชิงวิเคราะห์',
    'คุณธรรม จริยธรรม และจรรยาบรรณวิชาชีพ',
    'ทักษะการสื่อสารและการทำงานร่วมกับผู้อื่น',
    'การเรียนรู้ตลอดชีวิต'
  ]
})

const checkMark = (val: any) => (val ? '●' : '')
const ploVisionMission = (plo: any, idx: number) => {
  return plo?.vision?.missions?.[idx] || false
}
const ploGaAttr = (plo: any, idx: number) => {
  return plo?.ga?.attributes?.[idx] || false
}
const ploPeoMatch = (plo: any, peoId: string) => {
  return plo?.peo?.[peoId] || false
}
const yloPloMatch = (ylo: any, ploId: string) => {
  return ylo?.plos?.[ploId] || false
}

// จัดกลุ่ม YLOs ตามชั้นปี
const ylosByYear = computed(() => {
  const groups: Record<string, any[]> = {}
  for (const y of ylos.value) {
    const yr = String(y.year || '1')
    if (!groups[yr]) groups[yr] = []
    groups[yr].push(y)
  }
  return groups
})
</script>

<template>
  <div class="print-root">

    <!-- ===================================================== -->
    <!-- หน้าปก (Cover Page)                                  -->
    <!-- ===================================================== -->
    <section class="cp-page cp-cover-page">
      <div class="cp-obe">OBE 2</div>
      <div class="cp-cover-inner">
        <div class="cp-cover-head">
          <div class="cp-cover-badge">แบบจัดทำหลักสูตร (OBE 2)</div>
          <h1 class="cp-cover-program">หลักสูตร{{ d.nameTh || curriculum.name || 'วิศวกรรมศาสตรบัณฑิต' }}</h1>
          <div v-if="d.degreeNameTh" class="cp-cover-degree">สาขาวิชา{{ d.degreeNameTh }}</div>
          <div class="cp-cover-year">({{ curriculum.type === 'rev' ? 'หลักสูตรปรับปรุง' : 'หลักสูตรใหม่' }} พ.ศ. {{ d.openYear || '2568' }})</div>
        </div>

        <div class="cp-cover-foot">
          <div class="cp-cover-inst">มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ</div>
        </div>
      </div>
    </section>

    <!-- ===================================================== -->
    <!-- สารบัญ (Table of Contents)                            -->
    <!-- ===================================================== -->
    <section class="cp-page cp-toc-page">
      <div class="cp-obe">OBE 2</div>
      <h2 class="cp-doc-title text-center mb-6">สารบัญ</h2>
      <div class="cp-toc-list">
        <div class="cp-toc-row">
          <span class="cp-toc-title font-bold">องค์ประกอบที่ 1 ชื่อปริญญาและสาขาวิชา ข้อมูลทั่วไป</span>
          <span class="cp-toc-dots"></span>
          <span class="cp-toc-badge">หมวด 1</span>
        </div>
        <div class="cp-toc-subrow">1. รหัสและชื่อหลักสูตร</div>
        <div class="cp-toc-subrow">2. ชื่อปริญญาและสาขาวิชา</div>
        <div class="cp-toc-subrow">3. วิชาเอก</div>
        <div class="cp-toc-subrow">4. รูปแบบของหลักสูตร</div>
        <div class="cp-toc-subrow">5. สถานภาพของหลักสูตรและการพิจารณาอนุมัติ/เห็นชอบ</div>

        <div class="cp-toc-row mt-3">
          <span class="cp-toc-title font-bold">องค์ประกอบที่ 2 ปรัชญา วัตถุประสงค์ และผลลัพธ์การเรียนรู้</span>
          <span class="cp-toc-dots"></span>
          <span class="cp-toc-badge">หมวด 2</span>
        </div>
        <div class="cp-toc-subrow">1. ปรัชญาของหลักสูตร</div>
        <div class="cp-toc-subrow">2. ความสำคัญของหลักสูตร และแผนการพัฒนา</div>
        <div class="cp-toc-subrow">3. วัตถุประสงค์ของหลักสูตร (PEOs)</div>
        <div class="cp-toc-subrow">4. จุดเด่นเฉพาะของหลักสูตร</div>
        <div class="cp-toc-subrow">5. อาชีพที่สามารถประกอบได้หลังสำเร็จการศึกษา</div>
        <div class="cp-toc-subrow">6. ผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตร (PLOs) และความสอดคล้อง</div>
        <div class="cp-toc-subrow">7. ความคาดหวังของผลลัพธ์การเรียนรู้เมื่อสิ้นปีการศึกษา (YLOs)</div>

        <div class="cp-toc-row mt-3">
          <span class="cp-toc-title font-bold">องค์ประกอบที่ 3 โครงสร้างหลักสูตร รายวิชาและหน่วยกิต</span>
          <span class="cp-toc-dots"></span>
          <span class="cp-toc-badge">หมวด 3</span>
        </div>
        <div class="cp-toc-subrow">1. จำนวนหน่วยกิตที่เรียนตลอดหลักสูตร</div>
        <div class="cp-toc-subrow">2. โครงสร้างหลักสูตร</div>
        <div class="cp-toc-subrow">3. รายวิชาในแต่ละหมวดวิชาและจำนวนหน่วยกิต</div>
        <div class="cp-toc-subrow">4. คำอธิบายรายวิชา (Course Descriptions)</div>

        <div class="cp-toc-row mt-3">
          <span class="cp-toc-title font-bold">ภาคผนวก</span>
          <span class="cp-toc-dots"></span>
          <span class="cp-toc-badge">ภาคผนวก</span>
        </div>
        <div class="cp-toc-subrow">ภาคผนวก 2 แผนภูมิแสดงความต่อเนื่องของหลักสูตร (Curriculum Flow Map)</div>
      </div>
    </section>

    <!-- ===================================================== -->
    <!-- องค์ประกอบที่ 1 : ข้อมูลทั่วไป                        -->
    <!-- ===================================================== -->
    <section class="cp-page cp-section-page">
      <div class="cp-obe">OBE 2</div>

      <h1 class="cp-doc-title">องค์ประกอบที่ 1 ชื่อปริญญา ประกาศนียบัตรบัณฑิต ประกาศนียบัตรชั้นสูง และสาขาวิชา</h1>

      <div class="cp-item">
        <h3 class="cp-h3">1. รหัสและชื่อหลักสูตร</h3>
        <div class="cp-subitem"><b>รหัสหลักสูตร :</b> {{ d.programCode || '-' }}</div>
        <div class="cp-subitem"><b>ภาษาไทย :</b> {{ d.nameTh || curriculum.name || '-' }}</div>
        <div class="cp-subitem"><b>ภาษาอังกฤษ :</b> {{ d.nameEn || '-' }}</div>
      </div>

      <div class="cp-item">
        <h3 class="cp-h3">2. ชื่อปริญญาและสาขาวิชา</h3>
        <div class="cp-subitem"><b>ชื่อเต็ม (ภาษาไทย) :</b> {{ d.degreeNameTh || '-' }}</div>
        <div class="cp-subitem"><b>ชื่อย่อ (ภาษาไทย) :</b> {{ d.degreeAbbrTh || '-' }}</div>
        <div class="cp-subitem"><b>ชื่อเต็ม (ภาษาอังกฤษ) :</b> {{ d.degreeNameEn || '-' }}</div>
        <div class="cp-subitem"><b>ชื่อย่อ (ภาษาอังกฤษ) :</b> {{ d.degreeAbbrEn || '-' }}</div>
      </div>

      <div class="cp-item">
        <h3 class="cp-h3">3. วิชาเอก</h3>
        <div v-if="d.majors && d.majors.filter((m: string) => m.trim()).length" class="cp-subitem">
          <ul class="cp-bullet-list">
            <li v-for="(major, idx) in d.majors.filter((m: string) => m.trim())" :key="idx">
              {{ major }}
            </li>
          </ul>
        </div>
        <div v-else class="cp-subitem">ไม่มี</div>
      </div>

      <div class="cp-item">
        <h3 class="cp-h3">4. รูปแบบของหลักสูตร</h3>
        <div class="cp-subitem">
          <b>4.1 รูปแบบ :</b> {{ d.programFormat || 'หลักสูตรระดับปริญญาตรี หลักสูตร 4 ปี' }}
        </div>
        <div class="cp-subitem">
          <b>4.2 ประเภทของหลักสูตร :</b> {{ d.programType || 'หลักสูตรปริญญาตรีทางวิชาการ' }}
        </div>
        <div class="cp-subitem">
          <b>4.3 ภาษาที่ใช้ :</b> {{ d.language || 'การจัดการเรียนการสอนใช้ภาษาไทยและภาษาอังกฤษ' }}
        </div>
        <div class="cp-subitem">
          <b>4.4 การรับเข้าศึกษา :</b> {{ d.admissionReq || 'รับนักศึกษาไทยและนักศึกษาต่างชาติที่ใช้ภาษาไทยได้' }}
        </div>
        <div class="cp-subitem">
          <b>4.5 ความร่วมมือกับสถาบันอื่น :</b> {{ d.cooperation || 'ไม่มี' }}
        </div>
        <div class="cp-subitem">
          <b>4.6 การให้ปริญญาแก่ผู้สำเร็จการศึกษา :</b> {{ d.degreeGranting || 'ให้ปริญญาเพียงสาขาวิชาเดียว' }}
        </div>
      </div>

      <div class="cp-item">
        <h3 class="cp-h3">5. สถานภาพของหลักสูตรและการพิจารณาอนุมัติ/เห็นชอบหลักสูตร</h3>
        <div class="cp-subitem whitespace-pre-line">{{ d.approvalStatus || '-' }}</div>

        <table v-if="d.approvals && d.approvals.length" class="cp-table mt-2">
          <thead>
            <tr>
              <th style="width: 45%;">คณะกรรมการ / สภา</th>
              <th style="width: 25%;">วัน-เดือน-ปี ที่อนุมัติ</th>
              <th style="width: 30%;">มติ / หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(app, idx) in d.approvals" :key="idx">
              <td>{{ app.committee || '-' }}</td>
              <td class="center">{{ app.approvalDate || '-' }}</td>
              <td>{{ app.note || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ===================================================== -->
    <!-- องค์ประกอบที่ 2 : ปรัชญา วัตถุประสงค์ ผลลัพธ์การเรียนรู้ -->
    <!-- ===================================================== -->
    <section class="cp-page cp-section-page">
      <div class="cp-obe">OBE 2</div>

      <h1 class="cp-doc-title">องค์ประกอบที่ 2 ปรัชญา วัตถุประสงค์ ผลลัพธ์การเรียนรู้</h1>

      <div class="cp-item">
        <h3 class="cp-h3">1. ปรัชญาของหลักสูตร</h3>
        <p class="cp-p">{{ d.philosophy || '-' }}</p>
      </div>

      <div class="cp-item">
        <h3 class="cp-h3">2. ความสำคัญของหลักสูตร</h3>
        <div class="cp-subitem">
          <h4 class="cp-h4">2.1 สถานการณ์ภายนอกหรือการพัฒนาที่จำเป็นต้องนำมาพิจารณาในการวางแผนหลักสูตร</h4>
          <p v-if="d.importanceOverview" class="cp-p">{{ d.importanceOverview }}</p>
          <div v-if="d.importanceEconomic" class="cp-sub-p"><b>ด้านเศรษฐกิจ :</b> {{ d.importanceEconomic }}</div>
          <div v-if="d.importanceSocial" class="cp-sub-p"><b>ด้านสังคม :</b> {{ d.importanceSocial }}</div>
          <div v-if="d.impactDevelopment" class="cp-sub-p"><b>ผลกระทบต่อการพัฒนาประเทศ :</b> {{ d.impactDevelopment }}</div>
        </div>

        <div class="cp-subitem mt-2">
          <h4 class="cp-h4">2.2 การพัฒนาตามแผนพัฒนาเศรษฐกิจฯ ยุทธศาสตร์ชาติ และแผนพัฒนาอุดมศึกษา</h4>
          <table v-if="d.developmentPlans && d.developmentPlans.length" class="cp-table mt-1">
            <thead>
              <tr>
                <th style="width: 35%;">แผนการพัฒนา/เปลี่ยนแปลง</th>
                <th style="width: 35%;">กลยุทธ์</th>
                <th style="width: 30%;">หลักฐาน/ตัวชี้วัด</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(plan, idx) in d.developmentPlans" :key="idx">
                <td>{{ plan.plan || '-' }}</td>
                <td>{{ plan.strategy || '-' }}</td>
                <td>{{ plan.indicator || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="d.universityMission" class="cp-subitem mt-2">
          <h4 class="cp-h4">2.3 ความสอดคล้องกับพันธกิจของมหาวิทยาลัย</h4>
          <p class="cp-p">{{ d.universityMission }}</p>
        </div>

        <div class="cp-subitem mt-2">
          <h4 class="cp-h4">2.4 ความสัมพันธ์กับหลักสูตรอื่นที่เปิดสอนในคณะ/ภาควิชาอื่นของสถาบัน</h4>
          <div class="cp-sub-p"><b>2.4.1 กลุ่มวิชา/รายวิชาที่ต้องเปิดสอนโดยคณะ/ภาควิชาอื่น :</b> {{ d.curriculumRelationExternal || 'ไม่มี' }}</div>
          <div class="cp-sub-p"><b>2.4.2 กลุ่มวิชา/รายวิชาที่ต้องเปิดสอนให้หลักสูตรอื่น :</b> {{ d.curriculumRelationInternal || 'ไม่มี' }}</div>
          <div class="cp-sub-p"><b>2.4.3 การบริหารจัดการ :</b> {{ d.curriculumRelationManagement || 'อาจารย์ผู้รับผิดชอบหลักสูตรเป็นผู้บริหารจัดการ' }}</div>
        </div>
      </div>

      <div class="cp-item">
        <h3 class="cp-h3">3. วัตถุประสงค์ของหลักสูตร (PEOs)</h3>
        <p class="cp-p-desc">หลักสูตรมีวัตถุประสงค์เพื่อผลิตบัณฑิตที่มีคุณลักษณะดังต่อไปนี้ (เมื่อสำเร็จการศึกษา 3–5 ปี)</p>
        <ol v-if="peos.length" class="cp-num-list">
          <li v-for="peo in peos" :key="peo.id">
            <b>{{ peo.code }} :</b> {{ peo.description }}
          </li>
        </ol>
        <div v-else class="cp-subitem">-</div>
      </div>

      <div class="cp-item">
        <h3 class="cp-h3">4. จุดเด่นเฉพาะของหลักสูตร</h3>
        <p class="cp-p">{{ d.uniqueness || '-' }}</p>
        <p v-if="d.competitorComparison" class="cp-p mt-1"><b>การเปรียบเทียบกับหลักสูตรคู่แข่ง :</b> {{ d.competitorComparison }}</p>
      </div>

      <div class="cp-item">
        <h3 class="cp-h3">5. อาชีพที่สามารถประกอบได้หลังสำเร็จการศึกษา</h3>
        <ol v-if="d.careers && d.careers.filter((c: string) => c.trim()).length" class="cp-num-list">
          <li v-for="(career, idx) in d.careers.filter((c: string) => c.trim())" :key="idx">
            {{ career }}
          </li>
        </ol>
        <div v-else class="cp-subitem">-</div>
        <p v-if="d.careerAnalysis" class="cp-p mt-1"><b>การวิเคราะห์ความต้องการตลาดแรงงาน :</b> {{ d.careerAnalysis }}</p>
      </div>

      <!-- 6. ผลลัพธ์การเรียนรู้ PLOs -->
      <div class="cp-item cp-break-before">
        <h3 class="cp-h3">6. ผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตร (PLOs)</h3>

        <h4 class="cp-h4 mt-2">6.1 วิธีการพัฒนา PLOs (ตารางกลุ่มผู้มีส่วนได้ส่วนเสีย)</h4>
        <table v-if="d.ploMethodRows && d.ploMethodRows.length" class="cp-table mt-1">
          <thead>
            <tr>
              <th style="width: 30%;">กลุ่มผู้มีส่วนได้ส่วนเสีย</th>
              <th style="width: 35%;">สิ่งที่ต้องทำได้/ได้ทำ</th>
              <th style="width: 35%;">คุณลักษณะที่คาดหวัง</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in d.ploMethodRows" :key="idx">
              <td>{{ row.stakeholder || '-' }}</td>
              <td>{{ row.expectedAbility || '-' }}</td>
              <td>{{ row.expectedCharacteristic || '-' }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="d.ploMethodCheck" class="cp-p mt-1"><b>การตรวจสอบ :</b> {{ d.ploMethodCheck }}</p>
        <p v-if="d.ploSummary" class="cp-p mt-1"><b>สรุปภาพรวม :</b> {{ d.ploSummary }}</p>

        <h4 class="cp-h4 mt-3">6.2 รายการผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตร (PLOs)</h4>
        <table v-if="plos.length" class="cp-table mt-1">
          <thead>
            <tr>
              <th style="width: 14%;">รหัส / ชนิด</th>
              <th style="width: 46%;">ผลลัพธ์การเรียนรู้ที่คาดหวัง (PLOs)</th>
              <th style="width: 20%;">กลยุทธ์การจัดการเรียนรู้</th>
              <th style="width: 20%;">กลยุทธ์การประเมินผล</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plo in plos" :key="plo.id">
              <td class="center">
                <b>{{ plo.code }}</b>
                <div class="text-xs text-gray-600">({{ plo.type === 'G' ? 'Generic' : 'Specific' }})</div>
              </td>
              <td>{{ plo.description || '-' }}</td>
              <td>{{ plo.teaching || '-' }}</td>
              <td>{{ plo.assessment || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <h4 class="cp-h4 mt-3">6.3 ความสอดคล้องกับมาตรฐานผลการเรียนรู้ตามกรอบมาตรฐานคุณวุฒิระดับอุดมศึกษา (TQF 4 ด้าน)</h4>
        <table v-if="d.tqfRows && d.tqfRows.length" class="cp-table mt-1">
          <thead>
            <tr>
              <th style="width: 35%;">มาตรฐานผลการเรียนรู้ตามกรอบ TQF</th>
              <th style="width: 65%;">รายละเอียดความสอดคล้อง</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tqf, idx) in d.tqfRows" :key="idx">
              <td><b>{{ tqf.standard }}</b></td>
              <td>{{ tqf.details || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <!-- 6.4 ตาราง PLO vs ทักษะ 4 ด้าน -->
        <h4 class="cp-h4 mt-3">6.4 ตารางแสดงความสัมพันธ์ระหว่าง PLOs กับทักษะและความสามารถ 4 ด้าน</h4>
        <table class="cp-table cp-matrix mt-1">
          <thead>
            <tr>
              <th style="width: 40%;">ผลลัพธ์การเรียนรู้ (PLOs)</th>
              <th style="width: 15%;">ความรู้</th>
              <th style="width: 15%;">ทักษะ</th>
              <th style="width: 15%;">จริยธรรม</th>
              <th style="width: 15%;">ลักษณะบุคคล</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plo in plos" :key="plo.id">
              <td><b>{{ plo.code }}</b> {{ plo.description }}</td>
              <td class="center">{{ checkMark(plo.skills?.knowledge) }}</td>
              <td class="center">{{ checkMark(plo.skills?.skills) }}</td>
              <td class="center">{{ checkMark(plo.skills?.ethics) }}</td>
              <td class="center">{{ checkMark(plo.skills?.character) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- 6.5 ตาราง PLO vs วิสัยทัศน์/พันธกิจ -->
        <h4 class="cp-h4 mt-3">6.5 ตารางแสดงความสัมพันธ์ระหว่าง PLOs กับวิสัยทัศน์และพันธกิจของมหาวิทยาลัย</h4>
        <table class="cp-table cp-matrix mt-1">
          <thead>
            <tr>
              <th style="width: 40%;">ผลลัพธ์การเรียนรู้ (PLOs)</th>
              <th style="width: 12%;">วิสัยทัศน์</th>
              <th v-for="(mission, mIdx) in missions" :key="mIdx" class="text-xs">
                พันธกิจ {{ mIdx + 1 }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plo in plos" :key="plo.id">
              <td><b>{{ plo.code }}</b> {{ plo.description }}</td>
              <td class="center">{{ checkMark(plo.vision?.vision) }}</td>
              <td v-for="(mission, mIdx) in missions" :key="mIdx" class="center">
                {{ checkMark(ploVisionMission(plo, mIdx)) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 6.6 ตาราง PLO vs Graduate Attributes -->
        <h4 class="cp-h4 mt-3">6.6 ตารางแสดงความสัมพันธ์ระหว่าง PLOs กับ Graduate Attributes</h4>
        <table class="cp-table cp-matrix mt-1">
          <thead>
            <tr>
              <th style="width: 40%;">ผลลัพธ์การเรียนรู้ (PLOs)</th>
              <th v-for="(ga, gIdx) in graduateAttributes" :key="gIdx" class="text-xs">
                GA {{ gIdx + 1 }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plo in plos" :key="plo.id">
              <td><b>{{ plo.code }}</b> {{ plo.description }}</td>
              <td v-for="(ga, gIdx) in graduateAttributes" :key="gIdx" class="center">
                {{ checkMark(ploGaAttr(plo, gIdx)) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 6.7 ตาราง PLO vs PEO -->
        <h4 class="cp-h4 mt-3">6.7 ตารางแสดงความสัมพันธ์ระหว่าง PLOs กับวัตถุประสงค์ของหลักสูตร (PEOs)</h4>
        <table class="cp-table cp-matrix mt-1">
          <thead>
            <tr>
              <th style="width: 45%;">ผลลัพธ์การเรียนรู้ (PLOs)</th>
              <th v-for="peo in peos" :key="peo.id" style="width: 11%;">{{ peo.code }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plo in plos" :key="plo.id">
              <td><b>{{ plo.code }}</b> {{ plo.description }}</td>
              <td v-for="peo in peos" :key="peo.id" class="center">
                {{ checkMark(ploPeoMatch(plo, peo.id)) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 7. ความคาดหวัง YLOs -->
      <div class="cp-item cp-break-before">
        <h3 class="cp-h3">7. ความคาดหวังของผลลัพธ์การเรียนรู้</h3>

        <h4 class="cp-h4 mt-2">7.1 ความคาดหวังของผลลัพธ์การเรียนรู้เมื่อสิ้นปีการศึกษา (YLOs)</h4>
        <div v-for="(yearYlos, yr) in ylosByYear" :key="yr" class="mb-3">
          <div class="font-bold text-sm text-[#2a2420] mb-1">ชั้นปีที่ {{ yr }} (YLO {{ yr }})</div>
          <table class="cp-table">
            <thead>
              <tr>
                <th style="width: 20%;">รหัส YLO</th>
                <th style="width: 80%;">ผลลัพธ์การเรียนรู้เมื่อสิ้นปีการศึกษา</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ylo in yearYlos" :key="ylo.id">
                <td class="center font-semibold">{{ ylo.code }}</td>
                <td>{{ ylo.description || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 class="cp-h4 mt-3">7.2 ตารางแสดงความสัมพันธ์ระหว่าง PLOs กับ YLOs</h4>
        <table class="cp-table cp-matrix mt-1">
          <thead>
            <tr>
              <th style="width: 35%;">ผลลัพธ์เมื่อสิ้นปี (YLOs)</th>
              <th v-for="plo in plos" :key="plo.id" class="text-xs">{{ plo.code }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ylo in ylos" :key="ylo.id">
              <td><b>{{ ylo.code }}</b> {{ ylo.description }}</td>
              <td v-for="plo in plos" :key="plo.id" class="center">
                {{ checkMark(yloPloMatch(ylo, plo.id)) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ===================================================== -->
    <!-- องค์ประกอบที่ 3 : โครงสร้างหลักสูตรและรายวิชา          -->
    <!-- ===================================================== -->
    <section class="cp-page cp-section-page cp-break-before">
      <div class="cp-obe">OBE 2</div>

      <h1 class="cp-doc-title">องค์ประกอบที่ 3 โครงสร้างหลักสูตร รายวิชาและหน่วยกิต</h1>

      <div v-if="curriculum.name" class="cp-curriculum-name">{{ curriculum.name }}</div>

      <div class="cp-total-row">
        <span>1. จำนวนหน่วยกิตที่เรียน รวมตลอดหลักสูตร</span>
        <b>{{ curriculum.totalCredit }} หน่วยกิต</b>
      </div>

      <h3 class="cp-h3 mt-4">2. โครงสร้างหลักสูตร</h3>

      <div class="cp-summary-list">
        <div
          v-for="node in allNodes"
          :key="node.id"
          class="cp-summary-row"
          :class="summaryDepthClass(node.depth)"
        >
          <div class="cp-summary-main">
            <div class="cp-summary-title">{{ node.title }}</div>
            <div v-if="node.note && node.type !== 'hour'" class="cp-note">{{ node.note }}</div>
          </div>
          <div v-if="node.req !== undefined" class="cp-summary-req">{{ formatReq(node) }}</div>
        </div>
      </div>

      <h3 class="cp-h3 cp-break-before mt-5">3. รายวิชาในแต่ละหมวดวิชาและจำนวนหน่วยกิต</h3>

      <div v-if="!hasAnyCourse" class="cp-empty-all">
        ยังไม่มีรายวิชาที่ถูกเพิ่มเข้าในโครงสร้างหลักสูตร
      </div>

      <div
        v-for="node in courseNodes"
        :key="node.id"
        class="cp-course-group"
        :class="summaryDepthClass(node.depth)"
      >
        <div class="cp-group-head">
          <span class="cp-group-title">{{ node.title }}</span>
          <span v-if="node.req !== undefined" class="cp-group-req">{{ formatReq(node) }}</span>
        </div>

        <div v-if="node.note && node.type !== 'hour'" class="cp-note cp-group-note">
          {{ node.note }}
        </div>

        <table v-if="node.courses.length" class="cp-course-table">
          <thead>
            <tr>
              <th class="cp-col-code">รหัสวิชา</th>
              <th class="cp-col-name">ชื่อวิชา</th>
              <th class="cp-col-credit">หน่วยกิต</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in node.courses" :key="course.code" class="cp-course-row">
              <td class="cp-col-code">{{ course.code }}</td>
              <td class="cp-col-name">
                <div class="cp-course-th">{{ course.nameTh || '-' }}</div>
                <div v-if="course.nameEn" class="cp-course-en">{{ course.nameEn }}</div>
              </td>
              <td class="cp-col-credit">{{ course.credits || '-' }}</td>
            </tr>
          </tbody>
        </table>

        <div v-else-if="!node.children?.length && node.type !== 'hour'" class="cp-empty-group">— ยังไม่มีรายวิชา —</div>
      </div>

      <!-- 4. คำอธิบายรายวิชา (Course Descriptions) -->
      <div class="cp-break-before">
        <h3 class="cp-h3 mt-5">4. คำอธิบายรายวิชา (Course Descriptions)</h3>

        <div v-if="!selectedCourses.length" class="cp-empty-all">
          ยังไม่มีรายวิชาในหลักสูตร
        </div>

        <div v-else class="cp-desc-container mt-3">
          <article v-for="c in selectedCourses" :key="c.code" class="cp-desc-card">
            <div class="cp-desc-header">
              <span class="cp-desc-code font-bold">{{ c.code }}</span>
              <span class="cp-desc-title-th font-bold">{{ c.nameTh }}</span>
              <span class="cp-desc-credits font-bold ml-auto">{{ c.credits }}</span>
            </div>
            <div v-if="c.nameEn" class="cp-desc-title-en font-semibold italic text-gray-700">
              ({{ c.nameEn }})
            </div>

            <div class="cp-desc-prereq mt-1">
              <div>
                <b>วิชาบังคับก่อน :</b>
                {{ (c.pre && c.pre.length) ? c.pre.join(', ') : 'ไม่มี' }}
              </div>
              <div>
                <b>Prerequisite :</b>
                {{ (c.pre && c.pre.length) ? c.pre.join(', ') : 'None' }}
              </div>
            </div>

            <div v-if="c.descTh" class="cp-desc-body-th mt-1.5">
              {{ c.descTh }}
            </div>
            <div v-if="c.descEn" class="cp-desc-body-en mt-1.5 italic text-gray-800">
              {{ c.descEn }}
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ===================================================== -->
    <!-- ภาคผนวก 2 : แผนภูมิแสดงความต่อเนื่องของหลักสูตร      -->
    <!-- ===================================================== -->
    <section class="cp-page cp-appendix">
      <div class="cp-obe">OBE 2</div>

      <div class="cp-appendix-head">
        <h2 class="cp-appendix-title">ภาคผนวก 2</h2>
        <h3 class="cp-appendix-subtitle">แผนภูมิแสดงความต่อเนื่องของหลักสูตร</h3>
        <div v-if="curriculum.name" class="cp-appendix-name">{{ curriculum.name }}</div>
      </div>

      <div class="cp-flow-wrap">
        <img
          v-if="flowImage"
          :src="flowImage"
          alt="แผนภูมิแสดงความต่อเนื่องของหลักสูตร"
          class="cp-flow-image"
        >
        <div v-else class="cp-flow-empty">
          ไม่พบแผนภูมิ กรุณาเพิ่มรายวิชาในแท็บ “แผนภูมิความต่อเนื่อง” ก่อนพิมพ์
        </div>
      </div>
    </section>

  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');

/* ซ่อนบนหน้าจอปกติ แสดงเฉพาะตอนสั่งพิมพ์ */
.print-root {
  display: none;
}

@page {
  size: A4 portrait;
  margin: 18mm 15mm 15mm 20mm;
}

@page appendix2 {
  size: A4 landscape;
  margin: 10mm 12mm;
}

@media print {
  html,
  body {
    background: #fff !important;
    margin: 0 !important;
    padding: 0 !important;
    color: #000 !important;
  }

  /* ซ่อน UI ทั้งหมดของเว็บแอพ */
  .top-nav,
  .side-nav,
  .obe-nav,
  .builder-header,
  .builder-container,
  body > :not(#__nuxt),
  #teleports,
  #nuxt-devtools-container,
  nuxt-devtools-inspect-panel,
  #vue-tracer-overlay {
    display: none !important;
  }

  #__nuxt,
  .shell-layout,
  .body-area,
  .main-content {
    display: contents !important;
    height: auto !important;
    min-height: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
    background: transparent !important;
  }

  .print-root {
    display: block !important;
    color: #000;
    font-family: 'Sarabun', 'TH Sarabun New', 'Noto Sans Thai', sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .cp-page {
    display: block;
    page-break-after: always;
    break-after: page;
  }

  .cp-break-before {
    break-before: page;
    page-break-before: always;
  }

  .cp-obe {
    display: block;
    text-align: right;
    font-size: 9.5pt;
    font-weight: 600;
    color: #444;
    margin-bottom: 3mm;
  }

  /* หน้าปก */
  .cp-cover-page {
    height: 250mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    padding-top: 30mm;
  }
  .cp-cover-inner {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .cp-cover-badge {
    font-size: 14pt;
    font-weight: 600;
    color: #555;
    margin-bottom: 12mm;
    letter-spacing: 0.5px;
  }
  .cp-cover-program {
    font-size: 22pt;
    font-weight: 700;
    line-height: 1.4;
    margin: 0 0 6mm;
    color: #000;
  }
  .cp-cover-degree {
    font-size: 16pt;
    font-weight: 600;
    margin-bottom: 4mm;
  }
  .cp-cover-year {
    font-size: 14pt;
    color: #333;
    margin-bottom: 10mm;
  }
  .cp-cover-foot {
    margin-bottom: 25mm;
  }
  .cp-cover-inst {
    font-size: 15pt;
    font-weight: 600;
    color: #000;
  }

  /* สารบัญ */
  .cp-toc-page {
    padding-top: 5mm;
  }
  .cp-toc-list {
    margin-top: 6mm;
  }
  .cp-toc-row {
    display: flex;
    align-items: baseline;
    gap: 4mm;
    font-size: 11.5pt;
    margin-top: 3mm;
  }
  .cp-toc-title {
    color: #000;
    white-space: nowrap;
  }
  .cp-toc-dots {
    flex: 1;
    border-bottom: 1px dotted #888;
    height: 1em;
  }
  .cp-toc-badge {
    font-size: 10.5pt;
    font-weight: 600;
    color: #444;
    white-space: nowrap;
  }
  .cp-toc-subrow {
    padding-left: 8mm;
    font-size: 10.5pt;
    color: #333;
    line-height: 1.6;
  }

  /* หัวข้อเอกสาร */
  .cp-doc-title {
    font-size: 15pt;
    font-weight: 700;
    text-align: left;
    margin: 0 0 4mm;
    color: #000;
    line-height: 1.35;
  }

  .cp-curriculum-name {
    font-size: 12pt;
    font-weight: 600;
    margin: -1mm 0 4mm;
  }

  .cp-h3 {
    font-size: 12.5pt;
    font-weight: 700;
    margin: 4mm 0 2mm;
    color: #000;
    break-after: avoid;
  }

  .cp-h4 {
    font-size: 11.5pt;
    font-weight: 600;
    margin: 3mm 0 1.5mm;
    color: #111;
    break-after: avoid;
  }

  .cp-p {
    text-indent: 10mm;
    text-align: justify;
    line-height: 1.55;
    margin-bottom: 2mm;
  }

  .cp-p-desc {
    line-height: 1.5;
    margin-bottom: 2mm;
  }

  .cp-sub-p {
    line-height: 1.5;
    margin-bottom: 1.5mm;
    padding-left: 4mm;
  }

  .cp-subitem {
    line-height: 1.55;
    margin-bottom: 1.5mm;
  }

  .cp-bullet-list {
    margin: 1.5mm 0 2mm 8mm;
    list-style: disc;
  }

  .cp-num-list {
    margin: 1.5mm 0 2mm 8mm;
    list-style: decimal;
  }
  .cp-num-list li {
    margin-bottom: 1.5mm;
    line-height: 1.5;
  }

  .cp-item {
    margin-bottom: 4mm;
    break-inside: auto;
  }

  /* ตาราง */
  .cp-table {
    width: 100%;
    border-collapse: collapse;
    margin: 2mm 0 4mm;
    table-layout: fixed;
    font-size: 10pt;
    line-height: 1.4;
  }

  .cp-table thead {
    display: table-header-group;
  }

  .cp-table tr {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .cp-table th {
    font-weight: 600;
    text-align: center;
    padding: 1.8mm 2mm;
    border: 0.3mm solid #000;
    background: #f0f0f0 !important;
    color: #000;
  }

  .cp-table td {
    padding: 1.8mm 2mm;
    border: 0.25mm solid #333;
    vertical-align: top;
    color: #000;
  }

  .cp-table td.center {
    text-align: center;
    font-weight: bold;
    font-size: 11pt;
  }

  /* ตารางเมทริกซ์ */
  .cp-matrix th {
    font-size: 9.5pt;
    padding: 1.2mm 1.5mm;
  }
  .cp-matrix td {
    font-size: 9.5pt;
    padding: 1.2mm 1.5mm;
  }

  /* โครงสร้างหลักสูตร (หมวด 3) */
  .cp-total-row {
    display: flex;
    justify-content: space-between;
    gap: 8mm;
    padding: 1.5mm 0;
    border-bottom: 0.4mm solid #000;
    font-size: 11pt;
  }
  .cp-total-row b {
    white-space: nowrap;
  }

  .cp-summary-list {
    margin-top: 1mm;
  }
  .cp-summary-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 6mm;
    padding: 1.2mm 0;
  }
  .cp-summary-main {
    min-width: 0;
  }
  .cp-summary-title {
    color: #000;
  }
  .cp-depth-0 .cp-summary-title {
    font-weight: 700;
    font-size: 11.5pt;
  }
  .cp-depth-1 {
    padding-left: 6mm;
  }
  .cp-depth-1 .cp-summary-title {
    font-weight: 600;
  }
  .cp-depth-2 {
    padding-left: 12mm;
  }
  .cp-depth-3 {
    padding-left: 18mm;
  }
  .cp-summary-req {
    white-space: nowrap;
    font-weight: 600;
    text-align: right;
  }
  .cp-note {
    font-size: 9.5pt;
    color: #333;
    padding-left: 4mm;
    margin-top: 0.4mm;
  }

  .cp-course-group {
    margin-bottom: 4mm;
    break-inside: avoid;
  }
  .cp-group-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 6mm;
    border-bottom: 0.35mm solid #555;
    padding-bottom: 1mm;
    break-after: avoid;
  }
  .cp-depth-0 .cp-group-title {
    font-weight: 700;
    font-size: 11.5pt;
  }
  .cp-depth-1 .cp-group-title {
    font-weight: 600;
  }
  .cp-group-req {
    white-space: nowrap;
    font-weight: 600;
  }
  .cp-group-note {
    margin: 1mm 0 1.5mm;
  }

  .cp-course-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1.5mm;
    table-layout: fixed;
  }
  .cp-course-table thead {
    display: table-header-group;
  }
  .cp-course-table th {
    font-weight: 600;
    text-align: left;
    padding: 1.2mm 1.5mm;
    border-bottom: 0.3mm solid #000;
    background: #f2f2f2 !important;
    font-size: 10pt;
  }
  .cp-course-table td {
    padding: 1.2mm 1.5mm;
    border-bottom: 0.2mm solid #bbb;
    vertical-align: top;
    font-size: 10pt;
  }
  .cp-course-row {
    break-inside: avoid;
  }
  .cp-col-code {
    width: 24mm;
    white-space: nowrap;
  }
  .cp-col-credit {
    width: 24mm;
    text-align: center;
    white-space: nowrap;
  }
  .cp-course-th {
    color: #000;
  }
  .cp-course-en {
    font-size: 9pt;
    color: #444;
    margin-top: 0.3mm;
  }
  .cp-empty-group,
  .cp-empty-all {
    color: #555;
    font-size: 10pt;
    padding: 1.5mm 0;
  }

  /* คำอธิบายรายวิชา (Course Descriptions) */
  .cp-desc-container {
    display: flex;
    flex-direction: column;
    gap: 4mm;
  }
  .cp-desc-card {
    border-bottom: 0.2mm solid #ccc;
    padding-bottom: 3.5mm;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .cp-desc-header {
    display: flex;
    align-items: baseline;
    gap: 3mm;
    font-size: 11pt;
  }
  .cp-desc-code {
    color: #000;
  }
  .cp-desc-title-th {
    color: #000;
  }
  .cp-desc-credits {
    color: #000;
    white-space: nowrap;
  }
  .cp-desc-title-en {
    font-size: 10pt;
    margin-top: 0.5mm;
    padding-left: 24mm;
  }
  .cp-desc-prereq {
    font-size: 9.5pt;
    color: #222;
    padding-left: 24mm;
    line-height: 1.45;
  }
  .cp-desc-body-th {
    font-size: 10pt;
    line-height: 1.55;
    text-align: justify;
    padding-left: 24mm;
    color: #000;
  }
  .cp-desc-body-en {
    font-size: 9.5pt;
    line-height: 1.5;
    text-align: justify;
    padding-left: 24mm;
    color: #222;
  }

  /* ภาคผนวก 2 */
  .cp-appendix {
    page: appendix2;
    break-before: page;
    break-after: avoid;
    page-break-after: avoid;
  }
  .cp-appendix-head {
    text-align: center;
  }
  .cp-appendix-title {
    font-size: 16pt;
    font-weight: 700;
    margin: 0 0 1.5mm;
    color: #000;
  }
  .cp-appendix-subtitle {
    font-size: 13pt;
    font-weight: 600;
    margin: 0;
    color: #000;
  }
  .cp-appendix-name {
    font-size: 10.5pt;
    margin-top: 1mm;
  }
  .cp-flow-wrap {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-top: 4mm;
  }
  .cp-flow-image {
    display: block;
    max-width: 100%;
    max-height: 175mm;
    width: auto;
    height: auto;
  }
  .cp-flow-empty {
    font-size: 10pt;
    color: #555;
    padding: 20mm 0;
  }
}
</style>
