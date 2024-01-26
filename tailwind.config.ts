import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "Arial", "sans-serif"],
      },
    }
  },
  plugins: [],
} satisfies Config
