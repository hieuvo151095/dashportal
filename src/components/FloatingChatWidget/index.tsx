import type Anthropic from '@anthropic-ai/sdk'
import {
  Body1,
  Button,
  Caption1,
  Input,
  MessageBar,
  MessageBarBody,
  Spinner,
  Subtitle2,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components'
import { BotSparkleRegular, DismissRegular, Send24Regular } from '@fluentui/react-icons'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { runAssistantConversation } from '../../ai-assistant/claudeClient'
import type { ChatMessage } from '../../ai-assistant/types'
import { hasAiApiKey } from '../../utils/aiAssistantSettings'
import { markDailyGreetingShown, shouldShowDailyGreeting } from '../../utils/aiGreeting'
import { TEN_NGUOI_DUNG } from '../../utils/auth'
import { MarkdownMessage } from './MarkdownMessage'

const VAULTLINE_FLOAT_SHADOW = '0 4px 16px rgba(30, 41, 59, 0.16), 0 1px 3px rgba(30, 41, 59, 0.08)'
const HEADER_TEXT = '#FFFFFF'

const SUGGESTED_QUESTIONS = [
  'Top 10 trường có công nợ cao nhất tháng này?',
  'Tỷ lệ thu học phí toàn thành phố hiện tại là bao nhiêu?',
  'Có bao nhiêu Phường/Xã chưa đồng bộ dữ liệu quá 15 ngày?',
  'Xu hướng thu học phí 6 tháng gần đây thế nào?',
  'Trường nào có công nợ quá hạn trên 90 ngày cao nhất?',
]

const useStyles = makeStyles({
  fab: {
    position: 'fixed',
    right: tokens.spacingHorizontalXXL,
    bottom: tokens.spacingVerticalXXL,
    width: '56px',
    height: '56px',
    minWidth: '56px',
    padding: 0,
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorPaletteNavyForeground2,
    color: tokens.colorPaletteGoldForeground2,
    boxShadow: VAULTLINE_FLOAT_SHADOW,
    zIndex: 1000,
    ':hover': {
      backgroundColor: tokens.colorPaletteNavyForeground2,
      opacity: 0.92,
    },
    ':active': {
      backgroundColor: tokens.colorPaletteNavyForeground2,
    },
  },
  panel: {
    position: 'fixed',
    right: tokens.spacingHorizontalXXL,
    bottom: '96px',
    width: '380px',
    maxWidth: 'calc(100vw - 48px)',
    height: '560px',
    maxHeight: 'calc(100vh - 140px)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: VAULTLINE_FLOAT_SHADOW,
    zIndex: 1000,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    backgroundColor: tokens.colorPaletteNavyForeground2,
    flexShrink: 0,
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
  },
  body: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: tokens.spacingHorizontalL,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  suggestedList: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXS,
  },
  suggestedButton: {
    textAlign: 'left',
    justifyContent: 'flex-start',
    whiteSpace: 'normal',
    height: 'auto',
    paddingTop: tokens.spacingVerticalSNudge,
    paddingBottom: tokens.spacingVerticalSNudge,
  },
  bubbleRow: {
    display: 'flex',
  },
  bubbleRowUser: {
    justifyContent: 'flex-end',
  },
  bubbleRowAssistant: {
    justifyContent: 'flex-start',
  },
  bubbleGroup: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '88%',
  },
  bubble: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusLarge,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  bubbleUser: {
    backgroundColor: tokens.colorPaletteNavyForeground2,
    color: HEADER_TEXT,
  },
  bubbleAssistant: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground1,
  },
  bubbleError: {
    backgroundColor: tokens.colorPaletteRedBackground1,
    color: tokens.colorPaletteRedForeground1,
    border: `1px solid ${tokens.colorPaletteRedBorder1}`,
  },
  ctaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: tokens.spacingHorizontalXS,
    rowGap: tokens.spacingVerticalXS,
    marginTop: tokens.spacingVerticalXS,
  },
  typingRow: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
    color: tokens.colorNeutralForeground3,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
    padding: tokens.spacingHorizontalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    flexShrink: 0,
  },
  footerInput: {
    flexGrow: 1,
  },
  notConnected: {
    padding: tokens.spacingHorizontalL,
  },
})

export function FloatingChatWidget() {
  const styles = useStyles()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [toolStatus, setToolStatus] = useState<string | null>(null)

  const apiHistoryRef = useRef<Anthropic.MessageParam[]>([])
  const panelRef = useRef<HTMLDivElement>(null)
  const fabRef = useRef<HTMLButtonElement>(null)
  const bodyEndRef = useRef<HTMLDivElement>(null)

  // Tự mở chat + chào hỏi vào lần đầu mở Portal trong ngày (theo giờ GMT+7) — chỉ khi đã kết nối
  // API key, để tránh làm phiền bằng thông báo "chưa kết nối" mỗi ngày. Nếu chưa có key, không
  // đánh dấu đã chào — lần mở kế tiếp trong ngày (sau khi cấu hình key) vẫn sẽ chào như bình thường.
  // Cố tình đọc/ghi localStorage + setState trong effect thay vì chuyển sang lazy useState
  // initializer (như useSkeletonDelay.ts) — initializer bị StrictMode gọi 2 lần lúc dev, lần 2 sẽ
  // đọc thấy cờ "đã chào" vừa ghi ở lần 1 nên cho kết quả sai; effect thì lần gọi lại (do
  // StrictMode mount-cleanup-mount) chỉ no-op nhờ guard ở dòng đầu, không làm mất state đã set.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!hasAiApiKey() || !shouldShowDailyGreeting()) return
    markDailyGreetingShown()
    setHasApiKey(true)
    setMessages([
      { id: crypto.randomUUID(), role: 'assistant', text: `Xin chào ${TEN_NGUOI_DUNG}, hôm nay bạn muốn xem dữ liệu gì?` },
    ])
    setOpen(true)
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (panelRef.current?.contains(target)) return
      if (fabRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  useEffect(() => {
    bodyEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading])

  function handleToggle() {
    setOpen((value) => {
      const next = !value
      if (next) setHasApiKey(hasAiApiKey())
      return next
    })
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)
    setToolStatus(null)

    const nextHistory: Anthropic.MessageParam[] = [...apiHistoryRef.current, { role: 'user', content: trimmed }]

    try {
      const result = await runAssistantConversation(nextHistory, () => setToolStatus('Đang truy vấn dữ liệu...'))
      apiHistoryRef.current = result.messages
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', text: result.text, ctas: result.ctas }])
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định khi kết nối Claude API.'
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', text: message, isError: true }])
    } finally {
      setLoading(false)
      setToolStatus(null)
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const text = draft
    setDraft('')
    void sendMessage(text)
  }

  return (
    <>
      <Button
        ref={fabRef}
        className={styles.fab}
        appearance="primary"
        shape="circular"
        icon={<BotSparkleRegular fontSize={24} />}
        onClick={handleToggle}
        aria-label="Mở trợ lý AI"
      />

      {open && (
        <div className={styles.panel} ref={panelRef}>
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <BotSparkleRegular fontSize={20} style={{ color: HEADER_TEXT }} />
              <Subtitle2 style={{ color: HEADER_TEXT }}>Trợ lý AI</Subtitle2>
            </div>
            <Button
              appearance="transparent"
              icon={<DismissRegular style={{ color: HEADER_TEXT }} />}
              onClick={() => setOpen(false)}
              aria-label="Đóng"
            />
          </div>

          {!hasApiKey ? (
            <div className={styles.notConnected}>
              <MessageBar intent="info">
                <MessageBarBody>
                  Chưa kết nối Claude API. Vào <strong>Thiết lập &gt; AI Assistant</strong> để nhập API key trước khi sử dụng.
                </MessageBarBody>
              </MessageBar>
            </div>
          ) : (
            <>
              <div className={styles.body}>
                {!messages.some((message) => message.role === 'user') && (
                  <div className={styles.suggestedList}>
                    <Caption1>Câu hỏi gợi ý:</Caption1>
                    {SUGGESTED_QUESTIONS.map((question) => (
                      <Button
                        key={question}
                        className={styles.suggestedButton}
                        appearance="outline"
                        size="small"
                        onClick={() => void sendMessage(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={mergeClasses(styles.bubbleRow, message.role === 'user' ? styles.bubbleRowUser : styles.bubbleRowAssistant)}
                  >
                    <div className={styles.bubbleGroup}>
                      <div
                        className={mergeClasses(
                          styles.bubble,
                          message.role === 'user' ? styles.bubbleUser : message.isError ? styles.bubbleError : styles.bubbleAssistant,
                        )}
                      >
                        {message.role === 'user' ? (
                          <Body1 style={{ color: 'inherit' }}>{message.text}</Body1>
                        ) : (
                          <MarkdownMessage text={message.text} />
                        )}
                      </div>
                      {message.ctas && message.ctas.length > 0 && (
                        <div className={styles.ctaRow}>
                          {message.ctas.map((cta) => (
                            <Button key={cta.route} size="small" appearance="outline" onClick={() => navigate(cta.route)}>
                              {cta.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className={styles.typingRow}>
                    <Spinner size="tiny" />
                    <Caption1>{toolStatus ?? 'Đang xử lý...'}</Caption1>
                  </div>
                )}

                <div ref={bodyEndRef} />
              </div>

              <form className={styles.footer} onSubmit={handleSubmit}>
                <Input
                  className={styles.footerInput}
                  value={draft}
                  onChange={(_, data) => setDraft(data.value)}
                  placeholder="Hỏi về dữ liệu thu học phí, công nợ..."
                  disabled={loading}
                />
                <Button type="submit" appearance="primary" icon={<Send24Regular />} disabled={loading || !draft.trim()} aria-label="Gửi" />
              </form>
            </>
          )}
        </div>
      )}
    </>
  )
}
