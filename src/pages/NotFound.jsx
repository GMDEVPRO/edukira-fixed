import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../hooks/useLang'

const MESSAGES = {
  fr: { title:'Page introuvable', sub:'La page que vous cherchez n\'existe pas ou a été déplacée.', home:'← Retour à l\'accueil', dashboard:'Aller au dashboard' },
  en: { title:'Page not found',   sub:'The page you are looking for doesn\'t exist or has been moved.', home:'← Back to home', dashboard:'Go to dashboard' },
  ar: { title:'الصفحة غير موجودة', sub:'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.', home:'→ العودة للرئيسية', dashboard:'الذهاب للوحة التحكم' },
  pt: { title:'Página não encontrada', sub:'A página que procuras não existe ou foi movida.', home:'← Voltar ao início', dashboard:'Ir para o dashboard' },
}

export default function NotFound() {
  const { lang, isRTL } = useLang()
  const location = useLocation()
  const m = MESSAGES[lang] ?? MESSAGES.fr

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col items-center justify-center px-4 font-dm"
         dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 no-underline mb-12">
        <div className="w-9 h-9 rounded-[10px] bg-[#1D9E75] flex items-center justify-center font-syne font-bold text-white text-base">E</div>
        <span className="font-syne font-bold text-[20px] text-[#111827]">
          Edukira<span className="text-[#1D9E75]">.</span>
        </span>
      </Link>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-[#E2EDE8] shadow-[0_8px_40px_rgba(11,30,66,0.08)] overflow-hidden max-w-md w-full">
        <div className="h-1" style={{ background:'linear-gradient(90deg,#1D9E75,#0B1E42)' }} />

        <div className="p-10 text-center">
          {/* 404 number */}
          <div className="font-syne font-extrabold text-[96px] leading-none mb-2"
               style={{ background:'linear-gradient(135deg,#1D9E75,#0B1E42)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
            404
          </div>

          <h1 className="font-syne font-bold text-[1.3rem] text-[#111827] mb-2">{m.title}</h1>
          <p className="text-[#6B7280] text-sm leading-relaxed mb-2">{m.sub}</p>

          {/* Path that failed */}
          <p className="font-mono text-[11px] text-[#9CA3AF] bg-[#F4F7F5] px-3 py-1.5 rounded-lg inline-block mb-8">
            {location.pathname}
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link to="/"
              className="w-full py-3 rounded-xl font-semibold text-white text-sm no-underline text-center transition-all hover:opacity-90 active:scale-[.98]"
              style={{ background:'#1D9E75', boxShadow:'0 4px 14px rgba(29,158,117,0.35)' }}>
              {m.home}
            </Link>
            <Link to="/dashboard"
              className="w-full py-3 rounded-xl font-semibold text-[#374151] text-sm no-underline text-center transition-all hover:bg-[#F4F7F5] border border-[#E2EDE8]">
              {m.dashboard}
            </Link>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[#9CA3AF] mt-6">© 2026 Edukira · contact@edukira.com</p>
    </div>
  )
}
