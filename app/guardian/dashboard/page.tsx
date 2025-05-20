'use client'

import Title from '@/app/components/admin/Title'
import Spinner from '@/app/components/common/Spinner'
import GuardianPainScoreGraph from '@/app/components/guardian/GuardianPainScoreGraph'
import { RootState, useAppSelector } from '@/app/redux/store'
import React from 'react'

const GuardianDashboard = () => {
  const { pet, loading } = useAppSelector((state: RootState) => state.pet)

  const chartData = pet?.painScore?.map((obj: any) => ({
    date: new Date(obj.createdAt),
    score: obj.score
  }))

  return loading ? (
    <div className="w-full flex items-center justify-center pt-12">
      <Spinner fill="fill-indigo-500" track="text-white" wAndH="w-8 h-8" />
    </div>
  ) : (
    <>
      <Title title={pet?.name} />
      <GuardianPainScoreGraph chartData={chartData} />
    </>
  )
}

export default GuardianDashboard
