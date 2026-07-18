/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: '#050510',
        primary: '#6C63FF',
        secondary: '#00D4FF',
        accent: '#FF6B9D',
        success: '#00FF94',
        danger: '#FF4444',
        glass: 'rgba(255,255,255,0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'neon-primary': 'linear-gradient(135deg, #6C63FF, #00D4FF)',
        'neon-accent': 'linear-gradient(135deg, #FF6B9D, #6C63FF)',
      },
      boxShadow: {
        'neon-primary': '0 0 20px rgba(108,99,255,0.5)',
        'neon-secondary': '0 0 20px rgba(0,212,255,0.5)',
        'neon-success': '0 0 20px rgba(0,255,148,0.5)',
        'neon-danger': '0 0 20px rgba(255,68,68,0.5)',
        glass: '0 8px 32px rgba(0,0,0,0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'glow': 'glow 1s ease-in-out',
        'count-up': 'count-up 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-neon': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(108,99,255,0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(108,99,255,0.8)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(108,99,255,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(108,99,255,1)' },
          '100%': { boxShadow: '0 0 5px rgba(108,99,255,0.3)' },
        },
        'count-up': {
          from: { opacity: '0', transform: 'scale(1.2)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
