<template>
  <g class="flow-arrow">
    <defs>
      <marker
        :id="markerId"
        markerWidth="9"
        markerHeight="9"
        refX="8"
        refY="4.5"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M 0 1.5 L 7 4.5 L 0 7.5 z" fill="#4a3319" />
      </marker>
    </defs>
    <path
      class="flow-arrow-path"
      :d="path"
      :style="customStyle"
      :marker-end="`url(#${markerId})`"
    />
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  id?: string
  edge?: any
  sourceX?: number
  sourceY?: number
  targetX?: number
  targetY?: number
  style?: any
  markerEnd?: string
}>()

const edgeObj = computed(() => props.edge || props)

const sourceX = computed(() => Number(edgeObj.value.sourceX ?? 0))
const sourceY = computed(() => Number(edgeObj.value.sourceY ?? 0))
const targetX = computed(() => Number(edgeObj.value.targetX ?? 0))
const targetY = computed(() => Number(edgeObj.value.targetY ?? 0))

const customStyle = computed(() => edgeObj.value.style || { stroke: '#4a3319', strokeWidth: 2.5, fill: 'none' })
const markerId = computed(() => `marker-${String(edgeObj.value.id || 'edge').replace(/[^a-zA-Z0-9_-]/g, '-')}`)

const path = computed(() => {
  const xs = sourceX.value
  const ys = sourceY.value
  const xt = targetX.value
  const yt = targetY.value
  const r = 6 // corner radius

  const dx = xt - xs
  const hash = Math.abs(String(edgeObj.value.id || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0))

  // 1. Adjacent columns (gap between 220 and 260 is 40px, so dx is around 40px)
  if (dx > 0 && dx <= 80) {
    const gapOffset = ((hash % 3) - 1) * 6 // -6, 0, +6
    const midX = Math.round((xs + xt) / 2) + gapOffset
    if (Math.abs(ys - yt) < 2) {
      // Direct horizontal arrow in the gap
      return `M ${xs} ${ys} L ${xt} ${yt}`
    }
    const dirY = yt > ys ? 1 : -1
    return `M ${xs} ${ys} ` +
           `L ${midX - r} ${ys} ` +
           `Q ${midX} ${ys} ${midX} ${ys + r * dirY} ` +
           `L ${midX} ${yt - r * dirY} ` +
           `Q ${midX} ${yt} ${midX + r} ${yt} ` +
           `L ${xt} ${yt}`
  }

  // 2. Non-adjacent columns (skipping 1 or more semester columns, dx > 80):
  // Route through the top gutter (y between 55 and 83, strictly above all course cards at y >= 100)
  if (dx > 80) {
    const laneY = 55 + (hash % 5) * 7 // 55, 62, 69, 76, 83 (all < 100)
    const exitX = xs + 15 + (hash % 3) * 5 // within [xs+15, xs+25] (gap [xs, xs+40])
    const enterX = xt - 25 + (hash % 3) * 5 // within [xt-25, xt-15] (gap [xt-40, xt])
    const dirFromSource = laneY > ys ? 1 : -1
    const dirToTarget = yt > laneY ? 1 : -1

    return `M ${xs} ${ys} ` +
           `L ${exitX - r} ${ys} ` +
           `Q ${exitX} ${ys} ${exitX} ${ys + r * dirFromSource} ` +
           `L ${exitX} ${laneY - r * dirFromSource} ` +
           `Q ${exitX} ${laneY} ${exitX + r} ${laneY} ` +
           `L ${enterX - r} ${laneY} ` +
           `Q ${enterX} ${laneY} ${enterX} ${laneY + r * dirToTarget} ` +
           `L ${enterX} ${yt - r * dirToTarget} ` +
           `Q ${enterX} ${yt} ${enterX + r} ${yt} ` +
           `L ${xt} ${yt}`
  }

  // Fallback if dx <= 0
  return `M ${xs} ${ys} L ${xt} ${yt}`
})
</script>

<style scoped>
.flow-arrow-path {
  fill: none;
  stroke: #4a3319;
}
</style>
