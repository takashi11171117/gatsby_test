import { useRef, useEffect } from "react"

export default function usePrevious(value) {
  const ref = useRef(null)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}
