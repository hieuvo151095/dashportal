import {
  Body1,
  Button,
  Field,
  SpinButton,
  Tab,
  TabList,
  makeStyles,
  tokens,
  type SelectTabData,
  type SelectTabEvent,
} from '@fluentui/react-components'
import { ArrowSyncRegular, BotRegular } from '@fluentui/react-icons'
import { useState } from 'react'
import { PageTitle } from '../../components/PageTitle'
import { SectionCard } from '../../components/SectionCard'
import { getHanDongBoSoNgay, setHanDongBoSoNgay } from '../../utils/syncSettings'
import { AiAssistantSettings } from './AiAssistantSettings'

const useStyles = makeStyles({
  tabList: {
    marginBottom: tokens.spacingVerticalL,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
    maxWidth: '360px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
  },
})

type TabKey = 'dong-bo' | 'ai-assistant'

export function ThietLapPage() {
  const styles = useStyles()
  const [tab, setTab] = useState<TabKey>('dong-bo')
  const [soNgay, setSoNgay] = useState(() => getHanDongBoSoNgay())
  const [daLuu, setDaLuu] = useState(false)

  function handleTabSelect(_: SelectTabEvent, data: SelectTabData) {
    setTab(data.value as TabKey)
    setDaLuu(false)
  }

  function handleSave() {
    if (soNgay < 1) return
    setHanDongBoSoNgay(soNgay)
    setDaLuu(true)
  }

  return (
    <>
      <PageTitle title="Thiết lập" showUnit={false} />

      <TabList className={styles.tabList} selectedValue={tab} onTabSelect={handleTabSelect}>
        <Tab value="dong-bo" icon={<ArrowSyncRegular />}>
          Đồng bộ dữ liệu
        </Tab>
        <Tab value="ai-assistant" icon={<BotRegular />}>
          AI Assistant
        </Tab>
      </TabList>

      {tab === 'dong-bo' && (
        <SectionCard title="Hạn đồng bộ dữ liệu" note="Áp dụng cho toàn bộ trường/Phường-Xã ở widget Tình trạng đồng bộ dữ liệu.">
          <div className={styles.form}>
            <Field label="Số ngày đến hạn đồng bộ (tính từ đầu tháng kế tiếp Kỳ báo cáo)" hint="Mặc định: 7 ngày">
              <SpinButton
                value={soNgay}
                min={1}
                max={31}
                onChange={(_, data) => {
                  const next = data.value ?? (data.displayValue ? Number(data.displayValue) : undefined)
                  if (next !== undefined && !Number.isNaN(next)) {
                    setSoNgay(next)
                    setDaLuu(false)
                  }
                }}
              />
            </Field>
            <div className={styles.actions}>
              <Button appearance="primary" onClick={handleSave}>
                Lưu
              </Button>
              {daLuu && <Body1>Đã lưu thiết lập.</Body1>}
            </div>
          </div>
        </SectionCard>
      )}

      {tab === 'ai-assistant' && (
        <SectionCard title="AI Assistant" note="Kết nối trực tiếp tới Claude API (Anthropic) từ trình duyệt — dùng cho khung chat trợ lý AI ở góc dưới phải.">
          <AiAssistantSettings />
        </SectionCard>
      )}
    </>
  )
}
