import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { getPublishedPostsSchema, queryPostSchema } from '../../schema/post'

export const ping: RouteShorthandOptions = {
  schema: {
    summary: 'Ping route',
    description: 'Test route to check if the server is running',
    consumes: ['application/json'],
    tags: ['Ping'],
    response: {
      200: z.object({
        ping: z.string(),
      }),
    },
  },
}

export const getPublishedPosts: RouteShorthandOptions = {
  schema: {
    summary: 'Get all published posts',
    consumes: ['application/json'],
    tags: ['Posts'],
    querystring: queryPostSchema,
    response: {
      200: getPublishedPostsSchema,
      400: z.object({
        error: z.string(),
        message: z.string(),
      }),
      500: z.object({ error: z.string() }),
    },
  },
}
