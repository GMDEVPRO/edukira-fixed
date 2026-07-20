/**
 * Design tokens — única fonte de verdade para a marca Edukira.
 *
 * Importado por:
 *  - tailwind.config.js (classes utilitárias: bg-green, text-navy, etc.)
 *  - Qualquer componente que precise do valor hex bruto (Recharts, inline
 *    styles, canvas) — ex: Dashboard.jsx, em vez de redefinir localmente.
 *
 * Se a marca mudar um valor, muda só aqui.
 */
export const tokens = {
  green: '#1D9E75',
  greenDark: '#0F6E56',
  greenLight: '#E1F5EE',
  navy: '#0B1E42',
  gold: '#F59E0B',
  border: '#E5EDE9',
  off: '#F8FAF9',
  muted: '#6B7280',
}

export default tokens
