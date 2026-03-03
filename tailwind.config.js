/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'member-bg': 'var(--member-bg)',
        'customer-bg': 'var(--customer-bg)',
        'ai-tag-bg': 'var(--ai-tag-bg)',
        'vb-bg': 'var(--vb-bg)',
        'vb-secondary-bg': 'var(--vb-secondary-bg)',
        'vb-text': 'var(--vb-text)',
        'vb-button': 'var(--vb-button)',
        'vb-accent': 'var(--vb-accent)',
        'vb-section-separator': 'var(--vb-section-separator)',
      },
    },
  },
  plugins: [require('./src/plugin.cjs')],
  darkMode: 'class',
}
