import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from "tailwindcss/plugin";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
        title: ['Chivo', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        fadein: 'fadein 1s ease-in-out both',
      },
      keyframes: {
        fadein: {
          '0%': { opacity: '0', transform: 'translateY(20%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "animation-delay": (value) => {
            return {
              "animation-delay": value,
            };
          },
        },
        {
          values: theme("transitionDelay"),
        }
      );
    }),
  ],
} satisfies Config

