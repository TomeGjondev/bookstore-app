import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut as firebaseSignOut, updateProfile } from 'firebase/auth'
import { doc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore'
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
  await updateProfile(credential.user, { displayName: name })
  if (db) {
    await setDoc(doc(db, 'users', credential.user.uid), {
      displayName: name,
      email: credential.user.email,
      role: 'customer',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true })
  }
  return credential
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
