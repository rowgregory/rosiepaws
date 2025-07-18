import { BookOpen } from 'lucide-react'
import React from 'react'

const aboutData = [
  {
    text: 'Pain Scoring'
  },
  {
    text: 'Food Intake'
  },
  {
    text: 'Medication Schedule'
  },
  {
    text: 'Blood Sugar Tracking'
  }
]

const AboutBlock = () => {
  return (
    <div className="bg-[#e6e2d8] bg-darkstripeslight bg-repeat bg-center min-h-dvh 1200:min-h-[1200px]">
      <div className="w-full h-80 relative px-4 ">
        <div className="bg-climpek bg-repeat w-full h-full absolute top-0 left-0" />
        <div className="mx-auto pt-20 relative z-20 max-w-[1200px] w-full flex flex-col items-center">
          <div className="flex items-center justify-center relative w-full gap-x-6">
            <span className="w-full h-1 bg-olivepetal" />
            <h1 className="text-[30px] font-barlowcondensed uppercase font-bold text-olivepetal whitespace-nowrap">
              Gentle goodbyes, lasting love
            </h1>
            <span className="w-full h-1 bg-olivepetal" />
          </div>
          <div className="h-10 w-10 bg-hourglass bg-center bg-no-repeat bg-contain mt-3" />
          <h2
            className="text-[100px] 1200:text-[200px] text-center font-barlowcondensed uppercase text-olivepetal font-bold mt-[-20px] 1200:mt-[-55px]"
            style={{ filter: 'drop-shadow(5px 6px 0 #c8c8a3)' }}
          >
            Rosie Paws
          </h2>
          <div className="relative bg-peachblossum text-white font-satisfy w-fit text-[27px] 1200:text-[32px] py-2 px-5 1200:mt-[-30px] ribbon-corner bg-dust bg-center bg-repeat">
            <svg width={78} height={52} className="absolute right-[calc(100%-29px)] z-[-1] -top-4">
              <defs>
                <pattern
                  id="banner_left_shape_6828dbda0afaa"
                  patternUnits="objectBoundingBox"
                  width="100%"
                  height="100%"
                >
                  <rect className="rect-pattern" x="0" y="0" width="100%" height="100%" strokeWidth="0"></rect>
                  <image
                    href="https://vintwood.cwsthemes.com/wp-content/themes/vintwood/img/patterns/shape_pattern.png"
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                  ></image>
                  <rect x="0" y="0" width="100%" height="100%" strokeWidth="0" fill="rgba(0,0,0,.15)"></rect>
                </pattern>
              </defs>
              <path
                id="banner_left_shape_6828dbda0afaa_path"
                d="M0.7,0.2l12,25.9L0.7,51.5l76.9,0.1l0.1-51.2C77.6,0.4,0.7,0.2,0.7,0.2z"
                fill="#a26f70"
              ></path>
            </svg>
            Tracking love through their final days
            <svg width={78} height={52} className="absolute left-[calc(100%-29px)] z-[-1] -top-4">
              <defs>
                <pattern id="banner_right_shape_6828f02f3cab5" patternUnits="userSpaceOnUse" width="100%" height="100%">
                  <rect className="rect-pattern" x="0" y="0" width="100%" height="100%" strokeWidth="0"></rect>
                  <image
                    href="https://vintwood.cwsthemes.com/wp-content/themes/vintwood/img/patterns/shape_pattern.png"
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                  ></image>
                  <rect x="0" y="0" width="100%" height="100%" strokeWidth="0" fill="rgba(0,0,0,.15)"></rect>
                </pattern>
              </defs>
              <path
                id="banner_right_shape_6828f02f3cab5_path"
                d="M0,0.4L0,51.6l76.9-0.1L64.9,26.1l12-25.9C76.8,0.2,0,0.4,0,0.4z"
                fill="#a26f70"
              ></path>
            </svg>
          </div>
          <div className="mt-20 grid grid-cols-12 gap-9">
            <div className="col-span-12 1200:col-span-5">
              <h1 className="inline bg-olivepetal bg-dust bg-repeat bg-cover bg-center text-[36px] text-[#eae5de] uppercase font-barlowcondensed font-bold whitespace-pre-wrap px-2 pb-2 leading-tight shadow-[-6px_0_0_#A3A380]">
                Compassionate Care Tracking for Your Dog&apos;s End-of-Life Journey
              </h1>
              <h2 className="text-lg font-merrieweather text-[#333] mt-6 tracking-wider">
                We understand how difficult this time can be, and our goal is to support you every step of the way.
              </h2>
              <ul className="mt-12">
                {aboutData.map((about, i) => (
                  <li
                    key={i}
                    className="text-lg font-merrieweather tracking-wider text-[#333] relative gap-x-4 flex items-center border-t-2 border-dashed border-t-[#D5CDC1] py-4"
                  >
                    <BookOpen className="w-5 h-5 text-peachblossum" />
                    {about.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-12 1200:col-span-7">
              <div className="bg-about bg-no-repeat bg-cover bg-center w-full h-[450px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutBlock
