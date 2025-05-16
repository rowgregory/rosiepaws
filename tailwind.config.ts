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
        foreground: 'var(--foreground)',
        olivepetal: '#A3A380',
        goldenclover: '#D7CE93',
        articdaisy: '#EFEBCE',
        roseblush: '#D8A48F',
        peachblossum: '#B88588'
      },
      maxWidth: {},
      backgroundImage: {
        homeherosunrays: "url('/images/banner-sun-rays.png')",
        homeherotexture2: "url('/images/homeherotexture2.png')",
        logonobg: "url('/images/rosie-paws-logo-nobg.png')",
        homeherocenterimage: "url('/images/homeherocenterimage.png')",
        homeherocenterimage2: "url('/images/homeherocenterimage2.png')"
      },
      animation: {
        rotateToTwoOClock: 'rotateToTwoOClock 375ms ease-in-out forwards',
        slowspin: 'slowspin 200s linear infinite',
        logoFloat: 'logoFloat 8s ease-in-out infinite'
      },
      keyframes: {
        rotateToTwoOClock: {
          '0%': { transform: 'rotate(0deg)' },
          '40%': { transform: 'rotate(30deg)' },
          '100%': { transform: 'rotate(0deg)' }
        },
        logoFloat: {
          '0%': {
            transform: 'translate(0, 0)', // Start position
            animationTimingFunction: 'cubic-bezier(0.1, 0.3, 0.3, 1)'
          },
          '25%': {
            transform: 'translate(10px, -10px)', // Move right and up, with slight scale for depth
            animationTimingFunction: 'cubic-bezier(0.7, 0.0, 0.9, 0.7)'
          },
          '50%': {
            transform: 'translate(0, 0)', // Back to starting point, with normal scale
            animationTimingFunction: 'cubic-bezier(0.1, 0.3, 0.3, 1)'
          },
          '75%': {
            transform: 'translate(-10px, 10px)', // Move left and down, with slight scale for depth
            animationTimingFunction: 'cubic-bezier(0.7, 0.0, 0.9, 0.7)'
          },
          '100%': {
            transform: 'translate(0, 0)' // Back to start
          }
        },
        slowspin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      screens: {
        480: '480px',
        768: '768px',
        980: '980px',
        1200: '1200px',
        1315: '1315px'
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
        barlowcondensed: ['var(--barlow-condensed)']
      }
    }
  },
  plugins: []
} satisfies Config
