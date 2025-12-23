import type { Config } from 'tailwindcss'

const config: Config = {
  // 启用 dark mode，使用 class 策略
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#1e293b',
      },
    },
  },
  plugins: [],
}
export default config
