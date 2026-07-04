import { create } from 'zustand'
import api from '../api/axios'

const usePaymentsStore = create((set) => ({
  payments: [],
  loading: false,
  error: null,

  fetchPayments: async (schoolId) => {
    set({ loading: true, error: null })
    try {
      const res = await api.get(`/v1/schools/${schoolId}/payments`)
      set({ payments: res.data?.data || res.data || [] })
    } catch (err) {
      set({ error: err.response?.data?.message || 'Erreur chargement paiements' })
    } finally {
      set({ loading: false })
    }
  },

  initiatePayment: async (payload) => {
    const res = await api.post('/v1/payments/initiate', payload)
    return res.data?.data || res.data
  },
}))

export default usePaymentsStore