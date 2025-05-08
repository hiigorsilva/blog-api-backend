import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import * as mainController from './main.controllers'
import * as mainSchema from './main.schemas'

export const pingRoute: FastifyPluginAsyncZod = async app => {
  app.get('/ping', mainSchema.ping, mainController.ping)
}

export const getPublishedPostsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/posts',
    mainSchema.getPublishedPosts,
    mainController.getPublishedPosts
  )
}

export const getPublishedPostRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/posts/:slug',
    mainSchema.getPublishedPost,
    mainController.getPublishedPost
  )
}
