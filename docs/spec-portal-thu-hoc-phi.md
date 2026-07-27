# Prompt cho Claude Code — Portal Giám sát Thu Học phí (Prototype)

> Hướng dẫn sử dụng: Copy toàn bộ nội dung dưới đây làm prompt đầu vào cho Claude Code (hoặc đặt vào `CLAUDE.md` rồi chạy `/planning` → `/design` → `/develop` theo workflow quen thuộc). Đây là prototype frontend-only, dùng mock data, KHÔNG cần backend thật.

---

## 0. Vai trò & Bối cảnh

Bạn đang xây dựng **prototype frontend** cho một Portal giám sát Thu học phí dành cho lãnh đạo Sở GD&ĐT cấp Tỉnh/Thành phố tại Việt Nam. Đây là công cụ tổng hợp dữ liệu thu học phí từ nhiều trường học (mầm non, tiểu học, THCS, THPT) trên địa bàn một Thành phố (dùng TP. Hồ Chí Minh làm bối cảnh mẫu).

Đây là bản dựng **chỉ để demo/thiết kế** — toàn bộ dữ liệu là mock data, không cần kết nối API thật, không cần authentication thật (giả lập đăng nhập thành công với bất kỳ email/password hợp lệ nào).

## 1. Tech Stack & Design System

- **Framework:** React + TypeScript, dùng Vite làm build tool.
- **Design System bắt buộc:** [Fluent 2](https://fluent2.microsoft.design/get-started/whatisnew) của Microsoft — triển khai qua thư viện **`@fluentui/react-components`** (Fluent UI React v9). Dùng đúng design tokens của Fluent 2 (màu sắc, typography, spacing, elevation, corner radius, motion) — không tự chế màu/spacing riêng.
- **Theme:** Dùng `webLightTheme` làm theme mặc định (có thể chuẩn bị sẵn `webDarkTheme` nếu có thời gian, nhưng ưu tiên light theme hoàn thiện trước).
- **Biểu đồ (chart):** Dùng thư viện tương thích React (ví dụ Recharts hoặc `@fluentui/react-charting` nếu ổn định) để vẽ: donut chart, line chart, bar chart. Container/card bọc quanh biểu đồ vẫn phải dùng Fluent 2 Card component.
- **Routing:** React Router — mỗi Module/Sub-module là 1 route riêng, có thể deep-link trực tiếp.
- **Icon:** Dùng bộ icon đi kèm Fluent UI (`@fluentui/react-icons`).
- **Ngôn ngữ giao diện:** Toàn bộ UI bằng tiếng Việt, đúng thuật ngữ đã liệt kê trong prompt này (không tự dịch/đổi thuật ngữ).
- **Font số/tiền tệ:** Định dạng số tiền theo chuẩn Việt Nam (dấu chấm phân cách hàng nghìn, đơn vị "đ" hoặc "Đ"), ví dụ: `586.630.000 đ`.

## 2. Cấu trúc tổng thể ứng dụng

### 2.1 Trang Đăng nhập (`/login`)

- Layout: Card căn giữa màn hình (dùng Fluent `Card`), nền có thể có gradient nhẹ hoặc pattern trang trí đơn giản phía sau (không bắt buộc).
- Logo placeholder ở đầu card (text "Sở GD&ĐT" + tên hệ thống, ví dụ "Trung tâm Điều hành Tài chính Học đường").
- Form gồm:
  - Input Email (Fluent `Input`, type email, icon mail phía trước, có validate định dạng email).
  - Input Mật khẩu (Fluent `Input`, type password, icon khoá phía trước, có nút hiện/ẩn mật khẩu).
  - Checkbox "Ghi nhớ đăng nhập".
  - Link text "Quên mật khẩu?" (không cần chức năng thật, chỉ hiển thị).
  - Button "Đăng nhập" (Fluent `Button`, appearance="primary", full width).
- Validate cơ bản: để trống → hiện lỗi inline dưới field (Fluent `Field` với `validationMessage`). Bất kỳ email/password hợp lệ nào cũng đăng nhập thành công (mock), điều hướng sang `/dashboard`.
- Trạng thái loading khi bấm Đăng nhập (spinner trong button ~800ms trước khi chuyển trang) để demo cảm giác thật.

### 2.2 Portal Shell (layout chung sau khi đăng nhập)

Áp dụng cho toàn bộ trang sau `/login`:

- **Sidebar trái** (dùng Fluent `NavDrawer`/`Nav` component), có thể thu gọn (collapse) thành icon-only. Cấu trúc menu:
  ```
  📊 Tổng quan                          → /dashboard
  📁 Danh mục Phí                       (nhóm, expand/collapse)
      ├─ Tổng hợp toàn thành phố        → /danh-muc-phi/tong-hop
      └─ Chi tiết theo trường           → /danh-muc-phi/chi-tiet
  💰 Thu Học phí                        (nhóm, expand/collapse)
      ├─ Tổng hợp toàn thành phố        → /thu-hoc-phi/tong-hop
      └─ Chi tiết theo trường           → /thu-hoc-phi/chi-tiet
  📉 Công nợ Học phí                    (nhóm, expand/collapse)
      ├─ Tổng hợp toàn thành phố        → /cong-no/tong-hop
      └─ Chi tiết theo trường           → /cong-no/chi-tiet
  ```
  Item đang active có highlight nền (dùng token màu brand của Fluent 2). Item nhóm có mũi tên chevron để expand/collapse, mặc định expand hết.

- **Header trên cùng** (dùng Fluent `Toolbar` hoặc custom bar với Fluent tokens):
  - Bên trái: nút toggle sidebar + Breadcrumb (Fluent `Breadcrumb`) hiển thị đường dẫn hiện tại (vd: Trang chủ / Thu Học phí / Chi tiết theo trường).
  - Bên phải: icon chuông thông báo (có badge số), Avatar người dùng (Fluent `Avatar` + `Menu` khi click hiện "Hồ sơ", "Cài đặt", "Đăng xuất").

- **Vùng nội dung chính:** padding nhất quán, max-width phù hợp desktop (không cần tối ưu mobile sâu, nhưng layout phải responsive cơ bản — không vỡ layout ở khoảng 1280–1440px).

## 3. Module 1 — Dashboard Tổng quan Thu học phí (`/dashboard`)

Trang tổng quan, entry point chính sau khi đăng nhập.

**Filter bar** (đặt ngay dưới tiêu đề trang, dùng Fluent `Dropdown`/`Combobox`):
- Kỳ báo cáo: chọn Tháng/Năm (mặc định tháng hiện tại, vd "07/2026").
- Xã/Phường: dropdown searchable, mặc định "Toàn thành phố".
- Cấp học: dropdown multi-select (Mầm non, Tiểu học, THCS, THPT), mặc định chọn tất cả.
- Nút "Xuất báo cáo" (icon download) ở góc phải filter bar.

**Hàng KPI Card** (4 card ngang hàng, dùng Fluent `Card`, mỗi card có icon + số liệu lớn + label):
1. Tổng hoá đơn — số lượng hoá đơn + tổng tiền bên dưới (vd: "12.480 hoá đơn" / "184.520.000.000 đ").
2. Đã thu — số lượng + tổng tiền, màu xanh lá.
3. Cần thu (còn lại) — số lượng + tổng tiền, màu cam.
4. Tỉ lệ hoàn thành (%) — số lớn kèm mini donut/progress ring nhỏ bên cạnh.

**Hàng thứ 2 (2 cột):**
- Cột trái: **Bản đồ tỷ lệ thu theo Xã/Phường** — vì không cần bản đồ GIS thật, dựng dạng bản đồ cách điệu (stylized grid map hoặc danh sách heatmap dạng lưới ô vuông màu theo tỷ lệ thu — xanh đậm = tỷ lệ cao, đỏ = tỷ lệ thấp), có tooltip khi hover hiện tên Xã/Phường + tỷ lệ thu %. Ghi chú nhỏ dưới bản đồ: "X Xã/Phường trên địa bàn".
- Cột phải: **Top 10 Xã/Phường có tỷ lệ thu cao nhất** — danh sách ranking (số thứ tự, tên, thanh progress bar %, số liệu %).

**Hàng thứ 3 (2 cột):**
- Cột trái: **Cơ cấu khoản thu** — donut chart theo loại khoản thu (Học phí, Bán trú, Đưa đón, Bảo hiểm y tế, Đồng phục, Ngoại khoá, Khoản thu khác), có legend kèm % và số tiền.
- Cột phải: **Cơ cấu hình thức thanh toán** — donut chart (Tiền mặt, Chuyển khoản, Ví điện tử, QR Code), có legend.

**Hàng thứ 4:**
- **Top 20 trường có công nợ cao nhất** — bảng (Fluent `Table`/`DataGrid`) gồm: STT, Tên trường, Xã/Phường, Số tiền công nợ, Số học sinh chưa đóng, nút "Xem chi tiết" dẫn sang Module 4.2 lọc sẵn theo trường đó.

**Hàng thứ 5:**
- **Xu hướng thu theo tháng** — biểu đồ kết hợp bar (số tiền thu theo tháng) + line (tỉ lệ thu %), trục X là 6–12 tháng gần nhất.

**Hàng thứ 6:**
- **Công nợ theo tuổi nợ** — bar chart ngang hoặc donut 4 nhóm: ≤30 ngày, 31–60 ngày, 61–90 ngày, >90 ngày, kèm số tiền và số lượng học sinh mỗi nhóm.

## 4. Module 2 — Danh mục Phí

### 4.1 Sub-module: Tổng hợp toàn thành phố (`/danh-muc-phi/tong-hop`)

**Filter bar:** Xã/Phường, Trường (searchable dropdown), Niên khoá, Nhóm phí (mock: "Thu theo tháng", "Thu theo năm", "Thu không định kỳ"), Nguồn thu (mock: "Học phí", "Dịch vụ", "Bán trú"...), ô tìm kiếm theo tên/mã trường.

**Bảng dữ liệu** (Fluent `DataGrid`, có sort theo cột, phân trang):
| STT | Mã trường | Tên trường | Xã/Phường | Cấp học | Số mục phí đang áp dụng | Hệ thống đối tác | Ngày cập nhật | Hành động |

- Cột "Hệ thống đối tác" hiển thị badge nhỏ (Fluent `Badge`) với tên hệ thống (SSC, Misa, Viettel, VNPT, eNetViet, YoYoSchool, ECO School...).
- Nút "Hành động" (icon con mắt) → điều hướng sang Sub-module Chi tiết, lọc sẵn theo trường đó.
- Footer bảng: tổng số dòng, phân trang (Fluent `Pagination` pattern).

### 4.2 Sub-module: Chi tiết theo trường (`/danh-muc-phi/chi-tiet`)

- Header: Breadcrumb + tên trường đang xem (nếu vào từ link Tổng hợp) hoặc dropdown chọn trường (nếu vào trực tiếp).
- **Filter bar:** Tên phí (search), Mã phí (mock), Nguồn phí (mock dropdown), Nhóm phí (mock dropdown), Niên khoá (mock dropdown).
- **Bảng dữ liệu:**
  | STT | Mã Phí *(mock)* | Tên phí | Số tiền | Đơn vị tính | Nguồn thu *(mock)* | Nhóm phí *(mock)* | Niên khoá *(mock)* | Tham chiếu pháp lý *(mock)* | Ghi chú |

  Dùng đa dạng đơn vị tính như dữ liệu mẫu thực tế: tháng, giờ, lần, ngày, năm, chuyến. Ví dụ tên khoản phí tham khảo: Học STEAM, Phí tăng ca trông trẻ, Phí đồng phục, Ăn sáng, Hoạt động bơi lội, Thể dục nhịp điệu, Cơ sở vật chất, Tiền ăn bán trú, Nước ép, Phí khám sức khoẻ định kỳ, Xe buýt, Tiếng Anh, Ngoại khoá...
- Nút "Thêm khoản phí" góc phải (chỉ UI, không cần chức năng thật) + nút "Xuất Excel".
- Tổng số khoản phí hiển thị cuối bảng (vd: "Tổng số phí: 16").

## 5. Module 3 — Thu Học phí

### 5.1 Sub-module: Tổng hợp toàn thành phố (`/thu-hoc-phi/tong-hop`)

- **KPI Card row** giống Module 1 nhưng scope riêng cho trang này (Tổng hoá đơn, Đã thu, Đã thu một phần, Chưa thu).
- **Tabs** (Fluent `TabList`): "Tổng quan" | "Hoá đơn đã thanh toán" | "Hoá đơn thanh toán một phần" | "Hoá đơn chưa thanh toán".
- **Filter bar:** Kỳ (Tháng/Năm), Xã/Phường, Trường, Cấp học, Hình thức thanh toán *(mock)*.
- **Bảng dữ liệu (tab Tổng quan):**
  | STT | Mã trường | Tên trường | Xã/Phường | Hệ thống | Tiền mặt | Chuyển khoản/Thu hộ | Tổng thu | Còn lại (SL + Thành tiền) | Tỉ lệ thu | Ngày cập nhật | Hành động |
- Hàng "Tổng cộng" cố định ở cuối bảng (sticky footer row), in đậm.
- Nút hành động → điều hướng sang Sub-module Chi tiết, lọc sẵn theo trường.

### 5.2 Sub-module: Chi tiết theo trường (`/thu-hoc-phi/chi-tiet`)

- Header: chọn/breadcrumb trường đang xem + thông tin trường (địa chỉ Xã/Phường).
- **Filter bar:** Tìm theo tên/mã học sinh, Chọn lớp học (dropdown), Kỳ (Tháng/Năm), Trạng thái hoá đơn (Đã gửi/Đã thanh toán/Thanh toán một phần), Hình thức thanh toán *(mock)*, nút "Lọc mở rộng" (mở panel filter phụ).
- **Bảng dữ liệu**, mỗi dòng đại diện 1 học sinh với 1 hoặc nhiều hoá đơn con:
  - Cột Học sinh: Avatar + Họ tên + Mã học sinh, Lớp *(mock, hiển thị dưới tên)*.
  - Cột Tên hoá đơn: "Hoá đơn tháng X/2026" + Số HĐ + Ngày lập HĐ (dạng 2 dòng nhỏ).
  - Cột Hạn thanh toán.
  - Cột Hình thức thanh toán *(mock: Tiền mặt/Chuyển khoản/Ví điện tử/QR)*.
  - Cột Tạo bởi / Xác nhận bởi.
  - Cột Trạng thái: Badge màu (Đã gửi = xanh dương, Đã thanh toán = xanh lá, Thanh toán một phần = cam, có icon đồng hồ nếu quá hạn).
  - Cột Số tiền: nếu thanh toán một phần hiển thị 2 dòng (đã trả / còn lại).
  - Cột Hành động: icon xem lịch sử, icon huỷ, icon tải hoá đơn (download).
  - Học sinh chưa có hoá đơn nào hiển thị dòng "Không có hoá đơn" (empty state nhẹ, chữ xám).

## 6. Module 4 — Công nợ Học phí

### 6.1 Sub-module: Tổng hợp toàn thành phố (`/cong-no/tong-hop`)

- **KPI Card row:** Tổng công nợ, Số học sinh chưa đóng, Tỉ lệ nợ trung bình, Công nợ quá hạn >90 ngày (nhấn mạnh màu đỏ).
- **Widget Aging** (bar chart ngang 4 nhóm: ≤30 / 31–60 / 61–90 / >90 ngày) kèm số tiền + số học sinh mỗi nhóm.
- **Biểu đồ xu hướng công nợ theo tháng** (line chart, 6–12 tháng gần nhất, có thể chồng thêm bar số học sinh nợ mới phát sinh mỗi tháng).
- **Filter bar:** Xã/Phường, Trường, Kỳ phí (từ kỳ – đến kỳ), Nhóm tuổi nợ.
- **Bảng dữ liệu:**
  | STT | Mã trường | Tên trường | Xã/Phường | Số HS chưa thanh toán | Số tiền chưa thu | Nhóm tuổi nợ chiếm ưu thế | Ngày cập nhật | Hành động |

### 6.2 Sub-module: Chi tiết theo trường (`/cong-no/chi-tiet`)

- Header: chọn/breadcrumb trường.
- **Filter bar:** Mã học sinh, Khối, Lớp, Kỳ phí (từ – đến), Nhóm tuổi nợ.
- **Bảng dữ liệu:**
  | STT | Mã HS | Họ tên | Lớp | Kỳ nợ | Số tiền nợ | Hạn thanh toán | Số ngày quá hạn *(tính toán)* | Nhóm tuổi nợ | Lý do nợ/Ghi chú *(mock)* | Hành động |
  - Cột "Số ngày quá hạn": số dương màu đỏ đậm dần theo mức độ (dùng conditional formatting: 1–30 ngày = cam nhạt, 31–90 = cam đậm, >90 = đỏ).
  - Cột "Nhóm tuổi nợ": Badge tương ứng 4 màu.

## 7. Yêu cầu Mock Data

Tạo bộ mock data đủ lớn và nhất quán giữa các module (dùng chung 1 nguồn dữ liệu, không mock rời rạc từng trang) theo cấu trúc:

- **Xã/Phường:** ~12–15 đơn vị, đặt tên theo phong cách hành chính 2 cấp hiện hành của TP.HCM (chỉ Phường/Xã, KHÔNG dùng tên Quận/Huyện).
- **Trường học:** ~40–60 trường, phân bổ đều 4 cấp học (Mầm non, Tiểu học, THCS, THPT), mỗi trường có mã trường dạng số (vd `79761010`), tên trường, Xã/Phường, hệ thống đối tác quản lý (SSC/Misa/Viettel/VNPT/eNetViet/YoYoSchool/ECO School).
- **Học sinh:** ~800–1.500 học sinh (rải đều theo trường/lớp), có mã học sinh, họ tên tiếng Việt thực tế, lớp/khối.
- **Khoản phí:** 12–18 khoản phí/trường theo danh sách ví dụ ở Mục 4.2.
- **Hoá đơn:** sinh cho 6–12 tháng gần nhất, trạng thái phân bố thực tế (đa số Đã thanh toán, một phần Thanh toán một phần, một phần Đã gửi/chưa thanh toán — để bảng công nợ và tuổi nợ có dữ liệu để hiển thị), số tiền theo đơn vị VND hợp lý (vài chục nghìn đến vài triệu đồng/hoá đơn).
- Đảm bảo **tổng số liệu khớp logic** giữa các trang: Tổng hoá đơn ở Dashboard = tổng cộng dồn từ dữ liệu chi tiết học sinh; Tổng công nợ = tổng các hoá đơn chưa thanh toán đủ.
- Dữ liệu nên implement dưới dạng file TypeScript/JSON riêng (`/src/mock-data/`) với hàm generate có seed cố định để dữ liệu nhất quán mỗi lần chạy lại (không random mỗi lần load).

## 8. Tương tác & UX

- **Filter cascading:** chọn Xã/Phường → danh sách Trường trong filter khác tự lọc theo Xã/Phường đó.
- **Drill-down:** mọi nút "Xem chi tiết"/click vào tên trường ở các trang Tổng hợp phải điều hướng đúng sang trang Chi tiết tương ứng và tự động áp filter theo trường/ngữ cảnh vừa click (không bắt người dùng chọn lại từ đầu).
- **Loading state:** khi đổi filter, hiển thị skeleton loading (Fluent `Skeleton`) khoảng 400–600ms trước khi render dữ liệu mới (giả lập độ trễ gọi API thật).
- **Empty state:** nếu filter ra kết quả rỗng, hiển thị Fluent `MessageBar`/illustration đơn giản với text "Không có dữ liệu phù hợp với bộ lọc đã chọn."
- **Responsive tối thiểu:** layout không vỡ ở độ phân giải desktop phổ biến (1280px, 1440px, 1920px). Không bắt buộc tối ưu mobile.

## 9. Bàn giao

- Toàn bộ route hoạt động được, điều hướng qua sidebar mượt, không lỗi console.
- Có thể chạy `npm run dev` và xem trực tiếp trên trình duyệt.
- Nếu có thể, verify bằng Playwright/screenshot từng trang chính (Login, Dashboard, 6 trang module) để đảm bảo không vỡ layout trước khi bàn giao.
