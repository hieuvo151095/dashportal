# Danh sách cải thiện Portal Quản lý nguồn thu — Đợt 2

QUAN TRỌNG: Đợt này ĐẢO NGƯỢC một phần cách hiển thị đơn vị tiền tệ đã làm ở Đợt 1 (Phase A, mục "Bỏ 'đ', thêm 'Đơn vị: Đồng'"). Đọc kỹ mục III bên dưới trước khi code.

## I. Tổng quan
- Filter bar hiện căn phải → sửa thành căn trái, tham khảo cách căn của module "Thu Học phí" (cả 2 sub-modules) làm chuẩn.
- Tooltip khi hover vào Xã/Phường đang hiện text thô "tyLePercent : 52%" → sửa thành "Tỷ lệ: 52%". Kiểm tra luôn tooltip của Top 10 (nếu có) và donut chart xem có lỗi hiện tên biến thô tương tự không.
- Áp dụng quy tắc đơn vị tiền tệ mới (xem mục III).

## II. Danh mục Phí
### 2.1 Tổng hợp toàn thành phố
- Filter bar căn trái (như trên).
- Bảng đang có nhiều khoảng trống bên phải không cần thiết — điều chỉnh độ rộng cột hợp lý hơn. Ví dụ cột "Tên trường" đang xuống dòng dù còn nhiều chỗ trống bên phải — nới rộng cột để tên nằm 1 dòng.
- Áp dụng quy tắc đơn vị tiền tệ mới: trang này KHÔNG có cột số tiền → xoá hẳn "Đơn vị: Đồng".

### 2.2 Chi tiết theo trường
- Thêm 1 frame màu trắng bao quanh phần thông tin trường (school info), thiết kế lại vị trí các trường thông tin cho đẹp hơn — áp dụng pattern này cho MỌI module có phần thông tin trường tương tự (III.3.2, IV.4.2 dùng chung component SchoolHeader).
- Filter bar căn trái (như trên).
- Bảng hiện KHÔNG có frame màu trắng bao quanh — thêm vào, tham khảo bảng ở Danh mục Phí 2.1 (đã có frame). Kiểm tra và bổ sung frame trắng ở TẤT CẢ module/sub-module còn thiếu.
- Áp dụng quy tắc đơn vị tiền tệ mới: trang này CÓ cột "Số tiền" → giữ "Đơn vị: Đồng", nhưng đặt cùng hàng với tên module "Danh mục phí" bên trong frame trắng mới — KHÔNG đặt cạnh dòng "Danh mục Phí - Chi tiết theo trường" (school breadcrumb) như hiện tại.

## III. Quy tắc hiển thị đơn vị tiền tệ (ÁP DỤNG TOÀN BỘ APP — I, II, III, IV)

Đây là quy tắc mới, thay thế hoàn toàn cách làm ở Đợt 1. Có 3 trường hợp:

**(a) Trang/bảng KHÔNG có bất kỳ số liệu tiền tệ nào** (vd Danh mục Phí 2.1 — chỉ có "Số mục phí đang áp dụng", không có cột tiền):
→ Xoá hẳn "Đơn vị: Đồng", không hiển thị gì về đơn vị.

**(b) Biểu đồ (donut chart, bar chart) có hiển thị giá trị tiền** (vd donut "Cơ cấu khoản thu", bar chart bản đồ Xã/Phường nếu có giá trị tiền, KPI card trên Dashboard):
→ KHÔNG dùng "Đơn vị: Đồng". Thay vào đó, thêm ký tự "đ" ngay sau MỖI giá trị tiền hiển thị (trong legend, tooltip, label trên chart).

**(c) Bảng dữ liệu có cột số tiền rõ ràng** (vd Danh mục Phí 2.2 cột "Số tiền", Thu Học phí, Công nợ):
→ Giữ nguyên số không có "đ" phía sau (không lặp lại đơn vị ở từng dòng). Hiển thị 1 dòng "Đơn vị: Đồng" DUY NHẤT, đặt cùng hàng với tên module/trang (bên trong frame trắng bao filter/bảng nếu có) — không đặt gần tiêu đề riêng của từng trường/sub-context.

Áp dụng quy tắc này nhất quán cho toàn bộ 8 trang: Dashboard, Danh mục Phí (2.1 + 2.2), Thu Học phí (3.1 + 3.2), Công nợ (4.1 + 4.2). Nếu gặp 1 khu vực UI không rõ thuộc trường hợp nào trong 3 trường hợp trên, DỪNG lại và hỏi thay vì tự đoán.

## IV. Áp dụng cho Module III/IV (không có trong screenshot, nhưng áp dụng theo nguyên tắc chung)
- Filter bar căn trái — áp dụng cho 3.1, 3.2, 4.1, 4.2.
- Kiểm tra và bổ sung frame trắng cho bảng + phần thông tin trường ở 3.2 và 4.2 nếu đang thiếu (dùng chung SchoolHeader nên khả năng cao là thiếu đồng loạt).
- Áp dụng quy tắc đơn vị tiền tệ mới (mục III) cho 3.1, 3.2, 4.1, 4.2 theo đúng loại UI của từng phần (bảng có cột tiền → case c; nếu có biểu đồ → case b).
