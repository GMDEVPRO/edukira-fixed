/**
 * React Query hooks — 100% aligned with backend endpoints.
 * Cada hook mapeia exactamente o controller e DTO correspondente.
 */
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDashboard,
  getStudents, addStudent, updateStudent, deleteStudent,
  getGradesByClass, saveGradesBatch, publishGrades,
  getPayments, getOverduePayments, initiatePayment,
  getAttendanceByClass, saveAttendance,
  sendBroadcast, getMessageHistory,
  getMySchoolRanking, getNationalRanking,
  getStudentPortalMe, getStudentGrades,
  getStudentPayments, getStudentDocuments,
  getEnrollments, reviewEnrollment,
  getCountryConfig,
  getPendingStudentAccounts, reviewStudentAccount,
} from '../api/axios'
import toast from 'react-hot-toast'

/* ─── Query keys ─── */
export const QK = {
  dashboard:      (schoolId) => ['dashboard', schoolId ?? 'default'],
  students:       () => ['students'],
  student:        (id) => ['student', id],
  grades:         (cls) => ['grades', cls],
  payments:       () => ['payments'],
  overduePayments:() => ['payments', 'overdue'],
  attendance:     (cls, date) => ['attendance', cls, date],
  messages:       () => ['messages'],
  ranking:        () => ['ranking', 'my-school'],
  nationalRanking:(cc) => ['ranking', 'national', cc],
  enrollments:    () => ['enrollments'],
  // Student portal
  portalMe:       () => ['portal', 'me'],
  portalGrades:   () => ['portal', 'grades'],
  portalPayments: () => ['portal', 'payments'],
  portalDocuments:() => ['portal', 'documents'],
}

/* ════════ DASHBOARD ════════ */
export function useDashboard(schoolId) {
  return useQuery({
    queryKey: QK.dashboard(schoolId),
    queryFn:  () => getDashboard(schoolId),
    enabled:  !!schoolId,
    staleTime: 60_000,
    retry: 2,
  })
}

/* ════════ STUDENTS ════════ */
export function useStudents() {
  return useQuery({
    queryKey: QK.students(),
    queryFn:  getStudents,
    staleTime: 30_000,
  })
}

export function useAddStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addStudent,
    onSuccess: (data) => {
      qc.setQueryData(QK.students(), (old = []) => [data, ...old])
      toast.success('Élève ajouté')
    },
    onError: (err) => toast.error(err.response?.data?.message ?? 'Erreur ajout élève'),
  })
}

export function useUpdateStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => updateStudent(id, payload),
    onSuccess: (data) => {
      qc.setQueryData(QK.students(), (old = []) =>
        old.map(s => s.id === data.id ? data : s))
      toast.success('Élève mis à jour')
    },
    onError: (err) => toast.error(err.response?.data?.message ?? 'Erreur mise à jour'),
  })
}

export function useDeleteStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: (_, id) => {
      qc.setQueryData(QK.students(), (old = []) => old.filter(s => s.id !== id))
      toast.success('Élève supprimé')
    },
    onError: (err) => toast.error(err.response?.data?.message ?? 'Erreur suppression'),
  })
}

/* ════════ GRADES ════════ */
export function useGrades(classLevel, period, year) {
  return useQuery({
    queryKey: [...QK.grades(classLevel), period, year ?? 'default'],
    queryFn:  () => getGradesByClass(classLevel, period, year),
    enabled:  !!classLevel && !!period,
  })
}

export function useGradesForClasses(classLevels = [], periods = ['BIMESTRE_1','BIMESTRE_2','BIMESTRE_3'], year) {
  const combos = []
  classLevels.forEach(cls => periods.forEach(period => combos.push({ cls, period })))

  return useQueries({
    queries: combos.map(({ cls, period }) => ({
      queryKey: ['grades', cls, period, year ?? 'default'],
      queryFn:  () => getGradesByClass(cls, period, year),
      enabled:  !!cls && !!period,
      staleTime: 30_000,
    })),
  })
}

export function useSaveGrades() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: saveGradesBatch,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['grades'] })
      toast.success('Notes enregistrées')
    },
    onError: (err) => toast.error(err.response?.data?.message ?? 'Erreur enregistrement notes'),
  })
}

export function usePublishGrades() {
  return useMutation({
    mutationFn: publishGrades,
    onSuccess: () => toast.success('Notes publiées — bulletins envoyés'),
    onError:   (err) => toast.error(err.response?.data?.message ?? 'Erreur publication'),
  })
}

/* ════════ PAYMENTS ════════ */
export function usePayments() {
  return useQuery({
    queryKey: QK.payments(),
    queryFn:  getPayments,
    staleTime: 30_000,
  })
}

export function useOverduePayments() {
  return useQuery({
    queryKey: QK.overduePayments(),
    queryFn:  getOverduePayments,
    staleTime: 30_000,
  })
}

export function useInitiatePayment() {
  const qc = useQueryClient()
  return useMutation({
    /**
     * payload: { studentId (UUID), amount, currency?, month?, method, phone? }
     * method enum: WAVE | ORANGE_MONEY | MTN_MOMO
     */
    mutationFn: initiatePayment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payments'] })
      toast.success('Paiement initié')
    },
    onError: (err) => toast.error(err.response?.data?.message ?? 'Erreur paiement'),
  })
}

/* ════════ ATTENDANCE ════════ */
export function useAttendance(classLevel, date) {
  return useQuery({
    queryKey: QK.attendance(classLevel, date),
    queryFn:  () => getAttendanceByClass(classLevel, date),
    enabled:  !!classLevel && !!date,
  })
}

export function useSaveAttendance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: saveAttendance,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] })
      toast.success('Présences enregistrées')
    },
    onError: (err) => toast.error(err.response?.data?.message ?? 'Erreur présences'),
  })
}

/* ════════ MESSAGES ════════ */
export function useSendBroadcast() {
  return useMutation({
    mutationFn: sendBroadcast,
    onSuccess: () => toast.success('Message diffusé'),
    onError:   (err) => toast.error(err.response?.data?.message ?? 'Erreur envoi message'),
  })
}

export function useMessageHistory() {
  return useQuery({
    queryKey: QK.messages(),
    queryFn:  getMessageHistory,
    staleTime: 60_000,
  })
}

/* ════════ RANKING ════════ */
export function useMySchoolRanking() {
  return useQuery({
    queryKey: QK.ranking(),
    queryFn:  getMySchoolRanking,
    staleTime: 300_000,
  })
}

export function useNationalRanking(countryCode) {
  return useQuery({
    queryKey: QK.nationalRanking(countryCode),
    queryFn:  () => getNationalRanking(countryCode),
    enabled:  !!countryCode,
    staleTime: 300_000,
  })
}

/* ════════ COUNTRY CONFIG ════════
   Moeda, timezone, ano lectivo, métodos de pagamento suportados — por país.
   Cache longo (1h) pois esses dados praticamente não mudam. */
export function useCountryConfig(countryCode) {
  return useQuery({
    queryKey: ['country', countryCode],
    queryFn:  () => getCountryConfig(countryCode),
    enabled:  !!countryCode,
    staleTime: 3_600_000,
  })
}

/* ════════ ENROLLMENTS ════════ */
export function useEnrollments() {
  return useQuery({
    queryKey: QK.enrollments(),
    queryFn:  getEnrollments,
  })
}

export function useReviewEnrollment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }) => reviewEnrollment(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['enrollments'] })
      toast.success('Inscription mise à jour')
    },
    onError: (err) => toast.error(err.response?.data?.message ?? 'Erreur révision'),
  })
}

/* ════════ STUDENT PORTAL ════════ */
export function useStudentPortalMe() {
  return useQuery({
    queryKey: QK.portalMe(),
    queryFn:  getStudentPortalMe,
    staleTime: 60_000,
  })
}

export function useStudentGrades() {
  return useQuery({
    queryKey: QK.portalGrades(),
    queryFn:  getStudentGrades,
    staleTime: 60_000,
  })
}

export function useStudentPayments() {
  return useQuery({
    queryKey: QK.portalPayments(),
    queryFn:  getStudentPayments,
    staleTime: 30_000,
  })
}

export function useStudentDocuments() {
  return useQuery({
    queryKey: QK.portalDocuments(),
    queryFn:  getStudentDocuments,
    staleTime: 120_000,
  })
}

/* ════════ STUDENT ACCOUNTS (aprovação de contas criadas por alunos/tutores) ════════ */
export function usePendingStudentAccounts(page = 0, size = 20) {
  return useQuery({
    queryKey: ['studentAccounts', 'pending', page, size],
    queryFn:  () => getPendingStudentAccounts(page, size),
    staleTime: 30_000,
  })
}

export function useReviewStudentAccount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => reviewStudentAccount(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['studentAccounts'] })
      toast.success('Compte révisé')
    },
    onError: (err) => toast.error(err.response?.data?.message ?? 'Erreur révision compte'),
  })
}
