import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Trash2 } from 'lucide-react'
import { useTeachers, useDeleteTeacher } from '../../hooks/useSchoolData'
import { tokens } from '../../styles/tokens'

const C = {
  navy: tokens.navy, green: tokens.green,
  amber: '#D97706', red: '#DC2626', border: '#E2EDE8', bg: '#F4F7F5',
}

function toArray(data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.content)) return data.content
  if (data && Array.isArray(data.data)) return data.data
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

export default function TeacherDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: teachersRaw, isLoading } = useTeachers()
  const teachers = toArray(teachersRaw)
  const teacher = teachers.find(t => t.id === id)

  const deleteTeacher = useDeleteTeacher()

  const getName = (t) => `${t?.firstName ?? ''} ${t?.lastName ?? ''}`.trim() || t?.fullName || '—'

  if (isLoading) {
    return <div className="p-5 text-[#9CA3AF]">Carregando...</div>
  }

  if (!teacher) {
    return (
      <div className="p-5">
        <Link to="/dashboard" className="text-[13px] flex items-center gap-1.5 mb-4" style={{ color: C.green }}>
          <ArrowLeft size={14} /> Voltar
        </Link>
        <div className="bg-white rounded-xl border p-8 text-center text-[#9CA3AF]" style={{ borderColor: C.border }}>
          Professor não encontrado.
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    if (!window.confirm(`Remover ${getName(teacher)}? Esta ação não pode ser desfeita.`)) return
    deleteTeacher.mutate(teacher.id, { onSuccess: () => navigate('/dashboard') })
  }

  return (
    <div className="p-5 space-y-4 max-w-4xl mx-auto">
      <Link to="/dashboard" className="text-[13px] flex items-center gap-1.5 no-underline" style={{ color: C.green }}>
        <ArrowLeft size={14} /> Voltar ao Dashboard
      </Link>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0"
               style={{ background: C.navy }}>
            {getName(teacher).split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="font-syne font-bold text-xl text-[#111827]">{getName(teacher)}</h1>
            <div className="text-[12px] text-[#6B7280]">{teacher.email ?? '—'}</div>
          </div>
        </div>
        <button onClick={handleDelete} disabled={deleteTeacher.isPending}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-bold border disabled:opacity-50"
          style={{ borderColor: C.red, color: C.red, background:'white' }}>
          <Trash2 size={13} /> Remover
        </button>
      </div>

      {/* ── Cadastro ── */}
      <CardShell title="Dados Cadastrais" icon={Users}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
          <div>
            <div className="text-[10px] font-bold text-[#6B7280] uppercase mb-0.5">Email</div>
            <div className="text-[#111827]">{teacher.email ?? '—'}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#6B7280] uppercase mb-0.5">Nº de documento</div>
            <div className="text-[#111827] font-mono">{teacher.documentNumber ?? '—'}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#6B7280] uppercase mb-0.5">Telefone</div>
            <div className="text-[#111827]">{teacher.phone ?? '—'}</div>
          </div>
        </div>
      </CardShell>

      {/* ── Matérias ── */}
      <CardShell title="Matérias" icon={Users}>
        {(!teacher.subjects || teacher.subjects.length === 0) ? (
          <div className="text-[#9CA3AF] text-sm text-center py-4">Nenhuma matéria vinculada.</div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {teacher.subjects.map((s, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{ background:'#E1F5EE', color: C.green }}>
                {s.name ?? s}
              </span>
            ))}
          </div>
        )}
      </CardShell>
    </div>
  )
}
