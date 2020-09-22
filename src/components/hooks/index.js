import { useEffect, useRef, useState } from "react"

export function useClickOutside(onOutsideClick, shouldAddClickListener) {
  const ref = useRef(null)
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

  return ref
}

export function useClickToCopy() {
  const [isCopied, setIsCopied] = useState(false)
  const hiddenCopyFieldRef = useRef(null)

  const scheduleReset = () => {
    clearTimeout(scheduleReset)
    setTimeout(() => {
      setIsCopied(false)
    }, 8000)
  }

  const handleCopyClick = () => {
    hiddenCopyFieldRef.current.select()
    document.execCommand("copy")
    hiddenCopyFieldRef.current.blur()
    setIsCopied(true)
    scheduleReset()
  }

  return { isCopied, setIsCopied, hiddenCopyFieldRef, handleCopyClick }
}
