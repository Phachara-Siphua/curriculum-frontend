// ใช้ API favorites ที่มีอยู่แล้วใน backend (ไม่ต้องเพิ่ม endpoint)
// ผูกกับ user เดโมก่อน จนกว่าจะมีระบบ login
export const useProgramFavorites = () => {
  const API_BASE = useApiBase()
  const demoUser = useDemoUser()
  const pending = useState<Record<number, boolean>>('favoritePending', () => ({}))

  const isFavoritePending = (id: number) => !!pending.value[id]

  const toggleFavorite = async (program: { id: number; star: boolean }) => {
    const id = Number(program?.id)
    if (!id || pending.value[id]) return false

    const next = !program.star
    program.star = next // optimistic update
    pending.value = { ...pending.value, [id]: true }

    try {
      if (next) {
        await $fetch(`${API_BASE}/programs/${id}/favorites/`, {
          method: 'POST',
          body: { user_id: demoUser.value.id }
        })
      } else {
        await $fetch(`${API_BASE}/programs/${id}/favorites/${demoUser.value.id}`, {
          method: 'DELETE'
        })
      }
      return true
    } catch (err: any) {
      const status = err?.status ?? err?.response?.status
      // ถอดดาวซ้ำ (ไม่มีอยู่แล้ว) ถือว่าสำเร็จ
      if (status === 404 && !next) return true

      program.star = !next // rollback
      alert('อัปเดตสถานะติดดาวไม่สำเร็จ: ' + (err?.data?.detail || err?.message || 'โปรดลองอีกครั้ง'))
      return false
    } finally {
      const copy = { ...pending.value }
      delete copy[id]
      pending.value = copy
    }
  }

  return { toggleFavorite, isFavoritePending }
}
