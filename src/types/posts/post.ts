import type z from 'zod'
import type * as post from '../../schema/post'

export type CreatePostProps = {
  authorId: string
  title: string
  slug: string
  body: string
  tags: string[]
}

export type AddPostBodyType = z.infer<typeof post.addPostBodySchema>

export type AddPostResponseType = z.infer<typeof post.addPostResponseSchema>

export type SlugPostType = z.infer<typeof post.slugPostSchema>

export type GetAllPostsResponseType = z.infer<typeof post.getAllPostsSchema>
