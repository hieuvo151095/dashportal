# Portal Giám sát Thu Học phí

Prototype **frontend-only** cho portal giám sát thu học phí dành cho lãnh đạo Sở GD&ĐT cấp Tỉnh/Thành phố (bối cảnh mẫu: TP. Hồ Chí Minh). Toàn bộ dữ liệu trong ứng dụng là **mock data**, sinh có seed cố định — **không kết nối backend/API thật**, không cần cấu hình gì thêm ngoài chạy dev server.

Xem `docs/spec-portal-thu-hoc-phi.md` để biết đầy đủ yêu cầu sản phẩm, mô tả từng module và thuật ngữ nghiệp vụ.

## Chạy local

```bash
npm install
npm run dev
```

Mở trình duyệt tại địa chỉ Vite in ra (mặc định `http://localhost:5173`). Đăng nhập bằng bất kỳ email/mật khẩu hợp lệ nào — không có xác thực thật.

## Tech stack

- **React** + **TypeScript** + **Vite**
- **Fluent UI React v9** (`@fluentui/react-components`, `@fluentui/react-icons`) — design system
- **React Router** — routing
- **Recharts** — biểu đồ (donut, line, bar)
