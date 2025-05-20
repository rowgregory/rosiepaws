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
        homeherocenterimage: "url('/images/homeherocenterimage.png')",
        homeherocenterimage2: "url('/images/homeherocenterimage2.png')",
        headerlogo: "url('/images/header-logo.png')",
        herologo: "url('/images/hero-logo.png')",
        herologo3: "url('/images/hero-logo-3.png')",
        herologo4: "url('/images/hero-logo-4.png')",
        herologo5: "url('/images/hero-logo-5.png')",
        darkstripeslight: "url('/images/dark-stripes-light.png')",
        climpek: "url('/images/climpek.png')",
        hourglass: "url('/images/hourglass.png')",
        dust: "url('/images/dust.png')",
        about: "url('/images/about.png')",
        portfoliopattern: "url('/images/portfolio-pattern.png')",
        star: "url('/images/star.png')",
        footertexture: "url('/images/footer-texture.png')",
        rosielogo: "url('/images/rosie-logo.png')"
      },
      animation: {
        rotateToTwoOClock: 'rotateToTwoOClock 375ms ease-in-out forwards',
        slowspin: 'slowspin 200s linear infinite',
        floatCloud: 'floatCloud 6s ease-in-out infinite'
      },
      keyframes: {
        rotateToTwoOClock: {
          '0%': { transform: 'rotate(0deg)' },
          '40%': { transform: 'rotate(30deg)' },
          '100%': { transform: 'rotate(0deg)' }
        },
        floatCloud: {
          '0%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-12px) translateX(5px)' },
          '50%': { transform: 'translateY(-20px) translateX(0px)' },
          '75%': { transform: 'translateY(-12px) translateX(-5px)' },
          '100%': { transform: 'translateY(0px) translateX(0px)' }
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
        merrieweather: ['var(--font-merrieweather)']
      }
    }
  },
  plugins: []
} satisfies Config
