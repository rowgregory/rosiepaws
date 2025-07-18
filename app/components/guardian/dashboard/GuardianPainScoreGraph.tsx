'use client'

import React, { FC } from 'react'
import { ResponsiveContainer, XAxis, YAxis, Line, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts'
import { Activity } from 'lucide-react'
import { getPainScoreColor } from '@/app/lib/utils'

const GuardianPainScoreGraph: FC<{ chartData: any }> = ({ chartData }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const latestScore = chartData?.[chartData.length - 1]?.score || '--'
  const averageScore =
    chartData?.length > 0
      ? (chartData.reduce((sum: number, item: any) => sum + item.score, 0) / chartData.length).toFixed(1)
      : '--'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pain Score Tracking</h3>
            <p className="text-sm text-gray-600">Monitor your pet&apos;s pain levels over time</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-red-600">{latestScore}</div>
          <div className="text-sm text-gray-500">Latest Score</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="50%" stopColor="#f04843" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <Area
            dataKey="score"
            stroke="#f59e0b"
            strokeWidth={3}
            fill="url(#painGradient)"
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
          />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <YAxis
            dataKey="score"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            domain={[0, 4]}
            label={{ value: 'Pain Level', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              maxWidth: '300px'
            }}
            formatter={(value: number, name: string, props: any) => {
              const data = props.payload
              return [
                <div key="tooltip" className="space-y-1">
                  <div className="font-semibold text-red-600">{value}/4 Pain Score</div>
                  {data.symptoms && (
                    <div>
                      <strong>Symptoms:</strong> {data.symptoms}
                    </div>
                  )}
                  {data.location && (
                    <div>
                      <strong>Location:</strong> {data.location}
                    </div>
                  )}
                  {data.triggers && (
                    <div>
                      <strong>Triggers:</strong> {data.triggers}
                    </div>
                  )}
                  {data.relief && (
                    <div>
                      <strong>Relief:</strong> {data.relief}
                    </div>
                  )}
                  {data.notes && (
                    <div>
                      <strong>Notes:</strong> {data.notes}
                    </div>
                  )}
                </div>,
                'Pain Details'
              ]
            }}
          />
          <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" opacity={0.6} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="url(#painLineGradient)"
            strokeWidth={3}
            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, stroke: '#f59e0b', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-lg font-bold text-red-600">{latestScore}</div>
          <div className="text-xs text-gray-600">Current</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">{averageScore}</div>
          <div className="text-xs text-gray-600">Average</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-gray-600">{chartData?.length || 0}</div>
          <div className="text-xs text-gray-600">Recordings</div>
        </div>
      </div>

      {/* Recent Pain Details */}
      {chartData?.length > 0 && (
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-4">Recent Pain Assessments</h4>
          <div className="space-y-3">
            {chartData
              ?.slice(-3)
              .map((pain: any, index: number) => (
                <div key={index} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`font-semibold ${getPainScoreColor(pain.score)}`}>{pain.score}/4</span>
                        <span className="text-sm text-gray-500">{formatDate(pain.date)}</span>
                      </div>

                      {pain.symptoms && (
                        <p className="text-sm text-gray-700 mb-1">
                          <strong>Symptoms:</strong> {pain.symptoms}
                        </p>
                      )}

                      {pain.location && (
                        <p className="text-sm text-gray-700 mb-1">
                          <strong>Location:</strong> {pain.location}
                        </p>
                      )}

                      {pain.triggers && (
                        <p className="text-sm text-gray-700 mb-1">
                          <strong>Triggers:</strong> {pain.triggers}
                        </p>
                      )}

                      {pain.relief && (
                        <p className="text-sm text-gray-700 mb-1">
                          <strong>Relief:</strong> {pain.relief}
                        </p>
                      )}

                      {pain.notes && (
                        <p className="text-sm text-gray-600">
                          <strong>Notes:</strong> {pain.notes}
                        </p>
                      )}
                    </div>
                    <Activity className="w-5 h-5 text-red-500 flex-shrink-0" />
                  </div>
                </div>
              ))
              .reverse()}
          </div>
        </div>
      )}
    </div>
  )
}

export default GuardianPainScoreGraph
