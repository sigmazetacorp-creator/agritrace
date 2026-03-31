import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import axios from 'axios'
import qs from 'qs'

const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization'
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken'
const LINKEDIN_API_URL = 'https://api.linkedin.com/v2'

export async function linkedinRoutes(fastify: FastifyInstance) {
  // Step 1: Redirect user to LinkedIn for authorization
  fastify.get('/auth', async (request: FastifyRequest, reply: FastifyReply) => {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
      scope: 'r_organization_social w_organization_social',
      state: 'random_state_string',
    })

    reply.redirect(`${LINKEDIN_AUTH_URL}?${params}`)
  })

  // Step 2: Handle callback and exchange code for access token
  fastify.get('/callback', async (request: FastifyRequest, reply: FastifyReply) => {
    const { code } = request.query as { code: string }

    try {
      const response = await axios.post(
        LINKEDIN_TOKEN_URL,
        qs.stringify({
          grant_type: 'authorization_code',
          code,
          client_id: process.env.LINKEDIN_CLIENT_ID!,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )

      const { access_token, expires_in } = response.data

      // In production, store this token in database
      // For now, return it so user can store in .env
      reply.send({
        success: true,
        access_token,
        expires_in,
        instruction: 'Add this access_token to your .env as LINKEDIN_ACCESS_TOKEN',
      })
    } catch (error) {
      fastify.log.error(error)
      reply.send({ error: 'Failed to get access token' })
    }
  })

  // Step 3: Fetch LinkedIn posts from business page
  fastify.get('/posts', async (request: FastifyRequest, reply: FastifyReply) => {
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN

    if (!accessToken) {
      return reply.send({ error: 'LINKEDIN_ACCESS_TOKEN not set. Run /api/linkedin/auth first' })
    }

    try {
      const organizationId = `urn:li:organization:${process.env.LINKEDIN_BUSINESS_PAGE_ID!}`

      const response = await axios.get(
        `${LINKEDIN_API_URL}/ugcPosts?q=authors&authors=${organizationId}&count=10`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )

      reply.send(response.data)
    } catch (error) {
      fastify.log.error(error)
      reply.send({ error: 'Failed to fetch LinkedIn posts' })
    }
  })
}
