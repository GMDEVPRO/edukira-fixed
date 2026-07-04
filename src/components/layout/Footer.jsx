import { useLang } from '../../hooks/useLang'

export default function Footer() {
  const { t, isRTL } = useLang()
  const f = t.footer

  const scrollTo = (id) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <footer className="bg-[#0B1E42] text-white/65 pt-14 pb-6 font-dm">
      <div className="max-w-[1200px] mx-auto px-10 grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-[10px] mb-3">
            <div className="w-9 h-9 bg-[#1D9E75] rounded-[10px] flex items-center justify-center text-lg">🎓</div>
            <span className="font-syne font-extrabold text-xl text-white">Edukira<span className="text-[#1D9E75]">.</span></span>
          </div>
          <p className="text-sm leading-relaxed">{f.tagline}</p>
        </div>

        {/* Nav links */}
        <div>
          <h3 className="text-white font-syne font-bold text-base mb-4">{f.navLabel}</h3>
          <ul className="list-none space-y-2">
            {[['#features',t.nav.features],['#integrations',t.nav.integrations],['#social-proof',t.nav.testimonials],['#pricing',t.nav.pricing],['#contact',t.nav.contact]].map(([href,label]) => (
              <li key={href}>
                <button onClick={() => scrollTo(href)}
                  className="text-sm text-white/60 hover:text-[#1D9E75] transition-colors bg-transparent border-none cursor-pointer p-0">
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-syne font-bold text-base mb-4">{f.contactLabel}</h3>
          <p className="text-sm mb-2">📧 {f.email}</p>
          <p className="text-sm">📞 {f.phone}</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-10 border-t border-white/10 pt-5 text-center text-xs">
        © 2026 Edukira. {f.copy}
      </div>
    </footer>
  )
}
