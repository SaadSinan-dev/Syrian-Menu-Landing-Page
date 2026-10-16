import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

await mkdir('artifacts/upgrade', { recursive: true })
const browser = await chromium.launch()
const errors = []
try {
  for (const language of ['en', 'ar'])
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({
        reducedMotion: 'reduce',
        viewport: { width: 1440, height: 1000 },
      })
      await context.addInitScript(
        ({ language, theme }) => {
          localStorage.setItem('syrian-menu-language', language)
          localStorage.setItem('syrian-menu-theme', theme)
        },
        { language, theme },
      )
      const page = await context.newPage()
      page.on('pageerror', (error) => errors.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text())
      })
      for (const [device, width, height] of [
        ['desktop', 1440, 1000],
        ['mobile', 390, 844],
      ]) {
        await page.setViewportSize({ width, height })
        await page.goto('http://127.0.0.1:5180/')
        await page.evaluate(async () => {
          await document.fonts.ready
          await Promise.all([...document.images].map((image) => image.decode().catch(() => {})))
        })
        await page.screenshot({
          path: `artifacts/upgrade/${language}-${theme}-${device}.png`,
          fullPage: true,
        })
        if (device === 'desktop')
          await page.screenshot({ path: `artifacts/upgrade/${language}-${theme}-hero.png` })
        await page.goto('http://127.0.0.1:5180/#demo')
        await page.evaluate(() => document.fonts.ready)
        await page.screenshot({
          path: `artifacts/upgrade/${language}-${theme}-${device}-demo.png`,
          fullPage: true,
        })
      }
      await context.close()
    }
  console.log(JSON.stringify({ screenshots: 20, browserErrors: errors }))
} finally {
  await browser.close()
}
