import type z from 'zod'
import type * as post from '../../schema/post'

export type CreatePostProps = {
  authorId: string
  title: string
  slug: string
  body: string
  tags: string[]
}

export type GetPostType = z.infer<typeof post.getPostSchema>

export type GetAllPostsResponseType = z.infer<typeof post.getAllPostsSchema>

export type GetPublishedPostsResponseType = z.infer<
  typeof post.getPublishedPostsSchema
>

export type AddPostResponseType = z.infer<typeof post.addPostResponseSchema>
