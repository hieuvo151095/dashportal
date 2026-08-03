import { Combobox, Option, useComboboxFilter, type ComboboxProps } from '@fluentui/react-components'
import { useMemo, useState } from 'react'
import { ALL_OPTION_VALUE, resolveMultiSelectChangeEmpty, withAllOptionSelectedEmpty } from '../utils/multiSelectAll'
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
// positioning ép cứng 'below' — xem giải thích ở SearchableCombobox.tsx (cùng nguyên nhân:
// listbox dài dễ bị Fluent tự fallback xổ sang phải trong <main overflow:auto>).
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
    onChange(resolveMultiSelectChangeEmpty(data))
    setQuery('')
  }

  return (
    <Combobox
      freeform
      multiselect
      positioning={{ position: 'below', align: 'start', fallbackPositions: ['above'] }}
      value={query !== '' ? query : summaryLabel}
      placeholder={placeholder}
      selectedOptions={withAllOptionSelectedEmpty(selected)}
      onOptionSelect={onOptionSelect}
      onChange={(e) => setQuery(e.target.value)}
      onBlur={() => setQuery('')}
    >
      <Option value={ALL_OPTION_VALUE}>{allLabel}</Option>
      {filteredOptions}
    </Combobox>
  )
}
