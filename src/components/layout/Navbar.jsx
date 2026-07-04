import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../hooks/useLang'

const LANG_FLAGS = { fr:'🇫🇷', en:'🇬🇧', ar:'🇸🇦', pt:'🇵🇹' }

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
          <div className="flex items-center justify-center rounded-[9px] font-syne font-extrabold text-white flex-shrink-0"
               style={{ width:32, height:32, background:'#1D9E75', fontSize:15 }}>E</div>
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
          {/* Lang toggle — FR EN AR PT */}
          <div className="flex items-center gap-[2px] rounded-full p-[3px]"
               style={{ background:'#F4F7F5', border:'1px solid #E2EDE8' }}>
            {langs.map((code) => (
              <button key={code} onClick={() => setLang(code)}
                className={`flex items-center gap-1 rounded-full text-[11px] font-bold transition-all px-2.5 py-1 ${
                  lang === code ? 'bg-[#1D9E75] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#1D9E75] hover:bg-white'
                }`}>
                <span className="text-[12px]">{LANG_FLAGS[code]}</span>
                <span>{code.toUpperCase()}</span>
              </button>
            ))}
          </div>
          <Link to="/register"
            className="inline-flex items-center gap-1.5 font-semibold text-white rounded-full no-underline hover:opacity-90 hover:-translate-y-px transition-all"
            style={{ padding:'9px 18px', fontSize:13, background:'#1D9E75', boxShadow:'0 4px 14px rgba(29,158,117,0.32)' }}>
            ✦ {t?.nav?.start || 'Get started'}
          </Link>
        </div>

        {/* Mobile right: mini flags + burger */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="flex items-center gap-[2px] rounded-full p-[2px]"
               style={{ background:'#F4F7F5', border:'1px solid #E2EDE8' }}>
            {langs.map((code) => (
              <button key={code} onClick={() => setLang(code)}
                className={`flex items-center justify-center rounded-full text-[13px] transition-all ${lang === code ? 'bg-[#1D9E75] shadow-sm' : 'hover:bg-white'}`}
                style={{ width:26, height:26 }}>
                {LANG_FLAGS[code]}
              </button>
            ))}
          </div>

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
          <Link to="/register" onClick={() => setOpen(false)}
            className="font-bold text-white rounded-full no-underline text-center hover:opacity-90 active:scale-95 transition-all"
            style={{ display:'block', padding:14, fontSize:14, background:'#1D9E75', boxShadow:'0 6px 20px rgba(29,158,117,0.38)' }}>
            ✦ {t?.nav?.start || 'Get started'}
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
