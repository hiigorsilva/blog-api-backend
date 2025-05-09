import type { FastifyInstance } from 'fastify'
import {
  signinRoute,
  signupRoute,
  validateRoute,
} from '../modules/auth/auth.routes'
import {
  getPublishedPostRoute,
  getPublishedPostsRoute,
  getRelatedPostsRoute,
  pingRoute,
} from '../modules/main/main.routes'
import {
  addPostRoute,
  editPostRoute,
  getPostRoute,
  getPostsRoute,
  removePostRoute,
} from '../modules/posts/post.routes'

const mainRoutes = async (app: FastifyInstance) => {
  app.register(pingRoute)
  app.register(getPublishedPostsRoute)
  app.register(getPublishedPostRoute)
  app.register(getRelatedPostsRoute)
}

const authRoutes = async (app: FastifyInstance) => {
  app.register(signupRoute)
  app.register(signinRoute)
  app.register(validateRoute)
}

const adminRoutes = async (app: FastifyInstance) => {
  app.register(getPostRoute)
  app.register(getPostsRoute)
  app.register(addPostRoute)
  app.register(editPostRoute)
  app.register(removePostRoute)
}

export const registerRoutes = async (app: FastifyInstance) => {
  app.register(mainRoutes, { prefix: '/api' })
  app.register(authRoutes, { prefix: '/api/auth' })
  app.register(adminRoutes, { prefix: '/api/admin' })
}
