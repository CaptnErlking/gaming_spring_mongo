/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Gaming theme colors
        'gaming-dark': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#0b0f14',
        },
        'neon': {
          cyan: '#00ffd1',
          magenta: '#ff00ff',
          purple: '#8a2be2',
          blue: '#00bfff',
          green: '#00ff00',
        },
        'accent': {
          primary: '#00ffd1',
          secondary: '#8a2be2',
          tertiary: '#ff00ff',
        }
      },
      fontFamily: {
        'gaming': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Orbitron', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00ffd1, 0 0 10px #00ffd1, 0 0 15px #00ffd1' },
          '100%': { boxShadow: '0 0 10px #00ffd1, 0 0 20px #00ffd1, 0 0 30px #00ffd1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
