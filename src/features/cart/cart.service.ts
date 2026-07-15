import { collection, deleteDoc, doc, getDocs, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'
import { firebaseApp } from '../../lib/firebase/config'
import type { CartLine } from './cart.types'

const db = firebaseApp ? getFirestore(firebaseApp) : null

export async function getUserCart(uid: string): Promise<CartLine[]> {
  if (!db) return []
  const snapshot = await getDocs(collection(db, 'users', uid, 'cart'))
  return snapshot.docs.map((item) => ({ bookId: item.id, quantity: Number(item.data().quantity) || 1 }))
}

export async function saveUserCartLine(uid: string, line: CartLine) {
  if (!db) return
  await setDoc(doc(db, 'users', uid, 'cart', line.bookId), {
    bookId: line.bookId,
    quantity: line.quantity,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

export async function removeUserCartLine(uid: string, bookId: string) {
  if (!db) return
  await deleteDoc(doc(db, 'users', uid, 'cart', bookId))
}
