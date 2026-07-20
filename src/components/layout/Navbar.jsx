import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ChevronDown } from 'lucide-react'
import { useLang } from '../../hooks/useLang'

/** Dropdown compacto de idioma — só o código ativo fica visível; clicar abre as outras opções. */
function LangDropdown({ lang, setLang, langs, size = 30 }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox" aria-expanded={open}
        className="flex items-center gap-1 rounded-full border border-[#1D9E75] bg-white text-[#0F6E56] font-bold transition-all hover:bg-[#E1F5EE]"
        style={{ height: size, padding: '0 10px', fontSize: 11 }}
      >
        {lang.toUpperCase()}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 rounded-xl bg-white shadow-lg border border-[#E5EDE9] overflow-hidden z-50" style={{ minWidth: 64 }}>
          {langs.filter(c => c !== lang).map(code => (
            <button key={code} onClick={() => { setLang(code); setOpen(false) }}
              className="block w-full text-left px-3 py-2 text-[11px] font-bold text-[#6B7280] hover:bg-[#E1F5EE] hover:text-[#0F6E56] transition-colors">
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { lang, setLang, t, isRTL, langs } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setOpen(false) }
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const scrollTo = (id) => {
    setOpen(false)
    setTimeout(() => {
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 280)
  }

  const links = [
    ['#features',     t?.nav?.features     || 'Features'],
    ['#integrations', t?.nav?.integrations || 'Integrations'],
    ['#social-proof', t?.nav?.testimonials || 'Testimonials'],
    ['#pricing',      t?.nav?.pricing      || 'Pricing'],
    ['#contact',      t?.nav?.contact      || 'Contact'],
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'h-[60px] shadow-[0_4px_24px_rgba(0,0,0,0.08)]' : 'h-[68px]'
        }`}
        style={{ background:'rgba(255,255,255,0.97)', borderBottom:'1px solid #E5EDE9', padding:'0 clamp(16px,4vw,40px)' }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline flex-shrink-0">
          <span className="font-syne font-extrabold text-[19px] text-[#111827] tracking-tight">
            Edukira<span style={{ color:'#1D9E75' }}>.</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className={`hidden lg:flex items-center gap-7 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {links.map(([href, label]) => (
            <button key={href} onClick={() => scrollTo(href)}
              className="text-[13.5px] font-medium text-[#6B7280] hover:text-[#1D9E75] transition-colors bg-transparent border-none cursor-pointer whitespace-nowrap">
              {label}
            </button>
          ))}
        </div>

        {/* Desktop right */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <LangDropdown lang={lang} setLang={setLang} langs={langs} size={30} />
          <Link to="/login"
            className="inline-flex items-center gap-1.5 font-semibold text-white rounded-full no-underline hover:opacity-90 hover:-translate-y-px transition-all"
            style={{ padding:'9px 18px', fontSize:13, background:'#1D9E75', boxShadow:'0 4px 14px rgba(29,158,117,0.32)' }}>
            <Plus size={14} /> {t?.nav?.start || 'Get started'}
          </Link>
        </div>

        {/* Mobile right: lang dropdown + burger */}
        <div className="lg:hidden flex items-center gap-2">
          <LangDropdown lang={lang} setLang={setLang} langs={langs} size={28} />

          {/* Hamburger — 3 bars → X */}
          <button onClick={() => setOpen(o => !o)} aria-label="Menu" aria-expanded={open}
            className="flex flex-col items-center justify-center rounded-lg hover:bg-[#F4F7F5] transition-colors"
            style={{ width:38, height:38, gap:5, border:'none', background:'transparent', cursor:'pointer', padding:0 }}>
            <span style={{ display:'block', width:20, height:2, background:'#111827', borderRadius:2,
              transition:'transform .3s ease', transformOrigin:'center',
              transform: open ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ display:'block', width:20, height:2, background:'#111827', borderRadius:2,
              transition:'opacity .3s, transform .3s',
              opacity: open ? 0 : 1, transform: open ? 'scaleX(0)' : 'scaleX(1)' }} />
            <span style={{ display:'block', width:20, height:2, background:'#111827', borderRadius:2,
              transition:'transform .3s ease', transformOrigin:'center',
              transform: open ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className="lg:hidden fixed left-0 right-0 z-[999] overflow-hidden transition-all duration-300 ease-in-out"
           style={{ top: scrolled ? 60 : 68, maxHeight: open ? 480 : 0, opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none' }}>
        <div className="flex flex-col bg-white shadow-xl"
             style={{ borderBottom:'1px solid #E5EDE9', padding:'12px 20px 24px', direction: isRTL ? 'rtl' : 'ltr' }}>
          {links.map(([href, label]) => (
            <button key={href} onClick={() => scrollTo(href)}
              className="font-semibold text-[#111827] rounded-xl hover:bg-[#E1F5EE] hover:text-[#0F6E56] active:scale-95 transition-all"
              style={{ display:'block', width:'100%', padding:'12px 16px', fontSize:14, textAlign: isRTL ? 'right' : 'left', border:'none', background:'transparent', cursor:'pointer' }}>
              {label}
            </button>
          ))}
          <div style={{ height:1, background:'#E5EDE9', margin:'8px 0' }} />
          <Link to="/login" onClick={() => setOpen(false)}
            className="font-bold text-white rounded-full no-underline text-center hover:opacity-90 active:scale-95 transition-all"
            style={{ display:'block', padding:14, fontSize:14, background:'#1D9E75', boxShadow:'0 6px 20px rgba(29,158,117,0.38)' }}>
            <Plus size={14} className="inline -mt-0.5 mr-1" /> {t?.nav?.start || 'Get started'}
          </Link>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-[998]"
             style={{ top: scrolled ? 60 : 68, background:'rgba(0,0,0,0.12)', cursor:'pointer' }}
             onClick={() => setOpen(false)} />
      )}
    </>
  )
}
