import type { FastifyReply, FastifyRequest } from 'fastify'
import { queryPostSchema } from '../../schema/post'
import type { GetPublishedPostsResponseType } from '../../types/posts/post'
import { getAllPublishedPosts } from '../posts/post.services'

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
