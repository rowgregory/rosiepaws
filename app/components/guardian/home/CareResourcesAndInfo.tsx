import React from 'react'
import { Heart, BookOpen, AlertTriangle, ChevronRight } from 'lucide-react'
import { useAppDispatch } from '@/app/redux/store'
import { setOpenEmergencySignsDrawer } from '@/app/redux/features/dashboardSlice'
import { setOpenDisabilityEndOfLifeCareDrawer, setOpenViewGuideDrawer } from '@/app/redux/features/appSlice'

const CareResourcesAndInfo = () => {
  const dispatch = useAppDispatch()

  return (
    <div className="mt-8">
      {/* Emergency & Support Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="font-medium text-gray-900">Emergency Signs</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Know when to seek immediate veterinary care</p>
          <button
            onClick={() => dispatch(setOpenEmergencySignsDrawer())}
            className="w-full flex items-center justify-center px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm rounded-lg transition-colors group cursor-pointer"
          >
            View Guide
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900">Learn How To Log a Pet</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Step by step</p>
          <button
            onClick={() => dispatch(setOpenViewGuideDrawer())}
            className="w-full flex items-center justify-center px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm rounded-lg transition-colors group cursor-pointer"
          >
            View Guide
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Heart className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900">Special Care Guide</h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">Support for disabilities and end-of-life care</p>
          <button
            onClick={() => dispatch(setOpenDisabilityEndOfLifeCareDrawer())}
            className="w-full flex items-center justify-center px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm rounded-lg transition-colors group cursor-pointer"
          >
            View Guide
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CareResourcesAndInfo
