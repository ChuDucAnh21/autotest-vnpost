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

  test("CTKM_12: Lưu CTKM khi tên trùng với chương trình đã tồn tại", async ({
    page,
  }) => {
    // 1. Vào Menu > Khuyến mãi > Danh sách chương trình
    await page.getByText("Khuyến mãi").click();
    await page.getByText("Danh sách chương trình").click();

    // Lấy tên của CTKM đầu tiên trong danh sách (để cố tình tạo trùng)
    await page.waitForSelector(".ant-table-row", { timeout: 10000 });
    const firstRow = page.locator(".ant-table-row").first();
    const existingName = await firstRow.locator("td").nth(2).innerText(); // tên ở cột thứ 3

    // 2. Nhấn "Thêm mới chương trình"
    await page.getByRole("button", { name: "Thêm mới chương trình" }).click();

    // 3. Nhập tên chương trình ĐÃ TỒN TẠI
    await page.getByPlaceholder("Nhập tên chương trình").fill(existingName);

    // Điền đầy đủ các thông tin hợp lệ khác để vượt qua các validation khác
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

    await page.locator(".ant-select-item-option:visible").first().click(); //
    await page.getByLabel("Không cài đặt ngày kết thúc").check();
    await page.getByLabel("Không cài đặt khung giờ").check();

    // await page.locator("#endTime").fill("31/12/2027");
    // await page.keyboard.press("Enter");

    await page.getByText("Theo đơn hàng").click();
    const discountInput = page.locator(".ant-input-number-input").last();
    await discountInput.fill("50000");

    await page.getByText("Phạm vi áp dụng").click();
    await page.getByText("Bưu điện tỉnh", { exact: true }).click();
    await page.waitForTimeout(1000);
    await page
      .locator(".rs-column__title")
      .filter({ hasText: /Cấp/ })
      .locator('input[type="checkbox"]')
      .first()
      .check({ force: true });

    await page.getByText("Thông tin chung").click();

    // 4. Nhấn "Lưu"
    await page.getByRole("button", { name: "Lưu", exact: true }).click();

    // Kết quả mong muốn:
    // - Hệ thống hiển thị thông báo lỗi: Tên chương trình đã tồn tại.
    // - Không lưu được CTKM.

    // Kiểm tra toast message lỗi
    await expect(page.locator(".ant-message")).toContainText(
      /Tên chiến dịch đã tồn tại/i,
    );

    // Kiểm tra vẫn ở lại màn hình Thêm mới
    await expect(page).not.toHaveURL(/.*\/campaign$/);
  });
});
