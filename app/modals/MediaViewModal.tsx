import { AnimatePresence, motion } from 'framer-motion'
import React, { FC } from 'react'
import { formatDateShort } from '../lib/utils'
import { Heart, MessageCircle, Share2, X } from 'lucide-react'
import Picture from '../components/common/Picture'
import formatFileSize from '../lib/utils/public/dashboard/formatFileSize'

const MediaViewModal: FC<{
  selectedMedia: any
  setSelectedMedia: any
  activeTab: any
  likedItems: any
  handleLike: any
}> = ({ selectedMedia, setSelectedMedia, activeTab, likedItems, handleLike }) => {
  return (
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
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <span>{formatDateShort(selectedMedia.createdAt)}</span>
                  <span>•</span>
                  <span>{formatFileSize(selectedMedia.size)}</span>
                  {activeTab === 'public-gallery' && selectedMedia.owner && (
                    <>
                      <span>•</span>
                      <span>by {selectedMedia.owner.name}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {activeTab === 'public-gallery' && (
                  <div className="flex items-center gap-4 text-white/70">
                    <div className="flex items-center gap-2">
                      <Heart
                        className={`w-4 h-4 ${likedItems.has(selectedMedia.id) ? 'fill-current text-red-400' : ''}`}
                      />
                      <span>{selectedMedia.likes}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{selectedMedia.comments}</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="p-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl relative z-[60]">
              {selectedMedia.type === 'IMAGE' ? (
                <Picture
                  priority={true}
                  src={selectedMedia.url}
                  alt="Pet media"
                  className="max-w-full max-h-[80vh] object-contain bg-white w-auto h-auto"
                />
              ) : (
                <video src={selectedMedia.url} controls autoPlay className="max-w-full max-h-[80vh] rounded-2xl" />
              )}
            </div>

            {/* Action buttons in modal */}
            {activeTab === 'public-gallery' && (
              <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-4">
                <motion.button
                  onClick={() => handleLike(selectedMedia.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    likedItems.has(selectedMedia.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/10 text-white hover:bg-red-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className={`w-4 h-4 ${likedItems.has(selectedMedia.id) ? 'fill-current' : ''}`} />
                  <span>{likedItems.has(selectedMedia.id) ? 'Liked' : 'Like'}</span>
                </motion.button>
                <motion.button
                  onClick={() => {
                    // Handle share functionality
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MediaViewModal
