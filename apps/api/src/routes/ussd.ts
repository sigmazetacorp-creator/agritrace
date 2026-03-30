import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function countryFromPhone(phone: string): string {
  if (phone.startsWith('+234')) return 'NG'
  if (phone.startsWith('+254')) return 'KE'
  if (phone.startsWith('+255')) return 'TZ'
  if (phone.startsWith('+256')) return 'UG'
  if (phone.startsWith('+233')) return 'GH'
  return 'KE' // default
}

/*
  Africa's Talking USSD session flow:

  1. Farmer dials *384*SHORTCODE#
  2. CON = continue session (show menu)
  3. END = terminate session

  Menu flow:
  1. Register as farmer
  2. Log a harvest
  3. Check my farms
*/

export async function ussdRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const { sessionId, serviceCode, phoneNumber, text } =
      request.body as {
        sessionId: string
        serviceCode: string
        phoneNumber: string
        text: string
      }

    const input = text.split('*')
    const level = input.length

    let response = ''

    // Level 0 — main menu
    if (text === '') {
      response = `CON Welcome to AgriTrace
1. Register as Farmer
2. Log a Harvest
3. My Farms`

    // ── REGISTRATION FLOW ──────────────────────────────────
    } else if (input[0] === '1') {
      if (level === 1) {
        response = 'CON Enter your full name:'
      } else if (level === 2) {
        response = 'CON Enter your village:'
      } else if (level === 3) {
        response = 'CON Enter your district:'
      } else if (level === 4) {
        const name     = input[1]
        const village  = input[2]
        const district = input[3]

        const existing = await prisma.farmer.findUnique({ where: { phone: phoneNumber } })
        if (existing) {
          response = `END You are already registered as ${existing.name}.`
        } else {
          await prisma.farmer.create({
            data: { phone: phoneNumber, name, village, district, country: countryFromPhone(phoneNumber) }
          })
          response = `END Registration successful!
Name: ${name}
Village: ${village}
District: ${district}
You can now log harvests.`
        }
      }

    // ── HARVEST LOGGING FLOW ───────────────────────────────
    } else if (input[0] === '2') {
      const farmer = await prisma.farmer.findUnique({ where: { phone: phoneNumber } })

      if (!farmer) {
        response = 'END You are not registered. Please dial again and select option 1.'
      } else if (level === 1) {
        const farms = await prisma.farm.findMany({ where: { farmerId: farmer.id } })
        if (farms.length === 0) {
          response = 'END You have no farms registered. Contact your cooperative agent to add a farm.'
        } else {
          const farmList = farms.map((f: { name: string }, i: number) => `${i + 1}. ${f.name}`).join('\n')
          response = `CON Select farm:\n${farmList}`
        }
      } else if (level === 2) {
        response = 'CON Enter crop type (e.g. Maize, Coffee):'
      } else if (level === 3) {
        response = 'CON Enter quantity harvested (kg):'
      } else if (level === 4) {
        const farms = await prisma.farm.findMany({ where: { farmerId: farmer.id } })
        const farmIndex = parseInt(input[1]) - 1
        const farm = farms[farmIndex]
        const cropType   = input[2]
        const quantityKg = parseFloat(input[3])

        if (!farm || isNaN(quantityKg)) {
          response = 'END Invalid input. Please try again.'
        } else {
          const harvest = await prisma.harvest.create({
            data: {
              farmId: farm.id,
              cropType,
              quantityKg,
              harvestDate: new Date(),
              qrCode: `AGT-${Date.now()}`
            }
          })
          response = `END Harvest logged!
Crop: ${cropType}
Quantity: ${quantityKg}kg
Farm: ${farm.name}
ID: ${harvest.qrCode}`
        }
      }

    // ── MY FARMS ───────────────────────────────────────────
    } else if (input[0] === '3') {
      const farmer = await prisma.farmer.findUnique({ where: { phone: phoneNumber } })
      if (!farmer) {
        response = 'END You are not registered.'
      } else {
        const farms = await prisma.farm.findMany({ where: { farmerId: farmer.id } })
        if (farms.length === 0) {
          response = 'END No farms found. Contact your cooperative agent.'
        } else {
          const farmList = farms.map((f: { name: string; sizeHectares: number }) => `${f.name} (${f.sizeHectares}ha)`).join('\n')
          response = `END Your farms:\n${farmList}`
        }
      }

    } else {
      response = 'END Invalid option. Please try again.'
    }

    reply.type('text/plain').send(response)
  })
}
