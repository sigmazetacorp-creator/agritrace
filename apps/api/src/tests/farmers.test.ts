import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { buildApp } from '../app'
import { PrismaClient } from '@prisma/client'

const app = buildApp()
const prisma = new PrismaClient()

const TEST_PHONE = '+254799000001'

async function cleanTestFarmers() {
  const farmers = await prisma.farmer.findMany({ where: { phone: TEST_PHONE } })
  const ids = farmers.map((f: { id: string }) => f.id)
  if (ids.length === 0) return
  const farms = await prisma.farm.findMany({ where: { farmerId: { in: ids } } })
  const farmIds = farms.map((f: { id: string }) => f.id)
  await prisma.harvest.deleteMany({ where: { farmId: { in: farmIds } } })
  await prisma.farm.deleteMany({ where: { farmerId: { in: ids } } })
  await prisma.farmer.deleteMany({ where: { id: { in: ids } } })
}

beforeAll(async () => {
  await app.ready()
  await cleanTestFarmers()   // remove any leftover data from prior runs
})

afterAll(async () => {
  await cleanTestFarmers()
  await prisma.$disconnect()
  await app.close()
})

describe('POST /api/farmers', () => {
  it('creates a farmer and returns 201', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/farmers',
      payload: {
        phone: TEST_PHONE,
        name: 'Test Farmer',
        village: 'Test Village',
        district: 'Test District',
      },
    })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.id).toBeTruthy()
    expect(body.phone).toBe(TEST_PHONE)
    expect(body.name).toBe('Test Farmer')
    expect(body.country).toBe('KE')
  })

  it('returns 500 on duplicate phone (unique constraint)', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/farmers',
      payload: {
        phone: TEST_PHONE,
        name: 'Duplicate Farmer',
        village: 'Somewhere',
        district: 'Somewhere',
      },
    })
    expect(res.statusCode).toBe(500)
  })
})

describe('GET /api/farmers', () => {
  it('returns an array', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/farmers' })
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.json())).toBe(true)
  })

  it('each farmer has farms array', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/farmers' })
    const farmers = res.json()
    farmers.forEach((f: any) => {
      expect(Array.isArray(f.farms)).toBe(true)
    })
  })
})

describe('GET /api/farmers/:id', () => {
  it('returns 404 for unknown id', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/farmers/nonexistent-id' })
    expect(res.statusCode).toBe(404)
  })

  it('returns farmer with nested farms for valid id', async () => {
    // Get the test farmer we created
    const listRes = await app.inject({ method: 'GET', url: '/api/farmers' })
    const test = listRes.json().find((f: any) => f.phone === TEST_PHONE)
    expect(test).toBeTruthy()

    const res = await app.inject({ method: 'GET', url: `/api/farmers/${test.id}` })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.id).toBe(test.id)
    expect(Array.isArray(body.farms)).toBe(true)
  })
})
