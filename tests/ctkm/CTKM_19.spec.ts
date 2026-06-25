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

  test("CTKM_19: Exception: Khai báo điều kiện nhóm khác (Nhóm 1 + Nhóm 2)", async ({
    page,
  }) => {
    test.setTimeout(60000);
    // 1. Vào Menu > Khuyến mãi > Danh sách chương trình
    await page.getByText("Khuyến mãi").click();
    await page.getByText("Danh sách chương trình").click();

    // 2. Nhấn "Thêm mới chương trình"
    await page.getByRole("button", { name: "Thêm mới chương trình" }).click();

    // 3. Nhập tên CTKM hợp lệ
    const ctkmName = `CTKM_CrossGroup_${Date.now()}`;
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

    // Cấu hình Điều kiện 1: Loại Sản phẩm (Nhóm 1)
    await page.locator(".ant-input-number-input").nth(0).fill("2");
    await page.locator(".ant-select").nth(3).click();
    await page
      .locator(".ant-select-item-option:visible")
      .filter({ hasText: /^Sản phẩm$/i })
      .first()
      .click();
    await page.locator(".ant-select").nth(4).click();
    await page.locator(".ant-select-item-option:visible").first().click();
    await page.locator(".ant-input-number-input").nth(1).fill("10000");

    // Click Thêm điều kiện khuyến mãi
    await page.getByText("Thêm điều kiện khuyến mãi").click();
    await page.waitForTimeout(500);

    // Cấu hình Điều kiện 2: Combo sản phẩm (Nhóm 1)
    await page.locator(".ant-input-number-input").nth(2).fill("1");
    await page.locator(".ant-select").nth(5).click();
    await page
      .locator(".ant-select-item-option:visible")
      .filter({ hasText: /^Combo sản phẩm$/i })
      .first()
      .click();
    await page.locator(".ant-select").nth(6).click();
    await page.locator(".ant-select-item-option:visible").first().click();
    await page.locator(".ant-input-number-input").nth(3).fill("15000");

    // Thao tác gây exception: Chuyển Điều kiện 1 (nth(3)) sang loại thuộc Nhóm 2 (ví dụ Sản phẩm trong danh mục hoặc SKU)
    await page.locator(".ant-select").nth(3).click();
    const catOption = page
      .locator(".ant-select-item-option:visible")
      .filter({ hasText: /danh mục|SKU/i });
    if ((await catOption.count()) > 0) {
      await catOption.first().click();
    } else {
      await page.locator(".ant-select-item-option:visible").last().click();
    }

    // Kết quả mong muốn:
    // - Hiển thị hộp thoại xác nhận đổi nhóm điều kiện hoặc thông báo lỗi
    const modalOrMessage = page.locator(
      ".ant-modal, .ant-message, .ant-popover",
    );
    await expect(modalOrMessage.first()).toBeVisible();
  });
});
