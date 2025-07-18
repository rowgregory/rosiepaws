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
      backgroundImage: {
        homeherosunrays: "url('/images/banner-sun-rays.png')",
        homeherotexture2: "url('/images/homeherotexture2.png')",
        headerlogo: "url('/images/header-logo.png')",
        herologo5: "url('/images/hero-logo-5.png')",
        darkstripeslight: "url('/images/dark-stripes-light.png')",
        climpek: "url('/images/climpek.png')",
        hourglass: "url('/images/hourglass.png')",
        dust: "url('/images/dust.png')",
        about: "url('/images/about.png')",
        portfoliopattern: "url('/images/portfolio-pattern.png')",
        footertexture: "url('/images/footer-texture.png')",
        logo: "url('/images/rosie-logo.png')"
      },
      animation: {
        'rainbow-spin': 'rainbowSpin 8s linear infinite',
        'rainbow-spin-reverse': 'rainbowSpinReverse 12s linear infinite',
        'swirl-motion': 'swirlMotion 10s linear infinite',
        'pulse-scale': 'pulseScale 6s ease-in-out infinite',
        shimmer: 'shimmer 3s ease-in-out infinite'
      },
      keyframes: {
        rainbowSpin: {
          from: {
            transform: 'rotate(0deg)'
          },
          to: {
            transform: 'rotate(360deg)'
          }
        },
        rainbowSpinReverse: {
          from: {
            transform: 'rotate(360deg) scale(1.1)'
          },
          to: {
            transform: 'rotate(0deg) scale(1.1)'
          }
        },
        swirlMotion: {
          '0%': {
            transform: 'rotate(0deg) scale(1)'
          },
          '25%': {
            transform: 'rotate(90deg) scale(1.05)'
          },
          '50%': {
            transform: 'rotate(180deg) scale(1)'
          },
          '75%': {
            transform: 'rotate(270deg) scale(0.95)'
          },
          '100%': {
            transform: 'rotate(360deg) scale(1)'
          }
        },
        pulseScale: {
          '0%, 100%': {
            transform: 'scale(1) rotate(0deg)',
            opacity: '0.4'
          },
          '50%': {
            transform: 'scale(1.1) rotate(180deg)',
            opacity: '0.6'
          }
        },
        shimmer: {
          '0%': {
            transform: 'translateX(-100%) skewX(-15deg)'
          },
          '100%': {
            transform: 'translateX(200%) skewX(-15deg)'
          }
        }
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
