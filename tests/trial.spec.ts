import { test, expect, type Page } from '@playwright/test'
import { readFileSync } from 'node:fs'

const runtime = process.env.TRIAL_RUNTIME_FILE
  ? JSON.parse(readFileSync(process.env.TRIAL_RUNTIME_FILE, 'utf8'))
  : null
async function fill(page: Page, restaurantName = 'Trial kitchen') {
  for (const [field, value] of Object.entries({
    restaurantName,
    applicantName: 'Samir عربي',
    email: 'samir@example.test',
    phone: '+963 944 123 456',
    message: 'Please help us share our menu.',
  }))
    await page.locator(`#trial-${field}`).fill(value)
}

test('trial validation focuses the first field and prevents invalid delivery', async ({ page }) => {
  let requests = 0
  page.on('request', (request) => {
    if (request.url().includes('/public/trial-applications')) requests++
  })
  await page.goto('/')
  await page.locator('.trial-submit').click()
  await expect(page.locator('#trial-restaurantName')).toBeFocused()
  await expect(page.locator('#trial-restaurantName-error')).toHaveText(
    'Please complete this field.',
  )
  await fill(page)
  await page.locator('#trial-email').fill('invalid')
  await page.locator('#trial-phone').fill('---')
  await page.locator('.trial-submit').click()
  await expect(page.locator('#trial-email')).toBeFocused()
  await expect(page.locator('#trial-phone')).toHaveAttribute('aria-invalid', 'true')
  expect(requests).toBe(0)
})

test('server failures retain input, use the same retry ID and remain localized across switches', async ({
  page,
}) => {
  const bodies: { clientId: string }[] = []
  await page.route('**/public/trial-applications', async (route) => {
    bodies.push(route.request().postDataJSON())
    await route.fulfill({ status: 503, json: { code: 'DATABASE_UNAVAILABLE' } })
  })
  await page.goto('/')
  await fill(page)
  await page.locator('.trial-submit').click()
  await expect(page.locator('.trial-feedback')).toContainText('We could not confirm delivery')
  await expect(page.locator('.trial-success')).toHaveCount(0)
  await page.getByTestId('language-toggle').click()
  await page.getByTestId('theme-toggle').click()
  await expect(page.locator('#trial-title')).toHaveText('انضم إلينا مجاناً لمدة 7 أيام')
  await expect(page.locator('.trial-feedback')).toContainText('تعذّر تأكيد')
  await expect(page.locator('#trial-applicantName')).toHaveValue('Samir عربي')
  await page.locator('.trial-submit').click()
  await expect.poll(() => bodies.length).toBe(2)
  expect(bodies[0].clientId).toBe(bodies[1].clientId)
  await expect(page.locator('#trial-email')).toHaveValue('samir@example.test')
})

test('server validation and rate limits provide useful feedback without losing input', async ({
  page,
}) => {
  await page.goto('/')
  await fill(page)
  await page.route('**/public/trial-applications', (route) =>
    route.fulfill({ status: 400, json: { fields: { email: ['Invalid email'] } } }),
  )
  await page.locator('.trial-submit').click()
  await expect(page.locator('#trial-email')).toBeFocused()
  await expect(page.locator('#trial-email-error')).toHaveText('Enter a valid email address.')
  await page.unroute('**/public/trial-applications')
  await page.route('**/public/trial-applications', (route) =>
    route.fulfill({ status: 429, json: { code: 'RATE_LIMITED' } }),
  )
  await page.locator('.trial-submit').click()
  await expect(page.locator('.trial-feedback')).toContainText('Wait one minute')
  await expect(page.locator('#trial-message')).toHaveValue('Please help us share our menu.')
})

test('trial section fits mobile, tablet and desktop in both languages and themes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  for (const language of ['en', 'ar']) {
    if (language === 'ar') await page.getByTestId('language-toggle').click()
    for (const theme of ['light', 'dark']) {
      if ((await page.locator('html').getAttribute('data-theme')) !== theme)
        await page.getByTestId('theme-toggle').click()
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 })
        await page.locator('#free-trial').scrollIntoViewIfNeeded()
        for (const field of await page.locator('.trial-field input,.trial-field textarea').all()) {
          const box = await field.boundingBox()
          expect(box!.x).toBeGreaterThanOrEqual(0)
          expect(box!.x + box!.width).toBeLessThanOrEqual(width)
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        )
        if (width !== 320)
          await page.screenshot({
            path: `artifacts/refinements/trial-${language}-${theme}-${width}.png`,
          })
      }
    }
  }
})

test('real website submission persists once and appears in the unchanged Admin Support interface', async ({
  page,
  browser,
}) => {
  test.setTimeout(60000)
  test.skip(
    !runtime,
    'Set TRIAL_RUNTIME_FILE to the owned disposable runtime for real delivery verification.',
  )
  const settings = JSON.parse(readFileSync(runtime.settingsFile, 'utf8'))
  const name = `Website trial ${crypto.randomUUID()}`
  let sent = 0
  let release!: () => void
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/public/trial-applications', async (route) => {
    sent++
    await gate
    await route.continue()
  })
  await page.goto(runtime.site)
  await fill(page, name)
  await page.locator('.trial-submit').click()
  await expect(page.locator('.trial-submit')).toBeDisabled()
  await expect(page.locator('.trial-submit')).toContainText('Sending')
  await page.locator('.trial-form').evaluate((element: HTMLFormElement) => element.requestSubmit())
  expect(sent).toBe(1)
  release()
  await expect(page.locator('.trial-success')).toContainText('Your application is with our team.')
  await expect(page.locator('#trial-restaurantName')).toBeDisabled()
  // A new browser attempt uses a new request ID; server-side content deduplication still applies.
  await page.reload()
  await fill(page, name)
  await page.locator('.trial-submit').click()
  await expect(page.locator('.trial-success')).toBeVisible()
  const context = await browser.newContext()
  const admin = await context.newPage()
  const login = await context.request.post(`${runtime.api}/auth/login`, {
    headers: { Origin: runtime.admin },
    data: { email: settings.SEED_ADMIN_EMAIL, password: settings.SEED_ADMIN_PASSWORD },
  })
  expect(login.status()).toBe(200)
  const inbox = await context.request.get(`${runtime.api}/admin/support`)
  const records = (await inbox.json()).data.filter(
    (row: { restaurantName: string }) => row.restaurantName === name,
  )
  expect(records).toHaveLength(1)
  expect(records[0].restaurantId).toBeNull()
  await admin.goto(`${runtime.admin}/support`)
  await expect(admin.getByRole('heading', { name: 'Support inbox', exact: true })).toBeVisible()
  await admin.getByRole('link').filter({ hasText: name }).click()
  const log = admin.getByRole('log')
  await expect(log).toContainText('Seven-day free-trial application')
  await expect(log).toContainText('samir@example.test')
  await expect(log).toContainText('+963 944 123 456')
  await expect(log).toContainText('Please help us share our menu.')
  await expect(log.locator('time')).toHaveCount(1)
  await admin.screenshot({
    path: 'artifacts/refinements/real-trial-admin-support.png',
    fullPage: true,
  })
  await context.close()
})
