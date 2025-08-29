import React, { FC } from 'react'
import { Search, Grid3X3, List, Filter, SortAsc } from 'lucide-react'
import { motion } from 'framer-motion'

interface IFilters {
  searchQuery: any
  setSearchQuery: any
  selectedCategory: any
  setSelectedCategory: any
  setViewMode: any
  viewMode: any
  sortBy: any
  setSortBy: any
}

const Filters: FC<IFilters> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  setViewMode,
  viewMode,
  sortBy,
  setSortBy
}) => {
  return (
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
  )
}

export default Filters
