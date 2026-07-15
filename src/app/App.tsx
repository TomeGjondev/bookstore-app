import { Route, Routes } from 'react-router-dom'
import { StoreLayout } from '../components/layout/StoreLayout'
import { BookDetailPage } from '../features/catalog/pages/BookDetailPage'
import { CatalogPage } from '../features/catalog/pages/CatalogPage'
import { HomePage } from '../features/home/pages/HomePage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { ForgotPasswordPage } from '../features/auth/pages/ForgotPasswordPage'
import { AccountPage } from '../features/account/pages/AccountPage'
import { CartPage } from '../features/cart/pages/CartPage'
import { ProtectedRoute } from '../components/routing/ProtectedRoute'
import { WishlistPage } from '../features/wishlist/pages/WishlistPage'
import { ProfilePage } from '../features/account/pages/ProfilePage'
import { AdminRoute } from '../components/routing/AdminRoute'
import { AdminLayout } from '../features/admin/components/AdminLayout'
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage'
import { AdminBooksPage } from '../features/admin/pages/AdminBooksPage'
import { AdminBookFormPage } from '../features/admin/pages/AdminBookFormPage'
import { RouteFocusManager } from '../components/routing/RouteFocusManager'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="placeholder-page page-shell">
      <p className="eyebrow">A new shelf is being arranged</p>
      <h1>{title}</h1>
      <p>This part of the bookshop arrives in the next chapter.</p>
    </main>
  )
}

export function App() {
  return (
    <><RouteFocusManager /><Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<HomePage />} />
        <Route path="books" element={<CatalogPage />} />
        <Route path="books/:slug" element={<BookDetailPage />} />
        <Route path="staff-picks" element={<PlaceholderPage title="Staff picks" />} />
        <Route path="new-arrivals" element={<PlaceholderPage title="New arrivals" />} />
        <Route path="about" element={<PlaceholderPage title="Our story" />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
        <Route path="account/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="account/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="*" element={<PlaceholderPage title="This page has wandered off" />} />
      </Route>
      <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="books" element={<AdminBooksPage />} />
        <Route path="books/new" element={<AdminBookFormPage />} />
        <Route path="books/:bookId/edit" element={<AdminBookFormPage />} />
      </Route>
    </Routes></>
  )
}
