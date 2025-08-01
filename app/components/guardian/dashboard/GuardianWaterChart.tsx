import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Droplets, Scale, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react'
import { waterGuidanceData, waterTipsData } from '../../../lib/constants/public/water'

const GuardianWaterChart = () => {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState('guidelines')

  const toggleCategory = (index: number) => {
    setExpandedCategory(expandedCategory === index ? null : index)
  }

  return (
    <div className="w-full max-w-md bg-white border-l border-gray-200 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Water Guidelines</h3>
        <p className="text-sm text-gray-600">Essential hydration reference</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'guidelines', label: 'Guidelines', icon: Droplets },
          { id: 'tips', label: 'Tips', icon: Lightbulb }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'guidelines' && (
          <div className="space-y-3">
            {waterGuidanceData.map((guide, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
                style={{ borderLeftColor: guide.color, borderLeftWidth: '4px' }}
              >
                <button
                  onClick={() => toggleCategory(index)}
                  className="w-full p-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{guide.category}</h4>
                      <p className="text-xs text-gray-600 flex items-center mt-1">
                        <Droplets size={12} className="mr-1" />
                        {guide.frequency}
                      </p>
                    </div>
                    {expandedCategory === index ? (
                      <ChevronDown size={16} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-400" />
                    )}
                  </div>
                </button>

                {expandedCategory === index && (
                  <div className="px-3 pb-3 space-y-3">
                    {/* Portions */}
                    <div>
                      <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                        <Scale size={12} className="mr-1" />
                        Daily Requirements
                      </h5>
                      <ul className="space-y-1">
                        {guide.portions.map((portion, idx) => (
                          <li key={idx} className="text-xs text-gray-600 pl-3 relative">
                            <span className="absolute left-0 top-1.5 w-1 h-1 bg-gray-400 rounded-full"></span>
                            {portion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tips */}
                    <div>
                      <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                        <Lightbulb size={12} className="mr-1" />
                        Tips
                      </h5>
                      <ul className="space-y-1">
                        {guide.tips.map((tip, idx) => (
                          <li key={idx} className="text-xs text-gray-600 pl-3 relative">
                            <span className="absolute left-0 top-1.5 w-1 h-1 bg-green-400 rounded-full"></span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Watch For */}
                    <div>
                      <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
                        <AlertTriangle size={12} className="mr-1" />
                        Watch For
                      </h5>
                      <ul className="space-y-1">
                        {guide.watchFor.map((warning, idx) => (
                          <li key={idx} className="text-xs text-gray-600 pl-3 relative">
                            <span className="absolute left-0 top-1.5 w-1 h-1 bg-red-400 rounded-full"></span>
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-4">
            {/* General Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 text-sm mb-2 flex items-center">
                <Lightbulb size={14} className="mr-2" />
                General Tips
              </h4>
              <ul className="space-y-1">
                {waterTipsData.generalTips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-blue-800 pl-3 relative">
                    <span className="absolute left-0 top-1.5 w-1 h-1 bg-blue-500 rounded-full"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Red Flags */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h4 className="font-medium text-red-900 text-sm mb-2 flex items-center">
                <AlertTriangle size={14} className="mr-2" />
                Red Flags
              </h4>
              <ul className="space-y-1">
                {waterTipsData.redFlags.map((flag, idx) => (
                  <li key={idx} className="text-xs text-red-800 pl-3 relative">
                    <span className="absolute left-0 top-1.5 w-1 h-1 bg-red-500 rounded-full"></span>
                    {flag}
                  </li>
                ))}
              </ul>
            </div>

            {/* Hydration Tips */}
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-3">
              <h4 className="font-medium text-cyan-900 text-sm mb-2 flex items-center">
                <TrendingUp size={14} className="mr-2" />
                Encourage Hydration
              </h4>
              <ul className="space-y-1">
                {waterTipsData.hydrationTips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-cyan-800 pl-3 relative">
                    <span className="absolute left-0 top-1.5 w-1 h-1 bg-cyan-500 rounded-full"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GuardianWaterChart
