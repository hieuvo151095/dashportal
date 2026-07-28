# Danh sách cải thiện Portal Quản lý nguồn thu — Đợt 1

## I. Tổng quan
- Bản đồ tỷ lệ thu theo Xã/Phường: thay heatmap grid bằng bar chart.
- Top 10 Xã/Phường có tỷ lệ thu cao nhất: đang để ngỏ, cân nhắc dạng biểu đồ khác thay vì list — CHƯA quyết định, giữ nguyên dạng list cho đợt này trừ khi có chỉ định thêm.
- 2 donut chart (Cơ cấu khoản thu, Cơ cấu hình thức thanh toán): phóng to các section này lên.

## II. Danh mục Phí
### 2.1 Tổng hợp toàn thành phố
- Tạo 1 frame bao toàn bộ filter (tương tự frame bảng "Danh sách trường" phía dưới).
- Bổ sung filter "Cấp học" và filter "Hệ thống đối tác".
- Bổ sung 2 nút "Áp dụng" và "Làm mới": "Áp dụng" áp filter, "Làm mới" reset về ban đầu. Khi người dùng chuyển sang module khác rồi quay lại, filter tự động reset.
- In đậm toàn bộ tên cột (STT, Mã trường, ..., Hành động).
- Sửa lỗi: không gõ được tiếng Việt có dấu khi tìm theo tên trường (tìm theo mã trường vẫn ổn). Phải cho phép gõ tiếng Việt có dấu khi tìm theo tên.

### 2.2 Chi tiết theo trường
- Thông tin trường (tên trường — Xã/Phường — cấp học) cần highlight: chữ to hơn, in đậm, hoặc thiết kế lại.
- Xoá icon "Thêm khoản phí" (bỏ chức năng thêm khoản phí).
- Gộp 2 khung search "Tên phí" và "Mã phí" thành 1 khung "Tìm kiếm", placeholder "Tìm theo mã và tên phí".

## III. Thu Học phí
### 3.1 Tổng hợp toàn thành phố
- Thêm khung tìm kiếm "Tìm kiếm", placeholder "Tìm theo tên và mã trường" — cho phép gõ tiếng Việt có dấu (cùng lỗi với II.2.1).
- Thêm filter "Hệ thống" (lọc theo cột Hệ thống ở bảng bên dưới).
- Thêm filter "Trạng thái" (lọc theo cột Trạng thái mới — xem bên dưới).
- Bỏ ký tự "đ" sau tất cả số tiền; thêm dòng "Đơn vị: Đồng" ở góc phải, cùng hàng với chữ "Tổng quan" bên trái. **Áp dụng cho TẤT CẢ modules.**
- Thu gọn khoảng cách giữa cột STT và Mã trường.
- Cột "Hệ thống": đổi UI giống cách hiển thị ở module Danh mục Phí (2.1).
- Thêm cột "Cấp học" để lọc theo cấp học.
- Cột "Còn lại": tách thành 2 cột "HĐ còn lại" và "Phí còn lại" (hiện đang gộp chung).
- Cải thiện UI bảng để nhìn vào biết ngay Tổng thu = Tiền mặt + Chuyển khoản/Thu hộ, giảm cognitive load.
- Tạo khoảng cách cột cố định, nhất quán giữa các cột, ở TẤT CẢ bảng, TẤT CẢ modules.
- Cột "Hành động": chữ "Xem chi tiết" đang xuống dòng từng chữ — sửa để nằm trên 1 dòng.
- Thêm cột trạng thái theo học sinh: 3 trạng thái (Đã thanh toán, Thanh toán một phần, Chưa thanh toán) — CHỈ ở tab "Tổng quan".
- Ở 3 tab còn lại ("Hoá đơn đã thanh toán", "Hoá đơn thanh toán một phần", "Hoá đơn chưa thanh toán"): XOÁ cột "Trạng thái" (không cần thiết vì đã filter theo trạng thái đó rồi).

### 3.2 Chi tiết theo trường
- Thông tin trường cần highlight (giống 2.2).
- Đổi tên filter "Tìm học sinh" thành "Tìm kiếm", placeholder "Tìm theo học sinh và tên hoá đơn" — tìm theo cả cột Học sinh và Tên hoá đơn.
- Thêm filter "Trạng thái": 3 trạng thái chính — Đã thanh toán, Thanh toán một phần, Chưa thanh toán (Chưa thanh toán = "Đã gửi" hiện tại).
- Cột "Học sinh": thêm tên học sinh đầy đủ, giữ mã học sinh, XOÁ thông tin lớp.
- Cột "Tên hoá đơn": giữ mã hoá đơn, XOÁ phần ngày tháng (vd "-02/02/2026") phía sau mã.
- Tên cột dài thì cho xuống dòng nhưng phải in đậm — áp dụng mọi bảng.
- Xoá cột "Hành động".
- Xoá icon "Lọc mở rộng", thay bằng filter "Hạn thanh toán" cho chọn khoảng từ ngày – đến ngày.
- Lỗi UI: khi bảng nhiều dòng và cuộn xuống, sidebar bên trái biến mất + nền có 2 màu — sai. Sidebar phải luôn cố định (fixed) và chỉ 1 màu nền.

## IV. Công nợ Học phí
### 4.1 Tổng hợp toàn thành phố
- Thêm khung tìm kiếm "Tìm kiếm", placeholder "Tìm theo tên và mã trường" — cho phép gõ tiếng Việt có dấu (cùng lỗi với II.2.1).

### 4.2 Chi tiết theo trường
- Thông tin trường cần highlight (giống 2.2).
- Đổi filter "Mã học sinh" thành "Tìm kiếm", placeholder "Tìm theo mã và tên học sinh".
- Xoá cột "Hành động".

## V. Khác — lỗi chung, áp dụng cho TẤT CẢ modules
- Frame nền xám của filter bar hiện tự động giãn/co theo nội dung sau khi filter — sai. Frame phải giữ kích thước cố định bất kể nội dung nhiều hay ít.
- Icon mở rộng/thu gọn sidebar: chuyển xuống dưới, nằm trong 1 section riêng của sidebar. Mũi tên hướng trái khi đang mở rộng, mũi tên hướng phải khi đang thu gọn.
