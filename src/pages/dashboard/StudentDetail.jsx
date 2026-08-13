import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, GraduationCap, PenLine, CreditCard } from 'lucide-react'
import { useStudents, useStudentReport, useStudentPaymentsAdmin } from '../../hooks/useSchoolData'
import { tokens } from '../../styles/tokens'

const C = {
  navy: tokens.navy, green: tokens.green,
  amber: '#D97706', red: '#DC2626', border: '#E2EDE8', bg: '#F4F7F5',
}
const YEAR = '2025-2026'
const PERIODS = ['BIMESTRE_1', 'BIMESTRE_2', 'BIMESTRE_3', 'BIMESTRE_4']

function toArray(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.content)) return data.content
  if (data && Array.isArray(data.data)) return data.data
  if (data && data.data && Array.isArray(data.data.content)) return data.data.content
  return []
}

function CardShell({ title, icon: Icon, action, children }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-1.5 font-syne font-bold text-sm text-[#111827]">
          {Icon && <Icon size={14} style={{ color: C.green }} />}{title}
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

const PERIOD_LABELS = {
  BIMESTRE_1: '1º Bimestre', BIMESTRE_2: '2º Bimestre',
  BIMESTRE_3: '3º Bimestre', BIMESTRE_4: '4º Bimestre',
}

const STATUS_LABELS = {
  PAID: { label: 'Pago', bg: '#D1FAE5', color: '#065F46' },
  PARTIAL: { label: 'Parcial', bg: '#FEF3C7', color: '#92400E' },
  PENDING: { label: 'Pendente', bg: '#FEF3C7', color: '#92400E' },
  OVERDUE: { label: 'Atrasado', bg: '#FEE2E2', color: '#991B1B' },
}

export default function StudentDetail() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('BIMESTRE_1')

  const { data: studentsRaw, isLoading: studentsLoading } = useStudents()
  const students = toArray(studentsRaw)
  const student = students.find(s => s.id === id)

  const { data: report, isLoading: reportLoading } = useStudentReport(id, YEAR)
  const { data: paymentsRaw, isLoading: paymentsLoading } = useStudentPaymentsAdmin(id)
  const payments = toArray(paymentsRaw)

  const getName = (s) => `${s?.firstName ?? ''} ${s?.lastName ?? ''}`.trim() || s?.fullName || '—'

  if (studentsLoading) {
    return <div className="p-5 text-[#9CA3AF]">Carregando...</div>
  }

  if (!student) {
    return (
      <div className="p-5">
        <Link to="/dashboard" className="text-[13px] flex items-center gap-1.5 mb-4" style={{ color: C.green }}>
          <ArrowLeft size={14} /> Voltar
        </Link>
        <div className="bg-white rounded-xl border p-8 text-center text-[#9CA3AF]" style={{ borderColor: C.border }}>
          Aluno não encontrado.
        </div>
      </div>
    )
  }

  const activeSubjects = report?.gradesByPeriod?.[activeTab] ?? []
  const activeAverage = report?.averageByPeriod?.[activeTab]

  return (
    <div className="p-5 space-y-4 max-w-4xl mx-auto">
      <Link to="/dashboard" className="text-[13px] flex items-center gap-1.5 no-underline" style={{ color: C.green }}>
        <ArrowLeft size={14} /> Voltar ao Dashboard
      </Link>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0"
             style={{ background: C.navy }}>
          {getName(student).split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="font-syne font-bold text-xl text-[#111827]">{getName(student)}</h1>
          <div className="text-[12px] text-[#6B7280]">{student.classLevel ?? student.class ?? '—'}</div>
        </div>
      </div>

      {/* ── Cadastro ── */}
      <CardShell title="Dados Cadastrais" icon={GraduationCap}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
          <div>
            <div className="text-[10px] font-bold text-[#6B7280] uppercase mb-0.5">Turma</div>
            <div className="text-[#111827]">{student.classLevel ?? student.class ?? '—'}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#6B7280] uppercase mb-0.5">Nº de documento</div>
            <div className="text-[#111827] font-mono">{student.documentNumber ?? '—'}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#6B7280] uppercase mb-0.5">Responsável</div>
            <div className="text-[#111827]">{student.guardianName ?? '—'}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#6B7280] uppercase mb-0.5">Telefone do responsável</div>
            <div className="text-[#111827]">{student.guardianPhone ?? '—'}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#6B7280] uppercase mb-0.5">Nº doc. do responsável</div>
            <div className="text-[#111827] font-mono">{student.guardianDocumentNumber ?? '—'}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#6B7280] uppercase mb-0.5">Email do responsável</div>
            <div className="text-[#111827]">{student.guardianEmail ?? '—'}</div>
          </div>
        </div>
      </CardShell>

      {/* ── Boletim — abas por bimestre, sincronizado direto do Lançamento de Notas (só leitura) ── */}
      <CardShell
        title={`Boletim — ${YEAR}`}
        icon={PenLine}
        action={
          <div className="text-[12px] font-bold" style={{ color: C.green }}>
            Média anual: {report?.yearAverage ?? '—'}
          </div>
        }
      >
        {reportLoading ? (
          <div className="text-[#9CA3AF] text-sm">Carregando notas...</div>
        ) : (
          <>
            <div className="flex border rounded-lg overflow-hidden mb-3" style={{ borderColor: C.border }}>
              {PERIODS.map(period => {
                const hasData = !!report?.gradesByPeriod?.[period]?.length
                const isActive = activeTab === period
                const avg = report?.averageByPeriod?.[period]
                return (
                  <button key={period} type="button" onClick={() => setActiveTab(period)}
                    className="flex-1 text-center py-2.5 text-[12px] font-semibold transition-colors border-r last:border-r-0"
                    style={{
                      borderColor: C.border,
                      background: isActive ? C.green : '#F8FAF9',
                      color: isActive ? 'white' : hasData ? '#374151' : '#9CA3AF',
                    }}>
                    {PERIOD_LABELS[period]}
                    <div className="text-[9px] mt-0.5" style={{ opacity: isActive ? 0.85 : 1 }}>
                      {hasData ? `média ${avg?.toFixed?.(1) ?? avg}` : 'sem nota'}
                    </div>
                  </button>
                )
              })}
            </div>

            {activeSubjects.length === 0 ? (
              <div className="text-[#9CA3AF] text-sm text-center py-6">
                Nenhuma nota lançada neste bimestre ainda.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-end mb-2">
                  <div className="text-[12px] font-bold" style={{ color: C.green }}>
                    Média do bimestre: {activeAverage?.toFixed?.(1) ?? activeAverage ?? '—'}
                  </div>
                </div>
                <div className="border rounded-lg overflow-hidden" style={{ borderColor: C.border }}>
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr style={{ background: '#F8FAF9' }}>
                        <th className="px-3 py-2 text-left font-bold text-[#6B7280] text-[10px] uppercase">Matéria</th>
                        <th className="px-3 py-2 text-left font-bold text-[#6B7280] text-[10px] uppercase">Média</th>
                        <th className="px-3 py-2 text-left font-bold text-[#6B7280] text-[10px] uppercase">Coef.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: C.border }}>
                      {activeSubjects.map((sg, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 font-semibold text-[#111827]">{sg.subjectName}</td>
                          <td className="px-3 py-2 font-bold" style={{ color: C.green }}>{sg.average ?? '—'}</td>
                          <td className="px-3 py-2 text-[#6B7280]">{sg.coefficient ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </CardShell>

      {/* ── Pagamentos ── */}
      <CardShell title="Pagamentos" icon={CreditCard}>
        {paymentsLoading ? (
          <div className="text-[#9CA3AF] text-sm">Carregando pagamentos...</div>
        ) : payments.length === 0 ? (
          <div className="text-[#9CA3AF] text-sm text-center py-4">Nenhum pagamento registrado ainda.</div>
        ) : (
          <div className="border rounded-lg overflow-hidden" style={{ borderColor: C.border }}>
            <table className="w-full text-[12px]">
              <thead>
                <tr style={{ background: '#F8FAF9' }}>
                  <th className="px-3 py-2 text-left font-bold text-[#6B7280] text-[10px] uppercase">Mês</th>
                  <th className="px-3 py-2 text-left font-bold text-[#6B7280] text-[10px] uppercase">Valor</th>
                  <th className="px-3 py-2 text-left font-bold text-[#6B7280] text-[10px] uppercase">Método</th>
                  <th className="px-3 py-2 text-left font-bold text-[#6B7280] text-[10px] uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: C.border }}>
                {payments.map((p, i) => {
                  const s = STATUS_LABELS[p.status] ?? STATUS_LABELS.PENDING
                  return (
                    <tr key={p.id ?? i}>
                      <td className="px-3 py-2 font-semibold text-[#111827]">{p.month ?? '—'}</td>
                      <td className="px-3 py-2 font-bold" style={{ color: C.navy }}>{Number(p.amount).toLocaleString()} {p.currency}</td>
                      <td className="px-3 py-2 text-[#6B7280]">{p.method}</td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardShell>
    </div>
  )
}
