import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStudentPortalMe, useStudentGrades, useStudentPayments, useStudentDocuments } from '../../hooks/useSchoolData'
import api from '../../api/axios'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

/* ── Regras de cor de nota — configuráveis, não hardcoded ── */
const NOTE_THRESHOLDS = [
  { min: 14, color: '#059669', bg: '#D1FAE5', label: 'Très bien' },
  { min: 10, color: '#D97706', bg: '#FEF3C7', label: 'Passable'  },
  { min:  0, color: '#DC2626', bg: '#FEE2E2', label: 'Insuffisant' },
]
const noteStyle = (val) => {
  const v = parseFloat(val)
  if (isNaN(v)) return { color:'#9CA3AF', bg:'#F4F7F5', label:'—' }
  return NOTE_THRESHOLDS.find(t => v >= t.min) ?? NOTE_THRESHOLDS.at(-1)
}

const TABS = [
  { id:'home',      icon:'📊', label:'Tableau de bord' },
  { id:'notes',     icon:'📝', label:'Mes notes' },
  { id:'payments',  icon:'💳', label:'Paiements', badge:true },
  { id:'documents', icon:'📄', label:'Documents' },
  { id:'messages',  icon:'💬', label:'Messages',  badge:true },
]

const PAYMENT_METHODS = [
  { id:'WAVE',         label:'Wave',         icon:'🌊', color:'#1BAAED' },
  { id:'ORANGE_MONEY', label:'Orange Money', icon:'🟠', color:'#FF6900' },
  { id:'MTN_MOMO',     label:'MTN MoMo',     icon:'🟡', color:'#FFCC00' },
]

/* ── React Query hooks locais ── */
/* ── Badge component ── */
function StatusBadge({ status }) {
  const map = {
    PAID:    { label:'Payé',    classes:'bg-green-100 text-green-700' },
    PENDING: { label:'Attente', classes:'bg-yellow-100 text-yellow-700' },
    OVERDUE: { label:'Retard',  classes:'bg-red-100 text-red-700' },
  }
  const b = map[status] ?? map.PENDING
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.classes}`}>{b.label}</span>
}

/* ── Loading skeleton ── */
function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
}

/* ── Home tab ── */
function HomeTab({ data, user, school, portalMe }) {
  /*
   * StudentPortalResponse: {
   *   fullName, classLevel, schoolYear, schoolName, enrollmentDate, status,
   *   guardianName, guardianPhone,
   *   paymentSummary: { totalPaid, totalDue, nextDueDate, nextDueAmount, overdueCount }
   *   academicSummary: { overallAverage, currentPeriod, subjectCount, rank }
   * }
   */
  const academic = portalMe?.academicSummary
  const financial = portalMe?.paymentSummary

  const avg     = academic?.overallAverage ?? '—'
  const overdue = financial?.overdueCount  ?? 0
  const subjects = academic?.subjectCount  ?? data?.notes?.length ?? 0

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { ico:'📚', val: subjects,          lbl:'Matières',  color:'#1D9E75', bg:'#E1F5EE' },
          { ico:'📊', val: avg,               lbl:'Moyenne',   color:'#0B1E42', bg:'#E8EEF7' },
          { ico:'⚠️', val: overdue || '0',    lbl:'Impayés',   color:'#DC2626', bg:'#FEE2E2' },
        ].map((k,i) => (
          <div key={i} className="bg-white rounded-xl border p-4" style={{ borderColor:'#E2EDE8', borderLeft:`3px solid ${k.color}` }}>
            <div className="text-2xl mb-2">{k.ico}</div>
            <div className="font-syne font-extrabold text-2xl text-[#111827]">{k.val}</div>
            <div className="text-[11px] text-[#6B7280] mt-1">{k.lbl}</div>
          </div>
        ))}
      </div>

      {/* Info card */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor:'#E2EDE8' }}>
        <div className="font-syne font-bold text-sm text-[#111827] mb-4">👤 Mes informations</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { lbl:'Nom complet',       val: portalMe?.fullName      ?? user?.name   ?? '—' },
            { lbl:'Classe / Niveau',   val: portalMe?.classLevel    ?? '—' },
            { lbl:'École',             val: portalMe?.schoolName    ?? school?.name ?? '—' },
            { lbl:'Année scolaire',    val: portalMe?.schoolYear    ?? '2025–2026' },
            { lbl:'Statut',            val: portalMe?.status        ?? '—' },
            { lbl:'Responsable',       val: portalMe?.guardianName  ?? '—' },
          ].map(({ lbl, val }) => (
            <div key={lbl} className="bg-[#F4F7F5] rounded-lg px-3 py-2.5">
              <div className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wide">{lbl}</div>
              <div className="text-[13px] font-semibold text-[#111827] mt-0.5">{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Notes tab ── */
function NotesTab({ notes }) {
  const [selectedBim, setSelectedBim] = useState('Bimestre 2')

  const getAvg = (subjectNotes = []) => {
    const vals = subjectNotes.map(n => parseFloat(n.value)).filter(v => !isNaN(v))
    return vals.length ? (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1) : '—'
  }

  return (
    <div className="space-y-4">
      {/* Bimestre selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['Bimestre 1','Bimestre 2','Bimestre 3'].map(b => (
          <button key={b} onClick={() => setSelectedBim(b)}
            className={`px-4 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              selectedBim === b
                ? 'bg-[#1D9E75] text-white shadow-md'
                : 'bg-white text-[#6B7280] border border-[#E2EDE8] hover:border-[#1D9E75]'
            }`}>
            {b}
          </button>
        ))}
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-[#9CA3AF]" style={{ borderColor:'#E2EDE8' }}>
          <div className="text-3xl mb-2">📝</div>
          <p className="text-sm">Aucune note disponible pour ce bimestre</p>
        </div>
      ) : notes.map((subj, i) => {
        const avg   = getAvg(subj.notes ?? [])
        const style = noteStyle(avg)
        return (
          <div key={subj.subject ?? i} className="bg-white rounded-xl border overflow-hidden" style={{ borderColor:'#E2EDE8' }}>
            <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor:'#E2EDE8' }}>
              <div className="font-syne font-bold text-sm text-[#111827]">{subj.subject ?? subj.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-[#6B7280]">{style.label}</span>
                <div className="font-syne font-extrabold text-lg rounded-lg px-3 py-0.5"
                     style={{ color:style.color, background:style.bg }}>
                  {avg}
                </div>
              </div>
            </div>
            {(subj.notes ?? []).length > 0 && (
              <div className="flex gap-2 flex-wrap px-5 py-3">
                {subj.notes.map((n, j) => {
                  const ns = noteStyle(n.value)
                  return (
                    <div key={j} className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-center"
                         style={{ background:ns.bg, minWidth:64 }}>
                      <span className="font-bold text-[15px]" style={{ color:ns.color }}>{n.value ?? '—'}</span>
                      <span className="text-[9px] text-[#9CA3AF] leading-tight">{n.label ?? `Note ${j+1}`}</span>
                      {n.appreciation && (
                        <span className="text-[8px] font-semibold mt-0.5" style={{ color:ns.color }}>{n.appreciation}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Payments tab ── */
function PaymentsTab({ payments, school }) {
  const [method, setMethod] = useState('WAVE')

  const handlePay = async (studentId, amount, month) => {
    try {
      /*
       * PaymentInitRequest: { studentId (UUID), amount (BigDecimal),
       *   currency?, month?, method (enum), phone? }
       * Endpoint: POST /api/v1/payments/mobile-money/init
       */
      const res = await api.post('/v1/payments/mobile-money/init', {
        studentId,
        amount,
        month,
        method, // WAVE | ORANGE_MONEY | MTN_MOMO
      })
      const url = res.data?.data?.payUrl ?? res.data?.payUrl
      if (url) window.open(url, '_blank')
      else toast.success('Paiement initié ! Vérifiez votre téléphone.')
    } catch {
      toast.error('Erreur lors du paiement')
    }
  }

  return (
    <div className="space-y-4">
      {/* Method picker */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor:'#E2EDE8' }}>
        <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide mb-3">Méthode de paiement</div>
        <div className="flex gap-2 flex-wrap">
          {PAYMENT_METHODS.map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all border ${
                method === m.id ? 'border-2 shadow-sm' : 'border-[#E2EDE8] hover:border-gray-300'
              }`}
              style={{ borderColor: method === m.id ? m.color : undefined }}>
              <span>{m.icon}</span>{m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payment list */}
      {payments.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-[#9CA3AF]" style={{ borderColor:'#E2EDE8' }}>
          <div className="text-3xl mb-2">💳</div>
          <p className="text-sm">Aucun paiement trouvé</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor:'#E2EDE8' }}>
          <div className="divide-y" style={{ borderColor:'#E2EDE8' }}>
            {payments.map((p, i) => (
              <div key={p.id ?? i} className="flex items-center gap-3 px-5 py-3.5">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#111827]">{p.month ?? p.label}</div>
                  <div className="text-[11px] text-[#9CA3AF]">{p.amount} FCFA</div>
                </div>
                <StatusBadge status={p.status} />
                {p.status !== 'PAID' && (
                  <button onClick={() => handlePay(p.studentId ?? p.id, p.amount, p.month)}
                    className="px-3 py-1.5 rounded-lg text-white text-[11px] font-bold transition-all hover:opacity-90 flex-shrink-0"
                    style={{ background:'#1D9E75' }}>
                    Payer
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Documents tab ── */
function DocumentsTab({ documents }) {
  return (
    <div className="space-y-3">
      {documents.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-[#9CA3AF]" style={{ borderColor:'#E2EDE8' }}>
          <div className="text-3xl mb-2">📄</div>
          <p className="text-sm">Aucun document disponible</p>
        </div>
      ) : documents.map((doc, i) => (
        <a key={doc.id ?? i} href={doc.url ?? '#'} target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-3 bg-white rounded-xl border px-5 py-4 no-underline transition-all hover:border-[#1D9E75] hover:shadow-sm group"
           style={{ borderColor:'#E2EDE8' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background:'#E1F5EE' }}>
            {doc.type === 'BULLETIN' ? '📝' : doc.type === 'RECEIPT' ? '🧾' : '📄'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-[#111827] group-hover:text-[#1D9E75] transition-colors">{doc.name ?? doc.title}</div>
            <div className="text-[11px] text-[#9CA3AF]">{doc.date ?? doc.createdAt?.split('T')[0]}</div>
          </div>
          <span className="text-[#1D9E75] text-[20px] opacity-0 group-hover:opacity-100 transition-opacity">↓</span>
        </a>
      ))}
    </div>
  )
}

/* ── Messages tab ── */
function MessagesTab({ messages }) {
  return (
    <div className="space-y-3">
      {messages.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-[#9CA3AF]" style={{ borderColor:'#E2EDE8' }}>
          <div className="text-3xl mb-2">💬</div>
          <p className="text-sm">Aucun message</p>
        </div>
      ) : messages.map((msg, i) => (
        <div key={msg.id ?? i} className={`bg-white rounded-xl border px-5 py-4 transition-all ${!msg.read ? 'border-l-4 border-l-[#1D9E75]' : ''}`}
             style={{ borderColor:'#E2EDE8' }}>
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="text-[13px] font-semibold text-[#111827]">{msg.subject ?? msg.title}</div>
            <div className="text-[10px] text-[#9CA3AF] flex-shrink-0">{msg.date ?? msg.createdAt?.split('T')[0]}</div>
          </div>
          <p className="text-[12px] text-[#6B7280] leading-relaxed line-clamp-2">{msg.body ?? msg.content}</p>
          {!msg.read && (
            <span className="inline-block mt-2 text-[9px] font-bold bg-[#E1F5EE] text-[#1D9E75] px-2 py-0.5 rounded-full">Nouveau</span>
          )}
        </div>
      ))}
    </div>
  )
}

/* ════════ MAIN PORTAL ════════ */
export default function StudentPortal() {
  const navigate = useNavigate()
  const { user, school, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('home')

  /* Separate hooks — each caches independently */
  const { data: portalMe,  isLoading: loadMe  } = useStudentPortalMe()
  const { data: gradesRaw, isLoading: loadGrades } = useStudentGrades()
  const { data: payments,  isLoading: loadPay  } = useStudentPayments()
  const { data: documents, isLoading: loadDocs } = useStudentDocuments()

  /*
   * StudentGradePortalResponse: { period, year, classAverage, studentAverage, rank, subjects[] }
   * subjects[]: { subject, grade1, grade2, average, coefficient, appreciation }
   * Map to the format NotesTab expects: [{ subject, notes: [{value, label}] }]
   */
  const notesFormatted = gradesRaw
    ? [{
        subject:   gradesRaw.period ? `${gradesRaw.period} — ${gradesRaw.year ?? ''}` : 'Notes',
        average:   gradesRaw.studentAverage,
        notes: (gradesRaw.subjects ?? []).map(s => ({
          value: s.average,
          label: s.subject,
          grade1: s.grade1,
          grade2: s.grade2,
          appreciation: s.appreciation,
        })),
      }]
    : []

  /*
   * StudentPaymentPortalResponse (List) — check actual fields
   * Falls back gracefully if API returns differently
   */
  const paymentsFormatted = Array.isArray(payments) ? payments : []

  const isLoading = loadMe || loadGrades || loadPay || loadDocs

  const data = {
    notes:    notesFormatted,
    payments: paymentsFormatted,
    documents: Array.isArray(documents) ? documents : [],
    messages: [],                          /* backend has no /portal/messages — field omitted */
    portalMe,
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const tabContent = {
    home:      <HomeTab data={data} user={user} school={school} portalMe={portalMe} />,
    notes:     <NotesTab notes={data.notes} />,
    payments:  <PaymentsTab payments={data.payments} school={school} />,
    documents: <DocumentsTab documents={data.documents} />,
    messages:  <MessagesTab messages={data.messages} />,
  }

  return (
    <div className="min-h-screen bg-[#F4F7F5] font-dm">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0B1E42] border-b border-white/10">
        <div className="flex items-center justify-between px-4 sm:px-6 h-14">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1D9E75] flex items-center justify-center font-syne font-bold text-white text-[11px] flex-shrink-0">E</div>
            <span className="font-syne font-bold text-white text-[15px]">Edukira</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-right">
              <div className="text-white text-[12px] font-semibold">{user?.name ?? 'Élève'}</div>
              <div className="text-white/40 text-[10px]">{school?.name ?? ''}</div>
            </div>
            <button onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-white/8 text-white/70 text-[11px] font-medium hover:bg-white/15 transition-all border border-white/10">
              Déconnexion
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex overflow-x-auto scrollbar-none border-t border-white/8">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`relative flex-shrink-0 flex items-center gap-1.5 px-4 py-3 text-[12px] font-semibold transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'text-[#1D9E75] border-[#1D9E75] bg-white/5'
                  : 'text-white/45 border-transparent hover:text-white/70 hover:bg-white/5'
              }`}>
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.badge && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-5 pb-24">
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : (
          tabContent[activeTab] ?? tabContent.home
        )}
      </main>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex items-center z-50 lg:hidden"
           style={{ borderColor:'#E2EDE8' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[9px] font-semibold transition-colors relative ${
              activeTab === tab.id ? 'text-[#1D9E75]' : 'text-[#9CA3AF]'
            }`}>
            <span className="text-lg leading-none">{tab.icon}</span>
            <span className="hidden xs:block">{tab.label}</span>
            {tab.badge && (
              <span className="absolute top-1.5 right-[calc(50%-8px)] w-1.5 h-1.5 rounded-full bg-red-400" />
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
