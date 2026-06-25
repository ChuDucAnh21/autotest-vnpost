import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { SelectShopPage } from "../../src/pages/select-shop.page";

test("Test explicit selection of condition type in Row 1 & Row 2", async ({ page }) => {
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
  await page.waitForTimeout(500);

  // Row 1
  await page.locator(".ant-input-number-input").nth(0).fill("2");
  // Select 3: Loại điều kiện
  await page.locator(".ant-select").nth(3).click();
  await page.locator(".ant-select-item-option:visible").filter({ hasText: /^Sản phẩm$/i }).first().click();
  // Select 4: Chọn SP
  await page.locator(".ant-select").nth(4).click();
  await page.locator(".ant-select-item-option:visible").first().click();
  await page.locator(".ant-input-number-input").nth(1).fill("10000");

  // Thêm điều kiện
  await page.getByText("Thêm điều kiện khuyến mãi").click();
  await page.waitForTimeout(500);

  // Row 2
  await page.locator(".ant-input-number-input").nth(2).fill("2");
  // Select 5: Loại điều kiện Row 2
  await page.locator(".ant-select").nth(5).click();
  await page.locator(".ant-select-item-option:visible").filter({ hasText: /^Sản phẩm$/i }).first().click();
  // Select 6: Chọn SP Row 2
  await page.locator(".ant-select").nth(6).click();
  await page.locator(".ant-select-item-option:visible").first().click();
  await page.locator(".ant-input-number-input").nth(3).fill("10000");

  console.log("SUCCESSFULLY FILLED ROW 1 & ROW 2!");
});
