import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import * as postController from './post.controllers'
import * as postSchema from './post.schemas'

export const getPostRoute: FastifyPluginAsyncZod = async app => {
  app.get('/posts/:slug', postSchema.getPost, postController.getPost)
}

export const getPostsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/posts', postSchema.getPosts, postController.getPosts)
}

export const addPostRoute: FastifyPluginAsyncZod = async app => {
  app.post('/posts', postSchema.addPost, postController.addPost)
}

export const editPostRoute: FastifyPluginAsyncZod = async app => {
  app.put('/posts/:slug', postSchema.editPost, postController.editPost)
}

export const removePostRoute: FastifyPluginAsyncZod = async app => {
  app.delete('/posts/:slug', postSchema.removePost, postController.removePost)
}
