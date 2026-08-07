export interface CtaLink {
  route: string
  label: string
}

export interface ToolDefinition {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  execute: (input: Record<string, unknown>) => unknown
  cta: (input: Record<string, unknown>) => CtaLink | null
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  ctas?: CtaLink[]
  isError?: boolean
}
