import { readFileSync } from 'node:fs'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing'
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { deleteObject, ref, uploadBytes } from 'firebase/storage'

let environment: RulesTestEnvironment

beforeAll(async () => {
  environment = await initializeTestEnvironment({
    projectId: 'demo-bookstore',
    firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
    storage: { rules: readFileSync('storage.rules', 'utf8'), host: '127.0.0.1', port: 9199 },
  })
})

beforeEach(async () => {
  await environment.clearFirestore()
  await environment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'books', 'active-book'), { title: 'Visible', status: 'active' })
    await setDoc(doc(context.firestore(), 'books', 'draft-book'), { title: 'Hidden', status: 'draft' })
  })
})

afterAll(async () => environment.cleanup())

describe('Firestore rules', () => {
  it('allows public active-book reads but protects drafts', async () => {
    const store = environment.unauthenticatedContext().firestore()
    await assertSucceeds(getDoc(doc(store, 'books', 'active-book')))
    await assertFails(getDoc(doc(store, 'books', 'draft-book')))
  })

  it('keeps customer cart data owner-scoped', async () => {
    const owner = environment.authenticatedContext('reader-a').firestore()
    const stranger = environment.authenticatedContext('reader-b').firestore()
    const cartLine = doc(owner, 'users', 'reader-a', 'cart', 'book-a')
    await assertSucceeds(setDoc(cartLine, { bookId: 'book-a', quantity: 1, updatedAt: serverTimestamp() }))
    await assertFails(getDoc(doc(stranger, 'users', 'reader-a', 'cart', 'book-a')))
  })

  it('rejects malformed customer-owned data', async () => {
    const owner = environment.authenticatedContext('reader-a').firestore()
    await assertFails(setDoc(doc(owner, 'users', 'reader-a', 'cart', 'book-a'), {
      bookId: 'different-book', quantity: 1, updatedAt: serverTimestamp(),
    }))
    await assertFails(setDoc(doc(owner, 'users', 'reader-a', 'cart', 'book-a'), {
      bookId: 'book-a', quantity: 0, updatedAt: serverTimestamp(),
    }))
    await assertFails(setDoc(doc(owner, 'users', 'reader-a', 'wishlist', 'book-a'), {
      bookId: 'book-a', addedAt: serverTimestamp(), injected: true,
    }))
  })

  it('prevents customers from changing roles or adding arbitrary profile fields', async () => {
    await environment.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), 'users', 'reader-a'), {
        displayName: 'Reader', email: 'reader@example.com', role: 'customer',
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      })
    })
    const owner = environment.authenticatedContext('reader-a').firestore()
    await assertFails(updateDoc(doc(owner, 'users', 'reader-a'), { role: 'admin' }))
    await assertFails(updateDoc(doc(owner, 'users', 'reader-a'), { creditBalance: 1000 }))
    await assertSucceeds(updateDoc(doc(owner, 'users', 'reader-a'), {
      displayName: 'A Reader', updatedAt: serverTimestamp(),
    }))
  })

  it('reserves order creation for trusted server code', async () => {
    const customer = environment.authenticatedContext('reader').firestore()
    await assertFails(setDoc(doc(customer, 'orders', 'order-a'), {
      userId: 'reader', total: 1, status: 'paid',
    }))
  })

  it('requires the admin claim for catalog writes', async () => {
    const customer = environment.authenticatedContext('reader').firestore()
    const admin = environment.authenticatedContext('staff', { admin: true }).firestore()
    await assertFails(setDoc(doc(customer, 'books', 'new-book'), { status: 'active', title: 'No' }))
    await assertSucceeds(setDoc(doc(admin, 'books', 'new-book'), { status: 'active', title: 'Yes' }))
  })
})

describe('Storage rules', () => {
  it('accepts admin image uploads and rejects customer or invalid uploads', async () => {
    const adminStorage = environment.authenticatedContext('staff', { admin: true }).storage()
    const customerStorage = environment.authenticatedContext('reader').storage()
    await assertSucceeds(uploadBytes(ref(adminStorage, 'book-covers/book-a/cover.webp'), new Uint8Array([1, 2, 3]), { contentType: 'image/webp' }))
    await assertFails(uploadBytes(ref(customerStorage, 'book-covers/book-a/other.webp'), new Uint8Array([1]), { contentType: 'image/webp' }))
    await assertFails(uploadBytes(ref(adminStorage, 'book-covers/book-a/notes.txt'), new Uint8Array([1]), { contentType: 'text/plain' }))
    await assertSucceeds(deleteObject(ref(adminStorage, 'book-covers/book-a/cover.webp')))
  })
})
