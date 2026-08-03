<!-- pages/appendix/a.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const route = useRoute()
const router = useRouter()
const programId = ref<string | null>(null)

// รายชื่อหัวข้อในภาคผนวก ก.
const sectionTitles = [
  "แผนภูมิความต่อเนื่อง — แขนงวิชาโทรคมนาคม (EnET-T)",
  "แผนภูมิความต่อเนื่อง — แขนงวิชาคอมพิวเตอร์ (EnET-C)",
  "แผนภูมิความต่อเนื่อง — แขนงวิชาเครื่องมือวัดและควบคุม (EnET-I)",
  "แผนภูมิความต่อเนื่อง — แขนงวิชาการกระจายเสียงวิทยุและโทรทัศน์ (EnET-B)"
]

const doneState = ref<Record<number, boolean>>({})
const toggleDone = (index: number) => { doneState.value[index] = !doneState.value[index] }

const isSavingDraft = ref(false)
const isSavingNext = ref(false)
const saveDraft = async () => { isSavingDraft.value = true; await new Promise(r => setTimeout(r, 1000)); isSavingDraft.value = false; }
const saveAndNext = async () => { isSavingNext.value = true; await new Promise(r => setTimeout(r, 1000)); isSavingNext.value = false; router.push({ path: '/appendix/b', query: { id: programId.value } }) }

const scrollToSec = (id: string) => {
  const el = document.getElementById(id)
  if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.classList.add('pulse'); setTimeout(() => el.classList.remove('pulse'), 1200) }
}

// ================= FLOW MAP DATA & LOGIC =================
const CAT_COLOR = { gened:'#8C96AF', basic:'#4C7A9A', core:'#1B2A4A', elective:'#3F6B52', field:'#A8793B' }
const CAT_LABEL = { gened:'หมวดศึกษาทั่วไป', basic:'กลุ่มวิชาแกน', core:'กลุ่มวิชาชีพ-บังคับเฉพาะแขนง', elective:'กลุ่มวิชาชีพ-เลือกเฉพาะแขนง/เลือกเสรี', field:'ประสบการณ์ภาคสนาม/สหกิจศึกษา' }

const FLOW_COLS_8 = [
  {label:'ปีที่ 1', sub:'ภาคการศึกษาที่ 1'}, {label:'ปีที่ 1', sub:'ภาคการศึกษาที่ 2'},
  {label:'ปีที่ 2', sub:'ภาคการศึกษาที่ 1'}, {label:'ปีที่ 2', sub:'ภาคการศึกษาที่ 2'},
  {label:'ปีที่ 3', sub:'ภาคการศึกษาที่ 1'}, {label:'ปีที่ 3', sub:'ภาคการศึกษาที่ 2'},
  {label:'ปีที่ 4', sub:'ภาคการศึกษาที่ 1'}, {label:'ปีที่ 4', sub:'ภาคการศึกษาที่ 2'},
]

const FLOWMAPS: Record<string, any> = {
  'app-ก-1': { // แขนงวิชาโทรคมนาคม (EnET-T)
    cols: FLOW_COLS_8,
    nodes: [
      {id:'t1',col:0,code:'030103300',name:'การเขียนแบบวิศวกรรม',cat:'basic'},{id:'t2',col:0,code:'040113001',name:'เคมีสำหรับวิศวกร',cat:'basic'},
      {id:'t3',col:0,code:'040113002',name:'ปฏิบัติการเคมีสำหรับวิศวกร',cat:'basic'},{id:'t4',col:0,code:'040203111',name:'คณิตศาสตร์วิศวกรรม 1',cat:'basic'},
      {id:'t5',col:0,code:'040313005',name:'ฟิสิกส์ 1',cat:'basic'},{id:'t6',col:0,code:'040313006',name:'ปฏิบัติการฟิสิกส์ 1',cat:'basic'},
      {id:'t7',col:0,code:'080103001',name:'ภาษาอังกฤษ 1',cat:'gened'},{id:'t8',col:0,code:'04xxxxxxx',name:'วิชาเลือกวิทยาศาสตร์และคณิตศาสตร์',cat:'gened'},
      {id:'t9',col:1,code:'030103102',name:'กลศาสตร์วิศวกรรม 1',cat:'basic'},{id:'t10',col:1,code:'030413100',name:'การวิเคราะห์วงจรไฟฟ้า 1',cat:'basic'},
      {id:'t11',col:1,code:'030413221',name:'ปฏิบัติการวิเคราะห์วงจรไฟฟ้า',cat:'basic'},{id:'t12',col:1,code:'030513900',name:'การโปรแกรมคอมพิวเตอร์',cat:'basic'},
      {id:'t13',col:1,code:'040203112',name:'คณิตศาสตร์วิศวกรรม 2',cat:'basic'},{id:'t14',col:1,code:'040313007',name:'ฟิสิกส์ 2',cat:'basic'},
      {id:'t15',col:1,code:'080103002',name:'ภาษาอังกฤษ 2',cat:'gened'},
      {id:'t16',col:2,code:'030103100',name:'วัสดุวิศวกรรม',cat:'core'},{id:'t17',col:2,code:'030413120',name:'เครื่องมือวัดและการวัดทางไฟฟ้า',cat:'core'},
      {id:'t18',col:2,code:'030513120',name:'สัญญาณและระบบ',cat:'core'},{id:'t19',col:2,code:'030513220',name:'ปฏิบัติงานอิเล็กทรอนิกส์ 1',cat:'basic'},
      {id:'t20',col:2,code:'030513334',name:'การออกแบบวงจรดิจิทัลและวงจรตรรกะ',cat:'basic'},{id:'t21',col:2,code:'030513500',name:'อิเล็กทรอนิกส์วิศวกรรม',cat:'basic'},
      {id:'t22',col:2,code:'040203211',name:'คณิตศาสตร์วิศวกรรม 3',cat:'basic'},
      {id:'t23',col:3,code:'030413145',name:'สนามแม่เหล็กไฟฟ้า',cat:'core'},{id:'t24',col:3,code:'030513123',name:'การสื่อสารข้อมูลและโครงข่าย',cat:'core'},
      {id:'t25',col:3,code:'030513125',name:'หลักการสื่อสาร',cat:'core'},{id:'t26',col:3,code:'030513221',name:'ปฏิบัติงานอิเล็กทรอนิกส์ 2',cat:'basic'},
      {id:'t27',col:3,code:'030513902',name:'ระบบควบคุมเชิงเส้น',cat:'core'},{id:'t28',col:3,code:'xxxxxxxxx',name:'วิชาเลือกเสรี 1',cat:'elective'},
      {id:'t29',col:4,code:'030513140',name:'โครงข่ายการสื่อสารและสายส่ง',cat:'core'},{id:'t30',col:4,code:'030513142',name:'วิศวกรรมสายอากาศ',cat:'core'},
      {id:'t31',col:4,code:'030513143',name:'การสื่อสารดิจิทัล',cat:'core'},{id:'t32',col:4,code:'030513240',name:'ปฏิบัติงานโทรคมนาคม 1',cat:'core'},
      {id:'t33',col:4,code:'030513343',name:'ระบบเครือข่ายคอมพิวเตอร์',cat:'core'},
      {id:'t34',col:5,code:'030513150',name:'วิศวกรรมไมโครเวฟ',cat:'core'},{id:'t35',col:5,code:'030513165',name:'การสื่อสารทางแสง',cat:'core'},
      {id:'t36',col:5,code:'030513246',name:'ปฏิบัติงานโทรคมนาคม 2',cat:'core'},{id:'t37',col:5,code:'030513261',name:'สัมมนาทางวิศวกรรมโทรคมนาคม',cat:'core'},
      {id:'t38',col:5,code:'030513xxx',name:'วิชาเลือกเฉพาะแขนง 1-2',cat:'elective'},
      {id:'t39',col:6,code:'030513160',name:'โครงงานเทคโนโลยีวิศวกรรมโทรคมนาคม',cat:'core'},{id:'t40',col:6,code:'030513xxx',name:'วิชาเลือกเฉพาะแขนง 3-4',cat:'elective'},
      {id:'t41',col:7,code:'030513260',name:'สหกิจศึกษา',cat:'field'},
    ],
    edges: [['t4','t13'],['t13','t22'],['t5','t14'],['t10','t17'],['t10','t19'],['t20','t18'],['t17','t23'],['t18','t24'],['t18','t25'],['t23','t30'],['t25','t29'],['t29','t30'],['t25','t31'],['t30','t34'],['t24','t33'],['t31','t35'],['t31','t39'],['t34','t39'],['t39','t41']],
  },
  'app-ก-2': { // แขนงวิชาคอมพิวเตอร์ (EnET-C)
    cols: FLOW_COLS_8,
    nodes: [
      {id:'c1',col:0,code:'030103300',name:'การเขียนแบบวิศวกรรม',cat:'basic'},{id:'c2',col:0,code:'030513900',name:'การโปรแกรมคอมพิวเตอร์',cat:'basic'},
      {id:'c3',col:0,code:'040203111',name:'คณิตศาสตร์วิศวกรรม 1',cat:'basic'},{id:'c4',col:0,code:'040313005',name:'ฟิสิกส์ 1',cat:'basic'},
      {id:'c5',col:0,code:'080103001',name:'ภาษาอังกฤษ 1',cat:'gened'},
      {id:'c6',col:1,code:'030413100',name:'การวิเคราะห์วงจรไฟฟ้า 1',cat:'basic'},{id:'c7',col:1,code:'030513122',name:'คณิตศาสตร์ไม่ต่อเนื่อง',cat:'core'},
      {id:'c8',col:1,code:'030513800',name:'ปฏิบัติงานการพัฒนาซอฟต์แวร์',cat:'core'},{id:'c9',col:1,code:'040203112',name:'คณิตศาสตร์วิศวกรรม 2',cat:'basic'},
      {id:'c10',col:1,code:'080103002',name:'ภาษาอังกฤษ 2',cat:'gened'},
      {id:'c11',col:2,code:'030513220',name:'ปฏิบัติงานอิเล็กทรอนิกส์ 1',cat:'basic'},{id:'c12',col:2,code:'030513334',name:'การออกแบบวงจรดิจิทัลและวงจรตรรกะ',cat:'basic'},
      {id:'c13',col:2,code:'030513335',name:'ระบบไมโครคอนโทรลเลอร์',cat:'core'},{id:'c14',col:2,code:'030513500',name:'อิเล็กทรอนิกส์วิศวกรรม',cat:'basic'},
      {id:'c15',col:2,code:'030513326',name:'โครงสร้างข้อมูลและการวิเคราะห์อัลกอริทึม',cat:'core'},
      {id:'c16',col:3,code:'030513127',name:'สถาปัตยกรรมคอมพิวเตอร์',cat:'core'},{id:'c17',col:3,code:'030513145',name:'ระบบปฏิบัติการ',cat:'core'},
      {id:'c18',col:3,code:'030513322',name:'การโปรแกรมเชิงวัตถุ',cat:'core'},{id:'c19',col:3,code:'030513352',name:'ปัญญาประดิษฐ์',cat:'elective'},
      {id:'c20',col:3,code:'030513905',name:'ฐานข้อมูลและเทคโนโลยีข้อมูล',cat:'core'},
      {id:'c21',col:4,code:'030513346',name:'การพัฒนาโปรแกรมประยุกต์บนเว็บ',cat:'core'},{id:'c22',col:4,code:'030513243',name:'ปฏิบัติงานคอมพิวเตอร์ 1',cat:'core'},
      {id:'c23',col:4,code:'030513903',name:'ระบบเครือข่ายคอมพิวเตอร์และการสื่อสารข้อมูล',cat:'core'},{id:'c24',col:4,code:'030513906',name:'การเรียนรู้ของเครื่องจักรและการเรียนรู้เชิงลึก',cat:'elective'},
      {id:'c25',col:5,code:'030513151',name:'วิศวกรรมซอฟต์แวร์',cat:'core'},{id:'c26',col:5,code:'030513249',name:'ปฏิบัติงานคอมพิวเตอร์ 2',cat:'core'},
      {id:'c27',col:5,code:'030513372',name:'ระบบปฏิบัติการลีนุกซ์และการบริหารจัดการ',cat:'core'},{id:'c28',col:5,code:'030513907',name:'การประมวลผลภาพดิจิทัล',cat:'elective'},
      {id:'c29',col:6,code:'030513162',name:'โครงงานเทคโนโลยีวิศวกรรมคอมพิวเตอร์',cat:'core'},{id:'c30',col:6,code:'030513252',name:'สัมมนาทางวิศวกรรมคอมพิวเตอร์',cat:'core'},
      {id:'c31',col:6,code:'030513904',name:'ความมั่นคงปลอดภัยทางไซเบอร์',cat:'elective'},{id:'c32',col:6,code:'030513908',name:'การพัฒนาโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่',cat:'elective'},
      {id:'c33',col:7,code:'030513260',name:'สหกิจศึกษา',cat:'field'},
    ],
    edges: [['c3','c9'],['c6','c11'],['c2','c8'],['c12','c13'],['c13','c16'],['c15','c18'],['c16','c17'],['c17','c27'],['c18','c25'],['c20','c23'],['c20','c24'],['c21','c29'],['c23','c31'],['c19','c24'],['c25','c29'],['c29','c33']],
  },
  'app-ก-3': { // แขนงวิชาเครื่องมือวัดและควบคุม (EnET-I)
    cols: FLOW_COLS_8,
    nodes: [
      {id:'i1',col:0,code:'030103300',name:'การเขียนแบบวิศวกรรม',cat:'basic'},{id:'i2',col:0,code:'040113001',name:'เคมีสำหรับวิศวกร',cat:'basic'},
      {id:'i3',col:0,code:'040203111',name:'คณิตศาสตร์วิศวกรรม 1',cat:'basic'},{id:'i4',col:0,code:'040313005',name:'ฟิสิกส์ 1',cat:'basic'},
      {id:'i5',col:0,code:'080103001',name:'ภาษาอังกฤษ 1',cat:'gened'},
      {id:'i6',col:1,code:'030103102',name:'กลศาสตร์วิศวกรรม 1',cat:'basic'},{id:'i7',col:1,code:'030413100',name:'การวิเคราะห์วงจรไฟฟ้า 1',cat:'basic'},
      {id:'i8',col:1,code:'030513120',name:'สัญญาณและระบบ',cat:'core'},{id:'i9',col:1,code:'040203112',name:'คณิตศาสตร์วิศวกรรม 2',cat:'basic'},
      {id:'i10',col:1,code:'080103002',name:'ภาษาอังกฤษ 2',cat:'gened'},
      {id:'i11',col:2,code:'030103100',name:'วัสดุวิศวกรรม',cat:'basic'},{id:'i12',col:2,code:'030513220',name:'ปฏิบัติงานอิเล็กทรอนิกส์ 1',cat:'basic'},
      {id:'i13',col:2,code:'030513331',name:'ตัวตรวจจับในอุตสาหกรรมและการวัด',cat:'core'},{id:'i14',col:2,code:'030513334',name:'การออกแบบวงจรดิจิทัลและวงจรตรรกะ',cat:'basic'},
      {id:'i15',col:2,code:'030513500',name:'อิเล็กทรอนิกส์วิศวกรรม',cat:'basic'},{id:'i16',col:2,code:'040203211',name:'คณิตศาสตร์วิศวกรรม 3',cat:'basic'},
      {id:'i17',col:3,code:'030513221',name:'ปฏิบัติงานอิเล็กทรอนิกส์ 2',cat:'basic'},{id:'i18',col:3,code:'030513332',name:'วงจรอิเล็กทรอนิกส์สำหรับการวัดคุม',cat:'core'},
      {id:'i19',col:3,code:'030513336',name:'โปรแกรมเมเบิลลอจิกคอนโทรล',cat:'core'},{id:'i20',col:3,code:'030513902',name:'ระบบควบคุมเชิงเส้น',cat:'core'},
      {id:'i21',col:3,code:'030513911',name:'ระบบสมองกลฝังตัวสำหรับการวัดคุม',cat:'core'},
      {id:'i22',col:4,code:'030513144',name:'การสื่อสารแบบบัสในทางอุตสาหกรรม',cat:'core'},{id:'i23',col:4,code:'030513253',name:'ปฏิบัติงานเครื่องมือวัดและควบคุม 1',cat:'core'},
      {id:'i24',col:4,code:'030513341',name:'เทคโนโลยีการควบคุมทางอุตสาหกรรม',cat:'core'},{id:'i25',col:4,code:'030513349',name:'มาตรวิทยาวิศวกรรม',cat:'core'},
      {id:'i26',col:5,code:'030513177',name:'ความปลอดภัยในอุตสาหกรรม',cat:'core'},{id:'i27',col:5,code:'030513254',name:'ปฏิบัติงานเครื่องมือวัดและควบคุม 2',cat:'core'},
      {id:'i28',col:5,code:'030513345',name:'ระบบควบคุมแบบสกาดา',cat:'core'},{id:'i29',col:5,code:'030513351',name:'เทคโนโลยีการควบคุมกระบวนการและการควบคุมอัตโนมัติ',cat:'core'},
      {id:'i30',col:6,code:'030513161',name:'โครงงานเทคโนโลยีวิศวกรรมเครื่องมือวัดและควบคุม',cat:'core'},{id:'i31',col:6,code:'030513901',name:'การโปรแกรมคอมพิวเตอร์ในงานอุตสาหกรรม',cat:'core'},
      {id:'i32',col:6,code:'030513910',name:'การควบคุมและขับเคลื่อนด้วยอิเล็กทรอนิกส์เพื่องานอุตสาหกรรม',cat:'core'},
      {id:'i33',col:7,code:'030513260',name:'สหกิจศึกษา',cat:'field'},
    ],
    edges: [['i3','i9'],['i9','i16'],['i7','i8'],['i7','i18'],['i12','i17'],['i14','i19'],['i8','i21'],['i13','i22'],['i18','i22'],['i19','i24'],['i22','i23'],['i24','i28'],['i24','i29'],['i21','i32'],['i28','i30'],['i32','i30'],['i30','i33']],
  },
  'app-ก-4': { // แขนงวิชาการกระจายเสียงวิทยุและโทรทัศน์ (EnET-B)
    cols: FLOW_COLS_8,
    nodes: [
      {id:'b1',col:0,code:'030103300',name:'การเขียนแบบวิศวกรรม',cat:'basic'},{id:'b2',col:0,code:'040113001',name:'เคมีสำหรับวิศวกร',cat:'basic'},
      {id:'b3',col:0,code:'040203111',name:'คณิตศาสตร์วิศวกรรม 1',cat:'basic'},{id:'b4',col:0,code:'040313005',name:'ฟิสิกส์ 1',cat:'basic'},
      {id:'b5',col:0,code:'080103001',name:'ภาษาอังกฤษ 1',cat:'gened'},
      {id:'b6',col:1,code:'030103102',name:'กลศาสตร์วิศวกรรม 1',cat:'basic'},{id:'b7',col:1,code:'030413100',name:'การวิเคราะห์วงจรไฟฟ้า 1',cat:'basic'},
      {id:'b8',col:1,code:'030513900',name:'การโปรแกรมคอมพิวเตอร์',cat:'basic'},{id:'b9',col:1,code:'040203112',name:'คณิตศาสตร์วิศวกรรม 2',cat:'basic'},
      {id:'b10',col:1,code:'080103002',name:'ภาษาอังกฤษ 2',cat:'gened'},
      {id:'b11',col:2,code:'030103100',name:'วัสดุวิศวกรรม',cat:'basic'},{id:'b12',col:2,code:'030513220',name:'ปฏิบัติงานอิเล็กทรอนิกส์ 1',cat:'basic'},
      {id:'b13',col:2,code:'030513330',name:'ระบบควบคุมสัญญาณโทรทัศน์และวีดิทัศน์',cat:'core'},{id:'b14',col:2,code:'030513334',name:'การออกแบบวงจรดิจิทัลและวงจรตรรกะ',cat:'basic'},
      {id:'b15',col:2,code:'030513500',name:'อิเล็กทรอนิกส์วิศวกรรม',cat:'basic'},{id:'b16',col:2,code:'040203211',name:'คณิตศาสตร์วิศวกรรม 3',cat:'basic'},
      {id:'b17',col:3,code:'030513141',name:'วิศวกรรมวิทยุและโทรทัศน์',cat:'core'},{id:'b18',col:3,code:'030513221',name:'ปฏิบัติงานอิเล็กทรอนิกส์ 2',cat:'basic'},
      {id:'b19',col:3,code:'030513501',name:'ไมโครอิเล็กทรอนิกส์',cat:'core'},{id:'b20',col:3,code:'030513502',name:'สัญญาณ ระบบและข้อมูลสำหรับเทคโนโลยีสื่อ',cat:'core'},
      {id:'b21',col:3,code:'030513912',name:'ดิจิทัลคอนเทนต์และสื่อ',cat:'core'},
      {id:'b22',col:4,code:'030513148',name:'ระบบโทรทัศน์ดิจิทัล',cat:'core'},{id:'b23',col:4,code:'030513244',name:'ปฏิบัติงานวิทยุและโทรทัศน์ 1',cat:'core'},
      {id:'b24',col:4,code:'030513245',name:'ปฏิบัติการวิทยุและโทรทัศน์ 1',cat:'core'},{id:'b25',col:4,code:'030513503',name:'ไฟฟ้าและแม่เหล็ก',cat:'core'},
      {id:'b26',col:4,code:'030513913',name:'การออกแบบอย่างสร้างสรรค์ด้วยไมโครคอนโทรลเลอร์',cat:'core'},
      {id:'b27',col:5,code:'030513192',name:'การออกแบบระบบแสงเวที',cat:'core'},{id:'b28',col:5,code:'030513250',name:'ปฏิบัติงานวิทยุและโทรทัศน์ 2',cat:'core'},
      {id:'b29',col:5,code:'030513251',name:'ปฏิบัติการวิทยุและโทรทัศน์ 2',cat:'core'},{id:'b30',col:5,code:'030513350',name:'เทคโนโลยีมัลติมีเดียและภาพเคลื่อนไหว',cat:'core'},
      {id:'b31',col:6,code:'030513163',name:'โครงงานเทคโนโลยีวิศวกรรมวิทยุและโทรทัศน์',cat:'core'},{id:'b32',col:6,code:'030513262',name:'สัมมนาด้านการกระจายเสียงวิทยุและโทรทัศน์',cat:'core'},
      {id:'b33',col:6,code:'030513909',name:'การผลิตรายการวิทยุและโทรทัศน์',cat:'core'},
      {id:'b34',col:7,code:'030513260',name:'สหกิจศึกษา',cat:'field'},
    ],
    edges: [['b3','b9'],['b9','b16'],['b7','b17'],['b14','b13'],['b15','b18'],['b19','b25'],['b20','b22'],['b20','b21'],['b17','b23'],['b22','b28'],['b23','b28'],['b21','b26'],['b26','b30'],['b27','b31'],['b30','b31'],['b33','b31'],['b31','b34']],
  },
}

const svgPaths = ref<Record<string, string>>({})
const svgStyles = ref<Record<string, {width: number, height: number}>>({})
const hoveredNodeId = ref<string | null>(null)
const hoveredSubId = ref<string | null>(null)

const drawFlowSvg = (subId: string) => {
  const wrap = document.getElementById('flowCols-' + subId)
  if (!wrap) return
  const fm = FLOWMAPS[subId]
  if (!fm) return

  const wrapRect = wrap.getBoundingClientRect()
  svgStyles.value[subId] = { width: wrap.scrollWidth, height: wrap.scrollHeight }

  const centerOf = (id: string, side: 'left' | 'right') => {
    const node = wrap.querySelector(`.node[data-id="${id}"]`)
    if (!node) return { x: 0, y: 0 }
    const r = node.getBoundingClientRect()
    const x = side === 'right' ? (r.right - wrapRect.left) : (r.left - wrapRect.left)
    const y = r.top - wrapRect.top + r.height / 2
    return { x, y }
  }

  let paths = ''
  fm.edges.forEach(([from, to]: string[]) => {
    const a = centerOf(from, 'right')
    const b = centerOf(to, 'left')
    const midX = (a.x + b.x) / 2

    const srcNode = fm.nodes.find((n: any) => n.id === from)
    const cat = srcNode ? srcNode.cat : 'core'
    const color = CAT_COLOR[cat as keyof typeof CAT_COLOR] || CAT_COLOR['core']

    let isDim = false
    let isHi = false
    if (hoveredNodeId.value && hoveredSubId.value === subId) {
      const isRelated = (from === hoveredNodeId.value || to === hoveredNodeId.value)
      if (isRelated) isHi = true
      else isDim = true
    }

    const strokeWidth = isHi ? 2.6 : 1.6
    const opacity = isHi ? 1 : (isDim ? 0.08 : 0.55)

    paths += `<path data-from="${from}" data-to="${to}" d="M ${a.x} ${a.y} C ${midX} ${a.y}, ${midX} ${b.y}, ${b.x} ${b.y}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" opacity="${opacity}" style="transition: all 0.15s ease;" />`
  })

  svgPaths.value[subId] = paths
}

const updateAllMaps = () => {
  ['app-ก-1', 'app-ก-2', 'app-ก-3', 'app-ก-4'].forEach(drawFlowSvg)
}

const hoverNode = (subId: string, id: string | null) => {
  hoveredSubId.value = subId
  hoveredNodeId.value = id
  updateAllMaps()
}

const isNodeHi = (subId: string, id: string) => {
  if (hoveredSubId.value !== subId || !hoveredNodeId.value) return false
  return id === hoveredNodeId.value
}

const isNodeDim = (subId: string, id: string) => {
  if (hoveredSubId.value !== subId || !hoveredNodeId.value) return false
  if (id === hoveredNodeId.value) return false
  const fm = FLOWMAPS[subId]
  const related = fm.edges.some(([f, t]: string[]) => (f === id && t === hoveredNodeId.value) || (t === id && f === hoveredNodeId.value))
  return !related
}

onMounted(() => { 
  if (route.query.id) { programId.value = route.query.id as string }
  setTimeout(updateAllMaps, 300)
  window.addEventListener('resize', updateAllMaps)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateAllMaps)
})
</script>

<template>
  <div class="page-shell">
    <form @submit.prevent class="w-full">
      
      <!-- Breadcrumb & Title -->
      <div class="crumb">
        <span>เล่มหลักสูตร</span> › <b>ภาคผนวก</b> › <b class="text-[#1B2A4A] font-semibold">ภาคผนวก ก.</b>
      </div>
      <div class="doc-head">
        <div class="doc-eyebrow">ภาคผนวก ก.</div>
        <h1 class="doc-title">แผนภูมิแสดงความต่อเนื่องของหลักสูตร</h1>
      </div>

      <!-- TOC Card -->
      <div class="toc-card">
        <div class="toc-label">หัวข้อในหน้านี้ — คลิกเพื่อกระโดดไปยังหัวข้อ</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-[4px_18px]">
          <div v-for="(title, i) in sectionTitles" :key="i" class="toc-item" :class="{ 'filled': doneState[i] }" @click="scrollToSec(`app-ก-${i+1}`)">
            <div class="toc-dot"></div>
            <span class="toc-num">ก.{{ i + 1 }}</span>
            <span class="lbl">{{ title.replace('แผนภูมิความต่อเนื่อง — ', '') }}</span>
          </div>
        </div>
      </div>

      <!-- Main Paper Card -->
      <div class="paper-card">
        
        <section v-for="(title, i) in sectionTitles" :key="i" :id="`app-ก-${i+1}`" class="topic-sec">
          <div class="sec-head">
            <div class="sec-number text-[#1B2A4A]">ก.{{ i + 1 }}</div>
            <div class="flex-1 flex flex-col md:flex-row md:justify-between md:items-start gap-2">
              <h2 class="sec-title pt-1">{{ title }}</h2>
              <button type="button" class="sec-check" :class="{ 'on': doneState[i] }" @click="toggleDone(i)">
                {{ doneState[i] ? '✓ กรอกแล้ว' : 'ทำเครื่องหมายว่ากรอกแล้ว' }}
              </button>
            </div>
          </div>

          <div class="sec-body mt-4 px-0 md:px-0">
            <div class="flow-legend">
              <div v-for="(color, cat) in CAT_COLOR" :key="cat" class="it">
                <div class="sw" :style="{ background: color }"></div>{{ CAT_LABEL[cat] }}
              </div>
              <div class="it text-[#736F60]"><UIcon name="i-heroicons-cursor-arrow-rays" class="w-4 h-4 mr-1"/>วางเมาส์บนรายวิชาเพื่อไล่ดูสายวิชาที่ต่อเนื่องกัน</div>
            </div>

            <div class="flow-wrap custom-scrollbar" :id="`flowWrap-app-ก-${i+1}`">
              <div class="flow-cols" :id="`flowCols-app-ก-${i+1}`">
                <svg class="flow-svg" :style="`width: ${svgStyles[`app-ก-${i+1}`]?.width}px; height: ${svgStyles[`app-ก-${i+1}`]?.height}px;`" v-html="svgPaths[`app-ก-${i+1}`]"></svg>
                
                <div v-for="(col, ci) in FLOW_COLS_8" :key="ci" class="flow-col">
                  <div class="colhead">{{ col.label }}<small>{{ col.sub }}</small></div>
                  <div v-for="node in FLOWMAPS[`app-ก-${i+1}`].nodes.filter((n: any) => n.col === ci)" :key="node.id" 
                       class="node cursor-default" 
                       :class="{ 'hi': isNodeHi(`app-ก-${i+1}`, node.id), 'dim': isNodeDim(`app-ก-${i+1}`, node.id) }" 
                       :data-cat="node.cat" :data-id="node.id" 
                       @mouseenter="hoverNode(`app-ก-${i+1}`, node.id)" 
                       @mouseleave="hoverNode(`app-ก-${i+1}`, null)">
                    <b>{{ node.name }}</b>
                    <span class="code">{{ node.code }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>

      <!-- Action Footer -->
      <div class="page-footer">
        <button type="button" @click="router.push(`/number8?id=${programId || ''}`)" class="nav-btn">
          ← <span>การประเมินและปรับปรุงฯ</span>
        </button>
        <div class="flex flex-col md:flex-row gap-3">
          <button type="button" @click="saveDraft()" :disabled="isSavingDraft" class="nav-btn">
            <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-1" /> {{ isSavingDraft ? 'กำลังบันทึก...' : 'บันทึกฉบับร่าง' }}
          </button>
          <button type="button" @click="saveAndNext()" :disabled="isSavingNext" class="btn-brass force-white-btn" style="border:none;border-radius:8px;padding:10px 16px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;cursor:pointer;">
            <span style="color:#ffffff !important;">{{ isSavingNext ? 'กำลังบันทึก...' : 'ภาคผนวก ข. รหัสวิชา/ปริญญา' }}</span> <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-white" />
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
.sec-number { font-family: 'Noto Serif Thai', serif; font-weight: 700; color: #1B2A4A; font-size: 17px; min-width: 32px; flex: none; }
.sec-title { font-size: 16.5px; font-weight: 600; color: #1B2A4A; flex: 1; margin: 0; line-height: 1.4; }
.sec-check { flex: none; border: 1px solid #E3DCC9; background: #fff; color: #736F60; border-radius: 7px; padding: 6px 12px; font-size: 11.8px; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s; }
.sec-check.on { background: #E4EEE7 !important; border-color: #3F6B52 !important; color: #3F6B52 !important; }

/* ---------- FLOW MAP ---------- */
.flow-legend { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 16px; }
.flow-legend .it { display: flex; align-items: center; gap: 7px; font-size: 12.3px; color: #736F60; }
.flow-legend .sw { width: 12px; height: 12px; border-radius: 3px; }
.flow-wrap { position: relative; border: 1px solid #E3DCC9; border-radius: 10px; background: repeating-linear-gradient(90deg, #fff 0, #fff 175px, #FBF9F2 175px, #FBF9F2 350px); overflow: auto; }
.flow-cols { position: relative; display: flex; padding: 20px 14px 26px; min-width: 1500px; }
.flow-col { width: 175px; flex: none; padding: 0 8px; position: relative; z-index: 2; }
.flow-col .colhead { text-align: center; font-size: 12px; font-weight: 700; color: #1B2A4A; margin-bottom: 14px; font-family: 'Noto Serif Thai', serif; }
.flow-col .colhead small { display: block; font-weight: 400; font-size: 10.6px; color: #736F60; font-family: 'Sarabun', sans-serif; }
.node { border-radius: 8px; border: 1.4px solid #E3DCC9; background: #fff; padding: 9px 10px; margin-bottom: 16px; font-size: 11.6px; line-height: 1.4; box-shadow: 0 3px 8px -4px rgba(27,42,74,.18); position: relative; transition: box-shadow 0.15s ease, border-color 0.15s ease; }
.node b { display: block; font-size: 12px; margin-bottom: 2px; color: #1B2A4A; }
.node .code { font-size: 10.2px; color: #736F60; }
.node.dim { opacity: 0.32; }
.node.hi { border-color: #A8793B; box-shadow: 0 0 0 3px #EEE0C6; }
.node[data-cat="gened"] { border-left: 4px solid #8C96AF; }
.node[data-cat="basic"] { border-left: 4px solid #4C7A9A; }
.node[data-cat="core"] { border-left: 4px solid #1B2A4A; }
.node[data-cat="elective"] { border-left: 4px solid #3F6B52; }
.node[data-cat="field"] { border-left: 4px solid #A8793B; }

svg.flow-svg { position: absolute; inset: 0; pointer-events: none; z-index: 1; }

.page-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 22px; }
.nav-btn { border: 1px solid #E3DCC9; background: #fff; border-radius: 8px; padding: 10px 16px; font-size: 13px; font-weight: 600; color: #1B2A4A; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s; }
.nav-btn:hover:not([disabled]) { border-color: #A8793B; color: #A8793B; }
.nav-btn[disabled] { opacity: .35; pointer-events: none; }

.btn-brass { background: #1B2A4A; transition: all 0.2s; }
.btn-brass:hover { background: #2C3E63; }
</style>