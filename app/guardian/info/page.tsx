'use client'

import { useState } from 'react'
import { tabs } from '@/app/lib/constants'
import FAQ from '@/app/components/guardian/info/FAQ'
import TokenActions from '@/app/components/guardian/info/TokenActions'
import GuardianActionMenuButton from '@/app/components/guardian/GuardianActionMenuButton'

const RosiePawsTokenInfo = () => {
  const [activeTab, setActiveTab] = useState('actions')

  return (
    <div>
      <div className="sticky top-0 flex items-center lg:justify-between px-6 border-b-1 border-b-gray-100 z-30 bg-white h-[64px]">
        <GuardianActionMenuButton />
        <div className="pl-4 lg:pl-0 flex items-center gap-6">
          <h1 className="text-lg lg:text-2xl font-semibold">Info</h1>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(tab.id)}
                className={`${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'} flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all`}
              >
                {tab.icon}
                <span className="hidden md:block">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Tab Content */}
      <div className="h-[calc(100dvh-64px)] bg-gray-50">
        {activeTab === 'actions' && <TokenActions />}
        {activeTab === 'faq' && <FAQ />}
      </div>
    </div>
  )
}

export default RosiePawsTokenInfo
