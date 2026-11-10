<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  leftTitle?: string
  rightTitle?: string
  loading?: boolean
  versions?: any[]
  emptyText?: string
}>(), {
  title: 'AI ช่วยร่าง',
  leftTitle: 'ข้อมูลปัจจุบัน',
  rightTitle: 'ฉบับร่างจาก AI',
  loading: false,
  versions: () => [],
  emptyText: 'ยังไม่มีฉบับร่าง กด “ให้ AI ร่าง / เจนใหม่” เพื่อเริ่ม'
})

const emit = defineEmits<{
  'update:open': [boolean]
  generate: []
  apply: [version: any]
}>()

const close = () => emit('update:open', false)

// AI รันบนเครื่อง (Ollama) จึงอาจใช้เวลาหลายนาทีในครั้งแรก
// แสดงเวลาที่รอเพื่อให้ผู้ใช้รู้ว่าระบบยังทำงานอยู่ และไม่กดซ้ำจนงานไปต่อคิว
const elapsedSeconds = ref(0)
let elapsedTimer: ReturnType<typeof setInterval> | null = null

const stopElapsedTimer = () => {
  if (elapsedTimer) {
    clearInterval(elapsedTimer)
    elapsedTimer = null
  }
}

const startElapsedTimer = () => {
  stopElapsedTimer()
  elapsedSeconds.value = 0
  elapsedTimer = setInterval(() => { elapsedSeconds.value += 1 }, 1000)
}

watch(() => props.loading, (loading) => {
  if (loading) startElapsedTimer()
  else stopElapsedTimer()
}, { immediate: true })

onUnmounted(stopElapsedTimer)

const elapsedLabel = computed(() => {
  const minutes = Math.floor(elapsedSeconds.value / 60)
  const seconds = elapsedSeconds.value % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="ai-modal-overlay" @click.self="close">
      <div class="ai-modal-panel" role="dialog" aria-modal="true">
        <header class="ai-modal-head">
          <div>
            <h3>{{ title }}</h3>
            <p>เปรียบเทียบข้อความเดิมกับฉบับที่ AI ร่าง แล้วเลือกฉบับที่ต้องการ</p>
          </div>
          <button type="button" class="ai-modal-close" title="ปิด" @click="close">✕</button>
        </header>

        <div class="ai-modal-body">
          <section class="ai-modal-col">
            <div class="ai-col-head">
              <span>{{ leftTitle }}</span>
              <small>แก้ไขได้</small>
            </div>
            <div class="ai-col-scroll">
              <slot name="left" />
            </div>
          </section>

          <section class="ai-modal-col">
            <div class="ai-col-head">
              <span>{{ rightTitle }}</span>
              <small>{{ versions.length }} ฉบับ</small>
            </div>
            <div class="ai-col-scroll">
              <div v-if="!versions.length && !loading" class="ai-empty">{{ emptyText }}</div>
              <div v-if="loading && !versions.length" class="ai-empty">
                กำลังให้ AI ร่าง... (ใช้เวลา {{ elapsedLabel }})
                <br>
                AI รันบนเครื่องนี้ อาจใช้เวลา 1–5 นาที (ครั้งแรกอาจนานกว่า) กรุณารอสักครู่
              </div>
              <article
                v-for="(version, index) in versions"
                :key="version.id || index"
                class="ai-version-card"
              >
                <div class="ai-version-head">
                  <span>ฉบับที่ {{ versions.length - index }}</span>
                  <button type="button" class="ai-use-btn" @click="emit('apply', version)">ใช้ฉบับนี้</button>
                </div>
                <div class="ai-version-body">
                  <slot name="version" :version="version">{{ version.text }}</slot>
                </div>
              </article>
            </div>
          </section>
        </div>

        <footer class="ai-modal-foot">
          <span class="ai-modal-note">
            <template v-if="loading">กำลังประมวลผล {{ elapsedLabel }} · </template>
            AI รันบนเครื่องนี้ อาจใช้เวลา 1–5 นาที (ครั้งแรกอาจนานกว่า) · ประวัติจะถูกล้างเมื่อปิดหน้าต่างนี้
          </span>
          <div class="ai-modal-actions">
            <button type="button" class="btn" @click="close">ปิด</button>
            <button
              type="button"
              class="btn p flex items-center gap-2"
              :disabled="loading"
              :title="loading ? 'กรุณารอให้ AI ร่างเสร็จก่อน' : 'ให้ AI ร่างคำตอบชุดใหม่'"
              @click="emit('generate')"
            >
              <UIcon :name="loading ? 'i-heroicons-arrow-path' : 'i-heroicons-sparkles'" class="w-4 h-4" :class="{ 'animate-spin': loading }" />
              {{ loading ? `กำลังร่าง... ${elapsedLabel}` : 'ให้ AI ร่าง / เจนใหม่' }}
            </button>
          </div>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.ai-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: rgba(42, 32, 22, 0.5);
  backdrop-filter: blur(2px);
}
.ai-modal-panel {
  width: min(1180px, 96vw);
  height: min(84vh, 900px);
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: 0 18px 50px rgba(42, 32, 22, 0.24);
  overflow: hidden;
}
.ai-modal-head {
  flex: none;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px 15px;
  border-bottom: 1px solid var(--line);
  background: var(--bg);
}
.ai-modal-head h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #2f2a25;
}
.ai-modal-head p {
  margin: 4px 0 0;
  color: #5f554a;
  font-size: 13px;
  line-height: 1.5;
}
.ai-modal-close {
  flex: none;
  width: 34px;
  height: 34px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  color: var(--mute);
  font-size: 16px;
}
.ai-modal-close:hover {
  color: var(--danger);
  border-color: #fecaca;
  background: #fef2f2;
}
.ai-modal-body {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}
.ai-modal-col {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
}
.ai-col-head {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 13px;
  border-bottom: 1px solid var(--line);
  background: #fbf8f2;
  color: #3b332b;
  font-size: 13.5px;
  font-weight: 700;
}
.ai-col-head small {
  color: #5f554a;
  font-size: 11.5px;
  font-weight: 500;
}
.ai-col-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 13px;
}
.ai-empty {
  padding: 32px 16px;
  text-align: center;
  color: #6f6961;
  font-size: 13.5px;
  line-height: 1.6;
}
.ai-version-card {
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #fffdfa;
  overflow: hidden;
}
.ai-version-card + .ai-version-card {
  margin-top: 12px;
}
.ai-version-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 11px;
  border-bottom: 1px solid var(--line);
  background: #f7f0e5;
  color: #4f463c;
  font-size: 12.5px;
  font-weight: 700;
}
.ai-use-btn {
  border: 1px solid var(--acc);
  border-radius: 7px;
  background: var(--soft);
  color: var(--btn);
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
}
.ai-use-btn:hover {
  background: #e5d6c2;
}
.ai-version-body {
  padding: 11px 12px;
  color: var(--ink);
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
}
.ai-modal-foot {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 13px 18px;
  border-top: 1px solid var(--line);
  background: var(--bg);
}
.ai-modal-note {
  color: #5f554a;
  font-size: 12px;
}
.ai-modal-actions {
  display: flex;
  align-items: center;
  gap: 9px;
}
.ai-modal-actions .btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
@media (max-width: 860px) {
  .ai-modal-panel { height: 92vh; }
  .ai-modal-body { grid-template-columns: 1fr; overflow-y: auto; }
  .ai-modal-col { min-height: 280px; }
  .ai-modal-foot { align-items: flex-start; flex-direction: column; }
}
</style>
