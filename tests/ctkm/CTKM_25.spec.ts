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

  test("CTKM_25: Khai báo giảm giá bán theo combo trong danh mục combo", async ({
    page,
  }) => {
    test.setTimeout(60000);
    // 1. Vào Menu > Khuyến mãi > Danh sách chương trình
    await page.getByText("Khuyến mãi").click();
    await page.getByText("Danh sách chương trình").click();

    // 2. Nhấn "Thêm mới chương trình"
    await page.getByRole("button", { name: "Thêm mới chương trình" }).click();

    // 3. Nhập tên CTKM hợp lệ
    const ctkmName = `CTKM_CategoryCombo_${Date.now()}`;
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
    await page.waitForTimeout(500);

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    await page.locator("#startTime").fill(`${dd}/${mm}/${yyyy}`);
    await page.getByLabel("Không cài đặt ngày kết thúc").check({ force: true });
    await page.getByLabel("Không cài đặt khung giờ").check({ force: true });

    // 4. Chọn Phân loại khuyến mãi: Theo sản phẩm -> Giảm giá bán
    await page.getByText("Theo sản phẩm").click();
    await page.waitForTimeout(500);

    // Cấu hình Điều kiện 1: Mua từ 2 -> Chọn loại "Sản phẩm trong danh mục"
    await page.locator(".ant-input-number-input").nth(0).fill("2");
    await page.locator(".ant-select").nth(3).click();
    await page
      .locator(".ant-select-item-option:visible")
      .filter({ hasText: /^Sản phẩm trong danh mục$/i })
      .first()
      .click();
    await page.waitForTimeout(500);

    // Đổi nth(4) từ "Danh mục sản phẩm" sang "Danh mục combo"
    await page.locator(".ant-select").nth(4).click();
    await page
      .locator(".ant-select-item-option:visible")
      .filter({ hasText: /combo/i })
      .first()
      .click();
    await page.waitForTimeout(500);

    // Click TreeSelect nth(5) để chọn danh mục combo
    await page.locator(".ant-select").nth(5).click();
    await page.waitForTimeout(500);
    await page.locator(".ant-select-tree-node-content-wrapper:visible").first().click();

    // Chọn đơn vị VND (nếu cần)
    const vndOption = page.locator("div").filter({ hasText: /^VND$|^đ$/ }).last();
    if (await vndOption.isVisible()) {
      await vndOption.click();
    }

    // Nhập mức giảm giá mỗi SP = 5,000 VND
    await page.locator(".ant-input-number-input").nth(1).fill("5000");

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
    // - Hiển thị toast message thành công
    // - Chuyển hướng về trang danh sách chương trình
    await expect(page.locator(".ant-message")).toContainText(
      /thành công|tạo mới/i,
    );
    await expect(page).toHaveURL(/.*\/campaign$/);
  });
});
