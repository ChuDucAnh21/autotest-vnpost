import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { SelectShopPage } from "../../src/pages/select-shop.page";

test("Inspect product list popup", async ({ page }) => {
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
  await page.getByPlaceholder("Tìm và chọn sản phẩm").first().click();
  await page.waitForTimeout(1000);

  console.log("Modals:", await page.locator(".ant-modal:visible").count());
  console.log("Tables:", await page.locator(".ant-table:visible").count());
  console.log("Table rows:", await page.locator(".ant-table-row:visible").count());
  console.log("Checkboxes:", await page.locator(".ant-modal input[type='checkbox']:visible").count());
  console.log("Radios:", await page.locator(".ant-modal input[type='radio']:visible").count());
  console.log("Tree items:", await page.locator(".ant-tree-treenode:visible").count());
  
  // Print some texts inside modal
  const modalText = await page.locator(".ant-modal-content:visible").innerText().catch(() => "No modal");
  console.log("Modal text preview:", modalText.substring(0, 300));
});
