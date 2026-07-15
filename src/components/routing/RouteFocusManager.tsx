import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function RouteFocusManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    const main = document.querySelector<HTMLElement>('main')
    if (!main) return
    main.tabIndex = -1
    main.focus({ preventScroll: true })
  }, [pathname])

  return null
}
