import { Heart } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/auth.context'
import { useWishlist } from '../wishlist.context'

interface WishlistButtonProps {
  bookId: string
  title: string
  className?: string
}

export function WishlistButton({ bookId, title, className = 'favorite-button' }: WishlistButtonProps) {
  const { user } = useAuth()
  const { hasBook, toggleBook } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()
  const saved = hasBook(bookId)

  const handleClick = async () => {
    if (!user) {
      sessionStorage.setItem('lantern-and-leaf-wishlist-intent', bookId)
      navigate('/login', { state: { from: location.pathname, wishlistBookId: bookId } })
      return
    }
    await toggleBook(bookId)
  }

  return (
    <button className={`${className}${saved ? ' is-saved' : ''}`} type="button" aria-label={saved ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`} aria-pressed={saved} onClick={handleClick}>
      <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
    </button>
  )
}
