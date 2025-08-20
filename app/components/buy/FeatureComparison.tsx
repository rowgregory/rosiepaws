import { planFeatures } from '@/app/lib/constants'
import { BarChart3, Check, X } from 'lucide-react'
import React from 'react'

const FeatureComparison = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mb-16">
      <div className="bg-gray-900 px-8 py-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-white" />
          <div>
            <h2 className="text-xl font-semibold text-white">Feature Comparison</h2>
            <p className="text-gray-300 text-sm">Detailed plan capabilities overview</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[200px]">Capabilities</th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700 min-w-[140px]">
                <div className="text-center">
                  <div className="font-semibold">Free</div>
                  <div className="text-sm text-gray-500 font-normal">$0/month</div>
                </div>
              </th>
              <th className="px-6 py-4 text-center font-semibold text-blue-600 min-w-[140px]">
                <div className="text-center">
                  <div className="font-semibold">Comfort</div>
                  <div className="text-sm text-blue-500 font-normal">$10/month</div>
                  <div className="mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Most Popular</div>
                </div>
              </th>
              <th className="px-6 py-4 text-center font-semibold text-purple-600 min-w-[140px]">
                <div className="text-center">
                  <div className="font-semibold">Legacy</div>
                  <div className="text-sm text-purple-500 font-normal">$25/month</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {planFeatures.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{row.feature}</td>
                <td className="px-6 py-4 text-center">
                  {row.free === '✓' ? (
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  ) : row.free === '✗' ? (
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                      <X className="w-4 h-4 text-gray-400" />
                    </div>
                  ) : (
                    <span className="text-gray-600 text-sm font-medium">{row.free}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {row.comfort === '✓' ? (
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  ) : row.comfort === '✗' ? (
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                      <X className="w-4 h-4 text-gray-400" />
                    </div>
                  ) : (
                    <span className="text-blue-600 text-sm font-semibold">{row.comfort}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {row.legacy === '✓' ? (
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  ) : row.legacy === '✗' ? (
                    <div className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                      <X className="w-4 h-4 text-gray-400" />
                    </div>
                  ) : (
                    <span className="text-purple-600 text-sm font-semibold">{row.legacy}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FeatureComparison
