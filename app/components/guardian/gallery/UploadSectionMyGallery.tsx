import { ChangeEvent, DragEvent, FC, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useCreateGalleryItemMutation } from '@/app/redux/services/galleryItemApi'
import { createFormActions } from '@/app/redux/features/formSlice'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { uploadFileToFirebase } from '@/app/utils/firebase-helpers'
import { IGalleryItemUpload } from '@/app/guardian/gallery/page'
import { MediaType } from '@prisma/client'
import { Filter, Grid3X3, ImageIcon, List, Plus, Search, Upload, Video, X } from 'lucide-react'
import formatFileSize from '@/app/lib/utils/public/dashboard/formatFileSize'
import { setOpenNotEnoughTokensModal, setOpenSlideMessage } from '@/app/redux/features/appSlice'
import { setOpenNeedToUpgradeDrawer } from '@/app/redux/features/dashboardSlice'
import { galleryUploadTokenCost } from '@/app/lib/constants/public/token'
import SlideMessage from '../../auth/SlideMessage'

interface IUploadSectionMyGallery {
  searchTerm: any
  setSearchTerm: any
  setFilterType: any
  filterType: any
  viewMode: string
  setViewMode: any
}

const UploadSectionMyGallery: FC<IUploadSectionMyGallery> = ({
  setSearchTerm,
  searchTerm,
  setFilterType,
  filterType,
  viewMode,
  setViewMode
}) => {
  const { user } = useAppSelector((state: RootState) => state.user)
  const { progress } = useAppSelector((state: RootState) => state.form)
  const [uploading, setUploading] = useState(false)
  const dispatch = useAppDispatch()
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [createGaleryItem, { error: errorCreate }] = useCreateGalleryItemMutation() as any
  const { handleUploadProgress } = createFormActions('galleryItemForm', dispatch)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      setSelectedFile(files[0])
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()

    setDragOver(false)
    const files = e.dataTransfer.files
    if (files && files[0]) {
      setSelectedFile(files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    if (user?.isFreeUser) {
      dispatch(setOpenNeedToUpgradeDrawer())
      return
    }
    if ((user?.tokens ?? 0) < galleryUploadTokenCost) {
      dispatch(setOpenNotEnoughTokensModal(galleryUploadTokenCost))
      return
    }

    setUploading(true)

    try {
      let processedFile = selectedFile

      const isHEIC =
        selectedFile.type === 'image/heic' ||
        selectedFile.type === 'image/heif' ||
        selectedFile.name.toLowerCase().endsWith('.heic') ||
        selectedFile.name.toLowerCase().endsWith('.heif')

      if (isHEIC) {
        try {
          const heic2any = (await import('heic2any')).default
          // Convert HEIC to JPEG
          const convertedBlob = await heic2any({
            blob: selectedFile,
            toType: 'image/jpeg',
            quality: 0.6
          })

          // Create a new File object from the converted blob
          const convertedFile = new File(
            [convertedBlob as Blob],
            selectedFile.name.replace(/\.(heic|heif)$/i, '.jpg'),
            {
              type: 'image/jpeg'
            }
          )

          processedFile = convertedFile
        } catch {
          alert('Failed to convert HEIC file. Please try a different format.')
          return
        }
      }

      let firebaseType: 'image' | 'video'

      if (processedFile.type.startsWith('image/')) {
        firebaseType = 'image'
      } else if (processedFile.type.startsWith('video/')) {
        firebaseType = 'video'
      } else {
        throw new Error('Only images and videos are allowed in gallery')
      }

      const downloadURL = await uploadFileToFirebase(processedFile, handleUploadProgress, firebaseType)

      // Add to media items with correct MediaType enum
      const newMediaItem: IGalleryItemUpload = {
        url: downloadURL,
        type: firebaseType === 'image' ? MediaType.IMAGE : MediaType.VIDEO, // Now using MediaType enum instead of string
        name: processedFile.name,
        size: processedFile.size,
        mimeType: processedFile.type,
        createdAt: new Date(),
        petId: user?.pets?.[0]?.id ?? ''
      }

      await createGaleryItem(newMediaItem).unwrap()

      handleUploadProgress(100)

      // Reset after showing completion
      setTimeout(() => {
        handleUploadProgress(0)
        setSelectedFile(null)
      }, 1500)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch {
      dispatch(setOpenSlideMessage())
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <SlideMessage type="Error" message={errorCreate?.data?.message} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
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
                  className="flex flex-col lg:items-center lg:justify-center gap-4"
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
                              animate={{ width: `${progress}%` }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <p className="text-xs text-slate-500 mt-1 text-center">{Math.round(progress)}%</p>
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
                    onChange={(e: any) => setFilterType(e.target.value)}
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
    </>
  )
}

export default UploadSectionMyGallery
