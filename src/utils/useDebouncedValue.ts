import { useEffect, useRef, useState } from 'react'

// Tách state gõ phím (tức thời, cục bộ) khỏi giá trị đồng bộ ra ngoài (vd URL query
// param) — vì mỗi lần gõ đều ghi thẳng ra ngoài (điều hướng router) sẽ làm gãy compose
// dấu tiếng Việt (Telex/VNI) giữa chừng. Chỉ ghi ra ngoài sau khi người dùng ngừng gõ.
export function useDebouncedValue(
  externalValue: string,
  onCommit: (value: string) => void,
  delayMs = 400,
): [string, (value: string) => void] {
  const [liveValue, setLiveValue] = useState(externalValue)
  const lastCommittedRef = useRef(externalValue)

  // Giá trị ngoài đổi do nguyên nhân khác ta (vd nút "Làm mới", back/forward) -> đồng bộ lại.
  useEffect(() => {
    if (externalValue !== lastCommittedRef.current) {
      lastCommittedRef.current = externalValue
      setLiveValue(externalValue)
    }
  }, [externalValue])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (liveValue !== lastCommittedRef.current) {
        lastCommittedRef.current = liveValue
        onCommit(liveValue)
      }
    }, delayMs)
    return () => clearTimeout(timer)
  }, [liveValue, delayMs, onCommit])

  return [liveValue, setLiveValue]
}
