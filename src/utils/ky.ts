import { TODAY } from '../mock-data'
import { formatMonthYear } from './date'

export const DEFAULT_KY = formatMonthYear(TODAY)

export function getKyOptions(): string[] {
  const options: string[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(TODAY.getFullYear(), TODAY.getMonth() - i, 1)
    options.push(formatMonthYear(d))
  }
  return options
}
