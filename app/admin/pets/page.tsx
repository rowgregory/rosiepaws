'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Download,
  PawPrint,
  Users,
  Heart,
  Activity,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react'
import { RootState, useAppSelector } from '@/app/redux/store'

const TypeBadge = ({ type }: { type: string }) => {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'DOG':
        return { color: 'bg-blue-100 text-blue-800', label: 'Dog' }
      case 'CAT':
        return { color: 'bg-purple-100 text-purple-800', label: 'Cat' }
      default:
        return { color: 'bg-gray-100 text-gray-800', label: type }
    }
  }

  const config = getTypeConfig(type)

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}

const StatusBadge = ({ hasNotes, updatedRecently }: { hasNotes: any; updatedRecently: boolean }) => {
  let config: { color: string; icon: any; label: string }

  if (updatedRecently) {
    config = { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' }
  } else if (hasNotes) {
    config = { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Needs Attention' }
  } else {
    config = { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Inactive' }
  }

  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  )
}

const AdminPets = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const { pets } = useAppSelector((state: RootState) => state.admin)

  // Calculate summary stats
  const totalPets = pets?.length || 0
  const activePets =
    pets?.filter((pet) => {
      const daysSinceUpdate = Math.floor(
        (new Date().getTime() - new Date(pet.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      )
      return daysSinceUpdate <= 30
    }).length || 0
  const petsWithNotes = pets?.filter((pet) => pet.notes && pet.notes.length > 0).length || 0
  const uniqueOwners = new Set(pets?.map((p) => p.ownerId)).size || 0

  // Filter pets
  const filteredPets =
    pets?.filter((pet) => {
      const ownerFullName = `${pet.owner.firstName} ${pet.owner.lastName}`
      const matchesSearch =
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ownerFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === 'all' || pet.type === typeFilter

      const daysSinceUpdate = Math.floor(
        (new Date().getTime() - new Date(pet.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
      )
      const updatedRecently = daysSinceUpdate <= 30
      const hasNotes = pet.notes && pet.notes.length > 0

      let matchesStatus: any = true
      if (statusFilter === 'active') matchesStatus = updatedRecently
      else if (statusFilter === 'needs_attention') matchesStatus = hasNotes
      else if (statusFilter === 'inactive') matchesStatus = !updatedRecently && !hasNotes

      return matchesSearch && matchesType && matchesStatus
    }) || []

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  }

  const getDaysSinceUpdate = (updatedAt: Date) => {
    const daysSinceUpdate = Math.floor((new Date().getTime() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24))
    return daysSinceUpdate === 0 ? 'Today' : `${daysSinceUpdate} days ago`
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pet Management</h1>
            <p className="text-gray-600">Monitor and manage all pets in the system</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Heart className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Pets</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalPets}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Activity className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Recently Active</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{activePets}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">With Notes</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{petsWithNotes}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Users className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Unique Owners</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{uniqueOwners}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by pet name, owner, breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="DOG">Dogs</option>
              <option value="CAT">Cats</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="needs_attention">Needs Attention</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Pets Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pet Info
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Breed
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age & Weight
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="text-center py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
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
                          <TypeBadge type={pet.type} />
                          <p className="text-sm text-gray-600">{pet.breed}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge hasNotes={hasNotes} updatedRecently={updatedRecently} />
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
                          <p className="text-sm text-gray-900">{formatDate(pet.updatedAt)}</p>
                          <p className="text-sm text-gray-500">{getDaysSinceUpdate(pet.updatedAt)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <motion.button
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
  )
}

export default AdminPets
