import { useSearchParams } from 'react-router-dom'

// Lõi dùng chung cho mọi trang có filter đồng bộ qua URL — thay cho pattern get/update
// viết tay lặp lại ở từng useXFilters.ts. Cập nhật nhiều key cùng lúc trong 1 lần gọi
// setSearchParams (atomic) — tránh đè lẫn nhau khi 1 filter cần reset filter khác.
export function useUrlFilters<D extends Record<string, string>>(defaults: D) {
  const [params, setParams] = useSearchParams()

  function get(key: keyof D & string): string {
    return params.get(key) ?? defaults[key]
  }

  function update(patch: Partial<D>) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        for (const key of Object.keys(patch) as (keyof D & string)[]) {
          const value = patch[key]
          if (value === undefined) continue
          if (value === defaults[key]) {
            next.delete(key)
          } else {
            next.set(key, value)
          }
        }
        return next
      },
      { replace: true },
    )
  }

  function reset() {
    update(defaults)
  }

  return { get, update, reset }
}
