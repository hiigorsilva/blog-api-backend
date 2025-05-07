import type { FastifyReply, FastifyRequest } from 'fastify'
import { signinBodySchema, signupBodySchema } from '../../schema/auth'
import type { SigninResponseType } from './auth.schemas'
import { createToken, createUser, verifyCredentials } from './auth.services'

export const signup = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = signupBodySchema.safeParse(request.body)
    if (!data.success) {
      return reply.status(400).send({ error: data.error.flatten().fieldErrors })
    }

    const { name, email, password } = data.data

    const user = await createUser(name, email, password)
    if (!user.success || !user.data) {
      return reply.status(400).send({ error: user.error })
    }

    const token = await createToken(user.data.id)
    if (!token) {
      return reply.status(400).send({ error: 'Failed to generate token' })
    }

    const newUser = {
      user: {
        id: user.data.id,
        name: user.data.name,
        email: user.data.email,
      },
      token: token,
    }

    return reply.status(201).send(newUser)
  } catch (err) {
    console.log(err)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}

export const signin = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const data = signinBodySchema.safeParse(request.body)
    if (!data.success) {
      return reply.status(400).send({ error: data.error.flatten().fieldErrors })
    }

    const { email, password } = data.data

    const user = await verifyCredentials(email, password)
    if (!user.data) {
      return reply.status(400).send({ error: user.error })
    }

    if (!user.success) {
      return reply.status(401).send({ error: 'Invalid Credentials' })
    }

    if (!user.data.status) {
      return reply.status(403).send({ error: 'User is inactive' })
    }

    const token = await createToken(user.data.id)
    if (!token) {
      return reply.status(500).send({ error: 'Failed to generate token' })
    }

    const loggedUser: SigninResponseType = {
      user: {
        id: user.data.id,
        name: user.data.name,
        email: user.data.email,
      },
      token: token,
    }

    return reply.status(200).send(loggedUser)
  } catch (err) {
    console.log('LOGIN_ERROR:', err)
    return reply.status(500).send({ error: 'Internal Server Error' })
  }
}

export const validate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { user } = request
  if (!user) {
    return reply
      .status(401)
      .send({ error: 'Error validating user authorization ' })
  }

  const authenticatedUser = {
    user: user,
  }

  return reply.status(200).send(authenticatedUser)
}
