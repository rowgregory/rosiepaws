import { Lock, Users } from 'lucide-react'
import React, { FC } from 'react'
import GuardianActionMenuButton from '../GuardianActionMenuButton'

interface IGalleryHeader {
  setActiveTab: any
  activeTab: string
  galleryItems: any[]
  publicMedia: any[]
}

const GalleryHeader: FC<IGalleryHeader> = ({ setActiveTab, activeTab, galleryItems, publicMedia }) => {
  const getTabCounts = () => {
    const items = activeTab === 'my-gallery' ? galleryItems : publicMedia
    return {
      total: items.length,
      images: items.filter((item: { type: string }) => item.type === 'IMAGE').length,
      videos: items.filter((item: { type: string }) => item.type === 'VIDEO').length
    }
  }

  const counts = getTabCounts()

  return (
    <div className="sticky top-0 flex items-center lg:justify-between px-6 border-b-1 border-b-gray-100 z-30 bg-white h-[64px]">
      <GuardianActionMenuButton />
      <div className="pl-4 lg:pl-0 flex items-center gap-6">
        <h1 className="text-lg lg:text-2xl font-semibold">Gallery</h1>

        {/* Tab Navigation */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('my-gallery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'my-gallery' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Lock className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden md:block">My Gallery</span>
          </button>
          <button
            onClick={() => setActiveTab('public-gallery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'public-gallery' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden md:block">Public Gallery</span>
          </button>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span>{counts.total} items</span>
          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          <span>{counts.images} photos</span>
          <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
          <span>{counts.videos} videos</span>
        </div>
      </div>
    </div>
  )
}

export default GalleryHeader
