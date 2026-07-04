import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import useAuthStore from '../../store/authStore'
import { useDashboard, useStudents, usePayments, useGrades } from '../../hooks/useSchoolData'
import { ErrorBoundary } from '../../components/error/ErrorBoundary'
import ApiErrorFallback from '../../components/error/ApiErrorFallback'

/* ── Design tokens ── */
const C = {
  navy: '#0B1E42', green: '#1D9E75', greenLt: '#E1F5EE',
  amber: '#D97706', red: '#DC2626', border: '#E2EDE8', bg: '#F4F7F5',
}
const GREENS  = ['#1D9E75','#2ECC9E','#4DD9B8','#7EEBD0','#A8F2E4']
const STATUS_COLORS = { PAID:'#1D9E75', PARTIAL:'#D97706', PENDING:'#D97706', OVERDUE:'#DC2626' }

/* ── Sidebar nav ── */
const NAV = [
  { id:'dash',        ico:'📊', label:'Dashboard' },
  { id:'students',    ico:'👨‍🎓', label:'Élèves' },
  { id:'grades',      ico:'📝', label:'Notes' },
  { id:'payments',    ico:'💳', label:'Paiements' },
  { id:'attendance',  ico:'✅', label:'Présences' },
  { id:'messages',    ico:'💬', label:'Messages', badge:'4' },
  { id:'ranking',     ico:'🏆', label:'Classement' },
  { id:'marketplace', ico:'🛍️', label:'Marketplace' },
]

/* ── Reusable components ── */
function KpiCard({ ico, val, lbl, delta, up, color, bg, loading }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all"
         style={{ borderColor: C.border }}>
      <div className="h-1 rounded-t-xl" style={{ background: color }} />
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: bg }}>{ico}</div>
          {delta && !loading && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {delta}
            </span>
          )}
        </div>
        {loading
          ? <div className="h-7 w-16 bg-gray-200 rounded animate-pulse mb-1" />
          : <div className="font-syne font-extrabold text-2xl text-[#111827]">{val ?? '—'}</div>
        }
        <div className="text-[11px] text-[#6B7280] mt-1">{lbl}</div>
      </div>
    </div>
  )
}

function CardShell({ title, action, children }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
      <div className="flex justify-between items-center px-5 py-3 border-b" style={{ borderColor: C.border }}>
        <div className="font-syne font-bold text-sm text-[#111827]">{title}</div>
        {action && <span className="text-[11px] cursor-pointer" style={{ color: C.green }}>{action}</span>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-40">
      <div className="w-8 h-8 border-4 border-[#E1F5EE] border-t-[#1D9E75] rounded-full animate-spin" />
    </div>
  )
}

function StatusBadge({ s }) {
  const map = {
    PAID:    { bg:'#D1FAE5', color:'#065F46', label:'Payé' },
    PARTIAL: { bg:'#FEF3C7', color:'#92400E', label:'Partiel' },
    PENDING: { bg:'#FEF3C7', color:'#92400E', label:'Attente' },
    OVERDUE: { bg:'#FEE2E2', color:'#991B1B', label:'Retard' },
  }
  const b = map[s] || map.PENDING
  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background:b.bg, color:b.color }}>{b.label}</span>
}

/* ── Custom tooltip for recharts ── */
function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5 shadow-lg text-[12px]" style={{ borderColor: C.border }}>
      <p className="font-semibold text-[#111827] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{currency ? `${p.value?.toLocaleString()} FCFA` : p.value}</strong>
        </p>
      ))}
    </div>
  )
}

/* ── Build monthly revenue data from payments ── */
function buildMonthlyRevenue(payments = []) {
  const MONTHS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']
  const now    = new Date()
  const result = []

  for (let i = 5; i >= 0; i--) {
    const d     = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = MONTHS[d.getMonth()]
    const total = payments
      .filter(p => p.status === 'PAID' && (p.date ?? p.createdAt ?? '').startsWith(key))
      .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
    result.push({ month: label, revenus: total, objectif: 4000000 })
  }
  return result
}

/* ── Build payment status pie data ── */
function buildPaymentPie(payments = []) {
  const counts = { PAID: 0, PARTIAL: 0, OVERDUE: 0 }
  payments.forEach(p => {
    const k = p.status === 'PENDING' ? 'PARTIAL' : (p.status ?? 'PARTIAL')
    if (counts[k] !== undefined) counts[k]++
  })
  return [
    { name: 'Payés',   value: counts.PAID,    color: '#1D9E75' },
    { name: 'Partiel', value: counts.PARTIAL,  color: '#D97706' },
    { name: 'Retard',  value: counts.OVERDUE,  color: '#DC2626' },
  ].filter(d => d.value > 0)
}

/* ── Build average grades per class ── */
function buildGradesByClass(grades = []) {
  const map = {}
  grades.forEach(s => {
    const cls = s.classLevel ?? s.class ?? 'N/A'
    const vals = (s.notes ?? []).map(n => parseFloat(n.value)).filter(v => !isNaN(v))
    if (!map[cls]) map[cls] = []
    map[cls].push(...vals)
  })
  return Object.entries(map).map(([cls, vals]) => ({
    classe: cls,
    moyenne: vals.length ? parseFloat((vals.reduce((a,b) => a+b,0) / vals.length).toFixed(1)) : 0,
  })).sort((a,b) => b.moyenne - a.moyenne).slice(0, 6)
}

/* ════════════════════ DASHBOARD SCREEN ════════════════════ */
function DashScreen() {
  const { data: dash, isLoading: dashLoading, error: dashError, refetch: refetchDash } = useDashboard()
  const { data: payments = [], isLoading: payLoading }  = usePayments()
  const { data: grades   = [], isLoading: gradeLoading } = useGrades()

  const isLoading = dashLoading || payLoading || gradeLoading

  const monthlyData   = useMemo(() => buildMonthlyRevenue(payments), [payments])
  const pieData       = useMemo(() => buildPaymentPie(payments),     [payments])
  const gradesByClass = useMemo(() => buildGradesByClass(grades),    [grades])

  if (dashError) return <ApiErrorFallback error={dashError} onRetry={refetchDash} section="Dashboard" />

  /* DashboardResponse structure:
     schoolStats.{ totalStudents, activeStudents, totalClasses, pendingApprovals }
     financialStats.{ monthlyRevenue, overdueAmount, overdueCount, collectionRate }
     academicStats.{ averageGrade, passRate, publishedReports, bestClass }
     recentActivities[].{ type, description, time }                              */
  const kpis = [
    {
      ico:'👨‍🎓',
      val: dash?.schoolStats?.totalStudents ?? dash?.schoolStats?.activeStudents,
      lbl:'Élèves actifs',
      delta: dash?.schoolStats?.pendingApprovals
               ? `${dash.schoolStats.pendingApprovals} en attente`
               : undefined,
      up:true, color:C.green, bg:'#E1F5EE',
    },
    {
      ico:'💰',
      val: dash?.financialStats?.monthlyRevenue != null
             ? `${(dash.financialStats.monthlyRevenue/1000000).toFixed(1)}M`
             : '—',
      lbl:'FCFA ce mois',
      delta: dash?.financialStats?.collectionRate != null
               ? `${dash.financialStats.collectionRate.toFixed(0)}%`
               : undefined,
      up:true, color:C.navy, bg:'#E8EEF7',
    },
    {
      ico:'📝',
      val: dash?.academicStats?.averageGrade?.toFixed(1) ?? '—',
      lbl:'Moy. générale',
      delta: dash?.academicStats?.passRate != null
               ? `${dash.academicStats.passRate.toFixed(0)}% réussite`
               : undefined,
      up:true, color:C.amber, bg:'#FEF3C7',
    },
    {
      ico:'⚠️',
      val: dash?.financialStats?.overdueCount ?? '—',
      lbl:'Impayés',
      delta: dash?.financialStats?.overdueAmount != null
               ? `${(dash.financialStats.overdueAmount/1000).toFixed(0)}k FCFA`
               : undefined,
      up:false, color:C.red, bg:'#FEE2E2',
    },
  ]

  /* Map recentActivities[].{ type, description, time } to display format */
  const recentActivity = (dash?.recentActivities ?? []).map(a => ({
    icon:   a.type === 'PAYMENT'    ? '💳'
          : a.type === 'ENROLLMENT' ? '👨‍🎓'
          : a.type === 'GRADE'      ? '📝'
          : a.type === 'ATTENDANCE' ? '✅'
          : '📌',
    name:   a.description ?? '',
    action: '',
    time:   a.time ?? '',
  }))

  return (
    <div className="space-y-5">

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k, i) => <KpiCard key={i} {...k} loading={isLoading} />)}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue area chart */}
        <ErrorBoundary section="Graphique Revenus" minimal>
          <CardShell title="📈 Revenus mensuels" action="Voir tout →">
            {payLoading ? (
              <div className="h-36 flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-[#E1F5EE] border-t-[#1D9E75] rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={monthlyData} margin={{ top:4, right:4, left:-20, bottom:0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#1D9E75" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#1D9E75" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                    <XAxis dataKey="month" tick={{ fontSize:10, fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize:9, fill:'#9CA3AF' }} axisLine={false} tickLine={false}
                           tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                    <Tooltip content={<CustomTooltip currency />} />
                    <Area type="monotone" dataKey="revenus" name="Revenus" stroke="#1D9E75" strokeWidth={2.5}
                          fill="url(#revGrad)" dot={{ fill:'#1D9E75', r:3 }} activeDot={{ r:5 }} />
                  </AreaChart>
                </ResponsiveContainer>
                {/* Summary row */}
                <div className="flex justify-between mt-3 pt-3 border-t text-[11px]" style={{ borderColor:C.border }}>
                  <div>
                    <div className="text-[#9CA3AF]">Total 6 mois</div>
                    <div className="font-bold text-[#111827]">
                      {(monthlyData.reduce((s,d) => s+d.revenus,0) / 1000000).toFixed(1)}M FCFA
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#9CA3AF]">Mois en cours</div>
                    <div className="font-bold" style={{ color:C.green }}>
                      {((monthlyData.at(-1)?.revenus ?? 0) / 1000000).toFixed(1)}M FCFA
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardShell>
        </ErrorBoundary>

        {/* Payment pie chart */}
        <ErrorBoundary section="Graphique Paiements" minimal>
          <CardShell title="💳 Statut paiements">
            {payLoading ? (
              <div className="h-36 flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-[#E1F5EE] border-t-[#1D9E75] rounded-full animate-spin" />
              </div>
            ) : pieData.length === 0 ? (
              <div className="h-36 flex items-center justify-center text-[#9CA3AF] text-sm">
                Aucune donnée
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={34} outerRadius={52}
                         dataKey="value" stroke="none" paddingAngle={3}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, n) => [`${v} élèves`, n]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5 mt-1">
                  {pieData.map((d, i) => {
                    const total = pieData.reduce((s,x) => s+x.value, 0)
                    const pct   = total ? Math.round(d.value * 100 / total) : 0
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background:d.color }} />
                        <span className="text-[11px] text-[#6B7280] flex-1">{d.name}</span>
                        <span className="text-[11px] font-bold" style={{ color:d.color }}>{d.value}</span>
                        <span className="text-[10px] text-[#9CA3AF]">{pct}%</span>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </CardShell>
        </ErrorBoundary>

        {/* Grades by class bar chart */}
        <ErrorBoundary section="Graphique Notes" minimal>
          <CardShell title="📊 Moyennes par classe">
            {gradeLoading ? (
              <div className="h-36 flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-[#E1F5EE] border-t-[#1D9E75] rounded-full animate-spin" />
              </div>
            ) : gradesByClass.length === 0 ? (
              <div className="h-36 flex items-center justify-center text-[#9CA3AF] text-sm">
                Aucune note
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={gradesByClass} margin={{ top:4, right:4, left:-20, bottom:0 }} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                  <XAxis dataKey="classe" tick={{ fontSize:9, fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 20]} tick={{ fontSize:9, fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="moyenne" name="Moyenne" radius={[4,4,0,0]}>
                    {gradesByClass.map((entry, i) => (
                      <Cell key={i}
                        fill={entry.moyenne >= 14 ? '#1D9E75' : entry.moyenne >= 10 ? '#D97706' : '#DC2626'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardShell>
        </ErrorBoundary>
      </div>

      {/* ── Bottom row: activity + quick actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent activity */}
        <CardShell title="⚡ Activité récente" action="Tout voir →">
          {dashLoading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-2 bg-gray-100 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="py-8 text-center text-[#9CA3AF] text-sm">Aucune activité récente</div>
          ) : (
            <div className="divide-y" style={{ borderColor: C.border }}>
              {recentActivity.slice(0,5).map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-base"
                       style={{ background:'#E1F5EE' }}>
                    {a.icon ?? '📌'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-[#374151]">
                      <strong>{a.name ?? a.title}</strong> · {a.action ?? a.description}
                    </div>
                    <div className="text-[10px] text-[#9CA3AF] mt-0.5">Il y a {a.time ?? a.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardShell>

        {/* Quick actions */}
        <CardShell title="🚀 Actions rapides">
          <div className="grid grid-cols-2 gap-3">
            {[
              { ico:'👨‍🎓', t:'Ajouter élève',   s:'Inscription',  path:'/student' },
              { ico:'📝',   t:'Saisir notes',    s:'Bimestre',     path:'/dashboard' },
              { ico:'💳',   t:'Paiement Wave',   s:'Mobile Money', path:'/dashboard' },
              { ico:'💬',   t:'Diffuser SMS',    s:'Tous parents', path:'/dashboard' },
            ].map((q, i) => (
              <Link key={i} to={q.path}
                className="flex items-center gap-2.5 p-3 rounded-xl border transition-all hover:border-[#1D9E75] hover:bg-[#E1F5EE] no-underline group"
                style={{ borderColor:C.border, background:'#F4F7F5' }}>
                <span className="text-xl">{q.ico}</span>
                <div>
                  <div className="text-[12px] font-bold text-[#111827] group-hover:text-[#0F6E56]">{q.t}</div>
                  <div className="text-[10px] text-[#6B7280]">{q.s}</div>
                </div>
              </Link>
            ))}
          </div>
        </CardShell>
      </div>
    </div>
  )
}

/* ════════════════════ STUDENTS SCREEN ════════════════════ */
function StudentsScreen() {
  const { data: students = [], isLoading, error, refetch } = useStudents()
  const [search, setSearch] = useState('')

  const getName = (s) => `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim() || s.fullName || '—'

  const filtered = students.filter(s => {
    const name = getName(s).toLowerCase()
    return name.includes(search.toLowerCase()) ||
      (s.documentNumber ?? '').includes(search) ||
      (s.guardianDocumentNumber ?? '').includes(search)
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ApiErrorFallback error={error} onRetry={refetch} section="Élèves" />

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="font-syne font-bold text-lg text-[#111827]">👨‍🎓 Gestion des Élèves</h2>
        <div className="flex gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Nom, ID élève ou ID tuteur..."
            className="border rounded-lg px-3 py-2 text-[12px] outline-none focus:border-[#1D9E75] transition-colors w-56"
            style={{ borderColor:'#E5E7EB' }} />
          <Link to="/student"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-[12px] font-bold no-underline hover:opacity-90"
            style={{ background: C.green }}>
            + Ajouter
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b" style={{ borderColor: C.border, background:'#F8FAF9' }}>
                {['Élève','Classe','🪪 ID Élève','👪 ID Tuteur','Statut','Moy.'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-[#6B7280] text-[10px] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: C.border }}>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[#9CA3AF]">
                  {search ? 'Aucun résultat' : 'Aucun élève enregistré'}
                </td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s.id ?? i} className="hover:bg-[#F8FAF9] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                           style={{ background: C.navy }}>
                        {getName(s).split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-[#111827]">{getName(s)}</div>
                        <div className="text-[10px] text-[#9CA3AF]">{s.gender ?? ''}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#374151]">{s.classLevel ?? s.class ?? '—'}</td>
                  <td className="px-4 py-3 font-mono text-[10px] bg-[#F4F7F5] text-[#374151]">{s.documentNumber ?? '—'}</td>
                  <td className="px-4 py-3 font-mono text-[10px] bg-[#F4F7F5] text-[#374151]">{s.guardianDocumentNumber ?? '—'}</td>
                  <td className="px-4 py-3"><StatusBadge s={s.status ?? 'PENDING'} /></td>
                  <td className="px-4 py-3 font-bold" style={{ color: C.green }}>—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════ PAYMENTS SCREEN ════════════════════ */
function PaymentsScreen() {
  const { data: payments = [], isLoading, error, refetch } = usePayments()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ApiErrorFallback error={error} onRetry={refetch} section="Paiements" />

  const stats = {
    paid:    payments.filter(p => p.status === 'PAID').reduce((s,p) => s + (parseFloat(p.amount)||0), 0),
    pending: payments.filter(p => ['PARTIAL','PENDING'].includes(p.status)).reduce((s,p) => s + (parseFloat(p.amount)||0), 0),
    overdue: payments.filter(p => p.status === 'OVERDUE').reduce((s,p) => s + (parseFloat(p.amount)||0), 0),
  }

  return (
    <div className="space-y-4">
      <h2 className="font-syne font-bold text-lg text-[#111827]">💳 Gestion des Paiements</h2>
      <div className="grid grid-cols-3 gap-3">
        {[
          { lbl:'Collecté', val:`${(stats.paid/1000000).toFixed(1)}M FCFA`, color:C.green, bg:'#E1F5EE' },
          { lbl:'En attente', val:`${(stats.pending/1000).toFixed(0)}k FCFA`, color:C.amber, bg:'#FEF3C7' },
          { lbl:'En retard', val:`${(stats.overdue/1000).toFixed(0)}k FCFA`, color:C.red,   bg:'#FEE2E2' },
        ].map(k => (
          <div key={k.lbl} className="bg-white rounded-xl border p-4" style={{ borderColor:C.border, borderLeft:`3px solid ${k.color}` }}>
            <div className="text-[11px] text-[#6B7280] mb-1">{k.lbl}</div>
            <div className="font-syne font-extrabold text-lg" style={{ color:k.color }}>{k.val}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor:C.border }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b" style={{ borderColor:C.border, background:'#F8FAF9' }}>
                {['Élève','Montant','Méthode','Statut','Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-[#6B7280] text-[10px] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor:C.border }}>
              {payments.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[#9CA3AF]">Aucun paiement</td></tr>
              ) : payments.map((p, i) => (
                <tr key={p.id ?? i} className="hover:bg-[#F8FAF9]">
                  <td className="px-4 py-3 font-semibold text-[#111827]">{p.studentName ?? p.name}</td>
                  <td className="px-4 py-3 font-bold" style={{ color:C.navy }}>{Number(p.amount).toLocaleString()} FCFA</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8EEF7] text-[#0B1E42]">
                      {p.method ?? p.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge s={p.status} /></td>
                  <td className="px-4 py-3 text-[#6B7280]">{p.date ?? p.createdAt?.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function PlaceholderScreen({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-[#6B7280]">
      <div className="text-4xl mb-3">🚧</div>
      <div className="font-syne font-bold text-lg mb-1">{title}</div>
      <div className="text-sm">Vue complète disponible dans la version production</div>
    </div>
  )
}

/* ════════════════════ MAIN DASHBOARD ════════════════════ */
export default function Dashboard() {
  const [active, setActive] = useState('dash')
  const { school, user, logout } = useAuthStore()
  const schoolId = school?.id ?? school?.schoolId

  const screenTitles = {
    dash:'📊 Dashboard', students:'👨‍🎓 Élèves', grades:'📝 Notes',
    payments:'💳 Paiements', attendance:'✅ Présences', messages:'💬 Messages',
    ranking:'🏆 Classement', marketplace:'🛍️ Marketplace',
  }

  const screens = {
    dash:        <DashScreen />,
    students:    <StudentsScreen />,
    payments:    <PaymentsScreen />,
    grades:      <PlaceholderScreen title="📝 Notes & Bulletins" />,
    attendance:  <PlaceholderScreen title="✅ Présences" />,
    messages:    <PlaceholderScreen title="💬 Messages" />,
    ranking:     <PlaceholderScreen title="🏆 Classement National" />,
    marketplace: <PlaceholderScreen title="🛍️ Marketplace" />,
  }

  return (
    <div className="flex h-screen font-dm overflow-hidden" style={{ background:C.bg }}>

      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-[220px] flex-shrink-0" style={{ background:C.navy }}>
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/10">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-syne font-bold text-white text-sm flex-shrink-0"
               style={{ background:C.green }}>E</div>
          <span className="font-syne font-bold text-white text-lg">Edukira</span>
        </div>

        {school && (
          <div className="mx-3 my-2.5 p-2.5 rounded-xl"
               style={{ background:'rgba(29,158,117,0.12)', border:'1px solid rgba(29,158,117,0.22)' }}>
            <div className="text-[11px] font-semibold text-white truncate">{school.name ?? 'Votre École'}</div>
            <div className="text-[10px] text-white/40 mt-0.5">{school.country ?? ''} · 2025–2026</div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-2">
          <div className="text-[9px] font-bold text-white/30 uppercase tracking-[1.5px] px-4 py-2">Principal</div>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 mx-1 rounded-lg my-0.5 text-[12.5px] transition-all relative text-left ${
                active === item.id
                  ? 'bg-[rgba(29,158,117,0.2)] text-white font-semibold'
                  : 'text-white/50 hover:bg-white/6 hover:text-white/85'
              }`} style={{ width:'calc(100% - 8px)' }}>
              {active === item.id && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full" style={{ background:C.green }} />
              )}
              <span className="text-sm">{item.ico}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background:'rgba(29,158,117,0.2)', color:'#5DCAA5' }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                 style={{ background:`linear-gradient(135deg,${C.green},${C.navy})` }}>
              {(user?.name ?? 'AD').slice(0,2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-white truncate">{user?.name ?? 'Administrateur'}</div>
              <button onClick={logout}
                className="text-[10px] text-red-400 hover:text-red-300 bg-transparent border-none cursor-pointer p-0 transition-colors">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="flex items-center px-5 h-14 border-b bg-white flex-shrink-0 gap-3"
             style={{ borderColor:C.border }}>
          <div className="font-syne font-bold text-[15px] text-[#111827] flex-1">
            {screenTitles[active]}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border"
                 style={{ background:'#F4F7F5', borderColor:C.border }}>
              🔔
              <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500 border border-white" />
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                 style={{ background:`linear-gradient(135deg,${C.green},${C.navy})` }}>
              {(user?.name ?? 'AD').slice(0,2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Screen content wrapped in ErrorBoundary */}
        <div className="flex-1 overflow-y-auto p-5">
          <ErrorBoundary section={screenTitles[active]} minimal>
            {screens[active]}
          </ErrorBoundary>
        </div>
      </main>

      {/* ── Mobile bottom nav ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex items-center z-50"
           style={{ borderColor:C.border }}>
        {NAV.slice(0,5).map(item => (
          <button key={item.id} onClick={() => setActive(item.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[9px] font-semibold transition-colors ${
              active === item.id ? '' : 'text-[#9CA3AF]'
            }`}
            style={{ color: active === item.id ? C.green : undefined }}>
            <span className="text-lg">{item.ico}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
