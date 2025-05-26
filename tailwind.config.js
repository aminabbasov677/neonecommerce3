/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: '#00d1ff',
          green: '#00ffc3',
          pink: '#ff00c3',
          purple: '#9d00ff',
        },
        dark: {
          100: '#252525',
          200: '#1a1a1a',
          300: '#0a0a0a',
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        accent: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Orbitron"', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 5px rgba(0, 209, 255, 0.5), 0 0 20px rgba(0, 209, 255, 0.3)',
        'neon-green': '0 0 5px rgba(0, 255, 195, 0.5), 0 0 20px rgba(0, 255, 195, 0.3)',
        'neon-pink': '0 0 5px rgba(255, 0, 195, 0.5), 0 0 20px rgba(255, 0, 195, 0.3)',
        'neon-purple': '0 0 5px rgba(157, 0, 255, 0.5), 0 0 20px rgba(157, 0, 255, 0.3)',
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 209, 255, 0.5), 0 0 20px rgba(0, 209, 255, 0.3)' },
          '50%': { boxShadow: '0 0 10px rgba(0, 209, 255, 0.8), 0 0 30px rgba(0, 209, 255, 0.6)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        holoShine: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        glitch: 'glitch 0.5s infinite linear alternate',
        holoShine: 'holoShine 2s infinite linear',
      },
    },
  },
  plugins: [],
};