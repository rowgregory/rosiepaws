'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Trash2, Image as ImageIcon, Eye, Heart, MessageCircle, Share2 } from 'lucide-react'
import Picture from '@/app/components/common/Picture'
import {
  useDeleteGalleryItemMutation,
  useListPublicGalleryItemsQuery,
  useUpdateGalleryItemMutation
} from '@/app/redux/services/galleryItemApi'
import { IGalleryItem } from '@/app/types'
import { RootState, useAppSelector } from '@/app/redux/store'
import { formatDateShort } from '@/app/lib/utils'
import { useInitialAnimation } from '@/app/hooks/useInitialAnimation'
import MediaViewModal from '@/app/modals/MediaViewModal'
import GalleryHeader from '@/app/components/guardian/gallery/GalleryHeader'
import UploadSectionMyGallery from '@/app/components/guardian/gallery/UploadSectionMyGallery'
import SearchAndFilterPublicGallery from '@/app/components/guardian/gallery/SearchAndFilterPublicGallery'
import formatFileSize from '@/app/lib/utils/public/dashboard/formatFileSize'

export type GalleryItemUpload = Pick<IGalleryItem, 'url' | 'type' | 'name' | 'size' | 'mimeType'>

export interface IGalleryItemUpload {
  url: string
  type: 'IMAGE' | 'VIDEO' // Only allow these two for gallery
  name: string
  size: number
  mimeType: string
  createdAt: Date
  petId: string
}

const PhotoGalleryPage = () => {
  const { galleryItems, loading } = useAppSelector((state: RootState) => state.galleryItem)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedMedia, setSelectedMedia] = useState(null) as any
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all')

  const [deleteGalleryItem] = useDeleteGalleryItemMutation()
  const [updateGalleryItem] = useUpdateGalleryItemMutation()
  const [isLoading, setIsLoading] = useState({}) as any

  const [activeTab, setActiveTab] = useState('my-gallery')
  const [likedItems, setLikedItems] = useState(new Set())

  const shouldAnimate = useInitialAnimation(galleryItems)

  const { data } = useListPublicGalleryItemsQuery(undefined) as { data: { galleryItems: IGalleryItem[] } }
  const [publicMedia, setPublicMedia] = useState([]) as any

  const getFilteredMedia = () => {
    const items = activeTab === 'my-gallery' ? galleryItems : data?.galleryItems

    const filtered = items?.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter =
        filterType === 'all' ||
        (filterType === 'image' && item.type === 'IMAGE') ||
        (filterType === 'video' && item.type === 'VIDEO')
      return matchesSearch && matchesFilter
    })

    return filtered
  }

  const filteredMedia = getFilteredMedia()

  const handleDelete = async (id: string) => {
    setIsLoading({ [id]: true })
    await deleteGalleryItem({ id }).unwrap()
    setIsLoading({ [id]: false })
  }

  const handleUpdate = async (item: any) => {
    await updateGalleryItem({ galleryItemId: item.id, isPublic: item.isPublic }).unwrap()
  }

  const handleLike = (itemId: string) => {
    const newLikedItems = new Set(likedItems)
    if (newLikedItems.has(itemId)) {
      newLikedItems.delete(itemId)
    } else {
      newLikedItems.add(itemId)
    }
    setLikedItems(newLikedItems)

    // Update like count
    setPublicMedia((prev: any[]) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, likes: newLikedItems.has(itemId) ? item.likes + 1 : item.likes - 1 } : item
      )
    )
  }

  return (
    <div>
      <GalleryHeader
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        galleryItems={galleryItems}
        publicMedia={publicMedia}
      />

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="border-2 border-orange-500 border-t-0 rounded-full animate-spin w-8 h-8" />
        </div>
      ) : (
        <div className="w-full min-h-[calc(100dvh-64px)] mx-auto p-6 bg-gray-50">
          {/* Upload Section - Only show for My Gallery */}
          {activeTab === 'my-gallery' && (
            <UploadSectionMyGallery
              filterType={filterType}
              searchTerm={searchTerm}
              setFilterType={setFilterType}
              setSearchTerm={setSearchTerm}
              setViewMode={setViewMode}
              viewMode={viewMode}
            />
          )}

          {/* Search and Filter for Public Gallery */}
          {activeTab === 'public-gallery' && (
            <SearchAndFilterPublicGallery
              filterType={filterType}
              searchTerm={searchTerm}
              setFilterType={setFilterType}
              setSearchTerm={setSearchTerm}
              setViewMode={setViewMode}
              viewMode={viewMode}
            />
          )}

          {/* Media Gallery */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {filteredMedia.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 mx-auto mb-8 bg-slate-100 rounded-3xl flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-slate-300" />
                </div>
                <h3 className="text-2xl font-light text-slate-600 mb-3">
                  {activeTab === 'my-gallery' ? 'No media files' : 'No public media'}
                </h3>
                <p className="text-slate-500">
                  {activeTab === 'my-gallery'
                    ? 'Upload your first file to get started'
                    : 'No public media available at the moment'}
                </p>
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
                  {filteredMedia.map((item: any, index: number) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      exit={{ opacity: 0, scale: 0.95 }}
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
                                priority={true}
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
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-white/80">{formatDateShort(item.createdAt)}</p>
                              {activeTab === 'public-gallery' && item.owner && (
                                <p className="text-xs text-white/80">by {item.owner.name}</p>
                              )}
                            </div>
                          </div>

                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex gap-2">
                              {activeTab === 'my-gallery' ? (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDelete(item.id)
                                    }}
                                    className="p-2 bg-black/60 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 transition-colors"
                                  >
                                    {isLoading[item.id] ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    ) : (
                                      <Trash2 className="w-4 h-4" />
                                    )}
                                  </button>
                                  <motion.button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleUpdate(item)
                                    }}
                                    disabled={isLoading[item.id]}
                                    className={`relative w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ${
                                      item.isPublic ? 'bg-blue-500' : 'bg-gray-300'
                                    } ${isLoading[item.id] ? 'opacity-50' : ''}`}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <motion.div
                                      className="w-4 h-4 bg-white rounded-full shadow-sm"
                                      animate={{
                                        x: item.isPublic ? 16 : 0
                                      }}
                                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                  </motion.button>
                                </>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleLike(item.id)
                                  }}
                                  className={`p-2 backdrop-blur-sm rounded-lg transition-colors ${
                                    likedItems.has(item.id)
                                      ? 'bg-red-500 text-white'
                                      : 'bg-black/60 text-white hover:bg-red-500'
                                  }`}
                                >
                                  <Heart className={`w-4 h-4 ${likedItems.has(item.id) ? 'fill-current' : ''}`} />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Public media stats */}
                          {activeTab === 'public-gallery' && (
                            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="flex items-center gap-3 text-white text-xs">
                                <div className="flex items-center gap-1">
                                  <Heart
                                    className={`w-3 h-3 ${likedItems.has(item.id) ? 'fill-current text-red-400' : ''}`}
                                  />
                                  <span>{item.likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" />
                                  <span>{item.comments}</span>
                                </div>
                              </div>
                            </div>
                          )}
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
                              <span>{formatDateShort(item.createdAt)}</span>
                              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                              <span>{formatFileSize(item.size)}</span>
                              {activeTab === 'public-gallery' && item.owner && (
                                <>
                                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                  <span>by {item.owner.name}</span>
                                </>
                              )}
                            </div>

                            {activeTab === 'public-gallery' && (
                              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                  <Heart
                                    className={`w-3 h-3 ${likedItems.has(item.id) ? 'fill-current text-red-500' : ''}`}
                                  />
                                  <span>{item.likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" />
                                  <span>{item.comments}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {activeTab === 'my-gallery' ? (
                              <>
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
                              </>
                            ) : (
                              <>
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
                                    handleLike(item.id)
                                  }}
                                  className={`p-2 transition-colors rounded-lg ${
                                    likedItems.has(item.id)
                                      ? 'text-red-500 hover:text-red-600 bg-red-50'
                                      : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                                  }`}
                                >
                                  <Heart className={`w-4 h-4 ${likedItems.has(item.id) ? 'fill-current' : ''}`} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Handle share functionality
                                  }}
                                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-50"
                                >
                                  <Share2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
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
          <MediaViewModal
            activeTab={activeTab}
            handleLike={handleLike}
            likedItems={likedItems}
            selectedMedia={selectedMedia}
            setSelectedMedia={setSelectedMedia}
          />
        </div>
      )}
    </div>
  )
}

export default PhotoGalleryPage
