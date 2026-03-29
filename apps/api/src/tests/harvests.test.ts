import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildApp } from '../app'
import { PrismaClient } from '@prisma/client'

const app = buildApp()
const prisma = new PrismaClient()

let testFarmId: string
let testFarmerId: string

beforeAll(async () => {
  await app.ready()

  // Create a test farmer + farm
  const farmer = await prisma.farmer.create({
    data: {
      phone: '+254799000002',
      name: 'Harvest Test Farmer',
      village: 'Test',
      district: 'Test',
    },
  })
  testFarmerId = farmer.id

  const farm = await prisma.farm.create({
    data: {
      farmerId: farmer.id,
      name: 'Test Farm',
      sizeHectares: 1.0,
      cropTypes: ['Maize'],
    },
  })
  testFarmId = farm.id
})

afterAll(async () => {
  if (testFarmId) await prisma.harvest.deleteMany({ where: { farmId: testFarmId } })
  if (testFarmId) await prisma.farm.delete({ where: { id: testFarmId } })
  if (testFarmerId) await prisma.farmer.delete({ where: { id: testFarmerId } })
  await prisma.$disconnect()
  await app.close()
})

describe('POST /api/harvests', () => {
  it('creates harvest and returns 201 with qrCode', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/harvests',
      payload: {
        farmId: testFarmId,
        cropType: 'Maize',
        quantityKg: 500,
        harvestDate: '2026-03-29',
        qualityGrade: 'A',
      },
    })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.id).toBeTruthy()
    expect(body.qrCode).toMatch(/^AGT-\d+$/)
    expect(body.cropType).toBe('Maize')
    expect(body.quantityKg).toBe(500)
  })

  it('creates harvest without optional fields', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/harvests',
      payload: {
        farmId: testFarmId,
        cropType: 'Beans',
        quantityKg: 120,
        harvestDate: '2026-03-28',
      },
    })
    expect(res.statusCode).toBe(201)
    const body = res.json()
    expect(body.qualityGrade).toBeNull()
    expect(body.blockchainTxHash).toBeNull() // starts null, written async
  })
})

describe('GET /api/harvests', () => {
  it('returns array of harvests with farm+farmer nested', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/harvests' })
    expect(res.statusCode).toBe(200)
    const harvests = res.json()
    expect(Array.isArray(harvests)).toBe(true)
    expect(harvests.length).toBeGreaterThan(0)

    const h = harvests[0]
    expect(h.farm).toBeTruthy()
    expect(h.farm.farmer).toBeTruthy()
  })
})

describe('GET /api/harvests/qr/:qrCode', () => {
  it('returns harvest for valid QR code', async () => {
    // Create one and look it up
    const createRes = await app.inject({
      method: 'POST',
      url: '/api/harvests',
      payload: {
        farmId: testFarmId,
        cropType: 'Sorghum',
        quantityKg: 200,
        harvestDate: '2026-03-27',
      },
    })
    const { qrCode } = createRes.json()

    const res = await app.inject({ method: 'GET', url: `/api/harvests/qr/${qrCode}` })
    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(body.qrCode).toBe(qrCode)
    expect(body.farm).toBeTruthy()
    expect(body.shipments).toBeDefined()
    expect(body.certifications).toBeDefined()
  })

  it('returns 404 for unknown QR code', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/harvests/qr/AGT-FAKE' })
    expect(res.statusCode).toBe(404)
  })
})
