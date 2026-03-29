import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildApp } from '../app'

const app = buildApp()

beforeAll(async () => { await app.ready() })
afterAll(async () => { await app.close() })

describe('Health', () => {
  it('GET /health returns ok', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' })
    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual({ status: 'ok' })
  })
})
