import { test, expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login.page";
import { SelectShopPage } from "../../src/pages/select-shop.page";

test("Dump buttons", async ({ page }) => {
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

  // Đợi trang load xong
  await page.waitForTimeout(3000);

  // Lấy danh sách tất cả các button và in ra text
  const html = await page.evaluate(() => {
    const btns = document.querySelectorAll("button");
    let res: {
      text: string;
      className: string;
      type: "button" | "submit" | "reset";
      html: string;
    }[] = [];
    btns.forEach((b) =>
      res.push({
        text: b.innerText.trim(),
        className: b.className,
        type: b.type,
        html: b.outerHTML,
      }),
    );
    return JSON.stringify(res, null, 2);
  });

  const fs = require("fs");
  fs.writeFileSync("buttons.json", html);
});
