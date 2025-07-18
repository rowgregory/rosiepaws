'use client'

import React, { useState } from 'react'
import { tabs } from '@/app/lib/constants'
import TokenSystem from '@/app/components/guardian/info/TokenSystem'
import FAQ from '@/app/components/guardian/info/FAQ'
import TokenActions from '@/app/components/guardian/info/TokenActions'

const RosiePawsTokenInfo = () => {
  const [activeTab, setActiveTab] = useState('tokens')

  return (
    <>
      <div className="sticky top-0 pt-6 pl-6 border-b-1 border-b-gray-300 z-30 bg-white">
        <span className="text-2xl bg-gradient-to-r from-orange-400 via-orange-600 to-pink-600 bg-clip-text text-transparent font-semibold">
          Token Guide
        </span>
        <div className="flex items-center gap-x-4">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(tab.id)}
              className={`${activeTab === tab.id ? 'border-pink-400 text-gray-800' : 'border-transparent text-gray-500'} border-b-3 group relative flex items-center gap-2 py-2 font-medium text-sm whitespace-nowrap`}
            >
              <span className="relative z-10 font-semibold">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'tokens' && <TokenSystem />}

        {activeTab === 'faq' && <FAQ />}

        {activeTab === 'actions' && <TokenActions />}
      </div>
    </>
  )
}

export default RosiePawsTokenInfo
