import { useAppDispatch, usePetSelector, useUserSelector } from '@/app/redux/store'
import { FC } from 'react'
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit'
import { setInputs } from '@/app/redux/features/formSlice'
import { setOpenNotEnoughTokensModal } from '@/app/redux/features/appSlice'
import { setOpenNeedToUpgradeDrawer } from '@/app/redux/features/dashboardSlice'
import TokenCounter from './TokenCounter'

interface ICleanHeader {
  func: ActionCreatorWithoutPayload | null
  tokens: number
  btnText: string
  formName: string
}

const CleanHeader: FC<ICleanHeader> = ({ func, tokens, btnText, formName }) => {
  const dispatch = useAppDispatch()
  const { pets } = usePetSelector()
  const { user } = useUserSelector()

  return (
    <div className="flex items-center pt-4">
      <button
        onClick={() => {
          if ((user?.isFreeUser && user?.pets?.length === 1) || (user?.isComfortUser && user?.pets?.length === 3)) {
            dispatch(setOpenNeedToUpgradeDrawer())
          } else if (tokens > (user?.tokens ?? 0)) {
            dispatch(setOpenNotEnoughTokensModal(tokens))
          } else if (func) {
            dispatch(func())
            dispatch(
              setInputs({ formName, data: { petId: pets[0]?.id, petName: pets[0]?.name, petType: pets[0]?.type } })
            )
          }
        }}
        className="inline-flex items-center gap-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white text-sm font-medium rounded-full shadow-sm transition-all duration-200"
      >
        {btnText}
        <TokenCounter tokens={tokens} />
      </button>
    </div>
  )
}

export default CleanHeader
