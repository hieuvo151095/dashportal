import Anthropic from '@anthropic-ai/sdk'
import { getAiApiKey } from '../utils/aiAssistantSettings'
import { AI_TOOLS, findAiTool } from './tools'
import type { CtaLink } from './types'

// Model: claude-sonnet-4-6 — đủ mạnh cho tool-calling đơn giản trên dữ liệu mock cục bộ, chi phí/độ
// trễ thấp hơn Opus, phù hợp cho 1 chat widget nhẹ. Gọi thẳng từ trình duyệt (BYOK) theo đúng pattern
// chính thức Anthropic khuyến nghị — dangerouslyAllowBrowser: true, không qua backend.
const MODEL = 'claude-sonnet-4-6'
const MAX_TOOL_ITERATIONS = 8

const SYSTEM_PROMPT = `Bạn là trợ lý AI của "Portal Giám sát Thu Học phí" — dành cho lãnh đạo Sở Giáo dục và Đào tạo TP. Hồ Chí Minh, giám sát việc thu học phí, công nợ, danh mục phí và tình trạng đồng bộ dữ liệu của các trường trên địa bàn.

QUY TẮC BẮT BUỘC:
- CHỈ được trả lời dựa trên kết quả trả về từ các tool được cung cấp. TUYỆT ĐỐI KHÔNG tự bịa số liệu.
- Nếu không có tool nào phù hợp với câu hỏi (vd câu hỏi ngoài phạm vi hệ thống như thời tiết, tin tức...), hãy trả lời trung thực là câu hỏi nằm ngoài phạm vi hệ thống này, không cố trả lời.
- Nếu tool trả về lỗi (field "loi") hoặc danh sách rỗng, hãy nói rõ là không tìm thấy dữ liệu phù hợp, không suy diễn thêm.
- Đơn vị tiền tệ trong toàn bộ dữ liệu là Đồng (VNĐ) — dùng các field "...Formatted" trong kết quả tool khi trình bày số tiền cho tự nhiên.
- Tên riêng (Phường/Xã, tên trường, tên/mã học sinh) PHẢI dùng ĐÚNG NGUYÊN VĂN chuỗi nhận được trong kết quả tool (field "tenTruong", "xaPhuong", "hoTen"...) — KHÔNG tự gõ lại, diễn giải lại, hay "sửa" cách viết/dấu theo trí nhớ riêng của bạn.
- Trả lời ngắn gọn, tự nhiên bằng tiếng Việt, dùng markdown (in đậm **...**, danh sách numbered/bullet) để trình bày rõ ràng.
- Khi liệt kê nhiều dòng dữ liệu (Top N, danh sách trường/xã/học sinh...): ƯU TIÊN dạng danh sách gọn — mỗi mục 1-2 dòng, số thứ tự + tên in đậm + số liệu quan trọng nhất, vd:
  "1. **THCS Lê Lợi 4** (P. Tân Định) — Công nợ: 88.356.000đ, 33 HS chưa thanh toán"
  KHÔNG dùng bảng markdown nhiều cột cho các câu hỏi dạng này — đã có nút CTA dẫn tới trang đầy đủ chi tiết ngay sau câu trả lời, không cần lặp lại toàn bộ dữ liệu dạng bảng trong khung chat hẹp. Chỉ dùng bảng markdown khi thực sự cần so sánh nhiều chiều dữ liệu mà danh sách gọn không thể hiện rõ được (trường hợp hiếm).
- Không đề cập đến việc bạn đang dùng "tool" hay "function" — nói chuyện tự nhiên như một trợ lý dữ liệu.`

export interface RunAssistantResult {
  text: string
  ctas: CtaLink[]
  messages: Anthropic.MessageParam[]
}

export type OnToolStart = (toolName: string) => void

function getClient(apiKey: string): Anthropic {
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
}

export async function runAssistantConversation(
  messages: Anthropic.MessageParam[],
  onToolStart?: OnToolStart,
): Promise<RunAssistantResult> {
  const apiKey = getAiApiKey()
  if (!apiKey) {
    throw new Error('Chưa cấu hình API key. Vào Thiết lập > AI Assistant để kết nối trước.')
  }

  const client = getClient(apiKey)
  const tools: Anthropic.Tool[] = AI_TOOLS.map((tool) => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.inputSchema as Anthropic.Tool.InputSchema,
  }))

  const conversation: Anthropic.MessageParam[] = [...messages]
  const ctas: CtaLink[] = []
  const seenRoutes = new Set<string>()

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools,
      messages: conversation,
    })

    conversation.push({ role: 'assistant', content: response.content })

    if (response.stop_reason !== 'tool_use') {
      const text = response.content
        .filter((block): block is Anthropic.TextBlock => block.type === 'text')
        .map((block) => block.text)
        .join('\n')
        .trim()
      return { text: text || 'Xin lỗi, tôi không có câu trả lời cho yêu cầu này.', ctas, messages: conversation }
    }

    const toolUseBlocks = response.content.filter((block): block is Anthropic.ToolUseBlock => block.type === 'tool_use')
    const toolResults: Anthropic.ToolResultBlockParam[] = []

    for (const block of toolUseBlocks) {
      onToolStart?.(block.name)
      const tool = findAiTool(block.name)
      const input = (block.input ?? {}) as Record<string, unknown>

      let resultContent: string
      if (!tool) {
        resultContent = JSON.stringify({ loi: `Không có tool tên "${block.name}".` })
      } else {
        try {
          const result = tool.execute(input)
          resultContent = JSON.stringify(result)
          const cta = tool.cta(input)
          if (cta && !seenRoutes.has(cta.route)) {
            seenRoutes.add(cta.route)
            ctas.push(cta)
          }
        } catch (error) {
          resultContent = JSON.stringify({ loi: error instanceof Error ? error.message : 'Lỗi không xác định khi chạy tool.' })
        }
      }

      toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: resultContent })
    }

    conversation.push({ role: 'user', content: toolResults })
  }

  return {
    text: 'Xin lỗi, yêu cầu này cần quá nhiều bước xử lý để trả lời. Vui lòng thử hỏi cụ thể hơn.',
    ctas,
    messages: conversation,
  }
}

export type ConnectionTestResult = { ok: true } | { ok: false; message: string }

export async function testAiConnection(apiKey: string): Promise<ConnectionTestResult> {
  try {
    const client = getClient(apiKey)
    await client.messages.create({
      model: MODEL,
      max_tokens: 16,
      messages: [{ role: 'user', content: 'ping' }],
    })
    return { ok: true }
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return { ok: false, message: 'API key không hợp lệ.' }
    }
    if (error instanceof Anthropic.APIError) {
      return { ok: false, message: `Lỗi kết nối: ${error.message}` }
    }
    return { ok: false, message: 'Lỗi kết nối không xác định. Kiểm tra lại kết nối mạng.' }
  }
}
