import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { SelectShopPage } from "../../src/pages/select-shop.page";

test("Dump inputs for combo", async ({ page }) => {
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
  await page.waitForTimeout(1000);

  const inputs = page.locator("input");
  const count = await inputs.count();
  for (let i = 0; i < count; i++) {
    const el = inputs.nth(i);
    const ph = await el.getAttribute("placeholder");
    const type = await el.getAttribute("type");
    const cls = await el.getAttribute("class");
    if (type !== "hidden" && type !== "checkbox" && type !== "radio") {
      console.log(`Input ${i} [${type}] (class: ${cls}): placeholder="${ph}"`);
    }
  }
});
