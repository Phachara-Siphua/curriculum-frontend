<!-- pages/index.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'

const filter = ref('all')
const searchQuery = ref('')

// 🌟 ดึงข้อมูลจาก Global State
const curriculums = useCurriculums()

const filteredCurriculums = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return curriculums.value.filter(c => {
    const matchFilter = filter.value === 'all' || c.type === filter.value
    const matchSearch = c.name.toLowerCase().includes(q)
    return matchFilter && matchSearch
  })
})

// ฟังก์ชัน Toggle ติดดาว
const toggleStar = (id: number) => {
  const target = curriculums.value.find(c => c.id === id)
  if (target) target.star = !target.star
}
</script>

<template>
  <div>
    <!-- หัวเรื่องหน้า + แถบค้นหาในหน้าแรก -->
    <div class="page-header">
      <div>
        <h1 class="text-[#3D3D3D]">หน้าแรก</h1>
        <div class="text-[#6f6961] text-[13px]">เลือกหลักสูตรเพื่อเปิดจัดทำเล่มหลักสูตร</div>
      </div>
      <div class="search-wrap">
        <UIcon name="i-heroicons-magnifying-glass" class="search-ico" />
        <input v-model="searchQuery" class="in search-in" placeholder="ค้นหาชื่อหลักสูตร...">
      </div>
    </div>

    <!-- Filter Chips -->
    <div class="chips">
      <button class="chip" :class="{ on: filter === 'all' }" @click="filter = 'all'">ทั้งหมด</button>
      <button class="chip" :class="{ on: filter === 'new' }" @click="filter = 'new'">หลักสูตรใหม่</button>
    </div>

    <!-- Grid แสดงไฟล์หลักสูตร -->
    <div class="grid">
      <div v-for="c in filteredCurriculums" :key="c.id" class="card-box">
        <button class="card" :class="{ st: c.star }" @click="$router.push(`/curriculum/${c.id}?type=${c.type}`)">
          <div class="thumb text-[#9C7853]">ใหม่</div>
          <div class="cb">
            <b class="text-[#3D3D3D]">{{ c.name || 'หลักสูตรที่ยังไม่ตั้งชื่อ' }}</b>
            <div class="text-[#6f6961] text-[13px]" style="margin:6px 0 4px">
              แก้ไขล่าสุดเมื่อ {{ c.upd }}
            </div>
            <div class="bar"><i :style="{ width: c.progress + '%' }"></i></div>
            <div class="text-[#6f6961] text-[13px]" style="margin-top: 4px;">ความคืบหน้า {{ c.progress }}%</div>
          </div>
        </button>
        <!-- 🌟 กดติดดาว -->
        <button class="star-btn" :class="{ on: c.star }" @click.stop="toggleStar(c.id)">
          <UIcon :name="c.star ? 'i-heroicons-star-solid' : 'i-heroicons-star'" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 14px; margin-bottom: 16px; }
.search-wrap { position: relative; width: 280px; }
.search-ico { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #6f6961; }
.search-in { padding-left: 32px; background: #fff !important; }

.chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
.chip { border: 1px solid #e3dcd1; background: #FFFDFA; border-radius: 8px; padding: 5px 14px; font-size: 13px; font-weight: 500; color: #3D3D3D; transition: 0.15s; }
.chip:hover { background: #ece6dc; }
.chip.on { background: #f0e6d8; border-color: #9C7853; color: #86643f; font-weight: 600; }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
.card-box { position: relative; }
.card { background: #FFFDFA; border: 1px solid #e3dcd1; border-radius: 12px; overflow: hidden; text-align: left; padding: 0; display: block; width: 100%; transition: 0.15s; }
.card:hover { border-color: #9C7853; box-shadow: 0 4px 14px rgba(0,0,0,0.06); }

.thumb { height: 84px; background: #f0e6d8; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 600; }
.cb { padding: 12px 14px; }
.cb b { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 44px; line-height: 1.45; font-size: 14.5px; }

.bar { height: 6px; border-radius: 3px; background: #ece6dc; overflow: hidden; margin-top: 8px; }
.bar i { display: block; height: 100%; background: #9C7853; }

.star-btn { position: absolute; top: 8px; right: 8px; width: 30px; height: 30px; border-radius: 50%; border: 1px solid #e3dcd1; background: #FFFDFA; color: #6f6961; display: flex; align-items: center; justify-content: center; transition: 0.15s; z-index: 5; }
.star-btn:hover { color: #f59e0b; border-color: #f59e0b; }
.star-btn.on { color: #f59e0b; border-color: #f59e0b; }
.card.st { border-color: #9C7853; }
</style>