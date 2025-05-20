import React from 'react'

const HomeHero = () => {
  return (
    <>
      <div className="bg-[#e8e4c5] w-full h-[970px] overflow-hidden relative flex items-center justify-center">
        <div className="bg-homeherosunrays aspect-square bg-cover bg-center bg-no-repeat w-[4000px] h-[4000px] animate-slowspin" />
        <div className="bg-homeherotexture2 bg-repeat bg-center absolute inset-0 z-10 w-full h-full" />
        <div className="bg-homeherotexture2" />
        <div className="bg-herologo5 bg-center bg-contain bg-no-repeat absolute z-20 w-full h-full max-w-[750px] max-h-[750px] flex items-center justify-center animate-floatCloud"></div>
      </div>
    </>
  )
}

export default HomeHero
