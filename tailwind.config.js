/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        background: '#0B0C10',
        surface: '#111318',
        'surface-2': '#161920',
        border: '#1E2028',
        'border-light': '#252830',
        indigo: {
          DEFAULT: '#6C63FF',
          dim: '#4D46CC',
          glow: 'rgba(108,99,255,0.15)',
          subtle: 'rgba(108,99,255,0.08)',
        },
        text: {
          primary: '#F0EFF5',
          secondary: '#8B8FA8',
          tertiary: '#4A4D5E',
          muted: '#2E3040',
        },
        status: {
          review: '#F59E0B',
          'review-bg': 'rgba(245,158,11,0.12)',
          resolved: '#10B981',
          'resolved-bg': 'rgba(16,185,129,0.12)',
          disputed: '#EF4444',
          'disputed-bg': 'rgba(239,68,68,0.12)',
          favour: '#10B981',
          'favour-bg': 'rgba(16,185,129,0.08)',
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(108,99,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(108,99,255,0.03) 1px, transparent 1px)`,
        'hero-glow': 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(108,99,255,0.12) 0%, transparent 70%)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.2)',
        'indigo-glow': '0 0 30px rgba(108,99,255,0.2)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        analyzing: {
          '0%': { width: '20%' },
          '50%': { width: '80%' },
          '100%': { width: '20%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        analyzing: 'analyzing 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}