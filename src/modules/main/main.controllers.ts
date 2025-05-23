import type { FastifyReply, FastifyRequest } from 'fastify'
import { queryPostSchema, slugPostSchema } from '../../schema/post'
import type {
  GetPublishedPostResponseType,
  GetPublishedPostsResponseType,
  GetRelatedPostsResponseType,
} from '../../types/posts/post'
import { getPostBySlug } from '../posts/post.services'
import { getAllPublishedPosts, getPostsWithSimilarTags } from './main.services'

export const ping = async (request: FastifyRequest, reply: FastifyReply) => {
  const { ip } = request
  console.log(`Meu IP é ${ip} 💻`)

  return reply.status(200).send({
    ping: 'pong',
  })
}

export const getPublishedPosts = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const pageQuery = queryPostSchema.safeParse(request.query)
  if (!pageQuery.success) {
    return reply.status(400).send({
      error: pageQuery.error.flatten().fieldErrors,
      message: pageQuery.error.message,
    })
  }

  if (pageQuery.data.page <= 0) {
    return reply.status(404).send({ error: 'Page not found' })
  }

  const { page } = pageQuery.data

  const posts = await getAllPublishedPosts(page)
  if (!posts) {
    return reply.status(500).send({ error: 'Failed to get posts' })
  }

  const publishedPosts: GetPublishedPostsResponseType = {
    posts: posts.map(post => ({
      id: post.authorId,
      title: post.title,
      slug: post.slug,
      tags: post.tags,
      authorName: post.author.name,
      updatedAt: post.updatedAt,
      createdAt: post.createdAt,
    })),
    page: page,
  }

  return reply.status(200).send(publishedPosts)
}

export const getPublishedPost = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const slugQuery = slugPostSchema.safeParse(request.params)
  if (!slugQuery.success) {
    return reply.status(400).send({
      error: slugQuery.error.flatten().fieldErrors,
      message: slugQuery.error.message,
    })
  }

  const { slug } = slugQuery.data
  const post = await getPostBySlug(slug)
  const isPublishedPost = post && post.postStatus === 'PUBLISHED'

  if (!post || !isPublishedPost) {
    return reply.status(404).send({ error: 'Post not found' })
  }

  const postResponse: GetPublishedPostResponseType = {
    id: post.postId,
    title: post.title,
    slug: post.slug,
    body: post.body,
    tags: post.tags,
    authorName: post.author.name,
    updatedAt: post.updatedAt,
    createdAt: post.createdAt,
  }

  return reply.status(200).send(postResponse)
}

export const getRelatedPosts = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const slugQuery = slugPostSchema.safeParse(request.params)
  if (!slugQuery.success) {
    return reply.status(400).send({
      error: slugQuery.error.flatten().fieldErrors,
      message: slugQuery.error.message,
    })
  }

  const { slug } = slugQuery.data

  const posts = await getPostsWithSimilarTags(slug)
  if (!posts.success || !posts.data) {
    return reply.status(500).send({ error: posts.error })
  }

  const relatedPostsResponse: GetRelatedPostsResponseType = {
    posts: posts.data.map(post => ({
      id: post.postId,
      title: post.title,
      slug: post.slug,
      tags: post.tags,
      authorName: post.author.name,
      updatedAt: post.updatedAt,
      createdAt: post.createdAt,
    })),
  }

  return reply.status(200).send(relatedPostsResponse)
}
