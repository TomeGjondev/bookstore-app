import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut as firebaseSignOut, updateProfile, type User } from 'firebase/auth'
import { doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'
import { firebaseApp } from '../../lib/firebase/config'

export const auth = firebaseApp ? getAuth(firebaseApp) : null
const db = firebaseApp ? getFirestore(firebaseApp) : null

function requireAuth() {
  if (!auth) throw new Error('Firebase is not configured yet. Add the project values from Firebase to your local environment file.')
  return auth
}

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(requireAuth(), email, password)
}

export async function register(name: string, email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(requireAuth(), email, password)
  await Promise.allSettled([
    updateProfile(credential.user, { displayName: name }),
    synchronizeUserProfile(credential.user, name),
  ])
  return credential
}

export async function synchronizeUserProfile(user: User, displayName?: string) {
  if (!db) return
  const reference = doc(db, 'users', user.uid)
  const snapshot = await getDoc(reference)
  const resolvedDisplayName = displayName?.trim() || user.displayName?.trim()
  const profile = {
    email: user.email ?? '',
    updatedAt: serverTimestamp(),
    ...(resolvedDisplayName ? { displayName: resolvedDisplayName } : {}),
  }
  if (snapshot.exists()) {
    await setDoc(reference, profile, { merge: true })
    return
  }
  await setDoc(reference, {
    ...profile,
    displayName: resolvedDisplayName || 'Reader',
    role: 'customer',
    createdAt: serverTimestamp(),
  })
}

export async function requestPasswordReset(email: string) {
  await sendPasswordResetEmail(requireAuth(), email)
}

export async function signOut() {
  await firebaseSignOut(requireAuth())
}

export async function updateDisplayName(name: string) {
  const currentUser = requireAuth().currentUser
  if (!currentUser) throw new Error('Please sign in again before updating your profile.')
  await updateProfile(currentUser, { displayName: name })
}

export function friendlyAuthError(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : ''
  if (code.includes('invalid-credential')) return 'We couldn’t sign you in with those details. Please check them and try again.'
  if (code.includes('email-already-in-use')) return 'An account already uses that email address. Try signing in instead.'
  if (code.includes('weak-password')) return 'Choose a stronger password with at least eight characters.'
  if (code.includes('invalid-email')) return 'That email address does not look quite right.'
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again in a moment.'
}
