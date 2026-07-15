import { Route, Routes } from 'react-router-dom'
import { StoreLayout } from '../components/layout/StoreLayout'
import { BookDetailPage } from '../features/catalog/pages/BookDetailPage'
import { CatalogPage } from '../features/catalog/pages/CatalogPage'
import { HomePage } from '../features/home/pages/HomePage'

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
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<HomePage />} />
        <Route path="books" element={<CatalogPage />} />
        <Route path="books/:slug" element={<BookDetailPage />} />
        <Route path="staff-picks" element={<PlaceholderPage title="Staff picks" />} />
        <Route path="new-arrivals" element={<PlaceholderPage title="New arrivals" />} />
        <Route path="about" element={<PlaceholderPage title="Our story" />} />
        <Route path="cart" element={<PlaceholderPage title="Your book bag" />} />
        <Route path="account" element={<PlaceholderPage title="Your account" />} />
        <Route path="*" element={<PlaceholderPage title="This page has wandered off" />} />
      </Route>
    </Routes>
  )
}
