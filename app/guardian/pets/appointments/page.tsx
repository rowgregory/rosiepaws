'use client'

import React from 'react'
import { RootState, useAppSelector } from '@/app/redux/store'
import { setOpenAppointmentDrawer } from '@/app/redux/features/petSlice'
import ZeroLogs from '@/app/components/guardian/ZeroLogs'
import CleanHeader from '@/app/components/guardian/navigation/CleanHeader'
import { getNextAppointment } from '@/app/lib/utils/appointment'
import AppointmentCard from '@/app/components/guardian/appointments/AppointmentCard'
import NextAppointment from '@/app/components/guardian/appointments/NextAppointment'
import QuickOverview from '@/app/components/guardian/appointments/QuickOverview'
import RecentActivity from '@/app/components/guardian/appointments/RecentActivity'
import { appointmentCreateTokenCost } from '@/app/lib/constants/token'

const Appointments = () => {
  const { appointments, zeroAppointments } = useAppSelector((state: RootState) => state.pet)
  const nextAppointment = getNextAppointment(appointments)

  if (zeroAppointments) {
    return (
      <ZeroLogs
        btnText="Add appointment"
        title="No appointments"
        subtitle="Add your pet's first appointment to keep track of their health and wellness visits."
        tokens={appointmentCreateTokenCost}
        func={setOpenAppointmentDrawer}
      />
    )
  }

  return (
    <>
      <div className="h-[calc(100dvh-96px)]">
        <div className="mx-auto px-6 space-y-8">
          {/* Header */}
          <CleanHeader btnText="Log Appointment" func={setOpenAppointmentDrawer} tokens={appointmentCreateTokenCost} />
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              {/* Next Appointment Highlight */}
              {nextAppointment && <NextAppointment nextAppointment={nextAppointment} />}
              {/* All Appointments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appointments?.map((appointment, index) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} index={index} />
                ))}
              </div>
            </div>
            {/* Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              {/* Quick Overview */}
              <QuickOverview appointments={appointments} nextAppointment={nextAppointment} />
              {/* Recent Activity */}
              <RecentActivity appointments={appointments} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Appointments
