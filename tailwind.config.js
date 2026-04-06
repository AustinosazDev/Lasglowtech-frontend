/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: { sm:'480px', md:'768px', lg:'976px', xl:'1440px' },
    extend: {
      fontFamily: {
        sans: ['Nunito Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        // CSS Variable references for dynamic theming
        textcolor:    'var(--color-text)',
        textcolor2:   'var(--color-text2)',
        Primarycolor: 'var(--color-primary)',
        Primarycolor1:'var(--color-primary1)',
        Primarycolor2:'var(--color-primary2)',
        bgcolor:      'var(--color-bg)',
        bgcolor2:     'var(--color-bg2)',
        Secondarycolor:  'var(--color-secondary)',
        Secondarycolor1: 'var(--color-secondary1)',
        Secondarycolor2: 'var(--color-secondary2)',
        muted:        'var(--color-muted)',
        // Brand colors - always available
        brand: {
          purple: '#8700ff',
          orange: '#f97316',
        },
        // Standard colors for consistency
        orange: {
          50: '#fff8f0',
          100: '#ffecdb',
          200: '#ffd4b5',
          300: '#ffbc8f',
          400: '#ffa86f',
          500: '#f97316',  // Primary orange
          600: '#ea6d0c',
          700: '#c95a0a',
          800: '#a84808',
          900: '#7a3206',
        },
      },
    },
  },
  plugins: [],
};
