import { Blog } from '@/app/types/model.types'

export const blogInitialState: Blog = {
  id: '',
  title: '',
  content: '',
  authorId: '',
  createdAt: new Date(),
  updatedAt: new Date()
}
