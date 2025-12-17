import { FC } from 'react'
import FilterSearch from '@/app/components/admin/form-elements/FilterSearch'
import { comfortTierName, freeTierName, legacyTierName } from '@/app/lib/constants/public/token'

interface IFilterAndSearch {
  searchTerm: any
  setSearchTerm: any
  setRoleFilter: any
  roleFilter: any
}

const FilterAndSearch: FC<IFilterAndSearch> = ({ searchTerm, setSearchTerm, setRoleFilter, roleFilter }) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4">
        <FilterSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search users by name or email..."
        />

        <div className="flex gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Tiers</option>
            <option value="free">{freeTierName}</option>
            <option value="comfort">{comfortTierName}</option>
            <option value="comfort">{legacyTierName}</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default FilterAndSearch
