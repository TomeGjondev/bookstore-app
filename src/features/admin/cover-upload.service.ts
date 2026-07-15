import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { firebaseApp } from '../../lib/firebase/config'

const storage = firebaseApp ? getStorage(firebaseApp) : null
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxBytes = 5 * 1024 * 1024

export function validateCoverFile(file: File) {
  if (!allowedTypes.includes(file.type)) return 'Choose a JPG, PNG, or WebP image.'
  if (file.size > maxBytes) return 'Cover images must be smaller than 5 MB.'
  return ''
}

export async function uploadBookCover(file: File, bookKey: string, onProgress: (percentage: number) => void) {
  if (!storage) throw new Error('Connect Firebase Storage before uploading cover images.')
  const validationError = validateCoverFile(file)
  if (validationError) throw new Error(validationError)
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, '-')
  const path = `book-covers/${bookKey || 'new-book'}/${Date.now()}-${safeName}`
  const upload = uploadBytesResumable(ref(storage, path), file, { contentType: file.type })
  await new Promise<void>((resolve, reject) => {
    upload.on('state_changed', (snapshot) => onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)), reject, resolve)
  })
  return { coverPath: path, coverUrl: await getDownloadURL(upload.snapshot.ref) }
}
