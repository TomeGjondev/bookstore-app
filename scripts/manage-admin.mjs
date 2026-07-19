import { applicationDefault, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const [action, identity] = process.argv.slice(2)

if (!['grant', 'revoke'].includes(action) || !identity) {
  console.error('Usage: npm run admin:claim -- <grant|revoke> <user-id-or-email>')
  process.exitCode = 1
} else {
  initializeApp({ credential: applicationDefault() })
  const auth = getAuth()
  const user = identity.includes('@')
    ? await auth.getUserByEmail(identity)
    : await auth.getUser(identity)
  const claims = { ...user.customClaims }

  if (action === 'grant') claims.admin = true
  else delete claims.admin

  await auth.setCustomUserClaims(user.uid, claims)
  await auth.revokeRefreshTokens(user.uid)
  console.log(`${action === 'grant' ? 'Granted' : 'Revoked'} admin access for ${user.email ?? user.uid}.`)
  console.log('The user must sign in again before the new claim takes effect.')
}
