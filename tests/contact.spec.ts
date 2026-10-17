import { test, expect, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'

const runtime = process.env.TRIAL_RUNTIME_FILE ? JSON.parse(readFileSync(process.env.TRIAL_RUNTIME_FILE, 'utf8')) : null
async function fill(page: Page, subject = 'Question about our menu') {
  for (const [field, value] of Object.entries({ name: 'زائر الموقع', email: 'visitor@example.test', phone: '+963 944 123 456', subject, message: 'مرحبا، أود معرفة المزيد.\n<script>alert("unsafe")</script>' }))
    await page.locator(`#contact-${field}`).fill(value)
}

test('new visits remain Arabic/light when the device theme changes; contact fills the viewport', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' })
  await page.goto('/')
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
        for (const field of await page.locator('.contact-form .trial-field input,.contact-form textarea').all()) {
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

test('client validation blocks invalid delivery and focuses the first invalid field', async ({ page }) => {
  let sent = 0
  page.on('request', request => { if (request.url().includes('/public/contact-messages')) sent++ })
  await page.goto('/')
  await page.locator('.contact-submit').click()
  await expect(page.locator('#contact-name')).toBeFocused()
  await expect(page.locator('#contact-name-error')).toHaveText('يرجى إكمال هذا الحقل.')
  await fill(page)
  await page.locator('#contact-email').fill('invalid')
  await page.locator('#contact-phone').fill('---')
  await page.locator('.contact-submit').click()
  await expect(page.locator('#contact-email')).toBeFocused()
  await expect(page.locator('#contact-phone')).toHaveAttribute('aria-invalid', 'true')
  expect(sent).toBe(0)
})

test('failure, malformed success, field errors and throttling never show delivery success or discard input', async ({ page }) => {
  const ids: string[] = []
  let status = 503, result: object = { code: 'DATABASE_UNAVAILABLE' }
  await page.route('**/public/contact-messages', route => {
    ids.push(route.request().postDataJSON().clientId)
    return route.fulfill({ status, json: result })
  })
  await page.goto('/')
  await fill(page)
  await page.locator('.contact-submit').click()
  await expect(page.locator('.contact-feedback')).toContainText('تعذّر تأكيد الإرسال')
  status = 200; result = {}
  await page.locator('.contact-submit').click()
  await expect.poll(() => ids.length).toBe(2)
  await expect(page.locator('.contact-success')).toHaveCount(0)
  expect(ids[0]).toBe(ids[1])
  await page.getByTestId('language-toggle').click()
  await expect(page.locator('.contact-feedback')).toContainText('We could not confirm delivery')
  status = 400; result = { fields: { email: ['Invalid email'] } }
  await page.locator('.contact-submit').click()
  await expect(page.locator('#contact-email')).toBeFocused()
  status = 429; result = { code: 'RATE_LIMITED' }
  await page.locator('.contact-submit').click()
  await expect(page.locator('.contact-feedback')).toContainText('Wait one minute')
  await expect(page.locator('#contact-name')).toHaveValue('زائر الموقع')
  await expect(page.locator('.contact-success')).toHaveCount(0)
})

test('real website message persists once, appears in Admin and retains its updated status after reload', async ({ page, browser }) => {
  test.setTimeout(90000)
  test.skip(!runtime, 'Requires the owned disposable product runtime; successful delivery is never mocked.')
  const settings = JSON.parse(readFileSync(runtime.settingsFile, 'utf8'))
  const subject = `Website contact ${crypto.randomUUID()}`
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(runtime.site)
  await fill(page, subject)
  let release!: () => void
  const gate = new Promise<void>(resolve => { release = resolve })
  let sent = 0
  await page.route('**/public/contact-messages', async route => { sent++; await gate; await route.continue() })
  await page.locator('.contact-submit').click()
  await expect(page.locator('.contact-submit')).toBeDisabled()
  await page.locator('.contact-form').evaluate((form: HTMLFormElement) => form.requestSubmit())
  expect(sent).toBe(1)
  release()
  await expect(page.locator('.contact-success')).toContainText('تم استلام رسالتك')
  await page.reload()
  await fill(page, subject)
  await page.locator('.contact-submit').click()
  await expect(page.locator('.contact-success')).toBeVisible()
  const context = await browser.newContext()
  const login = await context.request.post(`${runtime.api}/auth/login`, { headers: { Origin: runtime.admin }, data: { email: settings.SEED_ADMIN_EMAIL, password: settings.SEED_ADMIN_PASSWORD } })
  expect(login.status()).toBe(200)
  const inbox = await context.request.get(`${runtime.api}/admin/support?kind=CONTACT`)
  const records = (await inbox.json()).data.filter((row: { contact?: { subject: string } }) => row.contact?.subject === subject)
  expect(records).toHaveLength(1)
  const admin = await context.newPage()
  admin.on('pageerror', error => errors.push(error.message))
  await admin.goto(`${runtime.admin}/support?kind=CONTACT`)
  await admin.getByRole('link').filter({ hasText: subject }).click()
  await expect(admin.locator('.support-contact-details')).toContainText('visitor@example.test')
  await expect(admin.locator('.support-contact-details')).toContainText('+963 944 123 456')
  await expect(admin.getByRole('log')).toContainText('<script>alert("unsafe")</script>')
  await expect(admin.locator('.support-internal-notice')).toContainText('internal')
  await admin.locator('#contact-status').selectOption('IN_PROGRESS')
  await admin.getByRole('button', { name: 'Update status', exact: true }).click()
  await expect(admin.getByRole('status').filter({ hasText: 'Status saved.' })).toBeVisible()
  await admin.reload()
  await expect(admin.locator('#contact-status')).toHaveValue('IN_PROGRESS')
  const persisted = await context.request.get(`${runtime.api}/admin/support/${records[0].id}`)
  expect((await persisted.json()).conversation.contact.status).toBe('IN_PROGRESS')
  await admin.screenshot({ path: 'artifacts/contact/admin-message-desktop.png', fullPage: true })
  await admin.setViewportSize({ width: 390, height: 844 })
  expect(await admin.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await admin.screenshot({ path: 'artifacts/contact/admin-message-mobile.png', fullPage: true })
  expect(errors).toEqual([])
  await context.close()
})
