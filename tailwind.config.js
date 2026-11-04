/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      colors: {
        // Fuzion Academy Brand Colors (from design screenshots + logo)
        brand: {
          navy:    '#1a2b6b',   // Primary text, headings
          purple:  '#6356e8',   // Accent, buttons, links
          'purple-dark': '#4f43c8',
          pink:    '#ec4899',   // CTA gradient end, badges
          'pink-dark': '#c2185b',
          green:   '#4caf50',   // Logo green (use sparingly)
          lavender:'#f0f1ff',   // Page background
          'lavender-dark': '#e8e9ff',
        },
        // Extended semantic tokens
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6356e8',
          600: '#4f43c8',
          700: '#3730a3',
          800: '#312e81',
          900: '#1a2b6b',
        },
        accent: {
          pink:   '#ec4899',
          purple: '#8b5cf6',
          teal:   '#14b8a6',
          amber:  '#f59e0b',
          emerald:'#10b981',
          rose:   '#f43f5e',
        },
      },
      backgroundImage: {
        'brand-gradient':    'linear-gradient(135deg, #6356e8 0%, #9333ea 50%, #ec4899 100%)',
        'hero-gradient':     'linear-gradient(135deg, #1a2b6b 0%, #6356e8 50%, #ec4899 100%)',
        'card-gradient':     'linear-gradient(135deg, #f0f1ff 0%, #fce7f3 100%)',
        'dark-gradient':     'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
        'admin-gradient':    'linear-gradient(135deg, #1a2b6b 0%, #312e81 100%)',
        'teacher-gradient':  'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
      },
      boxShadow: {
        'brand':     '0 4px 24px rgba(99, 86, 232, 0.25)',
        'brand-lg':  '0 8px 40px rgba(99, 86, 232, 0.35)',
        'card':      '0 2px 16px rgba(26, 43, 107, 0.08)',
        'card-hover':'0 8px 32px rgba(26, 43, 107, 0.16)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-out',
        'slide-up':    'slideUp 0.4s ease-out',
        'slide-down':  'slideDown 0.3s ease-out',
        'scale-in':    'scaleIn 0.2s ease-out',
        'pulse-glow':  'pulseGlow 2s ease-in-out infinite',
        'float':       'float 4s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'bounce-soft': 'bounceSoft 1s ease-in-out infinite',
        'wave-bar':    'waveBar 0.75s ease-in-out infinite',
        'spin-slow':   'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn:     { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:    { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown:  { '0%': { opacity: '0', transform: 'translateY(-16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:    { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        pulseGlow:  { '0%,100%': { boxShadow: '0 0 15px rgba(99, 86, 232, 0.4)' }, '50%': { boxShadow: '0 0 30px rgba(236, 72, 153, 0.6)' } },
        float:      { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer:    { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        bounceSoft: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
        waveBar:    { '0%,100%': { height: '6px' }, '50%': { height: '24px' } },
      },
    },
  },
  plugins: [],
};
