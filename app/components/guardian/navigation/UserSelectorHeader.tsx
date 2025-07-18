import React from 'react'
import { ChevronDown } from 'lucide-react'
import { RootState, useAppDispatch, useAppSelector } from '@/app/redux/store'
import { setCloseUserDropdown, setOpenUserDropdown } from '@/app/redux/features/appSlice'
import Image from 'next/image'

const UserSelectorHeader = () => {
  const { userDropdown } = useAppSelector((state: RootState) => state.app)
  const { user } = useAppSelector((state: RootState) => state.user)
  const dispatch = useAppDispatch()

  const toggleUserDropdown = () => (userDropdown ? dispatch(setCloseUserDropdown()) : dispatch(setOpenUserDropdown()))

  const getInitial = () => {
    return user?.firstName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'
  }

  const hasValidImage = Boolean(user?.image && user.image.length > 0)

  return (
    <div
      onClick={toggleUserDropdown}
      className={`w-full py-2 px-4 cursor-pointer flex items-center hover:bg-gradient-to-tr hover:from-gray-50 hover:to-gray-100 mb-3 ${userDropdown ? 'w-fit justify-center bg-gradient-to-tr from-gray-50 to-gray-100' : 'justify-between'}`}
    >
      <div className="flex gap-x-2 items-center min-w-0 flex-1">
        {hasValidImage ? (
          <Image
            src={user.image!}
            className="min-w-10 w-10 h-10 bg-gray-100 rounded-full object-cover"
            priority={false}
            width="0"
            height="0"
            alt="Rosie Paws"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-medium">
            {getInitial()}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm text-gray-600 truncate">{user?.email}</p>
        </div>
      </div>
      <ChevronDown
        className={`
            w-4 h-4 
            text-gray-600 
            transition-transform duration-200 
            flex-shrink-0 ml-2
            ${userDropdown ? 'rotate-180' : ''}
          `}
      />
    </div>
  )
}

export default UserSelectorHeader
