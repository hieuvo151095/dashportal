const numberFormatter = new Intl.NumberFormat('vi-VN')

export function formatCurrency(amount: number): string {
  return `${numberFormatter.format(amount)} đ`
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}
