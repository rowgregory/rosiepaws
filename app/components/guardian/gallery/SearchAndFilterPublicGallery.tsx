import React, { FC } from 'react'
import { motion } from 'framer-motion'
import { Filter, Grid3X3, List, Search } from 'lucide-react'

interface ISearchAndFilterPublicGallery {
  searchTerm: any
  setSearchTerm: any
  filterType: any
  setFilterType: any
  setViewMode: any
  viewMode: string
}

const SearchAndFilterPublicGallery: FC<ISearchAndFilterPublicGallery> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  setViewMode,
  viewMode
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search public media..."
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
    </motion.div>
  )
}

export default SearchAndFilterPublicGallery
