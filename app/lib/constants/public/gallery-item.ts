import { IGalleryItem, MediaType } from '@/app/types'

export const galleryItemInitialState: IGalleryItem = {
  id: '',
  url: '',
  type: MediaType.IMAGE,
  name: '',
  size: 0, // 1MB
  mimeType: 'i',
  thumbnail: null,
  description: '',
  tags: [],
  isPublic: false,
  petId: '',
  userId: '',
  createdAt: new Date('2024-01-15T10:30:00Z'),
  updatedAt: new Date('2024-01-15T10:30:00Z')
}
