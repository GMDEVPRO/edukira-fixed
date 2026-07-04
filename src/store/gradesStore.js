import { create } from 'zustand'
import api from '../api/axios'

const useGradesStore = create((set) => ({
  grades: [],
  loading: false,
  error: null,

  fetchGrades: async (schoolId, classLevel) => {
    set({ loading: true, error: null })
    try {
      const params = classLevel ? `?classLevel=${classLevel}` : ''
      const res = await api.get(`/v1/schools/${schoolId}/grades${params}`)
      set({ grades: res.data?.data || res.data || [] })
    } catch (err) {
      set({ error: err.response?.data?.message || 'Erreur chargement notes' })
    } finally {
      set({ loading: false })
    }
  },

  saveGrade: async (payload) => {
    const res = await api.post('/v1/grades', payload)
    return res.data?.data || res.data
  },
}))

export default useGradesStore