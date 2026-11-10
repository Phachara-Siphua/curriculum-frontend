// ยังไม่มีระบบ login — ใช้ user เดโมที่มีอยู่ในตาราง users
// เมื่อทำ auth จริงแล้วให้เปลี่ยนแค่ composable นี้
export const DEMO_USER_ID = 1

export const useDemoUser = () => useState('demoUser', () => ({
  id: DEMO_USER_ID,
  name: 'Demo User'
}))
