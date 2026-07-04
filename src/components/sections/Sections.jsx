import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../hooks/useLang'
import { useReveal } from '../../hooks/useReveal'
import { createLead } from '../../lib/api'

/* ═══ PROBLEM / SOLUTION ═══ */
export function ProblemSolution() {
  const { t, isRTL } = useLang(); const r = t.ps
  const ref = useReveal()
  return (
    <section id="problem-solution" ref={ref} className="reveal max-w-[1200px] mx-auto px-10 lg:px-20 py-24">
      <div className="inline-block text-xs font-bold text-[#1D9E75] uppercase tracking-[2px] mb-[14px]">{r.label}</div>
      <h2 className="font-syne font-extrabold text-[clamp(30px,3vw,46px)] leading-[1.1] tracking-[-1px] mb-4 max-w-[700px]">{r.title}</h2>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 mt-8 ${isRTL ? 'text-right' : ''}`}>
        {/* Problem */}
        <div className="bg-white p-8 rounded-[14px] border border-[#E5EDE9]">
          <h3 className="font-syne text-xl font-bold mb-5">{r.probTitle}</h3>
          <ul className="list-none space-y-3">
            {r.prob.map((item) => (
              <li key={item} className={`text-[15px] text-[#6B7280] relative pl-6 leading-[1.5] ${isRTL ? 'pr-6 pl-0' : ''}`}>
                <span className={`absolute ${isRTL ? 'right-0' : 'left-0'} text-red-500 font-bold`}>✗</span>{item}
              </li>
            ))}
          </ul>
        </div>
        {/* Solution */}
        <div className="bg-white p-8 rounded-[14px] border border-[#E5EDE9]">
          <h3 className="font-syne text-xl font-bold mb-5">{r.solTitle}</h3>
          <ul className="list-none space-y-3">
            {r.sol.map((item) => (
              <li key={item} className={`text-[15px] text-[#6B7280] relative pl-6 leading-[1.5] ${isRTL ? 'pr-6 pl-0' : ''}`}>
                <span className={`absolute ${isRTL ? 'right-0' : 'left-0'} text-[#1D9E75] font-bold`}>✓</span>{item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ═══ FEATURES ═══ */
export function Features() {
  const { t } = useLang(); const f = t.features
  const ref = useReveal()
  return (
    <section id="features" ref={ref} className="reveal bg-[#F8FAF9] py-24 px-10 lg:px-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="inline-block text-xs font-bold text-[#1D9E75] uppercase tracking-[2px] mb-[14px]">{f.label}</div>
        <h2 className="font-syne font-extrabold text-[clamp(30px,3vw,46px)] leading-[1.1] tracking-[-1px] mb-4 max-w-[700px]">{f.title}</h2>
        <p className="text-[17px] text-[#6B7280] leading-[1.6] max-w-[700px] mb-12">{f.sub}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {f.items.map((item) => (
            <FeatureCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ item }) {
  const ref = useReveal()
  return (
    <div ref={ref} className="reveal bg-white p-8 rounded-[14px] border border-[#E5EDE9] shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-[#1D9E75] transition-all">
      <div className="text-[36px] mb-[18px]">{item.ico}</div>
      <div className="font-syne font-bold text-xl mb-[10px]">{item.title}</div>
      <div className="text-[15px] text-[#6B7280] leading-[1.6] mb-[18px]">{item.desc}</div>
      <div className="flex flex-wrap gap-2">
        {item.tags.map(tag => (
          <span key={tag} className="bg-[#E1F5EE] text-[#0F6E56] text-[11px] font-semibold px-3 py-1 rounded-full">{tag}</span>
        ))}
      </div>
    </div>
  )
}

/* ═══ INTEGRATIONS ═══ */
export function Integrations() {
  const { t } = useLang(); const g = t.integrations
  const ref = useReveal()
  return (
    <section id="integrations" ref={ref} className="reveal bg-[#0B1E42] py-24 px-10 lg:px-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="inline-block text-xs font-bold text-[#F59E0B] uppercase tracking-[2px] mb-[14px]">{g.label}</div>
        <h2 className="font-syne font-extrabold text-[clamp(30px,3vw,46px)] leading-[1.1] tracking-[-1px] text-white mb-4 max-w-[700px]">{g.title}</h2>
        <p className="text-[17px] text-white/75 leading-[1.6] max-w-[700px] mb-12">{g.sub}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {g.groups.map((group) => (
            <div key={group.label}>
              <div className="text-[11px] font-bold uppercase tracking-[2px] text-white/60 mb-4">{group.label}</div>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div key={item.name} className="integ-card">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-xl flex-shrink-0" style={{ background: item.bg }}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white">{item.name}</div>
                      <div className="text-[12px] text-white/70 mt-0.5">{item.desc}</div>
                    </div>
                    <span className="text-[10px] font-bold px-[10px] py-1 rounded-full bg-[#1D9E75]/25 text-[#6EE7B7] border border-[#1D9E75]/30 whitespace-nowrap flex-shrink-0">
                      {item.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══ TESTIMONIALS ═══ */
export function Testimonials() {
  const { t } = useLang(); const s = t.testimonials
  const ref = useReveal()
  return (
    <section id="social-proof" ref={ref} className="reveal bg-[#F8FAF9] py-24 px-10 lg:px-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="inline-block text-xs font-bold text-[#1D9E75] uppercase tracking-[2px] mb-[14px]">{s.label}</div>
        <h2 className="font-syne font-extrabold text-[clamp(30px,3vw,46px)] leading-[1.1] tracking-[-1px] mb-12 max-w-[700px]">{s.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-12">
          {s.items.map((item) => (
            <div key={item.name} className="bg-white p-8 rounded-[14px] border border-[#E5EDE9] shadow-sm">
              <p className="text-[16px] leading-[1.7] italic mb-5">« {item.quote} »</p>
              <div className="font-bold text-[#111827]">{item.name}</div>
              <div className="text-[13px] text-[#6B7280] mt-1">{item.role}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-around items-center bg-[#1D9E75] text-white rounded-[14px] px-8 py-10 gap-6">
          {s.stats.map((st) => (
            <div key={st.lbl} className="text-center">
              <div className="font-syne font-extrabold text-[42px] leading-none">{st.val}</div>
              <div className="text-[15px] mt-2 opacity-85">{st.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══ HOW IT WORKS ═══ */
export function HowItWorks() {
  const { t } = useLang(); const h = t.how
  const ref = useReveal()
  return (
    <section id="how-it-works" ref={ref} className="reveal max-w-[1200px] mx-auto px-10 lg:px-20 py-24">
      <div className="inline-block text-xs font-bold text-[#1D9E75] uppercase tracking-[2px] mb-[14px]">{h.label}</div>
      <h2 className="font-syne font-extrabold text-[clamp(30px,3vw,46px)] leading-[1.1] tracking-[-1px] mb-12 max-w-[700px]">{h.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        {h.steps.map((step) => (
          <div key={step.n} className="bg-white p-8 rounded-[14px] border border-[#E5EDE9] shadow-sm text-center">
            <div className="w-[60px] h-[60px] bg-[#E1F5EE] text-[#0F6E56] rounded-full flex items-center justify-center font-syne font-extrabold text-[28px] mx-auto mb-5">{step.n}</div>
            <h3 className="font-syne font-bold text-[20px] mb-[10px]">{step.title}</h3>
            <p className="text-[15px] text-[#6B7280] leading-[1.6]">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ═══ PRICING ═══ */
export function Pricing() {
  const { t } = useLang(); const p = t.pricing
  const ref = useReveal()
  return (
    <section id="pricing" ref={ref} className="reveal py-24 px-10 lg:px-20" style={{ background:'linear-gradient(135deg,#f0faf5 0%,#ffffff 55%,#f0f4ff 100%)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="inline-block text-xs font-bold text-[#1D9E75] uppercase tracking-[2px] mb-[14px]">{p.label}</div>
        <h2 className="font-syne font-extrabold text-[clamp(30px,3vw,46px)] leading-[1.1] tracking-[-1px] mb-4 max-w-[700px]">{p.title}</h2>
        <p className="text-[17px] text-[#6B7280] leading-[1.6] max-w-[700px] mb-12">{p.sub}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-start">
          {p.plans.map((plan) => (
            <PriceCard key={plan.id} plan={plan} popular={p.popular} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PriceCard({ plan, popular }) {
  return (
    <div className={`bg-white p-10 rounded-[14px] flex flex-col relative transition-all border ${plan.featured ? 'border-[#1D9E75] shadow-md -translate-y-2.5' : 'border-[#E5EDE9] shadow-sm'}`}>
      {plan.featured && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-[#1D9E75] text-white text-[11px] font-bold px-4 py-1 rounded-b-[10px]">
          {popular}
        </div>
      )}
      <h3 className="font-syne font-bold text-[26px] mb-1">{plan.name}</h3>
      <p className="text-[14px] text-[#6B7280] mb-[18px]">{plan.desc}</p>
      <div className="font-syne font-extrabold text-[38px] leading-none mb-6">
        <span className="text-[20px] align-super mr-1">{plan.price.replace(/\d.*/,'')}</span>
        {plan.price.replace(/[^0-9]/,'')}
        <span className="text-[15px] font-normal text-[#6B7280]">{plan.period}</span>
      </div>
      <ul className="list-none flex-1 space-y-[10px] mb-7">
        {plan.feats.map(f => (
          <li key={f} className="text-[15px] relative pl-[22px]">
            <span className="absolute left-0 text-[#1D9E75] font-bold">✓</span>{f}
          </li>
        ))}
      </ul>
      <Link to={`/register?plan=${plan.id}`}
        className="w-full flex justify-center items-center px-[30px] py-[14px] bg-[#1D9E75] text-white text-[15px] font-semibold rounded-full hover:bg-[#0F6E56] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(29,158,117,0.32)] transition-all no-underline">
        {plan.name} →
      </Link>
    </div>
  )
}

/* ═══ CONTACT / DEMO ═══ */
export function Contact() {
  const { t, lang, isRTL } = useLang(); const c = t.contact
  const ref = useReveal()
  const [form, setForm]     = useState({ name:'', email:'', school:'', phone:'', message:'' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [lastSubmit, setLastSubmit] = useState(0)

  const REQUIRED_MSGS = {
    name:   { fr:'Nom requis',      en:'Name required',    ar:'الاسم مطلوب',       pt:'Nome obrigatório' },
    email:  { fr:'Email invalide',  en:'Invalid email',    ar:'بريد غير صالح',     pt:'Email inválido' },
    school: { fr:'École requise',   en:'School required',  ar:'المدرسة مطلوبة',    pt:'Escola obrigatória' },
  }

  const validate = (name, value) => {
    let err = ''
    if (name === 'name'   && !value.trim())                 err = REQUIRED_MSGS.name[lang]   ?? REQUIRED_MSGS.name.fr
    if (name === 'email'  && !/\S+@\S+\.\S+/.test(value))  err = REQUIRED_MSGS.email[lang]  ?? REQUIRED_MSGS.email.fr
    if (name === 'school' && !value.trim())                 err = REQUIRED_MSGS.school[lang] ?? REQUIRED_MSGS.school.fr
    setErrors(p => ({ ...p, [name]: err }))
    return err
  }

  const handle = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    validate(name, value)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (Date.now() - lastSubmit < 10_000) return

    const errs = {
      name:   validate('name',   form.name),
      email:  validate('email',  form.email),
      school: validate('school', form.school),
    }
    if (Object.values(errs).some(Boolean)) return

    setStatus('sending')
    setLastSubmit(Date.now())
    try {
      await createLead({ ...form, language: lang })
      setStatus('sent')
      setForm({ name:'', email:'', school:'', phone:'', message:'' })
      setErrors({})
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  const inputCls = (name) => [
    'w-full px-4 py-[13px] border-[1.5px] rounded-[9px] font-dm text-[15px] text-[#111827] bg-[#FAFAFA] outline-none transition-all placeholder-[#D1D5DB]',
    errors[name]
      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-[#E5EDE9] focus:border-[#1D9E75] focus:bg-white',
  ].join(' ')

  return (
    <section id="contact" ref={ref} className="reveal max-w-[1200px] mx-auto px-10 lg:px-20 py-24"
             dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="inline-block text-xs font-bold text-[#1D9E75] uppercase tracking-[2px] mb-[14px]">{c.label}</div>
      <h2 className="font-syne font-extrabold text-[clamp(30px,3vw,46px)] leading-[1.1] tracking-[-1px] mb-4 max-w-[700px]">{c.title}</h2>
      <p className="text-[17px] text-[#6B7280] leading-[1.6] max-w-[700px] mb-12">{c.sub}</p>

      <div className="max-w-[600px] mx-auto">
        <form onSubmit={submit} noValidate
              className="bg-white p-10 rounded-[14px] border border-[#E5EDE9] shadow-md flex flex-col gap-4">

          {/* Name */}
          <div>
            <input name="name" value={form.name} onChange={handle}
                   placeholder={c.namePh} className={inputCls('name')} />
            {errors.name && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">⚠ {errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <input name="email" value={form.email} onChange={handle}
                   type="email" placeholder={c.emailPh} className={inputCls('email')} />
            {errors.email && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">⚠ {errors.email}</p>}
          </div>

          {/* School */}
          <div>
            <input name="school" value={form.school} onChange={handle}
                   placeholder={c.schoolPh} className={inputCls('school')} />
            {errors.school && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">⚠ {errors.school}</p>}
          </div>

          {/* Phone (optional) */}
          <input name="phone" value={form.phone} onChange={handle}
                 type="tel" placeholder={c.phonePh} className={inputCls('phone')} />

          {/* Message (optional) */}
          <textarea name="message" value={form.message} onChange={handle}
                    rows={4} placeholder={c.msgPh}
                    className={`${inputCls('message')} resize-y`} />

          <button type="submit" disabled={status === 'sending'}
            className={`w-full flex justify-center items-center px-[30px] py-[14px] text-white text-[15px] font-semibold rounded-full transition-all mt-2 ${
              status === 'sent'    ? 'bg-[#059669]' :
              status === 'error'   ? 'bg-[#DC2626]' :
              status === 'sending' ? 'bg-[#F59E0B] opacity-80 cursor-not-allowed' :
              'bg-[#1D9E75] hover:bg-[#0F6E56] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(29,158,117,0.32)]'
            }`}>
            {status === 'sending' ? c.sending : status === 'sent' ? c.sent : status === 'error' ? c.error : c.submit}
          </button>
        </form>
      </div>
    </section>
  )
}
