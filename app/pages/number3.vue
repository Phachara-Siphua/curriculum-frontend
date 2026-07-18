<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { ref, onMounted, computed } from 'vue'

const route = useRoute()
const router = useRouter()

// ================= State ข้อมูลฟอร์มหน้า 3 =================
const programId = ref<string | null>(null) // รับ ID จากหน้า 2

onMounted(() => {
  if (route.query.id) {
    programId.value = route.query.id as string
    // [Backend Task]: ยิง API GET /programs/{id}/courses เพื่อดึงโครงสร้างและ Mapping
  }
})

const categories = ref([{ name: 'หมวดวิชาศึกษาทั่วไป', credits: 30 }, { name: 'หมวดวิชาเฉพาะ', credits: 96 }, { name: 'หมวดวิชาเลือกเสรี', credits: 6 }])
function addCategory() { categories.value.push({ name: '', credits: 0 }) }
function removeCategory(i: number) { categories.value.splice(i, 1) }

interface Subject { id: string; code: string; nameTh: string; nameEn: string; credits: string; isHighlight?: boolean }
interface Semester { id: string; year: number; term: number; subjects: Subject[] }
const allSubjects: Subject[] = [{ id: '010313005', code: '010313005', nameEn: 'Physics I', nameTh: 'ฟิสิกส์ I', credits: '3(3-0-6)' }, { id: '010313006', code: '010313006', nameEn: 'Physics Laboratory I', nameTh: 'ปฏิบัติการฟิสิกส์ I', credits: '1(0-2-1)' }, { id: '040203111', code: '040203111', nameEn: 'Engineering Mathematics I', nameTh: 'คณิตศาสตร์วิศวกรรม I', credits: '3(3-0-6)' }, { id: '030543300', code: '030543300', nameEn: 'Electrical and Electronics Drawing', nameTh: 'วงจรไฟฟ้าและอิเล็กทรอนิกส์', credits: '3(2-2-5)', isHighlight: true }, { id: '080103001', code: '080103001', nameEn: 'English I', nameTh: 'ภาษาอังกฤษ I', credits: '3(3-0-6)' }]
const semesters = ref<Semester[]>([{ id: 's1-1', year: 1, term: 1, subjects: [] }, { id: 's1-2', year: 1, term: 2, subjects: [] }, { id: 's2-1', year: 2, term: 1, subjects: [] }, { id: 's2-2', year: 2, term: 2, subjects: [] }, { id: 's3-1', year: 3, term: 1, subjects: [] }, { id: 's3-2', year: 3, term: 2, subjects: [] }, { id: 's4-1', year: 4, term: 1, subjects: [] }, { id: 's4-2', year: 4, term: 2, subjects: [] }])

const showSearch = ref(false); const targetSemId = ref<string | null>(null); const searchQuery = ref(''); const totalCreditsInput = ref<number | null>(null)
const filteredSubjects = computed(() => { const q = searchQuery.value.trim().toLowerCase(); if (!q) return allSubjects; return allSubjects.filter(s => s.code.includes(q) || s.nameEn.toLowerCase().includes(q) || s.nameTh.includes(q)) })
function openSearch(semId: string) { targetSemId.value = semId; searchQuery.value = ''; showSearch.value = true }
function addSubjectToSem(subject: Subject) { const sem = semesters.value.find(s => s.id === targetSemId.value); if (!sem || sem.subjects.find(s => s.id === subject.id)) return; sem.subjects.push({ ...subject }); showSearch.value = false }
function removeSubject(semId: string, subjectId: string) { const sem = semesters.value.find(s => s.id === semId); if (sem) sem.subjects = sem.subjects.filter(s => s.id !== subjectId) }
function semCredits(sem: Semester) { return sem.subjects.reduce((acc, s) => acc + (parseInt(s.credits) || 0), 0) }

// ================= ระบบบันทึกข้อมูล (Save System) =================
const isSavingDraft = ref(false)
const isSavingNext = ref(false)

const saveDraft = async () => {
  isSavingDraft.value = true
  // 💾 DB: บันทึกข้อมูลลง PROGRAM (total_credits), COURSE_CATEGORY และ PROGRAM_COURSE อิงตาม programId.value
  await new Promise(r => setTimeout(r, 1000))
  isSavingDraft.value = false
  alert('บันทึกฉบับร่างเรียบร้อยแล้ว')
}

const saveAndNext = async () => {
  isSavingNext.value = true
  // 💾 DB: บันทึกข้อมูลหน้า 3 ลง Database
  await new Promise(r => setTimeout(r, 1000))
  isSavingNext.value = false
  router.push({ path: '/number4', query: { id: programId.value } })
}
// =============================================================
</script>

<template>
  <div class="w-full p-4 md:p-6">
    <UForm class="w-full">
      <div class="w-full shadow-md border border-gray-200 rounded-2xl overflow-hidden bg-white">
        
        <div class="bg-[#1a2744] px-6 py-5 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-[#c8a84b] flex items-center justify-center text-white font-bold">3</div>
          <p class="text-white font-bold text-xl tracking-wide font-sans m-0">โครงสร้างหลักสูตร รายวิชา และหน่วยกิต</p>
        </div>

        <div class="p-6 md:p-8 space-y-8">
          <!-- ❗❗❗ คอมเมนต์อ้างอิงตาม ER Diagram (image_ed9000.jpg) ❗❗❗ -->

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-200 shadow-sm">
            <p class="text-[#1a2744] font-bold text-lg border-b-2 border-[#c8a84b] pb-2 inline-block mb-4 m-0">1. จำนวนหน่วยกิตรวมตลอดหลักสูตร</p>
            <!-- ✅ DB: ตาราง PROGRAM (total_credits) -->
            <UFormField label="จำนวนหน่วยกิตรวม" :ui="{ label: 'text-gray-800 font-bold' }">
              <UInput v-model="totalCreditsInput" type="number" class="w-full md:w-1/3 bg-white" placeholder="เช่น 138" />
            </UFormField>
          </div>

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-200 shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <p class="text-[#1a2744] font-bold text-lg border-b-2 border-[#c8a84b] pb-2 m-0">2. โครงสร้างหลักสูตร</p>
              <UButton variant="outline" icon="i-heroicons-plus" class="border border-[#1a2744] text-[#1a2744] bg-white hover:bg-gray-50" @click="addCategory">
                เพิ่มหมวดวิชา
              </UButton>
            </div>
            
            <div v-for="(cat, i) in categories" :key="i" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-end bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <!-- ✅ DB: ตาราง COURSE_CATEGORY (program_id, name_th) -->
              <UFormField label="หมวดวิชา" :ui="{ label: 'text-gray-700 font-bold text-sm' }">
                <UInput v-model="cat.name" class="w-full bg-white" placeholder="เช่น หมวดวิชาศึกษาทั่วไป" />
              </UFormField>
              <div class="flex gap-3 items-end">
                <!-- ✅ DB: ตาราง COURSE_CATEGORY (required_credits) -->
                <UFormField label="จำนวนหน่วยกิต" :ui="{ label: 'text-gray-700 font-bold text-sm' }" class="flex-1">
                  <UInput v-model.number="cat.credits" type="number" class="w-full bg-white" placeholder="30" />
                </UFormField>
                <UButton icon="i-heroicons-trash" color="neutral" variant="soft" class="mb-0.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" @click="removeCategory(i)" />
              </div>
            </div>

            <div class="flex justify-between items-center mt-4 bg-[#243360] text-white rounded-lg p-4 shadow-inner">
              <p class="font-bold text-base m-0">รวมทั้งหมด</p>
              <p class="font-bold text-xl text-[#e8c96a] m-0">{{ categories.reduce((a, c) => a + (c.credits || 0), 0) }} <span class="text-sm font-normal text-white">หน่วยกิต</span></p>
            </div>
          </div>

          <div class="bg-[#faf8f4] p-6 rounded-xl border border-gray-200 shadow-sm">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 border-b-2 border-[#d8d2c6] pb-3">
              <div class="flex items-center gap-2">
                <p class="text-[#1a2744] font-bold text-lg m-0">3. แผนการศึกษา (Curriculum Mapping)</p>
                <UBadge variant="soft" class="font-bold rounded-lg bg-yellow-100 text-yellow-700"><UIcon name="i-heroicons-sparkles" class="mr-1"/> AI Assisted</UBadge>
              </div>
              <p class="text-gray-500 text-sm mt-2 md:mt-0 flex items-center gap-1 m-0">
                <UIcon name="i-heroicons-information-circle" class="w-5 h-5"/> ลากวางเพื่อย้ายวิชาระหว่างภาค
              </p>
            </div>

            <!-- ❌ DB: ตาราง PROGRAM_COURSE เชื่อมกับ PROGRAM_SEMESTER และ COURSE -->
            <div class="overflow-x-auto pb-4 custom-scrollbar w-full">
              <div class="flex gap-4 min-w-max px-2">
                <div v-for="sem in semesters" :key="sem.id" class="flex flex-col w-64 shadow-sm">
                  <div class="bg-[#1a2744] text-white text-center py-2 px-1 rounded-t-lg">
                    <p class="text-sm font-bold m-0">ปีที่ {{ sem.year }}</p>
                    <p class="text-xs text-[#e8c96a] m-0">ภาคเรียนที่ {{ sem.term }}</p>
                  </div>
                  <VueDraggable v-model="sem.subjects" group="subjects" :animation="200" ghost-class="opacity-30" class="flex-1 min-h-[10rem] bg-white border-x border-gray-200 p-2 space-y-2">
                    <div v-for="subject in sem.subjects" :key="subject.id" class="relative group rounded-lg border text-xs p-3 cursor-grab active:cursor-grabbing select-none transition-shadow hover:shadow-md" :class="subject.isHighlight ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'">
                      <button class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white hidden group-hover:flex items-center justify-center text-[10px] z-10 shadow-sm" @click.stop="removeSubject(sem.id, subject.id)">✕</button>
                      <p class="font-mono font-bold text-blue-900 text-xs mb-1 m-0">{{ subject.code }}</p>
                      <p class="font-medium leading-tight line-clamp-2 text-gray-800 text-xs mb-2 m-0">{{ subject.nameEn }}</p>
                      <UBadge color="neutral" variant="solid" class="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 border border-gray-200">{{ subject.credits }}</UBadge>
                    </div>
                  </VueDraggable>
                  <div class="bg-gray-50 border border-t-0 border-gray-200 rounded-b-lg px-3 py-2 flex items-center justify-between">
                    <span class="text-xs text-gray-600 font-bold m-0">{{ semCredits(sem) }} <span class="font-normal text-[10px]">หน่วยกิต</span></span>
                    <UButton icon="i-heroicons-plus" size="sm" color="neutral" variant="soft" class="rounded-full bg-white shadow-sm hover:bg-gray-100 border border-gray-200" @click="openSearch(sem.id)" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ปุ่ม Action -->
          <div class="pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
            <UButton :to="`/number2?id=${programId || ''}`" variant="ghost" class="text-gray-500 hover:text-[#1a2744] px-6 py-3 text-base bg-white hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 w-full md:w-auto text-center justify-center">← ย้อนกลับ</UButton>
            <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <UButton color="neutral" variant="outline" class="px-6 py-3 text-base font-bold rounded-xl border-gray-300 hover:bg-gray-50 bg-white justify-center" :loading="isSavingDraft" @click="saveDraft()">
                <UIcon name="i-heroicons-document-text" class="mr-2 w-5 h-5" /> บันทึกฉบับร่าง
              </UButton>
              <UButton class="bg-[#1a2744] hover:bg-[#243360] text-white px-8 py-3 text-lg font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-1 justify-center" :loading="isSavingNext" @click="saveAndNext()">
                บันทึกและถัดไป <UIcon name="i-heroicons-arrow-right" class="ml-2 w-5 h-5"/>
              </UButton>
            </div>
          </div>

        </div>
      </div>
    </UForm>
  </div>

  <!-- Search Modal -->
  <UModal v-model:open="showSearch" title="ค้นหารายวิชา" :ui="{ content: 'max-w-2xl' }">
    <template #body>
      <UInput v-model="searchQuery" placeholder="ค้นหารหัสวิชา หรือชื่อวิชา..." icon="i-heroicons-magnifying-glass" autofocus size="lg" class="mb-4" />
      <div class="max-h-96 overflow-y-auto space-y-2 pr-1">
        <div v-for="subject in filteredSubjects" :key="subject.id" class="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all" @click="addSubjectToSem(subject)">
          <div class="flex items-center gap-3">
            <UBadge :label="subject.code" color="neutral" :class="subject.isHighlight ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'" variant="soft" size="sm" />
            <div>
              <p class="font-bold text-sm text-gray-900 m-0">{{ subject.nameEn }}</p>
              <p class="text-xs text-gray-500 m-0">{{ subject.nameTh }}</p>
            </div>
          </div>
          <UBadge :label="subject.credits" color="neutral" variant="solid" size="sm" class="bg-gray-100 text-gray-700 border border-gray-200" />
        </div>
        <div v-if="filteredSubjects.length === 0" class="text-center py-10 text-gray-400">
          <UIcon name="i-heroicons-magnifying-glass" class="w-8 h-8 mx-auto mb-2" />
          <p class="text-sm m-0">ไม่พบรายวิชาที่ค้นหา</p>
        </div>
      </div>
    </template>
  </UModal>
</template>