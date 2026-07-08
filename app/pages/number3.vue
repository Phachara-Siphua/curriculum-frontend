<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'

// --- Section 2: Course categories (dynamic) ---
const categories = ref([
  { name: 'หมวดวิชาศึกษาทั่วไป', credits: 30 },
  { name: 'หมวดวิชาเฉพาะ', credits: 96 },
  { name: 'หมวดวิชาเลือกเสรี', credits: 6 },
])

function addCategory() {
  categories.value.push({ name: '', credits: 0 })
}

function removeCategory(i: number) {
  categories.value.splice(i, 1)
}

// --- Section 3: Subject types ---
interface Subject {
  id: string
  code: string
  nameTh: string
  nameEn: string
  credits: string
  isHighlight?: boolean
}

interface Semester {
  id: string
  year: number
  term: number
  subjects: Subject[]
}

// Subject pool for search
const allSubjects: Subject[] = [
  { id: '010313005', code: '010313005', nameEn: 'Physics I', nameTh: 'ฟิสิกส์ I', credits: '3(3-0-6)' },
  { id: '010313006', code: '010313006', nameEn: 'Physics Laboratory I', nameTh: 'ปฏิบัติการฟิสิกส์ I', credits: '1(0-2-1)' },
  { id: '040203111', code: '040203111', nameEn: 'Engineering Mathematics I', nameTh: 'คณิตศาสตร์วิศวกรรม I', credits: '3(3-0-6)' },
  { id: '040203112', code: '040203112', nameEn: 'Engineering Mathematics II', nameTh: 'คณิตศาสตร์วิศวกรรม II', credits: '3(3-0-5)' },
  { id: '030543300', code: '030543300', nameEn: 'Electrical and Electronics Drawing', nameTh: 'วงจรไฟฟ้าและอิเล็กทรอนิกส์', credits: '3(2-2-5)', isHighlight: true },
  { id: '030543920', code: '030543920', nameEn: 'Computer Programing', nameTh: 'การโปรแกรมคอมพิวเตอร์', credits: '3(2-2-5)', isHighlight: true },
  { id: '030543101', code: '030543101', nameEn: 'Signal and System', nameTh: 'สัญญาณและระบบ', credits: '3(3-0-6)', isHighlight: true },
  { id: '030543188', code: '030543188', nameEn: 'Electronic Materials', nameTh: 'วัสดุอิเล็กทรอนิกส์', credits: '2(2-0-4)', isHighlight: true },
  { id: '030543311', code: '030543311', nameEn: 'Digital and Logic Design', nameTh: 'ดิจิทัลและการออกแบบลอจิก', credits: '3(2-2-5)', isHighlight: true },
  { id: '030413100', code: '030413100', nameEn: 'Electric Circuit Analysis I', nameTh: 'การวิเคราะห์วงจรไฟฟ้า I', credits: '3(2-4-6)' },
  { id: '030413221', code: '030413221', nameEn: 'Electric Circuit Analysis Laboratory', nameTh: 'ปฏิบัติการวิเคราะห์วงจรไฟฟ้า', credits: '1(0-3-1)' },
  { id: '030543303', code: '030543303', nameEn: 'Electronics Practice I', nameTh: 'อิเล็กทรอนิกส์ปฏิบัติ I', credits: '2(0-6-2)' },
  { id: '080103001', code: '080103001', nameEn: 'English I', nameTh: 'ภาษาอังกฤษ I', credits: '3(3-0-6)' },
  { id: '080103002', code: '080103002', nameEn: 'English II', nameTh: 'ภาษาอังกฤษ II', credits: '3(3-0-6)' },
  { id: '040113001', code: '040113001', nameEn: 'Chemistry for Engineers', nameTh: 'เคมีสำหรับวิศวกร', credits: '3(3-0-6)' },
  { id: '040313015', code: '040313015', nameEn: 'Physics II', nameTh: 'ฟิสิกส์ II', credits: '1(0-3-1)' },
  { id: '030543304', code: '030543304', nameEn: 'Electronics Practice II', nameTh: 'อิเล็กทรอนิกส์ปฏิบัติ II', credits: '2(0-6-2)' },
  { id: '030543307', code: '030543307', nameEn: 'Advanced Digital System Design Using HDL', nameTh: 'การออกแบบระบบดิจิทัลขั้นสูง', credits: '3(2-2-5)' },
  { id: '030543100', code: '030543100', nameEn: 'Principles of Communication', nameTh: 'หลักการสื่อสาร', credits: '3(3-0-6)' },
  { id: '030543310', code: '030543310', nameEn: 'Electrical Measurement and Instrument', nameTh: 'การวัดและเครื่องมือวัดทางไฟฟ้า', credits: '3(2-2-5)' },
  { id: '030543102', code: '030543102', nameEn: 'Electromagnetic Fields and Waves', nameTh: 'สนามแม่เหล็กไฟฟ้าและคลื่น', credits: '3(3-0-6)', isHighlight: true },
  { id: '030543305', code: '030543305', nameEn: 'Printed Circuit Board Design', nameTh: 'การออกแบบแผงวงจรพิมพ์', credits: '3(2-2-5)' },
  { id: '030543164', code: '030543164', nameEn: 'Microelectronics', nameTh: 'ไมโครอิเล็กทรอนิกส์', credits: '3(3-0-6)', isHighlight: true },
  { id: '030543306', code: '030543306', nameEn: 'Microcontroller and Applications', nameTh: 'ไมโครคอนโทรลเลอร์และการประยุกต์ใช้', credits: '3(2-2-5)' },
  { id: '030513100', code: '030513100', nameEn: 'Power Electronics', nameTh: 'อิเล็กทรอนิกส์กำลัง', credits: '3(3-0-6)', isHighlight: true },
  { id: '030513108', code: '030513108', nameEn: 'Embedded System and Electronics Design Project', nameTh: 'โครงงานระบบฝังตัวและการออกแบบ', credits: '3(0-6-3)', isHighlight: true },
  { id: '030543382', code: '030543382', nameEn: 'Embedded System and Internet of Things', nameTh: 'ระบบฝังตัวและอินเทอร์เน็ตของสรรพสิ่ง', credits: '3(2-2-5)' },
  { id: '080203914', code: '080203914', nameEn: 'Innovative Technopreneurs', nameTh: 'นวัตกรรมผู้ประกอบการเทคโนโลยี', credits: '3(3-0-6)' },
  { id: '030543400', code: '030543400', nameEn: 'Co-operative Education', nameTh: 'สหกิจศึกษา', credits: '6(540 Hours)' },
  { id: '080303701', code: '080303701', nameEn: 'Design Thinking', nameTh: 'การคิดเชิงออกแบบ', credits: '3(3-0-6)' },
]

// Semesters
const semesters = ref<Semester[]>([
  { id: 's1-1', year: 1, term: 1, subjects: [] },
  { id: 's1-2', year: 1, term: 2, subjects: [] },
  { id: 's2-1', year: 2, term: 1, subjects: [] },
  { id: 's2-2', year: 2, term: 2, subjects: [] },
  { id: 's3-1', year: 3, term: 1, subjects: [] },
  { id: 's3-2', year: 3, term: 2, subjects: [] },
  { id: 's4-1', year: 4, term: 1, subjects: [] },
  { id: 's4-2', year: 4, term: 2, subjects: [] },
])

// Search modal state
const showSearch = ref(false)
const targetSemId = ref<string | null>(null)
const searchQuery = ref('')

const filteredSubjects = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return allSubjects
  return allSubjects.filter(s =>
    s.code.includes(q) ||
    s.nameEn.toLowerCase().includes(q) ||
    s.nameTh.includes(q)
  )
})

function openSearch(semId: string) {
  targetSemId.value = semId
  searchQuery.value = ''
  showSearch.value = true
}

function addSubjectToSem(subject: Subject) {
  const sem = semesters.value.find(s => s.id === targetSemId.value)
  if (!sem || sem.subjects.find(s => s.id === subject.id)) return
  sem.subjects.push({ ...subject })
  showSearch.value = false
}

function removeSubject(semId: string, subjectId: string) {
  const sem = semesters.value.find(s => s.id === semId)
  if (sem) sem.subjects = sem.subjects.filter(s => s.id !== subjectId)
}

function semCredits(sem: Semester) {
  return sem.subjects.reduce((acc, s) => acc + (parseInt(s.credits) || 0), 0)
}

const totalCreditsInput = ref<number | null>(null)
</script>

<template>

<div class="w-full p-4 md:p-6">    <UForm class="w-full">
      <UCard class="w-full shadow-sm border border-gray-200 rounded-xl"
        :ui="{ root: 'bg-white', header: 'bg-blue-950 px-6 py-4', body: 'px-6 py-6' }">
        <template #header>
          <p class="text-white font-semibold text-lg">
            องค์ประกอบที่ 3: โครงสร้างหลักสูตร รายวิชา และหน่วยกิต
          </p>
        </template>

        <!-- ───── Section 1: Total credits ───── -->
        <p class="text-blue-950 font-bold text-base mb-3 mt-2">
          1. จำนวนหน่วยกิตรวมตลอดหลักสูตร
        </p>

        <UFormField label="จำนวนหน่วยกิตรวม" :ui="{ label: 'text-black text-lg' }" class="mb-4">
          <UInput
            v-model="totalCreditsInput"
            class="w-full"
            type="number"
            :ui="{ base: 'bg-gray-100' }"
            placeholder="เช่น 138"
          />
        </UFormField>

        <UDivider class="my-5" />

        <!-- ───── Section 2: Course structure ───── -->
        <p class="text-blue-950 font-bold text-base mb-3">
          2. โครงสร้างหลักสูตร
        </p>

        <div
          v-for="(cat, i) in categories"
          :key="i"
          class="grid grid-cols-2 gap-4 mb-3 items-end"
        >
          <UFormField label="หมวดวิชา" :ui="{ label: 'text-black text-sm' }">
            <UInput
              v-model="cat.name"
              class="w-full"
              :ui="{ base: 'bg-gray-100' }"
              placeholder="เช่น หมวดวิชาศึกษาทั่วไป"
            />
          </UFormField>
          <div class="flex gap-2 items-end">
            <UFormField label="จำนวนหน่วยกิต" :ui="{ label: 'text-black text-sm' }" class="flex-1">
              <UInput
                v-model.number="cat.credits"
                class="w-full"
                type="number"
                :ui="{ base: 'bg-gray-100' }"
                placeholder="30"
              />
            </UFormField>
            <UButton
              icon="i-heroicons-trash"
              color="error"
              variant="ghost"
              size="sm"
              class="mb-0.5"
              @click="removeCategory(i)"
            />
          </div>
        </div>

        <!-- Total row -->
        <div class="grid grid-cols-2 gap-4 mb-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p class="text-blue-950 font-bold text-sm self-center">รวมทั้งหมด</p>
          <p class="text-blue-950 font-bold text-sm">
            {{ categories.reduce((a, c) => a + (c.credits || 0), 0) }} หน่วยกิต
          </p>
        </div>

        <UButton
          variant="outline"
          icon="i-heroicons-plus"
          class="mb-4"
          @click="addCategory"
        >
          เพิ่มหมวดวิชา
        </UButton>

        <UDivider class="my-5" />

        <!-- ───── Section 3: Curriculum map ───── -->
        <p class="text-blue-950 font-bold text-base mb-1">
          3. รายวิชาในหลักสูตร
        </p>
        <p class="text-gray-400 text-xs mb-4">
          กด <span class="font-bold text-blue-950">+</span> ในแต่ละภาคการศึกษาเพื่อเพิ่มรายวิชา · ลากวางเพื่อย้ายระหว่างภาค
        </p>

        <!-- Semester columns -->
        <div class="overflow-x-auto pb-2">
          <div class="flex gap-2 min-w-max">
            <div
              v-for="sem in semesters"
              :key="sem.id"
              class="flex flex-col w-44"
            >
              <!-- Header -->
              <div class="bg-blue-950 text-white text-center text-xs font-bold py-2 rounded-t-lg leading-tight">
                <p>ปีที่ {{ sem.year }}</p>
                <p class="opacity-75">ภาคเรียนที่ {{ sem.term }}</p>
              </div>

              <!-- Draggable area -->
              <VueDraggable
                v-model="sem.subjects"
                group="subjects"
                :animation="200"
                ghost-class="opacity-30"
                class="flex-1 min-h-28 bg-gray-50 border-x border-gray-200 p-1.5 space-y-1.5"
              >
                <div
                  v-for="subject in sem.subjects"
                  :key="subject.id"
                  class="relative group rounded border text-xs p-2 cursor-grab active:cursor-grabbing select-none"
                  :class="subject.isHighlight
                    ? 'bg-blue-600 border-blue-700 text-white'
                    : 'bg-white border-gray-300 text-gray-800'"
                >
                  <button
                    class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white hidden group-hover:flex items-center justify-center text-[10px] z-10"
                    @click.stop="removeSubject(sem.id, subject.id)"
                  >
                    ✕
                  </button>
                  <p class="font-mono font-semibold text-[10px] leading-tight">{{ subject.code }}</p>
                  <p class="text-[10px] opacity-60 leading-tight">{{ subject.credits }}</p>
                  <p class="mt-0.5 font-medium leading-tight line-clamp-2 text-[11px]">{{ subject.nameEn }}</p>
                </div>
              </VueDraggable>

              <!-- Footer -->
              <div class="bg-gray-100 border border-t-0 border-gray-200 rounded-b-lg px-2 py-1.5 flex items-center justify-between">
                <span class="text-[11px] text-gray-500 font-mono">{{ semCredits(sem) }} หน่วยกิต</span>
                <UButton
                  icon="i-heroicons-plus"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  @click="openSearch(sem.id)"
                />
              </div>
            </div>
          </div>
        </div>

        <UButton class="bg-blue-950 text-white mt-6">
          ถัดไป
        </UButton>
      </UCard>
    </UForm>
  </div>

  <!-- ───── Search Modal ───── -->
  <UModal v-model:open="showSearch" title="ค้นหารายวิชา" :ui="{ content: 'max-w-2xl' }">
    <template #body>
      <UInput
        v-model="searchQuery"
        placeholder="ค้นหารหัสวิชา หรือชื่อวิชา..."
        icon="i-heroicons-magnifying-glass"
        autofocus
        size="lg"
        class="mb-4"
      />

      <div class="max-h-96 overflow-y-auto space-y-2 pr-1">
        <div
          v-for="subject in filteredSubjects"
          :key="subject.id"
          class="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-950 hover:bg-blue-50 cursor-pointer transition-all"
          @click="addSubjectToSem(subject)"
        >
          <div class="flex items-center gap-3">
            <UBadge
              :label="subject.code"
              :color="subject.isHighlight ? 'info' : 'neutral'"
              variant="subtle"
              size="sm"
            />
            <div>
              <p class="font-medium text-sm text-gray-900">{{ subject.nameEn }}</p>
              <p class="text-xs text-gray-500">{{ subject.nameTh }}</p>
            </div>
          </div>
          <UBadge :label="subject.credits" color="neutral" variant="outline" size="sm" />
        </div>

        <div v-if="filteredSubjects.length === 0" class="text-center py-10 text-gray-400">
          <UIcon name="i-heroicons-magnifying-glass" class="w-8 h-8 mx-auto mb-2" />
          <p class="text-sm">ไม่พบรายวิชาที่ค้นหา</p>
        </div>
      </div>
    </template>
  </UModal>
</template>