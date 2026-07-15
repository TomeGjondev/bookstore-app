import { collection, deleteDoc, doc, getDocs, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'
import { firebaseApp } from '../../lib/firebase/config'

const db = firebaseApp ? getFirestore(firebaseApp) : null

export async function getWishlist(uid: string) {
  if (!db) return []
  const snapshot = await getDocs(collection(db, 'users', uid, 'wishlist'))
  return snapshot.docs.map((item) => item.id)
}

export async function saveWishlistBook(uid: string, bookId: string) {
  if (!db) return
  await setDoc(doc(db, 'users', uid, 'wishlist', bookId), { bookId, addedAt: serverTimestamp() })
}

export async function removeWishlistBook(uid: string, bookId: string) {
  if (!db) return
  await deleteDoc(doc(db, 'users', uid, 'wishlist', bookId))
}
