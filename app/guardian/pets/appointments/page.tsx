'use client'

import React from 'react'
import { RootState, useAppSelector } from '@/app/redux/store'
import ZeroLogs from '@/app/components/guardian/ZeroLogs'
import { getNextAppointment } from '@/app/lib/utils/public/my-pets/appointments/dateUtils'
import AppointmentCard from '@/app/components/guardian/appointments/AppointmentCard'
import NextAppointment from '@/app/components/guardian/appointments/NextAppointment'
import QuickOverview from '@/app/components/guardian/appointments/QuickOverview'
import RecentActivity from '@/app/components/guardian/appointments/RecentActivity'
import { appointmentCreateTokenCost } from '@/app/lib/constants/public/token'
import { setOpenAppointmentDrawer } from '@/app/redux/features/appointmentSlice'
import { useInitialAnimation } from '@/app/hooks/useInitialAnimation'
import CleanHeader from '@/app/components/guardian/CleanHeader'

const Appointments = () => {
  const { appointments, zeroAppointments } = useAppSelector((state: RootState) => state.appointment)
  const nextAppointment = getNextAppointment(appointments)

  const shouldAnimate = useInitialAnimation(appointments)

  if (zeroAppointments) {
    return (
      <ZeroLogs
        btnText="Log appointment"
        title="No appointments logged"
        subtitle="Add your pet's first appointment to keep track of their health and wellness visits."
        tokens={appointmentCreateTokenCost}
        func={setOpenAppointmentDrawer}
        formName="appointmentForm"
      />
    )
  }

  return (
    <>
      <div className="h-[calc(100dvh-96px)]">
        <div className="mx-auto px-4 space-y-8">
          {/* Header */}
          <CleanHeader
            btnText="Log Appointment"
            func={setOpenAppointmentDrawer}
            tokens={appointmentCreateTokenCost}
            formName="appointmentForm"
          />
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              {/* Next Appointment Highlight */}
              <NextAppointment nextAppointment={nextAppointment} />
              {/* All Appointments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appointments?.map((appointment, index) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    index={index}
                    shouldAnimate={shouldAnimate}
                  />
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
