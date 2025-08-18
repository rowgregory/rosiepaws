import { RootState, useAppSelector } from '@/app/redux/store'
import TokensSVG from '@/public/svg/TokensSVG'
import React, { FC } from 'react'

const TokenCounter: FC<{ color1?: string; color2?: string; id?: string; tokens: number | any }> = ({
  color1 = '#fff',
  color2 = '#fff',
  id = 'whiteToWhite',
  tokens
}) => {
  const { user } = useAppSelector((state: RootState) => state.user)

  return !user?.isLegacyUser ? (
    <div className="flex items-center justify-center">
      <TokensSVG color1={color1} color2={color2} id={id} />
      <span className="text-12">{tokens}</span>
    </div>
  ) : (
    <></>
  )
}

export default TokenCounter
