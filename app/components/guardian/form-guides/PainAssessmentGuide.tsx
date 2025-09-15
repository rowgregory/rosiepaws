'use client'

import { painAssessmentData } from '@/public/data/guardian.data'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const PainAssessmentGuide = () => {
  const [openItems, setOpenItems] = useState(new Set([0])) // First item open by default

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  const toggleAll = () => {
    if (openItems.size === painAssessmentData.length) {
      setOpenItems(new Set()) // Close all
    } else {
      setOpenItems(new Set(painAssessmentData.map((_, index) => index))) // Open all
    }
  }
  return (
    <div className="w-full overflow-y-auto h-[calc(100dvh-65px)] mx-auto px-5 pb-5 max-w-md flex-1 border-l-1 border-l-gray-100">
      {/* Header */}
      <div className="sticky top-0 bg-white pt-4 pb-1 z-10 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Pain Assessment Chart</h3>

        {/* Toggle All Button */}
        <button onClick={toggleAll} className="text-sm text-blue-600 hover:text-blue-800 mb-3 underline">
          {openItems.size === painAssessmentData.length ? 'Collapse All' : 'Expand All'}
        </button>

        <div className="grid grid-cols-3 gap-4 my-4 font-bold text-center border-b-2 pb-2 text-sm">
          <div>Psychological & Behavioral</div>
          <div>Response to Palpation</div>
          <div>Body Tension / Action</div>
        </div>
      </div>

      {/* Accordion Items */}
      <div className="space-y-2">
        {painAssessmentData.map((data, index) => {
          const isOpen = openItems.has(index)

          return (
            <div key={data.level} className="border rounded-lg overflow-hidden" style={{ borderColor: data.color }}>
              {/* Accordion Header */}
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-5 text-white font-bold text-lg flex items-center hover:opacity-90 transition-opacity min-h-[70px]"
                style={{ backgroundColor: data.color }}
              >
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-w-0">
                  <span className="text-left truncate">Pain Level: {data.level}</span>
                  <span className="text-white bg-white bg-opacity-20 px-3 py-1 rounded-lg text-sm flex-shrink-0">
                    Tension: {data.tension}
                  </span>
                </div>
                <div className="ml-3 flex-shrink-0">
                  {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </div>
              </button>

              {/* Accordion Content */}
              {isOpen && (
                <div
                  className="grid grid-cols-3 gap-4 p-4 border-t"
                  style={{
                    borderColor: data.color,
                    backgroundColor: `${data.color}10`
                  }}
                >
                  <div>
                    <ul className="list-disc pl-5 space-y-2 text-13">
                      {data.psychological.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <ul className="list-disc pl-5 space-y-2 text-13">
                      {data.palpation.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-4 text-13">{data.tension}</p>
                    {data.actionNeeded && (
                      <div className="mt-3 bg-red-100 p-3 rounded-lg border-red-300 border">
                        <div className="font-bold text-red-800 mb-1">Action Needed:</div>
                        <div className="text-red-800 whitespace-pre-line">{data.actionNeeded}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PainAssessmentGuide
