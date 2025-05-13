import Title from '@/app/components/admin/Title'
import AwesomeIcon from '@/app/components/common/AwesomeIcon'
import { plusIcon } from '@/app/lib/icons'
import React from 'react'

const Journal = () => {
  return (
    <>
      <div className="flex items-center justify-between pb-2 border-b-1 border-b-zinc-200">
        <Title title="Journal" />
        <button className="h-7 w-fit px-2 py-1 rounded-md text-white bg-indigo-500 font-semibold text-sm flex items-center gap-x-2">
          <AwesomeIcon icon={plusIcon} className="w-3.5 h-3.5 text-white" />
          Create journal
        </button>
      </div>
    </>
  )
}

export default Journal
