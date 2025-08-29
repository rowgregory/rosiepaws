import React, { FC } from 'react'
import FilterSearch from '@/app/components/admin/form-elements/FilterSearch'

interface IFilterAndSearch {
  searchTerm: any
  setSearchTerm: any
  setRoleFilter: any
  roleFilter: any
  userTypeFilter: any
  setUserTypeFilter: any
}

const FilterAndSearch: FC<IFilterAndSearch> = ({
  searchTerm,
  setSearchTerm,
  setRoleFilter,
  roleFilter,
  userTypeFilter,
  setUserTypeFilter
}) => {
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
            <option value="all">All Roles</option>
            <option value="free">Free</option>
            <option value="comfort">Comfort</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="super">Super Users</option>
            <option value="admin">Admins</option>
            <option value="comfort">Comfort</option>
            <option value="legacy">Legacy</option>
            <option value="free">Free</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default FilterAndSearch
