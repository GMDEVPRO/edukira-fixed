import { X } from 'lucide-react'

/**
 * Modal de vídeo de demo — embute um iframe (Loom/Vimeo) quando `videoUrl` for
 * definido. Sem URL ainda: mostra um placeholder com o ícone de play, pra já
 * deixar a UI pronta antes de gravar o vídeo (é só passar a prop depois).
 */
export default function VideoModal({ open, onClose, videoUrl }) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative w-full max-w-[860px] aspect-video bg-[#0B1E42] rounded-2xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <X size={18} />
        </button>
        {videoUrl ? (
          <iframe
            src={videoUrl}
            title="Edukira — Démo"
            className="w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">
            Vídeo em breve.
          </div>
        )}
      </div>
    </div>
  )
}
