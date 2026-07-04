export default function PageLoader() {
  return (
    <div className="min-h-screen bg-[#F4F7F5] flex flex-col items-center justify-center gap-5 font-dm">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-[10px] bg-[#1D9E75] flex items-center justify-center font-syne font-bold text-white text-base"
             style={{ animation:'pulse 1.5s ease-in-out infinite' }}>
          E
        </div>
        <span className="font-syne font-bold text-[20px] text-[#111827]">
          Edukira<span className="text-[#1D9E75]">.</span>
        </span>
      </div>

      {/* Spinner */}
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-[#E1F5EE]" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1D9E75] animate-spin" />
      </div>

      {/* Progress bar — uses @keyframes loading from index.css */}
      <div className="w-48 h-1 bg-[#E1F5EE] rounded-full overflow-hidden">
        <div className="h-full w-full bg-[#1D9E75] rounded-full"
             style={{ animation: 'loading 1.4s ease-in-out infinite' }} />
      </div>
    </div>
  )
}
