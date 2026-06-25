import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { SelectShopPage } from "../../src/pages/select-shop.page";

test("Inspect combo popup items", async ({ page }) => {
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

  // Chọn Combo sản phẩm
  await page.locator(".ant-select").nth(3).click();
  await page.locator(".ant-select-item-option:visible").filter({ hasText: /Combo sản phẩm/i }).first().click();
  await page.waitForTimeout(500);

  // Tìm input hoặc box tìm kiếm combo
  const searchInputs = page.locator("input[placeholder*='Tìm'], input[placeholder*='chọn']");
  console.log("Found search inputs:", await searchInputs.count());
  for (let i = 0; i < await searchInputs.count(); i++) {
    console.log(`Input ${i} placeholder:`, await searchInputs.nth(i).getAttribute("placeholder"));
  }

  await searchInputs.last().click();
  await page.waitForTimeout(1500);

  // In ra toàn bộ text trong dropdown
  const dropdown = page.locator(".ant-select-dropdown:visible, .ant-picker-dropdown:visible, .ant-popover:visible, div[class*='popup']:visible").last();
  console.log("Dropdown outerHTML preview:", await dropdown.evaluate(el => el.outerHTML).catch(() => "None"));
});
