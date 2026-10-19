import { test, expect } from '@playwright/test'

test('new visits remain Arabic/light when the device theme changes; contact fills the viewport', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.contact-form')).toHaveCount(0)
  await expect(page.locator('form')).toHaveCount(1)
  await expect(page.locator('#free-trial .trial-form')).toHaveCount(1)
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.emulateMedia({ colorScheme: 'light' })
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  for (const language of ['ar', 'en']) {
    if (language === 'en') await page.getByTestId('language-toggle').click()
    for (const theme of ['light', 'dark']) {
      if (await page.locator('html').getAttribute('data-theme') !== theme) await page.getByTestId('theme-toggle').click()
      for (const width of [320, 390, 768, 1440, 1920]) {
        await page.setViewportSize({ width, height: 1000 })
        await page.locator('#contact').scrollIntoViewIfNeeded()
        const box = await page.locator('#contact').boundingBox()
        expect(box!.x).toBe(0)
        expect(box!.width).toBe(width)
        for (const field of await page.locator('.contact-row').all()) {
          const box = await field.boundingBox()
          expect(box!.x).toBeGreaterThanOrEqual(0)
          expect(box!.x + box!.width).toBeLessThanOrEqual(width)
          expect(box!.height).toBeGreaterThanOrEqual(44)
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        if ([390, 1440].includes(width)) await page.screenshot({ path: `artifacts/contact/${language}-${theme}-${width}.png`, fullPage: width === 390 })
      }
    }
  }
})

