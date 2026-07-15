import { useEffect, useRef } from 'react'

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(active: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !ref.current) return
    const dialog = ref.current
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
    focusable[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const currentFocusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
      if (!currentFocusable.length) return
      const first = currentFocusable[0]
      const last = currentFocusable.at(-1)!
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    dialog.addEventListener('keydown', handleKeyDown)
    return () => {
      dialog.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [active, onClose])

  return ref
}
