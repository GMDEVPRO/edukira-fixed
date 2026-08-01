import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, GraduationCap, PenLine, CreditCard } from 'lucide-react'
import { useStudents, useStudentReport, useStudentPaymentsAdmin } from '../../hooks/useSchoolData'
import { tokens } from '../../styles/tokens'

const C = {
  navy: tokens.navy, green: tokens.green,
  amber: '#D97706', red: '#DC2626', border: '#E2EDE8', bg: '#F4F7F5',
}
const YEAR = '2025-2026'

function toArray(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.content)) return data.content
  if (data && Array.isArray(data.data)) return data.data
  if (data && data.data && Array.isArray(data.data.content)) return data.data.content
  return []
}

function CardShell({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
      <div className="flex items-center gap-1.5 px-5 py-3 border-b font-syne font-bold text-sm text-[#111827]" style={{ borderColor: C.border }}>
        {Icon && <Icon size={14} style={{ color: C.green }} />}{title}
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
        <Link to="/dashboard" state={{ tab: 'students' }} className="text-[13px] flex items-center gap-1.5 mb-4" style={{ color: C.green }}>
          <ArrowLeft size={14} /> Voltar
        </Link>
        <div className="bg-white rounded-xl border p-8 text-center text-[#9CA3AF]" style={{ borderColor: C.border }}>
          Aluno não encontrado.
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 space-y-4 max-w-4xl mx-auto">
      <Link to="/dashboard" state={{ tab: 'students' }} className="text-[13px] flex items-center gap-1.5 no-underline" style={{ color: C.green }}>
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

      {/* ── Boletim ── */}
      <CardShell title={`Boletim — ${YEAR}`} icon={PenLine}>
        {reportLoading ? (
          <div className="text-[#9CA3AF] text-sm">Carregando notas...</div>
        ) : !report || Object.keys(report.gradesByPeriod ?? {}).length === 0 ? (
          <div className="text-[#9CA3AF] text-sm text-center py-4">Nenhuma nota lançada ainda.</div>
        ) : (
          <div className="space-y-4">
            {Object.entries(report.gradesByPeriod).map(([period, subjects]) => (
              <div key={period}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[12px] font-bold text-[#111827]">{PERIOD_LABELS[period] ?? period}</div>
                  <div className="text-[12px] font-bold" style={{ color: C.green }}>
                    Média: {report.averageByPeriod?.[period]?.toFixed?.(1) ?? report.averageByPeriod?.[period] ?? '—'}
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
                      {subjects.map((sg, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 font-semibold text-[#111827]">{sg.subjectName}</td>
                          <td className="px-3 py-2 font-bold" style={{ color: C.green }}>{sg.average ?? '—'}</td>
                          <td className="px-3 py-2 text-[#6B7280]">{sg.coefficient ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-2 border-t text-[13px] font-bold" style={{ borderColor: C.border, color: C.navy }}>
              Média anual: {report.yearAverage ?? '—'}
            </div>
          </div>
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
