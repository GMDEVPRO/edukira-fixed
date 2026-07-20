/**
 * Fallback para erros de API dentro de componentes React Query.
 * Diferente do ErrorBoundary (que captura erros de render),
 * este é usado no { error } retornado pelo useQuery.
 */
import { Lock, ShieldOff, SearchX, ServerCrash, WifiOff, LogIn, RotateCcw, ArrowLeft } from 'lucide-react'

const ERROR_TYPES = {
  401: { icon: Lock,       title:'Session expirée', desc:'Votre session a expiré. Reconnectez-vous.', action:'login' },
  403: { icon: ShieldOff,  title:'Accès refusé',    desc:"Vous n'avez pas les permissions nécessaires.", action:'home' },
  404: { icon: SearchX,    title:'Introuvable',     desc:'La ressource demandée est introuvable.', action:'retry' },
  500: { icon: ServerCrash,title:'Erreur serveur',  desc:'Le serveur a rencontré un problème. Réessayez.', action:'retry' },
  0:   { icon: WifiOff,    title:'Hors ligne',      desc:'Vérifiez votre connexion internet.', action:'retry' },
}

export default function ApiErrorFallback({ error, onRetry, section }) {
  const status  = error?.response?.status ?? (error?.message?.includes('Network') ? 0 : 500)
  const config  = ERROR_TYPES[status] ?? ERROR_TYPES[500]
  const Icon = config.icon

  const handleAction = () => {
    if (config.action === 'login') window.location.href = '/login'
    else if (config.action === 'home') window.location.href = '/'
    else onRetry?.()
  }

  const ActionIcon = config.action === 'login' ? LogIn : config.action === 'home' ? ArrowLeft : RotateCcw
  const actionLabel = config.action === 'login' ? 'Se reconnecter' : config.action === 'home' ? 'Accueil' : 'Réessayer'

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
           style={{ background:'#FEF2F2', border:'1px solid #FEE2E2' }}>
        <Icon size={24} className="text-red-500" />
      </div>
      <div>
        <p className="font-syne font-bold text-[#111827] text-base">{config.title}</p>
        {section && <p className="text-[#9CA3AF] text-xs mt-0.5">Module : {section}</p>}
        <p className="text-[#6B7280] text-sm mt-1 max-w-xs">{config.desc}</p>
      </div>
      <button onClick={handleAction}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90 hover:-translate-y-px"
        style={{ background:'#1D9E75', boxShadow:'0 4px 14px rgba(29,158,117,0.35)' }}>
        <ActionIcon size={14} /> {actionLabel}
      </button>
      {import.meta.env.DEV && (
        <p className="text-[10px] text-red-400 font-mono">[DEV] {error?.message}</p>
      )}
    </div>
  )
}
