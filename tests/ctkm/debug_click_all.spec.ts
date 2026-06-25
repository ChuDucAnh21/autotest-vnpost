import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { SelectShopPage } from "../../src/pages/select-shop.page";

test("Check row text after clicking product option", async ({ page }) => {
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

  const input = page.getByPlaceholder("Tìm và chọn sản phẩm").first();
  await input.click();
  await page.waitForTimeout(1000);

  // Click vào option sản phẩm
  const option = page.locator("div").filter({ hasText: "SKU124653456" }).first();
  await option.click();
  await page.waitForTimeout(1000);

  const rowText = await page.locator(".ant-form-item").filter({ hasText: "Điều kiện 1:" }).innerText();
  console.log("Row text after click:", rowText);
});
