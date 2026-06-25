import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';
import { SelectShopPage } from '../../src/pages/select-shop.page';

test('Dump toast message', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(process.env.TEST_USERNAME as string, process.env.TEST_PASSWORD as string);

  const selectShopPage = new SelectShopPage(page);
  await selectShopPage.selectShop('Tổng công ty');

  await page.getByText('Khuyến mãi').click();
  await page.getByText('Danh sách chương trình').click();
  await page.getByRole('button', { name: 'Thêm mới chương trình' }).click();

  const ctkmName = `CTKM_Test_Toast_${Date.now()}`;
  await page.getByPlaceholder('Nhập tên chương trình').fill(ctkmName);

  await page.getByLabel('Không cài đặt ngày kết thúc').check();
  await page.getByLabel('Không cài đặt khung giờ').check();

  await page.getByText('Theo đơn hàng').click();
  await page.locator('.ant-input-number-input').last().fill('20000');

  await page.getByText('Phạm vi áp dụng').click();
  await page.getByText('Bưu điện tỉnh', { exact: true }).click();
  await page.waitForTimeout(1000);
  await page.locator('.rs-column__title').filter({ hasText: /Cấp/ }).locator('input[type="checkbox"]').first().check({ force: true });

  await page.getByRole('button', { name: 'Lưu', exact: true }).click();

  // Bắt đầu chờ message xuất hiện bằng cách lắng nghe các thay đổi DOM hoặc tìm kiếm theo class thông dụng
  const msg = await page.waitForSelector('.ant-message, .ant-notification, .Toastify', { state: 'visible', timeout: 10000 });
  const html = await msg.evaluate(el => el.outerHTML);
  require('fs').writeFileSync('toast_html.txt', html);
});
