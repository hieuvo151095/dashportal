// Option "Tất cả" dùng chung cho mọi Dropdown multiselect danh sách ngắn (Hình thức thanh
// toán/Hệ thống/Trạng thái, Nhóm tuổi nợ, Khối/Lớp...) — value sentinel không trùng bất kỳ
// giá trị thật nào trong domain (mã hoá, tên hệ thống...).
export const ALL_OPTION_VALUE = '__all__'

// Suy ra danh sách đã chọn mới từ sự kiện onOptionSelect của Fluent Dropdown multiselect:
// - Bấm "Tất cả" đang chưa được chọn (vừa được thêm vào data.selectedOptions) → chọn hết.
// - Bấm "Tất cả" đang được chọn (vừa bị bỏ) → bỏ hết.
// - Bấm 1 mục cụ thể → giữ nguyên hành vi toggle bình thường, chỉ lọc bỏ sentinel.
export function resolveMultiSelectChange<T extends string>(
  allValues: T[],
  data: { optionValue?: string; selectedOptions: string[] },
): T[] {
  if (data.optionValue === ALL_OPTION_VALUE) {
    return data.selectedOptions.includes(ALL_OPTION_VALUE) ? allValues : []
  }
  return data.selectedOptions.filter((v) => v !== ALL_OPTION_VALUE) as T[]
}

// Thêm sentinel "Tất cả" vào selectedOptions truyền cho Dropdown khi đã chọn đủ cả danh sách
// — để checkbox "Tất cả" tự hiện checked, không cần state riêng.
export function withAllOptionSelected<T extends string>(allValues: T[], selected: T[]): (T | string)[] {
  return selected.length === allValues.length ? [ALL_OPTION_VALUE, ...selected] : selected
}

// Biến thể cho domain quy ước "mảng rỗng = Tất cả" (Khối/Lớp, Trường, Xã/Phường) — khác domain
// "chọn đủ cả danh sách = Tất cả" ở trên vì bản thân mảng rỗng đã có nghĩa "không giới hạn",
// không cần liệt kê hết giá trị thật ra selectedOptions.
export function withAllOptionSelectedEmpty(selected: string[]): string[] {
  return selected.length === 0 ? [ALL_OPTION_VALUE] : selected
}

export function resolveMultiSelectChangeEmpty(data: { optionValue?: string; selectedOptions: string[] }): string[] {
  if (data.optionValue === ALL_OPTION_VALUE) return []
  return data.selectedOptions.filter((v) => v !== ALL_OPTION_VALUE)
}
