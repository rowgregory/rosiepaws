import { IMedia, MediaColor, MediaType } from '@/app/types'

export const mediaInitialState: IMedia = {
  id: '',
  title: '',
  type: MediaType.DOCUMENT,
  format: '',
  size: '0 MB',
  sizeBytes: '0',
  uploadDate: new Date().toISOString(),
  views: 0,
  downloads: 0,
  thumbnail: undefined,
  color: MediaColor.BLUE,
  fileName: '',
  filePath: '',
  mimeType: '',
  description: undefined,
  tags: [],
  isActive: true,
  deletedAt: undefined,
  createdAt: '',
  updatedAt: ''
}
