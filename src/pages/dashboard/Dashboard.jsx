import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import {
  LayoutDashboard, GraduationCap, Link2, PenLine, CreditCard, CheckCircle2,
  MessageCircle, Trophy, ShoppingBag, Banknote, AlertTriangle, Bell, Pin,
  TrendingUp, PieChart as PieChartIcon, BarChart3, Activity, Zap, Save, Send, X, Wrench,
} from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { useLang } from '../../hooks/useLang'
import { useDashboard, useStudents, usePayments, useGradesForClasses, useCountryConfig, useGrades, useSaveGrades, usePublishGrades, usePendingStudentAccounts, useReviewStudentAccount } from '../../hooks/useSchoolData'
import { ErrorBoundary } from '../../components/error/ErrorBoundary'
import ApiErrorFallback from '../../components/error/ApiErrorFallback'
import { tokens } from '../../styles/tokens'

/* ── Normaliza respostas da API (array puro, paginação Spring ou wrapper) ── */
function toArray(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.content)) return data.content
  if (data && Array.isArray(data.data)) return data.data
  if (data && data.data && Array.isArray(data.data.content)) return data.data.content
  return []
}

/* ── Design tokens ── */
const C = {
  navy: tokens.navy, green: tokens.green, greenLt: tokens.greenLight,
  amber: '#D97706', red: '#DC2626', border: '#E2EDE8', bg: '#F4F7F5',
}
const GREENS  = ['#1D9E75','#2ECC9E','#4DD9B8','#7EEBD0','#A8F2E4']
const GRADE_PERIODS = ['BIMESTRE_1', 'BIMESTRE_2', 'BIMESTRE_3', 'BIMESTRE_4']
const DASH_LANGS = ['fr', 'en', 'ar'] // idiomas disponíveis no seletor do dashboard

/* ── Sidebar nav (ícones + ids fixos, labels traduzidos via d.nav) ── */
const NAV_ITEMS = [
  { id:'dash',        ico: LayoutDashboard },
  { id:'students',    ico: GraduationCap },
  { id:'accounts',    ico: Link2 },
  { id:'grades',      ico: PenLine },
  { id:'payments',    ico: CreditCard },
  { id:'attendance',  ico: CheckCircle2 },
  { id:'messages',    ico: MessageCircle, badge:'4' },
  { id:'ranking',     ico: Trophy },
  { id:'marketplace', ico: ShoppingBag },
]

/* ── Reusable components ── */
function KpiCard({ ico: Ico, val, lbl, delta, up, color, bg, loading }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all"
         style={{ borderColor: C.border }}>
      <div className="h-1 rounded-t-xl" style={{ background: color }} />
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
            {Ico && <Ico size={19} style={{ color }} strokeWidth={2.2} />}
          </div>
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

function CardShell({ title, icon: Icon, action, children }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
      <div className="flex justify-between items-center px-5 py-3 border-b" style={{ borderColor: C.border }}>
        <div className="font-syne font-bold text-sm text-[#111827] flex items-center gap-1.5">
          {Icon && <Icon size={14} style={{ color: C.green }} />}{title}
        </div>
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

/* ── Status badge — recebe o mapa de labels traduzido (d.status) ── */
function StatusBadge({ s, labels }) {
  const colors = {
    PAID:    { bg:'#D1FAE5', color:'#065F46' },
    PARTIAL: { bg:'#FEF3C7', color:'#92400E' },
    PENDING: { bg:'#FEF3C7', color:'#92400E' },
    OVERDUE: { bg:'#FEE2E2', color:'#991B1B' },
  }
  const labelMap = {
    PAID: labels?.paid, PARTIAL: labels?.partial, PENDING: labels?.pending, OVERDUE: labels?.overdue,
  }
  const c = colors[s] || colors.PENDING
  const label = labelMap[s] ?? labels?.pending ?? s
  return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background:c.bg, color:c.color }}>{label}</span>
}

/* ── Custom tooltip for recharts ── */
function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5 shadow-lg text-[12px]" style={{ borderColor: C.border }}>
      <p className="font-semibold text-[#111827] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{currency ? `${p.value?.toLocaleString()} ${currency}` : p.value}</strong>
        </p>
      ))}
    </div>
  )
}

/* ── Build monthly revenue data from payments ── */
function buildMonthlyRevenue(payments, monthsShort) {
  const safePayments = Array.isArray(payments) ? payments : []
  const MONTHS = monthsShort ?? ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']
  const now    = new Date()
  const result = []

  for (let i = 5; i >= 0; i--) {
    const d     = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = MONTHS[d.getMonth()]
    const total = safePayments
      .filter(p => p.status === 'PAID' && (p.month ?? '').startsWith(key))
      .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
    result.push({ month: label, revenus: total, objectif: 4000000 })
  }
  return result
}

/* ── Build payment status pie data ── */
function buildPaymentPie(payments, labels) {
  payments = Array.isArray(payments) ? payments : []
  const counts = { PAID: 0, PARTIAL: 0, OVERDUE: 0 }
  payments.forEach(p => {
    const k = p.status === 'PENDING' ? 'PARTIAL' : (p.status ?? 'PARTIAL')
    if (counts[k] !== undefined) counts[k]++
  })
  return [
    { name: labels?.paid ?? 'Payés',     value: counts.PAID,    color: '#1D9E75' },
    { name: labels?.partial ?? 'Partiel', value: counts.PARTIAL, color: '#D97706' },
    { name: labels?.overdue ?? 'Retard',  value: counts.OVERDUE, color: '#DC2626' },
  ].filter(d => d.value > 0)
}

/* ── Build average grades per class ──
   Aceita registros vindos de várias turmas, cada um já com .average calculado
   (GradeResponse do backend), agrupados por classLevel. */
function buildGradesByClass(grades) {
  grades = Array.isArray(grades) ? grades : []
  const map = {}
  grades.forEach(g => {
    const cls = g.classLevel ?? 'N/A'
    const val = parseFloat(g.average ?? g.grade1 ?? g.grade2)
    if (isNaN(val)) return
    if (!map[cls]) map[cls] = []
    map[cls].push(val)
  })
  return Object.entries(map).map(([cls, vals]) => ({
    classe: cls,
    moyenne: vals.length ? parseFloat((vals.reduce((a,b) => a+b,0) / vals.length).toFixed(1)) : 0,
  })).sort((a,b) => b.moyenne - a.moyenne).slice(0, 6)
}

/* ════════════════════ DASHBOARD SCREEN ════════════════════ */
function DashScreen({ d, currency }) {
  const { school } = useAuthStore()
  const schoolId = school?.id ?? school?.schoolId
  const { data: dash, isLoading: dashLoading, error: dashError, refetch: refetchDash } = useDashboard(schoolId)

  const { data: paymentsRaw, isLoading: payLoading } = usePayments()
  const payments = toArray(paymentsRaw)

  /* ── Notas: buscamos por turma, já que a API só aceita uma turma por vez.
     As turmas são derivadas da lista de alunos (classLevel/class). ── */
  const { data: studentsRawForGrades } = useStudents()
  const studentsForGrades = toArray(studentsRawForGrades)

  const classLevels = useMemo(() => {
    const set = new Set(
      studentsForGrades.map(s => s.classLevel ?? s.class).filter(Boolean)
    )
    return Array.from(set)
  }, [studentsForGrades])

  const gradesQueries = useGradesForClasses(classLevels, GRADE_PERIODS)
  const gradeLoading  = gradesQueries.some(q => q.isLoading)

  const grades = useMemo(() => {
    const combos = []
    classLevels.forEach(cls => GRADE_PERIODS.forEach(() => combos.push(cls)))
    return gradesQueries.flatMap((q, i) => {
      const arr = toArray(q.data)
      return arr.map(g => ({ ...g, classLevel: g.classLevel ?? combos[i] }))
    })
  }, [gradesQueries, classLevels])

  const isLoading = dashLoading || payLoading || gradeLoading

  const monthlyData   = useMemo(() => buildMonthlyRevenue(payments, d.monthsShort), [payments, d])
  const pieData       = useMemo(() => buildPaymentPie(payments, d.charts),          [payments, d])
  const gradesByClass = useMemo(() => buildGradesByClass(grades),                   [grades])

  if (dashError) return <ApiErrorFallback error={dashError} onRetry={refetchDash} section={d.errors.dashboard} />

  /* DashboardResponse structure:
     schoolStats.{ totalStudents, activeStudents, totalClasses, pendingApprovals }
     financialStats.{ monthlyRevenue, overdueAmount, overdueCount, collectionRate }
     academicStats.{ averageGrade, passRate, publishedReports, bestClass }
     recentActivities[].{ type, description, time }

     NOTA: os KPIs "FCFA ce mois" e "Moy. générale" abaixo vêm direto do
     backend (financialStats.monthlyRevenue / academicStats.averageGrade).
     Se continuarem zerados após este fix, o problema está no backend
     (DashboardController/Service), não neste arquivo.                    */
  const kpis = [
    {
      ico: GraduationCap,
      val: dash?.schoolStats?.totalStudents ?? dash?.schoolStats?.activeStudents,
      lbl: d.kpi.activeStudents,
      delta: dash?.schoolStats?.pendingApprovals
               ? d.kpi.pendingApprovals(dash.schoolStats.pendingApprovals)
               : undefined,
      up:true, color:C.green, bg:'#E1F5EE',
    },
    {
      ico: Banknote,
      val: dash?.financialStats?.monthlyRevenue != null
             ? `${(dash.financialStats.monthlyRevenue/1000000).toFixed(1)}M`
             : '—',
      lbl: d.kpi.fcfaThisMonth(currency),
      delta: dash?.financialStats?.collectionRate != null
               ? d.kpi.collectionRate(dash.financialStats.collectionRate.toFixed(0))
               : undefined,
      up:true, color:C.navy, bg:'#E8EEF7',
    },
    {
      ico: PenLine,
      val: dash?.academicStats?.averageGrade?.toFixed(1) ?? '—',
      lbl: d.kpi.avgGrade,
      delta: dash?.academicStats?.passRate != null
               ? d.kpi.passRate(dash.academicStats.passRate.toFixed(0))
               : undefined,
      up:true, color:C.amber, bg:'#FEF3C7',
    },
    {
      ico: AlertTriangle,
      val: dash?.financialStats?.overdueCount ?? '—',
      lbl: d.kpi.overdueCount,
      delta: dash?.financialStats?.overdueAmount != null
               ? d.kpi.overdueAmount((dash.financialStats.overdueAmount/1000).toFixed(0))
               : undefined,
      up:false, color:C.red, bg:'#FEE2E2',
    },
  ]

  /* Map recentActivities[].{ type, description, time } to display format */
  const recentActivity = (dash?.recentActivities ?? []).map(a => ({
    icon:   a.type === 'PAYMENT'    ? CreditCard
          : a.type === 'ENROLLMENT' ? GraduationCap
          : a.type === 'GRADE'      ? PenLine
          : a.type === 'ATTENDANCE' ? CheckCircle2
          : Pin,
    name:   a.description ?? '',
    action: '',
    time:   a.time ?? '',
  }))

  const quickActionsList = [
    { ico: GraduationCap, t:d.quickActions.addStudent,  s:d.quickActions.addStudentSub,  path:'/student' },
    { ico: PenLine,       t:d.quickActions.enterGrades, s:d.quickActions.enterGradesSub, path:'/dashboard' },
    { ico: CreditCard,    t:d.quickActions.wavePayment, s:d.quickActions.wavePaymentSub, path:'/dashboard' },
    { ico: MessageCircle, t:d.quickActions.broadcastSms,s:d.quickActions.broadcastSmsSub,path:'/dashboard' },
  ]

  return (
    <div className="space-y-5">

      {/* ── KPI row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k, i) => <KpiCard key={i} {...k} loading={isLoading} />)}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue area chart */}
        <ErrorBoundary section={d.errors.chartRevenue} minimal>
          <CardShell title={d.charts.monthlyRevenue} icon={TrendingUp} action={d.charts.viewAll}>
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
                    <Tooltip content={<CustomTooltip currency={currency} />} />
                    <Area type="monotone" dataKey="revenus" name={d.charts.monthlyRevenue} stroke="#1D9E75" strokeWidth={2.5}
                          fill="url(#revGrad)" dot={{ fill:'#1D9E75', r:3 }} activeDot={{ r:5 }} />
                  </AreaChart>
                </ResponsiveContainer>
                {/* Summary row */}
                <div className="flex justify-between mt-3 pt-3 border-t text-[11px]" style={{ borderColor:C.border }}>
                  <div>
                    <div className="text-[#9CA3AF]">{d.charts.total6Months}</div>
                    <div className="font-bold text-[#111827]">
                      {(monthlyData.reduce((s,dd) => s+dd.revenus,0) / 1000000).toFixed(1)}M {currency}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#9CA3AF]">{d.charts.currentMonth}</div>
                    <div className="font-bold" style={{ color:C.green }}>
                      {((monthlyData.at(-1)?.revenus ?? 0) / 1000000).toFixed(1)}M {currency}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardShell>
        </ErrorBoundary>

        {/* Payment pie chart */}
        <ErrorBoundary section={d.errors.chartPayments} minimal>
          <CardShell title={d.charts.paymentStatus} icon={PieChartIcon}>
            {payLoading ? (
              <div className="h-36 flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-[#E1F5EE] border-t-[#1D9E75] rounded-full animate-spin" />
              </div>
            ) : pieData.length === 0 ? (
              <div className="h-36 flex items-center justify-center text-[#9CA3AF] text-sm">
                {d.charts.noData}
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
                    <Tooltip formatter={(v, n) => [`${v} ${d.charts.studentsTooltipSuffix}`, n]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5 mt-1">
                  {pieData.map((dt, i) => {
                    const total = pieData.reduce((s,x) => s+x.value, 0)
                    const pct   = total ? Math.round(dt.value * 100 / total) : 0
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background:dt.color }} />
                        <span className="text-[11px] text-[#6B7280] flex-1">{dt.name}</span>
                        <span className="text-[11px] font-bold" style={{ color:dt.color }}>{dt.value}</span>
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
        <ErrorBoundary section={d.errors.chartGrades} minimal>
          <CardShell title={d.charts.avgByClass} icon={BarChart3}>
            {gradeLoading ? (
              <div className="h-36 flex items-center justify-center">
                <div className="w-6 h-6 border-4 border-[#E1F5EE] border-t-[#1D9E75] rounded-full animate-spin" />
              </div>
            ) : gradesByClass.length === 0 ? (
              <div className="h-36 flex items-center justify-center text-[#9CA3AF] text-sm">
                {d.charts.noGrades}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={gradesByClass} margin={{ top:4, right:4, left:-20, bottom:0 }} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
                  <XAxis dataKey="classe" tick={{ fontSize:9, fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 20]} tick={{ fontSize:9, fill:'#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="moyenne" name={d.charts.avgByClass} radius={[4,4,0,0]}>
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
        <CardShell title={d.activity.title} icon={Activity} action={d.activity.viewAll}>
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
            <div className="py-8 text-center text-[#9CA3AF] text-sm">{d.activity.empty}</div>
          ) : (
            <div className="divide-y" style={{ borderColor: C.border }}>
              {recentActivity.slice(0,5).map((a, i) => {
                const AIcon = a.icon ?? Pin
                return (
                <div key={i} className="flex items-start gap-3 py-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                       style={{ background:'#E1F5EE' }}>
                    <AIcon size={15} style={{ color: C.green }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-[#374151]">
                      <strong>{a.name ?? a.title}</strong> · {a.action ?? a.description}
                    </div>
                    <div className="text-[10px] text-[#9CA3AF] mt-0.5">{d.activity.timeAgo(a.time ?? a.timestamp)}</div>
                  </div>
                </div>
              )})}
            </div>
          )}
        </CardShell>

        {/* Quick actions */}
        <CardShell title={d.quickActions.title} icon={Zap}>
          <div className="grid grid-cols-2 gap-3">
            {quickActionsList.map((q, i) => (
              <Link key={i} to={q.path}
                className="flex items-center gap-2.5 p-3 rounded-xl border transition-all hover:border-[#1D9E75] hover:bg-[#E1F5EE] no-underline group"
                style={{ borderColor:C.border, background:'#F4F7F5' }}>
                <q.ico size={19} style={{ color: C.green }} className="flex-shrink-0" />
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
function StudentsScreen({ d }) {
  const { data: studentsRaw, isLoading, error, refetch } = useStudents()
  const students = toArray(studentsRaw)
  const [search, setSearch] = useState('')

  const getName = (s) => `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim() || s.fullName || '—'

  const filtered = students.filter(s => {
    const name = getName(s).toLowerCase()
    return name.includes(search.toLowerCase()) ||
      (s.documentNumber ?? '').includes(search) ||
      (s.guardianDocumentNumber ?? '').includes(search)
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ApiErrorFallback error={error} onRetry={refetch} section={d.errors.students} />

  const cols = [d.students.colStudent, d.students.colClass, d.students.colStudentId, d.students.colGuardianId, d.students.colStatus, d.students.colAvg]

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="font-syne font-bold text-lg text-[#111827] flex items-center gap-2"><GraduationCap size={17} style={{ color: C.green }} />{d.students.title}</h2>
        <div className="flex gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={d.students.searchPh}
            className="border rounded-lg px-3 py-2 text-[12px] outline-none focus:border-[#1D9E75] transition-colors w-56"
            style={{ borderColor:'#E5E7EB' }} />
          <Link to="/student"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-[12px] font-bold no-underline hover:opacity-90"
            style={{ background: C.green }}>
            {d.students.add}
          </Link>
        </div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b" style={{ borderColor: C.border, background:'#F8FAF9' }}>
                {cols.map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-[#6B7280] text-[10px] uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: C.border }}>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[#9CA3AF]">
                  {search ? d.students.noResults : d.students.noStudents}
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
                  <td className="px-4 py-3"><StatusBadge s={s.status ?? 'PENDING'} labels={d.status} /></td>
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
function PaymentsScreen({ d, currency }) {
  const { data: paymentsRaw2, isLoading, error, refetch } = usePayments()
  const payments = toArray(paymentsRaw2)

  if (isLoading) return <LoadingSpinner />
  if (error) return <ApiErrorFallback error={error} onRetry={refetch} section={d.errors.payments} />

  const stats = {
    paid:    payments.filter(p => p.status === 'PAID').reduce((s,p) => s + (parseFloat(p.amount)||0), 0),
    pending: payments.filter(p => ['PARTIAL','PENDING'].includes(p.status)).reduce((s,p) => s + (parseFloat(p.amount)||0), 0),
    overdue: payments.filter(p => p.status === 'OVERDUE').reduce((s,p) => s + (parseFloat(p.amount)||0), 0),
  }

  const cols = [d.payments.colStudent, d.payments.colAmount, d.payments.colMethod, d.payments.colStatus, d.payments.colDate]

  return (
    <div className="space-y-4">
      <h2 className="font-syne font-bold text-lg text-[#111827] flex items-center gap-2"><CreditCard size={17} style={{ color: C.green }} />{d.payments.title}</h2>
      <div className="grid grid-cols-3 gap-3">
        {[
          { lbl:d.payments.collected, val:`${(stats.paid/1000000).toFixed(1)}M ${currency}`, color:C.green, bg:'#E1F5EE' },
          { lbl:d.payments.pending,   val:`${(stats.pending/1000).toFixed(0)}k ${currency}`, color:C.amber, bg:'#FEF3C7' },
          { lbl:d.payments.overdue,   val:`${(stats.overdue/1000).toFixed(0)}k ${currency}`, color:C.red,   bg:'#FEE2E2' },
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
                {cols.map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-[#6B7280] text-[10px] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor:C.border }}>
              {payments.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[#9CA3AF]">{d.payments.noPayments}</td></tr>
              ) : payments.map((p, i) => (
                <tr key={p.id ?? i} className="hover:bg-[#F8FAF9]">
                  <td className="px-4 py-3 font-semibold text-[#111827]">{p.studentName ?? p.name}</td>
                  <td className="px-4 py-3 font-bold" style={{ color:C.navy }}>{Number(p.amount).toLocaleString()} {currency}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8EEF7] text-[#0B1E42]">
                      {p.method ?? p.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge s={p.status} labels={d.status} /></td>
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

/* ════════════════════ GRADES SCREEN (lançamento de notas) ════════════════════ */
function GradesScreen({ d }) {
  const g = d.gradesScreen
  const YEAR = '2025-2026' // formato exigido pelo backend (hífen — não confundir com o travessão usado em d.schoolYear)

  const { data: studentsRaw } = useStudents()
  const students = toArray(studentsRaw)

  const classLevels = useMemo(() => {
    const set = new Set(students.map(s => s.classLevel ?? s.class).filter(Boolean))
    return Array.from(set).sort()
  }, [students])

  const [classLevel, setClassLevel]   = useState('')
  const [period, setPeriod]           = useState('')
  const [subjectName, setSubjectName] = useState('')
  const [coefficient, setCoefficient] = useState(1)
  const [edits, setEdits]             = useState({}) // { studentId: { grade1, grade2 } }

  // Ao trocar de turma/bimestre, descarta edições locais não salvas — usando o padrão
  // "ajustar estado durante o render" (evita useEffect + setState, que causa re-render em cascata)
  const [resetKey, setResetKey] = useState('')
  const currentKey = `${classLevel}|${period}`
  if (currentKey !== resetKey) {
    setResetKey(currentKey)
    setEdits({})
  }

  const classStudents = useMemo(
    () => students.filter(s => (s.classLevel ?? s.class) === classLevel),
    [students, classLevel]
  )

  const { data: gradesRaw, isLoading: gradesLoading } = useGrades(classLevel, period, YEAR)
  const existingGrades = toArray(gradesRaw)

  // Notas já lançadas para a matéria atual, indexadas por aluno (pré-preenche o formulário)
  const existingByStudent = useMemo(() => {
    const map = {}
    existingGrades
      .filter(gr => !subjectName.trim() || gr.subjectName === subjectName.trim())
      .forEach(gr => { map[gr.studentId] = gr })
    return map
  }, [existingGrades, subjectName])

  const saveGrades    = useSaveGrades()
  const publishGrades = usePublishGrades()

  const getValue = (studentId, field) => {
    if (edits[studentId]?.[field] !== undefined) return edits[studentId][field]
    const existing = existingByStudent[studentId]?.[field]
    return existing ?? ''
  }

  const setValue = (studentId, field, value) => {
    setEdits(prev => ({ ...prev, [studentId]: { ...prev[studentId], [field]: value } }))
  }

  const computeAverage = (studentId) => {
    const v1 = getValue(studentId, 'grade1')
    const v2 = getValue(studentId, 'grade2')
    const g1 = v1 === '' ? NaN : parseFloat(v1)
    const g2 = v2 === '' ? NaN : parseFloat(v2)
    if (isNaN(g1) && isNaN(g2)) return '—'
    if (isNaN(g1)) return g2.toFixed(1)
    if (isNaN(g2)) return g1.toFixed(1)
    return ((g1 + g2) / 2).toFixed(1)
  }

  const periodOptions = [
    { value:'BIMESTRE_1', label:g.bimestre1 },
    { value:'BIMESTRE_2', label:g.bimestre2 },
    { value:'BIMESTRE_3', label:g.bimestre3 },
    { value:'BIMESTRE_4', label:g.bimestre4 },
  ]

  const canSave = classLevel && period && subjectName.trim()

  const handleSave = () => {
    if (!canSave) return
    const gradesPayload = classStudents
      .map(s => {
        const v1 = getValue(s.id, 'grade1')
        const v2 = getValue(s.id, 'grade2')
        if (v1 === '' && v2 === '') return null // pula alunos sem nenhuma nota digitada nesta sessão
        return {
          studentId: s.id,
          grade1: v1 === '' ? null : parseFloat(v1),
          grade2: v2 === '' ? null : parseFloat(v2),
        }
      })
      .filter(Boolean)

    if (gradesPayload.length === 0) return

    saveGrades.mutate({
      classLevel,
      subjectName: subjectName.trim(),
      period,
      year: YEAR,
      coefficient: parseFloat(coefficient) || 1,
      grades: gradesPayload,
    })
  }

  const handlePublish = () => {
    const periodLabel = periodOptions.find(p => p.value === period)?.label ?? period
    if (!window.confirm(g.publishConfirm(classLevel, periodLabel))) return
    publishGrades.mutate({ classLevel, period, year: YEAR })
  }

  return (
    <div className="space-y-4">
      <h2 className="font-syne font-bold text-lg text-[#111827] flex items-center gap-2"><PenLine size={17} style={{ color: C.green }} />{g.title}</h2>

      {/* Seletores */}
      <div className="bg-white rounded-xl border p-4 grid grid-cols-1 sm:grid-cols-4 gap-3" style={{ borderColor: C.border }}>
        <div>
          <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">{g.classLabel}</label>
          <select value={classLevel} onChange={e => setClassLevel(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-[12px] outline-none focus:border-[#1D9E75]" style={{ borderColor:'#E5E7EB' }}>
            <option value="">{g.selectClass}</option>
            {classLevels.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">{g.periodLabel}</label>
          <select value={period} onChange={e => setPeriod(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-[12px] outline-none focus:border-[#1D9E75]" style={{ borderColor:'#E5E7EB' }}>
            <option value="">—</option>
            {periodOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">{g.subjectLabel}</label>
          <input value={subjectName} onChange={e => setSubjectName(e.target.value)} placeholder={g.subjectPh}
            className="w-full border rounded-lg px-3 py-2 text-[12px] outline-none focus:border-[#1D9E75]" style={{ borderColor:'#E5E7EB' }} />
        </div>
        <div>
          <label className="text-[10px] font-bold text-[#6B7280] uppercase block mb-1">{g.coefficientLabel}</label>
          <input type="number" min="0.5" step="0.5" value={coefficient} onChange={e => setCoefficient(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-[12px] outline-none focus:border-[#1D9E75]" style={{ borderColor:'#E5E7EB' }} />
        </div>
      </div>

      {!classLevel || !period ? (
        <div className="bg-white rounded-xl border p-8 text-center text-[#9CA3AF] text-sm" style={{ borderColor: C.border }}>
          {g.noClassOrPeriod}
        </div>
      ) : gradesLoading ? (
        <LoadingSpinner />
      ) : classStudents.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-[#9CA3AF] text-sm" style={{ borderColor: C.border }}>
          {g.noStudents}
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b" style={{ borderColor: C.border, background:'#F8FAF9' }}>
                  {[g.colStudent, g.colGrade1, g.colGrade2, g.colAverage].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-bold text-[#6B7280] text-[10px] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: C.border }}>
                {classStudents.map(s => (
                  <tr key={s.id} className="hover:bg-[#F8FAF9] transition-colors">
                    <td className="px-4 py-2.5 font-semibold text-[#111827]">
                      {`${s.firstName ?? ''} ${s.lastName ?? ''}`.trim() || s.fullName || '—'}
                    </td>
                    <td className="px-4 py-2.5">
                      <input type="number" min="0" max="20" step="0.5"
                        value={getValue(s.id, 'grade1')}
                        onChange={e => setValue(s.id, 'grade1', e.target.value)}
                        className="w-16 border rounded-lg px-2 py-1 text-[12px] outline-none focus:border-[#1D9E75]" style={{ borderColor:'#E5E7EB' }} />
                    </td>
                    <td className="px-4 py-2.5">
                      <input type="number" min="0" max="20" step="0.5"
                        value={getValue(s.id, 'grade2')}
                        onChange={e => setValue(s.id, 'grade2', e.target.value)}
                        className="w-16 border rounded-lg px-2 py-1 text-[12px] outline-none focus:border-[#1D9E75]" style={{ borderColor:'#E5E7EB' }} />
                    </td>
                    <td className="px-4 py-2.5 font-bold" style={{ color: C.green }}>{computeAverage(s.id)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 p-4 border-t" style={{ borderColor: C.border }}>
            <button onClick={handleSave} disabled={!canSave || saveGrades.isPending}
              className="flex-1 px-4 py-2.5 rounded-lg text-white text-[12px] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: C.green }}>
              {saveGrades.isPending ? g.saving : (<><Save size={13} className="inline -mt-0.5 mr-1.5" />{g.save}</>)}
            </button>
            <button onClick={handlePublish} disabled={publishGrades.isPending}
              className="flex-1 px-4 py-2.5 rounded-lg text-[12px] font-bold border disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: C.navy, color: C.navy, background:'white' }}>
              {publishGrades.isPending ? g.publishing : (<><Send size={13} className="inline -mt-0.5 mr-1.5" />{g.publish}</>)}
            </button>
          </div>
          {!subjectName.trim() && (
            <div className="px-4 pb-3 text-[10px] text-[#DC2626]">{g.subjectRequired}</div>
          )}
        </div>
      )}
    </div>
  )
}

/* ════════════════════ STUDENT ACCOUNTS SCREEN (aprovação de contas) ════════════════════
   Um aluno/tutor cria a própria conta de login (StudentAccount), separada da ficha
   acadêmica do aluno (Student, já cadastrada pelo diretor). Aqui o diretor liga as duas
   (aprovando) ou rejeita, evitando que qualquer pessoa se passe por aluno da escola. */
function StudentAccountsScreen({ d }) {
  const a = d.accountsScreen

  const { data: pendingRaw, isLoading } = usePendingStudentAccounts()
  const pending = toArray(pendingRaw)

  const { data: studentsRaw } = useStudents()
  const students = toArray(studentsRaw)

  const [linkChoice, setLinkChoice] = useState({}) // { accountId: studentId }

  const reviewAccount = useReviewStudentAccount()

  const getName = (s) => `${s.firstName ?? ''} ${s.lastName ?? ''}`.trim() || s.fullName || '—'

  const handleApprove = (accountId) => {
    const studentId = linkChoice[accountId]
    if (!studentId) return
    reviewAccount.mutate({ id: accountId, approved: true, studentId })
  }

  const handleReject = (accountId) => {
    const reason = window.prompt(a.rejectPrompt) ?? ''
    reviewAccount.mutate({ id: accountId, approved: false, rejectionReason: reason })
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      <h2 className="font-syne font-bold text-lg text-[#111827] flex items-center gap-2"><Link2 size={17} style={{ color: C.green }} />{a.title}</h2>

      {pending.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center text-[#9CA3AF] text-sm" style={{ borderColor: C.border }}>
          {a.noAccounts}
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map(acc => (
            <div key={acc.accountId} className="bg-white rounded-xl border p-4" style={{ borderColor: C.border }}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-[#111827] text-[13px]">{acc.registeredBy}</div>
                  <div className="text-[11px] text-[#6B7280] mt-0.5">
                    {acc.documentType ? `${acc.documentType}: ` : ''}{acc.documentNumber}
                    {acc.phone ? ` · ${acc.phone}` : ''}
                    {acc.email ? ` · ${acc.email}` : ''}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={linkChoice[acc.accountId] ?? ''}
                    onChange={e => setLinkChoice(prev => ({ ...prev, [acc.accountId]: e.target.value }))}
                    className="border rounded-lg px-3 py-2 text-[12px] outline-none focus:border-[#1D9E75] min-w-[200px]"
                    style={{ borderColor:'#E5E7EB' }}>
                    <option value="">{a.selectStudent}</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{getName(s)} — {s.classLevel ?? s.class ?? '—'}</option>
                    ))}
                  </select>

                  <button onClick={() => handleApprove(acc.accountId)}
                    disabled={!linkChoice[acc.accountId] || reviewAccount.isPending}
                    className="px-3 py-2 rounded-lg text-white text-[12px] font-bold disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    style={{ background: C.green }}>
                    {reviewAccount.isPending ? a.approving : (<><CheckCircle2 size={13} className="inline -mt-0.5 mr-1" />{a.approve}</>)}
                  </button>

                  <button onClick={() => handleReject(acc.accountId)}
                    disabled={reviewAccount.isPending}
                    className="px-3 py-2 rounded-lg text-[12px] font-bold border disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    style={{ borderColor: C.red, color: C.red, background:'white' }}>
                    {reviewAccount.isPending ? a.rejecting : (<><X size={13} className="inline -mt-0.5 mr-1" />{a.reject}</>)}
                  </button>
                </div>
              </div>
              {!linkChoice[acc.accountId] && (
                <div className="text-[10px] text-[#9CA3AF] mt-2">{a.linkRequired}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PlaceholderScreen({ title, sub }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-[#6B7280]">
      <Wrench size={32} className="mb-3 text-[#D1D5DB]" />
      <div className="font-syne font-bold text-lg mb-1">{title}</div>
      <div className="text-sm">{sub}</div>
    </div>
  )
}

/* ════════════════════ MAIN DASHBOARD ════════════════════ */
export default function Dashboard() {
  const [active, setActive] = useState('dash')
  const { school, user, logout } = useAuthStore()
  const { t, lang, setLang, isRTL } = useLang()
  const d = t.dashboard

  // Moeda dinâmica por país da escola (fallback FCFA enquanto carrega ou se o país não estiver configurado)
  const { data: countryConfig } = useCountryConfig(school?.country)
  const currency = countryConfig?.currency || 'FCFA'

  // Badge dinâmico no menu — quantas contas de aluno aguardam aprovação agora
  const { data: pendingAccountsRaw } = usePendingStudentAccounts()
  const pendingAccountsCount = pendingAccountsRaw?.totalElements ?? toArray(pendingAccountsRaw).length

  const NAV = NAV_ITEMS.map(item => ({
    ...item,
    label: d.nav[item.id],
    badge: item.id === 'accounts' && pendingAccountsCount > 0 ? String(pendingAccountsCount) : item.badge,
  }))

  const screens = {
    dash:        <DashScreen d={d} currency={currency} />,
    students:    <StudentsScreen d={d} />,
    accounts:    <StudentAccountsScreen d={d} />,
    payments:    <PaymentsScreen d={d} currency={currency} />,
    grades:      <GradesScreen d={d} />,
    attendance:  <PlaceholderScreen title={d.placeholderScreens.attendance} sub={d.placeholder.sub} />,
    messages:    <PlaceholderScreen title={d.placeholderScreens.messages} sub={d.placeholder.sub} />,
    ranking:     <PlaceholderScreen title={d.placeholderScreens.ranking} sub={d.placeholder.sub} />,
    marketplace: <PlaceholderScreen title={d.placeholderScreens.marketplace} sub={d.placeholder.sub} />,
  }

  return (
    <div className="flex h-screen font-dm overflow-hidden" style={{ background:C.bg }} dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-[220px] flex-shrink-0" style={{ background:C.navy }}>
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/10">
          <span className="font-syne font-bold text-white text-lg">Edukira<span style={{ color: C.green }}>.</span></span>
        </div>

        {school && (
          <div className="mx-3 my-2.5 p-2.5 rounded-xl"
               style={{ background:'rgba(29,158,117,0.12)', border:'1px solid rgba(29,158,117,0.22)' }}>
            <div className="text-[11px] font-semibold text-white truncate">{school.name ?? d.defaultSchoolName}</div>
            <div className="text-[10px] text-white/40 mt-0.5">{school.country ?? ''} · {d.schoolYear}</div>
            {school.schoolCode && (
              <div className="text-[9px] font-mono text-[#5DCAA5] mt-1 tracking-wide">{school.schoolCode}</div>
            )}
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-2">
          <div className="text-[9px] font-bold text-white/30 uppercase tracking-[1.5px] px-4 py-2">{d.nav.main}</div>
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
              <item.ico size={16} className="flex-shrink-0" />
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
              <div className="text-[12px] font-semibold text-white truncate">{user?.name ?? d.admin}</div>
              <button onClick={logout}
                className="text-[10px] text-red-400 hover:text-red-300 bg-transparent border-none cursor-pointer p-0 transition-colors">
                {d.logout}
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
          <div className="font-syne font-bold text-[15px] text-[#111827] flex-1 flex items-center gap-2">
            {(() => { const ActiveIcon = NAV.find(n => n.id === active)?.ico; return ActiveIcon ? <ActiveIcon size={16} style={{ color: C.green }} /> : null })()}
            {d.screenTitles[active]}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {/* Seletor de idioma — mantém a paleta original do topbar (claro) */}
            <div className="flex items-center gap-[2px] rounded-full p-[3px]"
                 style={{ background:'#F4F7F5', border:`1px solid ${C.border}` }}>
              {DASH_LANGS.map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold transition-all ${
                    lang === l ? 'text-white shadow-sm' : 'text-[#6B7280] hover:text-[#1D9E75] hover:bg-white'
                  }`}
                  style={{ background: lang === l ? C.green : 'transparent' }}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="relative w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border"
                 style={{ background:'#F4F7F5', borderColor:C.border }}>
              <Bell size={15} className="text-[#374151]" />
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
          <ErrorBoundary section={d.screenTitles[active]} minimal>
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
            <item.ico size={19} />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
