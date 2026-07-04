import { create } from 'zustand'
import api from '../api/axios'


const useStudentsStore = create((set, get) => ({
  students: [],
  loading: false,
  error: null,

  fetchStudents: async (schoolId) => {
    set({ loading: true, error: null })
    try {
      const res = await api.get(`/v1/schools/${schoolId}/students`)
      set({ students: res.data?.data || res.data || [] })
    } catch (err) {
      set({ error: err.response?.data?.message || 'Erreur chargement élèves' })
    } finally {
      set({ loading: false })
    }
  },

  addStudent: async (schoolId, payload) => {
    const res = await api.post(`/v1/schools/${schoolId}/students`, payload)
    const newStudent = res.data?.data || res.data
    set(s => ({ students: [newStudent, ...s.students] }))
    return newStudent
  },

  updateStudent: async (schoolId, studentId, payload) => {
    const res = await api.put(`/v1/schools/${schoolId}/students/${studentId}`, payload)
    const updated = res.data?.data || res.data
    set(s => ({
      students: s.students.map(st => st.id === studentId ? updated : st)
    }))
    return updated
  },
}))

export default useStudentsStore