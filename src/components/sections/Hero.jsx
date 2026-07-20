import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Rocket, Play } from 'lucide-react'
import { useLang } from '../../hooks/useLang'
import VideoModal from '../ui/VideoModal'

const AVATARS = [
  { initials: 'AM', color: '#1D9E75' },
  { initials: 'KD', color: '#0B1E42' },
  { initials: 'FT', color: '#F59E0B' },
  { initials: 'SB', color: '#7C3AED' },
]

export default function Hero() {
  const { t, isRTL } = useLang()
  const h = t.hero
  const [demoOpen, setDemoOpen] = useState(false)

  return (
    <section id="hero" className="min-h-[100dvh] relative overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero-bg.jpg"
          alt="School Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 lg:px-20 flex flex-col items-center text-center py-6 md:py-8">
        <div className={`flex flex-col items-center max-w-[1000px] w-full ${isRTL ? 'text-right' : ''}`}>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#E1F5EE] border border-[#1D9E75]/25 rounded-full px-[14px] py-[5px] text-xs font-semibold text-[#0F6E56] mb-4 animate-fade-up">
            <span className="w-[7px] h-[7px] rounded-full bg-[#1D9E75] animate-pulse-dot flex-shrink-0" />
            {h.badge}
          </div>

          {/* Título */}
          <h1
            className="font-syne font-extrabold text-[clamp(22px,3vw,42px)] leading-[1.15] tracking-[-1px] mb-3 animate-fade-up"
            style={{ animationDelay: '.05s' }}
          >
            {h.title1} <span className="text-[#1D9E75]">{h.title2}</span>
          </h1>

          {/* Subtítulo */}
          <p
            className="text-[clamp(13px,1.1vw,16px)] text-[#1F2937] font-medium leading-[1.65] mb-4 max-w-[600px] animate-fade-up"
            style={{ animationDelay: '.15s' }}
          >
            {h.sub}
          </p>

          {/* Botões */}
          <div
            className={`flex flex-wrap items-center justify-center gap-3 mb-4 animate-fade-up ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{ animationDelay: '.25s' }}
          >
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-[11px] bg-[#1D9E75] text-white text-[14px] font-bold rounded-full hover:bg-[#0F6E56] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(29,158,117,0.4)] transition-all no-underline"
            >
              <Rocket size={16} /> {h.cta1}
            </Link>
            <button
              onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-6 py-[10px] bg-white text-[#111827] border border-[#E5EDE9] text-[14px] font-semibold rounded-full hover:border-[#1D9E75] hover:text-[#1D9E75] transition-all cursor-pointer shadow-sm"
            >
              {h.cta2}
            </button>
          </div>

          {/* Assistir à demo — link discreto, abre modal */}
          <button
            onClick={() => setDemoOpen(true)}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#374151] underline decoration-dotted underline-offset-4 hover:text-[#1D9E75] transition-colors bg-transparent border-none cursor-pointer mb-4 animate-fade-up"
            style={{ animationDelay: '.3s' }}
          >
            <Play size={12} /> {h.watchDemo}
          </button>

          {/* Avatar Stack + Social Proof */}
          <div
            className="flex items-center justify-center gap-3 mb-3 animate-fade-up"
            style={{ animationDelay: '.32s' }}
          >
            <div className="flex -space-x-2.5">
              {AVATARS.map(({ initials, color }) => (
                <div
                  key={initials}
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ background: color }}
                >
                  {initials}
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] text-[10px] font-bold flex-shrink-0">
                +50
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-0.5 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[11px] text-[#6B7280] leading-[1.3]">
                <span className="font-semibold text-[#111827]">+54 écoles</span>{' '}nous font confiance
              </p>
            </div>
          </div>

          {/* Stats */}
          <div
            className={`grid grid-cols-3 w-full pt-3 border-t border-[#E5EDE9] animate-fade-up ${isRTL ? 'direction-rtl' : ''}`}
            style={{ animationDelay: '.35s' }}
          >
            {[[h.stat1val, h.stat1lbl], [h.stat2val, h.stat2lbl], [h.stat3val, h.stat3lbl]].map(([val, lbl], i) => (
              <div
                key={lbl}
                className={`flex flex-col items-center justify-center px-1 py-1 ${i === 1 ? 'border-x border-[#E5EDE9]' : ''}`}
              >
                <div className="font-syne font-extrabold leading-none text-[#111827] text-center w-full"
                     style={{ fontSize: 'clamp(13px, 3.5vw, 22px)' }}>
                  {val}
                </div>
                <div className="text-[#4B5563] font-medium mt-1 leading-[1.3] text-center w-full"
                     style={{ fontSize: 'clamp(9px, 2vw, 11px)' }}>
                  {lbl}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <VideoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </section>
  )
}