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
                index.tsx (page), useXFilters.ts (state filter, xem "Pattern filter"
                bên dưới), useXData.ts (tính toán/lọc dữ liệu), cùng các component
                con (FilterBar, Table...) của trang đó.
  components/   Component dùng chung nhiều trang: SectionCard, KpiCard, FilterBar,
                Pagination, EmptyState, TableSkeleton, SchoolHeader, DonutChart,
                SearchInput, PageTitle, TableHeaderRow (5 cái cuối thêm ở Phase A,
                xem chi tiết ở mục "Shared component/pattern từ Phase A" bên dưới).
  mock-data/    Types + generator dữ liệu mock (seed cố định).
  routes/       Route guard (ProtectedRoute) + cấu hình sidebar/breadcrumb (routeConfig.ts).
  utils/        Tiện ích dùng chung: format tiền/ngày (currency.ts, date.ts), quản lý
                filter qua URL (useUrlFilters.ts, useFilterDraft.ts), debounce input
                (useDebouncedValue.ts), tính tuổi nợ (congNo.ts), danh sách kỳ báo cáo
                (ky.ts), skeleton loading delay (useSkeletonDelay.ts), kích thước cột
                bảng chuẩn (tableColumnSizes.ts).
```

## Quy ước quan trọng khi sửa code

- **State filter đồng bộ qua URL** qua `useUrlFilters` (xem mục filter pattern bên dưới), không dùng Context — giữ deep-link và truyền filter khi drill-down giữa trang Tổng hợp ↔ Chi tiết. Khi 1 filter cần reset filter khác (vd đổi Xã/Phường phải reset Trường), phải cập nhật **atomic trong 1 lần gọi `update()`** — gọi nhiều setter liên tiếp trong cùng handler sẽ đè mất nhau (đã từng là bug thật, xem lịch sử commit Phase 5/6/7).
- Mảng trả về từ hook đọc query param (vd danh sách Cấp học multi-select) phải `useMemo` theo giá trị chuỗi gốc — nếu trả mảng mới mỗi render sẽ gây vòng lặp render vô hạn ở nơi dùng mảng đó làm dependency (vd `useSkeletonDelay`).
- Bảng nhiều cột (DataGrid) dùng `tableColumnSizes.ts` cho `columnSizingOptions` + `TableHeaderRow` cho header — xem chi tiết bên dưới. Bọc trong `overflow-x: auto` cục bộ nếu bảng có nguy cơ tràn ở màn hình 1280px — không để tràn ra toàn bộ `<main>` (vỡ layout cả trang).
- Loading state: dùng `useSkeletonDelay` (400-600ms) + `TableSkeleton` khi đổi filter. Empty state: dùng component `EmptyState` (MessageBar) khi filter cho kết quả rỗng — áp dụng nhất quán cho mọi trang có filter.

## Shared component/pattern từ Phase A (đợt cải thiện UI)

Phase A (xem `docs/feedback-cai-thien-v1.md`) chuẩn hoá 1 loạt pattern dùng chung cho **tất cả** trang/bảng. Phase B (sửa nội dung/cột/filter riêng từng module) phải tái dùng các pattern này thay vì viết lại.

### 1. `SearchInput` (`src/components/SearchInput.tsx`) — chống mất dấu tiếng Việt

Mọi ô tìm kiếm text (tên trường, tên học sinh, tên phí...) **phải** dùng `<SearchInput>` thay vì `<Input>` trần với `contentBefore={<SearchRegular />}`. Lý do: gõ dấu tiếng Việt (Telex/VNI) bị gãy nếu mỗi phím gõ đều ghi thẳng ra URL — `SearchInput` tách state gõ phím cục bộ khỏi giá trị commit ra ngoài qua hook `useDebouncedValue` (`src/utils/useDebouncedValue.ts`), chỉ commit sau ~400ms ngừng gõ.

```tsx
<SearchInput value={draft.q} onChange={(value) => setDraft({ q: value })} placeholder="Tìm theo tên hoặc mã..." />
```

`onChange` nhận thẳng `string` (không phải event). Khi Phase B thêm filter tìm kiếm mới (vd filter "Hệ thống" ở III.3.1 nếu là dạng search-text), bind `value`/`onChange` vào **draft state** (xem mục 5), không bind thẳng vào giá trị đã áp dụng (URL).

### 2. `PageTitle` (`src/components/PageTitle.tsx`) — tiêu đề trang Tổng hợp

Dùng cho mọi trang Tổng hợp (Dashboard, `*TongHopPage`) thay cho `<Title2>` trần — tự động kèm "Đơn vị: Đồng" ở góc phải cùng hàng:

```tsx
<PageTitle title="Thu Học phí — Tổng hợp toàn thành phố" />
```

Không cần style/makeStyles riêng cho tiêu đề ở trang mới — chỉ gọi component này.

### 3. `SchoolHeader` (`src/components/SchoolHeader.tsx`) — tiêu đề trang Chi tiết

Dùng cho mọi trang Chi tiết theo trường (`*ChiTietPage`) — đã tích hợp sẵn "Đơn vị: Đồng" cùng hàng tiêu đề (không cần thêm gì). Prop `truongId`/`onSelectTruong` (dropdown "Chọn trường") cố tình **áp dụng ngay lập tức, không qua draft** — vì đổi trường đang xem là điều hướng ngữ cảnh trang, khác với "chỉnh filter rồi bấm Áp dụng". Phase B nếu thêm field mới vào SchoolHeader, giữ nguyên nguyên tắc này (live, không draft).

### 4. `TableHeaderRow` + `tableColumnSizes.ts` — bảng nhiều cột

Mọi `<DataGrid>` dùng `<TableHeaderRow />` (từ `src/components/TableHeaderRow.tsx`) thay cho boilerplate `<DataGridHeader><DataGridRow>{...}</DataGridRow></DataGridHeader>` — tự động bold + cho phép xuống dòng tên cột dài. Và dùng các hằng số từ `src/utils/tableColumnSizes.ts` (`COL_STT`, `COL_MA`, `COL_TEN`, `COL_DIA_DIEM`, `COL_CAP_HOC`, `COL_SO_TIEN`, `COL_SO_LUONG`, `COL_NGAY`, `COL_BADGE`, `COL_HANH_DONG`) cho `columnSizingOptions` — map mỗi cột theo **loại nội dung** (không tự đặt số px riêng) để khoảng cách cột nhất quán giữa mọi bảng:

```tsx
const columnSizingOptions = { stt: COL_STT, maTruong: COL_MA, tenTruong: COL_TEN, hanhDong: COL_HANH_DONG }
<DataGrid columns={columns} columnSizingOptions={columnSizingOptions} resizableColumns>
  <TableHeaderRow />
  <DataGridBody>...</DataGridBody>
</DataGrid>
```

Khi Phase B thêm cột mới vào bảng có sẵn (vd cột "Cấp học", "HĐ còn lại"/"Phí còn lại" ở III.3.1): thêm 1 entry vào `columnSizingOptions` dùng đúng hằng số theo loại nội dung của cột đó (badge → `COL_BADGE`, số tiền → `COL_SO_TIEN`, số lượng → `COL_SO_LUONG`...), không hardcode `{ minWidth, defaultWidth }` riêng. Nút hành động dạng text (vd "Xem chi tiết") phải có `style={{ whiteSpace: 'nowrap' }}` để không vỡ dòng từng chữ khi cột hẹp.

### 5. Pattern Filter bar: draft + commit (`FilterBar`, `useUrlFilters`, `useFilterDraft`)

Đây là pattern quan trọng nhất cần hiểu đúng trước khi Phase B thêm filter mới. Có 3 phần:

- **`useUrlFilters(DEFAULTS)`** (`src/utils/useUrlFilters.ts`): lõi đọc/ghi URL query param, trả về `{ get, update, reset }`. Mỗi `useXFilters.ts` gọi 1 lần, định nghĩa `DEFAULTS` dạng `Record<'key1'|'key2'|..., string>` (không dùng `as const` — sẽ lỗi kiểu, xem code hiện tại làm mẫu).
- **Giá trị "applied"** (đã lọc thật) = đọc trực tiếp từ URL qua `get()`, dùng để tính `useXData`. Field nào cần "áp dụng ngay không qua draft" (vd `page` phân trang, `tab`, hoặc `truongId` ở SchoolHeader) thì set thẳng qua setter riêng (vd `setPage`), **không** đưa vào object truyền cho `useFilterDraft`.
- **`useFilterDraft<T>(applied)`** (`src/utils/useFilterDraft.ts`): tạo lớp draft cục bộ, tự đồng bộ lại khi `applied` đổi vì lý do khác (Làm mới, back/forward, drill-down). Trả về `[draft, setDraft]` — filter bar edit `draft`, KHÔNG edit `applied`/URL trực tiếp.
- Mỗi `useXFilters.ts` cần thêm 2 hàm: `apply(draft) => update({...})` (map toàn bộ field draft thành 1 lần `update()` atomic, kèm `page: DEFAULTS.page` nếu trang có phân trang) và `reset` — **chỉ reset các field thuộc FilterBar**, không đụng field "live" riêng (vd không reset `truongId` ở các trang có SchoolHeader — xem `CongNoChiTietPage/useChiTietFilters.ts` làm mẫu).
- `<FilterBar onApply={...} onReset={...}>` luôn tự render 2 nút "Áp dụng"/"Làm mới" — không tự thêm nút riêng.

**Khi Phase B thêm 1 filter mới** (vd filter "Hệ thống", "Trạng thái", "Cấp học" ở III.3.1/III.3.2):
1. Thêm key vào `DEFAULTS` + interface `XFilters` (phần "draft-able") trong `useXFilters.ts`.
2. Thêm field vào object `apply()` map và `reset()` map.
3. Thêm field đó vào object truyền cho `useFilterDraft<XFilters>({...})` ở `index.tsx`.
4. Trong FilterBar component, đọc/ghi qua `draft.xxx` / `setDraft({ xxx: value })` — **không** gọi setter của `filters` (applied) trực tiếp cho field thuộc nhóm này.
5. Nếu filter mới cần cascading reset field khác trong draft (vd chọn Cấp học reset field liên quan) — gộp vào cùng 1 lệnh `setDraft({ a: x, b: y })`, vì draft là state cục bộ nên không có nguy cơ đè lẫn nhau như URL.
