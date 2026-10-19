import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveApiBase } from '../scripts/api-config.ts'
test('production uses the real product API while development keeps its local proxy', () => {
 assert.equal(resolveApiBase(undefined, true), 'https://syrian-menu-api.onrender.com/api/v1')
 assert.equal(resolveApiBase(undefined, false), '/api/v1')
 assert.equal(resolveApiBase('https://product.example/api/v1/', true), 'https://product.example/api/v1')
})
test('rejects production configuration that would send messages to a static host or unsafe API', () => {
 for(const value of ['/api/v1','http://localhost:3001/api/v1','https://example.test','https://name:secret@example.test/api/v1','https://example.test/api/v1?key=secret']) assert.throws(()=>resolveApiBase(value,true))
})
