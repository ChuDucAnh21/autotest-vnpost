import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { SelectShopPage } from "../../src/pages/select-shop.page";

test("Debug clicking product search box", async ({ page }) => {
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

  // Click vào ô Tìm và chọn sản phẩm (click wrapper cha)
  const box = page.locator(".ant-select, .ant-input-affix-wrapper, div").filter({ hasText: "Tìm và chọn sản phẩm" }).last();
  console.log("Clicking box...");
  await box.click({ force: true });
  await page.waitForTimeout(2000);

  // Tìm tất cả popup overlay xuất hiện ngoài body
  const overlays = page.locator("body > div:not(#root):not(#__next)");
  console.log("Overlays count:", await overlays.count());
  for (let i = 0; i < await overlays.count(); i++) {
    const text = await overlays.nth(i).innerText().catch(() => "");
    if (text.trim().length > 0) {
      console.log(`Overlay ${i} text:`, text.substring(0, 500));
    }
  }
});
