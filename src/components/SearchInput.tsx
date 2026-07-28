import { Input, type InputProps } from '@fluentui/react-components'
import { SearchRegular } from '@fluentui/react-icons'
import { useDebouncedValue } from '../utils/useDebouncedValue'

interface SearchInputProps extends Omit<InputProps, 'value' | 'onChange' | 'contentBefore'> {
  value: string
  onChange: (value: string) => void
  delayMs?: number
}

// Input tìm kiếm dùng chung — gõ mượt (kể cả tiếng Việt có dấu) nhờ tách state gõ phím
// cục bộ khỏi giá trị đồng bộ ra URL, chỉ ghi ra ngoài sau khi ngừng gõ ~400ms.
export function SearchInput({ value, onChange, delayMs, ...rest }: SearchInputProps) {
  const [liveValue, setLiveValue] = useDebouncedValue(value, onChange, delayMs)

  return (
    <Input contentBefore={<SearchRegular />} value={liveValue} onChange={(_, data) => setLiveValue(data.value)} {...rest} />
  )
}
