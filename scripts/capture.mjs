import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

await mkdir('artifacts', { recursive: true })
const browser = await chromium.launch()
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  for (const [name, width, height, route] of [
    ['desktop', 1440, 1000, '/'],
    ['desktop-demo', 1440, 1000, '/#demo'],
    ['mobile', 390, 844, '/'],
    ['mobile-demo', 390, 844, '/#demo'],
  ]) {
    await page.setViewportSize({ width, height })
    await page.goto(`http://127.0.0.1:5180${route}`)
    await page.evaluate(async () => {
      await document.fonts.ready
      await Promise.all(Array.from(document.images, (image) => image.decode().catch(() => {})))
    })
    await page.screenshot({ path: `artifacts/${name}.png`, fullPage: true })
  }
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('http://127.0.0.1:5180/#demo')
  await page.getByTestId('demo-menu').locator('.dish-card').first().getByRole('button').click()
  await page.screenshot({ path: 'artifacts/dish-details.png', fullPage: true })
  console.log(JSON.stringify({ screenshots: 5, browserErrors: errors }, null, 2))
} finally {
  await browser.close()
}
