import test from 'node:test'
import assert from 'node:assert/strict'
import { messages, formatMessage } from '../src/i18n/messages.ts'
import { resolvePreferences } from '../src/preferences/settings.ts'

test('invalid saved preferences fall back to English and the system theme', () => {
  assert.deepEqual(resolvePreferences(null, null, true), { language: 'en', theme: 'dark' })
  assert.deepEqual(resolvePreferences('fr', 'invalid', false), { language: 'en', theme: 'light' })
  assert.deepEqual(resolvePreferences('ar', 'light', true), { language: 'ar', theme: 'light' })
  assert.deepEqual(resolvePreferences('en', 'dark', false), { language: 'en', theme: 'dark' })
})

test('English and Arabic dictionaries have complete, nonempty matching content', () => {
  function check(english, arabic, path = '') {
    if (typeof english === 'string') {
      assert.equal(typeof arabic, 'string', path)
      assert.ok(arabic.trim().length > 0, path)
      assert.deepEqual(english.match(/\{\w+\}/g), arabic.match(/\{\w+\}/g), path)
      return
    }
    assert.deepEqual(Object.keys(english), Object.keys(arabic), path)
    for (const key of Object.keys(english)) check(english[key], arabic[key], `${path}.${key}`)
  }
  check(messages.en, messages.ar)
})

test('localized dynamic copy preserves dish names and years', () => {
  assert.equal(formatMessage(messages.ar.menu.show, { dish: 'فتوش شامي' }), 'عرض فتوش شامي')
  assert.equal(
    formatMessage(messages.en.footer.rights, { year: 2026 }),
    '© 2026 SYRIAN MENU. All rights reserved.',
  )
})
