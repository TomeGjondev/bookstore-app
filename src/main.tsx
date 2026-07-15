import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './app/App'
import { AuthProvider } from './features/auth/auth.context'
import { CartProvider } from './features/cart/cart.context'
import { WishlistProvider } from './features/wishlist/wishlist.context'
import { CatalogProvider } from './features/catalog/catalog.context'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CatalogProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </CartProvider>
        </CatalogProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
