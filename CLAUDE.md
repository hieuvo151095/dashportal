# Portal Giám sát Thu Học phí

Prototype frontend-only cho portal giám sát thu học phí dành cho lãnh đạo Sở GD&ĐT cấp Tỉnh/Thành phố (bối cảnh mẫu: TP. Hồ Chí Minh). Toàn bộ dữ liệu là **mock data**, không có backend/API thật.

Chi tiết đầy đủ về yêu cầu sản phẩm, UI/UX từng module, thuật ngữ tiếng Việt bắt buộc dùng: xem `docs/spec-portal-thu-hoc-phi.md`.

## Tech stack

- **React + TypeScript + Vite**
- **Design system:** Fluent UI React v9 (`@fluentui/react-components`, `@fluentui/react-icons`), theme `webLightTheme`
- **Routing:** React Router (`react-router-dom`)
- **Biểu đồ:** Recharts

## Chạy dự án

```
npm run dev       # dev server (Vite)
npm run build     # type-check (tsc -b) + build production
npm run lint      # ESLint
npm run preview   # preview bản build
```

Không cần biến môi trường hay backend nào — chạy `npm run dev` là đủ.

## Đăng nhập

Đăng nhập là **giả lập**: bất kỳ email/mật khẩu hợp lệ nào (đúng định dạng) đều đăng nhập thành công. Phiên đăng nhập lưu trong `localStorage`, có route guard (`src/routes/ProtectedRoute.tsx`) — chưa đăng nhập sẽ bị redirect về `/login`.

## Mock data

Toàn bộ dữ liệu (Xã/Phường, Trường, Học sinh, Khoản phí, Hoá đơn) được sinh tại `src/mock-data/` bằng generator có **seed cố định** (`src/mock-data/random.ts`) — dữ liệu nhất quán giữa các lần chạy, không random lại khi reload. `mockDataset` (từ `src/mock-data/index.ts`) là nguồn dữ liệu duy nhất, dùng chung cho mọi trang để đảm bảo số liệu khớp logic giữa các cấp tổng hợp/chi tiết.

## Cấu trúc thư mục chính

```
src/
  pages/        Mỗi route/sub-module 1 folder (vd DashboardPage, DanhMucPhiTongHopPage,
                ThuHocPhiChiTietPage, CongNoTongHopPage...) — mỗi folder thường có
                index.tsx (page), useXFilters.ts (state filter qua URL query params),
                useXData.ts (tính toán/lọc dữ liệu), cùng các component con của trang đó.
  components/   Component dùng chung nhiều trang (SectionCard, KpiCard, FilterBar,
                Pagination, EmptyState, TableSkeleton, SchoolHeader, DonutChart...).
  mock-data/    Types + generator dữ liệu mock (seed cố định).
  routes/       Route guard (ProtectedRoute) + cấu hình sidebar/breadcrumb (routeConfig.ts).
  utils/        Tiện ích dùng chung: format tiền/ngày (currency.ts, date.ts), quản lý
                filter qua URL (useQueryParam.ts), tính tuổi nợ (congNo.ts), danh sách
                kỳ báo cáo (ky.ts), skeleton loading delay (useSkeletonDelay.ts).
```

## Quy ước quan trọng khi sửa code

- **State filter đồng bộ qua URL** (`useSearchParams`), không dùng Context — giữ deep-link và truyền filter khi drill-down giữa trang Tổng hợp ↔ Chi tiết. Khi 1 filter cần reset filter khác (vd đổi Xã/Phường phải reset Trường), phải cập nhật **atomic trong 1 lần gọi `setSearchParams`** — gọi nhiều setter liên tiếp trong cùng handler sẽ đè mất nhau (đã từng là bug thật, xem lịch sử commit Phase 5/6/7).
- Mảng trả về từ hook đọc query param (vd danh sách Cấp học multi-select) phải `useMemo` theo giá trị chuỗi gốc — nếu trả mảng mới mỗi render sẽ gây vòng lặp render vô hạn ở nơi dùng mảng đó làm dependency (vd `useSkeletonDelay`).
- Bảng nhiều cột (DataGrid) cần set `columnSizingOptions` (minWidth) + bọc trong `overflow-x: auto` cục bộ nếu có nguy cơ tràn ở màn hình 1280px — không để tràn ra toàn bộ `<main>` (vỡ layout cả trang).
- Loading state: dùng `useSkeletonDelay` (400-600ms) + `TableSkeleton` khi đổi filter. Empty state: dùng component `EmptyState` (MessageBar) khi filter cho kết quả rỗng — áp dụng nhất quán cho mọi trang có filter.
