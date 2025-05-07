import type { FastifyRequest } from 'fastify'
import { createJWT, readJWT } from '../../libs/jwt'
import { db } from '../../libs/prisma'
import { validateHeadersSchema } from '../../schema/auth'
import type { TokenPayload } from '../../types/auth/token-payload'
import { comparePassword, hashPassword } from '../../utils/hash'

export const createToken = async (userId: string) => {
  const token = createJWT(userId)
  if (!token) {
    return null
  }

  return token
}

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  const userAlreadyExists = await db.user.findUnique({
    where: { email: email },
  })
  if (userAlreadyExists) {
    return {
      success: false,
      error: 'User already exists',
      data: null,
    }
  }

  const hashedPassword = hashPassword(password)

  const user = await db.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword,
    },
  })
  if (!user) {
    return {
      success: false,
      error: 'Something went wrong while creating the user',
      data: null,
    }
  }

  return {
    success: true,
    error: null,
    data: user,
  }
}

export const verifyCredentials = async (email: string, password: string) => {
  const user = await db.user.findUnique({
    where: { email: email },
  })
  if (!user) {
    return {
      success: false,
      error: 'Invalid Credentials',
      data: null,
    }
  }

  const isPasswordValid = comparePassword(password, user.password)
  if (!isPasswordValid) {
    return {
      success: false,
      error: 'Invalid Credentials',
      data: null,
    }
  }

  return {
    success: true,
    error: null,
    data: user,
  }
}

export const verifyRequest = async (request: FastifyRequest) => {
  const { authorization } = validateHeadersSchema.parse(request.headers)
  if (!authorization) return null

  const token = authorization.split(' ')[1]
  if (!token) return null

  const dataToken = await readJWT(token)
  if (!dataToken) return null

  const userId = (dataToken as TokenPayload).id
  const user = await getUserById(userId)
  if (!user) return null

  return user
}

export const getUserById = async (userId: string) => {
  const user = await db.user.findFirst({
    where: { id: userId },
    omit: {
      password: true,
    },
  })

  return user
}
