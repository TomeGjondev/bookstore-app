import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'
import { firebaseApp } from '../../lib/firebase/config'

const db = firebaseApp ? getFirestore(firebaseApp) : null

export interface ReaderPreferences {
  favoriteGenres: string[]
  newsletter: boolean
}

export async function getReaderPreferences(uid: string): Promise<ReaderPreferences> {
  if (!db) return { favoriteGenres: [], newsletter: false }
  const snapshot = await getDoc(doc(db, 'users', uid))
  const preferences = snapshot.data()?.preferences as Partial<ReaderPreferences> | undefined
  return {
    favoriteGenres: Array.isArray(preferences?.favoriteGenres) ? preferences.favoriteGenres : [],
    newsletter: Boolean(preferences?.newsletter),
  }
}

export async function saveReaderProfile(uid: string, displayName: string, preferences: ReaderPreferences) {
  if (!db) return
  await setDoc(doc(db, 'users', uid), {
    displayName,
    preferences,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}
