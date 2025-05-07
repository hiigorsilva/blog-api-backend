import { fastifyMultipart } from '@fastify/multipart'
import type { FastifyInstance } from 'fastify'

export const registerMultipart = async (app: FastifyInstance) => {
  app.register(fastifyMultipart, {
    attachFieldsToBody: true,
    limits: {
      fileSize: 2 * 1024 * 1024, // 2 MB
      files: 1,
      fields: 4,
    },
    throwFileSizeLimit: true,
  })
}
