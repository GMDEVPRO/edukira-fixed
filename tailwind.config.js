/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        green:  { DEFAULT: '#1D9E75', dk: '#0F6E56', lt: '#E1F5EE' },
        navy:   '#0B1E42',
        gold:   '#F59E0B',
        border: '#E5EDE9',
        off:    '#F8FAF9',
        muted:  '#6B7280',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm:   ['DM Sans', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      borderRadius: { xl2: '20px' },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.05)',
        md: '0 4px 12px rgba(0,0,0,0.08)',
        lg: '0 12px 32px rgba(0,0,0,0.12)',
      },
      keyframes: {
        fadeUp:   { from: { opacity: '0', transform: 'translateY(20px)' },     to: { opacity: '1', transform: 'translateY(0)' } },
        fadeLeft: { from: { opacity: '0', transform: 'translateX(20px)' },     to: { opacity: '1', transform: 'translateX(0)' } },
        pulseDot: { '0%,100%': { boxShadow: '0 0 0 0 rgba(29,158,117,0.45)' }, '50%': { boxShadow: '0 0 0 6px rgba(29,158,117,0)' } },
      },
      animation: {
        'fade-up':   'fadeUp .6s ease both',
        'fade-left': 'fadeLeft .8s .2s ease both',
        'pulse-dot': 'pulseDot 2s infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
}
