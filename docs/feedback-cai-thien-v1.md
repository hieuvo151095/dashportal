# Danh sách cải thiện Portal Quản lý nguồn thu — Đợt 1

> **Trạng thái:** Các mục đánh dấu **[✅ ĐÃ HOÀN THÀNH — Phase A]** đã được xử lý và deploy (pattern dùng chung áp dụng cho toàn bộ app — xem `CLAUDE.md` mục "Shared component/pattern từ Phase A"). Các mục đánh dấu **[✅ ĐÃ HOÀN THÀNH — Phase B]** cũng đã xử lý xong (nội dung/cột/filter riêng từng module — Danh mục Phí 2.2, Thu Học phí 3.1/3.2, Công nợ Học phí 4.1/4.2). Mục còn lại (không đánh dấu, chỉ còn Module I — Tổng quan) **chưa làm**.

## I. Tổng quan
- Bản đồ tỷ lệ thu theo Xã/Phường: thay heatmap grid bằng bar chart.
- Top 10 Xã/Phường có tỷ lệ thu cao nhất: đang để ngỏ, cân nhắc dạng biểu đồ khác thay vì list — CHƯA quyết định, giữ nguyên dạng list cho đợt này trừ khi có chỉ định thêm.
- 2 donut chart (Cơ cấu khoản thu, Cơ cấu hình thức thanh toán): phóng to các section này lên.

## II. Danh mục Phí
### 2.1 Tổng hợp toàn thành phố
- Tạo 1 frame bao toàn bộ filter (tương tự frame bảng "Danh sách trường" phía dưới). **[✅ ĐÃ HOÀN THÀNH — Phase A]**
- Bổ sung filter "Cấp học" và filter "Hệ thống đối tác".
- Bổ sung 2 nút "Áp dụng" và "Làm mới": "Áp dụng" áp filter, "Làm mới" reset về ban đầu. Khi người dùng chuyển sang module khác rồi quay lại, filter tự động reset. **[✅ ĐÃ HOÀN THÀNH — Phase A]**
- In đậm toàn bộ tên cột (STT, Mã trường, ..., Hành động). **[✅ ĐÃ HOÀN THÀNH — Phase A]**
- Sửa lỗi: không gõ được tiếng Việt có dấu khi tìm theo tên trường (tìm theo mã trường vẫn ổn). Phải cho phép gõ tiếng Việt có dấu khi tìm theo tên. **[✅ ĐÃ HOÀN THÀNH — Phase A]**

### 2.2 Chi tiết theo trường
- Thông tin trường (tên trường — Xã/Phường — cấp học) cần highlight: chữ to hơn, in đậm, hoặc thiết kế lại. **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Xoá icon "Thêm khoản phí" (bỏ chức năng thêm khoản phí). **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Gộp 2 khung search "Tên phí" và "Mã phí" thành 1 khung "Tìm kiếm", placeholder "Tìm theo mã và tên phí". **[✅ ĐÃ HOÀN THÀNH — Phase B]**

## III. Thu Học phí
### 3.1 Tổng hợp toàn thành phố
- Thêm khung tìm kiếm "Tìm kiếm", placeholder "Tìm theo tên và mã trường" — cho phép gõ tiếng Việt có dấu (cùng lỗi với II.2.1). **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Thêm filter "Hệ thống" (lọc theo cột Hệ thống ở bảng bên dưới). **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Thêm filter "Trạng thái" (lọc theo cột Trạng thái mới — xem bên dưới). **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Bỏ ký tự "đ" sau tất cả số tiền; thêm dòng "Đơn vị: Đồng" ở góc phải, cùng hàng với chữ "Tổng quan" bên trái. **Áp dụng cho TẤT CẢ modules.** **[✅ ĐÃ HOÀN THÀNH — Phase A]**
- Thu gọn khoảng cách giữa cột STT và Mã trường. **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Cột "Hệ thống": đổi UI giống cách hiển thị ở module Danh mục Phí (2.1). **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Thêm cột "Cấp học" để lọc theo cấp học. **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Cột "Còn lại": tách thành 2 cột "HĐ còn lại" và "Phí còn lại" (hiện đang gộp chung). **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Cải thiện UI bảng để nhìn vào biết ngay Tổng thu = Tiền mặt + Chuyển khoản/Thu hộ, giảm cognitive load. **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Tạo khoảng cách cột cố định, nhất quán giữa các cột, ở TẤT CẢ bảng, TẤT CẢ modules. **[✅ ĐÃ HOÀN THÀNH — Phase A]**
- Cột "Hành động": chữ "Xem chi tiết" đang xuống dòng từng chữ — sửa để nằm trên 1 dòng. **[✅ ĐÃ HOÀN THÀNH — Phase A]**
- Thêm cột trạng thái theo học sinh: 3 trạng thái (Đã thanh toán, Thanh toán một phần, Chưa thanh toán) — CHỈ ở tab "Tổng quan". **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Ở 3 tab còn lại ("Hoá đơn đã thanh toán", "Hoá đơn thanh toán một phần", "Hoá đơn chưa thanh toán"): XOÁ cột "Trạng thái" (không cần thiết vì đã filter theo trạng thái đó rồi). **[✅ ĐÃ HOÀN THÀNH — Phase B]**

### 3.2 Chi tiết theo trường
- Thông tin trường cần highlight (giống 2.2). **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Đổi tên filter "Tìm học sinh" thành "Tìm kiếm", placeholder "Tìm theo học sinh và tên hoá đơn" — tìm theo cả cột Học sinh và Tên hoá đơn. **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Thêm filter "Trạng thái": 3 trạng thái chính — Đã thanh toán, Thanh toán một phần, Chưa thanh toán (Chưa thanh toán = "Đã gửi" hiện tại). **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Cột "Học sinh": thêm tên học sinh đầy đủ, giữ mã học sinh, XOÁ thông tin lớp. **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Cột "Tên hoá đơn": giữ mã hoá đơn, XOÁ phần ngày tháng (vd "-02/02/2026") phía sau mã. **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Tên cột dài thì cho xuống dòng nhưng phải in đậm — áp dụng mọi bảng. **[✅ ĐÃ HOÀN THÀNH — Phase A]**
- Xoá cột "Hành động". **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Xoá icon "Lọc mở rộng", thay bằng filter "Hạn thanh toán" cho chọn khoảng từ ngày – đến ngày. **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Lỗi UI: khi bảng nhiều dòng và cuộn xuống, sidebar bên trái biến mất + nền có 2 màu — sai. Sidebar phải luôn cố định (fixed) và chỉ 1 màu nền. **[✅ ĐÃ HOÀN THÀNH — Phase A]**

## IV. Công nợ Học phí
### 4.1 Tổng hợp toàn thành phố
- Thêm khung tìm kiếm "Tìm kiếm", placeholder "Tìm theo tên và mã trường" — cho phép gõ tiếng Việt có dấu (cùng lỗi với II.2.1). **[✅ ĐÃ HOÀN THÀNH — Phase B]**

### 4.2 Chi tiết theo trường
- Thông tin trường cần highlight (giống 2.2). **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Đổi filter "Mã học sinh" thành "Tìm kiếm", placeholder "Tìm theo mã và tên học sinh". **[✅ ĐÃ HOÀN THÀNH — Phase B]**
- Xoá cột "Hành động". **[✅ ĐÃ HOÀN THÀNH — Phase B]**

## V. Khác — lỗi chung, áp dụng cho TẤT CẢ modules
- Frame nền xám của filter bar hiện tự động giãn/co theo nội dung sau khi filter — sai. Frame phải giữ kích thước cố định bất kể nội dung nhiều hay ít. **[✅ ĐÃ HOÀN THÀNH — Phase A]**
- Icon mở rộng/thu gọn sidebar: chuyển xuống dưới, nằm trong 1 section riêng của sidebar. Mũi tên hướng trái khi đang mở rộng, mũi tên hướng phải khi đang thu gọn. **[✅ ĐÃ HOÀN THÀNH — Phase A]**
