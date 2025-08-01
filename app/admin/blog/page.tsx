import Title from '@/app/components/admin/common/Title'
import { Plus } from 'lucide-react'
import React from 'react'

const Blog = () => {
  return (
    <>
      <div className="flex items-center justify-between pb-2 border-b-1 border-b-zinc-200">
        <Title title="Blog" />
        <button className="h-7 w-fit px-2 py-1 rounded-md text-white bg-indigo-500 font-semibold text-sm flex items-center gap-x-2">
          <Plus className="w-3.5 h-3.5 text-white" />
          Create blog
        </button>
      </div>
    </>
  )
}

export default Blog
