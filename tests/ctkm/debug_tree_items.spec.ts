import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { SelectShopPage } from "../../src/pages/select-shop.page";

test("Inspect tree items", async ({ page }) => {
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

  await page.locator(".ant-select").nth(3).click();
  await page
    .locator(".ant-select-item-option:visible")
    .filter({ hasText: /danh mục/i })
    .first()
    .click();
  await page.waitForTimeout(500);

  // Click vào TreeSelect danh mục nth(5)
  await page.locator(".ant-select").nth(5).click();
  await page.waitForTimeout(1000);

  // Tìm các node trong cây danh mục thả xuống
  const treeNodes = page.locator(".ant-select-tree-node-content-wrapper, .ant-tree-node-content-wrapper, .ant-select-item-option").filter({ hasText: /\w/ });
  console.log("Tree nodes count:", await treeNodes.count());
  for (let i = 0; i < await treeNodes.count(); i++) {
    console.log(`Node ${i} text:`, await treeNodes.nth(i).innerText(), "class=", await treeNodes.nth(i).getAttribute("class"));
  }
});
