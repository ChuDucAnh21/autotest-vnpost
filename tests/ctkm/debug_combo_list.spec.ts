import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { SelectShopPage } from "../../src/pages/select-shop.page";

test("Dump combo popup text", async ({ page }) => {
  test.setTimeout(60000);
  const loginPage = new LoginPage(page);
  await loginPage.login(
    process.env.TEST_USERNAME as string,
    process.env.TEST_PASSWORD as string,
  );

  const selectShopPage = new SelectShopPage(page);
  await selectShopPage.selectShop("Tổng công ty");

  await page.getByText("Khuyến mãi").click();
  await page.getByText("Danh sách chương trình").click();
  await page.getByRole("button", { name: "Thêm mới chương trình" }).click();

  await page.getByText("Theo sản phẩm").click();
  await page.waitForTimeout(1000);

  // Chọn Combo sản phẩm ở Row 1
  await page.locator(".ant-select").nth(3).click();
  await page.locator(".ant-select-item-option:visible").filter({ hasText: /Combo sản phẩm/i }).first().click();
  await page.waitForTimeout(500);

  // Click ô Tìm và chọn
  await page.getByPlaceholder(/Tìm và chọn/i).first().click();
  await page.waitForTimeout(1500);

  // Chụp ảnh lại xem khi chọn combo hiển thị gì
  await page.screenshot({ path: "C:/Users/ASUS TUF Gaming/.gemini/antigravity/brain/ee87edcb-377e-41ad-8599-f5a1cdb8bb88/combo_popup.png" });
});
