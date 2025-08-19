import { setOpenSlideMessage } from '@/app/redux/features/appSlice'
import { setInputs } from '@/app/redux/features/formSlice'
import { useCreateMediaMutation } from '@/app/redux/services/mediaApi'
import { useAppDispatch } from '@/app/redux/store'
import { uploadFileToFirebase } from '@/app/utils/firebase-helpers'
import { Plus } from 'lucide-react'
import { useRef } from 'react'

const getTypeFromFile = (fileName: any) => {
  const ext = fileName.split('.').pop().toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'].includes(ext)) return 'poster'
  if (['pdf'].includes(ext) && fileName.toLowerCase().includes('book')) return 'ebook'
  if (['pdf'].includes(ext)) return 'ebook'
  if (['doc', 'docx', 'rtf', 'odt'].includes(ext)) return 'document'
  if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) return 'document'
  if (['ppt', 'pptx', 'odp'].includes(ext)) return 'document'
  if (['txt', 'md', 'json', 'xml'].includes(ext)) return 'document'
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'].includes(ext)) return 'document'
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'document'
  return 'document'
}

const getColorFromType = (type: string | number | any, fileName: any) => {
  // Deterministic color based on media type
  const typeColors: any = {
    poster: 'purple',
    ebook: 'green',
    document: 'blue'
  }

  // If it's a specific document type, assign specific colors
  const ext: any = fileName.split('.').pop().toLowerCase()
  const extColors: any = {
    pdf: 'red',
    doc: 'blue',
    docx: 'blue',
    xls: 'green',
    xlsx: 'green',
    ppt: 'orange',
    pptx: 'orange',
    txt: 'gray',
    jpg: 'purple',
    jpeg: 'purple',
    png: 'purple',
    gif: 'indigo',
    mp4: 'orange',
    avi: 'orange'
  }

  return extColors[ext] || typeColors[type] || 'blue'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const UploadCard = ({ setIsUploading, handleUploadProgress, mediaForm }: any) => {
  const dispatch = useAppDispatch()
  const [createMedia] = useCreateMediaMutation() as any
  const fileInputRef = useRef(null) as any

  const handleFileUpload = async (files: any) => {
    setIsUploading(true)
    const fileArray: any = Array.from(files)

    dispatch(
      setInputs({
        formName: 'mediaForm',
        data: { uploadingFiles: fileArray.map((f: { name: any }) => ({ name: f.name, progress: 0 })) }
      })
    )

    try {
      const uploadPromises = fileArray.map(async (file: any) => {
        try {
          // Upload to Firebase with progress tracking
          const downloadURL = await uploadFileToFirebase(file, handleUploadProgress, getTypeFromFile(file.name))

          // Create media item with Firebase URL
          return {
            title: file.name.replace(/\.[^/.]+$/, ''),
            type: getTypeFromFile(file.name),
            format: file.name.split('.').pop().toUpperCase(),
            size: formatFileSize(file.size),
            sizeBytes: file.size,
            views: 0,
            downloads: 0,
            thumbnail: downloadURL, // Use Firebase URL as thumbnail
            filePath: downloadURL, // Store Firebase download URL
            fileName: file.name,
            mimeType: file.type,
            color: getColorFromType(getTypeFromFile(file.name), file.name),
            isActive: true,
            tags: []
          }
        } catch (error) {
          throw error
        }
      })

      const newItems = await Promise.all(uploadPromises)

      const itemsToSave = [...mediaForm?.inputs?.uploadingFiles, ...newItems]

      dispatch(
        setInputs({
          formName: 'mediaForm',
          data: { uploadingFiles: itemsToSave }
        })
      )

      await createMedia({ items: itemsToSave }).unwrap()
    } catch {
      dispatch(setOpenSlideMessage())
    } finally {
      setIsUploading(false)

      setTimeout(() => {
        dispatch(
          setInputs({
            formName: 'mediaForm',
            data: { uploadingFiles: [] }
          })
        )
      }, 300)
    }
  }

  return (
    <div
      className="transition-all duration-300 hover:scale-[1.02] w-full h-full rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 overflow-hidden relative flex flex-col cursor-pointer aspect-square"
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="p-6 flex flex-col h-full items-center justify-center text-center">
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 shadow-md mb-4">
          <Plus className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-700 mb-2">Upload New Media</h3>
        <p className="text-sm text-gray-500 mb-4">Click here to browse</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">PDF</span>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">PNG</span>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">JPG</span>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.doc,.docx,.xlsx,.xls"
        className="hidden"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
      />
    </div>
  )
}

export default UploadCard
