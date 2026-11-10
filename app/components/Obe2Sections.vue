<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: any
  section: string
}>()

const data = computed(() => props.modelValue)
const API_BASE = useApiBase()

const aiLoading = ref<Record<string, boolean>>({})
const aiResults = ref<Record<string, string>>({})
const aiError = ref('')

const aiModalOpen = ref(false)
const aiModalTitle = ref('AI ช่วยร่าง')
const aiModalLeftTitle = ref('ข้อมูลปัจจุบัน')
const aiModalRightTitle = ref('ฉบับร่างจาก AI')
const aiModalText = ref('')
const aiModalVersions = ref<Array<{ id: string, text: string, createdAt: number }>>([])
const aiModalLoading = ref(false)
const aiModalSection = ref('')
let aiModalTargetKey = ''
let aiModalApplyFn: ((version: any) => void) | null = null
let aiModalSession = 0
let aiModalController: AbortController | null = null

const addRow = (arr: any[], factory: () => any) => {
  arr.push(factory())
}

const removeRow = (arr: any[], index: number, factory: () => any) => {
  arr.splice(index, 1)
  if (!arr.length) arr.push(factory())
}

const addMajor = () => data.value.majors.push('')
const removeMajor = (index: number) => removeRow(data.value.majors, index, () => '')

const addCareer = () => data.value.careers.push('')
const removeCareer = (index: number) => removeRow(data.value.careers, index, () => '')

const addDevelopmentPlan = () => addRow(data.value.developmentPlans, () => ({ plan: '', strategy: '', indicator: '' }))
const removeDevelopmentPlan = (index: number) => removeRow(data.value.developmentPlans, index, () => ({ plan: '', strategy: '', indicator: '' }))

const addPloMethodRow = () => addRow(data.value.ploMethodRows, () => ({ stakeholder: '', expectedAbility: '', expectedCharacteristic: '' }))
const removePloMethodRow = (index: number) => removeRow(data.value.ploMethodRows, index, () => ({ stakeholder: '', expectedAbility: '', expectedCharacteristic: '' }))

const addPlo = () => {
  const row = {
    id: `plo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    code: `PLO ${data.value.plos.length + 1}`,
    type: 'S',
    description: '',
    teaching: '',
    assessment: '',
    skills: { knowledge: false, skills: false, ethics: false, character: false },
    vision: { vision: false, mission1: false, mission2: false, mission3: false, mission4: false },
    ga: { ga1: false, ga2: false, ga3: false, ga4: false },
    peo: {}
  }
  data.value.plos.push(row)
}
const removePlo = (index: number) => removeRow(data.value.plos, index, () => ({
  id: `plo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  code: `PLO ${index + 1}`,
  type: 'S',
  description: '',
  teaching: '',
  assessment: '',
  skills: { knowledge: false, skills: false, ethics: false, character: false },
  vision: { vision: false, mission1: false, mission2: false, mission3: false, mission4: false },
  ga: { ga1: false, ga2: false, ga3: false, ga4: false },
  peo: {}
}))

const addPeo = () => data.value.peos.push({
  id: `peo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  code: `PEO ${data.value.peos.length + 1}`,
  description: ''
})
const removePeo = (index: number) => removeRow(data.value.peos, index, () => ({
  id: `peo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  code: `PEO ${index + 1}`,
  description: ''
}))

const addYlo = () => data.value.ylos.push({
  id: `ylo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  year: String(Math.min(data.value.ylos.length + 1, 8)),
  code: `YLO ${Math.min(data.value.ylos.length + 1, 8)}.1`,
  description: '',
  abilityLevel: '',
  verbs: '',
  assessmentEvidence: '',
  plos: {}
})
const removeYlo = (index: number) => removeRow(data.value.ylos, index, () => ({
  id: `ylo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  year: '1',
  code: `YLO 1.${index + 1}`,
  description: '',
  abilityLevel: '',
  verbs: '',
  assessmentEvidence: '',
  plos: {}
}))

const toggleMap = (object: any, key: string) => {
  object[key] = !object[key]
}

const scrollToSub = (id: string) => {
  if (import.meta.client) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const ensureMap = (row: any, key: string) => {
  if (!row[key] || typeof row[key] !== 'object') row[key] = {}
  return row[key]
}

const aiContext = () => ({
  programName: data.value.nameTh,
  programCode: data.value.programCode,
  degreeNameTh: data.value.degreeNameTh,
  philosophy: data.value.philosophy,
  importanceOverview: data.value.importanceOverview,
  importanceEconomic: data.value.importanceEconomic,
  importanceSocial: data.value.importanceSocial,
  impactDevelopment: data.value.impactDevelopment,
  universityMission: data.value.universityMission,
  curriculumRelationExternal: data.value.curriculumRelationExternal,
  curriculumRelationInternal: data.value.curriculumRelationInternal,
  curriculumRelationManagement: data.value.curriculumRelationManagement,
  developmentPlans: data.value.developmentPlans,
  ploSummary: data.value.ploSummary,
  missions: data.value.missions,
  graduateAttributes: data.value.graduateAttributes,
  missionNote: data.value.missionNote,
  graduateAttributeNote: data.value.graduateAttributeNote,
  uniqueness: data.value.uniqueness,
  competitorComparison: data.value.competitorComparison,
  careers: data.value.careers,
  plos: data.value.plos,
  peos: data.value.peos,
  ylos: data.value.ylos,
  tqfRows: data.value.tqfRows
})

const cleanDisplayText = (raw: string): string => {
  if (!raw) return ''
  let text = String(raw).trim()

  const jsonResultMatch = text.match(/^\s*\{[\s\S]*?"(?:result|content|th)"\s*:\s*"([\s\S]*?)"\s*\}?\s*$/)
  if (jsonResultMatch) {
    text = jsonResultMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
  } else if (text.startsWith('{"result":') || text.startsWith('{"result": "')) {
    text = text.replace(/^\s*\{\s*"result"\s*:\s*"?/, '').replace(/"?\s*\}?\s*$/, '')
  }

  return text
    .replace(/^[ \t]*[*•][ \t]*/gm, '- ')
    .replace(/^[ \t]*#{1,6}[ \t]*/gm, '')
    .replace(/\*{1,3}([^*\n]+)\*{1,3}/g, '$1')
    .replace(/_{1,3}([^_\n]+)_{1,3}/g, '$1')
    .replace(/#{2,}/g, '')
    .replace(/\*{2,}/g, '')
    .replace(/[`]+/g, '')
    .trim()
}

const describeAiError = (error: any) => {
  const status = error?.statusCode ?? error?.status ?? error?.response?.status
  if (status === 502 || status === 504) {
    return 'AI ใช้เวลานานเกินกำหนด (โมเดลอาจกำลังโหลดหรือเครื่องทำงานหนัก) กรุณารอสักครู่แล้วลองอีกครั้ง'
  }
  if (status === 503) return 'บริการ AI ยังไม่พร้อมใช้งาน กรุณาลองใหม่ภายหลัง'
  return error?.data?.detail || error?.message || 'ไม่สามารถเชื่อมต่อบริการ AI ได้'
}

const callAi = async (sectionKey: string, currentText = '', signal?: AbortSignal) => {
  aiError.value = ''
  aiLoading.value[sectionKey] = true
  try {
    const response = await $fetch<{ result: string }>(`${API_BASE}/ai/assist/obe2`, {
      method: 'POST',
      signal,
      body: {
        section: sectionKey,
        current_text: currentText,
        context: aiContext()
      }
    })
    const rawResult = String(response?.result || '').trim()
    const result = cleanDisplayText(rawResult)
    if (!result) throw new Error('AI ไม่ได้ส่งข้อความกลับมา')
    return result
  } catch (error: any) {
    if (signal?.aborted) return ''
    const message = describeAiError(error)
    aiError.value = message
    alert(message)
    return ''
  } finally {
    aiLoading.value[sectionKey] = false
  }
}

const openAiModal = (options: {
  title: string
  section: string
  text?: string
  leftTitle?: string
  rightTitle?: string
  targetKey?: string
  apply?: (version: any) => void
}) => {
  aiModalSession += 1
  aiModalTitle.value = options.title
  aiModalSection.value = options.section
  aiModalText.value = options.text || ''
  aiModalLeftTitle.value = options.leftTitle || 'ข้อมูลปัจจุบัน'
  aiModalRightTitle.value = options.rightTitle || 'ฉบับร่างจาก AI'
  aiModalTargetKey = options.targetKey || ''
  aiModalApplyFn = options.apply || null
  aiModalVersions.value = []
  aiModalLoading.value = false
  aiModalController?.abort()
  aiModalController = new AbortController()
  aiModalOpen.value = true
  void generateAiModalVersion()
}

const closeAiModal = () => {
  aiModalSession += 1
  aiModalController?.abort()
  aiModalController = null
  if (aiModalTargetKey) data.value[aiModalTargetKey] = aiModalText.value
  aiModalOpen.value = false
  aiModalLoading.value = false
  aiModalVersions.value = []
  aiModalSection.value = ''
  aiModalTargetKey = ''
  aiModalApplyFn = null
  aiModalText.value = ''
}

const handleAiModalOpen = (open: boolean) => {
  if (!open) closeAiModal()
  else aiModalOpen.value = true
}

const generateAiModalVersion = async () => {
  if (!aiModalSection.value) return
  // กันการกดซ้ำระหว่างรอ: การ abort ฝั่ง browser ไม่ได้หยุดงานที่ Ollama
  // ถ้าส่งคำขอใหม่ งานจะไปต่อคิวและทำให้รอนานขึ้น
  if (aiModalLoading.value) return
  const controller = aiModalController || new AbortController()
  if (!aiModalController) aiModalController = controller
  const session = aiModalSession
  aiModalLoading.value = true
  try {
    const result = await callAi(aiModalSection.value, aiModalText.value, controller.signal)
    if (controller.signal.aborted || session !== aiModalSession || !result) return
    aiModalVersions.value.unshift({
      id: uid('ai'),
      text: result,
      createdAt: Date.now()
    })
  } finally {
    if (session === aiModalSession && !controller.signal.aborted) aiModalLoading.value = false
  }
}

const applyAiModalVersion = (version: any) => {
  if (aiModalApplyFn) aiModalApplyFn(version)
  if (aiModalTargetKey) aiModalText.value = version.text || ''
}

const openFieldAi = (section: string, title: string, targetKey: string) => {
  openAiModal({
    title,
    section,
    targetKey,
    text: data.value[targetKey] || '',
    leftTitle: 'ข้อความปัจจุบัน',
    rightTitle: 'ฉบับร่างจาก AI'
  })
}

const openAdvisoryAiModal = (section: string, title: string, text: string) => {
  openAiModal({
    title,
    section,
    text,
    leftTitle: 'ข้อมูลที่ใช้ตรวจ',
    rightTitle: 'ผลตรวจ/ข้อเสนอจาก AI',
    apply: (version: any) => {
      aiResults.value[section] = version.text || ''
    }
  })
}

const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

const cleanAiLine = (line: string) =>
  String(line || '')
    .replace(/\*\*/g, '')
    .replace(/#{1,6}\s*/g, '')
    .replace(/^\s*(?:[-*•]+|\d+[.)])\s*/, '')
    .replace(/^\|+|\|+$/g, '')
    .trim()

const aiLines = (text: string) =>
  String(text || '')
    .split(/\r?\n/)
    .map(cleanAiLine)
    .filter((line) => line && !/^[-–—]{2,}$/.test(line) && !/^```/.test(line) && !/^[|\s-–—:]+$/.test(line))

const splitPipe = (line: string) => line.split(/\s*\|\s*/).map((value) => value.trim())

const parsePipeRows = (text: string, minColumns: number) =>
  aiLines(text)
    .map((line) => {
      let parts = splitPipe(line)
      if (parts.length < minColumns && line.includes(' - ')) {
        parts = line.split(/\s*[-–—]\s*/).map((v) => v.trim())
      } else if (parts.length < minColumns && line.includes(':')) {
        parts = line.split(/\s*:\s*/).map((v) => v.trim())
      }
      return parts
    })
    .filter((parts) => parts.length >= minColumns && parts[0] && !/^[-–—:]+$/.test(parts[0]) && !/^(แผนการพัฒนา|แผนพัฒนา|ลำดับ|หัวข้อ|รายการ|มิติ|กลยุทธ์)/i.test(parts[0]))

const parsePeoRows = (text: string) => {
  const rows: Array<{ id: string, code: string, description: string }> = []
  const trimmed = String(text || '').trim()

  if (trimmed.startsWith('[') || trimmed.includes('{')) {
    const objMatches = trimmed.match(/\{[^{}]*\}/g)
    if (objMatches) {
      objMatches.forEach((m, idx) => {
        try {
          const parsed = JSON.parse(m)
          const code = parsed.code || parsed.peo || parsed.id || parsed.รหัส || `PEO ${idx + 1}`
          const desc = parsed.description || parsed.desc || parsed.detail || parsed.คำอธิบาย || ''
          if (desc) {
            rows.push({ id: uid('peo'), code: String(code), description: String(desc) })
          }
        } catch {
          // ignore
        }
      })
      if (rows.length) return rows
    }
  }

  aiLines(text).forEach((line, index) => {
    const parts = splitPipe(line)
    const description = parts.length >= 2 ? parts.slice(1).join(' | ').trim() : line
    const codeMatch = line.match(/^(PEO\s*\d+)\s*[:.\-–|]\s*(.+)$/i)
    if (codeMatch) {
      rows.push({ id: uid('peo'), code: codeMatch[1], description: codeMatch[2].trim() })
    } else if (description) {
      rows.push({ id: uid('peo'), code: `PEO ${index + 1}`, description })
    }
  })
  return rows.filter((row) => row.description && !/^คำอธิบาย$/i.test(row.description))
}

const parseYloRows = (text: string) => {
  const trimmed = String(text || '').trim()

  if (trimmed.startsWith('[') || trimmed.includes('{')) {
    const objMatches = trimmed.match(/\{[^{}]*\}/g)
    if (objMatches) {
      const rows = objMatches.map((m, idx) => {
        try {
          const parsed = JSON.parse(m)
          const year = String(parsed.year || parsed.ปี || Math.min(4, Math.floor(idx / 2) + 1))
          const code = String(parsed.code || parsed.ylo || parsed.รหัส || `YLO ${year}.${idx + 1}`)
          const desc = String(parsed.description || parsed.desc || parsed.learning_outcome || parsed.ผลลัพธ์ || parsed.ผลลัพธ์การเรียนรู้ || '')
          if (desc) {
            return {
              id: uid('ylo'),
              year,
              code,
              description: desc,
              plos: {}
            }
          }
        } catch {
          // ignore
        }
        return null
      }).filter(Boolean) as any
      if (rows.length) return rows
    }
  }

  return parsePipeRows(text, 2)
    .filter((parts) => parts[0] !== 'ปี' && parts[0] !== 'ชั้นปี' && !/รหัส\s*YLO/i.test(parts[1] || ''))
    .map((parts, index) => {
    const yearMatch = parts[0].match(/[1-4]/)
    const year = yearMatch ? yearMatch[0] : String(Math.min(4, Math.floor(index / 2) + 1))
    return {
      id: uid('ylo'),
      year,
      code: parts.length >= 3 ? parts[1] : `YLO ${year}.${index + 1}`,
      description: parts.length >= 3 ? parts.slice(2).join(' | ') : parts.slice(1).join(' | '),
      plos: {}
    }
  }).filter((row) => row.description)
}

const parseCareerRows = (text: string) => {
  const trimmed = String(text || '').trim()
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => {
          if (typeof item === 'string') return cleanAiLine(item)
          if (typeof item === 'object' && item) {
            return cleanAiLine(item.career || item.name || item.title || item.อาชีพ || Object.values(item)[0] || '')
          }
          return ''
        }).filter(Boolean)
      }
    } catch {
      // ignore
    }
  }

  let lines = aiLines(text)
  if (lines.length === 1) {
    if (lines[0].includes(';')) {
      lines = lines[0].split(';').map(cleanAiLine).filter(Boolean)
    } else if (lines[0].includes(',') || lines[0].includes('，')) {
      lines = lines[0].split(/[,，]/).map(cleanAiLine).filter(Boolean)
    }
  }
  return lines.filter((line) => !/^(รายการ|ชื่ออาชีพ|ตำแหน่งงาน|อาชีพ|career)/i.test(line))
}

const appendCareerRows = (text: string) => {
  const existing = (data.value.careers || []).map((item: string) => String(item || '').trim()).filter(Boolean)
  const suggested = parseCareerRows(text)
  if (!suggested.length) {
    alert('AI ไม่ได้ส่งรายการอาชีพที่อ่านได้')
    return
  }
  const merged = [...existing]
  suggested.forEach((career) => {
    if (!merged.some((item) => item.toLowerCase() === career.toLowerCase())) merged.push(career)
  })
  data.value.careers = merged.length ? merged : ['']
}

const openCareerAiModal = () => {
  openAiModal({
    title: 'AI ช่วยเสนออาชีพ',
    section: 'careers',
    text: (data.value.careers || []).filter(Boolean).join('\n'),
    leftTitle: 'รายการอาชีพปัจจุบัน',
    rightTitle: 'รายการอาชีพที่ AI เสนอ',
    apply: (version: any) => appendCareerRows(version.text || '')
  })
}

const appendPeoRows = (text: string) => {
  const suggested = parsePeoRows(text)
  if (!suggested.length) {
    alert('AI ไม่ได้ส่งรายการ PEO ที่อ่านได้')
    return
  }
  const existing = data.value.peos.filter((peo: any) => String(peo.description || '').trim())
  data.value.peos = [
    ...existing,
    ...suggested.map((row, index) => ({
      ...row,
      code: `PEO ${existing.length + index + 1}`
    }))
  ]
}

const openPeoAiModal = () => {
  openAiModal({
    title: 'AI ช่วยร่าง PEO',
    section: 'peo',
    text: data.value.peos
      .filter((peo: any) => String(peo.description || '').trim())
      .map((peo: any) => `${peo.code}: ${peo.description}`)
      .join('\n'),
    leftTitle: 'PEO ปัจจุบัน',
    rightTitle: 'PEO ที่ AI ร่าง',
    apply: (version: any) => appendPeoRows(version.text || '')
  })
}

const appendYloRows = (text: string) => {
  const suggested = parseYloRows(text)
  if (!suggested.length) {
    alert('AI ไม่ได้ส่งรายการ YLO ที่อ่านได้')
    return
  }
  const existing = data.value.ylos.filter((ylo: any) => String(ylo.description || '').trim())
  data.value.ylos = [...existing, ...suggested]
}

const openYloAiModal = () => {
  openAiModal({
    title: 'AI ช่วยเสนอ YLO',
    section: 'ylo',
    text: data.value.ylos
      .filter((ylo: any) => String(ylo.description || '').trim())
      .map((ylo: any) => `${ylo.year} | ${ylo.code} | ${ylo.description}`)
      .join('\n'),
    leftTitle: 'YLO ปัจจุบัน',
    rightTitle: 'YLO ที่ AI เสนอ',
    apply: (version: any) => appendYloRows(version.text || '')
  })
}

const appendDevelopmentPlanRows = (text: string) => {
  let suggested: Array<{ plan: string, strategy: string, indicator: string }> = []
  const trimmed = String(text || '').trim()

  if (trimmed.startsWith('[') || trimmed.includes('{')) {
    const objMatches = trimmed.match(/\{[^{}]*\}/g)
    if (objMatches) {
      suggested = objMatches.map((m) => {
        try {
          const parsed = JSON.parse(m)
          const getVal = (...keys: string[]) => {
            for (const k of keys) {
              const foundKey = Object.keys(parsed).find((itemKey) => itemKey.replace(/[\s_/\-]/g, '').toLowerCase() === k.toLowerCase())
              if (foundKey && parsed[foundKey]) return String(parsed[foundKey]).trim()
            }
            return ''
          }
          const plan = getVal('plan', 'developmentplan', 'name', 'title', 'topic', 'แผน', 'แผนการพัฒนา', 'แผนการพัฒนาเปลี่ยนแปลง', 'แผนงาน', 'หัวข้อ')
          const strategy = getVal('strategy', 'method', 'action', 'กลยุทธ์', 'แนวทาง', 'วิธีดำเนินการ')
          const indicator = getVal('indicator', 'kpi', 'evidence', 'ตัวชี้วัด', 'หลักฐาน', 'หลักฐานตัวชี้วัด')
          if (plan) {
            return { plan, strategy, indicator }
          }
        } catch {
          // ignore
        }
        return null
      }).filter(Boolean) as any
    }
  }

  if (!suggested.length) {
    suggested = parsePipeRows(text, 3).map((parts) => ({
      plan: parts[0],
      strategy: parts[1],
      indicator: parts.slice(2).join(' | ')
    })).filter((row) => row.plan && !/^(แผนการพัฒนา|แผนพัฒนา|ลำดับ|หัวข้อ|รายการ)/i.test(row.plan))
  }

  if (!suggested.length) {
    suggested = parsePipeRows(text, 2).map((parts) => ({
      plan: parts[0],
      strategy: parts[1] || '',
      indicator: parts.slice(2).join(' | ') || ''
    })).filter((row) => row.plan && !/^(แผนการพัฒนา|แผนพัฒนา|ลำดับ|หัวข้อ|รายการ)/i.test(row.plan))
  }

  if (!suggested.length) {
    suggested = aiLines(text)
      .filter((line) => line && !/^(แผนการพัฒนา|แผนพัฒนา|ลำดับ|หัวข้อ|รายการ)/i.test(line))
      .map((line) => ({
        plan: line,
        strategy: '',
        indicator: ''
      }))
  }

  if (!suggested.length) {
    alert('AI ไม่ได้ส่งแผนพัฒนาที่อ่านได้')
    return
  }
  const existing = data.value.developmentPlans.filter((plan: any) => String(plan.plan || '').trim())
  data.value.developmentPlans = [...existing, ...suggested]
}

const openDevelopmentPlansAiModal = () => {
  openAiModal({
    title: 'AI ช่วยร่างแผนพัฒนา',
    section: 'development_plans',
    text: data.value.developmentPlans
      .filter((plan: any) => String(plan.plan || '').trim())
      .map((plan: any) => `${plan.plan} | ${plan.strategy} | ${plan.indicator}`)
      .join('\n'),
    leftTitle: 'แผนพัฒนาปัจจุบัน',
    rightTitle: 'แผนพัฒนาที่ AI ร่าง',
    apply: (version: any) => appendDevelopmentPlanRows(version.text || '')
  })
}

const openPloMethodAi = () => {
  openAdvisoryAiModal(
    'plo_method',
    'AI ตรวจความครบถ้วนของ 6.1',
    JSON.stringify(data.value.ploMethodRows || [], null, 2)
  )
}

const openPloDraftAi = () => {
  openAdvisoryAiModal(
    'plo_draft',
    'AI ช่วยร่าง PLO',
    data.value.plos
      .filter((plo: any) => String(plo.description || '').trim())
      .map((plo: any) => `${plo.code}: ${plo.description}`)
      .join('\n')
  )
}

const openVisionMapAi = () => {
  openAdvisoryAiModal(
    'vision_map',
    'AI ตรวจความสอดคล้อง 6.5',
    [
      `วิสัยทัศน์: ${data.value.visionStatement || ''}`,
      ...data.value.missions.map((m: string, i: number) => `พันธกิจ ${i + 1}: ${m}`),
      ...data.value.plos.map((plo: any) => `${plo.code}: ${plo.description}`)
    ].join('\n')
  )
}

const openGaMapAi = () => {
  openAdvisoryAiModal(
    'ga_map',
    'AI ตรวจความสอดคล้อง 6.6',
    [
      ...data.value.graduateAttributes.map((g: string, i: number) => `GA ${i + 1}: ${g}`),
      ...data.value.plos.map((plo: any) => `${plo.code}: ${plo.description}`)
    ].join('\n')
  )
}

const addMission = () => data.value.missions.push('')
const removeMission = (index: number) => removeRow(data.value.missions, index, () => '')
const addGraduateAttribute = () => data.value.graduateAttributes.push('')
const removeGraduateAttribute = (index: number) => removeRow(data.value.graduateAttributes, index, () => '')

const ensureSkills = (plo: any) => {
  if (!plo.skills || typeof plo.skills !== 'object') {
    plo.skills = { knowledge: false, skills: false, ethics: false, character: false }
  }
  return plo.skills
}
const ensureVision = (plo: any) => {
  if (!plo.vision || typeof plo.vision !== 'object') {
    plo.vision = { vision: false, missions: [] }
  }
  return plo.vision
}
const ensureMissionArray = (plo: any) => {
  if (!plo.vision || typeof plo.vision !== 'object') plo.vision = { vision: false, missions: [] }
  if (!Array.isArray(plo.vision.missions)) plo.vision.missions = []
  return plo.vision.missions
}
const ensureGaArray = (plo: any) => {
  if (!plo.ga || typeof plo.ga !== 'object') plo.ga = { attributes: [] }
  if (!Array.isArray(plo.ga.attributes)) plo.ga.attributes = []
  return plo.ga.attributes
}
const plosVisionMission = (plo: any, index: number) => {
  const array = ensureMissionArray(plo)
  while (array.length <= index) array.push(false)
  return !!array[index]
}
const togglePloVisionMission = (plo: any, index: number, value: boolean) => {
  const array = ensureMissionArray(plo)
  while (array.length <= index) array.push(false)
  array[index] = value
}
const ploGaAttribute = (plo: any, index: number) => {
  const array = ensureGaArray(plo)
  while (array.length <= index) array.push(false)
  return !!array[index]
}
const togglePloGaAttribute = (plo: any, index: number, value: boolean) => {
  const array = ensureGaArray(plo)
  while (array.length <= index) array.push(false)
  array[index] = value
}

watch(() => data.value.missions.length, (length: number) => {
  data.value.plos.forEach((plo: any) => {
    if (!plo.vision || !Array.isArray(plo.vision.missions)) plo.vision = { ...plo.vision, missions: [] }
    while (plo.vision.missions.length < length) plo.vision.missions.push(false)
    if (plo.vision.missions.length > length) plo.vision.missions = plo.vision.missions.slice(0, length)
  })
})

watch(() => data.value.graduateAttributes.length, (length: number) => {
  data.value.plos.forEach((plo: any) => {
    if (!plo.ga || !Array.isArray(plo.ga.attributes)) plo.ga = { ...plo.ga, attributes: [] }
    while (plo.ga.attributes.length < length) plo.ga.attributes.push(false)
    if (plo.ga.attributes.length > length) plo.ga.attributes = plo.ga.attributes.slice(0, length)
  })
})

const sectionTitle = computed(() => {
  const titles: Record<string, string> = {
    '1.1': 'รหัสและชื่อหลักสูตร',
    '1.2': 'ชื่อปริญญาและสาขาวิชา',
    '1.3': 'วิชาเอก',
    '1.4': 'รูปแบบของหลักสูตร',
    '1.5': 'สถานภาพของหลักสูตรและการพิจารณาอนุมัติ/เห็นชอบ',
    '2.1': 'ปรัชญาของหลักสูตร',
    '2.2': 'ความสำคัญของหลักสูตร',
    '2.4': 'จุดเด่นเฉพาะของหลักสูตร',
    '2.5': 'อาชีพที่สามารถประกอบได้หลังสำเร็จการศึกษา',
    '2.6': 'ผลลัพธ์การเรียนรู้',
    '2.3': 'วัตถุประสงค์ของหลักสูตร (PEO)',
    '2.7': 'ความคาดหวังของผลลัพธ์การเรียนรู้'
  }
  return titles[props.section] || ''
})
</script>

<template>
  <div class="obe2-sections">
    <!-- 1.1 -->
    <article v-if="section === '1.1'" class="obe-card">
      <header class="obe-card-head">
        <div class="sec-no">1.1</div>
        <div class="head-text">
          <h2>รหัสและชื่อหลักสูตร</h2>
          <p>กรอกข้อมูลพื้นฐานของหลักสูตรตามแบบฟอร์ม OBE 2</p>
        </div>
        <span class="role-tag user">ผู้ใช้กรอก</span>
      </header>
      <div class="field-grid">
        <div class="field">
          <label>รหัสหลักสูตร</label>
          <input v-model="data.programCode" class="fld" placeholder="เช่น 2504..." />
        </div>
        <div class="field span-2">
          <label>ชื่อหลักสูตร (ภาษาไทย)</label>
          <input v-model="data.nameTh" class="fld" placeholder="หลักสูตรวิศวกรรมศาสตรบัณฑิต สาขาวิชา..." />
        </div>
        <div class="field span-2">
          <label>ชื่อหลักสูตร (ภาษาอังกฤษ)</label>
          <input v-model="data.nameEn" class="fld" placeholder="Bachelor of Engineering Program in ..." />
        </div>
      </div>
    </article>

    <!-- 1.2 -->
    <article v-else-if="section === '1.2'" class="obe-card">
      <header class="obe-card-head">
        <div class="sec-no">1.2</div>
        <div class="head-text">
          <h2>ชื่อปริญญาและสาขาวิชา</h2>
          <p>ระบุชื่อเต็มและชื่อย่อทั้งภาษาไทยและภาษาอังกฤษ</p>
        </div>
        <span class="role-tag user">ผู้ใช้กรอก</span>
      </header>
      <div class="field-grid">
        <div class="field">
          <label>ชื่อเต็ม (ภาษาไทย)</label>
          <input v-model="data.degreeNameTh" class="fld" placeholder="วิศวกรรมศาสตรบัณฑิต (...)" />
        </div>
        <div class="field">
          <label>ชื่อย่อ (ภาษาไทย)</label>
          <input v-model="data.degreeAbbrTh" class="fld" placeholder="วศ.บ. (...)" />
        </div>
        <div class="field">
          <label>ชื่อเต็ม (ภาษาอังกฤษ)</label>
          <input v-model="data.degreeNameEn" class="fld" placeholder="Bachelor of Engineering (...)" />
        </div>
        <div class="field">
          <label>ชื่อย่อ (ภาษาอังกฤษ)</label>
          <input v-model="data.degreeAbbrEn" class="fld" placeholder="B.Eng. (...)" />
        </div>
      </div>
    </article>

    <!-- 1.3 -->
    <article v-else-if="section === '1.3'" class="obe-card">
      <header class="obe-card-head">
        <div class="sec-no">1.3</div>
        <div class="head-text">
          <h2>วิชาเอก</h2>
          <p>ระบุแขนงวิชา/วิชาเอกที่เปิดสอน หากไม่มีให้คงข้อความ “ไม่มี”</p>
        </div>
        <span class="role-tag user">ผู้ใช้กรอก</span>
      </header>
      <div class="list-editor">
        <div v-for="(major, i) in data.majors" :key="i" class="list-row">
          <span class="list-index">{{ i + 1 }}</span>
          <input v-model="data.majors[i]" class="fld" placeholder="ระบุวิชาเอก/แขนงวิชา" />
          <button type="button" class="icon-btn" @click="removeMajor(i)">✕</button>
        </div>
        <button type="button" class="add-btn" @click="addMajor">＋ เพิ่มรายการ</button>
      </div>
    </article>

    <!-- 1.4 -->
    <article v-else-if="section === '1.4'" class="obe-card">
      <header class="obe-card-head">
        <div class="sec-no">1.4</div>
        <div class="head-text">
          <h2>รูปแบบของหลักสูตร</h2>
          <p>กรอกข้อมูล 4.1–4.6 ตามแบบฟอร์ม OBE 2</p>
        </div>
        <span class="role-tag user">ผู้ใช้กรอก</span>
      </header>
      <div class="field-grid">
        <div class="field span-2">
          <label>4.1 รูปแบบ</label>
          <textarea v-model="data.programFormat" class="fld" rows="3" placeholder="หลักสูตรระดับปริญญาตรี หลักสูตร 4 ปี ..." />
        </div>
        <div class="field">
          <label>4.2 ประเภทของหลักสูตร</label>
          <input v-model="data.programType" class="fld" placeholder="หลักสูตรปริญญาตรีทางวิชาการ" />
        </div>
        <div class="field span-2">
          <label>4.3 ภาษาที่ใช้</label>
          <select v-model="data.language" class="fld">
            <option value="ภาษาไทย">ภาษาไทย</option>
            <option value="ภาษาไทยและภาษาอังกฤษ">ภาษาไทยและภาษาอังกฤษ</option>
            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
          </select>
        </div>
        <div class="field span-2">
          <label>4.4 การรับเข้าศึกษา</label>
          <textarea v-model="data.admissionReq" class="fld" rows="2" placeholder="รับนักศึกษาไทยและนักศึกษาต่างประเทศที่ใช้ภาษาไทยได้" />
        </div>
        <div class="field span-2">
          <label>4.5 ความร่วมมือกับสถาบันอื่น</label>
          <textarea v-model="data.cooperation" class="fld" rows="2" placeholder="ไม่มี หรือระบุความร่วมมือ" />
        </div>
        <div class="field span-2">
          <label>4.6 การให้ปริญญาแก่ผู้สำเร็จการศึกษา</label>
          <textarea v-model="data.degreeGranting" class="fld" rows="2" placeholder="ให้ปริญญาเพียงสาขาวิชาเดียว" />
        </div>
      </div>
    </article>

    <!-- 1.5 -->
    <article v-else-if="section === '1.5'" class="obe-card">
      <header class="obe-card-head">
        <div class="sec-no">1.5</div>
        <div class="head-text">
          <h2>สถานภาพของหลักสูตรและการพิจารณาอนุมัติ/เห็นชอบ</h2>
          <p>ระบุสถานภาพและลำดับการพิจารณาของคณะกรรมการ/สภา</p>
        </div>
        <span class="role-tag user">ผู้ใช้กรอก</span>
      </header>
      <div class="field">
        <label>สถานภาพของหลักสูตรและการพิจารณาอนุมัติ/เห็นชอบ</label>
        <textarea v-model="data.approvalStatus" class="fld" rows="8" placeholder="หลักสูตรใหม่ พ.ศ. ... เปิดสอนภาคการศึกษาที่ 1 ปีการศึกษา ...&#10;- ได้พิจารณากลั่นกรองโดย...&#10;- ได้รับความเห็นชอบจาก...&#10;- ได้รับอนุมัติหลักสูตรจาก..." />
      </div>
    </article>

    <!-- 2.1 -->
    <article v-else-if="section === '2.1'" class="obe-card">
      <header class="obe-card-head">
        <div class="sec-no">2.1</div>
        <div class="head-text">
          <h2>ปรัชญาของหลักสูตร</h2>
          <p>ผู้ใช้ร่าง แล้ว AI ช่วยขัดเกลาภาษาและตรวจความชัดเจน โดยคงสาระเดิม</p>
        </div>
        <span class="role-tag ai">ผู้ใช้ร่าง → AI ช่วยขัดเกลาภาษา</span>
      </header>
      <div class="field">
        <label>ปรัชญาของหลักสูตร</label>
        <textarea v-model="data.philosophy" class="fld" rows="7" placeholder="มุ่งผลิตบัณฑิตที่มีความรู้ความสามารถ..." />
      </div>
      <div class="ai-row">
        <button type="button" class="ai-btn" :disabled="aiLoading.philosophy" @click="openFieldAi('philosophy', 'AI ช่วยขัดเกลาปรัชญา', 'philosophy')">
          <UIcon :name="aiLoading.philosophy ? 'i-heroicons-arrow-path' : 'i-heroicons-sparkles'" class="w-4 h-4" :class="{ 'animate-spin': aiLoading.philosophy }" />
          ขัดเกลาภาษาและตรวจความชัดเจน
        </button>
        <span class="ai-hint">AI จะปรับถ้อยคำให้เป็นภาษาวิชาการ โดยไม่เพิ่มข้อเท็จจริงใหม่</span>
      </div>
    </article>

    <!-- 2.2 -->
    <article v-else-if="section === '2.2'" class="obe-card">
      <header class="obe-card-head">
        <div class="sec-no">2.2</div>
        <div class="head-text">
          <h2>ความสำคัญของหลักสูตร</h2>
          <p>แบ่งช่องกรอกตามหัวข้อ 2.1–2.2.2 ในแบบฟอร์ม และให้ AI ช่วยร่างได้ทุกช่อง</p>
        </div>
        <span class="role-tag ai">AI ช่วยร่างทุกหัวข้อ</span>
      </header>

      <h3 class="sub-title">2.1 สถานการณ์ภายนอกหรือการพัฒนาที่จำเป็นต้องนำมาพิจารณาในการวางแผนหลักสูตร</h3>
      <div class="field">
        <div class="label-row">
          <label>บทนำ / ภาพรวมของสถานการณ์ภายนอก</label>
          <button type="button" class="ai-btn small" :disabled="aiLoading.importance_overview" @click="openFieldAi('importance_overview', 'AI ช่วยร่างบทนำ 2.1', 'importanceOverview')">
            <UIcon :name="aiLoading.importance_overview ? 'i-heroicons-arrow-path' : 'i-heroicons-sparkles'" class="w-4 h-4" :class="{ 'animate-spin': aiLoading.importance_overview }" />
            AI ช่วยร่าง
          </button>
        </div>
        <textarea v-model="data.importanceOverview" class="fld" rows="6" placeholder="อธิบายบริบทและเหตุผลความจำเป็นของหลักสูตร..." />
      </div>
      <div class="field mt-3">
        <div class="label-row">
          <label>2.1.1 สถานการณ์หรือการพัฒนาทางเศรษฐกิจ</label>
          <button type="button" class="ai-btn small" :disabled="aiLoading.importance_economic" @click="openFieldAi('importance_economic', 'AI ช่วยร่าง 2.1.1', 'importanceEconomic')">
            <UIcon :name="aiLoading.importance_economic ? 'i-heroicons-arrow-path' : 'i-heroicons-sparkles'" class="w-4 h-4" :class="{ 'animate-spin': aiLoading.importance_economic }" />
            AI ช่วยร่าง
          </button>
        </div>
        <textarea v-model="data.importanceEconomic" class="fld" rows="7" placeholder="ระบุสถานการณ์/แนวโน้มทางเศรษฐกิจ..." />
      </div>
      <div class="field mt-3">
        <div class="label-row">
          <label>2.1.2 สถานการณ์หรือการพัฒนาทางสังคมและวัฒนธรรม</label>
          <button type="button" class="ai-btn small" :disabled="aiLoading.importance_social" @click="openFieldAi('importance_social', 'AI ช่วยร่าง 2.1.2', 'importanceSocial')">
            <UIcon :name="aiLoading.importance_social ? 'i-heroicons-arrow-path' : 'i-heroicons-sparkles'" class="w-4 h-4" :class="{ 'animate-spin': aiLoading.importance_social }" />
            AI ช่วยร่าง
          </button>
        </div>
        <textarea v-model="data.importanceSocial" class="fld" rows="7" placeholder="ระบุสถานการณ์/แนวโน้มทางสังคมและวัฒนธรรม..." />
      </div>

      <h3 class="sub-title">2.2 ผลกระทบจากข้อ 2.1.1 และ 2.1.2 ต่อการพัฒนาหลักสูตรและความเกี่ยวข้องกับวิสัยทัศน์ พันธกิจ และแผนของมหาวิทยาลัย</h3>
      <div class="field">
        <div class="label-row">
          <label>ผลกระทบต่อการพัฒนาหลักสูตร</label>
          <button type="button" class="ai-btn small" :disabled="aiLoading.impact_development" @click="openFieldAi('impact_development', 'AI ช่วยร่างผลกระทบ 2.2', 'impactDevelopment')">
            <UIcon :name="aiLoading.impact_development ? 'i-heroicons-arrow-path' : 'i-heroicons-sparkles'" class="w-4 h-4" :class="{ 'animate-spin': aiLoading.impact_development }" />
            AI ช่วยร่าง
          </button>
        </div>
        <textarea v-model="data.impactDevelopment" class="fld" rows="6" placeholder="อธิบายผลกระทบและแนวทางการพัฒนาหลักสูตร..." />
      </div>

      <h4 class="sub-title sub-title-sm">2.2.1 การพัฒนาหลักสูตร</h4>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>แผนการพัฒนา/เปลี่ยนแปลง</th>
              <th>กลยุทธ์</th>
              <th>หลักฐาน/ตัวชี้วัด</th>
              <th style="width: 48px" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(plan, i) in data.developmentPlans" :key="i">
              <td><textarea v-model="plan.plan" class="cell-input" rows="2" /></td>
              <td><textarea v-model="plan.strategy" class="cell-input" rows="2" /></td>
              <td><textarea v-model="plan.indicator" class="cell-input" rows="2" /></td>
              <td class="center"><button type="button" class="icon-btn" @click="removeDevelopmentPlan(i)">✕</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="ai-row">
        <button type="button" class="add-btn" @click="addDevelopmentPlan">＋ เพิ่มแผนพัฒนา</button>
        <button type="button" class="ai-btn" :disabled="aiLoading.development_plans" @click="openDevelopmentPlansAiModal">
          <UIcon :name="aiLoading.development_plans ? 'i-heroicons-arrow-path' : 'i-heroicons-sparkles'" class="w-4 h-4" :class="{ 'animate-spin': aiLoading.development_plans }" />
          AI ช่วยร่างแผนพัฒนา
        </button>
      </div>

      <h4 class="sub-title sub-title-sm">2.2.2 ความเกี่ยวข้องกับวิสัยทัศน์และพันธกิจของมหาวิทยาลัย</h4>
      <div class="field">
        <div class="label-row">
          <label>ความสอดคล้องกับวิสัยทัศน์ พันธกิจ และแผนยุทธศาสตร์</label>
          <button type="button" class="ai-btn small" :disabled="aiLoading.university_mission" @click="openFieldAi('university_mission', 'AI ช่วยร่าง 2.2.2', 'universityMission')">
            <UIcon :name="aiLoading.university_mission ? 'i-heroicons-arrow-path' : 'i-heroicons-sparkles'" class="w-4 h-4" :class="{ 'animate-spin': aiLoading.university_mission }" />
            AI ช่วยร่าง
          </button>
        </div>
        <textarea v-model="data.universityMission" class="fld" rows="6" placeholder="อธิบายความสอดคล้องกับวิสัยทัศน์ พันธกิจ และแผนยุทธศาสตร์..." />
      </div>

      <h3 class="sub-title">2.3 ความสัมพันธ์กับหลักสูตรอื่นที่เปิดสอนในคณะ/ภาควิชาอื่นของมหาวิทยาลัย</h3>
      <div class="field">
        <label>2.3.1 กลุ่มวิชา/รายวิชาในหลักสูตรนี้ที่เปิดสอนโดยคณะ/ภาควิชา/หลักสูตรอื่น</label>
        <textarea v-model="data.curriculumRelationExternal" class="fld" rows="5" placeholder="ระบุกลุ่มวิชา/รายวิชาที่ต้องเรียนจากหน่วยงานอื่น..." />
      </div>
      <div class="field mt-3">
        <label>2.3.2 กลุ่มวิชา/รายวิชาในหลักสูตรนี้ที่เปิดสอนให้คณะ/ภาควิชา/หลักสูตรอื่นต้องมาเรียน</label>
        <textarea v-model="data.curriculumRelationInternal" class="fld" rows="5" placeholder="ระบุกลุ่มวิชา/รายวิชาที่หลักสูตรนี้เปิดสอนให้หน่วยงานอื่น..." />
      </div>
      <div class="field mt-3">
        <label>2.3.3 การบริหารจัดการ</label>
        <textarea v-model="data.curriculumRelationManagement" class="fld" rows="5" placeholder="ระบุแนวทางการบริหารจัดการความสัมพันธ์กับหลักสูตรอื่น..." />
      </div>
    </article>

    <!-- 2.4 -->
    <article v-else-if="section === '2.4'" class="obe-card">
      <header class="obe-card-head">
        <div class="sec-no">2.4</div>
        <div class="head-text">
          <h2>จุดเด่นเฉพาะของหลักสูตร</h2>
          <p>AI ช่วยร่างจุดเด่นและเปรียบเทียบกับหลักสูตรคู่แข่ง โดยผู้ใช้เป็นผู้ยืนยัน</p>
        </div>
        <span class="role-tag ai">AI ช่วยร่างและเปรียบเทียบ</span>
      </header>
      <div class="field">
        <div class="label-row">
          <label>จุดเด่นเฉพาะของหลักสูตร</label>
          <button type="button" class="ai-btn small" :disabled="aiLoading.uniqueness" @click="openFieldAi('uniqueness', 'AI ช่วยร่างจุดเด่นเฉพาะ', 'uniqueness')">
            <UIcon :name="aiLoading.uniqueness ? 'i-heroicons-arrow-path' : 'i-heroicons-sparkles'" class="w-4 h-4" :class="{ 'animate-spin': aiLoading.uniqueness }" />
            AI ช่วยร่าง
          </button>
        </div>
        <textarea v-model="data.uniqueness" class="fld" rows="10" placeholder="ระบุจุดเด่นที่แตกต่างและสร้างคุณค่า พร้อมเปรียบเทียบกับหลักสูตรใกล้เคียง..." />
      </div>
      <div class="ai-row">
        <span class="ai-hint">AI จะร่างจุดเด่นและเปรียบเทียบกับหลักสูตรใกล้เคียงให้ในช่องเดียว</span>
      </div>
    </article>

    <!-- 2.5 -->
    <article v-else-if="section === '2.5'" class="obe-card">
      <header class="obe-card-head">
        <div class="sec-no">2.5</div>
        <div class="head-text">
          <h2>อาชีพที่สามารถประกอบได้หลังสำเร็จการศึกษา</h2>
          <p>AI ช่วยเสนอชื่ออาชีพ/ตำแหน่งงานที่เชื่อมโยงกับ PLO</p>
        </div>
        <span class="role-tag ai">AI ช่วยวิเคราะห์ตลาดงาน</span>
      </header>
      <div class="list-editor">
        <div v-for="(career, i) in data.careers" :key="i" class="list-row">
          <span class="list-index">{{ i + 1 }}</span>
          <input v-model="data.careers[i]" class="fld" placeholder="ระบุชื่ออาชีพ/ตำแหน่งงาน" />
          <button type="button" class="icon-btn" @click="removeCareer(i)">✕</button>
        </div>
        <button type="button" class="add-btn" @click="addCareer">＋ เพิ่มอาชีพ</button>
      </div>
      <div class="ai-row">
        <button type="button" class="ai-btn" :disabled="aiLoading.careers" @click="openCareerAiModal">
          <UIcon :name="aiLoading.careers ? 'i-heroicons-arrow-path' : 'i-heroicons-sparkles'" class="w-4 h-4" :class="{ 'animate-spin': aiLoading.careers }" />
          AI ช่วยเสนออาชีพ
        </button>
        <span class="ai-hint">AI จะเพิ่มชื่ออาชีพที่เกี่ยวข้องกับ PLO ไว้ในรายการด้านบน</span>
      </div>
    </article>

    <!-- 2.6 -->
    <article v-else-if="section === '2.6'" class="obe-card">
      <header class="obe-card-head">
        <div class="sec-no">2.6</div>
        <div class="head-text">
          <h2>ผลลัพธ์การเรียนรู้</h2>
          <p>ผู้ใช้และ AI ช่วยกันในแต่ละขั้นตอน ตั้งแต่ 6.1 ถึง 6.6</p>
        </div>
        <span class="role-tag ai">ผู้ใช้ + AI ตามขั้นตอน</span>
      </header>

      <div class="field">
        <div class="label-row">
          <label>ผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตร (ภาพรวม/ข้อความนำ)</label>
          <button type="button" class="ai-btn small" :disabled="aiLoading.plo_draft" @click="openFieldAi('plo_draft', 'AI ช่วยร่างผลลัพธ์การเรียนรู้', 'ploSummary')">
            <UIcon :name="aiLoading.plo_draft ? 'i-heroicons-arrow-path' : 'i-heroicons-sparkles'" class="w-4 h-4" :class="{ 'animate-spin': aiLoading.plo_draft }" />
            AI ช่วยร่าง
          </button>
        </div>
        <textarea v-model="data.ploSummary" class="fld" rows="6" placeholder="สรุปผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตร..." />
      </div>

      <div class="subnav">
        <button type="button" @click="scrollToSub('sub-6-1')">6.1 วิธีการกำหนด PLOs</button>
        <button type="button" @click="scrollToSub('sub-6-2')">6.2 PLOs</button>
        <button type="button" @click="scrollToSub('sub-6-3')">6.3 มาตรฐานคุณวุฒิ</button>
        <button type="button" @click="scrollToSub('sub-6-4')">6.4 ทักษะ 4 ด้าน</button>
        <button type="button" @click="scrollToSub('sub-6-5')">6.5 วิสัยทัศน์/พันธกิจ</button>
        <button type="button" @click="scrollToSub('sub-6-6')">6.6 Graduate Attributes</button>
      </div>

      <section id="sub-6-1" class="sub-section">
        <div class="sub-head">
          <h3>6.1 วิธีการกำหนดผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตร (PLOs)</h3>
          <span class="mini-role user">ผู้ใช้กรอก → AI ตรวจความครบถ้วน</span>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr><th style="width: 22%">กลุ่มผู้มีส่วนได้ส่วนเสีย</th><th>สิ่งที่ต้องทำได้/ได้ทำ</th><th>คุณลักษณะที่คาดหวัง</th><th style="width: 48px" /></tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in data.ploMethodRows" :key="i">
                <td><input v-model="row.stakeholder" class="cell-input" placeholder="ผู้ใช้บัณฑิต / นักศึกษา / อาจารย์" /></td>
                <td><textarea v-model="row.expectedAbility" class="cell-input" rows="2" /></td>
                <td><textarea v-model="row.expectedCharacteristic" class="cell-input" rows="2" /></td>
                <td class="center"><button type="button" class="icon-btn" @click="removePloMethodRow(i)">✕</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <button type="button" class="add-btn mt-3" @click="addPloMethodRow">＋ เพิ่มกลุ่มผู้มีส่วนได้ส่วนเสีย</button>
        <div class="ai-row">
          <button type="button" class="ai-btn" :disabled="aiLoading.plo_method" @click="openPloMethodAi">
            <UIcon :name="aiLoading.plo_method ? 'i-heroicons-arrow-path' : 'i-heroicons-check-badge'" class="w-4 h-4" :class="{ 'animate-spin': aiLoading.plo_method }" />
            AI ตรวจความครบถ้วนของ 6.1
          </button>
        </div>
        <div v-if="aiResults.plo_method" class="ai-result">{{ aiResults.plo_method }}</div>
      </section>

      <section id="sub-6-2" class="sub-section">
        <div class="sub-head">
          <h3>6.2 ผลลัพธ์การเรียนรู้ที่คาดหวังของหลักสูตร (PLOs)</h3>
          <span class="mini-role ai">AI ช่วยร่าง</span>
        </div>
        <div class="plo-list">
          <div v-for="(plo, i) in data.plos" :key="plo.id" class="plo-card">
            <div class="plo-top">
              <input v-model="plo.code" class="fld code-input" placeholder="PLO 1" />
              <select v-model="plo.type" class="fld type-select">
                <option value="S">S — Specific</option>
                <option value="G">G — General</option>
              </select>
              <button type="button" class="icon-btn ml-auto" @click="removePlo(i)">✕</button>
            </div>
            <div class="field">
              <label>ผลลัพธ์การเรียนรู้</label>
              <textarea v-model="plo.description" class="fld" rows="3" placeholder="สามารถ..." />
            </div>
            <div class="field-grid">
              <div class="field">
                <label>กลยุทธ์การสอน</label>
                <textarea v-model="plo.teaching" class="fld" rows="3" placeholder="การบรรยาย การฝึกปฏิบัติ โครงงาน..." />
              </div>
              <div class="field">
                <label>กลยุทธ์การวัดและประเมินผล</label>
                <textarea v-model="plo.assessment" class="fld" rows="3" placeholder="การสอบ การประเมินโครงงาน..." />
              </div>
            </div>
          </div>
        </div>
        <button type="button" class="add-btn mt-3" @click="addPlo">＋ เพิ่ม PLO</button>
        <div class="ai-row">
          <button type="button" class="ai-btn" :disabled="aiLoading.plo_draft" @click="openPloDraftAi">
            <UIcon :name="aiLoading.plo_draft ? 'i-heroicons-arrow-path' : 'i-heroicons-sparkles'" class="w-4 h-4" :class="{ 'animate-spin': aiLoading.plo_draft }" />
            AI ช่วยร่าง PLO
          </button>
        </div>
        <div v-if="aiResults.plo_draft" class="ai-result">{{ aiResults.plo_draft }}</div>
      </section>

      <section id="sub-6-3" class="sub-section">
        <div class="sub-head">
          <h3>6.3 ผลลัพธ์การเรียนรู้ตามมาตรฐานคุณวุฒิระดับอุดมศึกษา พ.ศ. 2565</h3>
          <span class="mini-role user">ผู้ใช้กรอก</span>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th style="width: 28%">มาตรฐานผลลัพธ์การเรียนรู้</th><th>รายละเอียดผลลัพธ์การเรียนรู้</th></tr></thead>
            <tbody>
              <tr v-for="(row, i) in data.tqfRows" :key="i">
                <td><input v-model="row.standard" class="cell-input" /></td>
                <td><textarea v-model="row.details" class="cell-input" rows="3" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="sub-6-4" class="sub-section">
        <div class="sub-head">
          <h3>6.4 ตารางความสัมพันธ์ระหว่าง PLOs กับทักษะและความสามารถ 4 ด้าน</h3>
          <span class="mini-role derived">สร้างจาก 6.2–6.3</span>
        </div>
        <div class="derive-note">ตารางนี้สร้างจากรายการ PLO ใน 6.2 โดยอัตโนมัติ — ผู้ใช้ตรวจสอบและคลิกจุดเชื่อมโยงความสัมพันธ์</div>
        <div class="table-wrap">
          <table class="data-table matrix">
            <thead>
              <tr><th>PLOs</th><th>ความรู้</th><th>ทักษะ</th><th>จริยธรรม</th><th>ลักษณะบุคคล</th></tr>
            </thead>
            <tbody>
              <tr v-for="plo in data.plos" :key="plo.id">
                <td><b>{{ plo.code }}</b> {{ plo.description }}</td>
                <td class="center">
                  <button
                    type="button"
                    class="matrix-dot"
                    :class="{ on: !!ensureSkills(plo).knowledge }"
                    :aria-pressed="!!ensureSkills(plo).knowledge"
                    :title="`ความรู้: ${plo.code}`"
                    @click="ensureSkills(plo).knowledge = !ensureSkills(plo).knowledge"
                  />
                </td>
                <td class="center">
                  <button
                    type="button"
                    class="matrix-dot"
                    :class="{ on: !!ensureSkills(plo).skills }"
                    :aria-pressed="!!ensureSkills(plo).skills"
                    :title="`ทักษะ: ${plo.code}`"
                    @click="ensureSkills(plo).skills = !ensureSkills(plo).skills"
                  />
                </td>
                <td class="center">
                  <button
                    type="button"
                    class="matrix-dot"
                    :class="{ on: !!ensureSkills(plo).ethics }"
                    :aria-pressed="!!ensureSkills(plo).ethics"
                    :title="`จริยธรรม: ${plo.code}`"
                    @click="ensureSkills(plo).ethics = !ensureSkills(plo).ethics"
                  />
                </td>
                <td class="center">
                  <button
                    type="button"
                    class="matrix-dot"
                    :class="{ on: !!ensureSkills(plo).character }"
                    :aria-pressed="!!ensureSkills(plo).character"
                    :title="`ลักษณะบุคคล: ${plo.code}`"
                    @click="ensureSkills(plo).character = !ensureSkills(plo).character"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="sub-6-5" class="sub-section">
        <div class="sub-head">
          <h3>6.5 ตารางความสัมพันธ์ระหว่าง PLOs กับวิสัยทัศน์และพันธกิจของมหาวิทยาลัย</h3>
          <span class="mini-role user">ผู้ใช้กำหนดหัวข้อ → AI ช่วยตรวจ</span>
        </div>
        <div class="field span-2"><label>วิสัยทัศน์</label><input v-model="data.visionStatement" class="fld" /></div>
        <div class="field mt-3">
          <label>พันธกิจ (เพิ่ม/ลบบรรทัดได้)</label>
          <div class="list-editor">
            <div v-for="(mission, i) in data.missions" :key="i" class="list-row">
              <span class="list-index">{{ i + 1 }}</span>
              <input v-model="data.missions[i]" class="fld" placeholder="ระบุพันธกิจ" />
              <button type="button" class="icon-btn" @click="removeMission(i)">✕</button>
            </div>
            <button type="button" class="add-btn" @click="addMission">＋ เพิ่มพันธกิจ</button>
          </div>
        </div>
        <div class="table-wrap mt-3">
          <table class="data-table matrix">
            <thead>
              <tr>
                <th>PLOs</th>
                <th>วิสัยทัศน์</th>
                <th v-for="(mission, i) in data.missions" :key="mission + i">พันธกิจ {{ i + 1 }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="plo in data.plos" :key="plo.id">
                <td><b>{{ plo.code }}</b> {{ plo.description }}</td>
                <td class="center">
                  <button
                    type="button"
                    class="matrix-dot"
                    :class="{ on: !!ensureVision(plo).vision }"
                    :aria-pressed="!!ensureVision(plo).vision"
                    :title="`วิสัยทัศน์: ${plo.code}`"
                    @click="ensureVision(plo).vision = !ensureVision(plo).vision"
                  />
                </td>
                <td v-for="(mission, i) in data.missions" :key="mission + i" class="center">
                  <button
                    type="button"
                    class="matrix-dot"
                    :class="{ on: !!plosVisionMission(plo, i) }"
                    :aria-pressed="!!plosVisionMission(plo, i)"
                    :title="`พันธกิจ ${i + 1}: ${plo.code}`"
                    @click="togglePloVisionMission(plo, i, !plosVisionMission(plo, i))"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="field mt-3">
          <label>หมายเหตุ 6.5</label>
          <textarea v-model="data.missionNote" class="fld" rows="4" placeholder="หมายเหตุ..." />
        </div>
        <div class="ai-row">
          <button type="button" class="ai-btn" :disabled="aiLoading.vision_map" @click="openVisionMapAi">
            <UIcon :name="aiLoading.vision_map ? 'i-heroicons-arrow-path' : 'i-heroicons-check-badge'" class="w-4 h-4" :class="{ 'animate-spin': aiLoading.vision_map }" />
            AI ตรวจความสอดคล้อง 6.5
          </button>
        </div>
        <div v-if="aiResults.vision_map" class="ai-result">{{ aiResults.vision_map }}</div>
      </section>

      <section id="sub-6-6" class="sub-section">
        <div class="sub-head">
          <h3>6.6 ตารางความสัมพันธ์ระหว่าง PLOs กับ Graduate Attributes</h3>
          <span class="mini-role user">ผู้ใช้กำหนดหัวข้อ → AI ช่วยตรวจ</span>
        </div>
        <div class="field">
          <label>Graduate Attributes (เพิ่ม/ลบบรรทัดได้)</label>
          <div class="list-editor">
            <div v-for="(attribute, i) in data.graduateAttributes" :key="i" class="list-row">
              <span class="list-index">{{ i + 1 }}</span>
              <input v-model="data.graduateAttributes[i]" class="fld" placeholder="ระบุ Graduate Attribute" />
              <button type="button" class="icon-btn" @click="removeGraduateAttribute(i)">✕</button>
            </div>
            <button type="button" class="add-btn" @click="addGraduateAttribute">＋ เพิ่ม Graduate Attribute</button>
          </div>
        </div>
        <div class="table-wrap mt-3">
          <table class="data-table matrix">
            <thead>
              <tr>
                <th>PLOs</th>
                <th v-for="(attribute, i) in data.graduateAttributes" :key="attribute + i">GA {{ i + 1 }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="plo in data.plos" :key="plo.id">
                <td><b>{{ plo.code }}</b> {{ plo.description }}</td>
                <td v-for="(attribute, i) in data.graduateAttributes" :key="attribute + i" class="center">
                  <button
                    type="button"
                    class="matrix-dot"
                    :class="{ on: !!ploGaAttribute(plo, i) }"
                    :aria-pressed="!!ploGaAttribute(plo, i)"
                    :title="`GA ${i + 1}: ${plo.code}`"
                    @click="togglePloGaAttribute(plo, i, !ploGaAttribute(plo, i))"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="field mt-3">
          <label>หมายเหตุ 6.6</label>
          <textarea v-model="data.graduateAttributeNote" class="fld" rows="4" placeholder="หมายเหตุ..." />
        </div>
        <div class="ai-row">
          <button type="button" class="ai-btn" :disabled="aiLoading.ga_map" @click="openGaMapAi">
            <UIcon :name="aiLoading.ga_map ? 'i-heroicons-arrow-path' : 'i-heroicons-check-badge'" class="w-4 h-4" :class="{ 'animate-spin': aiLoading.ga_map }" />
            AI ตรวจความสอดคล้อง 6.6
          </button>
        </div>
        <div v-if="aiResults.ga_map" class="ai-result">{{ aiResults.ga_map }}</div>
      </section>
    </article>

    <!-- 2.3 + 6.7 -->
    <article v-else-if="section === '2.3'" class="obe-card">
      <header class="obe-card-head">
        <div class="sec-no">2.3</div>
        <div class="head-text">
          <h2>วัตถุประสงค์ของหลักสูตร (PEO)</h2>
          <p>AI ช่วยร่าง PEO หลังสำเร็จการศึกษา และแสดงความสัมพันธ์กับ PLO ใน 6.7</p>
        </div>
        <span class="role-tag ai">AI ช่วยร่าง PEO</span>
      </header>

      <div class="plo-list">
        <div v-for="(peo, i) in data.peos" :key="peo.id" class="plo-card compact">
          <div class="plo-top">
            <input v-model="peo.code" class="fld code-input" placeholder="PEO 1" />
            <button type="button" class="icon-btn ml-auto" @click="removePeo(i)">✕</button>
          </div>
          <textarea v-model="peo.description" class="fld" rows="3" placeholder="ผลิตบัณฑิตที่..." />
        </div>
      </div>
      <div class="ai-row">
        <button type="button" class="add-btn" @click="addPeo">＋ เพิ่ม PEO</button>
        <button type="button" class="ai-btn" :disabled="aiLoading.peo" @click="openPeoAiModal">
          <UIcon :name="aiLoading.peo ? 'i-heroicons-arrow-path' : 'i-heroicons-sparkles'" class="w-4 h-4" :class="{ 'animate-spin': aiLoading.peo }" />
          AI ช่วยร่าง PEO
        </button>
        <span class="ai-hint">AI จะเพิ่ม PEO ที่ร่างแล้วไว้ในรายการด้านบน</span>
      </div>

      <section id="sub-6-7" class="sub-section">
        <div class="sub-head">
          <h3>6.7 ตารางความสัมพันธ์ระหว่าง PLOs กับ PEOs</h3>
          <span class="mini-role derived">สร้างจาก 2.3/PEO</span>
        </div>
        <div class="derive-note">ตารางนี้ใช้ PEO จาก 2.3 ด้านบน — ติ๊กความสัมพันธ์ระหว่าง PLO กับ PEO</div>
        <div class="table-wrap">
          <table class="data-table matrix">
            <thead>
              <tr>
                <th>PLOs</th>
                <th v-for="peo in data.peos" :key="peo.id">{{ peo.code }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="plo in data.plos" :key="plo.id">
                <td><b>{{ plo.code }}</b> {{ plo.description }}</td>
                <td v-for="peo in data.peos" :key="peo.id" class="center">
                  <button
                    type="button"
                    class="matrix-dot"
                    :class="{ on: !!ensureMap(plo, 'peo')[peo.id] }"
                    @click="toggleMap(ensureMap(plo, 'peo'), peo.id)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </article>

    <!-- 2.7 -->
    <article v-else-if="section === '2.7'" class="obe-card">
      <header class="obe-card-head">
        <div class="sec-no">2.7</div>
        <div class="head-text">
          <h2>ความคาดหวังของผลลัพธ์การเรียนรู้</h2>
          <p>AI ช่วยเสนอระดับความสามารถ คำกริยาที่วัดได้ และหลักฐานการประเมิน</p>
        </div>
        <span class="role-tag ai">AI ช่วยเสนอระดับและหลักฐาน</span>
      </header>

      <div class="subnav">
        <button type="button" @click="scrollToSub('sub-7-1')">7.1 YLOs</button>
        <button type="button" @click="scrollToSub('sub-7-2')">7.2 ความสัมพันธ์ PLOs–YLOs</button>
      </div>

      <section id="sub-7-1" class="sub-section">
        <div class="sub-head">
          <h3>7.1 ความคาดหวังของผลลัพธ์การเรียนรู้เมื่อสิ้นปีการศึกษา (YLOs)</h3>
          <span class="mini-role ai">AI ช่วยเสนอ</span>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr><th style="width: 90px">ชั้นปี</th><th style="width: 120px">รหัส YLO</th><th>ผลลัพธ์การเรียนรู้</th><th style="width: 48px" /></tr>
            </thead>
            <tbody>
              <tr v-for="(ylo, i) in data.ylos" :key="ylo.id">
                <td><input v-model="ylo.year" class="cell-input" placeholder="1" style="width:100%; box-sizing:border-box" /></td>
                <td><input v-model="ylo.code" class="cell-input" placeholder="YLO 1.1" style="width:100%; box-sizing:border-box" /></td>
                <td><textarea v-model="ylo.description" class="cell-input" rows="2" style="width:100%; box-sizing:border-box" /></td>
                <td class="center"><button type="button" class="icon-btn" @click="removeYlo(i)">✕</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="ai-row">
          <button type="button" class="add-btn" @click="addYlo">＋ เพิ่ม YLO</button>
          <button type="button" class="ai-btn" :disabled="aiLoading.ylo" @click="openYloAiModal">
            <UIcon :name="aiLoading.ylo ? 'i-heroicons-arrow-path' : 'i-heroicons-sparkles'" class="w-4 h-4" :class="{ 'animate-spin': aiLoading.ylo }" />
            AI ช่วยเสนอ YLO
          </button>
          <span class="ai-hint">AI จะเพิ่ม YLO พร้อมชั้นปี รหัส และผลลัพธ์การเรียนรู้ในตารางด้านบน</span>
        </div>
      </section>

      <section id="sub-7-2" class="sub-section">
        <div class="sub-head">
          <h3>7.2 ตารางความสัมพันธ์ระหว่าง PLOs กับ YLOs</h3>
          <span class="mini-role derived">สร้างจาก 6.2/7.1</span>
        </div>
        <div class="derive-note">ตารางนี้ใช้ PLO จาก 6.2 และ YLO จาก 7.1 — คลิกจุดเพื่อเชื่อมโยง</div>
        <div class="table-wrap">
          <table class="data-table matrix">
            <thead>
              <tr>
                <th>YLOs</th>
                <th v-for="plo in data.plos" :key="plo.id">{{ plo.code }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ylo in data.ylos" :key="ylo.id">
                <td><b>{{ ylo.code }}</b> {{ ylo.description }}</td>
                <td v-for="plo in data.plos" :key="plo.id" class="center">
                  <button
                    type="button"
                    class="matrix-dot"
                    :class="{ on: !!ensureMap(ylo, 'plos')[plo.id] }"
                    :aria-pressed="!!ensureMap(ylo, 'plos')[plo.id]"
                    :title="`เชื่อมโยง ${ylo.code} กับ ${plo.code}`"
                    @click="toggleMap(ensureMap(ylo, 'plos'), plo.id)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </article>

    <div v-if="aiError" class="ai-error">{{ aiError }}</div>

    <AiAssistModal
      :open="aiModalOpen"
      :title="aiModalTitle"
      :left-title="aiModalLeftTitle"
      :right-title="aiModalRightTitle"
      :loading="aiModalLoading"
      :versions="aiModalVersions"
      @update:open="handleAiModalOpen"
      @generate="generateAiModalVersion"
      @apply="applyAiModalVersion"
    >
      <template #left>
        <textarea
          v-model="aiModalText"
          class="ai-modal-textarea"
          rows="18"
          placeholder="พิมพ์หรือแก้ไขข้อความตรงนี้ แล้วกดให้ AI ร่าง..."
        />
        <p class="ai-modal-hint">ข้อความด้านซ้ายจะถูกส่งให้ AI ใช้เป็นบริบท และจะถูกบันทึกกลับเมื่อปิดหน้าต่าง</p>
      </template>
      <template #version="{ version }">
        <div>{{ version.text }}</div>
      </template>
    </AiAssistModal>
  </div>
</template>

<style scoped>
.obe2-sections { display: flex; flex-direction: column; gap: 20px; font-size: 15px; color: var(--ink); }
.obe-card { background: var(--panel); border: 1px solid var(--line); border-radius: 14px; padding: 28px; box-shadow: 0 2px 10px rgba(80, 58, 33, 0.04); }
.obe-card-head { display: flex; align-items: flex-start; gap: 14px; padding-bottom: 18px; border-bottom: 1px solid var(--line); margin-bottom: 22px; }
.sec-no { flex: none; width: 48px; height: 48px; border-radius: 50%; background: var(--soft); color: var(--btn); display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 700; }
.head-text { flex: 1; min-width: 0; }
.head-text h2 { margin: 0 0 5px; font-size: 22px; line-height: 1.35; color: #2f2a25; }
.head-text p { margin: 0; color: #5f554a; font-size: 14.5px; line-height: 1.6; }
.role-tag { flex: none; border-radius: 999px; padding: 6px 12px; font-size: 12px; font-weight: 600; white-space: nowrap; }
.role-tag.user { background: #f1eee8; color: #5f554a; }
.role-tag.ai { background: #eee0c6; color: #765633; }
.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 20px; }
.field { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
.field.span-2 { grid-column: 1 / -1; }
.field label { color: #4f463c; font-size: 14px; font-weight: 600; line-height: 1.45; }
.label-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.label-row label { flex: 1; min-width: 180px; }
.fld { width: 100%; padding: 11px 13px; border: 1px solid var(--line); border-radius: 8px; background: #fff; color: var(--ink); resize: vertical; transition: 0.15s; font-size: 14.5px; line-height: 1.65; }
.fld:focus { outline: none; border-color: var(--acc); box-shadow: 0 0 0 2px rgba(156, 120, 83, 0.12); }
.sub-title { margin: 26px 0 13px; padding-top: 17px; border-top: 1px dashed var(--line); font-size: 17px; line-height: 1.5; color: #3b332b; }
.sub-title-sm { font-size: 15.5px; }
.list-editor { display: flex; flex-direction: column; gap: 10px; }
.list-row { display: flex; align-items: center; gap: 10px; }
.list-index { width: 28px; flex: none; text-align: center; color: #5f554a; font-size: 13.5px; font-weight: 600; }
.icon-btn { flex: none; border: 1px solid transparent; background: none; color: var(--mute); border-radius: 6px; width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; transition: 0.15s; }
.icon-btn:hover { color: var(--danger); background: #fef2f2; border-color: #fecaca; }
.add-btn { align-self: flex-start; border: 1px dashed var(--mute); background: none; color: var(--ink); border-radius: 8px; padding: 8px 16px; font-size: 14px; font-weight: 500; transition: 0.15s; }
.add-btn:hover { border-color: var(--acc); color: var(--acc); background: var(--soft); border-style: solid; }
.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 18px; }
.table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 10px; background: #fff; }
.data-table { width: 100%; border-collapse: collapse; min-width: 680px; }
.data-table th, .data-table td { padding: 11px 12px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; font-size: 14px; line-height: 1.55; }
.data-table th { background: #f7f0e5; color: #4f463c; font-weight: 600; white-space: nowrap; }
.data-table tr:last-child td { border-bottom: none; }
.data-table.matrix { min-width: 760px; }
.data-table.matrix td { font-size: 13.5px; line-height: 1.55; }
.data-table.matrix th:not(:first-child), .data-table.matrix td:not(:first-child) { text-align: center; }
.cell-input { width: 100%; border: 1px solid transparent; background: transparent; border-radius: 6px; padding: 6px 7px; color: var(--ink); resize: vertical; font-size: 14px; line-height: 1.55; }
.cell-input:hover { border-color: var(--line); background: #fff; }
.cell-input:focus { outline: none; border-color: var(--acc); background: #fff; box-shadow: 0 0 0 2px rgba(156, 120, 83, 0.1); }
.center { text-align: center !important; }
.ai-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 16px; }
.ai-btn { display: inline-flex; align-items: center; gap: 7px; border: 1px solid var(--acc); background: var(--soft); color: var(--btn); border-radius: 8px; padding: 8px 14px; font-size: 13.5px; font-weight: 600; transition: 0.15s; }
.ai-btn:hover:not(:disabled) { background: #e5d6c2; }
.ai-btn:disabled { opacity: 0.6; cursor: wait; }
.ai-btn.ghost { background: #fff; }
.ai-btn.small { padding: 6px 11px; font-size: 12.5px; }
.ai-hint { color: #5f554a; font-size: 12.5px; line-height: 1.5; }
.ai-result { margin-top: 12px; padding: 12px 14px; border: 1px dashed var(--acc); border-radius: 8px; background: #fffcf6; color: var(--ink); font-size: 14px; white-space: pre-wrap; line-height: 1.6; }
.ai-error { color: var(--danger); background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 10px 14px; font-size: 14px; }
.ai-modal-textarea { width: 100%; min-height: 360px; border: 1px solid var(--line); border-radius: 9px; background: #fff; padding: 12px 13px; color: var(--ink); font-size: 14.5px; line-height: 1.7; resize: vertical; }
.ai-modal-textarea:focus { outline: none; border-color: var(--acc); box-shadow: 0 0 0 2px rgba(156, 120, 83, 0.12); }
.ai-modal-hint { margin: 8px 0 0; color: #5f554a; font-size: 12.5px; line-height: 1.55; }
.fact-proposal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.fact-box, .proposal-box { border: 1px solid var(--line); border-radius: 10px; padding: 12px; }
.fact-box { background: #f8fafc; }
.proposal-box { background: #fffbf2; }
.fact-box h4, .proposal-box h4 { margin: 0 0 8px; font-size: 13px; }
.fact-box h4 { color: #475569; }
.proposal-box h4 { color: #9a6f35; }
.plo-list { display: flex; flex-direction: column; gap: 14px; }
.plo-card { border: 1px solid var(--line); border-radius: 12px; padding: 14px; background: #fffdfa; display: flex; flex-direction: column; gap: 12px; }
.plo-card.compact { gap: 8px; }
.plo-top { display: flex; align-items: center; gap: 10px; }
.code-input { width: 130px; flex: none; font-weight: 700; }
.type-select { width: 150px; flex: none; }
.ml-auto { margin-left: auto; }
.subnav { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 20px; }
.subnav button { border: 1px solid var(--line); background: #fff; border-radius: 999px; padding: 7px 13px; font-size: 13px; color: #5f554a; transition: 0.15s; }
.subnav button:hover { border-color: var(--acc); color: var(--acc); background: var(--soft); }
.sub-section { padding: 22px 0; border-top: 1px dashed var(--line); scroll-margin-top: 20px; }
.sub-section:first-of-type { border-top: none; padding-top: 0; }
.sub-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.sub-head h3 { margin: 0; font-size: 16.5px; line-height: 1.5; color: #3b332b; }
.mini-role { flex: none; border-radius: 999px; padding: 5px 10px; font-size: 11.5px; font-weight: 600; white-space: nowrap; }
.mini-role.user { background: #f1eee8; color: #5f554a; }
.mini-role.ai { background: #eee0c6; color: #765633; }
.mini-role.derived { background: #e8f3e8; color: #15803d; }
.derive-note { margin-bottom: 12px; padding: 9px 12px; border-radius: 7px; background: #f2f8f2; color: #355f35; font-size: 13px; line-height: 1.55; }
.matrix-dot { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid #b9aa98; background: #fff; transition: 0.15s; }
.matrix-dot:hover { border-color: var(--acc); background: var(--soft); }
.matrix-dot.on { background: var(--btn); border-color: var(--btn); box-shadow: inset 0 0 0 4px #fff; }
@media (max-width: 860px) {
  .field-grid, .fact-proposal-grid { grid-template-columns: 1fr; }
  .obe-card { padding: 16px; }
  .obe-card-head { flex-wrap: wrap; }
  .role-tag { margin-left: 60px; }
  .sub-head { flex-direction: column; }
}
</style>
