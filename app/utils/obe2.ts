// Shared shape + helpers for the OBE 2 sections 1–2 editor.
// All values are plain JSON so the whole form can also be saved as one draft blob.

export const obe2Uid = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export const createPlo = (index = 0, missionCount = 4, graduateCount = 4) => ({
  id: obe2Uid('plo'),
  code: `PLO ${index + 1}`,
  type: 'S',
  description: '',
  teaching: '',
  assessment: '',
  skills: {
    knowledge: false,
    skills: false,
    ethics: false,
    character: false
  },
  vision: {
    vision: false,
    missions: Array.from({ length: missionCount }, () => false)
  },
  ga: {
    attributes: Array.from({ length: graduateCount }, () => false)
  },
  peo: {} as Record<string, boolean>
})

export const createPeo = (index = 0) => ({
  id: obe2Uid('peo'),
  code: `PEO ${index + 1}`,
  description: ''
})

export const createYlo = (index = 0) => ({
  id: obe2Uid('ylo'),
  year: '1',
  code: `YLO 1.${index + 1}`,
  description: '',
  plos: {} as Record<string, boolean>
})

export const createObe2 = () => ({
  programCode: '',
  nameTh: '',
  nameEn: '',

  degreeNameTh: '',
  degreeAbbrTh: '',
  degreeNameEn: '',
  degreeAbbrEn: '',

  majors: [''] as string[],

  programFormat: '',
  durationYears: '',
  programCategory: '',
  programType: '',
  language: 'ภาษาไทย',
  admissionReq: '',
  cooperation: '',
  degreeGranting: '',

  approvalStatus: '',
  approvals: [{ committee: '', approvalDate: '', note: '' }] as Array<Record<string, string>>,

  philosophy: '',

  importanceOverview: '',
  importanceEconomic: '',
  importanceSocial: '',
  importanceFacts: '',
  importanceRationale: '',
  impactDevelopment: '',
  universityMission: '',
  curriculumRelationExternal: '',
  curriculumRelationInternal: '',
  curriculumRelationManagement: '',
  developmentPlans: [{ plan: '', strategy: '', indicator: '' }] as Array<Record<string, string>>,

  uniqueness: '',
  competitorComparison: '',

  careers: [''] as string[],
  careerAnalysis: '',

  ploMethodRows: [{ stakeholder: '', expectedAbility: '', expectedCharacteristic: '' }] as Array<Record<string, string>>,
  ploMethodCheck: '',

  ploSummary: '',

  plos: [createPlo(0, 4, 4)],

  tqfRows: [
    { standard: '1. ความรู้ (Knowledge)', details: '' },
    { standard: '2. ทักษะ (Skills)', details: '' },
    { standard: '3. จริยธรรม (Ethics)', details: '' },
    { standard: '4. ลักษณะบุคคล (Character)', details: '' }
  ] as Array<Record<string, string>>,

  visionStatement: 'มหาวิทยาลัยชั้นนำด้านวิทยาศาสตร์ เทคโนโลยี และนวัตกรรม เป็นที่ยอมรับในระดับนานาชาติ',
  missions: [
    'ผลิตบัณฑิตที่พึงประสงค์',
    'วิจัยและพัฒนา',
    'บริการวิชาการแก่สังคม',
    'ทำนุบำรุงศิลปะและวัฒนธรรม (รวมถึง จริยธรรม)'
  ] as string[],
  mission1: 'ผลิตบัณฑิตที่พึงประสงค์',
  mission2: 'วิจัยและพัฒนา',
  mission3: 'บริการวิชาการแก่สังคม',
  mission4: 'ทำนุบำรุงศิลปะและวัฒนธรรม (รวมถึง จริยธรรม)',

  missionNote: '',

  ga1: 'เป็นผู้มีความรู้ความสามารถในวิชาชีพ และมีทักษะด้านความคิดสร้างสรรค์',
  ga2: 'เป็นผู้มีความซื่อสัตย์ รับผิดชอบ มีคุณธรรม จริยธรรม ทำประโยชน์เพื่อสังคม และเป็นที่พึ่งทางวิชาการ',
  ga3: 'เป็นผู้มีฐานคิดและความเป็นผู้ประกอบการด้านนวัตกรรมและเทคโนโลยี',
  ga4: 'เป็นบุคคลที่สามารถแข่งขันได้ในระดับชาติและนานาชาติ',
  graduateAttributes: [
    'เป็นผู้มีความรู้ความสามารถในวิชาชีพ และมีทักษะด้านความคิดสร้างสรรค์',
    'เป็นผู้มีความซื่อสัตย์ รับผิดชอบ มีคุณธรรม จริยธรรม ทำประโยชน์เพื่อสังคม และเป็นที่พึ่งทางวิชาการ',
    'เป็นผู้มีฐานคิดและความเป็นผู้ประกอบการด้านนวัตกรรมและเทคโนโลยี',
    'เป็นบุคคลที่สามารถแข่งขันได้ในระดับชาติและนานาชาติ'
  ] as string[],
  graduateAttributeNote: '',

  peos: [createPeo(0)],
  peoSuggestion: '',

  ylos: [createYlo(0)],
  yloSuggestion: ''
})

const text = (value: any) => (typeof value === 'string' ? value : '')
const bool = (value: any) => value === true
const list = (value: any) => (Array.isArray(value) ? value : [])

const normalizeStringArray = (raw: any, fallback: string[] = []) => {
  if (!Array.isArray(raw)) return [...fallback]
  return raw.map((x: any) => String(x ?? '')).filter((x, i) => x.trim() !== '' || fallback[i]?.trim() !== '')
}

const normalizePlo = (raw: any, index: number, missionCount = 4, graduateCount = 4): any => {
  const base = createPlo(index, missionCount, graduateCount)
  const source = raw && typeof raw === 'object' ? raw : {}
  const missions = Array.isArray(source.vision?.missions)
    ? Array.from({ length: missionCount }, (_, i) => bool(source.vision.missions[i]))
    : Array.from({ length: missionCount }, (_, i) => bool(source.vision?.[`mission${i + 1}`]))
  const attributes = Array.isArray(source.ga?.attributes)
    ? Array.from({ length: graduateCount }, (_, i) => bool(source.ga.attributes[i]))
    : Array.from({ length: graduateCount }, (_, i) => bool(source.ga?.[`ga${i + 1}`]))
  return {
    ...base,
    ...source,
    id: source.id || base.id,
    code: text(source.code) || base.code,
    type: source.type === 'G' ? 'G' : 'S',
    description: text(source.description),
    teaching: text(source.teaching),
    assessment: text(source.assessment),
    skills: {
      knowledge: bool(source.skills?.knowledge),
      skills: bool(source.skills?.skills),
      ethics: bool(source.skills?.ethics),
      character: bool(source.skills?.character)
    },
    vision: {
      vision: bool(source.vision?.vision),
      missions
    },
    ga: {
      attributes
    },
    peo: source.peo && typeof source.peo === 'object' ? { ...source.peo } : {}
  }
}

const normalizePeo = (raw: any, index: number): any => {
  const base = createPeo(index)
  const source = raw && typeof raw === 'object' ? raw : {}
  return {
    ...base,
    ...source,
    id: source.id || base.id,
    code: text(source.code) || base.code,
    description: text(source.description)
  }
}

const normalizeYlo = (raw: any, index: number): any => {
  const base = createYlo(index)
  const source = raw && typeof raw === 'object' ? raw : {}
  return {
    ...base,
    ...source,
    id: source.id || base.id,
    year: text(source.year) || base.year,
    code: text(source.code) || base.code,
    description: text(source.description),
    plos: source.plos && typeof source.plos === 'object' ? { ...source.plos } : {}
  }
}

const normalizeTextRows = (raw: any, defaults: Array<Record<string, string>>, keys: string[]) => {
  const rows = list(raw)
  const source = rows.length ? rows : defaults
  return source.map((row: any) => {
    const next: Record<string, string> = {}
    keys.forEach(key => { next[key] = text(row?.[key]) })
    return next
  })
}

export const normalizeObe2 = (raw: any) => {
  const base = createObe2()
  const source = raw && typeof raw === 'object' ? raw : {}

  const result: any = {
    ...base,
    ...source
  }

  ;[
    'programCode', 'nameTh', 'nameEn',
    'degreeNameTh', 'degreeAbbrTh', 'degreeNameEn', 'degreeAbbrEn',
    'programFormat', 'durationYears', 'programCategory', 'programType', 'language',
    'admissionReq', 'cooperation', 'degreeGranting',
    'approvalStatus', 'philosophy', 'importanceOverview', 'importanceEconomic',
    'importanceSocial', 'importanceFacts', 'importanceRationale',
    'impactDevelopment', 'universityMission',
    'curriculumRelationExternal', 'curriculumRelationInternal', 'curriculumRelationManagement',
    'uniqueness', 'competitorComparison',
    'careerAnalysis', 'ploMethodCheck', 'visionStatement', 'mission1', 'mission2',
    'careerAnalysis', 'ploMethodCheck', 'visionStatement', 'missionNote',
    'graduateAttributeNote', 'ploSummary',
    'mission1', 'mission2', 'mission3', 'mission4', 'ga1', 'ga2', 'ga3', 'ga4',
    'peoSuggestion', 'yloSuggestion'
  ].forEach(key => { result[key] = text(source[key]) || text(base[key]) })

  const missions = normalizeStringArray(source.missions, base.missions)
  const graduateAttributes = normalizeStringArray(source.graduateAttributes, base.graduateAttributes)
  result.missions = missions.length ? missions : [...base.missions]
  result.graduateAttributes = graduateAttributes.length ? graduateAttributes : [...base.graduateAttributes]

  result.durationYears = result.durationYears || ''

  const majors = list(source.majors).map((x: any) => text(x)).filter(Boolean)
  result.majors = majors.length ? majors : ['']

  const careers = list(source.careers).map((x: any) => text(x)).filter(Boolean)
  result.careers = careers.length ? careers : ['']

  result.approvals = normalizeTextRows(
    source.approvals,
    base.approvals,
    ['committee', 'approvalDate', 'note']
  )
  result.developmentPlans = normalizeTextRows(
    source.developmentPlans,
    base.developmentPlans,
    ['plan', 'strategy', 'indicator']
  )
  result.ploMethodRows = normalizeTextRows(
    source.ploMethodRows,
    base.ploMethodRows,
    ['stakeholder', 'expectedAbility', 'expectedCharacteristic']
  )
  result.tqfRows = normalizeTextRows(
    source.tqfRows,
    base.tqfRows,
    ['standard', 'details']
  )

  const plos = list(source.plos)
  result.plos = (plos.length ? plos : base.plos).map((row: any, i: number) => normalizePlo(row, i, result.missions.length || 4, result.graduateAttributes.length || 4))
  const peos = list(source.peos)
  result.peos = (peos.length ? peos : base.peos).map((row: any, i: number) => normalizePeo(row, i))
  const ylos = list(source.ylos)
  result.ylos = (ylos.length ? ylos : base.ylos).map((row: any, i: number) => normalizeYlo(row, i))

  return result
}

export const parseJsonValue = (value: string | null | undefined, fallback: any) => {
  if (!value) return fallback
  try {
    const parsed = JSON.parse(value)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

export const buildObe2Payload = (data: any, totalCredits: number) => {
  const clip = (value: any, max: number) => {
    const v = typeof value === 'string' ? value.trim() : value
    if (v === '' || v === null || v === undefined) return null
    return typeof v === 'string' ? v.slice(0, max) : v
  }
  const clean = (value: any) => clip(value, 65535)

  return {
    program_code: clip(data.programCode, 50),
    name_th: clip(data.nameTh, 255),
    name_en: clip(data.nameEn, 255),
    degree_name_th: clip(data.degreeNameTh, 255),
    degree_abbr_th: clip(data.degreeAbbrTh, 50),
    degree_name_en: clip(data.degreeNameEn, 255),
    degree_abbr_en: clip(data.degreeAbbrEn, 50),
    program_format: clip(data.programFormat, 100),
    duration_years: data.durationYears ? Number(data.durationYears) : null,
    program_category: clip(data.programCategory, 255),
    program_type: clip(data.programType, 100),
    language: clip(data.language, 255),
    admission_req: clean(data.admissionReq),
    cooperation: clean(data.cooperation),
    degree_granting: clip(data.degreeGranting, 255),
    approval_details: clean(data.approvalStatus),
    philosophy: clean(data.philosophy),
    importance: clean(data.importanceOverview),
    economic_situation: clean(data.importanceEconomic),
    social_situation: clean(data.importanceSocial),
    development_plan: clean(data.impactDevelopment),
    university_mission: clean(data.universityMission),
    uniqueness: clean(data.uniqueness),
    objectives: JSON.stringify(data.peos || []),
    careers: JSON.stringify((data.careers || []).filter((x: string) => x.trim())),
    total_credits: Number(totalCredits) || 0
  }
}

export const buildObe2ProgramName = (data: any) => text(data?.nameTh).trim()
