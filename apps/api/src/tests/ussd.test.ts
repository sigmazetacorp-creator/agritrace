import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildApp } from '../app'
import { PrismaClient } from '@prisma/client'

const app = buildApp()
const prisma = new PrismaClient()

const SESSION = 'test-session-001'
const PHONE = '+254799000099'
const SERVICE = '*384*001#'

// Helper: POST to /ussd with Africa's Talking body format
async function ussd(text: string) {
  const res = await app.inject({
    method: 'POST',
    url: '/ussd',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    payload: `sessionId=${SESSION}&serviceCode=${SERVICE}&phoneNumber=${encodeURIComponent(PHONE)}&text=${encodeURIComponent(text)}`,
  })
  return res.payload
}

beforeAll(async () => {
  await app.ready()
  // Clean up any leftover test farmer
  await prisma.farmer.deleteMany({ where: { phone: PHONE } })
})

afterAll(async () => {
  await prisma.farmer.deleteMany({ where: { phone: PHONE } })
  await prisma.$disconnect()
  await app.close()
})

describe('USSD — main menu', () => {
  it('shows main menu on empty input', async () => {
    const res = await ussd('')
    expect(res).toContain('CON')
    expect(res).toContain('Register as Farmer')
    expect(res).toContain('Log a Harvest')
    expect(res).toContain('My Farms')
  })
})

describe('USSD — registration flow', () => {
  it('step 1: prompts for name', async () => {
    const res = await ussd('1')
    expect(res).toMatch(/CON/)
    expect(res.toLowerCase()).toContain('name')
  })

  it('step 2: prompts for village', async () => {
    const res = await ussd('1*Jane Wanjiru')
    expect(res).toMatch(/CON/)
    expect(res.toLowerCase()).toContain('village')
  })

  it('step 3: prompts for district', async () => {
    const res = await ussd('1*Jane Wanjiru*Limuru')
    expect(res).toMatch(/CON/)
    expect(res.toLowerCase()).toContain('district')
  })

  it('step 4: creates farmer and ends session', async () => {
    const res = await ussd('1*Jane Wanjiru*Limuru*Kiambu')
    expect(res).toMatch(/END/)
    expect(res).toContain('Jane Wanjiru')
    expect(res.toLowerCase()).toContain('success')

    // Verify farmer in DB
    const farmer = await prisma.farmer.findUnique({ where: { phone: PHONE } })
    expect(farmer).not.toBeNull()
    expect(farmer!.name).toBe('Jane Wanjiru')
    expect(farmer!.village).toBe('Limuru')
    expect(farmer!.district).toBe('Kiambu')
  })

  it('step 4 (duplicate): returns already registered message', async () => {
    const res = await ussd('1*Jane Wanjiru*Limuru*Kiambu')
    expect(res).toMatch(/END/)
    expect(res.toLowerCase()).toContain('already registered')
  })
})

describe('USSD — harvest flow (no farms)', () => {
  it('option 2 with no farms shows message', async () => {
    const res = await ussd('2')
    expect(res).toMatch(/END/)
    expect(res.toLowerCase()).toContain('no farms')
  })
})

describe('USSD — my farms (no farms)', () => {
  it('option 3 with no farms shows message', async () => {
    const res = await ussd('3')
    expect(res).toMatch(/END/)
    expect(res.toLowerCase()).toContain('no farm')
  })
})

describe('USSD — invalid option', () => {
  it('unknown option returns END with error', async () => {
    const res = await ussd('9')
    expect(res).toMatch(/END/)
    expect(res.toLowerCase()).toContain('invalid')
  })
})
