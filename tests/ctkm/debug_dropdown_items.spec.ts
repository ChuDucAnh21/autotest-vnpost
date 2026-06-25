import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { SelectShopPage } from "../../src/pages/select-shop.page";

test("Inspect product list options", async ({ page }) => {
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

  // Click vào input Tìm và chọn sản phẩm
  const input = page.getByPlaceholder("Tìm và chọn sản phẩm").first();
  await input.click();
  await page.waitForTimeout(1000);

  console.log("Dropdowns:", await page.locator(".ant-select-dropdown:visible").count());
  console.log("Select options:", await page.locator(".ant-select-item-option:visible").count());
  console.log("Tree nodes:", await page.locator(".ant-tree-node-content-wrapper:visible").count());
  console.log("Any visible overlay text:", await page.locator(".ant-select-dropdown:visible").innerText().catch(() => "No dropdown"));
});
