'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Image, BookOpen, Search, Grid3X3, List } from 'lucide-react'
import { createFormActions } from '@/app/redux/features/formSlice'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { useGetAllMediaQuery } from '@/app/redux/services/mediaApi'
import { IMedia } from '@/app/types'
import MediaCard from '@/app/components/admin/media-library/MediaCard'
import UploadCard from '@/app/components/admin/media-library/UploadCard'
import AdminPageHeader from '@/app/components/admin/common/AdminPageHeader'

const tabs = [
  { id: 'all', label: 'All Media', icon: Grid3X3 },
  { id: 'poster', label: 'Posters', icon: Image },
  { id: 'ebook', label: 'eBooks', icon: BookOpen },
  { id: 'document', label: 'Documents', icon: FileText }
]

const AdminMediaLibrary = () => {
  const { data } = useGetAllMediaQuery(undefined) as { data: { media: IMedia[] | undefined } }
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const dispatch = useAppDispatch()
  const { handleUploadProgress, handleInput } = createFormActions('mediaForm', dispatch)
  const { mediaForm } = useAppSelector((state: RootState) => state.form)

  const filteredItems = (data?.media || []).filter((item) => {
    if (!item) return false // Safety check for undefined items
    const matchesTab = activeTab === 'all' || item.type === activeTab
    const matchesSearch = item?.title?.toLowerCase()?.includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <AdminPageHeader title="Media Library" subtitle="Manage your posters, ebooks, and documents" />

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
              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
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
              <UploadCard
                setIsUploading={setIsUploading}
                handleUploadProgress={handleUploadProgress}
                mediaForm={mediaForm}
              />
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
                  <MediaCard item={item} uploadingFiles={mediaForm.inputs.uploadingFiles} />
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

export default AdminMediaLibrary
