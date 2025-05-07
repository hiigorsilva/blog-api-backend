import type { FastifyReply, FastifyRequest } from 'fastify'

export const ping = async (request: FastifyRequest, reply: FastifyReply) => {
  const { ip } = request
  console.log(`Meu IP é ${ip} 💻`)

  return reply.status(200).send({
    ping: 'pong',
  })
}
