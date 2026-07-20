import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { School, GraduationCap, Check, Rocket, CheckCircle2 } from 'lucide-react'
import { useLang } from '../hooks/useLang'
import { registerSchool } from '../lib/api'

const TOTAL = 4

const COUNTRIES = [
  { code:'SN', flag:'🇸🇳', name:'Sénégal / Senegal' },
  { code:'CI', flag:'🇨🇮', name:"Côte d'Ivoire" },
  { code:'ML', flag:'🇲🇱', name:'Mali' },
  { code:'BF', flag:'🇧🇫', name:'Burkina Faso' },
  { code:'GN', flag:'🇬🇳', name:'Guinée / Guinea' },
  { code:'TG', flag:'🇹🇬', name:'Togo' },
  { code:'BJ', flag:'🇧🇯', name:'Bénin / Benin' },
  { code:'CM', flag:'🇨🇲', name:'Cameroun / Cameroon' },
  { code:'MG', flag:'🇲🇬', name:'Madagascar' },
  { code:'CD', flag:'🇨🇩', name:'RD Congo / DRC' },
  { code:'AO', flag:'🇦🇴', name:'Angola' },
  { code:'MZ', flag:'🇲🇿', name:'Moçambique' },
  { code:'GW', flag:'🇬🇼', name:'Guinée-Bissau' },
  { code:'CV', flag:'🇨🇻', name:'Cap-Vert / Cape Verde' },
  { code:'MR', flag:'🇲🇷', name:'Mauritanie / Mauritania' },
  { code:'NE', flag:'🇳🇪', name:'Niger' },
  { code:'TD', flag:'🇹🇩', name:'Tchad / Chad' },
  { code:'MA', flag:'🇲🇦', name:'Maroc / Morocco' },
  { code:'DZ', flag:'🇩🇿', name:'Algérie / Algeria' },
  { code:'TN', flag:'🇹🇳', name:'Tunisie / Tunisia' },
  { code:'OTHER', flag:'🌍', name:'Autre / Other' },
]

export default function RegisterPage() {
  const { lang, setLang, t, isRTL } = useLang()
  const r = t.register
  const [searchParams] = useSearchParams()

  const [theme, setTheme]   = useState('escola')
  const [picked, setPicked] = useState(false)
  const [step, setStep]     = useState(1)
  const [plan, setPlan]     = useState(searchParams.get('plan')?.toUpperCase() || 'PRO')
  const [toast, setToast]   = useState({ show:false, msg:'', type:'success' })
  const [done, setDone]     = useState(false)
  const [submitting, setSub] = useState(false)

  const [f, setF] = useState({
    schoolName:'', schoolType:'', country:'', city:'', phone:'', schoolEmail:'',
    estimatedStudents:'', defaultLanguage:'fr',
    adminFirstName:'', adminLastName:'', adminRole:'', adminPhone:'', adminEmail:'', adminPassword:'',
    adminIdType:'', adminIdNumber:'',
    groupMode:'NONE', groupName:'', groupRootCode:'',
  })
  const [schoolCode, setSchoolCode] = useState('')

  // Lê ?theme= da URL
  useEffect(() => {
    const th = searchParams.get('theme')
    if (th === 'uni' || th === 'escola') { setTheme(th); setPicked(true) }
  }, [])

  const upd = (key, val) => setF(prev => ({ ...prev, [key]: val }))

  const showToast = (msg, type = 'error') => {
    setToast({ show:true, msg, type })
    setTimeout(() => setToast(t => ({ ...t, show:false })), 4000)
  }

  const validate = () => {
    if (step === 1) {
      if (!f.schoolName || !f.schoolType || !f.country || !f.city || !f.phone || !f.schoolEmail) {
        showToast(r.errRequired); return false
      }
      if (f.groupMode === 'EXISTING_GROUP' && !f.groupRootCode.trim()) {
        showToast(r.errGroupCode); return false
      }
    }
    if (step === 2) {
      if (!f.adminFirstName || !f.adminLastName || !f.adminRole || !f.adminPhone || !f.adminEmail || !f.adminPassword || f.adminPassword.length < 8) {
        showToast(r.errRequired); return false
      }
    }
    return true
  }

  const next = () => { if (validate()) setStep(s => Math.min(s+1, TOTAL)) }
  const prev = () => setStep(s => Math.max(s-1, 1))

  const submit = async () => {
    setSub(true)
    try {
      const res = await registerSchool({ ...f, plan, defaultLanguage: f.defaultLanguage })
      setSchoolCode(res?.schoolCode ?? '')
      setDone(true)
    } catch (e) {
      showToast(e.message || r.errApi)
    } finally { setSub(false) }
  }

  const progress = (step / TOTAL) * 100

  /* ── Theme colours ── */
  // eslint-disable-next-line no-unused-vars
  const primary = theme === 'uni' ? '#1B4332' : '#1249A0'
  const sidebarBg = theme === 'uni' ? '#0F1F17' : '#0B1E42'

  const inputCls = `w-full px-3 py-[.6rem] border-[1.5px] border-[#E5E7EB] rounded-[7px] text-[.85rem] font-dm text-[#111827] bg-[#FAFAFA] outline-none transition-all focus:border-[#1D9E75] focus:bg-white placeholder-[#D1D5DB]`
  const selectCls = inputCls
  const labelCls = `text-[.7rem] font-bold text-[#6B7280] uppercase tracking-[.06em] mb-[.28rem] block`

  /* ═══ PICKER ═══ */
  if (!picked) {
    return (
      <div className="min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Topbar */}
        <header className="flex items-center justify-between px-8 py-3 sticky top-0 z-50" style={{ background: sidebarBg }}>
          <Link to="/" className="font-syne font-bold text-[1.35rem] text-white no-underline">
            edu<span className="text-[#1D9E75]">kira</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {['fr','en','ar'].map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-3 py-1 border rounded text-[.72rem] font-bold cursor-pointer font-dm transition-all ${lang===l ? 'bg-[#1D9E75] border-[#1D9E75] text-white' : 'border-white/15 text-white/50 bg-transparent hover:text-white'}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <Link to="/" className="text-[.78rem] text-white/45 hover:text-white no-underline transition-colors">← {r.back}</Link>
          </div>
        </header>

        {/* Cards */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12"
          style={{ background:'linear-gradient(160deg,#060C18 0%,#0B1826 55%,#0F1F12 100%)' }}>
          <p className="text-[.7rem] font-bold uppercase tracking-[.12em] text-white/28 mb-[.9rem]">{r.pickerEye}</p>
          <h1 className="font-serif text-[clamp(1.8rem,4vw,2.7rem)] font-semibold text-white text-center mb-2">{r.pickerTitle}</h1>
          <p className="text-[.85rem] text-white/32 text-center mb-10">{r.pickerSub}</p>
          <div className="flex flex-col sm:flex-row gap-5 items-center justify-center w-full max-w-[480px]">
            {/* Escola card */}
            <button onClick={() => { setTheme('escola'); setPicked(true) }}
              className="w-full sm:w-[210px] rounded-[14px] overflow-hidden cursor-pointer border border-white/7 bg-[#0E1826] hover:-translate-y-1 hover:border-[#1D9E75] hover:shadow-[0_12px_36px_rgba(0,0,0,0.45),0_0_0_1px_#1D9E75] transition-all text-left">
              <div className="h-[110px] flex items-center justify-center text-[2.4rem]"
                style={{ background:'linear-gradient(160deg,#0B1E42,#1249A0)' }}><School size={32} className="text-white" /></div>
              <div className="p-4">
                <div className="text-[.83rem] font-bold text-white mb-1">{r.escola}</div>
                <div className="text-[.72rem] text-white/32 mb-2">{r.escolaDesc}</div>
                <span className="inline-block px-3 py-[.18rem] rounded-full text-[.68rem] font-bold bg-[rgba(18,73,160,0.3)] text-[#93C5FD]">DM Sans · Bleu</span>
              </div>
            </button>

            <div className="text-white/18 text-[.78rem]">{r.or}</div>

            {/* Uni card */}
            <button onClick={() => { setTheme('uni'); setPicked(true) }}
              className="w-full sm:w-[210px] rounded-[14px] overflow-hidden cursor-pointer border border-white/7 bg-[#0E1826] hover:-translate-y-1 hover:border-[#1D9E75] hover:shadow-[0_12px_36px_rgba(0,0,0,0.45),0_0_0_1px_#1D9E75] transition-all text-left">
              <div className="h-[110px] flex items-center justify-center text-[2.4rem]"
                style={{ background:'linear-gradient(160deg,#0F1F17,#1B4332)' }}><GraduationCap size={32} className="text-white" /></div>
              <div className="p-4">
                <div className="text-[.83rem] font-bold text-white mb-1">{r.uni}</div>
                <div className="text-[.72rem] text-white/32 mb-2">{r.uniDesc}</div>
                <span className="inline-block px-3 py-[.18rem] rounded-full text-[.68rem] font-bold bg-[rgba(27,67,50,0.4)] text-[#86EFAC]">Cormorant · Vert</span>
              </div>
            </button>
          </div>
        </main>
      </div>
    )
  }

  /* ═══ FORM ═══ */
  return (
    <div className="min-h-screen font-dm" style={{ background: theme==='uni' ? '#F0F5F2' : '#F0F4FB' }} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Topbar */}
      <header className="flex items-center justify-between px-8 py-3 sticky top-0 z-50" style={{ background: sidebarBg }}>
        <Link to="/" className="font-syne font-bold text-[1.35rem] text-white no-underline">
          edu<span className="text-[#1D9E75]">kira</span>
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={() => { setTheme(t => t==='escola'?'uni':'escola') }}
            className="px-3 py-1 rounded-full border border-white/15 text-[.72rem] font-bold text-white/55 bg-transparent cursor-pointer hover:bg-white/8 hover:text-white transition-all">
            {r.toggle}
          </button>
          <div className="flex gap-1">
            {['fr','en','ar'].map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-3 py-1 border rounded text-[.72rem] font-bold cursor-pointer font-dm transition-all ${lang===l ? 'bg-[#1D9E75] border-[#1D9E75] text-white' : 'border-white/15 text-white/50 bg-transparent hover:text-white'}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <Link to="/" className="text-[.78rem] text-white/45 hover:text-white no-underline transition-colors">← {r.back}</Link>
        </div>
      </header>

      {/* Form card */}
      <div className="py-8 px-4">
        <div className="max-w-[760px] mx-auto">
          <div className="bg-white rounded-[14px] overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.07)] border border-[#E5E7EB]">

            {/* Card header */}
            <div className="flex items-center justify-between px-[1.4rem] py-4" style={{ background:'#1D9E75' }}>
              <div className="flex items-center gap-3">
                <div className="w-[30px] h-[30px] rounded-lg bg-white/18 flex items-center justify-center text-base">
                  {theme==='uni' ? <GraduationCap size={16} className="text-white" /> : <School size={16} className="text-white" />}
                </div>
                <div>
                  <div className="text-[.9rem] font-bold text-white">{theme==='uni' ? r.uni : r.escola}</div>
                  <div className="text-[.72rem] text-white/70">{r.headerSub}</div>
                </div>
              </div>
              <div className="text-[.75rem] font-bold text-white/80">{step} / {TOTAL}</div>
            </div>

            {/* Stepper */}
            <div className="flex items-center px-[1.4rem] py-3 bg-white border-b border-[#E5E7EB]">
              {r.steps.map((label, i) => {
                const n = i + 1
                const state = n < step ? 'done' : n === step ? 'active' : 'pending'
                return (
                  <div key={label} className="flex items-center flex-1">
                    <div className={`step-num ${state}`}>{state==='done' ? <Check size={12} strokeWidth={3} /> : n}</div>
                    <span className={`text-[.75rem] font-semibold ml-[.45rem] ${state==='active' ? 'text-[#1D9E75]' : state==='done' ? 'text-[#0F6E56]' : 'text-[#9CA3AF]'} hidden sm:block`}>{label}</span>
                    {i < r.steps.length-1 && (
                      <div className={`flex-1 h-0.5 rounded mx-[.3rem] ${n < step ? 'bg-[#1D9E75]' : 'bg-[#E5E7EB]'}`} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Progress bar */}
            <div className="h-[3px] bg-[#E1F5EE]">
              <div className="h-full bg-[#1D9E75] transition-all duration-300" style={{ width:`${progress}%` }} />
            </div>

            {/* Panels */}
            {!done ? (
              <>
                {/* Step 1 — Institution */}
                {step === 1 && (
                  <div className="p-[1.4rem]">
                    <p className="text-[.78rem] font-bold text-[#1D9E75] uppercase tracking-[.08em] mb-[1.1rem]">{r.s1}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[.9rem]">
                      <div className="sm:col-span-2">
                        <label className={labelCls}>{r.schoolName} <span className="text-red-500">*</span></label>
                        <input value={f.schoolName} onChange={e=>upd('schoolName',e.target.value)} placeholder="Ex: Lycée Moderne de Dakar" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>{r.schoolType} <span className="text-red-500">*</span></label>
                        <select value={f.schoolType} onChange={e=>upd('schoolType',e.target.value)} className={selectCls}>
                          <option value="">--</option>
                          <option value="LYCEE">Lycée / High School</option>
                          <option value="COLLEGE">Collège / Middle School</option>
                          <option value="UNIVERSITY">Université / University</option>
                          <option value="INSTITUTE">Institut / Institute</option>
                          <option value="PRIMARY">École primaire / Primary School</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>{r.country} <span className="text-red-500">*</span></label>
                        <select value={f.country} onChange={e=>upd('country',e.target.value)} className={selectCls}>
                          <option value="">--</option>
                          {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>{r.city} <span className="text-red-500">*</span></label>
                        <input value={f.city} onChange={e=>upd('city',e.target.value)} placeholder="Ex: Dakar" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>{r.phone} <span className="text-red-500">*</span></label>
                        <input value={f.phone} onChange={e=>upd('phone',e.target.value)} type="tel" placeholder="+221 77 000 00 00" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>{r.schoolEmail} <span className="text-red-500">*</span></label>
                        <input value={f.schoolEmail} onChange={e=>upd('schoolEmail',e.target.value)} type="email" placeholder="contact@ecole.sn" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>{r.students}</label>
                        <select value={f.estimatedStudents} onChange={e=>upd('estimatedStudents',e.target.value)} className={selectCls}>
                          <option value="">--</option>
                          {['1-50','51-200','201-500','501-1000','1000+'].map(v=><option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>{r.deflang}</label>
                        <select value={f.defaultLanguage} onChange={e=>upd('defaultLanguage',e.target.value)} className={selectCls}>
                          <option value="fr">🇫🇷 Français</option>
                          <option value="en">🇬🇧 English</option>
                          <option value="ar">🇸🇦 العربية</option>
                          <option value="pt">🇵🇹 Português</option>
                        </select>
                      </div>
                    </div>

                    {/* Vínculo com grupo escolar */}
                    <div className="mt-[1.1rem] pt-[1.1rem] border-t border-[#E5E7EB]">
                      <label className={labelCls}>{r.groupModeLabel}</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[.6rem] mt-[.4rem]">
                        {[
                          { id:'NONE',           label:r.groupModeNone },
                          { id:'NEW_GROUP',      label:r.groupModeNew },
                          { id:'EXISTING_GROUP', label:r.groupModeExisting },
                        ].map(opt => (
                          <button key={opt.id} type="button" onClick={() => upd('groupMode', opt.id)}
                            className={`text-left border-[1.5px] rounded-[8px] px-3 py-[.6rem] text-[.8rem] font-semibold cursor-pointer transition-all ${
                              f.groupMode === opt.id
                                ? 'border-[#1D9E75] bg-[#E1F5EE] text-[#0F6E56]'
                                : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#1D9E75]'
                            }`}>
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      {f.groupMode === 'NEW_GROUP' && (
                        <div className="mt-[.9rem]">
                          <label className={labelCls}>{r.groupNameLabel}</label>
                          <input value={f.groupName} onChange={e=>upd('groupName',e.target.value)}
                                 placeholder={r.groupNamePh} className={inputCls} />
                          <span className="text-[.7rem] text-[#6B7280] mt-[.28rem] block">{r.groupNewHint}</span>
                        </div>
                      )}

                      {f.groupMode === 'EXISTING_GROUP' && (
                        <div className="mt-[.9rem]">
                          <label className={labelCls}>{r.groupRootCodeLabel} <span className="text-red-500">*</span></label>
                          <input value={f.groupRootCode} onChange={e=>upd('groupRootCode',e.target.value.toUpperCase())}
                                 placeholder={r.groupRootCodePh} className={`${inputCls} font-mono`} />
                          <span className="text-[.7rem] text-[#6B7280] mt-[.28rem] block">{r.groupExistingHint}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2 — Admin */}
                {step === 2 && (
                  <div className="p-[1.4rem]">
                    <p className="text-[.78rem] font-bold text-[#1D9E75] uppercase tracking-[.08em] mb-[1.1rem]">{r.s2}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[.9rem]">
                      <div>
                        <label className={labelCls}>{r.adminFirst} <span className="text-red-500">*</span></label>
                        <input value={f.adminFirstName} onChange={e=>upd('adminFirstName',e.target.value)} placeholder="Ex: Mamadou" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>{r.adminLast} <span className="text-red-500">*</span></label>
                        <input value={f.adminLastName} onChange={e=>upd('adminLastName',e.target.value)} placeholder="Ex: Diallo" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>{r.adminRole} <span className="text-red-500">*</span></label>
                        <select value={f.adminRole} onChange={e=>upd('adminRole',e.target.value)} className={selectCls}>
                          <option value="">--</option>
                          {['Director(a)','Proviseur','Recteur','Administrateur','Secretário(a)','Autre'].map(v=><option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>{r.adminPhone} <span className="text-red-500">*</span></label>
                        <input value={f.adminPhone} onChange={e=>upd('adminPhone',e.target.value)} type="tel" placeholder="+221 77 000 00 00" className={inputCls} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>{r.adminEmail} <span className="text-red-500">*</span></label>
                        <input value={f.adminEmail} onChange={e=>upd('adminEmail',e.target.value)} type="email" placeholder="admin@ecole.sn" className={inputCls} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>{r.adminPwd} <span className="text-red-500">*</span></label>
                        <input value={f.adminPassword} onChange={e=>upd('adminPassword',e.target.value)} type="password" placeholder="••••••••" minLength={8} className={inputCls} />
                        <span className="text-[.7rem] text-[#6B7280] mt-[.22rem] block">{r.pwdHint}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>{r.idDoc}</label>
                        <div className="grid grid-cols-[180px_1fr] gap-[.9rem]">
                          <select value={f.adminIdType} onChange={e=>upd('adminIdType',e.target.value)} className={selectCls}>
                            <option value="">-- {isRTL ? 'النوع' : 'Type'} --</option>
                            {['BI','NIF','PASSPORT','CNIB','NINA','CIN','NIC','OTHER'].map(v=><option key={v} value={v}>{v}</option>)}
                          </select>
                          <input value={f.adminIdNumber} onChange={e=>upd('adminIdNumber',e.target.value)} placeholder={isRTL ? 'رقم الوثيقة' : 'Nº du document'} className={inputCls} />
                        </div>
                        <span className="text-[.7rem] text-[#6B7280] mt-[.22rem] block">{r.idHint}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3 — Plan */}
                {step === 3 && (
                  <div className="p-[1.4rem]">
                    <p className="text-[.7rem] font-bold text-[#6B7280] uppercase tracking-[.08em] mb-[.9rem]">{r.s3}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-[.85rem]">
                     {['STARTER','PRO','ENTERPRISE'].map(pid => {
                        const planData = t.pricing.plans.find(p=>p.id===pid)
                        const feats = r.planFeats?.[pid] || []
                        return (
                          <button key={pid} onClick={() => setPlan(pid)}
                            className={`text-left border-[1.5px] rounded-[10px] p-4 cursor-pointer transition-all relative bg-white ${plan===pid ? 'border-[#1D9E75] bg-[#E1F5EE]' : 'border-[#E5E7EB] hover:border-[#1D9E75]'}`}>
                            {pid==='PRO' && (
                              <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-[#1D9E75] text-white text-[.65rem] font-bold px-3 py-[.2rem] rounded-b-lg whitespace-nowrap">
                                {r.popular}
                              </div>
                            )}
                            <div className="text-[.85rem] font-bold text-[#111827] mb-[.3rem]">{planData?.name || pid}</div>
                            <div className="text-[1.4rem] font-bold text-[#1249A0] leading-none mb-[.7rem]">
                              {planData?.price} <small className="text-[.75rem] font-normal text-[#6B7280]">{planData?.period}</small>
                            </div>
                            <div className="flex flex-col gap-[.3rem]">
                              {feats.map(f => (
                                <div key={f} className="text-[.75rem] text-[#111827] flex items-center gap-[.4rem]">
                                  <span className="w-[5px] h-[5px] rounded-full bg-[#1D9E75] flex-shrink-0" />
                                  {f}
                                </div>
                              ))}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Step 4 — Confirm */}
                {step === 4 && (
                  <div className="p-[1.4rem]">
                    <p className="text-[.78rem] font-bold text-[#1D9E75] uppercase tracking-[.08em] mb-[1.1rem]">{r.s4}</p>
                    {[
                      { label: r.institutionLabel, rows: [[r.schoolName, f.schoolName],[r.schoolType, f.schoolType],[r.country, f.country],[r.city, f.city],[r.schoolEmail, f.schoolEmail]] },
                      { label: r.adminLabel,       rows: [[r.adminFirst+' '+r.adminLast, f.adminFirstName+' '+f.adminLastName],[r.adminRole, f.adminRole],['Email', f.adminEmail]] },
                      { label: r.planLabel,        rows: [['Plan', plan]] },
                    ].map(section => (
                      <div key={section.label} className="mb-5">
                        <div className="text-[.7rem] font-bold text-[#6B7280] uppercase tracking-[.08em] mb-[.6rem] pb-[.4rem] border-b border-[#E5E7EB]">{section.label}</div>
                        {section.rows.map(([k, v]) => v ? (
                          <div key={k} className="flex justify-between py-[.3rem] text-[.82rem]">
                            <span className="text-[#6B7280]">{k}</span>
                            <span className="font-semibold text-[#111827] text-right max-w-[60%]">{v}</span>
                          </div>
                        ) : null)}
                      </div>
                    ))}
                  </div>
                )}

                {/* Nav buttons */}
                <div className="flex items-center justify-between px-[1.4rem] py-4 border-t border-[#E5E7EB] bg-[#FAFAFA]">
                  <button onClick={prev} style={{ visibility: step > 1 ? 'visible' : 'hidden' }}
                    className="px-5 py-[.6rem] border-[1.5px] border-[#E5E7EB] rounded-[8px] bg-white text-[.83rem] font-semibold text-[#6B7280] cursor-pointer hover:border-[#1D9E75] hover:text-[#1D9E75] transition-all">
                    ← {r.prev}
                  </button>
                  <span className="text-[.75rem] text-[#6B7280]">{step} / {TOTAL}</span>
                  {step < TOTAL ? (
                    <button onClick={next}
                      className="flex items-center gap-[.4rem] px-[1.6rem] py-[.6rem] border-none rounded-[8px] bg-[#1D9E75] text-white text-[.83rem] font-bold cursor-pointer hover:bg-[#0F6E56] hover:-translate-y-px transition-all">
                      {r.next} →
                    </button>
                  ) : (
                    <button onClick={submit} disabled={submitting}
                      className="flex items-center gap-[.45rem] px-7 py-[.6rem] border-none rounded-[8px] bg-[#1D9E75] text-white text-[.85rem] font-bold cursor-pointer hover:bg-[#0F6E56] hover:-translate-y-px transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                      {submitting ? r.submitting : (<><Rocket size={15} className="inline -mt-0.5 mr-1.5" />{r.submit}</>)}
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* Success screen */
              <div className="text-center py-12 px-8">
                <CheckCircle2 size={56} className="mx-auto mb-4 text-[#1D9E75]" />
                <div className="font-syne font-bold text-[1.5rem] text-[#111827] mb-2">{r.successTitle}</div>
                <div className="text-[.9rem] text-[#6B7280] mb-2 max-w-[400px] mx-auto">{r.successSub}</div>
                {schoolCode ? (
                  <div className="inline-block bg-[#F4F7F5] border border-[#E5E7EB] rounded-[8px] px-4 py-2.5 mb-6">
                    <div className="text-[.68rem] font-bold text-[#6B7280] uppercase tracking-[.06em] mb-[.2rem]">{r.yourSchoolCode}</div>
                    <div className="font-mono font-bold text-[1.1rem] text-[#0F6E56] tracking-wide">{schoolCode}</div>
                  </div>
                ) : <div className="mb-6" />}
                <div>
                  <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D9E75] text-white rounded-[8px] font-bold text-[.85rem] no-underline hover:bg-[#0F6E56] transition-colors">
                    ← {r.goHome}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-[1.4rem] py-[.85rem] rounded-[9px] text-[.85rem] font-semibold shadow-lg z-[300] max-w-[420px] w-[calc(100%-2rem)] text-center text-white ${toast.type==='success' ? 'bg-[#1D9E75]' : 'bg-[#DC2626]'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
