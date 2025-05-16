import GrossVolumeLineChart from '@/app/components/admin/graphs/GrossVolumeLineChart'
import GrossVolumeWeekOverWeekChart from '@/app/components/admin/graphs/GrossVolumeWeekOverWeekChart'
import Title from '@/app/components/admin/Title'
import React from 'react'

const Dashboard = () => {
  return (
    <>
      <Title title="Today" />
      <div className="w-full bg-zinc-200 h-[1px] mt-3 mb-10" />
      <div className="grid grid-cols-[1fr] md:grid-cols-[9fr_3fr] gap-x-10">
        <div>
          <h1 className="text-sm mt-5">Gross Volume</h1>
          <GrossVolumeLineChart />
          <div className="mt-10 mb-16">
            <h2 className="text-sm text-[#4d4d51] mb-1">USD balance</h2>
            <h2 className="text-[20px] text-[#69707c]">$10,000.00</h2>
          </div>
        </div>
        <div className="h-40 bg-[#f6f5f7] rounded-lg w-full">
          <h1 className="font-bold p-4 text-[#36383d]">Summary Stats</h1>
        </div>
      </div>
      <Title title="Your overview" />
      <div className="w-full bg-zinc-200 h-[1px] mt-3 mb-10" />
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-20">
        <h1 className="text-[#1d2022] font-bold">Payments</h1>
        <div>
          <h1 className="text-[#1d2022] font-bold">Gross volume</h1>
          <GrossVolumeWeekOverWeekChart />
        </div>
        <div>
          <h1 className="text-[#1d2022] font-bold">Net volume from sales</h1>
          <GrossVolumeWeekOverWeekChart />
        </div>
      </div>
    </>
  )
}

export default Dashboard
