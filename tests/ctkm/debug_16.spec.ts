import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { SelectShopPage } from "../../src/pages/select-shop.page";

test("Test filling Row 1 and creating Row 2", async ({ page }) => {
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

  // Nhập số lượng Mua từ
  await page.locator(".ant-input-number-input").nth(0).fill("2");

  // Click chọn sản phẩm (thử nth(3))
  await page.locator(".ant-select").nth(3).click();
  await page.waitForTimeout(1000);
  const options = page.locator(".ant-select-item-option:visible");
  console.log("Visible options for nth(3):", await options.count());
  if (await options.count() > 0) {
    await options.first().click();
  } else {
    // Nếu nth(3) ko có option, thử nth(2)
    console.log("Trying nth(2)...");
    await page.locator(".ant-select").nth(2).click();
    await page.waitForTimeout(1000);
    console.log("Visible options for nth(2):", await page.locator(".ant-select-item-option:visible").count());
  }

  await page.locator(".ant-input-number-input").nth(1).fill("10000");

  // Click Thêm điều kiện
  await page.getByText("Thêm điều kiện khuyến mãi").click();
  await page.waitForTimeout(1000);

  console.log("New input number count:", await page.locator(".ant-input-number-input").count());
});
