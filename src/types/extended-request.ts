import type { User } from '@prisma/client'

export type UserWithoutPassword = Omit<User, 'password'>

declare module 'fastify' {
  export interface FastifyRequest {
    user?: UserWithoutPassword
  }
}
