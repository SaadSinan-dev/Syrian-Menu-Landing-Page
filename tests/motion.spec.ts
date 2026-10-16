import { test, expect } from '@playwright/test'

test('hero motion keeps the layout stable and scroll reveals finish visibly', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.hero-line').first()).toHaveCSS('animation-name', 'hero-type-in')
  await expect(page.locator('.cloud-body')).toHaveCSS('animation-name', 'cloud-drift')
  const headerBefore = await page.locator('.header-inner').boundingBox()
  await page.getByRole('link', { name: 'How it works', exact: true }).first().click()
  await expect(page.locator('.steps .step').first()).toHaveCSS('opacity', '1')
  await page.locator('#features').scrollIntoViewIfNeeded()
  await expect(page.locator('.feature-visual')).toHaveClass(/is-revealed/)
  await expect(page.locator('.feature-visual')).toHaveCSS('opacity', '1')
  await expect(page.locator('.feature').last()).toHaveCSS('opacity', '1')
  const headerAfter = await page.locator('.header-inner').boundingBox()
  expect(headerAfter?.width).toEqual(headerBefore?.width)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('reduced motion shows every section without hidden reveal states or motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const selector of ['.hero-line', '.hero-phone', '.cloud-body', '.feature-visual', '.step']) {
    const element = page.locator(selector).first()
    await expect(element).toHaveCSS('animation-name', 'none')
    await expect(element).toHaveCSS('opacity', '1')
  }
  await page.getByTestId('cloud-cta').click()
  await expect(page.getByTestId('demo-menu')).toBeVisible()
  await page.getByTestId('demo-menu').locator('.dish-card').first().getByRole('button').click()
  await expect(page.locator('.dish-detail')).toHaveCSS('animation-name', 'none')
  await expect(page.locator('.dish-detail')).toHaveCSS('opacity', '1')
})

test('menu transitions preserve category focus and immediate dish interaction', async ({
  page,
}) => {
  await page.goto('/#demo')
  const menu = page.getByTestId('demo-menu')
  const category = menu.getByRole('button', { name: 'Starters', exact: true })
  await category.click()
  await expect(category).toBeFocused()
  await expect(menu.locator('.dish-card')).toHaveCount(2)
  await menu.getByRole('button', { name: 'Hummus & tahini — View details', exact: true }).click()
  await expect(menu.getByRole('heading', { name: 'Hummus & tahini', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(
    menu.getByRole('button', { name: 'Hummus & tahini — View details', exact: true }),
  ).toBeFocused()
  await expect(category).toHaveAttribute('aria-pressed', 'true')
})
