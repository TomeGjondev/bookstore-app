import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { firebaseApp } from '../../lib/firebase/config'
import type { Book } from './catalog.types'

const db = firebaseApp ? getFirestore(firebaseApp) : null

export async function getActiveBooks(): Promise<Book[] | null> {
  if (!db) return null
  const snapshot = await getDocs(query(collection(db, 'books'), where('status', '==', 'active')))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Book))
}
