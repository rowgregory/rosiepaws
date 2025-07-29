'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, PawPrint, Eye } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import PetDetailsDrawer from '@/app/drawers/admin/PetDetailsDrawer'
import { setOpenPetDetailsDrawer } from '@/app/redux/features/adminSlice'
import AdminPageHeader from '@/app/components/admin/common/AdminPageHeader'
import PetsStats from '@/app/components/admin/pets/PetsStats'
import PetTypeBadge from '@/app/components/admin/pets/PetTypeBadge'
import PetStatusBadge from '@/app/components/admin/pets/PetStatusBadge'
import { getDaysSinceUpdate } from '@/app/lib/utils/admin/pets/dateUtils'
import TableHeader from '@/app/components/admin/common/TableHeader'
import { PET_COLUMNS, PET_STATUS_OPTIONS, PET_TYPE_OPTIONS } from '@/app/lib/constants/admin/pets'
import { formatDateTime } from '@/app/lib/utils/common/dateUtils'
import { petFilter } from '@/app/lib/utils/admin/pets/filterUtils'
import FilterSearch from '@/app/components/admin/form-elements/FilterSearch'

const AdminPets = () => {
  const { pets } = useAppSelector((state: RootState) => state.admin)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const dispatch = useAppDispatch()
  const filteredPets = petFilter(pets, searchTerm, typeFilter, statusFilter)

  return (
    <>
      <PetDetailsDrawer />
      <div className="bg-gray-50 min-h-screen p-6">
        <AdminPageHeader title="Pet Management" subtitle="Monitor and manage all pets in the system" />
        <PetsStats pets={pets} />
        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <FilterSearch
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search by pet name, owner, breed..."
            />

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                {PET_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              {PET_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pets Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <TableHeader columns={PET_COLUMNS} />
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredPets.map((pet, index) => {
                    const daysSinceUpdate = Math.floor(
                      (new Date().getTime() - new Date(pet.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
                    )
                    const updatedRecently = daysSinceUpdate <= 30
                    const hasNotes = pet.notes && pet.notes.length > 0

                    return (
                      <motion.tr
                        key={pet.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                              <PawPrint className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{pet.name}</p>
                              <p className="text-xs text-gray-500">{pet.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <PetTypeBadge type={pet.type} />
                            <p className="text-sm text-gray-600">{pet.breed}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <PetStatusBadge hasNotes={hasNotes} updatedRecently={updatedRecently} />
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{pet.age}</p>
                            <p className="text-sm text-gray-500">{pet.weight}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {pet.owner.firstName} {pet.owner.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{pet.owner.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-sm text-gray-900">{formatDateTime(pet.updatedAt)}</p>
                            <p className="text-sm text-gray-500">{getDaysSinceUpdate(pet.updatedAt)}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <motion.button
                              onClick={() => dispatch(setOpenPetDetailsDrawer(pet))}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredPets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No pets found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminPets
