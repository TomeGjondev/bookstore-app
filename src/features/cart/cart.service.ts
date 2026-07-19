import { collection, deleteDoc, doc, getDocs, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'
import { firebaseApp } from '../../lib/firebase/config'
import type { CartLine } from './cart.types'

const db = firebaseApp ? getFirestore(firebaseApp) : null
const mutationQueues = new Map<string, Promise<void>>()

function enqueueMutation(uid: string, operation: () => Promise<void>) {
  const previous = mutationQueues.get(uid) ?? Promise.resolve()
  const next = previous.catch(() => undefined).then(operation)
  mutationQueues.set(uid, next)
  void next.then(
    () => { if (mutationQueues.get(uid) === next) mutationQueues.delete(uid) },
    () => { if (mutationQueues.get(uid) === next) mutationQueues.delete(uid) },
  )
  return next
}

export async function getUserCart(uid: string): Promise<CartLine[]> {
  if (!db) return []
  await mutationQueues.get(uid)?.catch(() => undefined)
  const snapshot = await getDocs(collection(db, 'users', uid, 'cart'))
  return snapshot.docs.map((item) => ({ bookId: item.id, quantity: Number(item.data().quantity) || 1 }))
}

export async function saveUserCartLine(uid: string, line: CartLine) {
  if (!db) return
  await enqueueMutation(uid, () => setDoc(doc(db, 'users', uid, 'cart', line.bookId), {
    bookId: line.bookId,
    quantity: line.quantity,
    updatedAt: serverTimestamp(),
  }, { merge: true }))
}

export async function removeUserCartLine(uid: string, bookId: string) {
  if (!db) return
  await enqueueMutation(uid, () => deleteDoc(doc(db, 'users', uid, 'cart', bookId)))
}
