import { useSearchParams } from 'react-router-dom'

// Đồng bộ 1 filter với URL query param — deep-link giữ nguyên bộ lọc, và cho phép
// truyền filter qua query string khi điều hướng Tổng hợp -> Chi tiết (drill-down).
export function useQueryParam(key: string, defaultValue: string): [string, (value: string) => void] {
  const [params, setParams] = useSearchParams()
  const value = params.get(key) ?? defaultValue

  function setValue(next: string) {
    setParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev)
        if (next === defaultValue) {
          nextParams.delete(key)
        } else {
          nextParams.set(key, next)
        }
        return nextParams
      },
      { replace: true },
    )
  }

  return [value, setValue]
}

export function useQueryParamArray(key: string, defaultValue: string[]): [string[], (value: string[]) => void] {
  const [raw, setRaw] = useQueryParam(key, defaultValue.join(','))
  const value = raw === '' ? [] : raw.split(',')

  function setValue(next: string[]) {
    setRaw(next.join(','))
  }

  return [value, setValue]
}
