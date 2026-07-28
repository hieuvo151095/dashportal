import { useEffect, useState } from 'react'

function depsEqual(a: unknown[], b: unknown[]): boolean {
  return a.length === b.length && a.every((value, index) => Object.is(value, b[index]))
}

// Giả lập độ trễ gọi API thật khi đổi filter (~400-600ms) — theo yêu cầu UX của spec.
export function useSkeletonDelay(deps: unknown[]): boolean {
  const [loading, setLoading] = useState(true)
  const [prevDeps, setPrevDeps] = useState(deps)

  // "Adjusting state when props change" — set lại loading ngay trong lúc render
  // (không phải trong effect) khi deps đổi, theo pattern khuyến nghị của React.
  if (!depsEqual(prevDeps, deps)) {
    setPrevDeps(deps)
    if (!loading) setLoading(true)
  }

  useEffect(() => {
    const delayMs = 400 + Math.random() * 200
    const timer = setTimeout(() => setLoading(false), delayMs)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return loading
}
