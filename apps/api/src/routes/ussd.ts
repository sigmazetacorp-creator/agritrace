import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'
import {
  farmerNameSchema,
  villageSchema,
  districtSchema,
  cropTypeSchema,
  quantitySchema,
  farmIndexSchema,
  validateUSSDInput,
} from '../lib/ussdValidation'

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
    try {
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
        const nameValidation = validateUSSDInput(farmerNameSchema, input[1])
        if (!nameValidation.valid) {
          response = `CON ${nameValidation.error}\nEnter your full name:`
        } else {
          response = 'CON Enter your village:'
        }
      } else if (level === 3) {
        const villageValidation = validateUSSDInput(villageSchema, input[2])
        if (!villageValidation.valid) {
          response = `CON ${villageValidation.error}\nEnter your village:`
        } else {
          response = 'CON Enter your district:'
        }
      } else if (level === 4) {
        const districtValidation = validateUSSDInput(districtSchema, input[3])
        if (!districtValidation.valid) {
          response = `CON ${districtValidation.error}\nEnter your district:`
        } else {
          const name     = input[1].trim()
          const village  = input[2].trim()
          const district = input[3].trim()

          try {
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
          } catch (error) {
            console.error('USSD registration error:', error)
            response = 'END Registration failed. Please try again later.'
          }
        }
      }

    // ── HARVEST LOGGING FLOW ───────────────────────────────
    } else if (input[0] === '2') {
      try {
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
          // Validate farm selection
          const farmValidation = validateUSSDInput(farmIndexSchema, input[1])
          if (!farmValidation.valid) {
            response = 'END Invalid farm selection. Please try again.'
          } else {
            const farms = await prisma.farm.findMany({ where: { farmerId: farmer.id } })
            const farmIndex = parseInt(input[1]) - 1
            const farm = farms[farmIndex]

            // Validate crop type
            const cropValidation = validateUSSDInput(cropTypeSchema, input[2])
            if (!cropValidation.valid) {
              response = 'END Invalid crop type. Please try again.'
            } else {
              // Validate quantity
              const quantityValidation = validateUSSDInput(quantitySchema, input[3])
              if (!quantityValidation.valid) {
                response = 'END Invalid quantity. Must be a positive number up to 100000 kg. Please try again.'
              } else if (!farm) {
                response = 'END Invalid farm selection. Please try again.'
              } else {
                const cropType   = input[2].trim()
                const quantityKg = parseFloat(input[3])

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
          }
        }
      } catch (error) {
        console.error('USSD harvest logging error:', error)
        response = 'END An error occurred. Please try again later.'
      }

    // ── MY FARMS ───────────────────────────────────────────
    } else if (input[0] === '3') {
      try {
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
      } catch (error) {
        console.error('USSD farms list error:', error)
        response = 'END An error occurred. Please try again later.'
      }

    } else {
      response = 'END Invalid option. Please try again.'
    }

    reply.type('text/plain').send(response)
    } catch (error) {
      console.error('USSD handler error:', error)
      reply.type('text/plain').send('END An error occurred. Please try again later.')
    }
  })
}
