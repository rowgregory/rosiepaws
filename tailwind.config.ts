import type { Config } from 'tailwindcss'

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      },
      backgroundImage: {
        logo: "url('/images/rosie-logo.png')"
      },
      screens: {
        480: '480px',
        768: '768px',
        980: '980px',
        1200: '1200px',
        1315: '1315px',
        short: { raw: '(max-height: 750px)' }
      },
      borderWidth: {
        1: '1px',
        3: '3px'
      },
      fontSize: {
        10: '10px',
        11: '11px',
        12: '12px',
        13: '13px',
        15: '15px',
        17: '17px',
        18: '18px',
        19: '19px',
        20: '20px',
        21: '21px',
        22: '22px',
        23: '23px',
        25: '25px',
        27: '27px',
        30: '30px'
      },
      boxShadow: {},
      height: {},
      maxHeight: {},
      fontFamily: {
        inter: ['var(--font-inter)'],
        barlowcondensed: ['var(--font-barlow-condensed)'],
        satisfy: ['var(--font-satisfy)'],
        merrieweather: ['var(--font-merrieweather)'],
        sora: ['var(--font-sora)']
      }
    }
  },
  plugins: []
} satisfies Config
