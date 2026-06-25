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

  test("CTKM_15: Lưu CTKM khi không chọn phạm vi áp dụng", async ({ page }) => {
    // 1. Vào Menu > Khuyến mãi > Danh sách chương trình
    await page.getByText("Khuyến mãi").click();
    await page.getByText("Danh sách chương trình").click();

    // 2. Nhấn "Thêm mới chương trình"
    await page.getByRole("button", { name: "Thêm mới chương trình" }).click();

    // 3. Nhập tên chương trình chưa tồn tại
    const ctkmName = `CTKM_Test_${Date.now()}`;
    await page.getByPlaceholder("Nhập tên chương trình").fill(ctkmName);

    // 4. Điền đầy đủ thông tin hợp lệ khác
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

    // 6. Nhập giờ bắt đầu: 15:00
    await page.locator("#startTimeFrame").fill("06:00");

    // 7. Nhập giờ kết thúc trước giờ bắt đầu: 06:00
    await page.locator("#endTimeFrame").fill("15:00");

    await page.getByText("Theo đơn hàng").click();
    const discountInput = page.locator(".ant-input-number-input").last();
    await discountInput.fill("50000");

    // 5. Cố tình KHÔNG chọn phạm vi áp dụng (bỏ qua tab Phạm vi áp dụng)

    // Nhấn "Lưu"
    await page.getByRole("button", { name: "Lưu", exact: true }).click();

    // Kết quả mong muốn:
    // - Hiển thị toast message lỗi "Vui lòng chọn ít nhất một phạm vi áp dụng"
    // - Không lưu được CTKM.

    await expect(page.locator(".ant-message")).toContainText(
      /Vui lòng chọn phạm vi áp dụng|lỗi|không thành công/i,
    );
    await expect(page).not.toHaveURL(/.*\/campaign$/);
  });
});
