'use client'

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface ChartData {
  date: string
  thisWeek: number
  lastWeek: number
}

const generateDateLabels = (): string[] => {
  const dates: string[] = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')}`
    dates.push(formattedDate)
  }
  return dates
}

const generateData = (): ChartData[] => {
  const dates = generateDateLabels()
  return dates.map((date) => ({
    date,
    thisWeek: Math.floor(Math.random() * 100),
    lastWeek: Math.floor(Math.random() * 100)
  }))
}

const formatDateLong = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', { month: 'long', day: 'numeric' }) // e.g., May 8
}

const GrossVolumeWeekOverWeekChart: React.FC = () => {
  const [data, setData] = useState<ChartData[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    setData(generateData())
  }, [])

  const ticks = data.length > 0 ? [data[0].date, data[data.length - 1].date] : []

  const formatTick = (tick: string) => {
    if (!tick) return ''
    return formatDateLong(tick)
  }

  const formatTooltipLabel = (label: string) => {
    const date = new Date(label)
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' }
    return date.toLocaleDateString(undefined, options) // e.g., "May 14"
  }

  const formatDateMinus7 = (label: string) => {
    const date = new Date(label)
    date.setDate(date.getDate() - 7)
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' }
    return date.toLocaleDateString(undefined, options) // e.g., "May 7"
  }

  const handleMouseMove = (e: any) => {
    if (e.isTooltipActive && e.activePayload) {
      const activeDate = e.activePayload[0].payload.date
      const idx = data.findIndex((d) => d.date === activeDate)
      setActiveIndex(idx)
    } else {
      setActiveIndex(null)
    }
  }

  return (
    <ResponsiveContainer width="100%" height={200} className="mt-10">
      <LineChart data={data} onMouseMove={handleMouseMove} margin={{ left: 20, right: 20 }}>
        <XAxis
          dataKey="date"
          ticks={ticks}
          tickFormatter={formatTick}
          axisLine={{ stroke: '#6467f8' }}
          interval={0}
          tickLine={false}
          tick={{ fontSize: 12 }}
        />
        <YAxis hide />
        <Tooltip
          labelFormatter={() => {
            return ''
          }}
          formatter={(value, name, props) => {
            if (name === 'thisWeek') {
              // Show full date + value for this week
              return [`${formatTooltipLabel(props.payload.date)} - $${value}`]
            }
            if (name === 'lastWeek') {
              // Show last week’s date + value
              return [`${formatDateMinus7(props.payload.date)} -  $${value}`]
            }
          }}
          wrapperStyle={{ pointerEvents: 'none' }}
          contentStyle={{
            fontSize: 12,
            borderRadius: 10,
            padding: '6px 10px',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
          itemStyle={{
            margin: '2px 0',
            padding: 0
          }}
        />
        {/* Invisible lines to keep tooltip working */}
        <Line type="monotone" dataKey="thisWeek" stroke="#8884d8" strokeOpacity={0} />
        <Line type="monotone" dataKey="lastWeek" stroke="#333" strokeOpacity={0} />
        {/* ReferenceLine for hovered date */}
        {activeIndex !== null && data[activeIndex] && (
          <ReferenceLine x={data[activeIndex].date} stroke="#dedede" strokeDasharray="3 3" />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default GrossVolumeWeekOverWeekChart
