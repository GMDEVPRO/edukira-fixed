import { useState, useEffect } from 'react'
import api from '../../../api/axios'
import toast from 'react-hot-toast'

const PAGE_SIZE = 10

// Translations
const TRANSLATIONS = {
  fr: {
    title: 'Gestion des Notes',
    currentMonth: 'Mars 2026',
    export: '📥 Exporter',
    newGrade: '+ Nouvelle note',
    averageCollected: 'Moyenne générale',
    topStudents: 'Meilleurs élèves',
    excellentGrades: 'Notes excellentes',
    totalGrades: 'Total notes',
    gradeDistribution: '📊 Distribution des notes',
    grades: 'notes',
    quickGrade: '⚡ Ajouter une note',
    studentNameOrId: 'Nom ou ID de l\'élève...',
    subjectLabel: 'Matière',
    grade: 'Note',
    addGrade: '🔐 Ajouter la note',
    search: 'Rechercher...',
    allSubjects: 'Toutes matières',
    all: 'Tous',
    excellent: 'Excellent',
    good: 'Bon',
    average: 'Moyen',
    poor: 'Faible',
    student: 'Élève',
    gradeLabel: 'Note',
    status: 'Statut',
    subjectColumn: 'Matière',
    date: 'Date',
    actions: 'Actions',
    loading: '⏳ Chargement...',
    noResults: 'Aucun résultat',
    displaying: 'Affichage',
    of: 'sur',
    newGradeModal: '📝 Nouvelle note',
    studentField: 'Élève',
    studentPlaceholder: 'Nom ou ID',
    gradeField: 'Note',
    gradePlaceholder: '18.5',
    subjectField: 'Matière',
    subjectPlaceholder: 'Mathématiques',
    noteField: 'Remarque',
    notePlaceholder: 'Ex: Excellent travail...',
    cancel: 'Annuler',
    save: '💾 Enregistrer',
    fillAllFields: 'Remplissez tous les champs',
    fillRequiredFields: 'Remplissez les champs obligatoires',
    gradeAdded: 'Note de {grade} en {subject} ajoutée!',
    gradeSaved: 'Note de {grade} en {subject} enregistrée!',
    errorAdding: 'Erreur lors de l\'ajout de la note',
    errorSaving: 'Erreur lors de l\'enregistrement',
    errorLoading: 'Erreur lors du chargement des notes',
    statusExcellent: '⭐ Excellent',
    statusGood: '✓ Bon',
    statusAverage: '○ Moyen',
    statusPoor: '✗ Faible',
  },
  en: {
    title: 'Grade Management',
    currentMonth: 'March 2026',
    export: '📥 Export',
    newGrade: '+ New Grade',
    averageCollected: 'General Average',
    topStudents: 'Top Students',
    excellentGrades: 'Excellent Grades',
    totalGrades: 'Total Grades',
    gradeDistribution: '📊 Grade Distribution',
    grades: 'grades',
    quickGrade: '⚡ Add Grade',
    studentNameOrId: 'Student Name or ID...',
    subjectLabel: 'Subject',
    grade: 'Grade',
    addGrade: '🔐 Add Grade',
    search: 'Search...',
    allSubjects: 'All Subjects',
    all: 'All',
    excellent: 'Excellent',
    good: 'Good',
    average: 'Average',
    poor: 'Poor',
    student: 'Student',
    gradeLabel: 'Grade',
    status: 'Status',
    subjectColumn: 'Subject',
    date: 'Date',
    actions: 'Actions',
    loading: '⏳ Loading...',
    noResults: 'No results',
    displaying: 'Displaying',
    of: 'of',
    newGradeModal: '📝 New Grade',
    studentField: 'Student',
    studentPlaceholder: 'Name or ID',
    gradeField: 'Grade',
    gradePlaceholder: '18.5',
    subjectField: 'Subject',
    subjectPlaceholder: 'Mathematics',
    noteField: 'Note',
    notePlaceholder: 'Ex: Excellent work...',
    cancel: 'Cancel',
    save: '💾 Save',
    fillAllFields: 'Fill in all fields',
    fillRequiredFields: 'Fill in required fields',
    gradeAdded: 'Grade of {grade} in {subject} added!',
    gradeSaved: 'Grade of {grade} in {subject} saved!',
    errorAdding: 'Error adding grade',
    errorSaving: 'Error saving grade',
    errorLoading: 'Error loading grades',
    statusExcellent: '⭐ Excellent',
    statusGood: '✓ Good',
    statusAverage: '○ Average',
    statusPoor: '✗ Poor',
  },
  ar: {
    title: 'إدارة الدرجات',
    currentMonth: 'مارس 2026',
    export: '📥 تصدير',
    newGrade: '+ درجة جديدة',
    averageCollected: 'المتوسط العام',
    topStudents: 'أفضل الطلاب',
    excellentGrades: 'درجات ممتازة',
    totalGrades: 'إجمالي الدرجات',
    gradeDistribution: '📊 توزيع الدرجات',
    grades: 'درجات',
    quickGrade: '⚡ إضافة درجة',
    studentNameOrId: 'اسم الطالب أو الرقم...',
    subjectLabel: 'المادة',
    grade: 'الدرجة',
    addGrade: '🔐 إضافة الدرجة',
    search: 'بحث...',
    allSubjects: 'جميع المواد',
    all: 'الكل',
    excellent: 'ممتاز',
    good: 'جيد',
    average: 'متوسط',
    poor: 'ضعيف',
    student: 'الطالب',
    gradeLabel: 'الدرجة',
    status: 'الحالة',
    subjectColumn: 'المادة',
    date: 'التاريخ',
    actions: 'الإجراءات',
    loading: '⏳ جاري التحميل...',
    noResults: 'لا توجد نتائج',
    displaying: 'عرض',
    of: 'من',
    newGradeModal: '📝 درجة جديدة',
    studentField: 'الطالب',
    studentPlaceholder: 'الاسم أو الرقم',
    gradeField: 'الدرجة',
    gradePlaceholder: '18.5',
    subjectField: 'المادة',
    subjectPlaceholder: 'الرياضيات',
    noteField: 'ملاحظة',
    notePlaceholder: 'مثال: عمل ممتاز...',
    cancel: 'إلغاء',
    save: '💾 حفظ',
    fillAllFields: 'ملء جميع الحقول',
    fillRequiredFields: 'ملء الحقول المطلوبة',
    gradeAdded: 'تمت إضافة درجة {grade} في {subject}!',
    gradeSaved: 'تم حفظ درجة {grade} في {subject}!',
    errorAdding: 'خطأ في إضافة الدرجة',
    errorSaving: 'خطأ في حفظ الدرجة',
    errorLoading: 'خطأ في تحميل الدرجات',
    statusExcellent: '⭐ ممتاز',
    statusGood: '✓ جيد',
    statusAverage: '○ متوسط',
    statusPoor: '✗ ضعيف',
  }
}

export default function GradesTab({ schoolId, language = 'fr' }) {
  const [grades, setGrades] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [quickForm, setQuickForm] = useState({ student: '', subject: '', grade: '' })
  const [form, setForm] = useState({
    studentName: '', subject: '', grade: '', note: ''
  })

  const t = TRANSLATIONS[language] || TRANSLATIONS.fr

  useEffect(() => {
    if (!schoolId) return
    const loadGrades = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/v1/schools/${schoolId}/grades`)
        const data = res.data?.data || res.data || []
        setGrades(data)
        setFiltered(data)
      } catch {
        toast.error(t.errorLoading)
      } finally {
        setLoading(false)
      }
    }
    loadGrades()
  }, [schoolId, language, t.errorLoading])

  const getGradeStatus = (grade) => {
    const g = parseFloat(grade)
    if (g >= 16) return 'excellent'
    if (g >= 12) return 'good'
    if (g >= 10) return 'average'
    return 'poor'
  }

  const getGradeColor = (grade) => {
    const status = getGradeStatus(grade)
    const colors = {
      excellent: { bg: '#E1F5EE', color: '#059669' },
      good: { bg: '#E3F2FD', color: '#2563EB' },
      average: { bg: '#FFF7ED', color: '#D97706' },
      poor: { bg: '#FEF2F2', color: '#DC2626' },
    }
    return colors[status] || colors.average
  }

  useEffect(() => {
    const applyFilters = () => {
      let result = [...grades]
      if (search) {
        const q = search.toLowerCase()
        result = result.filter(g =>
          `${g.studentName} ${g.id}`.toLowerCase().includes(q)
        )
      }
      if (subjectFilter) result = result.filter(g => g.subject === subjectFilter)
      if (statusFilter !== 'all') result = result.filter(g => getGradeStatus(g.grade) === statusFilter)
      setFiltered(result)
      setCurrentPage(1)
    }
    applyFilters()
  }, [search, subjectFilter, statusFilter, grades])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleAddGrade = async () => {
    if (!quickForm.student || !quickForm.subject || !quickForm.grade) {
      toast.error(t.fillAllFields)
      return
    }
    try {
      await api.post('/v1/grades/add', {
        schoolId,
        studentName: quickForm.student,
        subject: quickForm.subject,
        grade: parseFloat(quickForm.grade),
      })
      toast.success(t.gradeAdded.replace('{grade}', quickForm.grade).replace('{subject}', quickForm.subject))
      setQuickForm({ student: '', subject: '', grade: '' })
    } catch {
      toast.error(t.errorAdding)
    }
  }

  const handleSave = async () => {
    if (!form.studentName || !form.subject || !form.grade) {
      toast.error(t.fillRequiredFields)
      return
    }
    try {
      const res = await api.post(`/v1/schools/${schoolId}/grades`, {
        ...form,
        grade: parseFloat(form.grade),
      })
      const newGrade = res.data?.data || res.data
      setGrades(prev => [newGrade, ...prev])
      setShowModal(false)
      setForm({ studentName: '', subject: '', grade: '', note: '' })
      toast.success(t.gradeSaved.replace('{grade}', form.grade).replace('{subject}', form.subject))
    } catch {
      toast.error(t.errorSaving)
    }
  }

  const statusBadge = (grade) => {
    const status = getGradeStatus(grade)
    const map = {
      excellent: { label: t.statusExcellent },
      good: { label: t.statusGood },
      average: { label: t.statusAverage },
      poor: { label: t.statusPoor },
    }
    const colors = getGradeColor(grade)
    const s = map[status] || map.average
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: colors.bg, color: colors.color }}>
        {s.label}
      </span>
    )
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #E2EDE8',
    borderRadius: 10, background: '#F9FBFA', color: '#111827',
    fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif',
  }

  const darkInputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid rgba(255,255,255,.15)', borderRadius: 10,
    background: 'rgba(255,255,255,.08)', color: '#fff',
    fontSize: 14, outline: 'none', fontFamily: 'DM Sans, sans-serif',
    marginBottom: 10,
  }

  const subjects = [...new Set(grades.map(g => g.subject))].filter(Boolean)
  const avgGrade = grades.length ? (grades.reduce((a, g) => a + parseFloat(g.grade || 0), 0) / grades.length).toFixed(1) : 0

  return (
    <div style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
      {/* ── Language Selector with Animation ── */}
      <style>{`
        @keyframes fadeInOut {
          0%, 100% { opacity: 1; visibility: visible; }
          50%, 51% { opacity: 0; visibility: hidden; }
        }
        .lang-selector-animated {
          animation: fadeInOut 4s infinite;
        }
      `}</style>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Syne, sans-serif' }}>
            {t.title.split(' ')[0]} <span style={{ color: '#1D9E75' }}>{t.title.split(' ')[1]}</span>
          </div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 3 }}>{t.currentMonth}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={() => toast.success('Export en cours...')} style={{ ...styles.btn, ...styles.btnOutline }}>{t.export}</button>
          <button onClick={() => setShowModal(true)} style={{ ...styles.btn, ...styles.btnGreen }}>{t.newGrade}</button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
        {[
          { icon: '📊', val: avgGrade, lbl: t.averageCollected, bg: '#E1F5EE', color: '#059669' },
          { icon: '⭐', val: grades.filter(g => getGradeStatus(g.grade) === 'excellent').length, lbl: t.excellentGrades, bg: '#E3F2FD', color: '#2563EB' },
          { icon: '👥', val: [...new Set(grades.map(g => g.studentName))].length, lbl: t.topStudents, bg: '#FFF7ED', color: '#D97706' },
          { icon: '📈', val: grades.length, lbl: t.totalGrades, bg: '#F0FDF9', color: '#111827' },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: s.bg }}>{s.icon}</div>
            <div>
              <div style={{ ...styles.statVal, color: s.color }}>{s.val}</div>
              <div style={styles.statLbl}>{s.lbl}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Subjects + Quick Grade ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>
        {/* Subjects */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>{t.gradeDistribution}</div>
          {subjects.map(subj => {
            const subjectGrades = grades.filter(g => g.subject === subj)
            const avg = subjectGrades.length ? (subjectGrades.reduce((a, g) => a + parseFloat(g.grade || 0), 0) / subjectGrades.length).toFixed(1) : 0
            const colors = getGradeColor(avg)
            return (
              <div key={subj} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, border: '1px solid #E2EDE8', marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>📚</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{subj}</div>
                  <div style={{ fontSize: 11, color: '#6B7280' }}>{subjectGrades.length} {t.grades} · Moy: {avg}</div>
                  <div style={{ height: 4, background: '#F0F4F2', borderRadius: 2, marginTop: 6 }}>
                    <div style={{ width: `${(avg / 20) * 100}%`, height: 4, background: colors.color, borderRadius: 2 }} />
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1D9E75' }}>{avg}/20</div>
              </div>
            )
          })}
        </div>

        {/* Quick Grade */}
        <div style={{ background: '#0B1E42', borderRadius: 14, padding: 20, color: '#fff' }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>{t.quickGrade}</div>
          <input style={darkInputStyle} placeholder={t.studentNameOrId} value={quickForm.student} onChange={e => setQuickForm(f => ({ ...f, student: e.target.value }))} />
          <input style={darkInputStyle} placeholder={t.subjectPlaceholder} value={quickForm.subject} onChange={e => setQuickForm(f => ({ ...f, subject: e.target.value }))} />
          <input style={darkInputStyle} type="number" placeholder={t.gradePlaceholder} min="0" max="20" value={quickForm.grade} onChange={e => setQuickForm(f => ({ ...f, grade: e.target.value }))} />
          <button onClick={handleAddGrade} style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#1D9E75', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            {t.addGrade}
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15 }}>🔍</span>
          <input type="text" placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 38 }} />
        </div>
        <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
          <option value="">{t.allSubjects}</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {[['all', t.all],['excellent', t.excellent],['good', t.good],['average', t.average],['poor', t.poor]].map(([val, lbl]) => (
          <button key={val} onClick={() => setStatusFilter(val)} style={{
            ...styles.filterTab,
            ...(statusFilter === val ? styles.filterTabActive : {})
          }}>{lbl}</button>
        ))}
      </div>

      {/* ── Table ── */}
      <div style={styles.tableWrap}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12, padding: '12px 16px', background: '#F4F7F5', borderBottom: '1px solid #E2EDE8', fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.5px' }}>
          <div>{t.student}</div><div>{t.gradeLabel}</div><div>{t.status}</div><div>{t.subject}</div><div>{t.date}</div><div>{t.actions}</div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>{t.loading}</div>
        ) : paginated.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>{t.noResults}</div>
        ) : (
          paginated.map((g, i) => {
            const colors = getGradeColor(g.grade)
            return (
              <div key={g.id || i} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12, padding: '12px 16px', borderBottom: '1px solid #F0F4F2', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{g.studentName}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{g.date || '—'}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.color }}>
                  {g.grade}/20
                </div>
                <div>{statusBadge(g.grade)}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{g.subject}</div>
                <div style={{ fontSize: 13, color: '#374151' }}>{g.date || '—'}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={styles.actionBtn}>✏️</button>
                  <button style={styles.actionBtn}>💬</button>
                </div>
              </div>
            )
          })
        )}

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderTop: '1px solid #E2EDE8', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: 13, color: '#6B7280' }}>
            {filtered.length > 0 ? `${t.displaying} ${(currentPage-1)*PAGE_SIZE+1}–${Math.min(currentPage*PAGE_SIZE,filtered.length)} ${t.of} ${filtered.length}` : '0 ' + t.noResults}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={styles.pageBtn} onClick={() => setCurrentPage(p => Math.max(1, p-1))}>←</button>
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i+1).map(p => (
              <button key={p} style={{ ...styles.pageBtn, ...(currentPage === p ? styles.pageBtnActive : {}) }} onClick={() => setCurrentPage(p)}>{p}</button>
            ))}
            <button style={styles.pageBtn} onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}>→</button>
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ ...styles.modal, direction: language === 'ar' ? 'rtl' : 'ltr' }}>
            <div style={styles.modalTitle}>{t.newGradeModal}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: t.studentField, key: 'studentName', placeholder: t.studentPlaceholder },
                { label: t.subjectField, key: 'subject', placeholder: t.subjectPlaceholder },
                { label: t.gradeField, key: 'grade', placeholder: t.gradePlaceholder, type: 'number' },
                { label: t.noteField, key: 'note', placeholder: t.notePlaceholder },
              ].map(f => (
                <div key={f.key}>
                  <label style={styles.formLabel}>{f.label}</label>
                  <input style={{ ...inputStyle, marginTop: 6 }} type={f.type || 'text'} placeholder={f.placeholder}
                    value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button style={styles.btnCancel} onClick={() => setShowModal(false)}>{t.cancel}</button>
              <button style={styles.btnSave} onClick={handleSave}>{t.save}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  btn: { display: 'flex', alignItems: 'center', gap: 8, border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  btnGreen: { background: '#1D9E75', color: '#fff' },
  btnOutline: { background: '#fff', color: '#374151', border: '1.5px solid #E2EDE8' },
  statCard: { background: '#fff', border: '1px solid #E2EDE8', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12 },
  statIcon: { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 },
  statVal: { fontSize: 22, fontWeight: 800, lineHeight: 1 },
  statLbl: { fontSize: 11, color: '#6B7280', marginTop: 3 },
  card: { background: '#fff', border: '1px solid #E2EDE8', borderRadius: 14, padding: 20 },
  cardTitle: { fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 },
  filterTab: { padding: '8px 14px', borderRadius: 8, border: '1.5px solid #E2EDE8', background: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', color: '#6B7280', fontFamily: 'DM Sans, sans-serif' },
  filterTabActive: { background: '#0B1E42', color: '#fff', border: '1.5px solid #0B1E42' },
  tableWrap: { background: '#fff', border: '1px solid #E2EDE8', borderRadius: 14, overflow: 'hidden', overflowX: 'auto' },
  actionBtn: { width: 28, height: 28, borderRadius: 7, border: '1px solid #E2EDE8', background: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 },
  pageBtn: { width: 32, height: 32, borderRadius: 8, border: '1px solid #E2EDE8', background: '#fff', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151' },
  pageBtnActive: { background: '#0B1E42', color: '#fff', border: '1px solid #0B1E42' },
  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#fff', borderRadius: 16, width: 460, maxWidth: '95vw', padding: 28 },
  modalTitle: { fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 20, fontFamily: 'Syne, sans-serif' },
  formLabel: { fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.5px' },
  btnCancel: { flex: 1, padding: 11, borderRadius: 10, border: '1.5px solid #E2EDE8', background: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#6B7280', fontFamily: 'DM Sans, sans-serif' },
  btnSave: { flex: 2, padding: 11, borderRadius: 10, border: 'none', background: '#1D9E75', fontSize: 14, fontWeight: 600, cursor: 'pointer', color: '#fff', fontFamily: 'DM Sans, sans-serif' },
}
