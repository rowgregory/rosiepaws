'use client'

import { setOpenPetDrawer, setPet } from '@/app/redux/features/petSlice'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { ArrowRight, Heart, PawPrint, Plus, Sparkles } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const GuardianPetsList = () => {
  const dispatch = useAppDispatch()
  const { zeroPets, pets } = useAppSelector((state: RootState) => state.pet)

  return (
    <>
      {zeroPets ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="max-w-md mx-auto text-center">
            {/* Animated Icon Container */}
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <PawPrint className="w-10 h-10 text-white" />
              </div>
              {/* Floating sparkles */}
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
              <div className="absolute -bottom-2 -left-2">
                <Heart className="w-5 h-5 text-pink-400 animate-bounce" />
              </div>
            </div>

            {/* Content */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Your Pet Care Journey!</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Start tracking your furry friend&apos;s health, happiness, and daily activities. Every great pet care
              story begins with a single step.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => dispatch(setOpenPetDrawer())}
              className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 mx-auto transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-purple-500/25"
            >
              <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="w-3 h-3" />
              </div>
              Add Your First Pet
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-6">
          {/* Pets List */}
          <div className="space-y-3">
            {pets?.map((pet) => (
              <div
                key={pet.id}
                className="group relative bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:border-gray-300 transition-all duration-300 flex items-center justify-between"
              >
                {/* Left Side - Pet Info */}
                <div className="flex items-center gap-4">
                  {/* Pet Avatar */}
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <PawPrint className="w-7 h-7 text-white" />
                  </div>

                  {/* Pet Details */}
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{pet?.name}</h3>
                    <div className="flex items-center gap-3">
                      <p className="text-gray-600 text-sm">{pet?.breed}</p>
                      <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <Heart className="w-3 h-3" />
                        <span>Tracking Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Action */}
                <Link
                  href="/guardian/dashboard"
                  onClick={() => dispatch(setPet(pet))}
                  className="group/button flex items-center gap-2 bg-gray-50 hover:bg-purple-500 text-gray-700 hover:text-white border border-gray-200 hover:border-purple-500 rounded-xl py-2.5 px-4 font-medium transition-all duration-300 hover:shadow-md"
                >
                  <span className="text-sm">Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-300" />
                </Link>

                {/* Subtle gradient accent on hover */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default GuardianPetsList
