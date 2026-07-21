import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, X, ArrowRight, Play, AlertCircle, School as SchoolIcon, GraduationCap, ClipboardCheck, FileText, CreditCard, ShoppingBag, Globe, MessageCircle, Smartphone, Bell, Globe2 } from 'lucide-react'
import { useLang } from '../../hooks/useLang'
import { useReveal } from '../../hooks/useReveal'
import { createLead } from '../../lib/api'
import VideoModal from '../ui/VideoModal'

/* ═══ PROBLEM / SOLUTION ═══ */
export function ProblemSolution() {
  const { t, isRTL } = useLang(); const r = t.ps
  const ref = useReveal()
  return (
    <section id="problem-solution" ref={ref} className="reveal max-w-[1200px] mx-auto px-10 lg:px-20 py-24">
      <div className="block w-fit mx-auto text-center text-xs font-bold text-[#1D9E75] uppercase tracking-[2px] mb-[14px]">{r.label}</div>
      <h2 className="font-syne font-extrabold text-[clamp(30px,3vw,46px)] leading-[1.1] tracking-[-1px] mb-4 max-w-[700px] mx-auto text-center">{r.title}</h2>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 mt-8 ${isRTL ? 'text-right' : ''}`}>
        {/* Problem */}
        <div className="bg-white p-8 rounded-[14px] border border-[#E5EDE9]">
          <h3 className="font-syne text-xl font-bold mb-5">{r.probTitle}</h3>
          <ul className="list-none space-y-3">
            {r.prob.map((item) => (
              <li key={item} className={`text-[15px] text-[#6B7280] flex items-start gap-2 leading-[1.5]`}>
                <X size={15} className="text-red-500 flex-shrink-0 mt-[3px]" strokeWidth={2.5} />{item}
              </li>
            ))}
          </ul>
        </div>
        {/* Solution */}
        <div className="bg-white p-8 rounded-[14px] border border-[#E5EDE9]">
          <h3 className="font-syne text-xl font-bold mb-5">{r.solTitle}</h3>
          <ul className="list-none space-y-3">
            {r.sol.map((item) => (
              <li key={item} className={`text-[15px] text-[#6B7280] flex items-start gap-2 leading-[1.5]`}>
                <Check size={15} className="text-[#1D9E75] flex-shrink-0 mt-[3px]" strokeWidth={2.5} />{item}
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
        <div className="block w-fit mx-auto text-center text-xs font-bold text-[#1D9E75] uppercase tracking-[2px] mb-[14px]">{f.label}</div>
        <h2 className="font-syne font-extrabold text-[clamp(30px,3vw,46px)] leading-[1.1] tracking-[-1px] mb-4 max-w-[700px] mx-auto text-center">{f.title}</h2>
        <p className="text-[17px] text-[#6B7280] leading-[1.6] max-w-[700px] mb-12 mx-auto text-center">{f.sub}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 stagger-grid">
          {f.items.map((item, i) => (
            <FeatureCard key={item.title} item={item} Icon={FEATURE_ICONS[i % FEATURE_ICONS.length]} />
          ))}
        </div>
      </div>
    </section>
  )
}

const FEATURE_ICONS = [GraduationCap, ClipboardCheck, FileText, CreditCard, ShoppingBag, Globe]

function FeatureCard({ item, Icon }) {
  const ref = useReveal()
  return (
    <div ref={ref} className="reveal bg-white p-8 rounded-[14px] border border-[#E5EDE9] shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-[#1D9E75] transition-all">
      <div className="w-12 h-12 rounded-xl bg-[#E1F5EE] flex items-center justify-center mb-[18px]">
        <Icon size={22} className="text-[#1D9E75]" />
      </div>
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

/* Mobile Money → monograma colorido (marca de terceiros); Mensageria/API → ícone vetorial */
const INTEGRATION_ICONS = [
  [{ mono: 'W' }, { mono: 'OM' }, { mono: 'MM' }],
  [{ Icon: MessageCircle }, { Icon: Smartphone }],
  [{ Icon: Bell }, { Icon: Globe2 }],
]

/* ═══ INTEGRATIONS ═══ */
export function Integrations() {
  const { t } = useLang(); const g = t.integrations
  const ref = useReveal()
  return (
    <section id="integrations" ref={ref} className="reveal bg-[#0B1E42] py-24 px-10 lg:px-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="block w-fit mx-auto text-center text-xs font-bold text-[#F59E0B] uppercase tracking-[2px] mb-[14px]">{g.label}</div>
        <h2 className="font-syne font-extrabold text-[clamp(30px,3vw,46px)] leading-[1.1] tracking-[-1px] text-white mb-4 max-w-[700px] mx-auto text-center">{g.title}</h2>
        <p className="text-[17px] text-white/75 leading-[1.6] max-w-[700px] mb-12 mx-auto text-center">{g.sub}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {g.groups.map((group, gi) => (
            <div key={group.label}>
              <div className="text-[11px] font-bold uppercase tracking-[2px] text-white/60 mb-4">{group.label}</div>
              <div className="space-y-3">
                {group.items.map((item, ii) => {
                  const cfg = INTEGRATION_ICONS[gi]?.[ii]
                  return (
                  <div key={item.name} className="integ-card">
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
                      {cfg?.mono
                        ? <span className="text-white font-extrabold text-[13px]">{cfg.mono}</span>
                        : cfg?.Icon && <cfg.Icon size={17} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white">{item.name}</div>
                      <div className="text-[12px] text-white/70 mt-0.5">{item.desc}</div>
                    </div>
                    <span className="text-[10px] font-bold px-[10px] py-1 rounded-full bg-[#1D9E75]/25 text-[#6EE7B7] border border-[#1D9E75]/30 whitespace-nowrap flex-shrink-0">
                      {item.badge}
                    </span>
                  </div>
                  )
                })}
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
        <div className="block w-fit mx-auto text-center text-xs font-bold text-[#1D9E75] uppercase tracking-[2px] mb-[14px]">{s.label}</div>
        <h2 className="font-syne font-extrabold text-[clamp(30px,3vw,46px)] leading-[1.1] tracking-[-1px] mb-12 max-w-[700px] mx-auto text-center">{s.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-12">
          {s.items.map((item, i) => {
            const initials = item.name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
            const avColor = ['#1D9E75', '#F59E0B', '#7C3AED', '#0B1E42'][i % 4]
            return (
              <div key={item.name} className="bg-white p-8 rounded-[14px] border border-[#E5EDE9] shadow-sm">
                <p className="text-[16px] leading-[1.7] italic mb-5">« {item.quote} »</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
                    style={{ background: avColor }}
                  >
                    {initials}
                  </div>
                  <div>
                    <div className="font-bold text-[#111827]">{item.name}</div>
                    <div className="text-[13px] text-[#6B7280] mt-0.5">{item.role}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div
          className="relative overflow-hidden rounded-[14px] px-8 py-10"
          style={{ background: 'linear-gradient(120deg, #0B1E42 0%, #0F6E56 100%)' }}
        >
          {/* Textura de pontos sutil */}
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '16px 16px' }}
          />
          <div className="relative flex flex-wrap justify-around items-center text-white gap-6">
            {s.stats.map((st, i) => {
              const Icon = [SchoolIcon, Check, GraduationCap][i % 3]
              return (
                <div key={st.lbl}
                  className={`text-center px-6 ${i > 0 ? 'md:border-l md:border-white/15' : ''}`}>
                  <Icon size={22} className="mx-auto mb-2 text-[#6EE7B7]" />
                  <div className="font-syne font-extrabold text-[42px] leading-none">{st.val}</div>
                  <div className="text-[15px] mt-2 opacity-85">{st.lbl}</div>
                </div>
              )
            })}
          </div>
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
      <div className="block w-fit mx-auto text-center text-xs font-bold text-[#1D9E75] uppercase tracking-[2px] mb-[14px]">{h.label}</div>
      <h2 className="font-syne font-extrabold text-[clamp(30px,3vw,46px)] leading-[1.1] tracking-[-1px] mb-12 max-w-[700px] mx-auto text-center">{h.title}</h2>
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
        <div className="block w-fit mx-auto text-center text-xs font-bold text-[#1D9E75] uppercase tracking-[2px] mb-[14px]">{p.label}</div>
        <h2 className="font-syne font-extrabold text-[clamp(30px,3vw,46px)] leading-[1.1] tracking-[-1px] mb-4 max-w-[700px] mx-auto text-center">{p.title}</h2>
        <p className="text-[17px] text-[#6B7280] leading-[1.6] max-w-[700px] mb-12 mx-auto text-center">{p.sub}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-start stagger-grid">
          {p.plans.map((plan) => (
            <PriceCard key={plan.id} plan={plan} popular={p.popular} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PriceCard({ plan, popular }) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`reveal bg-white p-10 rounded-[14px] flex flex-col relative transition-all border ${plan.featured ? 'border-[#1D9E75] shadow-md -translate-y-2.5' : 'border-[#E5EDE9] shadow-sm'}`}>
      {plan.featured && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-[#1D9E75] text-white text-[11px] font-bold px-4 py-1 rounded-b-[10px]">
          {popular}
        </div>
      )}
      <h3 className="font-syne font-bold text-[26px] mb-1">{plan.name}</h3>
      <p className="text-[14px] text-[#6B7280] mb-[18px]">{plan.desc}</p>
      <div className="font-syne font-extrabold text-[38px] leading-none mb-6">
        {plan.price}
        <span className="text-[15px] font-normal text-[#6B7280] ml-1">{plan.period}</span>
      </div>
      <ul className="list-none flex-1 space-y-[10px] mb-7">
        {plan.feats.map(f => (
          <li key={f} className="text-[15px] flex items-start gap-2">
            <Check size={16} className="text-[#1D9E75] flex-shrink-0 mt-[3px]" strokeWidth={2.5} />{f}
          </li>
        ))}
      </ul>
      <Link to={`/login?plan=${plan.id}`}
        className="w-full flex justify-center items-center gap-1.5 px-[30px] py-[14px] bg-[#1D9E75] text-white text-[15px] font-semibold rounded-full hover:bg-[#0F6E56] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(29,158,117,0.32)] transition-all no-underline">
        {plan.name} <ArrowRight size={16} />
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
  const [demoOpen, setDemoOpen] = useState(false)

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

  const avatars = [
    { initials: 'AN', color: '#1D9E75' },
    { initials: 'KD', color: '#F59E0B' },
    { initials: 'FT', color: '#7C3AED' },
  ]

  return (
    <section id="contact" ref={ref} className="reveal max-w-[1200px] mx-auto px-10 lg:px-20 py-24"
             dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="block w-fit mx-auto text-center text-xs font-bold text-[#1D9E75] uppercase tracking-[2px] mb-[14px]">{c.label}</div>
      <h2 className="font-syne font-extrabold text-[clamp(30px,3vw,46px)] leading-[1.1] tracking-[-1px] mb-4 max-w-[700px] mx-auto text-center">{c.title}</h2>

      <div className="max-w-[900px] mx-auto rounded-[18px] border border-[#E5EDE9] shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_1.2fr]">

        {/* Painel de contexto — esquerda */}
        <div className="p-10 flex flex-col justify-between text-white" style={{ background: 'linear-gradient(155deg,#0B1E42 0%,#0F6E56 100%)' }}>
          <div>
            <h3 className="font-syne text-2xl font-bold mb-2 leading-snug">{c.title}</h3>
            <p className="text-white/70 text-[14px] leading-relaxed mb-6">{c.sub}</p>
            <div className="space-y-3">
              {[c.benefit1, c.benefit2, c.benefit3].map(b => (
                <div key={b} className="flex items-center gap-2.5 text-[14px] font-medium">
                  <Check size={16} className="text-[#6EE7B7] flex-shrink-0" />{b}
                </div>
              ))}
            </div>

            <button
              onClick={() => setDemoOpen(true)}
              className="mt-7 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <Play size={10} className="text-[#0B1E42] ml-px" fill="currentColor" />
              </div>
              {c.watchDemo}
            </button>
          </div>

          <div className="mt-10">
            <div className="flex -space-x-2.5">
              {avatars.map(a => (
                <div key={a.initials}
                  className="w-8 h-8 rounded-full border-2 border-[#0B1E42] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ background: a.color }}>
                  {a.initials}
                </div>
              ))}
            </div>
            <p className="text-white/60 text-[12px] mt-2">+54 {c.trustCaption}</p>
          </div>
        </div>

        {/* Formulário — direita */}
        <div className="p-8 md:p-10 bg-white">
          <form onSubmit={submit} noValidate className="flex flex-col gap-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input name="name" value={form.name} onChange={handle}
                       placeholder={c.namePh} className={inputCls('name')} />
                {errors.name && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.name}</p>}
              </div>
              <div>
                <input name="email" value={form.email} onChange={handle}
                       type="email" placeholder={c.emailPh} className={inputCls('email')} />
                {errors.email && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.email}</p>}
              </div>
            </div>

            <div>
              <input name="school" value={form.school} onChange={handle}
                     placeholder={c.schoolPh} className={inputCls('school')} />
              {errors.school && <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.school}</p>}
            </div>

            <input name="phone" value={form.phone} onChange={handle}
                   type="tel" placeholder={c.phonePh} className={inputCls('phone')} />

            <textarea name="message" value={form.message} onChange={handle}
                      rows={3} placeholder={c.msgPh}
                      className={`${inputCls('message')} resize-y`} />

            <button type="submit" disabled={status === 'sending'}
              className={`w-full flex justify-center items-center px-[30px] py-[14px] text-white text-[15px] font-semibold rounded-full transition-all mt-1 ${
                status === 'sent'    ? 'bg-[#059669]' :
                status === 'error'   ? 'bg-[#DC2626]' :
                status === 'sending' ? 'bg-[#F59E0B] opacity-80 cursor-not-allowed' :
                'bg-[#1D9E75] hover:bg-[#0F6E56] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(29,158,117,0.32)]'
              }`}>
              {status === 'sending' ? c.sending : status === 'sent' ? c.sent : status === 'error' ? c.error : c.submit}
            </button>
          </form>
        </div>
      </div>

      <VideoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  )
}
