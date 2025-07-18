import { Blog } from '@/app/types/entities'

export const blogInitialState: Blog = {
  id: '',
  title: '',
  content: '',
  authorId: '',
  createdAt: new Date(),
  updatedAt: new Date()
}
