import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { setInputs } from '@/app/redux/features/formSlice'
import { useDeleteMediaMutation, useUpdateMediaMutation } from '@/app/redux/services/mediaApi'
import { useAppDispatch } from '@/app/redux/store'
import { IMedia } from '@/app/types'
import { BookOpen, Calendar, Crown, Download, Eye, File, Image, Settings, Trash2, Users, Zap } from 'lucide-react'
import { setCloseAdminConfirmModal, setOpenAdminConfirmModal } from '@/app/redux/features/adminSlice'
import { comfortTierName, freeTierName, legacyTierName } from '@/app/lib/constants/public/token'

const getColorGradient = (color: string | number) => {
  const gradients: any = {
    BLUE: 'from-blue-500 to-blue-600',
    PURPLE: 'from-purple-500 to-purple-600',
    GREEN: 'from-green-500 to-green-600',
    ORANGE: 'from-orange-500 to-orange-600',
    RED: 'from-red-500 to-red-600',
    INDIGO: 'from-indigo-500 to-indigo-600'
  }
  return gradients[color] || gradients.blue
}

const getTierInfo = (tier: string) => {
  switch (tier) {
    case 'free':
      return { icon: Users, color: 'text-gray-600', bg: 'bg-gray-100', name: freeTierName }
    case 'comfort':
      return { icon: Zap, color: 'text-blue-600', bg: 'bg-blue-100', name: comfortTierName }
    case 'legacy':
      return { icon: Crown, color: 'text-purple-600', bg: 'bg-purple-100', name: legacyTierName }
    default:
      return { icon: Users, color: 'text-gray-600', bg: 'bg-gray-100', name: freeTierName }
  }
}

const getTypeIcon = (type: any) => {
  switch (type) {
    case 'POSTER':
      return Image
    case 'EBOOK':
      return BookOpen
    case 'DOCUMENT':
      return File
    default:
      return File
  }
}

const MediaCard = ({ item, uploadingFiles }: any) => {
  const [deleteMedia] = useDeleteMediaMutation() as any
  const [updateMedia, { isLoading: isUpdating }] = useUpdateMediaMutation() as any
  const dispatch = useAppDispatch()

  const [showTierSelector, setShowTierSelector] = useState(false)

  const handleDelete = async (item: IMedia) => {
    dispatch(
      setInputs({
        formName: 'mediaForm',
        data: { uploadingFiles: uploadingFiles.filter((item: any) => item.id !== item.id) }
      })
    )

    dispatch(
      setOpenAdminConfirmModal({
        confirmModal: {
          isOpen: true,
          title: 'Delete Media File',
          description: `Deleting will permanently remove this media file.`,
          confirmText: 'Delete Appointment',
          onConfirm: async () => {
            await deleteMedia({ mediaId: item.id, fileName: item.fileName }).unwrap()
            dispatch(setCloseAdminConfirmModal())
          },
          isDestructive: true
        }
      })
    )
  }

  const handleTierChange = async (newTier: 'free' | 'comfort' | 'legacy') => {
    try {
      await updateMedia({ mediaId: item.id, tier: newTier }).unwrap()
    } catch {
    } finally {
      setShowTierSelector(false)
    }
  }

  const tierInfo = getTierInfo(item.tier)
  const TierIcon = tierInfo.icon
  const Icon = getTypeIcon(item.type)

  return (
    <div
      className={`
        transition-all duration-300 hover:scale-[1.02] 
        w-full h-full
        rounded-xl border border-gray-200 shadow-md hover:shadow-lg 
        overflow-hidden relative flex flex-col
        bg-white hover:border-gray-300 aspect-square
      `}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Icon and Stats */}
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg shadow-md bg-gradient-to-r ${getColorGradient(item.color)}`}>
            <Icon className="w-4 h-4 text-white" />
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{item.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>{item.downloads}</span>
            </div>
          </div>
        </div>

        {/* Tier Badge */}
        <div className="flex items-center justify-between mb-2">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${tierInfo.bg} ${tierInfo.color}`}
          >
            <TierIcon className="w-3 h-3" />
            <span>{tierInfo.name}</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowTierSelector(!showTierSelector)}
              className="p-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              {isUpdating ? (
                <div className="w-3 h-3 border border-gray-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Settings className="w-3 h-3" />
              )}
            </button>

            {/* Tier Selector Dropdown */}
            {showTierSelector && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]"
              >
                <div className="p-1">
                  {[
                    { tier: 'free', icon: Users, name: freeTierName, color: 'text-gray-600' },
                    { tier: 'comfort', icon: Zap, name: comfortTierName, color: 'text-blue-600' },
                    { tier: 'legacy', icon: Crown, name: legacyTierName, color: 'text-purple-600' }
                  ].map(({ tier, icon: Icon, name, color }) => (
                    <button
                      key={tier}
                      onClick={() => handleTierChange(tier as 'free' | 'comfort' | 'legacy')}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-50 transition-colors ${
                        item.tier === tier ? 'bg-gray-100' : ''
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${color}`} />
                      <span className="text-gray-700">{name}</span>
                      {item.tier === tier && <div className="ml-auto w-2 h-2 bg-green-500 rounded-full" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
            <p className="text-xs text-gray-600 capitalize mb-2">{item.type}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
              <span>•</span>
              <span>{item.size}</span>
            </div>
            <div className="flex items-center gap-1 py-1">
              {/* Your FormatIcon component */}
              <div className="w-3 h-3 bg-gray-400 rounded" />
              <span className="text-xs font-medium text-gray-600">{item.format}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end mt-4 pt-3 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDelete(item)}
              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showTierSelector && <div className="fixed inset-0 z-0" onClick={() => setShowTierSelector(false)} />}
    </div>
  )
}

export default MediaCard
