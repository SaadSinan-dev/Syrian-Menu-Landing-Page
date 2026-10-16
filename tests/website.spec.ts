import { test, expect } from '@playwright/test'

test('marketing navigation, official contacts and safe placeholder', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('good taste')
  await page.getByRole('link', { name: 'How it works', exact: true }).first().click()
  await expect(page).toHaveURL(/#how-it-works$/)
  await expect(page.locator('a[href="mailto:syrianmenu@gmail.com"]')).toHaveCount(2)
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0)
  await expect(page.getByText('+963 9XX XXX XXX')).toBeVisible()
  await expect(
    page.locator('a[href="https://www.instagram.com/syrian_menu/"]').first(),
  ).toHaveAttribute('rel', /noopener/)
  expect(
    await page.locator('.table-card canvas').evaluate((element) => element.clientWidth),
  ).toBeLessThanOrEqual(100)
})

test('menu categories, bilingual search, details, size and return', async ({ page }) => {
  await page.goto('/#demo')
  const menu = page.getByTestId('demo-menu')
  await expect(menu).toHaveAttribute('dir', 'rtl')
  await menu.getByRole('button', { name: 'مشروبات', exact: true }).click()
  await expect(menu.locator('.dish-card')).toHaveCount(1)
  await menu.getByRole('button', { name: 'بحث', exact: true }).click()
  await menu.getByRole('searchbox').fill('kebab')
  await expect(menu.getByText('لا توجد أطباق مطابقة')).toBeVisible()
  await menu.getByRole('button', { name: 'عرض كل الأطباق' }).click()
  await expect(menu.locator('.dish-card')).toHaveCount(6)
  await menu.getByRole('button', { name: 'كباب حلبي — عرض التفاصيل', exact: true }).click()
  await expect(menu.getByRole('heading', { name: 'كباب حلبي', exact: true })).toBeFocused()
  await menu.getByRole('radio', { name: 'كبير' }).check()
  await expect(menu.getByTestId('dish-price')).toContainText('٤٨')
  await menu.getByRole('button', { name: 'Switch to English' }).click()
  await expect(menu).toHaveAttribute('dir', 'ltr')
  await expect(menu.getByRole('heading', { name: 'Aleppo kebab' })).toBeVisible()
  await expect(menu.getByTestId('dish-price')).toContainText('$48')
  await menu.getByRole('button', { name: 'Back to menu', exact: true }).click()
  await expect(menu.locator('.dish-card')).toHaveCount(6)
  await page.getByRole('link', { name: 'Back to website' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('good taste')
})

test('featured carousel is manual, filters persist on back and Escape works', async ({ page }) => {
  await page.goto('/#demo')
  const menu = page.getByTestId('demo-menu')
  await menu.getByRole('button', { name: 'عرض فتوش شامي' }).click()
  await expect(menu.locator('.menu-spotlight h3')).toHaveText('فتوش شامي')
  await menu.getByRole('button', { name: 'مقبلات', exact: true }).click()
  await menu.getByRole('button', { name: 'فتوش شامي — عرض التفاصيل', exact: true }).click()
  await page.keyboard.press('Escape')
  await expect(menu.getByRole('button', { name: 'مقبلات', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(menu.locator('.dish-card')).toHaveCount(2)
})

test('browser history supports entering and leaving the demo', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Try the Experience', exact: true }).first().click()
  await expect(page.getByTestId('demo-menu')).toBeVisible()
  await page.goBack()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('good taste')
  await page.goForward()
  await expect(page.getByTestId('demo-menu')).toBeVisible()
})

test('layouts fit small phones, tablet and desktop without errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/', '/#demo']) {
      await page.goto(route)
      await page.evaluate(() => document.fonts.ready)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      expect(
        await page
          .locator('img')
          .evaluateAll((images) =>
            images.every(
              (image) =>
                !(image as HTMLImageElement).complete ||
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      ).toBe(true)
    }
  }
  expect(errors).toEqual([])
})

test('mobile navigation closes on Escape and navigation with reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const toggle = page.getByTestId('navigation-toggle')
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Escape')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(toggle).toBeFocused()
  await toggle.click()
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Contact' })
    .click()
  await expect(page).toHaveURL(/#contact$/)
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
})

test('keyboard skip keeps the demo route and focuses main content', async ({ page }) => {
  await page.goto('/#demo')
  await page.getByRole('link', { name: 'Skip to content' }).focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#demo$/)
  await expect(page.locator('#main-content')).toBeFocused()
})

test('details restore keyboard focus to the originating dish', async ({ page }) => {
  await page.goto('/#demo')
  const menu = page.getByTestId('demo-menu')
  const dish = menu.getByRole('button', { name: 'حمص بالطحينة — عرض التفاصيل', exact: true })
  await dish.click()
  await page.keyboard.press('Escape')
  await expect(dish).toBeFocused()
})
