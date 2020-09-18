import { useEffect } from "react"

export function useClickOutside(ref, onOutsideClick, shouldAddClickListener) {
  useEffect(() => {
    const clickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onOutsideClick()
        document.removeEventListener("click", clickOutside)
      }
    }

    if (shouldAddClickListener) {
      document.addEventListener("click", clickOutside)
    }
  }, [ref, onOutsideClick, shouldAddClickListener])
}
