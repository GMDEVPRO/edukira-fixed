/**
 * Edukira â€” Axios instance alinhado 100% com o backend Spring Boot.
 *
 * context-path: /api  â†’  base URL = VITE_API_URL + /api
 * Todos os endpoints confirmados pelos controllers Java.
 */
import axios from 'axios'
import useAuthStore from '../store/authStore'

/* â”€â”€â”€ Base URL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 * Backend: server.servlet.context-path=/api, port=8080
 * Dev local:  VITE_API_URL=http://localhost:8080   â†’ calls http://localhost:8080/api/v1/...
 * ProduÃ§Ã£o:   VITE_API_URL=https://api.edukira.com â†’ calls https://api.edukira.com/api/v1/...
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080')

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
  withCredentials: true,   // backend usa allowCredentials(true)
})

/* â”€â”€ Request: inject Bearer token from Zustand persist â”€â”€ */
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

/* â”€â”€ Response: auto-logout on 401 â”€â”€ */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      sessionStorage.setItem('edukira_redirect', window.location.pathname)
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   AUTH  â€”  AuthController  â†’  /v1/auth
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/**
 * POST /api/v1/auth/login
 * Body: { email, password, schoolId: UUID }
 * Returns: ApiResponse<AuthResponse>
 *   data.accessToken, data.role, data.school.{id,name,country,type}
 */
export const loginAdmin = ({ email, password, schoolId }) =>
  api.post('/v1/auth/login', { email, password, schoolId }).then(r => r.data)

/**
 * POST /api/v1/auth/refresh
 * Body: { refreshToken }
 */
export const refreshToken = (refreshToken) =>
  api.post('/v1/auth/refresh', { refreshToken }).then(r => r.data)

/**
 * POST /api/v1/auth/logout
 */
export const logoutAdmin = () =>
  api.post('/v1/auth/logout').then(r => r.data)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SCHOOL REGISTRATION  â€”  SchoolRegistrationController  â†’  /v1/register
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/**
 * POST /api/v1/register
 * Body: SchoolRegistrationRequest {
 *   schoolName, schoolType (enum), country, city, phone, schoolEmail,
 *   website?, estimatedStudents?, defaultLanguage?,
 *   adminFirstName, adminLastName, adminRole, adminPhone, adminEmail, adminPassword,
 *   adminIdType?, adminIdNumber?,
 *   plan, paymentMethod?
 * }
 */
export const registerSchool = (body) =>
  api.post('/v1/register', body).then(r => r.data)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   STUDENT AUTH  â€”  StudentAuthController  â†’  /v1/student/auth
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/**
 * POST /api/v1/student/auth/register
 * Body: StudentRegisterRequest {
 *   fullName, documentNumber, documentType, schoolId (UUID),
 *   email?, phone?, password, preferredLanguage?
 * }
 */
export const registerStudent = (body) =>
  api.post('/v1/student/auth/register', body).then(r => r.data)

/**
 * POST /api/v1/student/auth/login
 * Body: StudentLoginRequest { documentNumber, password, schoolId: UUID }
 * Returns: ApiResponse<StudentAuthResponse>
 *   data.accessToken, data.fullName, data.accountStatus, data.school.{id,name,country}
 */
export const loginStudent = ({ documentNumber, password, schoolId }) =>
  api.post('/v1/student/auth/login', { documentNumber, password, schoolId }).then(r => r.data)

/**
 * POST /api/v1/student/auth/logout
 */
export const logoutStudent = () =>
  api.post('/v1/student/auth/logout').then(r => r.data)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   DASHBOARD  â€”  DashboardController  â†’  /v1/dashboard
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/**
 * GET /api/v1/dashboard
 * Returns: ApiResponse<DashboardResponse> {
 *   schoolStats.{ totalStudents, activeStudents, totalClasses, pendingApprovals }
 *   financialStats.{ monthlyRevenue, overdueAmount, overdueCount, collectionRate }
 *   academicStats.{ averageGrade, passRate, publishedReports, bestClass }
 *   attendanceStats.{ todayRate, monthRate, absentToday, atRiskStudents }
 *   recentActivities[].{ type, description, time }
 *   alerts[].{ level, message }
 * }
 */
export const getDashboard = () =>
  api.get('/v1/dashboard').then(r => {
    const d = r.data?.data ?? r.data
    return d ?? {}
  })
/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   STUDENTS  â€”  StudentController  â†’  /v1/students
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/**
 * GET /api/v1/students
 * Returns: ApiResponse<List<StudentResponse>> {
 *   id (UUID), schoolId, firstName, lastName, birthDate, gender,
 *   documentNumber, classLevel, guardianName, guardianPhone,
 *   guardianDocumentNumber, status, enrollmentDate
 * }
 */
export const getStudents = () =>
  api.get('/v1/students').then(r => {
    const d = r.data?.data ?? r.data
    return Array.isArray(d) ? d : (d?.content ?? [])
  })/**
 * GET /api/v1/students/{id}
 */
export const getStudent = (id) =>
  api.get(`/v1/students/${id}`).then(r => r.data?.data ?? r.data)

/**
 * POST /api/v1/students
 * Body: StudentRequest
 */
export const addStudent = (body) =>
  api.post('/v1/students', body).then(r => r.data?.data ?? r.data)

/**
 * PUT /api/v1/students/{id}
 */
export const updateStudent = (id, body) =>
  api.put(`/v1/students/${id}`, body).then(r => r.data?.data ?? r.data)

/**
 * DELETE /api/v1/students/{id}
 */
export const deleteStudent = (id) =>
  api.delete(`/v1/students/${id}`).then(r => r.data)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   GRADES  â€”  GradeController  â†’  /v1/grades
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/**
 * GET /api/v1/grades/class/{classLevel}
 * Returns: ApiResponse<List<GradeResponse>> {
 *   id, studentId, studentName, subjectName,
 *   grade1, grade2, average, coefficient, period, year, published
 * }
 */
export const getGradesByClass = (classLevel) =>
  api.get(`/v1/grades/class/${encodeURIComponent(classLevel)}`).then(r => r.data?.data ?? r.data)

/**
 * GET /api/v1/grades/student/{id}/report
 */
export const getStudentReport = (studentId) =>
  api.get(`/v1/grades/student/${studentId}/report`).then(r => r.data?.data ?? r.data)

/**
 * POST /api/v1/grades/batch
 * Body: GradeBatchRequest
 */
export const saveGradesBatch = (body) =>
  api.post('/v1/grades/batch', body).then(r => r.data?.data ?? r.data)

/**
 * POST /api/v1/grades/publish/{classLevel}
 */
export const publishGrades = (classLevel) =>
  api.post(`/v1/grades/publish/${encodeURIComponent(classLevel)}`).then(r => r.data)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PAYMENTS  â€”  PaymentController  â†’  /v1/payments
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/**
 * GET /api/v1/payments
 * Returns: ApiResponse<List<PaymentResponse>> {
 *   id, studentId, studentName, amount, currency, month,
 *   status, method, receiptUrl, paidAt
 * }
 */
export const getPayments = () =>
  api.get('/v1/payments').then(r => {
    const d = r.data?.data ?? r.data
    return Array.isArray(d) ? d : (d?.content ?? [])
  })

/**
 * GET /api/v1/payments/overdue
 */
export const getOverduePayments = () =>
  api.get('/v1/payments/overdue').then(r => r.data?.data ?? r.data)

/**
 * POST /api/v1/payments/mobile-money/init
 * Body: PaymentInitRequest {
 *   studentId (UUID), amount (BigDecimal), currency?, month?,
 *   method (enum: WAVE|ORANGE_MONEY|MTN_MOMO), phone?
 * }
 */
export const initiatePayment = (body) =>
  api.post('/v1/payments/mobile-money/init', body).then(r => r.data?.data ?? r.data)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   ATTENDANCE  â€”  AttendanceController  â†’  /v1/attendance
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/**
 * GET /api/v1/attendance/class/{classLevel}?date=YYYY-MM-DD
 */
export const getAttendanceByClass = (classLevel, date) =>
  api.get(`/v1/attendance/class/${encodeURIComponent(classLevel)}`, { params: { date } })
    .then(r => r.data?.data ?? r.data)

/**
 * POST /api/v1/attendance/class/{classLevel}
 * Body: AttendanceRequest
 */
export const saveAttendance = (classLevel, body) =>
  api.post(`/v1/attendance/class/${encodeURIComponent(classLevel)}`, body)
    .then(r => r.data?.data ?? r.data)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MESSAGES  â€”  MessageController  â†’  /v1/messages
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/**
 * POST /api/v1/messages/broadcast
 * Body: BroadcastMessageRequest
 */
export const sendBroadcast = (body) =>
  api.post('/v1/messages/broadcast', body).then(r => r.data?.data ?? r.data)

/**
 * GET /api/v1/messages/history
 */
export const getMessageHistory = () =>
  api.get('/v1/messages/history').then(r => r.data?.data ?? r.data)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   RANKING  â€”  RankingController  â†’  /v1/rankings
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/**
 * GET /api/v1/rankings/my-school
 */
export const getMySchoolRanking = () =>
  api.get('/v1/rankings/my-school').then(r => r.data?.data ?? r.data)

/**
 * GET /api/v1/rankings/national/{countryCode}
 */
export const getNationalRanking = (countryCode) =>
  api.get(`/v1/rankings/national/${countryCode}`).then(r => r.data?.data ?? r.data)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   STUDENT PORTAL  â€”  StudentPortalController  â†’  /v1/student/portal
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/**
 * GET /api/v1/student/portal/me
 * Returns: ApiResponse<StudentPortalResponse>
 */
export const getStudentPortalMe = () =>
  api.get('/v1/student/portal/me').then(r => r.data?.data ?? r.data)

/**
 * GET /api/v1/student/portal/grades
 * Returns: ApiResponse<StudentGradePortalResponse> {
 *   period, year, classAverage, studentAverage, rank,
 *   subjects[].{ subject, grade1, grade2, average, coefficient, appreciation }
 * }
 */
export const getStudentGrades = () =>
  api.get('/v1/student/portal/grades').then(r => r.data?.data ?? r.data)

/**
 * GET /api/v1/student/portal/payments
 * Returns: ApiResponse<List<StudentPaymentPortalResponse>>
 */
export const getStudentPayments = () =>
  api.get('/v1/student/portal/payments').then(r => r.data?.data ?? r.data)

/**
 * GET /api/v1/student/portal/documents
 * Returns: ApiResponse<List<StudentDocumentResponse>>
 */
export const getStudentDocuments = () =>
  api.get('/v1/student/portal/documents').then(r => r.data?.data ?? r.data)

/**
 * PATCH /api/v1/student/portal/me/contact
 * Body: StudentContactUpdateRequest
 */
export const updateStudentContact = (body) =>
  api.patch('/v1/student/portal/me/contact', body).then(r => r.data?.data ?? r.data)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   COUNTRIES  â€”  CountryConfigController  â†’  /v1/countries
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/**
 * GET /api/v1/countries
 * Returns: ApiResponse<List<CountryConfigResponse>>
 */
export const getCountries = () =>
  api.get('/v1/countries').then(r => r.data?.data ?? r.data)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   LEADS  â€”  LeadController  â†’  /v1/leads
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/**
 * POST /api/v1/leads
 * Body: LeadRequest { name, email, school, phone?, message?, language? }
 */
export const createLead = (body) =>
  api.post('/v1/leads', body).then(r => r.data)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SUBSCRIPTION  â€”  SubscriptionController  â†’  /v1/subscription
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/**
 * GET /api/v1/subscription
 */
export const getSubscription = () =>
  api.get('/v1/subscription').then(r => r.data?.data ?? r.data)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   PDF  â€”  PdfController  â†’  /v1/pdf
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/**
 * GET /api/v1/pdf/report-card/{studentId}
 * Returns: PDF blob
 */
export const downloadReportCard = (studentId) =>
  api.get(`/v1/pdf/report-card/${studentId}`, { responseType: 'blob' })

/**
 * GET /api/v1/pdf/receipt/{paymentId}
 * Returns: PDF blob
 */
export const downloadReceipt = (paymentId) =>
  api.get(`/v1/pdf/receipt/${paymentId}`, { responseType: 'blob' })

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   ENROLLMENT  â€”  EnrollmentController  â†’  /v1/enrollments
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/**
 * POST /api/v1/enrollments/public/{schoolId}
 * Public â€” no auth needed
 */
export const enrollStudent = (schoolId, body) =>
  api.post(`/v1/enrollments/public/${schoolId}`, body).then(r => r.data)

/**
 * GET /api/v1/enrollments
 */
export const getEnrollments = () =>
  api.get('/v1/enrollments').then(r => r.data?.data ?? r.data)

/**
 * PUT /api/v1/enrollments/{id}/review
 */
export const reviewEnrollment = (id, body) =>
  api.put(`/v1/enrollments/${id}/review`, body).then(r => r.data)

export default api

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   WALLET  â€”  WalletController  â†’  /v1/wallet
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/** GET /api/v1/wallet */
export const getWallet = () =>
  api.get('/v1/wallet').then(r => r.data?.data ?? r.data)

/** GET /api/v1/wallet/transactions */
export const getWalletTransactions = () =>
  api.get('/v1/wallet/transactions').then(r => r.data?.data ?? r.data)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MARKETPLACE  â€”  MarketplaceController  â†’  /v1/marketplace
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/** POST /api/v1/marketplace/sellers/register */
export const registerSeller = (body) =>
  api.post('/v1/marketplace/sellers/register', body).then(r => r.data?.data ?? r.data)

/** GET /api/v1/marketplace/sellers/me */
export const getMySellerProfile = () =>
  api.get('/v1/marketplace/sellers/me').then(r => r.data?.data ?? r.data)

/** GET /api/v1/marketplace/sellers/me/dashboard */
export const getSellerDashboard = () =>
  api.get('/v1/marketplace/sellers/me/dashboard').then(r => r.data?.data ?? r.data)

/** POST /api/v1/marketplace/products */
export const createProduct = (body) =>
  api.post('/v1/marketplace/products', body).then(r => r.data?.data ?? r.data)

/** GET /api/v1/marketplace/products */
export const getProducts = (params) =>
  api.get('/v1/marketplace/products', { params }).then(r => r.data?.data ?? r.data)

/** GET /api/v1/marketplace/products/{id} */
export const getProduct = (id) =>
  api.get(`/v1/marketplace/products/${id}`).then(r => r.data?.data ?? r.data)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   NOTIFICATIONS  â€”  NotificationController  â†’  /v1/notifications
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/** GET /api/v1/notifications/summary */
export const getNotificationSummary = () =>
  api.get('/v1/notifications/summary').then(r => r.data?.data ?? r.data)

/** GET /api/v1/notifications/history */
export const getNotificationHistory = () =>
  api.get('/v1/notifications/history').then(r => r.data?.data ?? r.data)

/** POST /api/v1/notifications/retry */
export const retryNotification = (body) =>
  api.post('/v1/notifications/retry', body).then(r => r.data)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   UPLOAD  â€”  UploadController  â†’  /v1/upload
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/**
 * POST /api/v1/upload/thumbnail  |  /preview  |  /file
 * body: FormData with file field
 */
export const uploadFile = (type, formData) =>
  api.post(`/v1/upload/${type}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data?.data ?? r.data)

/** GET /api/v1/upload/download-url?key=... */
export const getDownloadUrl = (key) =>
  api.get('/v1/upload/download-url', { params: { key } }).then(r => r.data?.data ?? r.data)

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   STUDENT PORTAL ADMIN  â€”  /v1/student/portal/admin
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/** POST /api/v1/student/portal/admin/accounts/{accountId}/approve */
export const approveStudentAccount = (accountId) =>
  api.post(`/v1/student/portal/admin/accounts/${accountId}/approve`).then(r => r.data)

/** POST /api/v1/student/portal/admin/accounts/{accountId}/reject */
export const rejectStudentAccount = (accountId, body) =>
  api.post(`/v1/student/portal/admin/accounts/${accountId}/reject`, body).then(r => r.data)

