// composables/useCurriculums.ts
import { useState } from '#app'

export const useCurriculums = () => {
  return useState('curriculums', () => [
    { id: 1, name: 'วิศวกรรมคอมพิวเตอร์ (หลักสูตรใหม่ พ.ศ. 2570)', type: 'new', upd: 'วันนี้', progress: 80, star: true },
    { id: 3, name: 'วิศวกรรมไฟฟ้า (หลักสูตรใหม่ พ.ศ. 2570)', type: 'new', upd: '3 วันก่อน', progress: 10, star: false },
    { id: 4, name: 'เทคโนโลยีวิศวกรรมอิเล็กทรอนิกส์ (หลักสูตรใหม่ พ.ศ. 2570)', type: 'new', upd: 'สัปดาห์ที่แล้ว', progress: 100, star: true }
  ])
}