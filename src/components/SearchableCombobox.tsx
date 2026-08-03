import { Combobox, useComboboxFilter, type ComboboxProps } from '@fluentui/react-components'
import { useMemo, useState } from 'react'

export interface SearchableOption {
  value: string
  label: string
}

interface SearchableComboboxProps {
  options: SearchableOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

// Combobox có gõ để lọc thật sự — Combobox trần của Fluent chỉ hiển thị value, không tự lọc
// <Option> con theo text gõ vào (phải tự quản lý query + dùng useComboboxFilter, theo đúng
// pattern "Filterable Combobox" chính thức của Fluent). Dùng cho single-select danh sách dài
// (vd "Chọn trường" ở SchoolHeader).
// positioning ép cứng 'below' (bỏ 'after'/'before' khỏi fallback mặc định của Fluent): với
// danh sách dài, listbox cần nhiều chiều cao hơn khoảng trống còn lại bên dưới trong <main>
// (overflow: auto) nên Fluent tự fallback xổ sang phải — ép 'below' để luôn xổ xuống, cuộn
// nội bộ listbox thay vì đổi hướng.
export function SearchableCombobox({ options, value, onChange, placeholder }: SearchableComboboxProps) {
  const [query, setQuery] = useState('')

  const items = useMemo(() => options.map((o) => ({ value: o.value, children: o.label })), [options])
  const filteredOptions = useComboboxFilter(query, items, {
    noOptionsMessage: 'Không tìm thấy kết quả',
    optionToText: (item) => String(item.children),
  })

  const selectedLabel = options.find((o) => o.value === value)?.label ?? ''

  const onOptionSelect: ComboboxProps['onOptionSelect'] = (_, data) => {
    if (data.optionValue) {
      onChange(data.optionValue)
      setQuery('')
    }
  }

  return (
    <Combobox
      freeform
      positioning={{ position: 'below', align: 'start', fallbackPositions: ['above'] }}
      value={query !== '' ? query : selectedLabel}
      placeholder={placeholder}
      selectedOptions={[value]}
      onOptionSelect={onOptionSelect}
      onChange={(e) => setQuery(e.target.value)}
      onBlur={() => setQuery('')}
    >
      {filteredOptions}
    </Combobox>
  )
}
