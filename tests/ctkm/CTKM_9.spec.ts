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

  test("CTKM_9: Chọn phạm vi áp dụng cấp Bưu điện xã", async ({ page }) => {
    await page.getByText("Khuyến mãi").click();
    await page.getByText("Danh sách chương trình").click();
    await page.getByRole("button", { name: "Thêm mới chương trình" }).click();

    const ctkmName = `CTKM_Scope_Ward_${Date.now()}`;
    await page.getByPlaceholder("Nhập tên chương trình").fill(ctkmName);

    await page.getByLabel("Không cài đặt ngày kết thúc").check();
    await page.getByLabel("Không cài đặt khung giờ").check();

    await page.getByText("Theo đơn hàng").click();
    const discountInput = page.locator(".ant-input-number-input").last();
    await discountInput.fill("20000");

    // Tại tab Phạm vi áp dụng, chọn Áp dụng cho "Bưu điện xã".
    await page.getByText("Phạm vi áp dụng").click();
    await page.getByText("Bưu điện xã", { exact: true }).click();

    await page.waitForTimeout(1000);

    // 1. Click thẳng vào chữ "Bưu điện Hà Tĩnh" để load danh sách Xã bên cột phải
    await page.getByText("Bưu điện Hà Tĩnh", { exact: true }).click();

    await page.waitForTimeout(1500);

    // 2. Cột Cấp Xã / Phường: Tích vào checkbox của "Bưu điện xã Hà Tĩnh"
    await page
      .locator("div")
      .filter({ hasText: /^Bưu điện xã Hà Tĩnh$/ })
      .locator('input[type="checkbox"]')
      .first()
      .check({ force: true });

    // Nhấn "Lưu"
    await page.getByRole("button", { name: "Lưu", exact: true }).click();

    // - Toast/thông báo thành công xuất hiện.
    await expect(page.locator(".ant-message")).toContainText(
      /Thành công|thành công/i,
    );
    await expect(page).toHaveURL(/.*\/campaign/);

    // - Cột Phạm vi áp dụng hiển thị "n Xã/phường"
    await page.waitForSelector(".ant-table-row", { timeout: 10000 });
    const firstRow = page.locator(".ant-table-row").first();
    await expect(firstRow).toContainText("Xã/Phường");
  });
});
