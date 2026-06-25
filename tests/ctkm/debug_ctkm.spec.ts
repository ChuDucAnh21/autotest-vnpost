import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { SelectShopPage } from '../../src/pages/select-shop.page';

test('Dump HTML of CTKM form', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(process.env.TEST_USERNAME as string, process.env.TEST_PASSWORD as string);

  const selectShopPage = new SelectShopPage(page);
  await selectShopPage.selectShop('Tổng công ty');

  await page.getByText('Khuyến mãi').click();
  await page.getByText('Danh sách chương trình').click();
  await page.getByRole('button', { name: 'Thêm mới chương trình' }).click();

  // Wait for the form to appear
  await page.locator('.ant-form').first().waitFor();

  // Dump the form HTML to an artifact
  const html = await page.locator('.ant-form').first().innerHTML();
  console.log("HTML length:", html.length);
  
  // We will save this in a file
  const fs = require('fs');
  fs.writeFileSync('form_html.txt', html);
});
