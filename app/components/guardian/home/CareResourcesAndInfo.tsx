import React from 'react'
import { Heart, BookOpen, AlertTriangle, Activity, FileText, ChevronRight } from 'lucide-react'
import { useAppDispatch } from '@/app/redux/store'
import { setOpenEmergencySignsDrawer } from '@/app/redux/features/dashboardSlice'
import { setOpenDisabilityEndOfLifeCareDrawer, setOpenViewGuideDrawer } from '@/app/redux/features/appSlice'

const CareResourcesAndInfo = () => {
  const dispatch = useAppDispatch()

  return (
    <div className="mt-8">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
          <BookOpen className="w-5 h-5 mr-3 text-gray-600" />
          Care Resources & Expert Guidance
        </h2>
        <p className="text-gray-600 text-sm">
          Access professional veterinary resources and expert guides to support your pet&apos;s health journey
        </p>
      </div>

      {/* Dr. Jaci Coble's Professional Guides */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-4 h-4 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Dr. Jaci Coble&apos;s Professional Guides</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Free eBooks personally written by Sea Legs&apos; veterinarian—who specializes in palliative and
            rehabilitative pet care—to help guide end-of-life pet decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <a
            href="https://vet-ebooks.com/comfort-care-at-home"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-lg p-4 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Heart className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-md">62 Pages • PDF</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                Comfort Care at Home: A Complete Guide
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Expert strategies for creating the optimal home environment, managing pain, and providing compassionate
                end-of-life care for dogs and cats.
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">Dr. Jaci Coble, DVM</span>
              </div>
            </div>
          </a>

          <a
            href="https://vet-ebooks.com/quality-of-life-assessment"
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-lg p-4 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Activity className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-md">48 Pages • PDF</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                Quality of Life Assessment Tools
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Scientific frameworks and practical scales to objectively evaluate your pet&apos;s daily comfort,
                mobility, and overall wellbeing.
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">Dr. Jaci Coble, DVM</span>
              </div>
            </div>
          </a>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <FileText className="w-3 h-3 mr-1" />
            All eBooks are professionally authored and peer-reviewed
          </div>
        </div>
      </div>

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
