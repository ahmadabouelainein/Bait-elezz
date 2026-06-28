import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fdf8f0',
          100: '#faefd9',
          200: '#f3d9a8',
          300: '#e8bb6e',
          400: '#d9994a',
          500: '#c8975a',
          600: '#b07d42',
          700: '#8f6234',
          800: '#6e4b2a',
          900: '#5c3d1e',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config
