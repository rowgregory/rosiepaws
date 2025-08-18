'use client'

import Picture from '@/app/components/common/Picture'
import ResourcesHeader from '@/app/components/guardian/resources/ResourcesHeader'
import { useGetAllMediaQuery, useUpdateAnalyticsMutation } from '@/app/redux/services/mediaApi'
import { IMedia } from '@/app/types'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  Eye,
  Search,
  Grid3X3,
  List,
  Calendar,
  FileText,
  Heart,
  Share2,
  User,
  X,
  Filter,
  SortAsc,
  File
} from 'lucide-react'
import { useState } from 'react'

const MediaCard = ({ item, favorites, handleView, toggleFavorite, handleDownload }: any) => {
  const isEbook = item.type === 'EBOOK'
  const isFavorite = favorites.includes(item.id)

  return (
    <div
      className="bg-white h-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
      onClick={() => {
        handleView(item)
      }}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        {isEbook ? (
          // PDF Preview/Placeholder for eBooks
          <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-red-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-red-700">PDF Document</div>
              <div className="text-xs text-red-600">{item.size}</div>
            </div>
          </div>
        ) : (
          // Image thumbnail for Posters
          <Picture
            priority={true}
            src={item.thumbnail || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop`}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.div initial={{ scale: 0.8 }} whileHover={{ scale: 1 }} className="flex items-center gap-2">
            <button
              onClick={(e: any) => {
                e.stopPropagation()
                handleView(item)
              }}
              className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
            >
              <Eye className="w-4 h-4 text-gray-700" />
            </button>

            {isEbook && (
              <button
                onClick={() => handleDownload(item)}
                className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
              >
                <Download className="w-4 h-4 text-white" />
              </button>
            )}
          </motion.div>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isEbook ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
            }`}
          >
            {isEbook ? 'eBook' : 'Poster'}
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(item.id)
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{item.title}</h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description || 'No description available'}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag: any, tagIndex: number) => (
            <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{item.views}</span>
            </div>
            {isEbook && (
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>{item.downloads}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <span>{item.format}</span>
            <span className="mx-1">•</span>
            <span>{item.size}</span>
          </div>

          {isEbook && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDownload(item)
              }}
              className="px-3 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const MediaModal = ({ item, onClose, toggleFavorite, handleDownload, favorites }: any) => {
  if (!item) return null

  const isEbook = item.category === 'ebook'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full h-full max-h-[70vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative">
          <Picture priority={true} src={item.thumbnail} alt={item.title} className="w-full h-90 object-cover" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <User className="w-4 h-4" />
                <span>{item.author}</span>
                <span>•</span>
                <span>{item.format}</span>
                <span>•</span>
                <span>{item.size}</span>
              </div>
            </div>

            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isEbook ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
              }`}
            >
              {isEbook ? 'eBook' : 'Poster'}
            </div>
          </div>

          <p className="text-gray-700 mb-6">{item.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.map((tag: any, tagIndex: number) => (
              <span key={tagIndex} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mb-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{item.views} views</span>
            </div>
            {isEbook && (
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>{item.downloads} downloads</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Added {new Date(item.uploadDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isEbook && (
              <button
                onClick={(e: any) => {
                  e.stopPropagation()
                  handleDownload(item)
                }}
                className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            )}

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: item.title,
                    text: item.description,
                    url: window.location.href
                  })
                }
              }}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleFavorite(item.id)}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${favorites.includes(item.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
              />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const UserMediaLibrary = () => {
  const [viewMode, setViewMode] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedItem, setSelectedItem] = useState(null)
  const [favorites, setFavorites] = useState([]) as any
  const { data } = useGetAllMediaQuery(undefined) as any
  const media = data?.media
  const [updateAnalytics] = useUpdateAnalyticsMutation()
  const [activeTab, setActiveTab] = useState('available')

  const toggleFavorite = (itemId: any) => {
    setFavorites((prev: any[]) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  // Filter and sort items
  const filteredItems = media
    ?.filter((item: { isActive: any; type: string; title: string; description: string; tags: any[] }) => {
      // Only show active items
      if (!item.isActive) return false

      // Category filter
      const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory

      // Search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchLower) ||
        (item.description && item.description.toLowerCase().includes(searchLower)) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchLower))

      return matchesCategory && matchesSearch
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        case 'oldest':
          return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
        case 'most-viewed':
          return b.views - a.views
        case 'most-downloaded':
          return b.downloads - a.downloads
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const handleDownload = async (item: { type: string; id: any; filePath: string | URL | undefined }) => {
    if (item.type === 'EBOOK') {
      try {
        // Track download analytics
        await updateAnalytics({ mediaId: item.id, action: 'DOWNLOAD' })
      } catch (error) {
        console.error('Analytics failed:', error)
      }

      // Simple approach: just open in new tab and let user save manually
      // This is the most reliable cross-browser solution
      window.open(item.filePath, '_blank')

      // Focus back to original window after a short delay
      setTimeout(() => {
        window.focus()
      }, 100)
    }
  }

  const handleView = async (item: any) => {
    setSelectedItem(item)

    // Track view analytics
    await updateAnalytics({ mediaId: item.id, action: 'VIEW' })
    try {
    } catch (error) {
      console.error('Analytics tracking failed:', error)
    }
  }

  const locked: [] = []

  return (
    <div>
      <ResourcesHeader setActiveTab={setActiveTab} activeTab={activeTab} available={filteredItems} locked={locked} />

      {/* Filters */}
      <div className="w-full min-h-[calc(100dvh-64px)] mx-auto p-6 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  {/* Search */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search resources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-300 w-full sm:w-64 text-sm"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="relative">
                    <Filter className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-300 text-sm appearance-none bg-white"
                    >
                      <option value="all">All Categories</option>
                      <option value="EBOOK">eBooks</option>
                      <option value="POSTER">Posters</option>
                      <option value="DOCUMENT">Documents</option>
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div className="relative">
                    <SortAsc className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-300 text-sm appearance-none bg-white"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="most-viewed">Most Viewed</option>
                      <option value="most-downloaded">Most Downloaded</option>
                      <option value="alphabetical">A-Z</option>
                    </select>
                  </div>
                </div>
                {/* View Mode */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Media Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
          }`}
        >
          <AnimatePresence>
            {filteredItems?.map((item: IMedia, index: number) => (
              <motion.div
                key={item.id}
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
                <MediaCard
                  key={item.id}
                  item={item}
                  favorites={favorites}
                  handleView={handleView}
                  setFavorites={setFavorites}
                  toggleFavorite={toggleFavorite}
                  handleDownload={handleDownload}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredItems?.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-slate-100 rounded-3xl flex items-center justify-center">
                <File className="w-16 h-16 text-slate-300" />
              </div>
              <h3 className="text-2xl font-light text-slate-600 mb-3">No resources found</h3>
              <p className="text-slate-500">No resources available at the moment</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedItem && (
          <MediaModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            toggleFavorite={toggleFavorite}
            handleDownload={handleDownload}
            favorites={favorites}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserMediaLibrary
