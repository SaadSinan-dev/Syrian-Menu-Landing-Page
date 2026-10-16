import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveWhatsApp } from '../src/config/contact.ts'
import { dishes, filterDishes, dishPrice, formatPrice } from '../src/data/menu.ts'

const contact = {
  mode: 'placeholder',
  number: '+963 9XX XXX XXX',
  message: 'Hello, I would like a menu for my restaurant.',
}

test('WhatsApp placeholder can be displayed but can never open a chat', () => {
  assert.equal(resolveWhatsApp(contact).number, '+963 9XX XXX XXX')
  assert.equal(resolveWhatsApp(contact).href, undefined)
  assert.equal(resolveWhatsApp({ ...contact, mode: 'live' }).href, undefined)
  for (const number of [
    '+963abc999999999',
    '+963 9XX XXX XXX',
    '',
    '+0123456789',
    '123',
    '+963999999999999999',
  ]) {
    assert.equal(resolveWhatsApp({ ...contact, mode: 'live', number }).href, undefined)
  }
})

test('WhatsApp visibility modes hide the temporary number before launch', () => {
  assert.equal(resolveWhatsApp({ ...contact, mode: 'hidden' }), null)
  const state = resolveWhatsApp({ ...contact, mode: 'coming-soon' })
  assert.equal(state.label, 'WhatsApp contact coming soon')
  assert.equal(state.number, undefined)
  assert.equal(state.href, undefined)
})

test('Verified E.164 phone creates a correctly encoded professional chat', () => {
  const state = resolveWhatsApp({
    ...contact,
    mode: 'live',
    number: '+963 944 123 456',
    message: 'Hello! A menu for Café & Co.',
  })
  const url = new URL(state.href)
  assert.equal(url.hostname, 'wa.me')
  assert.equal(url.pathname, '/963944123456')
  assert.equal(url.searchParams.get('text'), 'Hello! A menu for Café & Co.')
})

test('Category and bilingual search combine and recover after an empty result', () => {
  assert.equal(filterDishes('all', '').length, dishes.length)
  assert.ok(filterDishes('starters', '').every((dish) => dish.category === 'starters'))
  assert.deepEqual(filterDishes('drinks', 'kebab'), [])
  assert.equal(filterDishes('all', '  KEBAB  ')[0].id, 'aleppo-kebab')
  assert.equal(filterDishes('all', 'كَبَاب')[0].id, 'aleppo-kebab')
  assert.equal(filterDishes('all', 'حمص')[0].id, 'hummus')
  assert.ok(filterDishes('drinks', '').length > 0)
})

test('Dish size choices change the displayed price without changing source data', () => {
  const kebab = dishes.find((dish) => dish.id === 'aleppo-kebab')
  assert.equal(dishPrice(kebab, 'regular'), 38)
  assert.equal(dishPrice(kebab, 'small'), 28)
  assert.equal(dishPrice(kebab, 'large'), 48)
  assert.equal(kebab.price, 38)
})

test('Arabic prices consistently use Arabic numerals regardless of browser locale defaults', () => {
  assert.match(formatPrice(48, 'ar'), /٤٨/)
  assert.ok(formatPrice(48, 'ar').includes('$'))
  assert.equal(formatPrice(48, 'en'), '$48')
})
