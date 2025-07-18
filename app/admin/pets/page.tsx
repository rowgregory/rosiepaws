'use client'

import { useFetchAllPetsQuery } from '@/app/redux/services/adminApi'
import { Pet } from '@/app/types/entities'
import { motion } from 'framer-motion'
import {
  Search,
  Download,
  MoreVertical,
  PawPrint,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Heart,
  Activity
} from 'lucide-react'
import { useState } from 'react'

// Types
type PetType = 'DOG' | 'CAT'

const TypeBadge: React.FC<{ type: PetType }> = ({ type }) => {
  const typeColors: Record<PetType, string> = {
    DOG: 'bg-blue-100 text-blue-700',
    CAT: 'bg-purple-100 text-purple-700'
  }

  const typeLabels: Record<PetType, string> = {
    DOG: 'Dog',
    CAT: 'Cat'
  }

  return <span className={`px-2 py-1 rounded-lg text-xs font-medium ${typeColors[type]}`}>{typeLabels[type]}</span>
}

const StatusBadge: React.FC<{ hasNotes: boolean; updatedRecently: boolean }> = ({ hasNotes, updatedRecently }) => {
  // Determine status config based on available data
  let config: { color: string; icon: any; label: string }

  if (updatedRecently) {
    config = { color: 'green', icon: CheckCircle, label: 'Active' }
  } else if (hasNotes) {
    config = { color: 'yellow', icon: AlertCircle, label: 'Needs Attention' }
  } else {
    config = { color: 'gray', icon: Clock, label: 'Inactive' }
  }

  const Icon = config.icon

  return (
    <div
      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
        config.color === 'green'
          ? 'bg-green-100 text-green-700'
          : config.color === 'yellow'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-gray-100 text-gray-700'
      }`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </div>
  )
}

const ActionMenu: React.FC<{
  pet: Pet
  onView: (pet: Pet) => void
  onEdit: (pet: Pet) => void
  onDelete: (pet: Pet) => void
}> = ({ pet, onView, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <button
            onClick={() => {
              onView(pet)
              setIsOpen(false)
            }}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
          <button
            onClick={() => {
              onEdit(pet)
              setIsOpen(false)
            }}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Pet Info</span>
          </button>
          <button
            onClick={() => {
              onDelete(pet)
              setIsOpen(false)
            }}
            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Pet</span>
          </button>
        </div>
      )}
    </div>
  )
}

const Pets = () => {
  const { data } = useFetchAllPetsQuery(undefined)
  const pets = data?.pets
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  // Filter and sort pets
  const filteredPets = pets
    ?.filter((pet: Pet) => {
      const ownerFullName = `${pet?.owner?.firstName} ${pet?.owner?.lastName}`
      const matchesSearch =
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ownerFullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === 'all' || pet.type === typeFilter
      return matchesSearch && matchesType
    })
    .sort((a: Pet, b: Pet) => {
      let aValue: any = a[sortBy as keyof Pet]
      let bValue: any = b[sortBy as keyof Pet]

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleView = (pet: Pet) => {
    console.log('View pet:', pet)
  }

  const handleEdit = (pet: Pet) => {
    console.log('Edit pet:', pet)
  }

  const handleDelete = (pet: Pet) => {
    console.log('Delete pet:', pet)
  }

  const exportData = () => {
    console.log('Exporting pets data...')
  }

  // Calculate stats
  const activePets = pets?.filter((pet: Pet) => {
    const daysSinceUpdate = Math.floor(
      (new Date().getTime() - new Date(pet.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    )
    return daysSinceUpdate <= 30
  }).length

  const petsWithNotes = pets?.filter((pet: Pet) => pet.notes && pet.notes.length > 0).length

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pet Management</h1>
              <p className="text-gray-600 mt-1">View and manage all pets in the system</p>
            </div>
            <button
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Pets</p>
                  <p className="text-xl font-bold text-gray-900">{pets?.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Recently Active</p>
                  <p className="text-xl font-bold text-gray-900">{activePets}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">With Notes</p>
                  <p className="text-xl font-bold text-gray-900">{petsWithNotes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Unique Owners</p>
                  <p className="text-xl font-bold text-gray-900">{new Set(pets?.map((p: Pet) => p.ownerId)).size}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-2 flex-1 min-w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, owner, breed, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 border-none outline-none text-sm"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="DOG">Dogs</option>
              <option value="CAT">Cats</option>
            </select>
          </div>
        </motion.div>

        {/* Pets Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pet Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Species & Breed
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                    onClick={() => handleSort('age')}
                  >
                    Age & Weight
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPets?.map((pet: Pet, index: number) => {
                  const daysSinceUpdate = Math.floor(
                    (new Date().getTime() - new Date(pet.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
                  )
                  const updatedRecently = daysSinceUpdate <= 30
                  const hasNotes: boolean = pet.notes ? pet.notes.length > 0 : false

                  return (
                    <motion.tr
                      key={pet.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                            <PawPrint className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{pet.name}</div>
                            <div className="text-sm text-gray-500">{pet.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <TypeBadge type={pet?.type} />
                          <div className="text-sm text-gray-600">{pet.breed}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge hasNotes={hasNotes} updatedRecently={updatedRecently} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{pet?.age}</div>
                        <div className="text-sm text-gray-500">{pet?.weight}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {pet?.owner?.firstName} {pet?.owner?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{pet?.owner?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(pet?.updatedAt).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500">
                          {daysSinceUpdate === 0 ? 'Today' : `${daysSinceUpdate} days ago`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ActionMenu pet={pet} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredPets?.length === 0 && (
            <div className="text-center py-12">
              <PawPrint className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pets found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Pets
