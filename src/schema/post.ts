import z from 'zod'

// POST STATUS SCHEMA
export const POST_STATUS_SCHEMA = z.enum(['PUBLISHED', 'DRAFT'])

// ADD POST HEADER SCHEMA
export const authorizationHeaderSchema = z.object({
  authorization: z.string(),
})

// ADD POST BODY SCHEMA
export const addPostBodySchema = z.object({
  title: z.string().min(2),
  tags: z.array(z.string()),
  body: z.string().min(2),
})

// ADD POST BODY SCHEMA
export const editPostBodySchema = z.object({
  title: z.string().optional(),
  tags: z.array(z.string()).optional(),
  body: z.string().optional(),
  status: POST_STATUS_SCHEMA.optional(),
})

// ADD POST RESPONSE SCHEMA
export const addPostResponseSchema = z.object({
  post: z.object({
    id: z.string(),
    status: POST_STATUS_SCHEMA,
    tags: z.array(z.string()),
    authorName: z.string(),
    title: z.string(),
    slug: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
})

export const getAllPostsSchema = z.object({
  posts: z.array(
    z.object({
      id: z.string(),
      status: POST_STATUS_SCHEMA,
      tags: z.array(z.string()),
      authorName: z.string(),
      title: z.string(),
      slug: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
  page: z.number(),
  totalPosts: z.number(),
})

// SLUG POST SCHEMA
export const slugPostSchema = z.object({
  slug: z.string(),
})

export const queryPostSchema = z.object({
  page: z.coerce.number().positive().default(1),
})
