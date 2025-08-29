import { Download, Eye, Calendar, FileText, Heart } from 'lucide-react'
import Picture from '../../common/Picture'
import { motion } from 'framer-motion'

const MediaCard = ({ item, favorites, handleView, toggleFavorite, handleDownload, viewMode = 'grid' }: any) => {
  const isEbook = item.type === 'EBOOK'
  const isFavorite = favorites.includes(item.id)
  const isListView = viewMode === 'list'

  if (isListView) {
    // Professional single-column/list view
    return (
      <div
        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-100"
        onClick={() => handleView(item)}
      >
        <div className="flex">
          {/* Thumbnail - Fixed width in list view */}
          <div className="relative flex-shrink-0 w-32 h-32 sm:w-40 sm:h-32">
            {isEbook ? (
              <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-8 h-8 text-red-500 mx-auto mb-1" />
                  <div className="text-xs font-medium text-red-700">PDF</div>
                </div>
              </div>
            ) : (
              <Picture
                priority={true}
                src={
                  item.thumbnail || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop`
                }
                alt={item.title}
                className="w-full h-full object-cover"
              />
            )}

            {/* Type Badge - Repositioned for list view */}
            <div className="absolute top-2 left-2">
              <div
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  isEbook ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                }`}
              >
                {isEbook ? 'eBook' : 'Poster'}
              </div>
            </div>
          </div>

          {/* Content - Expanded in list view */}
          <div className="flex-1 p-4 sm:p-5 min-w-0">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3 sm:line-clamp-2">
                  {item.description || 'No description available'}
                </p>
              </div>

              {/* Action buttons - Vertical stack in list view */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={(e: any) => {
                    e.stopPropagation()
                    toggleFavorite(item.id)
                  }}
                  className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                </button>

                <button
                  onClick={(e: any) => {
                    e.stopPropagation()
                    handleView(item)
                  }}
                  className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <Eye className="w-4 h-4 text-blue-600" />
                </button>

                {isEbook && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload(item)
                    }}
                    className="p-2 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                  >
                    <Download className="w-4 h-4 text-green-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Tags - More space in list view */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {item.tags.slice(0, 5).map((tag: any, tagIndex: number) => (
                <span key={tagIndex} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {tag}
                </span>
              ))}
              {item.tags.length > 5 && (
                <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                  +{item.tags.length - 5} more
                </span>
              )}
            </div>

            {/* Meta Info - Horizontal layout with more details */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{item.views} views</span>
              </div>
              {isEbook && (
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  <span>{item.downloads} downloads</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(item.uploadDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{item.format}</span>
                <span>•</span>
                <span>{item.size}</span>
              </div>
            </div>

            {/* Primary Action Button - Full width in list view */}
            <div className="flex gap-2">
              <button
                onClick={(e: any) => {
                  e.stopPropagation()
                  handleView(item)
                }}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View
              </button>

              {isEbook && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload(item)
                  }}
                  className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Original grid view (unchanged)
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
            {!isEbook && (
              <button
                onClick={(e: any) => {
                  e.stopPropagation()
                  handleView(item)
                }}
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </button>
            )}

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

export default MediaCard
