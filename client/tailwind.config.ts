import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'echo-dark': '#0a0a0f',
        'echo-darker': '#050508',
        'echo-card': '#12121a',
        'echo-border': '#1e1e2e',
        'echo-cyan': '#06b6d4',
        'echo-amber': '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
