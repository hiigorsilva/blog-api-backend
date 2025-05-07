import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'

export function errorHandler(
  error: FastifyError | ZodError,
  _: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    console.error('❌ ZodError:', error)

    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation error',
      issues: error.errors,
    })
  }

  console.error('❌ Error Handler:', error)
  return reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Something went wrong',
  })
}
