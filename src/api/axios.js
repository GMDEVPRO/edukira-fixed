import axios from 'axios'
import useAuthStore from '../store/authStore'

const BASE = '/api'

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
  withCredentials: true,
})

/* ── Request: inject Bearer token ── */
api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('edukira_auth')
    if (stored) {
      const token = JSON.parse(stored)?.state?.token
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
  } catch { /* silent */ }
  return config
})

/* ── Response: refresh token automático ── */
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => Promise.reject(err))
      }
      originalRequest._retry = true
      isRefreshing = true
      try {
        const stored = localStorage.getItem('edukira_auth')
        const refreshToken = JSON.parse(stored)?.state?.refreshToken
        if (!refreshToken) throw new Error('No refresh token')
        const { data } = await axios.post(`${BASE}/v1/auth/refresh`, null, {
          params: { refreshToken }
        })
        if (data.success) {
          const newToken = data.data.accessToken
          useAuthStore.getState().updateToken(newToken)
          processQueue(null, newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        processQueue(refreshError, null)
        useAuthStore.getState().logout()
        sessionStorage.setItem('edukira_redirect', window.location.pathname)
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

/* ── Auth ── */
export const loginAdmin    = ({ email, password, schoolId }) =>
  api.post('/v1/auth/login', { email, password, schoolId }).then(r => r.data)
export const refreshToken  = (token) =>
  api.post('/v1/auth/refresh', null, { params: { refreshToken: token } }).then(r => r.data)
export const logoutApi     = (token) =>
  api.post('/v1/auth/logout', null, { params: { refreshToken: token } }).then(r => r.data)
export const loginStudent  = ({ email, password, schoolId }) =>
  api.post('/v1/student/auth/login', { email, password, schoolId }).then(r => r.data)

/* ── Register ── */
export const registerSchool = (data) =>
  api.post('/v1/register', data).then(r => r.data)

/* ── Leads ── */
export const createLead = (data) =>
  api.post('/v1/leads', data).then(r => r.data)

/* ── Countries ── */
export const getCountries = () =>
  api.get('/v1/countries').then(r => r.data)

/* ── Dashboard ── */
export const getDashboard = (schoolId) =>
  api.get('/v1/dashboard', { params: { schoolId } }).then(r => r.data)

/* ── Students ── */
export const getStudents = () =>
  api.get('/v1/students').then(r => r.data)
export const addStudent = (data) =>
  api.post('/v1/students', data).then(r => r.data)
export const updateStudent = (id, data) =>
  api.put(`/v1/students/${id}`, data).then(r => r.data)
export const deleteStudent = (id) =>
  api.delete(`/v1/students/${id}`).then(r => r.data)

/* ── Grades ── */
export const getGradesByClass = (classLevel, period, year) =>
  api.get(`/v1/grades/class/${classLevel}`, { params: { period, year } }).then(r => r.data)
export const saveGradesBatch = (data) =>
  api.post('/v1/grades/batch', data).then(r => r.data)
export const publishGrades = (classLevel) =>
  api.post(`/v1/grades/publish/${classLevel}`).then(r => r.data)

/* ── Payments ── */
export const getPayments = () =>
  api.get('/v1/payments').then(r => r.data)
export const getOverduePayments = () =>
  api.get('/v1/payments/overdue').then(r => r.data)
export const initiatePayment = (data) =>
  api.post('/v1/payments/initiate', data).then(r => r.data)

/* ── Attendance ── */
export const getAttendanceByClass = (classLevel, date) =>
  api.get(`/v1/attendance/${classLevel}`, { params: { date } }).then(r => r.data)
export const saveAttendance = (data) =>
  api.post('/v1/attendance', data).then(r => r.data)

/* ── Messages ── */
export const sendBroadcast = (data) =>
  api.post('/v1/notifications/broadcast', data).then(r => r.data)
export const getMessageHistory = () =>
  api.get('/v1/notifications/history').then(r => r.data)

/* ── Rankings ── */
export const getMySchoolRanking = () =>
  api.get('/v1/rankings/my-school').then(r => r.data)
export const getNationalRanking = () =>
  api.get('/v1/rankings/national').then(r => r.data)

/* ── Student Portal ── */
export const getStudentPortalMe = () =>
  api.get('/v1/student/portal/me').then(r => r.data)
export const getStudentGrades = () =>
  api.get('/v1/student/portal/grades').then(r => r.data)
export const getStudentPayments = () =>
  api.get('/v1/student/portal/payments').then(r => r.data)
export const getStudentDocuments = () =>
  api.get('/v1/student/portal/documents').then(r => r.data)

/* ── Enrollments ── */
export const getEnrollments = () =>
  api.get('/v1/enrollments').then(r => r.data)
export const reviewEnrollment = (id, data) =>
  api.put(`/v1/enrollments/${id}/review`, data).then(r => r.data)

export default api