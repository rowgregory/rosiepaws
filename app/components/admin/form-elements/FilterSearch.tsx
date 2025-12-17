import { Search } from 'lucide-react'
import { FC } from 'react'

const FilterSearch: FC<{ searchTerm: any; setSearchTerm: any; placeholder: string }> = ({
  searchTerm,
  setSearchTerm,
  placeholder
}) => {
  return (
    <div className="relative flex-1">
      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  )
}

export default FilterSearch
