import { Pet } from '@/app/types'
import { Activity, Calendar, Droplets, Heart, TrendingUp, Utensils } from 'lucide-react'
import React, { FC } from 'react'

const WeeklyMetrics: FC<{ pet: Pet }> = ({ pet }) => {
  const thisWeeksPainScoring = pet?.painScores?.filter(
    (p) => new Date(p.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length

  const thisWeeksFeedings = pet?.feedings?.filter(
    (f) => new Date(f.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length

  const thisWeeksWaterIntakes = pet?.waters?.filter(
    (w) => new Date(w.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length

  const thisWeeksVitalSigns = pet?.vitalSigns?.filter(
    (v) => new Date(v.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length

  const thisWeeksAppointments = pet?.appointments?.filter(
    (v) => new Date(v.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length

  const totalMedications = pet?.medications?.length

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Weekly Summary</h2>
        <TrendingUp className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <Activity className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Pain Scoring</p>
              <p className="text-xs text-gray-500">This week</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-gray-900">{thisWeeksPainScoring}</p>
            <p className="text-xs text-gray-500">entries</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <Utensils className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Feedings</p>
              <p className="text-xs text-gray-500">This week</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-gray-900">{thisWeeksFeedings}</p>
            <p className="text-xs text-gray-500">meals</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <Droplets className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Water Intakes</p>
              <p className="text-xs text-gray-500">This week</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-gray-900">{thisWeeksWaterIntakes}</p>
            <p className="text-xs text-gray-500">intakes</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <Heart className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Vital Signs</p>
              <p className="text-xs text-gray-500">Comfort</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-gray-900">{thisWeeksVitalSigns}</p>
            <p className="text-xs text-gray-500">entries</p>
          </div>
        </div>

        {pet?.appointments?.length > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                <Heart className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Appointments</p>
                <p className="text-xs text-gray-500">Comfort</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-gray-900">{thisWeeksAppointments}</p>
              <p className="text-xs text-gray-500 lowercase">{pet?.appointments[0]?.serviceType} (most recent)</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <Calendar className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Medications</p>
              <p className="text-xs text-gray-500">Legacy</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold text-gray-900">{totalMedications}</p>
            <p className="text-xs text-gray-500">prescribed</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeeklyMetrics
