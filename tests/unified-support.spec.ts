import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
const runtime = process.env.TRIAL_RUNTIME_FILE ? JSON.parse(readFileSync(process.env.TRIAL_RUNTIME_FILE, 'utf8')) : null

test('the sole trial form delivers once to searchable Support and retains its updated status', async ({ page, browser }) => {
  test.setTimeout(90000)
  test.skip(!runtime, 'Requires owned disposable backend and PostgreSQL')
  const marker = crypto.randomUUID()
  await page.addInitScript(() => localStorage.setItem('syrian-menu-language', 'en'))
  await page.goto(runtime.site)
  await expect(page.locator('.contact-form')).toHaveCount(0)
  await expect(page.locator('form')).toHaveCount(1)
  async function fill() {
    for (const [name, value] of Object.entries({ restaurantName: `Trial ${marker}`, applicantName: 'Applicant', email: 'unified@example.test', phone: '+1 202 555 0123', message: 'Please review our request' })) await page.locator(`#trial-${name}`).fill(value)
  }
  await fill()
  await page.locator('#free-trial .trial-submit').click()
  await expect(page.locator('#free-trial .trial-success')).toBeVisible()
  await page.reload()
  await fill()
  await page.locator('#free-trial .trial-submit').click()
  await expect(page.locator('#free-trial .trial-success')).toBeVisible()
  const settings = JSON.parse(readFileSync(runtime.settingsFile, 'utf8'))
  const context = await browser.newContext()
  expect((await context.request.post(`${runtime.api}/auth/login`, { headers: { Origin: runtime.admin }, data: { email: settings.SEED_ADMIN_EMAIL, password: settings.SEED_ADMIN_PASSWORD } })).status()).toBe(200)
  const admin = await context.newPage()
  await admin.goto(`${runtime.admin}/support?q=${marker}&kind=TRIAL`)
  await expect(admin.locator('.support-inbox-row')).toHaveCount(1)
  await admin.locator('.support-inbox-row').click()
  await expect(admin.locator('.support-contact-details')).toContainText('unified@example.test')
  await expect(admin.getByRole('log')).toContainText('Please review our request')
  await admin.locator('#contact-status').selectOption('RESOLVED')
  await admin.getByRole('button', { name: 'Update status', exact: true }).click()
  await expect(admin.getByRole('status').filter({ hasText: 'Status saved.' })).toBeVisible()
  await admin.reload()
  await expect(admin.locator('#contact-status')).toHaveValue('RESOLVED')
  await context.close()
})
