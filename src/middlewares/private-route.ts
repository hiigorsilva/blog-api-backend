import type { FastifyReply, FastifyRequest } from 'fastify'
import { verifyRequest } from '../modules/auth/auth.services'

export const privateRoute = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const user = await verifyRequest(request)
    if (!user) {
      return reply.status(401).send({ error: 'Unauthorized user' })
    }

    request.user = user
    return user
  } catch (err) {
    console.error('AUTHORIZATION_ERROR', err)
    return reply.status(401).send({ error: 'Unauthorized user' })
  }
}
