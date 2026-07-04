import { Component, useState, useCallback } from 'react'

/**
 * ErrorBoundary global — captura erros React em qualquer sub-árvore.
 * Uso:
 *   <ErrorBoundary>                     → fallback page-level
 *   <ErrorBoundary section="X" minimal> → fallback compacto inline
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, retryCount: 0 }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    if (import.meta.env.PROD) {
      console.error('[Edukira ErrorBoundary]', {
        error:     error?.message,
        component: info?.componentStack?.split('\n')[1]?.trim() ?? 'unknown',
        section:   this.props.section ?? 'unknown',
        ts:        new Date().toISOString(),
      })
    }
  }

  handleRetry = () =>
    this.setState(s => ({ hasError: false, error: null, retryCount: s.retryCount + 1 }))

  handleReload = () => window.location.reload()

  render() {
    const { hasError, error, retryCount } = this.state
    const { children, section, minimal, fallback } = this.props

    if (!hasError) return children

    // Custom fallback via prop
    if (fallback) return fallback({ error, retry: this.handleRetry })

    // Compact — for internal sections / tabs
    if (minimal) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">⚠️</div>
          <div>
            <p className="font-semibold text-[#374151] text-sm">{section ?? 'Section'} indisponible</p>
            <p className="text-[#9CA3AF] text-xs mt-0.5">Une erreur inattendue s'est produite</p>
          </div>
          <button onClick={this.handleRetry}
            className="px-4 py-2 rounded-full text-white text-xs font-semibold hover:opacity-90 transition-all"
            style={{ background:'#1D9E75' }}>
            Réessayer
          </button>
        </div>
      )
    }

    // Full page-level fallback
    return (
      <div className="min-h-screen bg-[#F4F7F5] flex items-center justify-center px-4 font-dm">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl border border-[#E2EDE8] shadow-[0_8px_40px_rgba(11,30,66,0.1)] overflow-hidden">
            <div className="h-1 w-full" style={{ background:'linear-gradient(90deg,#DC2626,#F97316)' }} />
            <div className="p-8 text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center text-4xl"
                   style={{ background:'#FEF2F2', border:'2px solid #FEE2E2' }}>🚨</div>

              <h2 className="font-syne font-extrabold text-[1.4rem] text-[#111827] mb-2">
                Oops ! Quelque chose s'est cassé
              </h2>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-1">
                {section
                  ? `Le module "${section}" a rencontré une erreur inattendue.`
                  : "L'application a rencontré une erreur inattendue."}
              </p>
              <p className="text-[#9CA3AF] text-xs mb-6">Vos données sont en sécurité.</p>

              {import.meta.env.DEV && error && (
                <div className="text-left mb-5 p-3 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-[10px] font-bold text-red-700 uppercase tracking-wide mb-1">Dev</p>
                  <p className="text-[11px] text-red-600 font-mono break-all leading-relaxed">
                    {error?.message ?? String(error)}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2.5">
                {retryCount < 3 && (
                  <button onClick={this.handleRetry}
                    className="w-full py-3 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-all active:scale-[.98]"
                    style={{ background:'#1D9E75', boxShadow:'0 4px 14px rgba(29,158,117,0.35)' }}>
                    🔄 Réessayer ({3 - retryCount} tentative{3 - retryCount > 1 ? 's' : ''} restante{3 - retryCount > 1 ? 's' : ''})
                  </button>
                )}
                <button onClick={this.handleReload}
                  className="w-full py-3 rounded-xl font-semibold text-[#374151] text-sm hover:bg-[#F4F7F5] border border-[#E2EDE8] transition-all">
                  🔃 Recharger la page
                </button>
                <a href="/" className="w-full py-3 rounded-xl font-semibold text-[#6B7280] text-sm hover:text-[#1D9E75] text-center no-underline transition-all">
                  ← Retour à l'accueil
                </a>
              </div>
            </div>
            <div className="px-8 py-4 border-t border-[#E2EDE8] bg-[#FAFAFA] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#1D9E75] flex items-center justify-center font-syne font-bold text-white text-[10px]">E</div>
                <span className="font-syne font-bold text-[13px] text-[#111827]">Edukira<span className="text-[#1D9E75]">.</span></span>
              </div>
              <p className="text-[11px] text-[#9CA3AF]">contact@edukira.com</p>
            </div>
          </div>
          {retryCount >= 3 && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-orange-50 border border-orange-200 text-center">
              <p className="text-[12px] text-orange-700 font-medium">
                Après 3 tentatives, l'erreur persiste.
              </p>
              <a href="mailto:contact@edukira.com"
                className="text-[12px] font-bold text-orange-700 no-underline hover:underline">
                Contactez le support →
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }
}

/**
 * Hook to imperatively throw an error into the nearest ErrorBoundary.
 * Usage: const throwError = useThrowError(); throwError(new Error('...'))
 */
export function useThrowError() {
  const [, setState] = useState()
  return useCallback((err) => {
    setState(() => { throw err })
  }, [])
}

export default ErrorBoundary
