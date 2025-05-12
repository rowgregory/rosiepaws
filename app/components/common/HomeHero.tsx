import React from 'react'

const HomeHero = () => {
  return (
    <>
      <div className="bg-[#e8e4c5] w-full h-[970px] overflow-hidden relative flex items-center justify-center">
        <div className="bg-homeherosunrays aspect-square bg-cover bg-center bg-no-repeat w-[4000px] h-[4000px] animate-slowspin" />
        <div className="bg-homeherotexture2 bg-repeat bg-center absolute inset-0 z-10 w-full h-full" />
        <div className="bg-homeherotexture2" />
        <div className="bg-homeherotexture2 bg-roseblush/10 bg-center absolute z-20 rounded-full w-[400px] h-[400px] flex items-center justify-center">
          {/* <div className="bg-homeherocenterimage2 bg-center bg-contain bg-no-repeat h-[400px] w-full animate-logoFloat" /> */}
        </div>
      </div>
    </>
  )
}

export default HomeHero
