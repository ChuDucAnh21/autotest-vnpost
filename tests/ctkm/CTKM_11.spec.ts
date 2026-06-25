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

  test("CTKM_11: Lưu CTKM khi bỏ trống các trường bắt buộc", async ({
    page,
  }) => {
    // 1. Vào Menu > Khuyến mãi > Danh sách chương trình
    await page.getByText("Khuyến mãi").click();
    await page.getByText("Danh sách chương trình").click();

    // 2. Nhấn "Thêm mới chương trình"
    await page.getByRole("button", { name: "Thêm mới chương trình" }).click();

    // 3. Cố tình bỏ trống trường "Tên chương trình" (trường bắt buộc)
    // await page.getByPlaceholder("Nhập tên chương trình").fill(ctkmName);

    // Điền ĐẦY ĐỦ các trường bắt buộc còn lại
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

    await page.locator("#endTime").fill("31/12/2027");
    await page.keyboard.press("Enter");

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
    // 4. Nhấn "Lưu"
    await page.getByText("Thông tin chung").click();
    await page.getByRole("button", { name: "Lưu", exact: true }).click();

    // Kết quả mong muốn:
    // - Hệ thống hiển thị message "Vui lòng kiểm tra lại thông tin"
    // - Không lưu được CTKM.
    // - Focus đỏ và hiển thị message tại các trường bị lỗi.

    // Kiểm tra toast message cảnh báo
    await expect(page.locator(".ant-message")).toContainText(
      /Vui lòng kiểm tra lại thông tin|lỗi|không thành công/i,
    );

    // Kiểm tra vẫn ở lại màn hình Thêm mới (chưa bị điều hướng về /campaign)
    await expect(page).not.toHaveURL(/.*\/campaign$/);

    // Kiểm tra hiển thị message lỗi của Ant Design dưới trường Tên chương trình
    const nameFieldError = page.getByText("Vui lòng nhập tên chương trình");
    await expect(nameFieldError).toBeVisible();
  });
});
