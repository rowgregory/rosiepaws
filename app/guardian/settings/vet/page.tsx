'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  useGetVetQuery,
  useCreateVetMutation,
  useUpdateVetMutation,
  useDeleteVetMutation
} from '@/app/redux/services/vetApi'
import {
  selectIsEditingVet,
  selectVetOperationStatus,
  selectHasUnsavedChanges,
  setEditingVet,
  setFormDirty,
  resetOperationStatus
} from '@/app/redux/features/vetSlice'
import { VetFormData } from '@/app/types/vet'

const VeterinarianProfile = () => {
  const dispatch = useDispatch()

  // RTK Query hooks - no userId needed since it's grabbed from header
  const { data: vetResponse, isLoading: isLoadingVet, error: vetError } = useGetVetQuery()
  const [createVet] = useCreateVetMutation()
  const [updateVet] = useUpdateVetMutation()
  const [deleteVet] = useDeleteVetMutation()

  // Redux state selectors
  const isEditingVet = useSelector(selectIsEditingVet)
  const operationStatus = useSelector(selectVetOperationStatus)
  const hasUnsavedChanges = useSelector(selectHasUnsavedChanges)

  // Local form state
  const [formData, setFormData] = useState<VetFormData>({
    vetName: '',
    clinicName: '',
    phone: '',
    emergencyPhone: '',
    email: '',
    address: '',
    website: '',
    hours: '',
    notes: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Derived state
  const hasVet = !!vetResponse?.vet
  const vetData = vetResponse?.vet
  const isLoading = operationStatus.isCreating || operationStatus.isUpdating || operationStatus.isDeleting

  // Populate form when vet data is loaded
  useEffect(() => {
    if (vetData) {
      const newFormData = {
        vetName: vetData.vetName || '',
        clinicName: vetData.clinicName || '',
        phone: vetData.phone || '',
        emergencyPhone: vetData.emergencyPhone || '',
        email: vetData.email || '',
        address: vetData.address || '',
        website: vetData.website || '',
        hours: vetData.hours || '',
        notes: vetData.notes || ''
      }
      setFormData(newFormData)
    }
  }, [vetData])

  // Handle success message display
  useEffect(() => {
    if (operationStatus.lastOperationSuccess) {
      setShowSuccessMessage(true)
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
        dispatch(resetOperationStatus())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [operationStatus.lastOperationSuccess, dispatch])

  // Clear errors when operation succeeds
  useEffect(() => {
    if (operationStatus.lastOperationSuccess) {
      setErrors({})
    }
  }, [operationStatus.lastOperationSuccess])

  const handleInputChange = (field: keyof VetFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    dispatch(setFormDirty(true))

    // Clear field-specific error
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.vetName.trim()) {
      newErrors.name = 'Veterinarian name is required'
    }
    if (!formData.clinicName.trim()) {
      newErrors.clinicName = 'Clinic name is required'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      if (hasVet) {
        // Update existing vet - just pass the form data
        await updateVet(formData).unwrap()
      } else {
        // Create new vet - just pass the form data
        await createVet(formData).unwrap()
      }
    } catch (error: any) {
      setErrors({
        general: error?.data?.message || 'Failed to save veterinarian information'
      })
    }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmCancel = confirm('You have unsaved changes. Are you sure you want to cancel?')
      if (!confirmCancel) return
    }

    if (hasVet && vetData) {
      // Reset to original data
      setFormData({
        vetName: vetData.vetName || '',
        clinicName: vetData.clinicName || '',
        phone: vetData.phone || '',
        emergencyPhone: vetData.emergencyPhone || '',
        email: vetData.email || '',
        address: vetData.address || '',
        website: vetData.website || '',
        hours: vetData.hours || '',
        notes: vetData.notes || ''
      })
    }

    dispatch(setEditingVet(false))
    setErrors({})
  }

  const handleEdit = () => {
    dispatch(setEditingVet(true))
  }

  const handleDelete = async () => {
    const confirmDelete = confirm(
      'Are you sure you want to delete your veterinarian information? This action cannot be undone.'
    )
    if (!confirmDelete) return

    try {
      // No parameters needed - userId grabbed from header
      await deleteVet().unwrap()
    } catch (error: any) {
      setErrors({
        general: error?.data?.message || 'Failed to delete veterinarian information'
      })
    }
  }

  const handleCall = (phoneNumber: string) => {
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '')
    window.location.href = `tel:${cleanPhone}`
  }

  const handleDirections = () => {
    const encodedAddress = encodeURIComponent(formData?.address ?? '')
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank')
  }

  const handleWebsite = () => {
    const url = formData?.website?.startsWith('http') ? formData.website : `https://${formData.website}`
    window.open(url, '_blank')
  }

  const getSuccessMessage = () => {
    switch (operationStatus.lastOperation) {
      case 'create':
        return 'Veterinarian profile created successfully!'
      case 'update':
        return 'Veterinarian information updated successfully!'
      case 'delete':
        return 'Veterinarian information deleted successfully!'
      default:
        return 'Operation completed successfully!'
    }
  }

  // Loading state
  if (isLoadingVet) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading veterinarian information...</span>
      </div>
    )
  }

  // Error state
  if (vetError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Failed to load veterinarian information. Please try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {hasVet ? 'Your Veterinarian' : 'Add Veterinarian Information'}
              </h2>
              <p className="text-blue-100 mt-1">
                {hasVet ? 'Manage your veterinary care information' : "Let's set up your veterinarian details"}
              </p>
              {hasUnsavedChanges && <p className="text-yellow-200 text-sm mt-1">⚠️ You have unsaved changes</p>}
            </div>
            {hasVet && !isEditingVet && (
              <div className="flex gap-2">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  Edit Information
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 font-medium">{getSuccessMessage()}</p>
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">{errors.general}</p>
          </div>
        )}

        {/* Content - Form and Display sections remain the same */}
        <div className="p-6">
          {isEditingVet || !hasVet ? (
            /* Edit Form - Same as before but form submission calls handleSave() */
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSave()
              }}
            >
              {/* Form fields remain exactly the same... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* All form fields here - same as previous version */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Veterinarian Name *</label>
                  <input
                    type="text"
                    value={formData.vetName}
                    onChange={(e) => handleInputChange('vetName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Dr. Sarah Johnson"
                    disabled={isLoading}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                {/* Rest of form fields... */}
              </div>

              {/* Clinic Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name *</label>
                <input
                  type="text"
                  value={formData.clinicName}
                  onChange={(e) => handleInputChange('clinicName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.clinicName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Happy Paws Veterinary Clinic"
                  disabled={isLoading}
                />
                {errors.clinicName && <p className="mt-1 text-sm text-red-600">{errors.clinicName}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="(555) 123-4567"
                  disabled={isLoading}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Emergency Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label>
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="(555) 987-6543"
                  disabled={isLoading}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="info@happypawsvet.com"
                  disabled={isLoading}
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://happypawsvet.com"
                  disabled={isLoading}
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Main Street, Springfield, IL 62701"
                  disabled={isLoading}
                />
              </div>

              {/* Hours */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Office Hours</label>
                <input
                  type="text"
                  value={formData.hours}
                  onChange={(e) => handleInputChange('hours', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 4:00 PM"
                  disabled={isLoading}
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special notes about your veterinarian..."
                  disabled={isLoading}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 md:flex-none px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {operationStatus.isCreating ? 'Creating...' : 'Updating...'}
                    </>
                  ) : hasVet ? (
                    'Update Information'
                  ) : (
                    'Save Veterinarian'
                  )}
                </button>

                {hasVet && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : (
            /* Display Mode */
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-500">Veterinarian</span>
                      <p className="font-medium">{formData.vetName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Clinic</span>
                      <p className="font-medium">{formData.clinicName}</p>
                    </div>
                    {formData.email && (
                      <div>
                        <span className="text-sm text-gray-500">Email</span>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCall(formData.phone)}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      📞 Call {formData.phone}
                    </button>

                    {formData.emergencyPhone && (
                      <button
                        onClick={() => handleCall(formData.emergencyPhone ?? '')}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        🚨 Emergency {formData.emergencyPhone}
                      </button>
                    )}

                    {formData.address && (
                      <button
                        onClick={handleDirections}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        🗺️ Get Directions
                      </button>
                    )}

                    {formData.website && (
                      <button
                        onClick={handleWebsite}
                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        🌐 Visit Website
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {(formData.address || formData.hours || formData.notes) && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.address && (
                      <div>
                        <span className="text-sm text-gray-500">Address</span>
                        <p className="font-medium">{formData.address}</p>
                      </div>
                    )}
                    {formData.hours && (
                      <div>
                        <span className="text-sm text-gray-500">Hours</span>
                        <p className="font-medium">{formData.hours}</p>
                      </div>
                    )}
                    {formData.notes && (
                      <div className="md:col-span-2">
                        <span className="text-sm text-gray-500">Notes</span>
                        <p className="font-medium">{formData.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VeterinarianProfile
