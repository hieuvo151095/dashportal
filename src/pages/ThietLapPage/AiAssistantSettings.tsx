import { Body1, Button, Caption1, Field, Input, MessageBar, MessageBarBody, Spinner, makeStyles, tokens } from '@fluentui/react-components'
import { EyeOffRegular, EyeRegular } from '@fluentui/react-icons'
import { useState } from 'react'
import { testAiConnection } from '../../ai-assistant/claudeClient'
import { getAiApiKey, setAiApiKey } from '../../utils/aiAssistantSettings'

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
    maxWidth: '420px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
  },
  input: {
    flexGrow: 1,
  },
})

type TestStatus = { state: 'idle' } | { state: 'testing' } | { state: 'success' } | { state: 'error'; message: string }

export function AiAssistantSettings() {
  const styles = useStyles()
  const [apiKey, setApiKeyState] = useState(() => getAiApiKey())
  const [showKey, setShowKey] = useState(false)
  const [daLuu, setDaLuu] = useState(false)
  const [testStatus, setTestStatus] = useState<TestStatus>({ state: 'idle' })

  function handleApiKeyChange(value: string) {
    setApiKeyState(value)
    setDaLuu(false)
    setTestStatus({ state: 'idle' })
  }

  function handleSave() {
    setAiApiKey(apiKey.trim())
    setDaLuu(true)
  }

  async function handleTest() {
    const key = apiKey.trim()
    if (!key) {
      setTestStatus({ state: 'error', message: 'Vui lòng nhập API key trước khi kiểm tra.' })
      return
    }
    setTestStatus({ state: 'testing' })
    const result = await testAiConnection(key)
    setTestStatus(result.ok ? { state: 'success' } : { state: 'error', message: result.message })
  }

  return (
    <div className={styles.form}>
      <Field label="Anthropic API key" hint='Lấy tại console.anthropic.com > API Keys. Định dạng "sk-ant-..."'>
        <div className={styles.inputRow}>
          <Input
            className={styles.input}
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(_, data) => handleApiKeyChange(data.value)}
            placeholder="sk-ant-..."
          />
          <Button
            appearance="subtle"
            icon={showKey ? <EyeOffRegular /> : <EyeRegular />}
            onClick={() => setShowKey((value) => !value)}
            aria-label={showKey ? 'Ẩn API key' : 'Hiện API key'}
          />
        </div>
      </Field>

      <div className={styles.actions}>
        <Button appearance="primary" onClick={handleSave} disabled={!apiKey.trim()}>
          Lưu
        </Button>
        <Button appearance="secondary" onClick={() => void handleTest()} disabled={testStatus.state === 'testing' || !apiKey.trim()}>
          Kiểm tra kết nối
        </Button>
        {daLuu && <Body1>Đã lưu thiết lập.</Body1>}
      </div>

      {testStatus.state === 'testing' && (
        <MessageBar intent="info">
          <MessageBarBody>
            <Spinner size="tiny" style={{ marginRight: tokens.spacingHorizontalXS }} />
            Đang kiểm tra kết nối...
          </MessageBarBody>
        </MessageBar>
      )}
      {testStatus.state === 'success' && (
        <MessageBar intent="success">
          <MessageBarBody>Đã kết nối thành công tới Claude API.</MessageBarBody>
        </MessageBar>
      )}
      {testStatus.state === 'error' && (
        <MessageBar intent="error">
          <MessageBarBody>{testStatus.message}</MessageBarBody>
        </MessageBar>
      )}

      <Caption1>API key chỉ lưu trên trình duyệt của bạn (localStorage), không gửi lên máy chủ nào khác ngoài Anthropic.</Caption1>
    </div>
  )
}
