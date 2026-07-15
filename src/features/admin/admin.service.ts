import { getIdTokenResult, type User } from 'firebase/auth'
import { collection, doc, getDocs, getFirestore, serverTimestamp, setDoc, updateDoc, writeBatch } from 'firebase/firestore'
import { firebaseApp } from '../../lib/firebase/config'
import { books as seedBooks } from '../catalog/catalog.data'
import type { Book, BookStatus } from '../catalog/catalog.types'

const db = firebaseApp ? getFirestore(firebaseApp) : null

export async function hasAdminClaim(user: User) {
  const token = await getIdTokenResult(user, true)
  return token.claims.admin === true
}

export async function getAdminBooks(): Promise<Book[]> {
  if (!db) return seedBooks.map((book) => ({ ...book, status: 'active' as const }))
  const snapshot = await getDocs(collection(db, 'books'))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Book))
}

export async function saveBook(book: Book, actorId: string) {
  if (!db) throw new Error('Connect Firebase before saving catalog changes.')
  const reference = book.id ? doc(db, 'books', book.id) : doc(collection(db, 'books'))
  const cleanBook = Object.fromEntries(Object.entries({ ...book, id: reference.id }).filter(([, value]) => value !== undefined))
  await setDoc(reference, {
    ...cleanBook,
    updatedAt: serverTimestamp(),
    updatedBy: actorId,
    ...(!book.id ? { createdAt: serverTimestamp(), createdBy: actorId } : {}),
  }, { merge: true })
  return reference.id
}

export async function setBookStatus(bookId: string, status: BookStatus, actorId: string) {
  if (!db) throw new Error('Connect Firebase before changing publication status.')
  await updateDoc(doc(db, 'books', bookId), { status, updatedAt: serverTimestamp(), updatedBy: actorId })
}

export async function updateBookInventory(bookId: string, inventoryCount: number, actorId: string) {
  if (!db) throw new Error('Connect Firebase before updating inventory.')
  await updateDoc(doc(db, 'books', bookId), {
    inventoryCount,
    inStock: inventoryCount > 0,
    updatedAt: serverTimestamp(),
    updatedBy: actorId,
  })
}

export async function seedDevelopmentCatalog(actorId: string) {
  if (!db) throw new Error('Connect Firebase before importing the starter catalog.')
  const batch = writeBatch(db)
  for (const book of seedBooks) {
    const reference = doc(db, 'books', book.id)
    batch.set(reference, {
      ...book,
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: actorId,
      updatedBy: actorId,
    })
  }
  await batch.commit()
}
