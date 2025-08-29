import { motion } from 'framer-motion'
import Picture from '../components/common/Picture'
import { Download, Eye, Calendar, Heart, Share2, User, X } from 'lucide-react'

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

export default MediaModal
