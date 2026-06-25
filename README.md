# VNPost UI Automation Testing Framework

Dự án kiểm thử tự động (UI Automation Testing) cho hệ thống **VNPost** (bao gồm module Quản lý Sản phẩm, Chương trình Khuyến mãi CTKM, Loyalty, Xác thực người dùng, v.v.) sử dụng **Playwright** và **TypeScript** theo mô hình **Page Object Model (POM)**.

---

## 🚀 Tính Năng & Thiết Kế Framework

- **Page Object Model (POM)**: Tách biệt hoàn toàn phần xử lý giao diện (locators & actions) và phần kịch bản kiểm thử (assertions & flows) để dễ dàng bảo trì.
- **Environment Management**: Quản lý thông tin nhạy cảm (Tài khoản, Mật khẩu, URL) qua file `.env` được bảo mật cục bộ.
- **Auto-waiting & Smart Locators**: Sử dụng cơ chế auto-waiting mặc định và Web-First Assertions của Playwright, kết hợp bắt các component ảo (Virtual DOM / Ant Design tree) linh hoạt, giúp test chạy ổn định, không bị flaky.
- **Xử lý linh hoạt giao diện Ant Design**: Bao gồm cách tự động xử lý dropdown, date-picker, tree-select, và checkbox đa cấp phức tạp (như phần chọn Đơn vị Phạm vi áp dụng của CTKM).
- **Video & Traces**: Tự động chụp ảnh màn hình, lưu vết (trace) và quay video khi kịch bản test thất bại nhằm mục đích gỡ lỗi (debug).

---

## 🛠️ Hướng Dẫn Thiết Lập (Setup)

### 1. Yêu cầu hệ thống

- Cài đặt **Node.js** (Khuyến nghị phiên bản 18+).

### 2. Cài đặt các thư viện phụ thuộc

Mở Terminal (hoặc Command Prompt) ở thư mục gốc dự án và chạy:

```bash
npm install
```

Sau đó cài đặt các trình duyệt Playwright cần thiết:

```bash
npx playwright install --with-deps
```

### 3. Cấu hình môi trường (Environment Setup)

Tạo file `.env` ở thư mục gốc của dự án (hoặc sao chép từ file `.env.example` nếu có):

```bash
cp .env.example .env
```

Cập nhật nội dung trong file `.env` với thông tin tài khoản test của bạn:

```ini
BASE_URL=https://vnpost.sfin.vn/
TEST_USERNAME=tên_đăng_nhập_của_bạn
TEST_PASSWORD=mật_khẩu_của_bạn
```

---

## 🏃 Hướng Dẫn Chạy Kiểm Thử (Running Tests)

### Chạy toàn bộ test suite ở chế độ headless (chạy ngầm, không mở UI)

```bash
npx playwright test
```

### Chạy toàn bộ test suite và mở UI (Headed mode)

```bash
npx playwright test --headed
```

### Chạy một thư mục module cụ thể (ví dụ Module CTKM)

```bash
npx playwright test tests/ctkm/ --headed
```

### Chạy một file test cụ thể

```bash
npx playwright test tests/ctkm/CTKM_5.spec.ts --headed
```

### Chạy chế độ giao diện tương tác trực quan (UI Mode - Khuyến nghị để Debug)

Chế độ này rất hữu ích, cho phép bạn xem dòng thời gian (timeline), DOM snapshot, console log và network request trực tiếp:

```bash
npx playwright test --ui
```

### Xem báo cáo kết quả kiểm thử (HTML Report)

Sau khi chạy xong, sử dụng lệnh sau để mở báo cáo tổng quan (có chứa video và ảnh chụp nếu test bị fail):

```bash
npx playwright show-report
```

---

## 📁 Cấu Trúc Dự Án Hiện Tại (Project Structure)

```
vnpost-playwright/
├── playwright.config.ts        # File cấu hình Playwright (baseURL, timeout, reporter...)
├── package.json                # Quản lý thư viện phụ thuộc và scripts
├── .env                        # Chứa cấu hình môi trường, URL và tài khoản kiểm thử
├── .gitignore                  # Bỏ qua các thư mục node_modules, test-results, report...
├── README.md                   # Tài liệu hướng dẫn này
├── src/
│   ├── pages/                  # Thư mục lưu các lớp Page Objects (POM)
│   │   ├── base.page.ts        # Các hàm tiện ích dùng chung
│   │   ├── login.page.ts       # Xử lý luồng Đăng nhập
│   │   └── select-shop.page.ts # Xử lý màn hình chọn vai trò & Đơn vị làm việc
│   └── utils/                  # Các tiện ích bổ trợ
└── tests/                      # Thư mục chứa toàn bộ kịch bản kiểm thử (Test Specs)
    ├── auth/
    │   └── login.spec.ts       # Kiểm thử Đăng nhập & Đăng xuất
    ├── ctkm/                   # Kiểm thử Module Chương trình Khuyến mãi
    │   ├── CTKM_5.spec.ts      # Tạo CTKM hợp lệ
    │   ├── CTKM_6.spec.ts      # Tạo CTKM không ngày kết thúc
    │   ├── CTKM_7.spec.ts      # Tạo CTKM không khung giờ
    │   ├── CTKM_8.spec.ts      # Phạm vi áp dụng - Cấp Bưu điện Tỉnh
    │   ├── CTKM_9.spec.ts      # Phạm vi áp dụng - Cấp Bưu điện Xã
    │   └── CTKM_10.spec.ts     # Phạm vi áp dụng - Cấp Điểm bán
    ├── product/                # Kiểm thử Module Quản lý Sản phẩm
    │   ├── create-product-required.spec.ts
    │   ├── edit-product-required.spec.ts
    │   ├── add-product-variant.spec.ts
    │   └── delete-product.spec.ts
    └── ctrinh_Loyalty/         # Kiểm thử Module Loyalty (đang phát triển)
```

---

## 📌 Các Quy Tắc Chung (Conventions)

1. **Locators**: Hạn chế hardcode XPath/CSS chọn lọc theo thứ tự tuyệt đối. Thay vào đó, hãy sử dụng các locator theo hướng người dùng như `getByRole()`, `getByLabel()`, `getByPlaceholder()`, hoặc kết hợp `.filter({ hasText: '...' })`.
2. **Assertions**: Toàn bộ Assertions (`expect()`) phải được viết trong các file kịch bản test (`*.spec.ts`), tuyệt đối không được giấu bên trong file Page Object (`*.page.ts`).
3. **Chờ đợi (Wait)**:
    - Tuyệt đối không dùng `page.waitForTimeout()` trừ trường hợp bắt buộc phải giả lập độ trễ hệ thống (ví dụ: thao tác cuộn ảo - virtual scroll, API quá chậm không thể bắt tín hiệu).
    - Ưu tiên dùng `await page.waitForSelector()` hoặc `await expect(locator).toBeVisible()` để bắt DOM trạng thái động.
4. **Xử lý List/Table**: Luôn wait table row / list item xuất hiện bằng class thật (ví dụ `.ant-table-row`) trước khi count hoặc get text để tránh dính "Loading Skeleton" hay dòng "No Data".
