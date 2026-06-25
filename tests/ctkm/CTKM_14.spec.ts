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

  test("CTKM_14: Lưu CTKM khi giờ kết thúc trước giờ bắt đầu", async ({
    page,
  }) => {
    test.setTimeout(60000);
    // 1. Vào Menu > Khuyến mãi > Danh sách chương trình
    await page.getByText("Khuyến mãi").click();
    await page.getByText("Danh sách chương trình").click();

    // 2. Nhấn "Thêm mới chương trình"
    await page.getByRole("button", { name: "Thêm mới chương trình" }).click();

    // 3. Nhập tên CTKM chưa tồn tại
    const ctkmName = `CTKM_Test_${Date.now()}`;
    await page.getByPlaceholder("Nhập tên chương trình").fill(ctkmName);

    // Điền các thông tin hợp lệ khác
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

    // 4. Nhập ngày bắt đầu: 20/06/2026
    await page.locator("#startTime").fill("20/06/2026");
    await page.keyboard.press("Enter");

    // 5. Tích checkbox “Không cài đặt ngày kết thúc”
    await page.getByLabel("Không cài đặt ngày kết thúc").check();

    // 6. Nhập giờ bắt đầu: 15:00
    await page.locator("#startTimeFrame").fill("15:00");

    // 7. Nhập giờ kết thúc trước giờ bắt đầu: 06:00
    await page.locator("#endTimeFrame").fill("06:00");

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

    // Nhấn "Lưu"
    await page.getByRole("button", { name: "Lưu", exact: true }).click();

    // Kết quả mong muốn:
    // - Hệ thống hiển thị message lỗi tại trường Ngày bắt đầu và/hoặc Ngày kết thúc
    // - Hiển thị toast message "Vui lòng kiểm tra lại thông tin"
    // - Không lưu được CTKM.

    await expect(page.locator(".ant-message")).toContainText(
      /Vui lòng kiểm tra lại thông tin|lỗi/i,
    );
    await expect(page).not.toHaveURL(/.*\/campaign$/);

    // Kiểm tra hiển thị message lỗi dưới các trường (Ant Design validation text)
    const nameFieldError = page.getByText(
      "Giờ bắt đầu phải sớm hơn giờ kết thúc",
    );
    await expect(nameFieldError.first()).toBeVisible();
  });
});
