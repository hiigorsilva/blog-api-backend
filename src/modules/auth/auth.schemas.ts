import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../middlewares/private-route'
import {
  signinBodySchema,
  signinResponseSchema,
  signupBodySchema,
  signupResponseSchema,
  validateHeadersSchema,
  validateResponseSchema,
} from '../../schema/auth'

// SIGNUP SCHEMA
export const signup: RouteShorthandOptions = {
  schema: {
    summary: 'Create a new user',
    consumes: ['application/json'],
    tags: ['Auth'],
    body: signupBodySchema,
    response: {
      201: signupResponseSchema,
    },
  },
}
export type SignupBodyType = z.infer<typeof signupBodySchema>
export type SignupResponseType = z.infer<typeof signupResponseSchema>

// SIGNIN SCHEMA
export const signin: RouteShorthandOptions = {
  schema: {
    summary: 'Login user',
    consumes: ['application/json'],
    tags: ['Auth'],
    body: signinBodySchema,
    response: {
      200: signinResponseSchema,
      400: z.object({ error: z.string() }),
      401: z.object({ error: z.string() }),
      403: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
  },
}
export type SigninBodyType = z.infer<typeof signinBodySchema>
export type SigninResponseType = z.infer<typeof signinResponseSchema>

// VALIDATE SCHEMA
export const validate: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Validate if the user is authenticated to access the route',
    consumes: ['application/json'],
    tags: ['Auth'],
    headers: validateHeadersSchema,
    response: {
      200: validateResponseSchema,
      401: z.object({ error: z.string() }),
    },
  },
}
export type ValidateHeadersType = z.infer<typeof validateHeadersSchema>
export type ValidateResponseType = z.infer<typeof validateResponseSchema>
