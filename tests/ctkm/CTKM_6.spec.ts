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
    // await page.getByRole('button', { name: 'Admin', exact: true }).click();
  });

  test('CTKM_6: Tạo CTKM bật checkbox "Không cài đặt ngày kết thúc"', async ({
    page,
  }) => {
    // 1. Vào Menu > Khuyến mãi > Danh sách chương trình
    await page.getByText("Khuyến mãi").click();
    await page.getByText("Danh sách chương trình").click();

    // 2. Nhấn "Thêm mới chương trình".
    await page.getByRole("button", { name: "Thêm mới chương trình" }).click();

    // 3. Nhập tên chương trình chưa tồn tại
    const ctkmName = `CTKM_NoEndDate_${Date.now()}`;
    await page.getByPlaceholder("Nhập tên chương trình").fill(ctkmName);

    // 4. Nhập ngày bắt đầu hợp lệ: Hôm nay (Mặc định)

    // 5. Tích checkbox "Không cài đặt ngày kết thúc"
    const noEndDateCheckbox = page.getByLabel("Không cài đặt ngày kết thúc");
    await noEndDateCheckbox.check();

    // 6. Quan sát trường "Ngày kết thúc".
    const endDateInput = page.locator("#endTime");
    await expect(endDateInput).toBeDisabled();

    // 7. Không tích "Không cài đặt khung giờ" -> nhập giờ kết thúc > giờ bắt đầu
    await page.locator("#startTimeFrame").fill("08:00");
    await page.keyboard.press("Enter");
    await page.locator("#endTimeFrame").fill("22:00");
    await page.keyboard.press("Enter");

    // 8. Chọn phân loại khuyến mãi
    await page.getByText("Theo đơn hàng").click();

    // 9. Khai báo phân loại hợp lệ
    const discountInput = page.locator(".ant-input-number-input").last();
    await discountInput.fill("20000");

    // 10. Chọn ít nhất 1 phạm vi áp dụng
    await page.getByText("Phạm vi áp dụng").click();
    await page.getByText("Bưu điện tỉnh", { exact: true }).click();
    await page.waitForTimeout(1000);
    await page
      .locator(".rs-column__title")
      .filter({ hasText: /Cấp/ })
      .locator('input[type="checkbox"]')
      .first()
      .check({ force: true });

    // 11. Nhấn "Lưu".
    await page.getByRole("button", { name: "Lưu", exact: true }).click();

    // Kết quả: Lưu thành công không yêu cầu nhập ngày kết thúc. CTKM chạy vô thời hạn.
    await expect(page.locator(".ant-message")).toContainText(
      /Thành công|thành công/i,
    );
    await expect(page).toHaveURL(/.*\/campaign/);
    
    await page.waitForSelector('.ant-table-row', { timeout: 10000 });
    const firstRow = page.locator('.ant-table-row').first();
    await expect(firstRow).toContainText(ctkmName);
  });
});
