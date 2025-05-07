import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import * as authController from './auth.controllers'
import * as authSchema from './auth.schemas'

export const signupRoute: FastifyPluginAsyncZod = async app => {
  app.post('/signup', authSchema.signup, authController.signup)
}

export const signinRoute: FastifyPluginAsyncZod = async app => {
  app.post('/signin', authSchema.signin, authController.signin)
}

export const validateRoute: FastifyPluginAsyncZod = async app => {
  app.post('/validate', authSchema.validate, authController.validate)
}
