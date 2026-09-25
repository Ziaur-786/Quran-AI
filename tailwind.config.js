/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'islamic-dark': '#061610',
        'islamic-deep': '#0A241B',
        'islamic-emerald': '#0F4C36',
        'islamic-card': '#0c2e23',
        'islamic-gold': '#C5A059',
        'islamic-gold-light': '#F5E096',
        'islamic-gold-dark': '#8B6914',
        'islamic-cream': '#F5F1E6',
        'islamic-border': 'rgba(197, 160, 89, 0.25)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        amiri: ['Amiri', 'serif'],
        scheherazade: ['"Scheherazade New"', 'serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'pulse-subtle': 'pulseSubtle 3s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
