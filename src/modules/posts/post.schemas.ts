import type { RouteShorthandOptions } from 'fastify/types/route'
import z from 'zod'
import { privateRoute } from '../../middlewares/private-route'
import * as post from '../../schema/post'

export const getPost: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Get a post by slug',
    consumes: ['application/json'],
    tags: ['Posts'],
    params: post.slugPostSchema,
    headers: post.authorizationHeaderSchema,
    response: {
      200: post.getPostSchema,
      400: z.object({
        error: z.string(),
        message: z.string(),
      }),
      401: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
  },
}

export const getPosts: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Get all posts',
    consumes: ['application/json'],
    tags: ['Posts'],
    querystring: post.queryPostSchema,
    headers: post.authorizationHeaderSchema,
    response: {
      200: post.getAllPostsSchema,
      400: z.object({
        error: z.string(),
        message: z.string(),
      }),
      401: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
  },
}

export const addPost: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Create a new post',
    consumes: ['application/json'],
    tags: ['Posts'],
    headers: z.object({
      authorization: z.string(),
    }),
    body: post.addPostBodySchema,
    response: {
      201: post.addPostResponseSchema,
      400: z.object({
        error: z.string(),
        message: z.string(),
      }),
      401: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
  },
}

export const editPost: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Edit a post by slug',
    consumes: ['application/json'],
    tags: ['Posts'],
    params: post.slugPostSchema,
    headers: post.authorizationHeaderSchema,
    body: post.editPostBodySchema,
    response: {
      201: post.addPostResponseSchema,
      400: z.object({
        error: z.string(),
        message: z.string(),
      }),
      401: z.object({ error: z.string() }),
    },
  },
}

export const removePost: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Remove a post by slug',
    consumes: ['application/json'],
    tags: ['Posts'],
    params: post.slugPostSchema,
    headers: post.authorizationHeaderSchema,
    response: {
      200: z.object({
        message: z.string(),
        post: z.object({
          postId: z.string(),
          title: z.string(),
          authorName: z.string(),
        }),
      }),
      400: z.object({
        error: z.string(),
        message: z.string(),
      }),
      401: z.object({ error: z.string() }),
      404: z.object({ error: z.string() }),
      500: z.object({ error: z.string() }),
    },
  },
}
