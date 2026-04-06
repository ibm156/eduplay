/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
        dm:   ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        accent:  '#6C63FF',
        accent2: '#00D4AA',
        surface: '#13161D',
        card:    '#191C26',
        dim:     '#252836',
        dim2:    '#2E3245',
        muted:   '#7B82A0',
        subtle:  '#3A3F5C',
      },
      borderRadius: { xl: '0.75rem', '2xl': '1rem', '3xl': '1.25rem' },
    },
  },
  plugins: [],
}
