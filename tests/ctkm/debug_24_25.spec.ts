import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { SelectShopPage } from "../../src/pages/select-shop.page";

test("Inspect category selection structure", async ({ page }) => {
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

  // Chọn "Sản phẩm trong danh mục" tại Select nth(3)
  await page.locator(".ant-select").nth(3).click();
  await page
    .locator(".ant-select-item-option:visible")
    .filter({ hasText: /danh mục/i })
    .first()
    .click();
  await page.waitForTimeout(1000);

  // Dump tất cả selects hiện có trên trang
  const selects = page.locator(".ant-select");
  console.log("Total selects after choosing Category:", await selects.count());
  for (let i = 0; i < await selects.count(); i++) {
    console.log(`Select ${i} text:`, await selects.nth(i).innerText());
  }

  // Dump tất cả inputs hiện có trên form điều kiện
  const inputs = page.locator("input[placeholder]");
  console.log("Total placeholder inputs:", await inputs.count());
  for (let i = 0; i < await inputs.count(); i++) {
    console.log(`Input ${i} placeholder:`, await inputs.nth(i).getAttribute("placeholder"));
  }
});
