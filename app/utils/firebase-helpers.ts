import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../lib/config/firebaseConfig'

/**
 * Uploads a video or image file to Firebase Storage.
 * @param {File} file - The video file to upload.
 * @param {(progress: number) => void} onProgress - Callback for upload progress (optional).
 * @returns {Promise<string>} - The download URL of the uploaded video.
 */
export const uploadFileToFirebase = async (
  file: File,
  onProgress: (progress: number) => void = () => {},
  type: 'image' | 'video' = 'image'
): Promise<string> => {
  if (!file) {
    throw new Error('No file provided')
  }

  // Create a storage reference
  const storageRef = ref(storage, `${type}s/${file.name}`)

  // Start the upload task
  const uploadTask = uploadBytesResumable(storageRef, file)

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Calculate progress as a percentage
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        onProgress(progress)
      },
      (error) => {
        reject(error)
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
          resolve(downloadURL)
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}

export const deleteFileFromFirebase = async (fileName: string, type: 'image' | 'video' = 'image'): Promise<void> => {
  if (!fileName) {
    throw new Error('No file name provided')
  }

  try {
    // Create a storage reference to the file
    const filePath = `${type}s/${fileName}` // Match the upload folder structure
    const fileRef = ref(storage, filePath)

    // Delete the file
    await deleteObject(fileRef)
    console.log(`File "${fileName}" of type "${type}" has been deleted successfully.`)
  } catch (error) {
    console.error(`Failed to delete file "${fileName}" of type "${type}":`, error)
    throw error // Optionally rethrow the error
  }
}
