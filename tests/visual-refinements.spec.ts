import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('syrian-menu-language', 'en'))
})

test('only the requested photos are removed and four product previews replace the feature photo', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.hero-photo img, .feature-food')).toHaveCount(0)
  await expect(page.locator('.hero-phone .menu-experience')).toBeVisible()
  await expect(page.locator('.photo-caption')).toHaveCount(0)
  await expect(page.locator('.experience-table > img')).toHaveCount(0)
  await expect(page.locator('.feature-preview')).toHaveCount(4)
  await expect(page.locator('.feature-dish-label')).toHaveCount(0)
  await page.locator('#features').scrollIntoViewIfNeeded()
  await expect(page.locator('.feature-preview').last()).toHaveCSS('opacity', '1')
})

test('product previews fit desktop, tablet and mobile layouts', async ({ page }) => {
  await page.goto('/')
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.locator('.feature-preview-grid').scrollIntoViewIfNeeded()
    await expect(page.locator('.feature-preview').last()).toHaveCSS('opacity', '1')
    for (const preview of await page.locator('.feature-preview').all()) {
      const box = await preview.boundingBox()
      expect(box!.x).toBeGreaterThanOrEqual(0)
      expect(box!.x + box!.width).toBeLessThanOrEqual(width)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('complete original logo fits every existing placement and keeps its original colors', async ({ page }) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of ['/', '/#demo']) {
      await page.goto(route)
      const logos = page.locator('.brand-symbol img, .menu-platform img')
      for (const logo of await logos.all()) {
        await expect(logo).toHaveCSS('object-fit', 'contain')
        await expect(logo).toHaveCSS('filter', 'none')
        expect(await logo.evaluate(img => {
          const box = img.getBoundingClientRect()
          const parent = img.parentElement!.getBoundingClientRect()
          return box.left >= parent.left && box.right <= parent.right && box.top >= parent.top && box.bottom <= parent.bottom
        })).toBe(true)
        await expect(logo).toHaveAttribute('src', '/brand/symbol.png')
      }
    }
  }
})

test('reduced motion leaves product previews visible without animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.locator('.feature-preview-grid').scrollIntoViewIfNeeded()
  await expect(page.locator('.feature-preview').last()).toHaveCSS('opacity', '1')
  await expect(page.locator('.feature-dish-label')).toHaveCount(0)
})
