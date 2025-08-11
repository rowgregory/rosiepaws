'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  X,
  Play,
  Trash2,
  Image as ImageIcon,
  Video,
  Plus,
  Grid3X3,
  List,
  Search,
  Eye,
  Filter
} from 'lucide-react'
import Picture from '@/app/components/common/Picture'
import { uploadFileToFirebase } from '@/app/utils/firebase-helpers'
import { useCreateGalleryItemMutation, useDeleteGalleryItemMutation } from '@/app/redux/services/galleryItemApi'
import { IGalleryItem } from '@/app/types'
import { RootState, useAppSelector } from '@/app/redux/store'

export type GalleryItemUpload = Pick<IGalleryItem, 'url' | 'type' | 'name' | 'size' | 'mimeType'>

// Or create a more specific upload interface
export interface IGalleryItemUpload {
  url: string
  type: 'image' | 'video' // Only allow these two for gallery
  name: string
  size: number
  mimeType: string
  createdAt: Date
}

const PhotoGalleryPage = () => {
  // const [mediaItems, setMediaItems] = useState<IGalleryItemUpload[]>([])
  const { galleryItems } = useAppSelector((state: RootState) => state.galleryItem)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedMedia, setSelectedMedia] = useState(null) as any
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [createGaleryItem] = useCreateGalleryItemMutation()
  const [deleteGalleryItem] = useDeleteGalleryItemMutation()

  // Filter and search media items
  const filteredMedia = galleryItems?.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || item.type.toLowerCase() === filterType
    return matchesSearch && matchesFilter
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      setSelectedFile(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files && files[0]) {
      setSelectedFile(files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setUploadProgress(0)

    try {
      let firebaseType: 'image' | 'video'

      if (selectedFile.type.startsWith('image/')) {
        firebaseType = 'image'
      } else if (selectedFile.type.startsWith('video/')) {
        firebaseType = 'video'
      } else {
        throw new Error('Only images and videos are allowed in gallery')
      }

      const downloadURL = await uploadFileToFirebase(
        selectedFile,
        (progress) => setUploadProgress(progress),
        firebaseType
      )

      // Add to media items with correct MediaType enum
      const newMediaItem: IGalleryItemUpload = {
        url: downloadURL,
        type: firebaseType, // Now using MediaType enum instead of string
        name: selectedFile.name,
        size: selectedFile.size,
        mimeType: selectedFile.type,
        createdAt: new Date()
      }

      await createGaleryItem(newMediaItem).unwrap()

      setSelectedFile(null)
      setUploadProgress(0)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    await deleteGalleryItem(id).unwrap()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <>
      <div className="sticky top-0 flex items-center justify-between px-6 border-b-1 border-b-gray-100 z-30 bg-white h-[64px]">
        <h1 className="text-2xl font-semibold">Media Gallery</h1>

        <div className="hidden lg:block">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span>{filteredMedia.length} items</span>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <span>{galleryItems?.filter?.((item: IGalleryItem) => item.type === 'IMAGE').length} photos</span>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <span>{galleryItems?.filter?.((item) => item.type === 'VIDEO').length} videos</span>
          </div>
        </div>
      </div>
      <div className="w-full min-h-[calc(100dvh-64px)] mx-auto p-6 space-y-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            {/* Upload Section */}
            <div
              className={`border-2 border-dashed rounded-t-xl transition-all duration-300 ${
                dragOver
                  ? 'border-slate-400 bg-slate-50'
                  : selectedFile
                    ? 'border-slate-300 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="p-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  multiple={false}
                />

                {!selectedFile ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center justify-center gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Upload className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-sm text-slate-600">Drop files here or</span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Select Files
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border">
                          {selectedFile.type.startsWith('image/') ? (
                            <ImageIcon className="w-4 h-4 text-slate-600" />
                          ) : (
                            <Video className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900 text-sm truncate">{selectedFile.name}</p>
                          <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
                        </div>
                      </div>

                      {uploading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-20">
                            <div className="w-full bg-slate-200 rounded-full h-1">
                              <motion.div
                                className="bg-slate-600 h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <p className="text-xs text-slate-500 mt-1 text-center">{Math.round(uploadProgress)}%</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleUpload}
                            className="px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
                          >
                            Upload
                          </motion.button>
                          <button
                            onClick={() => setSelectedFile(null)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="p-4 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search media files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-300 w-full sm:w-64 text-sm"
                    />
                  </div>

                  <div className="relative">
                    <Filter className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as 'all' | 'image' | 'video')}
                      className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-300 text-sm appearance-none bg-white"
                    >
                      <option value="all">All Media</option>
                      <option value="image">Images</option>
                      <option value="video">Videos</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Media Gallery */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {filteredMedia.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-slate-100 rounded-3xl flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-slate-300" />
              </div>
              <h3 className="text-2xl font-light text-slate-600 mb-3">No media files</h3>
              <p className="text-slate-500">Upload your first file to get started</p>
            </div>
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
                  : 'space-y-3'
              }
            >
              <AnimatePresence>
                {filteredMedia.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className={
                      viewMode === 'grid'
                        ? 'group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-slate-100'
                        : 'group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-slate-100'
                    }
                    onClick={() => setSelectedMedia(item)}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        <div className="aspect-square relative overflow-hidden bg-slate-50">
                          {item.type === 'IMAGE' ? (
                            <Picture
                              src={item.url}
                              priority={false}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                              <video src={item.url} className="w-full h-full object-cover" muted />
                              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                  <Play className="w-5 h-5 text-slate-900 ml-0.5" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <p className="font-medium text-sm truncate mb-1">{item.name}</p>
                          <p className="text-xs text-white/80">{formatDate(item.createdAt)}</p>
                        </div>

                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(item.id)
                              }}
                              className="p-2 bg-black/60 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50">
                          {item.type === 'IMAGE' ? (
                            <Picture src={item.url} priority={false} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                              <Play className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900 truncate mb-1">{item.name}</h4>
                          <div className="flex items-center gap-3 text-sm text-slate-500">
                            <span>{formatDate(item.createdAt)}</span>
                            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                            <span>{formatFileSize(item.size)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedMedia(item)
                            }}
                            className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-50"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(item.id)
                            }}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Media Viewer Modal */}
        <AnimatePresence>
          {selectedMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={() => setSelectedMedia(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative max-w-5xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute -top-16 left-0 right-0 flex items-center justify-between text-white">
                  <div>
                    <h3 className="text-lg font-medium">{selectedMedia.name}</h3>
                    <p className="text-sm text-white/70">
                      {formatDate(selectedMedia.createdAt)} • {formatFileSize(selectedMedia.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedMedia(null)}
                    className="p-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  {selectedMedia.type === 'image' ? (
                    <Picture
                      src={selectedMedia.url}
                      priority={false}
                      className="max-w-full max-h-[80vh] object-contain bg-white"
                    />
                  ) : (
                    <video src={selectedMedia.url} controls autoPlay className="max-w-full max-h-[80vh] rounded-2xl" />
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default PhotoGalleryPage
