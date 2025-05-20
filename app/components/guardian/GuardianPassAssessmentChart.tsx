'use client'

import { painAssessmentData } from '@/public/data/guardian.data'

const GuardianPainAssessmentChart = () => {
  return (
    <div className="overflow-y-auto h-[calc(100dvh-65px)] mx-auto p-5 bg-[#f6f5f7] flex-1">
      <h1 className="text-3xl font-bold text-center mb-8">Pain Assessment Chart</h1>
      <div className="grid grid-cols-3 gap-4 mb-6 font-bold text-center border-b-2 pb-2 text-sm">
        <div>Psychological & Behavioral</div>
        <div>Response to Palpation</div>
        <div>Body Tension / Action</div>
      </div>
      {painAssessmentData.map((data) => (
        <div key={data.level} className="mb-8">
          <div
            className="w-full p-4 text-white font-bold text-xl rounded-t-lg flex justify-between items-center"
            style={{ backgroundColor: data.color }}
          >
            <span>Pain Level: {data.level}</span>
            <span className="text-white bg-white bg-opacity-20 px-3 py-1 rounded-lg text-base">
              Tension: {data.tension}
            </span>
          </div>
          <div
            className="grid grid-cols-3 gap-4 p-4 border-l border-r border-b rounded-b-lg"
            style={{ borderColor: data.color, backgroundColor: `${data.color}10` }}
          >
            <div>
              <h3 className="font-bold mb-2 text-15">Psychological & Behavioral:</h3>
              <ul className="list-disc pl-5 space-y-2 text-13">
                {data.psychological.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-15">Response to Palpation:</h3>
              <ul className="list-disc pl-5 space-y-2 text-13">
                {data.palpation.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-15">Body Tension:</h3>
              <p className="mb-4 text-13">{data.tension}</p>
              {data.actionNeeded && (
                <div className="mt-3 bg-red-100 p-3 rounded-lg border-red-300 border">
                  <div className="font-bold text-red-800 mb-1">Action Needed:</div>
                  <div className="text-red-800 whitespace-pre-line">{data.actionNeeded}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default GuardianPainAssessmentChart
