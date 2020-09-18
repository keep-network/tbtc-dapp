import { useEffect, useRef, useState } from "react"

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

export function useClickToCopy() {
  const [isCopied, setIsCopied] = useState(false)
  const hiddenCopyFieldRef = useRef(null)

  const handleCopyClick = () => {
    hiddenCopyFieldRef.current.select()
    document.execCommand("copy")
    hiddenCopyFieldRef.current.blur()
    setIsCopied(true)
  }

  return { isCopied, setIsCopied, hiddenCopyFieldRef, handleCopyClick }
}
