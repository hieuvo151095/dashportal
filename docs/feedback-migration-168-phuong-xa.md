# Migration: Mở rộng 14 → 168 Phường/Xã

## Nguồn dữ liệu
File `docs/DS_Phu_o__ng_Xa__HCM.xlsx`, sheet "168 phuong xa TPHCM" — 168 dòng, cột: STT, Loại (Phường/Xã/Đặc khu), Tên đơn vị hành chính mới, Địa bàn cũ, Tỉnh/Thành trước sáp nhập, Ghi chú. Tổng: 113 Phường + 54 Xã + 1 Đặc khu = 168.

## Phạm vi
1. Đọc file Excel (dùng python openpyxl hoặc thư viện tương đương), thay thế danh sách 14 Phường/Xã hardcode hiện tại (trong constants.ts) bằng đầy đủ 168 đơn vị từ file.
2. Tăng tổng số trường mock từ 50 lên khoảng 150-200 trường (bạn tự đề xuất con số cụ thể), phân bố sao cho HẦU HẾT 168 Phường/Xã có ít nhất 1 trường — một vài khu vực có mật độ thấp (đặc biệt "Đặc khu" — khả năng cao là Côn Đảo, dân số rất thấp) có thể có rất ít hoặc 0 trường, đây là điều CHẤP NHẬN ĐƯỢC, không phải lỗi.
3. Tăng tương ứng số học sinh, khoản phí, hoá đơn theo đúng tỷ lệ/logic sinh dữ liệu hiện có (giữ nguyên seed PRNG, đảm bảo tính determinism — verify lại bằng cách chạy 2 process riêng biệt như đã làm ở Phase 2).
4. Audit toàn bộ app tìm nơi nào đang hardcode số 14 hoặc danh sách Phường/Xã cũ, đảm bảo mọi dropdown/filter (8 trang) tự động dùng danh sách 168 mới — không sửa tay từng nơi.
5. ĐÂY LÀ MIGRATION DỮ LIỆU THUẦN TUÝ — KHÔNG động vào UI/thiết kế bản đồ Tổng quan (việc đó để prompt riêng sau khi migration này xong và verify ổn định).

## Yêu cầu trước khi code
Trước khi sinh dữ liệu, đề xuất: (a) tổng số trường cụ thể, (b) ước tính tổng số học sinh/hoá đơn sau khi tăng, (c) danh sách (nếu có) các Phường/Xã sẽ cố tình để 0 trường và lý do — chờ xác nhận rồi mới chạy generation.
