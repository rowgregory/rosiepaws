import TokensSVG from '@/public/svg/TokensSVG'
import React, { FC } from 'react'

const TokenCounter: FC<{ color1?: string; color2?: string; id?: string; tokens: number }> = ({
  color1 = '#fff',
  color2 = '#fff',
  id = 'whiteToWhite',
  tokens
}) => {
  return (
    <div className="flex items-center justify-center">
      <TokensSVG color1={color1} color2={color2} id={id} />
      <span className="text-12">{tokens}</span>
    </div>
  )
}

export default TokenCounter
