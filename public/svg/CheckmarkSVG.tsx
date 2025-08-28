import React from 'react'

const CheckmarkSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      className="w-5 h-5 text-lime-500 fixed bottom-9 left-10 z-[120]"
    >
      <circle cx="12" cy="12" r="10" className="fill-lime-500" />
      <path
        d="M9 12.5l2 2 4-4"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default CheckmarkSVG
