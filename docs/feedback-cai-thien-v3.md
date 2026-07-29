# Danh sách cải thiện Portal Quản lý nguồn thu — Đợt 3

QUAN TRỌNG: Mục 1 dưới đây ĐIỀU CHỈNH quy tắc đơn vị tiền tệ đã chốt ở Đợt 2 — riêng cho các trang "Chi tiết theo trường", KHÔNG áp dụng case (c) như trước nữa.

## 1. Chuẩn hoá tiêu đề + layout trang "Chi tiết theo trường" (ÁP DỤNG CẢ 3: Danh mục Phí 2.2, Thu Học phí 3.2, Công nợ 4.2)
- Gộp text tiêu đề module + tên sub-module thành 1 dòng, cùng vị trí/kiểu với trang "Tổng hợp toàn thành phố" (vd "Danh mục Phí — Tổng hợp toàn thành phố" hiện có) → đổi thành "Danh mục Phí — Chi tiết theo trường" (và tương tự cho Thu Học phí, Công nợ). Đưa vào bên trong frame trắng (hiện tiêu đề module đang nằm ngoài frame).
- Tên trường + mã trường: căn trái. Dropdown chọn trường: căn phải, cùng hàng với tên trường/mã trường.
- BỎ HẲN text "Đơn vị: Đồng" ở cả 3 trang này — điều chỉnh lại quy tắc case (c) đã build ở Đợt 2, riêng cho loại trang "Chi tiết theo trường" (các trang Tổng hợp vẫn giữ nguyên "Đơn vị: Đồng" như cũ, không đổi).

## 2. Danh mục Phí 2.2 — độ rộng cột
Kéo dài cột "Mã phí" và "Tham chiếu pháp lý" để nội dung nằm trên 1 hàng, không xuống dòng.

## 3. Thu Học phí 3.1 — BUG: cột Trạng thái ở tab "Tổng quan" luôn hiện "Thanh toán một phần"
Cả 3 tab hoá đơn riêng (Đã thanh toán / Một phần / Chưa thanh toán) đều có dữ liệu thật, nhưng tab "Tổng quan" chỉ hiện đúng 1 giá trị trạng thái duy nhất ("Thanh toán một phần") cho MỌI trường — sai. Cần tìm nguyên nhân gốc (logic derive trạng thái theo trường đã build ở Phase B — 0 thu = Chưa thanh toán / thu đủ = Đã thanh toán / còn lại = Một phần — hiện không branch đúng) và sửa để hiện đúng cả 3 trạng thái tuỳ trường.
Đồng thời: kéo dài cột "Trạng thái" để "Thanh toán một phần" nằm trên 1 hàng, không xuống dòng.

## 4. Thu Học phí 3.2 — BUG: cột "Học sinh" bị trống ở hầu hết các dòng
Chỉ dòng đầu tiên hiện đầy đủ thông tin học sinh (avatar/tên/mã), các dòng còn lại bị trống — kể cả khi là học sinh khác hoàn toàn. Tìm nguyên nhân gốc (khả năng cao là logic "chỉ hiện 1 lần khi trùng học sinh" bị áp dụng sai phạm vi) và sửa để MỌI dòng đều hiện đầy đủ thông tin học sinh tương ứng.

## 5. Công nợ 4.2 — thiếu phân trang
Bảng hiện có 211 dòng nhưng hiện tất cả trên 1 trang — không nhất quán với các bảng khác (giới hạn tối đa 50 dòng/trang, quá thì sang trang mới). Thêm phân trang giống các bảng khác trong app.
