import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        oxanium: ['var(--font-oxanium)', 'sans-serif'],
        mulish: ['var(--font-mulish)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
