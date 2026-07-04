import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../hooks/useLang'
import api from '../api/axios'
import useAuthStore from '../store/authStore'

const COUNTRIES = [
  { code:'AO',flag:'🇦🇴',name:'Angola'},{code:'MZ',flag:'🇲🇿',name:'Moçambique'},
  {code:'CV',flag:'🇨🇻',name:'Cabo Verde'},{code:'SN',flag:'🇸🇳',name:'Sénégal'},
  {code:'CI',flag:'🇨🇮',name:"Côte d'Ivoire"},{code:'ML',flag:'🇲🇱',name:'Mali'},
  {code:'BF',flag:'🇧🇫',name:'Burkina Faso'},{code:'GN',flag:'🇬🇳',name:'Guinée'},
  {code:'GW',flag:'🇬🇼',name:'Guiné-Bissau'},{code:'ST',flag:'🇸🇹',name:'S. Tomé'},
  {code:'CM',flag:'🇨🇲',name:'Cameroun'},{code:'CD',flag:'🇨🇩',name:'RD Congo'},
  {code:'MG',flag:'🇲🇬',name:'Madagascar'},{code:'MA',flag:'🇲🇦',name:'Maroc'},
  {code:'TG',flag:'🇹🇬',name:'Togo'},{code:'BJ',flag:'🇧🇯',name:'Bénin'},
  {code:'OTHER',flag:'🌍',name:'Autre / Other'},
]
const ID_TYPES = [
  {code:'BI',      label:'BI / Bilhete de Identidade'},
  {code:'CEDULA',  label:'Cédula / Certidão de Nascimento'},
  {code:'CNI',     label:'CNI'},
  {code:'NINA',    label:'NINA'},
  {code:'CNIB',    label:'CNIB'},
  {code:'CIN',     label:'CIN'},
  {code:'PASSPORT',label:'Passeport / Passaporte'},
  {code:'NIF',     label:'NIF'},
  {code:'OTHER',   label:'Autre / Outro'},
]
const CLASSES = [
  'CP','CE1','CE2','CM1','CM2','6ème','5ème','4ème','3ème',
  'Seconde','Première','Terminale','Licence 1','Licence 2','Licence 3','Master 1','Master 2',
]
const RELATIONS = ['Père / Pai','Mère / Mãe','Tuteur légal / Tutor','Grand-parent / Avô','Frère/Sœur / Irmão','Autre / Outro']

/* ── Validation rules ── */
const rules = {
  schoolId:         v => v.trim() ? '' : 'ID da escola obrigatório',
  firstName:        v => v.trim() ? '' : 'Prénom / Nome obrigatório',
  lastName:         v => v.trim() ? '' : 'Nom / Apelido obrigatório',
  docType:          v => v ? '' : 'Tipo de documento obrigatório',
  docNumber:        v => v.trim().length >= 4 ? '' : 'Nº de documento inválido (min. 4 caracteres)',
  phone:            v => !v || /^[\d+\s\-]{7,}$/.test(v) ? '' : 'Numéro invalide',
  password:         v => v.length >= 8 ? '' : 'Mínimo 8 caracteres',
  tutorFirstName:   v => v.trim() ? '' : 'Prénom du tuteur obligatoire',
  tutorLastName:    v => v.trim() ? '' : 'Nom du tuteur obligatoire',
  tutorDocType:     v => v ? '' : 'Type document tuteur obligatoire',
  tutorDocNumber:   v => v.trim().length >= 4 ? '' : 'Nº document tuteur invalide',
  tutorPhone:       v => /^[\d+\s\-]{7,}$/.test(v) ? '' : 'Téléphone tuteur requis',
  tutorRelation:    v => v ? '' : 'Relation obligatoire',
  tutorPassword:    v => v.length >= 8 ? '' : 'Mínimo 8 caracteres',
  childFirstName:   v => v.trim() ? '' : 'Prénom élève obligatoire',
  childDocNumber:   v => v.trim().length >= 4 ? '' : 'Nº document élève invalide',
}

/* ── Reusable UI ── */
const Label = ({ children, required }) => (
  <label className="text-[.7rem] font-bold text-[#6B7280] uppercase tracking-[.07em] mb-1.5 block">
    {children}{required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
)

const FieldError = ({ msg }) =>
  msg ? <p className="text-red-500 text-[10px] mt-1 flex items-center gap-1">⚠ {msg}</p> : null

const Input = ({ value, onChange, error, ...props }) => (
  <input
    value={value} onChange={onChange}
    className={`w-full px-3.5 py-2.5 border-[1.5px] rounded-lg text-[.875rem] text-[#111827] bg-[#FAFAFA] outline-none transition-all focus:bg-white placeholder-[#D1D5DB] ${
      error
        ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
        : 'border-[#E5E7EB] focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10'
    }`}
    {...props}
  />
)

const Select = ({ value, onChange, error, children, ...props }) => (
  <select
    value={value} onChange={onChange}
    className={`w-full px-3.5 py-2.5 border-[1.5px] rounded-lg text-[.875rem] text-[#111827] bg-[#FAFAFA] outline-none transition-all focus:bg-white ${
      error
        ? 'border-red-400 focus:border-red-400'
        : 'border-[#E5E7EB] focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/10'
    }`}
    {...props}
  >
    {children}
  </select>
)

const SectionTitle = ({ children, color = '#1D9E75', emoji }) => (
  <div className="flex items-center gap-2 py-2 border-b border-[#E5E7EB] mb-4">
    <div className="w-1 h-4 rounded-full" style={{ background: color }} />
    <span className="text-[.72rem] font-bold uppercase tracking-[.1em]" style={{ color }}>
      {emoji && <span className="mr-1">{emoji}</span>}{children}
    </span>
  </div>
)

/* ── ID Field highlighted ── */
const IDField = ({ label, typeVal, typeChange, typeError, numVal, numChange, numError }) => (
  <div className="rounded-xl p-4 space-y-3 border-2 border-[#1D9E75]/30 bg-[#F0FDF9]">
    <div className="flex items-center gap-2">
      <span>🪪</span>
      <span className="text-[.72rem] font-bold text-[#1D9E75] uppercase tracking-[.1em]">{label}</span>
      <span className="ml-auto text-[9px] font-bold bg-[#1D9E75] text-white px-2 py-0.5 rounded-full">Requis / Obrigatório</span>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <Label required>Type de document</Label>
        <Select value={typeVal} onChange={typeChange} error={typeError}>
          <option value="">-- Choisir / Escolher --</option>
          {ID_TYPES.map(t => <option key={t.code} value={t.code}>{t.label}</option>)}
        </Select>
        <FieldError msg={typeError} />
      </div>
      <div>
        <Label required>Numéro / Número</Label>
        <Input value={numVal} onChange={numChange} error={numError}
               placeholder="Ex: 12345678 ou 123456789-AO" className="font-mono font-bold" />
        <FieldError msg={numError} />
      </div>
    </div>
  </div>
)

/* ── Success screen ── */
const SuccessScreen = ({ back }) => (
  <div className="text-center py-12 px-6">
    <div className="w-16 h-16 rounded-full bg-[#E1F5EE] flex items-center justify-center mx-auto mb-4 text-3xl">✅</div>
    <h3 className="font-syne font-bold text-xl text-[#111827] mb-2">Compte créé avec succès !</h3>
    <p className="text-[.9rem] text-[#6B7280] mb-6 max-w-xs mx-auto">
      En attente d'approbation. Vous recevrez une confirmation par SMS/email.
    </p>
    <button onClick={back} className="px-6 py-2.5 rounded-full text-[.875rem] font-semibold border-2 border-[#1D9E75] text-[#1D9E75] hover:bg-[#E1F5EE] transition-all">
      Créer un autre compte
    </button>
  </div>
)

/* ════ STUDENT FORM ════ */
function StudentForm() {
  const INIT = { schoolId:'', firstName:'', lastName:'', docType:'', docNumber:'', phone:'', classLevel:'', country:'', password:'' }
  const [f, setF] = useState(INIT)
  const [errs, setErrs] = useState({})
  const [status, setStatus] = useState('idle')

  const upd = (k) => (e) => {
    const v = e.target.value
    setF(p => ({ ...p, [k]: v }))
    if (rules[k]) setErrs(p => ({ ...p, [k]: rules[k](v) }))
  }

  const validate = () => {
    const e = {}
    ;['schoolId','firstName','lastName','docType','docNumber','password'].forEach(k => {
      const msg = rules[k]?.(f[k] ?? '')
      if (msg) e[k] = msg
    })
    setErrs(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    setStatus('sending')
    try {
      await api.post('/v1/student/auth/register', {
        schoolId: f.schoolId,
        fullName: `${f.firstName} ${f.lastName}`,
        documentType: f.docType, documentNumber: f.docNumber,
        phone: f.phone, password: f.password,
        classLevel: f.classLevel, country: f.country,
      })
      setStatus('done')
    } catch (err) {
      setErrs(p => ({ ...p, api: err.response?.data?.message ?? 'Erreur serveur' }))
      setStatus('idle')
    }
  }

  if (status === 'done') return <SuccessScreen back={() => { setF(INIT); setErrs({}); setStatus('idle') }} />

  return (
    <div className="p-6 space-y-5">
      <div>
        <Label required>ID de l'école / ID da Escola</Label>
        <Input value={f.schoolId} onChange={upd('schoolId')} error={errs.schoolId} placeholder="Ex: EDK-2025-DAKAR" />
        <FieldError msg={errs.schoolId} />
      </div>

      <div>
        <SectionTitle emoji="👨‍🎓">Informations personnelles</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label required>Prénom / Nome</Label><Input value={f.firstName} onChange={upd('firstName')} error={errs.firstName} /><FieldError msg={errs.firstName} /></div>
          <div><Label required>Nom / Apelido</Label><Input value={f.lastName} onChange={upd('lastName')} error={errs.lastName} /><FieldError msg={errs.lastName} /></div>
          <div>
            <Label>Nationalité / País</Label>
            <Select value={f.country} onChange={upd('country')}>
              <option value="">-- Choisir --</option>
              {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
            </Select>
          </div>
          <div>
            <Label>Classe / Nível</Label>
            <Select value={f.classLevel} onChange={upd('classLevel')}>
              <option value="">-- Choisir --</option>
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label>Téléphone WhatsApp</Label>
            <Input value={f.phone} onChange={upd('phone')} error={errs.phone} type="tel" placeholder="+244 900 000 000" />
            <FieldError msg={errs.phone} />
          </div>
        </div>
      </div>

      <div>
        <SectionTitle emoji="🪪" color="#1D9E75">Identité de l'élève</SectionTitle>
        <IDField
          label="Numéro d'identité de l'élève"
          typeVal={f.docType}    typeChange={upd('docType')}    typeError={errs.docType}
          numVal={f.docNumber}   numChange={upd('docNumber')}   numError={errs.docNumber}
        />
        <p className="text-[.7rem] text-[#9CA3AF] mt-2 ml-1">Ce numéro est utilisé comme identifiant de connexion.</p>
      </div>

      <div>
        <SectionTitle emoji="🔐">Sécurité / Segurança</SectionTitle>
        <Label required>Mot de passe / Senha</Label>
        <Input value={f.password} onChange={upd('password')} error={errs.password} type="password" placeholder="Minimum 8 caractères" />
        <FieldError msg={errs.password} />
      </div>

      {errs.api && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[.8rem]">⚠️ {errs.api}</div>
      )}

      <button onClick={submit} disabled={status === 'sending'}
        className="w-full py-3.5 rounded-xl text-white font-bold text-[.95rem] transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background:'#1D9E75' }}>
        {status === 'sending' ? '⏳ Création en cours...' : '🚀 Créer mon compte élève'}
      </button>
    </div>
  )
}

/* ════ TUTOR FORM ════ */
function TutorForm() {
  const INIT = {
    schoolId:'',
    tutorFirstName:'', tutorLastName:'', tutorDocType:'', tutorDocNumber:'',
    tutorPhone:'', tutorEmail:'', tutorRelation:'', tutorPassword:'', tutorCountry:'',
    childFirstName:'', childLastName:'', childDocType:'', childDocNumber:'', childClass:'', childCountry:'',
  }
  const [f, setF] = useState(INIT)
  const [errs, setErrs] = useState({})
  const [status, setStatus] = useState('idle')

  const upd = (k) => (e) => {
    const v = e.target.value
    setF(p => ({ ...p, [k]: v }))
    if (rules[k]) setErrs(p => ({ ...p, [k]: rules[k](v) }))
  }

  const validate = () => {
    const e = {}
    const required = ['schoolId','tutorFirstName','tutorLastName','tutorDocType','tutorDocNumber','tutorPhone','tutorRelation','tutorPassword','childFirstName','childDocNumber']
    required.forEach(k => { const msg = rules[k]?.(f[k] ?? ''); if (msg) e[k] = msg })
    setErrs(e)
    return Object.keys(e).length === 0
  }

  const submit = async () => {
    if (!validate()) return
    setStatus('sending')
    try {
      await api.post('/v1/student/auth/register', {
        schoolId: f.schoolId,
        fullName: `${f.tutorFirstName} ${f.tutorLastName}`,
        documentType: f.tutorDocType, documentNumber: f.tutorDocNumber,
        phone: f.tutorPhone, email: f.tutorEmail, password: f.tutorPassword, relation: f.tutorRelation,
        country: f.tutorCountry,
        child: {
          fullName: `${f.childFirstName} ${f.childLastName}`,
          documentType: f.childDocType, documentNumber: f.childDocNumber,
          classLevel: f.childClass, country: f.childCountry,
        },
      })
      setStatus('done')
    } catch (err) {
      setErrs(p => ({ ...p, api: err.response?.data?.message ?? 'Erreur serveur' }))
      setStatus('idle')
    }
  }

  if (status === 'done') return <SuccessScreen back={() => { setF(INIT); setErrs({}); setStatus('idle') }} />

  return (
    <div className="p-6 space-y-5">
      <div>
        <Label required>ID de l'école / ID da Escola</Label>
        <Input value={f.schoolId} onChange={upd('schoolId')} error={errs.schoolId} placeholder="Ex: EDK-2025-DAKAR" />
        <FieldError msg={errs.schoolId} />
      </div>

      {/* ── TUTOR ── */}
      <div>
        <SectionTitle emoji="👪" color="#0B1E42">Informations du tuteur / parent</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div><Label required>Prénom / Nome</Label><Input value={f.tutorFirstName} onChange={upd('tutorFirstName')} error={errs.tutorFirstName} /><FieldError msg={errs.tutorFirstName} /></div>
          <div><Label required>Nom / Apelido</Label><Input value={f.tutorLastName} onChange={upd('tutorLastName')} error={errs.tutorLastName} /><FieldError msg={errs.tutorLastName} /></div>
          <div>
            <Label>Nationalité / País</Label>
            <Select value={f.tutorCountry} onChange={upd('tutorCountry')}>
              <option value="">-- Choisir --</option>
              {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
            </Select>
          </div>
          <div>
            <Label required>Relation</Label>
            <Select value={f.tutorRelation} onChange={upd('tutorRelation')} error={errs.tutorRelation}>
              <option value="">-- Choisir --</option>
              {RELATIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </Select>
            <FieldError msg={errs.tutorRelation} />
          </div>
          <div><Label required>Téléphone *</Label><Input value={f.tutorPhone} onChange={upd('tutorPhone')} error={errs.tutorPhone} type="tel" placeholder="+244 900 000 000" /><FieldError msg={errs.tutorPhone} /></div>
          <div><Label>Email tuteur</Label><Input value={f.tutorEmail} onChange={upd('tutorEmail')} type="email" placeholder="tuteur@email.com" /></div>
          <div className="sm:col-span-2"><Label required>Mot de passe / Senha</Label><Input value={f.tutorPassword} onChange={upd('tutorPassword')} error={errs.tutorPassword} type="password" placeholder="Min. 8 caractères" /><FieldError msg={errs.tutorPassword} /></div>
        </div>
        <IDField
          label="Numéro d'identité du tuteur"
          typeVal={f.tutorDocType}   typeChange={upd('tutorDocType')}   typeError={errs.tutorDocType}
          numVal={f.tutorDocNumber}  numChange={upd('tutorDocNumber')}  numError={errs.tutorDocNumber}
        />
      </div>

      {/* ── CHILD ── */}
      <div>
        <SectionTitle emoji="👨‍🎓">Informations de l'élève</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div><Label required>Prénom élève</Label><Input value={f.childFirstName} onChange={upd('childFirstName')} error={errs.childFirstName} /><FieldError msg={errs.childFirstName} /></div>
          <div><Label>Nom élève</Label><Input value={f.childLastName} onChange={upd('childLastName')} /></div>
          <div>
            <Label>Nationalité / País</Label>
            <Select value={f.childCountry} onChange={upd('childCountry')}>
              <option value="">-- Choisir --</option>
              {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
            </Select>
          </div>
          <div>
            <Label>Classe / Nível</Label>
            <Select value={f.childClass} onChange={upd('childClass')}>
              <option value="">-- Choisir --</option>
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
        </div>
        <IDField
          label="Numéro d'identité de l'élève"
          typeVal={f.childDocType}   typeChange={upd('childDocType')}   typeError={errs.childDocType}
          numVal={f.childDocNumber}  numChange={upd('childDocNumber')}  numError={errs.childDocNumber}
        />
      </div>

      {errs.api && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[.8rem]">⚠️ {errs.api}</div>
      )}

      <button onClick={submit} disabled={status === 'sending'}
        className="w-full py-3.5 rounded-xl text-white font-bold text-[.95rem] transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ background:'#0B1E42' }}>
        {status === 'sending' ? '⏳ Création en cours...' : '🚀 Créer le compte tuteur + élève'}
      </button>
    </div>
  )
}

/* ════ PAGE ════ */
export default function StudentRegisterPage() {
  const { t } = useLang()
  const s = t?.student ?? {}
  const [tab, setTab] = useState('student')
  const [mode, setMode] = useState('register')

  return (
    <div className="min-h-screen bg-[#F0F4FB] font-dm">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-8 py-3" style={{ background:'#0B1E42' }}>
        <Link to="/" className="font-syne font-bold text-[1.35rem] text-white no-underline">
          edu<span style={{ color:'#1D9E75' }}>kira</span><span style={{ color:'#1D9E75' }}>.</span>
        </Link>
        <Link to="/" className="text-white/40 hover:text-white text-[.78rem] no-underline transition-colors">← {t?.register?.back ?? 'Accueil'}</Link>
      </header>

      <div className="py-10 px-4">
        <div className="max-w-[720px] mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-xs font-bold uppercase tracking-wide"
                 style={{ background:'#E1F5EE', color:'#1D9E75', border:'1px solid rgba(29,158,117,0.25)' }}>
              🎓 Espace Élève / Tutor
            </div>
            <h1 className="font-syne font-extrabold text-[1.9rem] text-[#111827] mb-2">
              {mode === 'register' ? 'Créer votre compte' : 'Se connecter'}
            </h1>
            <p className="text-[.9rem] text-[#6B7280]">
              {mode === 'register'
                ? "Inscription sécurisée avec vérification d'identité"
                : 'Connectez-vous avec votre numéro de document'}
            </p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(11,30,66,0.1)] border border-[#E5E7EB]">
            <div className="h-1" style={{ background:'linear-gradient(90deg,#1D9E75,#0B1E42)' }} />

            {mode === 'register' ? (
              <>
                {/* Tabs */}
                <div className="flex border-b border-[#E5E7EB]">
                  {[['student', s.tab1 ?? '👨‍🎓 Je suis élève'], ['tutor', s.tab2 ?? '👪 Je suis parent / tuteur']].map(([val, label]) => (
                    <button key={val} onClick={() => setTab(val)}
                      className={`flex-1 py-4 text-[.875rem] font-bold transition-all border-b-2 ${
                        tab === val ? 'border-[#1D9E75] text-[#1D9E75] bg-[#F0FDF8]' : 'border-transparent text-[#6B7280] hover:text-[#1D9E75]'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* Info notice */}
                <div className="mx-6 mt-5 p-3 rounded-xl flex items-start gap-2.5 text-[.8rem]"
                     style={{ background:'#FFF7E6', border:'1px solid #FDE68A' }}>
                  <span className="text-xl flex-shrink-0">💡</span>
                  <div>
                    <strong className="text-[#92400E]">{s.idNotice ? '' : 'Numéro d\'identité requis :'}</strong>
                    <span className="text-[#78350F]">
                      {s.idNotice ?? " Munissez-vous de la pièce d'identité (BI, CNI, NINA...) de l'élève et du tuteur."}
                    </span>
                  </div>
                </div>

                {tab === 'student' ? <StudentForm /> : <TutorForm />}

                <div className="px-6 py-4 border-t border-[#E5E7EB] text-center" style={{ background:'#FAFAFA' }}>
                  <button onClick={() => setMode('login')}
                    className="text-[.82rem] font-semibold hover:underline bg-transparent border-none cursor-pointer"
                    style={{ color:'#1D9E75' }}>
                    Déjà un compte ? Se connecter →
                  </button>
                </div>
              </>
            ) : (
              /* Login mode */
              <LoginMode onBack={() => setMode('register')} />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-[.75rem] text-[#9CA3AF]">
            {['🔒 Données chiffrées SSL','🌍 Multi-pays','📱 Support WhatsApp'].map(b => <span key={b}>{b}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}

function LoginMode({ onBack }) {
  const [f, setF] = useState({ schoolId:'', documentNumber:'', password:'' })
  const [errs, setErrs] = useState({})
  const [status, setStatus] = useState('idle')

  const upd = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }))

  const submit = async () => {
    if (!f.schoolId || !f.documentNumber || !f.password) {
      setErrs({ api:'Remplissez tous les champs.' }); return
    }
    setStatus('sending')
    try {
      /* StudentLoginRequest: { documentNumber, password, schoolId: UUID } */
      const res = await api.post('/v1/student/auth/login', {
        documentNumber: f.documentNumber,
        password:       f.password,
        schoolId:       f.schoolId,
      })
      if (res.data?.data?.accessToken) {
        /* Store via authStore — not raw localStorage */
        useAuthStore.getState().loginStudent(res.data.data)
        setStatus('done')
      } else {
        setErrs({ api: res.data?.message ?? 'Identifiants invalides' })
        setStatus('idle')
      }
    } catch (err) {
      setErrs({ api: err.response?.data?.message ?? 'Identifiants invalides' })
      setStatus('idle')
    }
  }

  if (status === 'done') return <SuccessScreen back={onBack} />

  return (
    <div className="p-6 space-y-4">
      {errs.api && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-[.8rem]">⚠️ {errs.api}</div>}
      <div><Label required>ID de l'école</Label><Input value={f.schoolId} onChange={upd('schoolId')} placeholder="Ex: 97c55f47-71e1-..." /></div>
      <div><Label required>Numéro d'identité</Label><Input value={f.documentNumber} onChange={upd('documentNumber')} placeholder="Ex: 1234567890" /></div>
      <div><Label required>Mot de passe</Label><Input value={f.password} onChange={upd('password')} type="password" placeholder="••••••••" /></div>
      <button onClick={submit} disabled={status==='sending'}
        className="w-full py-3.5 rounded-xl text-white font-bold text-[.95rem] transition-all hover:opacity-90 disabled:opacity-60"
        style={{ background:'#1D9E75' }}>
        {status==='sending' ? '⏳...' : '🔓 Se connecter'}
      </button>
      <button onClick={onBack} className="w-full text-[.82rem] text-[#6B7280] hover:text-[#1D9E75] bg-transparent border-none cursor-pointer text-center mt-1">
        ← Créer un compte
      </button>
    </div>
  )
}
