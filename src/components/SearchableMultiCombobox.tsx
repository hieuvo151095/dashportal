import { Combobox, useComboboxFilter, type ComboboxProps } from '@fluentui/react-components'
import { useMemo, useState } from 'react'
import type { SearchableOption } from './SearchableCombobox'

interface SearchableMultiComboboxProps {
  options: SearchableOption[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  /** Text hiện khi chưa chọn mục nào (vd "Toàn thành phố", "Tất cả trường") — quy ước: mảng
   * rỗng = Tất cả, không phải 1 sentinel 'all' riêng như bản single-select cũ. */
  allLabel: string
}

// Bản multi-select của SearchableCombobox — cùng cơ chế lọc theo gõ (useComboboxFilter), giữ
// popup mở sau khi chọn (multiselect) để chọn tiếp nhiều mục liên tục. Dùng cho danh sách dài
// cần OR-match (Trường, Xã/Phường) — danh sách ngắn (Cấp học, Hệ thống...) vẫn dùng Dropdown
// multiselect thường, không cần component này.
export function SearchableMultiCombobox({
  options,
  selected,
  onChange,
  placeholder,
  allLabel,
}: SearchableMultiComboboxProps) {
  const [query, setQuery] = useState('')

  const items = useMemo(() => options.map((o) => ({ value: o.value, children: o.label })), [options])
  const filteredOptions = useComboboxFilter(query, items, {
    noOptionsMessage: 'Không tìm thấy kết quả',
    optionToText: (item) => String(item.children),
  })

  const summaryLabel =
    selected.length === 0
      ? allLabel
      : selected.length === 1
        ? (options.find((o) => o.value === selected[0])?.label ?? allLabel)
        : `Đã chọn ${selected.length} mục`

  const onOptionSelect: ComboboxProps['onOptionSelect'] = (_, data) => {
    onChange(data.selectedOptions)
    setQuery('')
  }

  return (
    <Combobox
      freeform
      multiselect
      value={query !== '' ? query : summaryLabel}
      placeholder={placeholder}
      selectedOptions={selected}
      onOptionSelect={onOptionSelect}
      onChange={(e) => setQuery(e.target.value)}
      onBlur={() => setQuery('')}
    >
      {filteredOptions}
    </Combobox>
  )
}
