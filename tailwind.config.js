/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#2B2640',
        accent: '#A855F7',
        'neon-purple': '#A855F7',
        'neon-cyan': '#06B6D4',
        'neon-magenta': '#EC4899',
        'gradient-start': '#9333EA',
        'gradient-end': '#F97316',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Roboto Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
