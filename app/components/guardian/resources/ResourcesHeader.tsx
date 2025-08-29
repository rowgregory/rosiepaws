import { Lock, Users } from 'lucide-react'
import React, { FC } from 'react'
import GuardianActionMenuButton from '../GuardianActionMenuButton'

interface IResourcesHeader {
  setActiveTab: any
  activeTab: string
  available: any[]
  locked: any[]
}

const ResourcesHeader: FC<IResourcesHeader> = ({ setActiveTab, activeTab, available, locked }) => {
  const getTabCounts = () => {
    const items = activeTab === 'available' ? available : locked
    return {
      total: items?.length,
      ebooks: items?.filter((item: { type: string }) => item.type === 'EBOOK').length,
      posters: items?.filter((item: { type: string }) => item.type === 'POSTER').length,
      documents: items?.filter((item: { type: string }) => item.type === 'DOCUMENT').length
    }
  }

  const counts = getTabCounts()

  return (
    <div className="sticky top-0 flex items-center justify-between px-4 lg:px-6 border-b-1 border-b-gray-100 z-30 bg-white h-[64px]">
      <GuardianActionMenuButton />
      <div className="pl-4 lg:pl-0 flex items-center gap-6">
        <h1 className="text-lg lg:text-2xl font-semibold">Resources</h1>

        {/* Tab Navigation */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'available' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lock className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden md:block">Available Resources</span>
          </button>
          <button
            onClick={() => setActiveTab('locked')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'locked' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden md:block">Locked Resources</span>
          </button>
        </div>
      </div>
      <div className="hidden xl:block">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span>{counts.posters} posters</span>
          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          <span>{counts.ebooks} ebooks</span>
          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          <span>{counts.documents} documents</span>
        </div>
      </div>
    </div>
  )
}

export default ResourcesHeader
