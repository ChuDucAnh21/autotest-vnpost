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

  test("CTKM_23: Khai báo giảm giá bán theo combo cụ thể (giảm %)", async ({
    page,
  }) => {
    test.setTimeout(60000);
    // 1. Vào Menu > Khuyến mãi > Danh sách chương trình
    await page.getByText("Khuyến mãi").click();
    await page.getByText("Danh sách chương trình").click();

    // 2. Nhấn "Thêm mới chương trình"
    await page.getByRole("button", { name: "Thêm mới chương trình" }).click();

    // 3. Nhập tên CTKM hợp lệ
    const ctkmName = `CTKM_ComboPercent_${Date.now()}`;
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

    // 4. Chọn Phân loại khuyến mãi: Theo sản phẩm -> Giảm giá bán
    await page.getByText("Theo sản phẩm").click();
    await page.waitForTimeout(500);

    // Cấu hình Điều kiện 1: Mua từ 3 -> Chọn loại "Combo sản phẩm" -> Chọn Combo -> Giảm 2 %
    await page.locator(".ant-input-number-input").nth(0).fill("3");
    await page.locator(".ant-select").nth(3).click();
    await page
      .locator(".ant-select-item-option:visible")
      .filter({ hasText: /^Combo sản phẩm$/i })
      .first()
      .click();

    await page.locator(".ant-select").nth(4).click();
    await page.locator(".ant-select-item-option:visible").first().click();

    // Click chọn đơn vị %
    await page.getByText("%", { exact: true }).last().click();
    await page.locator(".ant-input-number-input").nth(1).fill("2");

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
    // - Tạo thành công trên hệ thống Web Admin
    await expect(page.locator(".ant-message")).toContainText(
      /thành công|tạo mới/i,
    );
    await expect(page).toHaveURL(/.*\/campaign$/);
  });
});
