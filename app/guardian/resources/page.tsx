'use client'

import Filters from '@/app/components/guardian/resources/Filters'
import MediaCard from '@/app/components/guardian/resources/MediaCard'
import ResourcesHeader from '@/app/components/guardian/resources/ResourcesHeader'
import MediaModal from '@/app/modals/MediaModal'
import { setOpenNeedToUpgradeDrawer } from '@/app/redux/features/dashboardSlice'
import { useGetAllMediaQuery, useUpdateAnalyticsMutation } from '@/app/redux/services/mediaApi'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { IMedia } from '@/app/types'
import { motion, AnimatePresence } from 'framer-motion'
import { File, Lock } from 'lucide-react'
import { useState } from 'react'

const UserMediaLibrary = () => {
  const dispatch = useAppDispatch()
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
  const { user } = useAppSelector((state: RootState) => state.user)

  const toggleFavorite = (itemId: any) => {
    setFavorites((prev: any[]) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const canAccessTier = (userTier: string, itemTier: string) => {
    const tierHierarchy = ['free', 'comfort', 'legacy']
    const userLevel = tierHierarchy.indexOf(userTier)
    const itemLevel = tierHierarchy.indexOf(itemTier)
    return userLevel >= itemLevel
  }

  const { accessibleItems, lockedItems } = media?.reduce(
    (
      acc: { accessibleItems: any[]; lockedItems: any[] },
      item: { isActive: any; type: string; title: string; description: string; tags: any[]; tier: string }
    ) => {
      // Only process active items
      if (!item.isActive) return acc

      // Determine user tier
      const userTier = user?.isFreeUser
        ? 'free'
        : user?.isComfortUser
          ? 'comfort'
          : user?.isLegacyUser
            ? 'legacy'
            : 'free'

      // Check if item matches category filter
      const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory

      // Check if item matches search filter
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchLower) ||
        (item.description && item.description.toLowerCase().includes(searchLower)) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchLower))

      // Only include items that match category and search filters
      if (matchesCategory && matchesSearch) {
        if (canAccessTier(userTier, item.tier)) {
          acc.accessibleItems.push(item)
        } else {
          acc.lockedItems.push({ ...item, isLocked: true })
        }
      }

      return acc
    },
    { accessibleItems: [], lockedItems: [] }
  ) || { accessibleItems: [], lockedItems: [] }

  // Sort function
  const sortItems = (items: any[]) => {
    return items.sort((a: any, b: any) => {
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
  }

  // Apply sorting to both arrays
  const filteredItems = sortItems(accessibleItems)
  const filteredLockedItems = sortItems(lockedItems)

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

  return (
    <div>
      <ResourcesHeader
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        available={filteredItems}
        locked={filteredLockedItems}
      />

      <div className="w-full min-h-[calc(100dvh-64px)] mx-auto p-6 bg-gray-50">
        {/* Filters */}
        <Filters
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          setSearchQuery={setSearchQuery}
          setSelectedCategory={setSelectedCategory}
          setSortBy={setSortBy}
          setViewMode={setViewMode}
          sortBy={sortBy}
          viewMode={viewMode}
        />

        {/* Media Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
          }`}
        >
          <AnimatePresence>
            {/* Show items if they exist */}
            {((activeTab === 'available' && filteredItems?.length > 0) ||
              (activeTab === 'locked' && filteredLockedItems?.length > 0)) &&
              (activeTab === 'locked' ? filteredLockedItems : filteredItems)?.map(
                (item: IMedia & { isLocked: boolean }, index: number) => (
                  <motion.div
                    key={item.id}
                    layout
                    className={viewMode === 'grid' ? 'min-h-[280px]' : 'min-h-fit'}
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
                    <div className="relative h-full">
                      {item.isLocked && (
                        <div
                          className="absolute inset-0 z-10 bg-black/20 backdrop-blur-md cursor-pointer flex items-center justify-center group transition-all duration-200 hover:bg-black/30 rounded-xl"
                          onClick={() => dispatch(setOpenNeedToUpgradeDrawer())}
                        >
                          <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-200">
                            <Lock className="w-6 h-6 text-white drop-shadow-sm" />
                          </div>
                        </div>
                      )}
                      <MediaCard
                        key={item.id}
                        item={item}
                        favorites={favorites}
                        handleView={handleView}
                        setFavorites={setFavorites}
                        toggleFavorite={toggleFavorite}
                        handleDownload={handleDownload}
                        viewMode={viewMode}
                      />
                    </div>
                  </motion.div>
                )
              )}

            {/* Show empty state if no items */}
            {((activeTab === 'available' && filteredItems?.length === 0) ||
              (activeTab === 'locked' && filteredLockedItems?.length === 0)) && (
              <motion.div
                key="empty-state"
                className="col-span-full flex justify-center items-center min-h-[400px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center py-20">
                  <div className="w-32 h-32 mx-auto mb-8 bg-slate-100 rounded-3xl flex items-center justify-center">
                    <File className="w-16 h-16 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-light text-slate-600 mb-3">No resources found</h3>
                  <p className="text-slate-500">No resources available at the moment</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
