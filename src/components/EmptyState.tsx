import { MessageBar, MessageBarBody } from '@fluentui/react-components'

export function EmptyState() {
  return (
    <MessageBar intent="info">
      <MessageBarBody>Không có dữ liệu phù hợp với bộ lọc đã chọn.</MessageBarBody>
    </MessageBar>
  )
}
