import { test, expect } from '@playwright/test'

for (const language of ['en', 'ar'] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${language}/${theme}: complete site and demo share preferences and fit all widths`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', error => errors.push(error.message))
      await page.addInitScript(({ language, theme }) => {
        localStorage.setItem('syrian-menu-language', language)
        localStorage.setItem('syrian-menu-theme', theme)
      }, { language, theme })
      await page.goto('/')
      await expect(page.locator('html')).toHaveAttribute('lang', language)
      await expect(page.locator('html')).toHaveAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      await expect(page.getByRole('heading', { level: 1 })).toContainText(language === 'ar' ? 'مذاقك' : 'good taste')
      if (language === 'ar') {
        const body = await page.locator('body').innerText()
        expect(body).not.toMatch(/Try the Experience|Coming soon|Your restaurant|Sample menu|Back to top|English|No app to download/i)
        await expect(page.locator('#contact')).toContainText('قريباً')
      }
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await page.evaluate(() => document.fonts.ready)
        await expect(page.getByTestId('cloud-cta')).toBeVisible()
        const box = await page.getByTestId('cloud-cta').boundingBox()
        expect(box!.x).toBeGreaterThanOrEqual(0)
        expect(box!.x + box!.width).toBeLessThanOrEqual(width)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      }
      await page.getByTestId('cloud-cta').click()
      await expect(page).toHaveURL(/#demo$/)
      await expect(page.getByTestId('demo-menu')).toHaveAttribute('lang', language)
      await expect(page.getByTestId('demo-menu')).toHaveAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
      await expect(page.getByTestId('demo-menu').locator('.dish-card')).toHaveCount(6)
      await page.getByTestId('demo-menu').locator('.dish-card').first().getByRole('button').click()
      await expect(page.getByRole('heading', { name: language === 'ar' ? 'كباب حلبي' : 'Aleppo kebab', exact: true })).toBeFocused()
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      }
      await page.reload()
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      await expect(page.getByTestId('demo-menu')).toHaveAttribute('lang', language)
      expect(errors).toEqual([])
    })
  }
}

test('language and theme changes persist across demo navigation, history and reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('/')
  await page.getByTestId('language-toggle').click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
  await page.getByTestId('theme-toggle').click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByTestId('cloud-cta').click()
  await expect(page.getByTestId('demo-menu')).toHaveAttribute('lang', 'ar')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
  await page.getByTestId('demo-menu').getByRole('button', { name: 'التبديل إلى الإنجليزية' }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.getByRole('link', { name: 'Back to website' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('good taste')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('first visit honors system theme before React loads, then honors an explicit choice', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.route('**/src/main.tsx', route => route.abort())
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.unroute('**/src/main.tsx')
  await page.reload()
  await page.getByTestId('theme-toggle').click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
})

test('cloud has a stable keyboard target and stops drifting with reduced motion', async ({ page }) => {
  await page.goto('/')
  const cloud = page.getByTestId('cloud-cta')
  const first = await cloud.boundingBox()
  await page.waitForTimeout(250)
  expect(await cloud.boundingBox()).toEqual(first)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  expect(await cloud.locator('.cloud-body').evaluate(element => getComputedStyle(element).animationName)).toBe('none')
  await cloud.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('demo-menu')).toBeVisible()
})

test('blocked localStorage keeps language and theme controls usable', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage unavailable') } }))
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByTestId('language-toggle').click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
  await page.getByTestId('theme-toggle').click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  expect(errors).toEqual([])
})
