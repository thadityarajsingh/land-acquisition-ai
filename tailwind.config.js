/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: {
            DEFAULT: '#1E3A8A',
            dark: '#0F172A',
            light: '#2563EB',
            subtle: '#EFF6FF',
          },
          saffron: {
            DEFAULT: '#F97316',
            hover: '#EA580C',
            light: '#FFF7ED',
            border: '#FED7AA',
          },
          slate: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
          }
        },
        risk: {
          low: {
            DEFAULT: '#10B981',
            bg: '#ECFDF5',
            border: '#A7F3D0',
            text: '#065F46'
          },
          medium: {
            DEFAULT: '#F59E0B',
            bg: '#FFFBEB',
            border: '#FDE68A',
            text: '#92400E'
          },
          high: {
            DEFAULT: '#EF4444',
            bg: '#FEF2F2',
            border: '#FECACA',
            text: '#991B1B'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
