import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { SelectShopPage } from '../../src/pages/select-shop.page';

test('Test clicking checkbox', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(process.env.TEST_USERNAME as string, process.env.TEST_PASSWORD as string);

  const selectShopPage = new SelectShopPage(page);
  await selectShopPage.selectShop('Tổng công ty');

  await page.getByText('Khuyến mãi').click();
  await page.getByText('Danh sách chương trình').click();
  await page.getByRole('button', { name: 'Thêm mới chương trình' }).click();

  await page.getByText('Phạm vi áp dụng').click();
  await page.getByText('Bưu điện tỉnh', { exact: true }).click();

  await page.getByPlaceholder('Tìm kiếm').waitFor({ state: 'visible', timeout: 5000 });
  await page.waitForTimeout(2000);

  // Thử check Cấp Tỉnh!
  const capTinhTitle = page.locator('.rs-column__title').filter({ hasText: 'Cấp Tỉnh' });
  const checkbox = capTinhTitle.locator('.ant-checkbox-inner, .ant-tree-checkbox-inner').first();
  await checkbox.click();
  console.log("Clicked Cấp Tỉnh checkbox!");
  await page.waitForTimeout(2000);
});
