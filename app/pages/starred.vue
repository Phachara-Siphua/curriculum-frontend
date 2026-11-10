<!-- pages/starred.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const API_BASE = useApiBase()
const demoUser = useDemoUser()
const { toggleFavorite, isFavoritePending } = useProgramFavorites()

const searchQuery = ref('')
const curriculums = ref<any[]>([])
const isLoading = ref(false)

const fetchPrograms = async () => {
  isLoading.value = true
  try {
    // ใช้ query ที่ backend มีอยู่แล้ว — ไม่ต้องเพิ่ม API
    const data = await $fetch<any[]>(`${API_BASE}/programs/`, {
      query: { user_id: demoUser.value.id, starred_only: true }
    })
    curriculums.value = data.map(p => ({
      id: p.id,
      name: p.name_th || p.name_en || 'หลักสูตรที่ยังไม่ตั้งชื่อ',
      progress: p.progress,
      star: !!p.is_starred,
      upd: p.updated_at
        ? new Date(p.updated_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'ไม่ทราบ',
      type: p.curriculum_type === 'revision' ? 'rev' : 'new'
    }))
  } catch (err) {
    console.error('Failed to load starred programs:', err)
  } finally {
    isLoading.value = false
  }
}

const starredList = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return curriculums.value.filter(c => c.star && c.name.toLowerCase().includes(q))
})

const toggleStar = async (program: any) => {
  await toggleFavorite(program)
}

onMounted(() => {
  fetchPrograms()
})
</script>


<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="text-[#3D3D3D]">หลักสูตรติดดาว</h1>
        <div class="mute">หลักสูตรที่คุณทำเครื่องหมายดาวไว้</div>
      </div>
      <div class="search-wrap">
        <UIcon name="i-heroicons-magnifying-glass" class="search-ico" />
        <input v-model="searchQuery" class="in search-in" placeholder="ค้นหาหลักสูตรที่ติดดาว...">
      </div>
    </div>

    <div v-if="starredList.length === 0" class="empty-state">
      <UIcon name="i-heroicons-star" class="w-10 h-10 text-[#6f6961] mb-2" />
      <p class="mute">ยังไม่มีหลักสูตรติดดาว กดรูปดาวที่มุมการ์ดเพื่อปักหมุดไว้ที่นี่</p>
    </div>

    <div v-else class="grid">
      <div v-for="c in starredList" :key="c.id" class="card-box">
        <button class="card st" @click="$router.push(`/curriculum/${c.id}?type=${c.type}`)">
          <div class="thumb text-[#9C7853]">ใหม่</div>
          <div class="cb">
            <b class="text-[#3D3D3D]">{{ c.name }}</b>
            <div class="text-[#6f6961] text-[13px]" style="margin:6px 0 4px">แก้ไขล่าสุดเมื่อ {{ c.upd }}</div>
            <div class="bar"><i :style="{ width: c.progress + '%' }"></i></div>
            <div class="text-[#6f6961] text-[13px]" style="margin-top: 4px;">ความคืบหน้า {{ c.progress }}%</div>
          </div>
        </button>
        <button
          class="star-btn on"
          :class="{ loading: isFavoritePending(c.id) }"
          :disabled="isFavoritePending(c.id)"
          aria-label="เอาดาวออก"
          @click.stop="toggleStar(c)"
        >
          <UIcon name="i-heroicons-star-solid" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 14px; margin-bottom: 20px; }
.search-wrap { position: relative; width: 280px; }
.search-ico { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #6f6961; }
.search-in { padding-left: 32px; background: #fff !important; }

.empty-state { text-align: center; padding: 60px 20px; border: 1px dashed #e3dcd1; border-radius: 12px; background: #FFFDFA; margin-top: 10px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
.card-box { position: relative; }
.card { background: #FFFDFA; border: 1px solid #9C7853; border-radius: 12px; overflow: hidden; text-align: left; padding: 0; display: block; width: 100%; transition: 0.15s; }
.thumb { height: 84px; background: #f0e6d8; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 600; }
.cb { padding: 12px 14px; }
.cb b { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 44px; line-height: 1.45; font-size: 14.5px; }
.bar { height: 6px; border-radius: 3px; background: #ece6dc; overflow: hidden; margin-top: 8px; }
.bar i { display: block; height: 100%; background: #9C7853; }
.star-btn { position: absolute; top: 8px; right: 8px; width: 30px; height: 30px; border-radius: 50%; border: 1px solid #f59e0b; background: #FFFDFA; color: #f59e0b; display: flex; align-items: center; justify-content: center; z-index: 5; transition: 0.15s; }
.star-btn:disabled { opacity: 0.6; cursor: wait; }
.star-btn.loading :deep(svg) { animation: star-pulse 0.8s ease-in-out infinite; }
@keyframes star-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.8); } }
</style>