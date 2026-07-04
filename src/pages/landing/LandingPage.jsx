import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../hooks/useLang'
import { useReveal } from '../../hooks/useReveal'
import { createLead } from '../../api/axios'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import Hero from '../../components/sections/Hero'
import {
  ProblemSolution,
  Features,
  Integrations,
  Testimonials,
  HowItWorks,
  Pricing,
  Contact,
} from '../../components/sections/Sections'

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '221771234567'

export default function LandingPageNew() {
  const { lang, t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [contactForm, setContactForm]     = useState({ name: '', email: '', school: '', whatsapp: '' })
  const [contactStatus, setContactStatus] = useState('idle')
  const [contactErrors, setContactErrors] = useState({})
  const [lastSubmit, setLastSubmit]       = useState(0) // anti-spam

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* Validate a single field and update errors */
  const validateField = (name, value) => {
    let err = ''
    if (name === 'name'     && !value.trim())                err = lang === 'pt' ? 'Nome obrigatório' : lang === 'ar' ? 'الاسم مطلوب' : lang === 'en' ? 'Name required' : 'Nom requis'
    if (name === 'email'    && !/\S+@\S+\.\S+/.test(value)) err = lang === 'pt' ? 'Email inválido'   : lang === 'ar' ? 'بريد غير صالح' : lang === 'en' ? 'Invalid email' : 'Email invalide'
    if (name === 'school'   && !value.trim())                err = lang === 'pt' ? 'Escola obrigatória' : lang === 'ar' ? 'المدرسة مطلوبة' : lang === 'en' ? 'School required' : 'École requise'
    setContactErrors(p => ({ ...p, [name]: err }))
    return err
  }

  const handleContactChange = (e) => {
    const { name, value } = e.target
    setContactForm(f => ({ ...f, [name]: value }))
    validateField(name, value)
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()

    /* Anti-spam: min 10s between submissions */
    const now = Date.now()
    if (now - lastSubmit < 10_000) return

    /* Validate all fields */
    const errs = {
      name:   validateField('name',   contactForm.name),
      email:  validateField('email',  contactForm.email),
      school: validateField('school', contactForm.school),
    }
    if (Object.values(errs).some(Boolean)) return

    setContactStatus('sending')
    setLastSubmit(now)
    try {
      await createLead({ ...contactForm, language: lang })
      setContactStatus('sent')
      setContactForm({ name: '', email: '', school: '', whatsapp: '' })
      setContactErrors({})
      setTimeout(() => setContactStatus('idle'), 4000)
    } catch {
      setContactStatus('error')
      setTimeout(() => setContactStatus('idle'), 4000)
    }
  }

  /* contact form state kept for WhatsApp button lang label */

  return (
    <>
      <Navbar scrolled={scrolled} />

      <main className="pt-[68px]">
        <Hero />

        {/* ProblemSolution — uses useLang() internally, fully translated */}
        <ProblemSolution />

        <div className="h-8 bg-gradient-to-b from-white to-[#F8FAF9]" />
        <Features />

        <div className="h-1 bg-[#0B1E42]" />
        <Integrations />
        <div className="h-1 bg-[#0B1E42]" />
        <div className="h-8 bg-gradient-to-b from-[#0B1E42] to-white" />

        <Testimonials />

        <div className="h-8 bg-gradient-to-b from-white to-[#F8FAF9]" />
        <HowItWorks />

        <div className="h-8 bg-gradient-to-b from-[#F8FAF9] to-white" />
        <Pricing />

        <div className="h-8 bg-gradient-to-b from-white to-[#F0F9F6]" />
        <Contact />
      </main>

      <Footer />

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20o%20Edukira`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[9999] flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 hover:shadow-[0_15px_40px_rgba(37,211,102,0.5)] transition-all group animate-bounce-slow"
        aria-label="Contact us on WhatsApp"
      >
        <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="absolute right-full mr-4 bg-white text-[#0B1E42] text-sm font-bold px-4 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[#E5EDE9]">
          {lang === 'ar' ? 'تواصل معنا' : lang === 'en' ? 'Contact us' : 'Contactez-nous'}
        </span>
      </a>
    </>
  )
}


/* All sections imported from ../../components/sections/Sections.jsx */
