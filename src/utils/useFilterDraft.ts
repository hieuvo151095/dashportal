import { useState } from 'react'

// Lớp "draft" cục bộ quanh filter đã áp dụng (URL-synced) — filter bar chỉnh sửa draft
// trước, chỉ ghi thật ra ngoài khi gọi apply(). Tự đồng bộ lại draft mỗi khi "applied"
// đổi vì lý do khác ta chủ động gây ra trong lúc đang có draft (drill-down sang trang
// khác, "Làm mới", back/forward trình duyệt, hoặc vừa apply xong).
export function useFilterDraft<T extends object>(applied: T): [T, (patch: Partial<T>) => void] {
  const [draft, setDraft] = useState<T>(applied)
  const [appliedSnapshot, setAppliedSnapshot] = useState<T>(applied)

  // "Adjusting state when props change" — so sánh & đồng bộ ngay trong lúc render
  // (không phải trong effect) khi applied đổi.
  const appliedKey = JSON.stringify(applied)
  if (appliedKey !== JSON.stringify(appliedSnapshot)) {
    setAppliedSnapshot(applied)
    setDraft(applied)
  }

  function setDraftField(patch: Partial<T>) {
    setDraft((prev) => ({ ...prev, ...patch }))
  }

  return [draft, setDraftField]
}
