import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        // Custom breakpoints to match useWindowSize hook
        'sm': '640px',   // Small devices (default)
        'md': '768px',   // Medium devices - matches isMobile/isTablet breakpoint
        'lg': '1024px',  // Large devices - matches tablet breakpoint
        'xl': '1280px',  // Extra large devices - matches isDesktop breakpoint
        '2xl': '1536px', // 2X large devices (default)
      },
      fontFamily: {
        'pixel': ['Press Start 2P', 'cursive'],
        'mono': ['Press Start 2P', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
