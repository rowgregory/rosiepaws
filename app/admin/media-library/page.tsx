'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Image,
  BookOpen,
  Plus,
  Eye,
  Download,
  Trash2,
  Search,
  Grid3X3,
  List,
  Calendar,
  File
} from 'lucide-react'
import { uploadFileToFirebase } from '@/app/utils/firebase-helpers'
import { createFormActions, setInputs } from '@/app/redux/features/formSlice'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { useCreateMediaMutation, useDeleteMediaMutation, useGetAllMediaQuery } from '@/app/redux/services/mediaApi'
import { setOpenSlideMessage } from '@/app/redux/features/appSlice'
import { IMedia } from '@/app/types'
import { setCloseAdminConfirmModal, setOpenAdminConfirmModal } from '@/app/redux/features/adminSlice'

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

const getFormatIcon = (format: string) => {
  switch (format.toLowerCase()) {
    case 'pdf':
      return FileText
    case 'png':
    case 'jpg':
    case 'jpeg':
      return Image
    case 'xlsx':
    case 'xls':
      return FileText
    default:
      return FileText
  }
}

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

const tabs = [
  { id: 'all', label: 'All Media', icon: Grid3X3 },
  { id: 'poster', label: 'Posters', icon: Image },
  { id: 'ebook', label: 'eBooks', icon: BookOpen },
  { id: 'document', label: 'Documents', icon: FileText }
]

const getTypeFromFile = (fileName: any) => {
  const ext = fileName.split('.').pop().toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'].includes(ext)) return 'poster'
  if (['pdf'].includes(ext) && fileName.toLowerCase().includes('book')) return 'ebook'
  if (['pdf'].includes(ext)) return 'ebook'
  if (['doc', 'docx', 'rtf', 'odt'].includes(ext)) return 'document'
  if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) return 'document'
  if (['ppt', 'pptx', 'odp'].includes(ext)) return 'document'
  if (['txt', 'md', 'json', 'xml'].includes(ext)) return 'document'
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext)) return 'document'
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'document'
  return 'document'
}

const getColorFromType = (type: string | number | any, fileName: any) => {
  // Deterministic color based on media type
  const typeColors: any = {
    poster: 'purple',
    ebook: 'green',
    document: 'blue'
  }

  // If it's a specific document type, assign specific colors
  const ext: any = fileName.split('.').pop().toLowerCase()
  const extColors: any = {
    pdf: 'red',
    doc: 'blue',
    docx: 'blue',
    xls: 'green',
    xlsx: 'green',
    ppt: 'orange',
    pptx: 'orange',
    txt: 'gray',
    jpg: 'purple',
    jpeg: 'purple',
    png: 'purple',
    gif: 'indigo',
    mp4: 'orange',
    avi: 'orange'
  }

  return extColors[ext] || typeColors[type] || 'blue'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const AdminMediaDashboard = () => {
  const { data } = useGetAllMediaQuery(undefined) as { data: { media: IMedia[] | undefined } }
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null) as any
  const dispatch = useAppDispatch()
  const { handleUploadProgress, handleInput } = createFormActions('mediaForm', dispatch)
  const { mediaForm } = useAppSelector((state: RootState) => state.form)
  const [createMedia] = useCreateMediaMutation() as any
  const [deleteMedia] = useDeleteMediaMutation() as any

  const filteredItems = (data?.media || []).filter((item) => {
    if (!item) return false // Safety check for undefined items
    const matchesTab = activeTab === 'all' || item.type === activeTab
    const matchesSearch = item?.title?.toLowerCase()?.includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handleFileUpload = async (files: any) => {
    setIsUploading(true)
    const fileArray: any = Array.from(files)

    dispatch(
      setInputs({
        formName: 'mediaForm',
        data: { uploadingFiles: fileArray.map((f: { name: any }) => ({ name: f.name, progress: 0 })) }
      })
    )

    try {
      const uploadPromises = fileArray.map(async (file: any) => {
        try {
          // Upload to Firebase with progress tracking
          const downloadURL = await uploadFileToFirebase(file, handleUploadProgress, getTypeFromFile(file.name))

          // Create media item with Firebase URL
          return {
            title: file.name.replace(/\.[^/.]+$/, ''),
            type: getTypeFromFile(file.name),
            format: file.name.split('.').pop().toUpperCase(),
            size: formatFileSize(file.size),
            sizeBytes: file.size,
            views: 0,
            downloads: 0,
            thumbnail: downloadURL, // Use Firebase URL as thumbnail
            filePath: downloadURL, // Store Firebase download URL
            fileName: file.name,
            mimeType: file.type,
            color: getColorFromType(getTypeFromFile(file.name), file.name),
            isActive: true,
            tags: []
          }
        } catch (error) {
          throw error
        }
      })

      const newItems = await Promise.all(uploadPromises)

      const itemsToSave = [...mediaForm?.inputs?.uploadingFiles, ...newItems]

      dispatch(
        setInputs({
          formName: 'mediaForm',
          data: { uploadingFiles: itemsToSave }
        })
      )

      await createMedia({ items: itemsToSave }).unwrap()
    } catch {
      dispatch(setOpenSlideMessage())
    } finally {
      setIsUploading(false)

      setTimeout(() => {
        dispatch(
          setInputs({
            formName: 'mediaForm',
            data: { uploadingFiles: [] }
          })
        )
      }, 300)
    }
  }

  const handleDelete = async (item: IMedia) => {
    dispatch(
      setInputs({
        formName: 'mediaForm',
        data: { uploadingFiles: mediaForm?.inputs?.uploadingFiles.filter((item: any) => item.id !== item.id) }
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

  const UploadCard = () => (
    <div
      className="transition-all duration-300 hover:scale-[1.02] w-full h-full rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 overflow-hidden relative flex flex-col cursor-pointer aspect-square"
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="p-6 flex flex-col h-full items-center justify-center text-center">
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-md mb-4">
          <Plus className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">Upload New Media</h3>
        <p className="text-sm text-gray-500 mb-4">Click here to browse</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">PDF</span>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">PNG</span>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">JPG</span>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.doc,.docx,.xlsx,.xls"
        className="hidden"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
      />
    </div>
  )

  const MediaCard = ({ item }: any) => {
    const Icon = getTypeIcon(item.type)
    const FormatIcon = getFormatIcon(item.format)

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
                <FormatIcon className="w-3 h-3" />
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
      </div>
    )
  }

  return (
    <>
      {/* <SlideMessage message={error} type="Error" /> */}
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Library</h1>
            <p className="text-gray-600">Manage your posters, ebooks, and documents</p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Tabs */}
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const TabIcon = tab.icon
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                      ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                      }
                    `}
                    >
                      <TabIcon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  )
                })}
              </div>

              {/* Search and View Controls */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    name="searchQuery"
                    type="text"
                    placeholder="Search media..."
                    value={searchQuery}
                    onChange={handleInput}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  >
                    <List className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Progress - Fixed Position Overlay */}
          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed top-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-xl shadow-2xl backdrop-blur-sm"
              >
                {/* Header */}
                <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">Uploading Files</h3>
                      <p className="text-xs text-gray-600">
                        {mediaForm?.inputs?.uploadingFiles?.length} file
                        {mediaForm?.inputs?.uploadingFiles?.length !== 1 ? 's' : ''} in progress
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 bg-white/70 px-2 py-1 rounded-full">
                      {
                        mediaForm?.inputs?.uploadingFiles?.filter((f: { progress: number }) => f.progress === 100)
                          .length
                      }
                      /{mediaForm?.inputs?.uploadingFiles?.length}
                    </div>
                  </div>
                </div>

                {/* Progress List */}
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-4 space-y-3">
                    {mediaForm?.inputs?.uploadingFiles?.map((file: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            {file.progress === 100 ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
                              >
                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </motion.div>
                            ) : (
                              <span className="text-xs font-medium text-blue-600 min-w-[2rem] text-right">
                                {file.progress}%
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              file.progress === 100
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-gradient-to-r from-blue-500 to-blue-600'
                            }`}
                            initial={{ width: 0 }}
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Overall Progress Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Overall Progress</span>
                    <span className="font-medium">
                      {Math.round(
                        mediaForm?.inputs?.uploadingFiles?.reduce(
                          (acc: any, file: { progress: any }) => acc + file.progress,
                          0
                        ) / mediaForm?.inputs?.uploadingFiles?.length || 0
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      style={{
                        width: `${mediaForm?.inputs?.uploadingFiles?.reduce((acc: any, file: { progress: any }) => acc + file.progress, 0) / mediaForm?.inputs?.uploadingFiles?.length || 0}%`
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Media Grid */}
          <div
            className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}
          >
            {/* Upload Card */}
            <div className={viewMode === 'grid' ? 'min-h-[280px]' : 'h-32'}>
              <UploadCard />
            </div>

            {/* Media Items */}
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={index}
                  layout
                  className={viewMode === 'grid' ? 'min-h-[280px]' : 'h-32'}
                  initial={{
                    opacity: 0,
                    y: 30,
                    scale: 0.9
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    y: -20
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: [0.25, 0.4, 0.25, 1],
                    type: 'spring',
                    damping: 25,
                    stiffness: 400
                  }}
                >
                  <MediaCard item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredItems?.length === 0 && !isUploading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No media found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Upload your first media file to get started'}
              </p>
              {searchQuery && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Stats Footer */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{data?.media?.length}</div>
                <div className="text-sm text-gray-600">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {data?.media?.filter((i: { type: string }) => i.type === 'POSTER').length}
                </div>
                <div className="text-sm text-gray-600">Posters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {data?.media?.filter((i: { type: string }) => i.type === 'EBOOK').length}
                </div>
                <div className="text-sm text-gray-600">eBooks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {data?.media?.filter((i: { type: string }) => i.type === 'DOCUMENT').length}
                </div>
                <div className="text-sm text-gray-600">Documents</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminMediaDashboard
