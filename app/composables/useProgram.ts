export function useProgramApi() {
  const config = useRuntimeConfig()
  const base = config.public.apiBase // เช่น 'http://localhost:8000'

  async function createProgram(payload) {
    return await $fetch(`${base}/api/programs`, {
      method: 'POST',
      body: payload,
    })
  }

  async function updateProgram(id, payload) {
    return await $fetch(`${base}/api/programs/${id}`, {
      method: 'PATCH',
      body: payload,
    })
  }

  async function getProgram(id) {
    return await $fetch(`${base}/api/programs/${id}`)
  }

  return { createProgram, updateProgram, getProgram }
}