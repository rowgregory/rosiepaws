import React, { FC } from 'react'
import { setOpenPainDrawer } from '@/app/redux/features/painSlice'
import { setOpenFeedingDrawer } from '@/app/redux/features/feedingSlice'
import { setOpenMovementDrawer } from '@/app/redux/features/movementSlice'
import { setOpenNeedToUpgradeDrawer } from '@/app/redux/features/dashboardSlice'
import { setOpenVitalSignsDrawer } from '@/app/redux/features/vitalSignsSlice'
import {
  feedingCreateTokenCost,
  movementCreateTokenCost,
  painScoreCreateTokenCost,
  seizureCreateTokenCost,
  vitalSignsCreateTokenCost
} from '@/app/lib/constants/public/token'
import { useAppDispatch } from '@/app/redux/store'
import { Beaker, ChevronRight, Heart, Hospital, MapPin, Utensils, Zap } from 'lucide-react'
import { setOpenNotEnoughTokensModal } from '@/app/redux/features/appSlice'
import { IUser } from '@/app/types'
import { setOpenSeizureDrawer } from '@/app/redux/features/seizureSlice'

const quickActionsData = [
  {
    label: 'Pain Score',
    icon: <Heart className="w-5 h-5" />,
    func: setOpenPainDrawer,
    tokenCost: painScoreCreateTokenCost,
    isFree: true
  },
  {
    label: 'Feeding',
    icon: <Utensils className="w-5 h-5" />,
    func: setOpenFeedingDrawer,
    tokenCost: feedingCreateTokenCost,
    isFree: true
  },
  {
    label: 'Vital Signs',
    icon: <Hospital className="w-5 h-5" />,
    func: setOpenVitalSignsDrawer,
    tokenCost: vitalSignsCreateTokenCost,
    isFree: false
  },
  {
    label: 'Movement',
    icon: <MapPin className="w-5 h-5" />,
    func: setOpenMovementDrawer,
    tokenCost: movementCreateTokenCost,
    isFree: false
  },
  {
    label: 'Blood Sugar',
    icon: <Beaker className="w-5 h-5" />,
    func: setOpenMovementDrawer,
    tokenCost: movementCreateTokenCost,
    isFree: false
  },
  {
    label: 'Seizure',
    icon: <Zap className="w-5 h-5" />,
    func: setOpenSeizureDrawer,
    tokenCost: seizureCreateTokenCost,
    isFree: false
  }
]

const QuickActions: FC<{ user: IUser }> = ({ user }) => {
  const dispatch = useAppDispatch()

  const handleQuickAction = (action: { isFree: boolean; tokenCost: number; func: any }) => {
    if (user.isFreeUser && !action.isFree) {
      dispatch(setOpenNeedToUpgradeDrawer())
    } else if (user.tokens < action.tokenCost) {
      dispatch(setOpenNotEnoughTokensModal(action.tokenCost))
    } else {
      dispatch(action.func())
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>

      <div className="space-y-3">
        {quickActionsData.map((action) => (
          <button
            onClick={() => handleQuickAction(action)}
            key={action.label}
            className="w-full flex items-center p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700"
          >
            <div className="p-2 rounded-lg mr-3 bg-white">{action.icon}</div>
            <span className="text-sm font-medium">{action.label}</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-60" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
