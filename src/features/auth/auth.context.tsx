import { onAuthStateChanged, type User } from 'firebase/auth'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { auth, register, requestPasswordReset, signIn, signOut, synchronizeUserProfile, updateDisplayName } from './auth.service'

interface AuthContextValue {
  user: User | null
  loading: boolean
  configured: boolean
  signIn: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  signOut: () => Promise<void>
  updateName: (name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(Boolean(auth))
  const [, setProfileRevision] = useState(0)

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
      if (nextUser) void synchronizeUserProfile(nextUser).catch(() => undefined)
    })
  }, [])

  const value: AuthContextValue = {
    user,
    loading,
    configured: Boolean(auth),
    signIn: async (email, password) => { await signIn(email, password) },
    register: async (name, email, password) => { await register(name, email, password) },
    resetPassword: async (email) => { await requestPasswordReset(email) },
    signOut,
    updateName: async (name) => {
      await updateDisplayName(name)
      setProfileRevision((revision) => revision + 1)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// The provider and its companion hook intentionally share this small feature module.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
