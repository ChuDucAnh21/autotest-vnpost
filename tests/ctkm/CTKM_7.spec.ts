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

  test('CTKM_7: Tạo CTKM không tích checkbox "Không cài đặt khung giờ"', async ({
    page,
  }) => {
    await page.getByText("Khuyến mãi").click();
    await page.getByText("Danh sách chương trình").click();
    await page.getByRole("button", { name: "Thêm mới chương trình" }).click();

    const ctkmName = `CTKM_WithTimeFrame_${Date.now()}`;
    await page.getByPlaceholder("Nhập tên chương trình").fill(ctkmName);

    // Tích checkbox "Không cài đặt ngày kết thúc"
    await page.getByLabel("Không cài đặt ngày kết thúc").check();

    // Mặc định không tích checkbox "Không cài đặt khung giờ"
    const noTimeFrameCheckbox = page.getByLabel("Không cài đặt khung giờ");
    await expect(noTimeFrameCheckbox).not.toBeChecked();

    // Nhập giờ bắt đầu: 08:00 < giờ kết thúc: 20:00.
    const startTimeInput = page.locator("#startTimeFrame");
    const endTimeInput = page.locator("#endTimeFrame");

    await expect(startTimeInput).toBeEnabled();
    await expect(endTimeInput).toBeEnabled();

    await startTimeInput.fill("08:00");
    await page.keyboard.press("Enter");
    await endTimeInput.fill("20:00");
    await page.keyboard.press("Enter");

    // Chọn phân loại khuyến mãi
    await page.getByText("Theo đơn hàng").click();
    const discountInput = page.locator(".ant-input-number-input").last();
    await discountInput.fill("20000");

    // Chọn ít nhất 1 phạm vi áp dụng
    await page.getByText("Phạm vi áp dụng").click();
    await page.getByText("Bưu điện tỉnh", { exact: true }).click();
    await page.waitForTimeout(1000);
    await page
      .locator(".rs-column__title")
      .filter({ hasText: /Cấp/ })
      .locator('input[type="checkbox"]')
      .first()
      .check({ force: true });

    // Nhấn "Lưu".
    await page.getByRole("button", { name: "Lưu", exact: true }).click();

    // Lưu thành công, CTKM chỉ áp dụng trong khung giờ 08:00–20:00 mỗi ngày.
    await expect(page.locator(".ant-message")).toContainText(
      /Thành công|thành công/i,
    );
    await expect(page).toHaveURL(/.*\/campaign/);
  });
});
