import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('syrian-menu-language', 'en'))
})

test('only the requested photos are removed and four product previews replace the feature photo', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.hero-photo img, .feature-food')).toHaveCount(0)
  await expect(page.locator('.hero-phone .menu-experience')).toBeVisible()
  await expect(page.locator('.photo-caption')).toContainText('ROOTED IN HOSPITALITY.')
  await expect(page.locator('.experience-table > img')).toHaveAttribute('src', '/images/fattoush.webp')
  await expect(page.locator('.feature-preview')).toHaveCount(4)
  await expect(page.locator('.feature-dish-label')).toContainText('Aleppo kebab')
  await page.locator('#features').scrollIntoViewIfNeeded()
  await expect(page.locator('.feature-preview').last()).toHaveCSS('opacity', '1')
})

test('invoice hover preserves layout and has space around it at desktop, tablet and mobile sizes', async ({ page }) => {
  await page.goto('/')
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.locator('.feature-dish-label').scrollIntoViewIfNeeded()
    await expect(page.locator('.feature-visual')).toHaveCSS('opacity', '1')
    await expect(page.locator('.feature-preview').last()).toHaveCSS('opacity', '1')
    await page.mouse.move(0, 0)
    await expect(page.locator('.feature-dish-label')).toHaveCSS('transform', 'none')
    const before = await page.locator('.feature-preview-grid').boundingBox()
    await page.locator('.feature-dish-label').hover()
    await expect(page.locator('.feature-dish-label')).toHaveCSS('transform', 'matrix(1.025, 0, 0, 1.025, 0, 0)')
    const invoice = await page.locator('.feature-dish-label').boundingBox()
    const after = await page.locator('.feature-preview-grid').boundingBox()
    expect(after).toEqual(before)
    expect(invoice!.y).toBeGreaterThan(after!.y + after!.height + 10)
    expect(invoice!.x).toBeGreaterThanOrEqual(0)
    expect(invoice!.x + invoice!.width).toBeLessThanOrEqual(width)
    const columns = await page.locator('.feature-preview-grid').evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length)
    expect(columns).toBe(2)
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

test('touch and reduced motion keep the invoice at its original size', async ({ browser }) => {
  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })
  const touchPage = await touch.newPage()
  await touchPage.goto('/')
  await touchPage.locator('.feature-dish-label').tap()
  await expect(touchPage.locator('.feature-dish-label')).toHaveCSS('transform', 'none')
  await touch.close()
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('/')
  await page.locator('.feature-dish-label').hover()
  await expect(page.locator('.feature-dish-label')).toHaveCSS('transform', 'none')
  await expect(page.locator('.feature-dish-label')).toHaveCSS('transition-duration', '0s')
  await expect(page.locator('.feature-preview').last()).toHaveCSS('opacity', '1')
  await context.close()
})
