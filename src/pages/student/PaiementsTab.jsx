import { useState, useEffect } from 'react'
import {
  Download, PieChart, Zap, Lock, Loader2, CreditCard, Save, Search,
  CheckCircle2, Clock, AlertTriangle, CircleDashed, Banknote, Receipt,
  MessageCircle, BarChart3,
} from 'lucide-react'
import api from '../../../api/axios'
import toast from 'react-hot-toast'

const PAGE_SIZE = 10

const METHOD_INFO = {
  WAVE:         { label: 'Wave',         mono: 'W',  color: '#1D9E75', bg: '#E1F5EE' },
  ORANGE_MONEY: { label: 'Orange Money', mono: 'OM', color: '#D97706', bg: '#FFF7ED' },
  MTN_MOMO:     { label: 'MTN MoMo',     mono: 'MM', color: '#D97706', bg: '#FFFBEB' },
  CASH:         { label: 'Cash',         mono: '$',  color: '#2563EB', bg: '#EFF6FF' },
}

// Translations
const TRANSLATIONS = {
  fr: {
    title: 'Gestion des Paiements',
    currentMonth: 'Mars 2026',
    export: 'Exporter',
    newPayment: '+ Nouveau paiement',
    collectedFCFA: 'FCFA collectés',
    lateFCFA: 'FCFA en retard',
    paidStudents: 'Élèves à jour',
    totalTransactions: 'Total transactions',
    methodDistribution: 'Répartition par méthode',
    payments: 'paiements',
    quickPayment: 'Paiement rapide',
    studentNameOrId: 'Nom ou ID de l\'élève...',
    amount: 'Montant (FCFA)',
    initiatePayment: 'Initier le paiement',
    search: 'Rechercher...',
    allMethods: 'Toutes méthodes',
    all: 'Tous',
    paid: 'Payés',
    pending: 'En attente',
    late: 'En retard',
    student: 'Élève',
    amountLabel: 'Montant',
    status: 'Statut',
    method: 'Méthode',
    date: 'Date',
    actions: 'Actions',
    loading: 'Chargement...',
    noResults: 'Aucun résultat',
    displaying: 'Affichage',
    of: 'sur',
    newPaymentModal: 'Nouveau paiement',
    studentField: 'Élève',
    studentPlaceholder: 'Nom ou ID',
    amountField: 'Montant (FCFA)',
    amountPlaceholder: '25000',
    noteField: 'Note',
    notePlaceholder: 'Ex: Paiement partiel...',
    methodField: 'Méthode',
    periodField: 'Période',
    cancel: 'Annuler',
    save: 'Enregistrer',
    fillAllFields: 'Remplissez tous les champs',
    fillRequiredFields: 'Remplissez les champs obligatoires',
    paymentInitiated: 'Paiement {method} de {amount} FCFA initié!',
    paymentSaved: 'Paiement de {amount} FCFA enregistré!',
    errorInitiating: 'Erreur lors de l\'initiation du paiement',
    errorSaving: 'Erreur lors de l\'enregistrement',
    errorLoading: 'Erreur lors du chargement des paiements',
    statusPaid: 'Payé',
    statusPending: 'En attente',
    statusLate: 'Retard',
    statusPartial: 'Partiel',
  },
  en: {
    title: 'Payment Management',
    currentMonth: 'March 2026',
    export: 'Export',
    newPayment: '+ New Payment',
    collectedFCFA: 'FCFA Collected',
    lateFCFA: 'FCFA Late',
    paidStudents: 'Students Up to Date',
    totalTransactions: 'Total Transactions',
    methodDistribution: 'Distribution by Method',
    payments: 'payments',
    quickPayment: 'Quick Payment',
    studentNameOrId: 'Student Name or ID...',
    amount: 'Amount (FCFA)',
    initiatePayment: 'Initiate Payment',
    search: 'Search...',
    allMethods: 'All Methods',
    all: 'All',
    paid: 'Paid',
    pending: 'Pending',
    late: 'Late',
    student: 'Student',
    amountLabel: 'Amount',
    status: 'Status',
    method: 'Method',
    date: 'Date',
    actions: 'Actions',
    loading: 'Loading...',
    noResults: 'No results',
    displaying: 'Displaying',
    of: 'of',
    newPaymentModal: 'New Payment',
    studentField: 'Student',
    studentPlaceholder: 'Name or ID',
    amountField: 'Amount (FCFA)',
    amountPlaceholder: '25000',
    noteField: 'Note',
    notePlaceholder: 'Ex: Partial payment...',
    methodField: 'Method',
    periodField: 'Period',
    cancel: 'Cancel',
    save: 'Save',
    fillAllFields: 'Fill in all fields',
    fillRequiredFields: 'Fill in required fields',
    paymentInitiated: '{method} payment of {amount} FCFA initiated!',
    paymentSaved: 'Payment of {amount} FCFA saved!',
    errorInitiating: 'Error initiating payment',
    errorSaving: 'Error saving payment',
    errorLoading: 'Error loading payments',
    statusPaid: 'Paid',
    statusPending: 'Pending',
    statusLate: 'Late',
    statusPartial: 'Partial',
  },
  ar: {
    title: 'إدارة المدفوعات',
    currentMonth: 'مارس 2026',
    export: 'تصدير',
    newPayment: '+ دفع جديد',
    collectedFCFA: 'فرنك سيفا مجمع',
    lateFCFA: 'فرنك سيفا متأخر',
    paidStudents: 'الطلاب محدثون',
    totalTransactions: 'إجمالي المعاملات',
    methodDistribution: 'التوزيع حسب الطريقة',
    payments: 'مدفوعات',
    quickPayment: 'دفع سريع',
    studentNameOrId: 'اسم الطالب أو الرقم...',
    amount: 'المبلغ (فرنك سيفا)',
    initiatePayment: 'بدء الدفع',
    search: 'بحث...',
    allMethods: 'جميع الطرق',
    all: 'الكل',
    paid: 'مدفوع',
    pending: 'قيد الانتظار',
    late: 'متأخر',
    student: 'الطالب',
    amountLabel: 'المبلغ',
    status: 'الحالة',
    method: 'الطريقة',
    date: 'التاريخ',
    actions: 'الإجراءات',
    loading: 'جاري التحميل...',
    noResults: 'لا توجد نتائج',
    displaying: 'عرض',
    of: 'من',
    newPaymentModal: 'دفع جديد',
    studentField: 'الطالب',
    studentPlaceholder: 'الاسم أو الرقم',
    amountField: 'المبلغ (فرنك سيفا)',
    amountPlaceholder: '25000',
    noteField: 'ملاحظة',
    notePlaceholder: 'مثال: دفع جزئي...',
    methodField: 'الطريقة',
    periodField: 'الفترة',
    cancel: 'إلغاء',
    save: 'حفظ',
    fillAllFields: 'ملء جميع الحقول',
    fillRequiredFields: 'ملء الحقول المطلوبة',
    paymentInitiated: 'تم بدء دفع {method} بمبلغ {amount} فرنك سيفا!',
    paymentSaved: 'تم حفظ دفع {amount} فرنك سيفا!',
    errorInitiating: 'خطأ في بدء الدفع',
    errorSaving: 'خطأ في حفظ الدفع',
    errorLoading: 'خطأ في تحميل المدفوعات',
    statusPaid: 'مدفوع',
    statusPending: 'قيد الانتظار',
    statusLate: 'متأخر',
    statusPartial: 'جزئي',
  }
}

export default function PaiementsTab({ schoolId, language = 'fr' }) {
  const [payments, setPayments] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [methodFilter, setMethodFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('WAVE')
  const [quickForm, setQuickForm] = useState({ student: '', amount: '' })
  const [form, setForm] = useState({
    studentName: '', amount: '', method: 'WAVE', period: 'Mars 2026', note: ''
  })

  const t = TRANSLATIONS[language] || TRANSLATIONS.fr

  useEffect(() => {
    if (!schoolId) return
    const loadPayments = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/v1/schools/${schoolId}/payments`)
        const data = res.data?.data || res.data || []
        setPayments(data)
        setFiltered(data)
      } catch {
        toast.error(t.errorLoading)
      } finally {
        setLoading(false)
      }
    }
    loadPayments()
  }, [schoolId, language, t.errorLoading])

  useEffect(() => {
    const applyFilters = () => {
      let result = [...payments]
      if (search) {
        const q = search.toLowerCase()
        result = result.filter(p =>
          `${p.studentName} ${p.id}`.toLowerCase().includes(q)
        )
      }
      if (methodFilter) result = result.filter(p => p.method === methodFilter)
      if (statusFilter !== 'all') result = result.filter(p => p.status === statusFilter)
      setFiltered(result)
      setCurrentPage(1)
    }
    applyFilters()
  }, [search, methodFilter, statusFilter, payments])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const methodStats = Object.keys(METHOD_INFO).map(m => ({
    method: m,
    count: payments.filter(p => p.method === m).length,
    total: payments.filter(p => p.method === m).reduce((a, p) => a + (p.amount || 0), 0),
    pct: payments.length ? Math.round((payments.filter(p => p.method === m).length / payments.length) * 100) : 0,
    ...METHOD_INFO[m],
  }))

  const handleInitPayment = async () => {
    if (!quickForm.student || !quickForm.amount) {
      toast.error(t.fillAllFields)
      return
    }
    try {
      await api.post('/v1/payments/initiate', {
        schoolId,
        studentName: quickForm.student,
        amount: parseInt(quickForm.amount),
        method: selectedMethod,
      })
      toast.success(t.paymentInitiated.replace('{method}', selectedMethod).replace('{amount}', parseInt(quickForm.amount).toLocaleString('fr-FR')))
      setQuickForm({ student: '', amount: '' })
    } catch {
      toast.error(t.errorInitiating)
    }
  }

  const handleSave = async () => {
    if (!form.studentName || !form.amount) {
      toast.error(t.fillRequiredFields)
      return
    }
    try {
      const res = await api.post(`/v1/schools/${schoolId}/payments`, {
        ...form,
        amount: parseInt(form.amount),
        status: 'PAID',
      })
      const newPayment = res.data?.data || res.data
      setPayments(prev => [newPayment, ...prev])
      setShowModal(false)
      setForm({ studentName: '', amount: '', method: 'WAVE', period: 'Mars 2026', note: '' })
      toast.success(t.paymentSaved.replace('{amount}', parseInt(form.amount).toLocaleString('fr-FR')))
    } catch {
      toast.error(t.errorSaving)
    }
  }

  const statusBadge = (status) => {
    const map = {
      PAID:    { bg: '#E1F5EE', color: '#0F6E56', label: t.statusPaid,    Icon: CheckCircle2 },
      PENDING: { bg: '#FFF7ED', color: '#D97706', label: t.statusPending, Icon: Clock },
      LATE:    { bg: '#FEF2F2', color: '#DC2626', label: t.statusLate,    Icon: AlertTriangle },
      PARTIAL: { bg: '#EFF6FF', color: '#2563EB', label: t.statusPartial, Icon: CircleDashed },
    }
    const s = map[status] || map.PENDING
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>
        <s.Icon size={11} />{s.label}
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
          <button onClick={() => toast.success('Export en cours...')} style={{ ...styles.btn, ...styles.btnOutline }}><Download size={13} style={{ marginRight: 5, verticalAlign: -2 }} />{t.export}</button>
          <button onClick={() => setShowModal(true)} style={{ ...styles.btn, ...styles.btnGreen }}>{t.newPayment}</button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 20 }}>
        {[
          { icon: Banknote, val: `${payments.filter(p=>p.status==='PAID').reduce((a,p)=>a+(p.amount||0),0).toLocaleString('fr-FR')}`, lbl: t.collectedFCFA, bg: '#E1F5EE', color: '#059669' },
          { icon: AlertTriangle, val: `${payments.filter(p=>p.status==='LATE').reduce((a,p)=>a+(p.amount||0),0).toLocaleString('fr-FR')}`, lbl: t.lateFCFA, bg: '#FFF7ED', color: '#D97706' },
          { icon: CheckCircle2, val: payments.filter(p=>p.status==='PAID').length, lbl: t.paidStudents, bg: '#E3F2FD', color: '#2563EB' },
          { icon: BarChart3, val: payments.length, lbl: t.totalTransactions, bg: '#F0FDF9', color: '#111827' },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: s.bg }}><s.icon size={18} style={{ color: s.color }} /></div>
            <div>
              <div style={{ ...styles.statVal, color: s.color }}>{s.val}</div>
              <div style={styles.statLbl}>{s.lbl}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Methods + Quick Payment ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>
        {/* Methods */}
        <div style={styles.card}>
          <div style={styles.cardTitle}><PieChart size={13} style={{ marginRight: 5, verticalAlign: -2 }} />{t.methodDistribution}</div>
          {methodStats.map(m => (
            <div key={m.method} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, border: '1px solid #E2EDE8', marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{m.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: '#6B7280' }}>{m.count} {t.payments} · {m.pct}%</div>
                <div style={{ height: 4, background: '#F0F4F2', borderRadius: 2, marginTop: 6 }}>
                  <div style={{ width: `${m.pct}%`, height: 4, background: m.color, borderRadius: 2 }} />
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1D9E75' }}>{m.total.toLocaleString('fr-FR')} FCFA</div>
            </div>
          ))}
        </div>

        {/* Quick Payment */}
        <div style={{ background: '#0B1E42', borderRadius: 14, padding: 20, color: '#fff' }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}><Zap size={14} style={{ marginRight: 5, verticalAlign: -2 }} />{t.quickPayment}</div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
            {Object.keys(METHOD_INFO).map(m => (
              <button key={m} onClick={() => setSelectedMethod(m)} style={{
                padding: '6px 12px', borderRadius: 20,
                border: `1.5px solid ${selectedMethod === m ? '#1D9E75' : 'rgba(255,255,255,.15)'}`,
                background: selectedMethod === m ? '#1D9E75' : 'transparent',
                color: selectedMethod === m ? '#fff' : 'rgba(255,255,255,.6)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>
                <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:14, height:14, borderRadius:"50%", fontSize:8, fontWeight:800, background:"rgba(255,255,255,.25)", marginRight:4 }}>{METHOD_INFO[m].mono}</span>{METHOD_INFO[m].label}
              </button>
            ))}
          </div>
          <input style={darkInputStyle} placeholder={t.studentNameOrId} value={quickForm.student} onChange={e => setQuickForm(f => ({ ...f, student: e.target.value }))} />
          <input style={darkInputStyle} type="number" placeholder={t.amount} value={quickForm.amount} onChange={e => setQuickForm(f => ({ ...f, amount: e.target.value }))} />
          <button onClick={handleInitPayment} style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#1D9E75', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            <Lock size={13} style={{ marginRight: 6, verticalAlign: -2 }} />{t.initiatePayment}
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input type="text" placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 38 }} />
        </div>
        <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
          <option value="">{t.allMethods}</option>
          {Object.keys(METHOD_INFO).map(m => <option key={m} value={m}>{METHOD_INFO[m].label}</option>)}
        </select>
        {[['all', t.all],['PAID', t.paid],['PENDING', t.pending],['LATE', t.late]].map(([val, lbl]) => (
          <button key={val} onClick={() => setStatusFilter(val)} style={{
            ...styles.filterTab,
            ...(statusFilter === val ? styles.filterTabActive : {})
          }}>{lbl}</button>
        ))}
      </div>

      {/* ── Table ── */}
      <div style={styles.tableWrap}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12, padding: '12px 16px', background: '#F4F7F5', borderBottom: '1px solid #E2EDE8', fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.5px' }}>
          <div>{t.student}</div><div>{t.amountLabel}</div><div>{t.status}</div><div>{t.method}</div><div>{t.date}</div><div>{t.actions}</div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}><Loader2 size={16} className="inline animate-spin" style={{ marginRight: 6, verticalAlign: -3 }} />{t.loading}</div>
        ) : paginated.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>{t.noResults}</div>
        ) : (
          paginated.map((p, i) => {
            const m = METHOD_INFO[p.method] || { mono: '?', label: p.method, bg: '#F4F7F5', color: '#6B7280' }
            return (
              <div key={p.id || i} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12, padding: '12px 16px', borderBottom: '1px solid #F0F4F2', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.studentName}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{p.month}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: p.status === 'PAID' ? '#059669' : p.status === 'LATE' ? '#DC2626' : '#D97706' }}>
                  {(p.amount || 0).toLocaleString('fr-FR')} FCFA
                </div>
                <div>{statusBadge(p.status)}</div>
                <div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: m.bg, color: m.color }}>
                    <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:14, height:14, borderRadius:'50%', fontSize:8, fontWeight:800, background:m.color, color:'#fff' }}>{m.mono}</span>
                    {m.label}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#374151' }}>{p.date || '—'}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={styles.actionBtn}><Receipt size={13} /></button>
                  <button style={styles.actionBtn}><MessageCircle size={13} /></button>
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
            <div style={styles.modalTitle}><CreditCard size={15} style={{ marginRight: 6, verticalAlign: -2 }} />{t.newPaymentModal}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: t.studentField, key: 'studentName', placeholder: t.studentPlaceholder },
                { label: t.amountField, key: 'amount', placeholder: t.amountPlaceholder, type: 'number' },
                { label: t.noteField, key: 'note', placeholder: t.notePlaceholder },
              ].map(f => (
                <div key={f.key}>
                  <label style={styles.formLabel}>{f.label}</label>
                  <input style={{ ...inputStyle, marginTop: 6 }} type={f.type || 'text'} placeholder={f.placeholder}
                    value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={styles.formLabel}>{t.methodField}</label>
                  <select style={{ ...inputStyle, marginTop: 6 }} value={form.method} onChange={e => setForm(p => ({ ...p, method: e.target.value }))}>
                    {Object.keys(METHOD_INFO).map(m => <option key={m} value={m}>{METHOD_INFO[m].label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={styles.formLabel}>{t.periodField}</label>
                  <select style={{ ...inputStyle, marginTop: 6 }} value={form.period} onChange={e => setForm(p => ({ ...p, period: e.target.value }))}>
                    {['Mars 2026','Février 2026','Janvier 2026','Trimestre 2','Année complète'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button style={styles.btnCancel} onClick={() => setShowModal(false)}>{t.cancel}</button>
              <button style={styles.btnSave} onClick={handleSave}><Save size={13} style={{ marginRight: 5, verticalAlign: -2 }} />{t.save}</button>
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
