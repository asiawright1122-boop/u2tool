import { test, expect } from '@playwright/test';

test.describe('首页测试', () => {
  test('首页加载成功', async ({ page }) => {
    await page.goto('/');
    
    // 检查页面标题 - 支持所有语言
    await expect(page).toHaveTitle(/.+/);
    
    // 检查 Hero 区域
    await expect(page.locator('h1')).toBeVisible();
    
    // 检查导航链接
    await expect(page.getByRole('link', { name: /tools/i }).first()).toBeVisible();
  });

  test('统计数据显示正确', async ({ page }) => {
    await page.goto('/');
    
    // 检查工具数量统计
    await expect(page.getByText(/\d+\+/)).toBeVisible();
    
    // 检查语言数量
    await expect(page.getByText('5', { exact: true }).first()).toBeVisible();
    
    // 检查免费标识
    await expect(page.getByText('100%').first()).toBeVisible();
  });

  test('分类导航可点击', async ({ page }) => {
    await page.goto('/');
    
    // 查找并点击第一个分类
    const categoryLink = page.locator('a[href*="category="]').first();
    await expect(categoryLink).toBeVisible();
    await categoryLink.click();
    
    // 应该导航到工具页面
    await expect(page).toHaveURL(/\/tools/);
  });

  test('热门工具列表显示', async ({ page }) => {
    await page.goto('/');
    
    // 检查热门工具区域
    const popularSection = page.locator('section').filter({ hasText: /popular|热门/i });
    await expect(popularSection).toBeVisible();
    
    // 检查工具卡片
    const toolCards = page.locator('a[href*="/tools/"]');
    expect(await toolCards.count()).toBeGreaterThan(0);
  });
});

test.describe('多语言测试', () => {
  const locales = ['en', 'zh', 'es', 'pt', 'ja'];

  for (const locale of locales) {
    test(`${locale} 语言页面加载成功`, async ({ page }) => {
      const url = locale === 'en' ? '/' : `/${locale}`;
      await page.goto(url);
      
      // 页面应该有标题
      await expect(page).toHaveTitle(/.+/);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
    });
  }

  test('语言切换功能正常', async ({ page }) => {
    await page.goto('/');
    
    // 查找语言切换器
    const langSwitcher = page.locator('button, select, [role="combobox"]').filter({ hasText: /english|中文|language/i }).first();
    
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click();
      // 检查是否有语言选项
      await expect(page.getByText(/中文|español|português|日本語/i).first()).toBeVisible();
    }
  });
});

test.describe('SEO 测试', () => {
  test('首页有正确的 meta 标签', async ({ page }) => {
    await page.goto('/');
    
    // 检查 description
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.+/);
    
    // 检查 viewport
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width/);
  });

  test('robots.txt 可访问', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
  });

  test('sitemap.xml 可访问', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
  });
});
