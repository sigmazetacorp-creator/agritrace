import Fastify from 'fastify'
import formbody from '@fastify/formbody'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'

import { ussdRoutes } from './routes/ussd'
import { farmerRoutes } from './routes/farmers'
import { harvestRoutes } from './routes/harvests'
import { farmRoutes } from './routes/farms'

export function buildApp() {
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test' })

  app.register(formbody)
  app.register(cors, { origin: '*' })

  // Rate limiting: 100 req/min globally; USSD endpoint gets higher limit
  // (Africa's Talking can burst many sessions simultaneously)
  app.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
  })

  app.register(ussdRoutes, { prefix: '/ussd' })
  app.register(farmerRoutes, { prefix: '/api/farmers' })
  app.register(harvestRoutes, { prefix: '/api/harvests' })
  app.register(farmRoutes, { prefix: '/api/farms' })

  app.get('/health', async () => ({ status: 'ok' }))

  return app
}
