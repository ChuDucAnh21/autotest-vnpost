import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { SelectShopPage } from "../../src/pages/select-shop.page";

test.describe("Kiểm tra chức năng Tạo CTKM", () => {
  test.beforeEach(async ({ page }) => {
    // Đăng nhập với tài khoản từ .env
    const loginPage = new LoginPage(page);
    await loginPage.login(
      process.env.TEST_USERNAME as string,
      process.env.TEST_PASSWORD as string,
    );

    // Chọn Tổng công ty với vai trò Admin
    const selectShopPage = new SelectShopPage(page);
    await selectShopPage.selectShop("Tổng công ty");
    // (Tuỳ vào cấu trúc UI, nếu vai trò nằm ở nút riêng biệt thì uncomment dòng dưới)
    // await page.getByRole('button', { name: 'Admin', exact: true }).click();
  });

  test("CTKM_5: Tạo CTKM thành công với đầy đủ thông tin hợp lệ", async ({
    page,
  }) => {
    // 1. Vào Menu > Khuyến mãi > Danh sách chương trình
    await page.getByText("Khuyến mãi").click();
    await page.getByText("Danh sách chương trình").click();

    // 2. Nhấn "Thêm mới chương trình".
    await page.getByRole("button", { name: "Thêm mới chương trình" }).click();

    // 3. Nhập tên chương trình chưa tồn tại
    const ctkmName = `CTKM_Test_${Date.now()}`;
    await page.getByPlaceholder("Nhập tên chương trình").fill(ctkmName);

    // 4. Chọn điều kiện áp dụng
    await page
      .locator(".ant-form-item")
      .filter({ hasText: "Điều kiện áp dụng" })
      .locator(".ant-select")
      .click();
    // Chờ list hiện ra và click vào item hiển thị đầu tiên
    await page.locator(".ant-select-item-option:visible").first().click();

    // 5. Chọn đối tượng áp dụng
    await page
      .locator(".ant-form-item")
      .filter({ hasText: "Đối tượng áp dụng" })
      .locator(".ant-select")
      .click();
    await page.locator(".ant-select-item-option:visible").first().click();

    // 6. Nhập thông tin mô tả
    await page
      .locator("#description")
      .fill("Test tạo CTKM với đầy đủ thông tin hợp lệ");

    // 7. Nhập ngày bắt đầu hợp lệ: Hôm nay (Mặc định tự điền)

    // 8. Không tích "Không cài đặt ngày kết thúc" -> nhập ngày kết thúc > ngày bắt đầu
    await page.locator("#endTime").fill("31/12/2027");
    await page.keyboard.press("Enter");

    // 9. Không tích "Không cài đặt khung giờ" -> nhập giờ kết thúc > giờ bắt đầu
    await page.locator("#startTimeFrame").fill("08:00");
    await page.keyboard.press("Enter");
    await page.locator("#endTimeFrame").fill("22:00");
    await page.keyboard.press("Enter");

    // 10. Chọn phân loại khuyến mãi
    await page.getByText("Theo đơn hàng").click();

    // 11. Khai báo phân loại hợp lệ
    // Tìm input số tiền giảm (có thể là input number cuối cùng hoặc theo class)
    const discountInput = page.locator(".ant-input-number-input").last();
    await discountInput.fill("50000");

    // 12. Chọn ít nhất 1 phạm vi áp dụng
    await page.getByText("Phạm vi áp dụng").click();
    await page.getByText("Bưu điện tỉnh", { exact: true }).click();
    await page.waitForTimeout(1000);
    // Chọn checkbox "Cấp Tỉnh" (hoặc Cấp Tổng công ty / Cấp Tỉnh) ở tiêu đề cột
    await page
      .locator(".rs-column__title")
      .filter({ hasText: /Cấp/ })
      .locator('input[type="checkbox"]')
      .first()
      .check({ force: true });

    // 13. Nhấn "Lưu".
    await page.getByRole("button", { name: "Lưu", exact: true }).click();

    // Kết quả mong muốn:
    // - Hệ thống lưu thành công, điều hướng về màn hình danh sách.
    // - CTKM hiển thị trong danh sách với trạng thái Đang diễn ra.
    // - Mã chương trình đúng format CTKMyymmddOOOO.
    // - Toast/thông báo thành công xuất hiện.

    await expect(page.locator(".ant-message")).toContainText(
      /Thành công|thành công/i,
    );
    await expect(page).toHaveURL(/.*\/campaign/);

    // Verify in list
    // Chờ bảng load xong dữ liệu
    await page.waitForSelector(".ant-table-row", { timeout: 10000 });
    const firstRow = page.locator(".ant-table-row").first();
    await expect(firstRow).toContainText(ctkmName);
    await expect(firstRow).toContainText("Đang diễn ra");
  });
});
