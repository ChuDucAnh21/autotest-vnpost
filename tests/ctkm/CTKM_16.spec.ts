import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { SelectShopPage } from "../../src/pages/select-shop.page";

test.describe("Kiểm tra chức năng Tạo CTKM", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(
      process.env.TEST_USERNAME as string,
      process.env.TEST_PASSWORD as string,
    );

    const selectShopPage = new SelectShopPage(page);
    await selectShopPage.selectShop("Tổng công ty");
  });

  test("CTKM_16: Kiểm tra quy tắc ngăn trùng lặp dòng điều kiện", async ({
    page,
  }) => {
    test.setTimeout(60000);
    // 1. Vào Menu > Khuyến mãi > Danh sách chương trình
    await page.getByText("Khuyến mãi").click();
    await page.getByText("Danh sách chương trình").click();

    // 2. Nhấn "Thêm mới chương trình"
    await page.getByRole("button", { name: "Thêm mới chương trình" }).click();

    // 3. Nhập tên CTKM hợp lệ
    const ctkmName = `CTKM_DuplicateRow_${Date.now()}`;
    await page.getByPlaceholder("Nhập tên chương trình").fill(ctkmName);

    await page
      .locator(".ant-form-item")
      .filter({ hasText: "Điều kiện áp dụng" })
      .locator(".ant-select")
      .click();
    await page.locator(".ant-select-item-option:visible").first().click();

    await page
      .locator(".ant-form-item")
      .filter({ hasText: "Đối tượng áp dụng" })
      .locator(".ant-select")
      .click();
    await page.locator(".ant-select-item-option:visible").first().click();

    await page.locator("#startTime").fill("25/06/2026");
    await page.getByLabel("Không cài đặt ngày kết thúc").check();
    await page.getByLabel("Không cài đặt khung giờ").check();

    // 4. Chọn Phân loại khuyến mãi: Theo sản phẩm
    await page.getByText("Theo sản phẩm").click();
    await page.waitForTimeout(500);

    // Cấu hình Điều kiện 1: Mua từ 2 -> SP 1 -> Giảm 10,000
    await page.locator(".ant-input-number-input").nth(0).fill("2");
    await page.locator(".ant-select").last().click();
    await page.locator(".ant-select-item-option:visible").first().click();
    await page.locator(".ant-input-number-input").nth(1).fill("10000");

    // Click Thêm điều kiện khuyến mãi
    await page.getByText("Thêm điều kiện khuyến mãi").click();
    await page.waitForTimeout(500);

    // Cấu hình Điều kiện 2 trùng lặp hệt Điều kiện 1
    await page.locator(".ant-input-number-input").nth(2).fill("2");
    await page.locator(".ant-select").last().click();
    await page.locator(".ant-select-item-option:visible").first().click();
    await page.locator(".ant-input-number-input").nth(3).fill("10000");

    // Chọn Phạm vi áp dụng
    await page.getByText("Phạm vi áp dụng").click();
    await page.getByText("Bưu điện tỉnh", { exact: true }).click();
    await page
      .locator(".rs-column__title")
      .filter({ hasText: /Cấp/ })
      .locator('input[type="checkbox"]')
      .first()
      .check({ force: true });

    await page.getByText("Thông tin chung").click();

    // 5. Nhấn "Lưu"
    await page.getByRole("button", { name: "Lưu", exact: true }).click();

    // Kết quả mong muốn:
    // - Báo lỗi trùng lặp điều kiện hoặc thông báo "Vui lòng kiểm tra lại thông tin"
    await expect(page.locator(".ant-message")).toContainText(
      /trùng|vui lòng kiểm tra lại|lỗi/i,
    );
    await expect(page).not.toHaveURL(/.*\/campaign$/);
  });
});
