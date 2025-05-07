import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  addPostBodySchema,
  editPostBodySchema,
  queryPostSchema,
  slugPostSchema,
} from '../../schema/post'
import type {
  AddPostResponseType,
  GetAllPostsResponseType,
} from '../../types/posts/post'
import { getUserById } from '../auth/auth.services'
import {
  createPost,
  createPostSlug,
  getAllPosts,
  getAllPostsCount,
  getPostBySlug,
  removePostBySlug,
  updatePost,
} from './post.services'

export const addPost = async (request: FastifyRequest, reply: FastifyReply) => {
  const { user } = request
  if (!user) {
    return reply.status(401).send({ error: 'Unauthorized user' })
  }

  const data = addPostBodySchema.safeParse(request.body)
  if (!data.success) {
    return reply.status(400).send({
      error: data.error.flatten().fieldErrors,
      message: data.error.message,
    })
  }
  const { title, body, tags } = data.data

  const slugTitle = await createPostSlug(title)
  if (!slugTitle) {
    return reply.status(500).send({ error: 'Failed to create post slug' })
  }

  const dataToCreatePost = {
    authorId: user.id,
    title: title,
    slug: slugTitle,
    body: body,
    tags: tags,
  }

  const post = await createPost(dataToCreatePost)
  const author = await getUserById(user.id)
  if (!author) {
    return reply.status(500).send({ error: 'Failed to get author' })
  }
  const newPost: AddPostResponseType = {
    post: {
      id: post.postId,
      title: post.title,
      slug: post.slug,
      tags: post.tags,
      status: post.postStatus,
      authorName: author.name,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    },
  }

  return reply.status(201).send(newPost)
}

export const editPost = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { user } = request
  if (!user) {
    return reply.status(401).send({ error: 'Unauthorized user' })
  }

  const slugParams = slugPostSchema.safeParse(request.params)
  if (!slugParams.success) {
    return reply.status(400).send({
      error: slugParams.error.flatten().fieldErrors,
      message: slugParams.error.message,
    })
  }

  const data = editPostBodySchema.safeParse(request.body)
  if (!data.success) {
    return reply.status(400).send({
      error: data.error.flatten().fieldErrors,
      message: data.error.message,
    })
  }

  const { title, body, tags, status } = data.data
  const { slug } = slugParams.data

  const postExists = await getPostBySlug(slug)
  if (!postExists) {
    return reply.status(404).send({ error: 'Post not found' })
  }

  const slugTitle = await createPostSlug(title || postExists.title)
  if (!slugTitle) {
    return reply.status(500).send({ error: 'Failed to create post slug' })
  }

  const dataToUpdatePost = {
    title: title,
    body: body,
    tags: tags,
    status: status,
    slug: slugTitle,
  }

  const updatedPost = await updatePost(slug, dataToUpdatePost)
  const author = await getUserById(updatedPost.authorId)
  if (!author) {
    return reply.status(500).send({ error: 'Failed to get author' })
  }

  const post: AddPostResponseType = {
    post: {
      id: updatedPost.postId,
      title: updatedPost.title,
      slug: updatedPost.slug,
      tags: updatedPost.tags,
      status: updatedPost.postStatus,
      authorName: author.name,
      createdAt: updatedPost.createdAt,
      updatedAt: updatedPost.updatedAt,
    },
  }

  return reply.status(201).send(post)
}

export const removePost = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { user } = request
  if (!user) {
    return reply.status(401).send({ error: 'Unauthorized user' })
  }

  const slugParams = slugPostSchema.safeParse(request.params)
  if (!slugParams.success) {
    return reply.status(400).send({
      error: slugParams.error.flatten().fieldErrors,
      message: slugParams.error.message,
    })
  }

  const { slug } = slugParams.data

  const postExists = await getPostBySlug(slug)
  if (!postExists) {
    return reply.status(404).send({ error: 'Post not found' })
  }

  const deletedPost = await removePostBySlug(slug)
  if (!deletedPost) {
    return reply.status(500).send({ error: 'Failed to delete post' })
  }

  const post = {
    message: 'Post successfully deleted',
    post: {
      postId: deletedPost.postId,
      title: deletedPost.title,
      authorName: deletedPost.author.name,
    },
  }

  return reply.status(200).send(post)
}

export const getPosts = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const { user } = request
  if (!user) {
    return reply.status(401).send({ error: 'Unauthorized user' })
  }

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

  const posts = await getAllPosts(user.id, page)
  if (!posts) {
    return reply.status(500).send({ error: 'Failed to get posts' })
  }

  const totalPosts = await getAllPostsCount(user.id)

  const postsResponse: GetAllPostsResponseType = {
    posts: posts.map(post => ({
      id: post.postId,
      title: post.title,
      slug: post.slug,
      tags: post.tags,
      authorName: post.author.name,
      status: post.postStatus,
      updatedAt: post.updatedAt,
      createdAt: post.createdAt,
    })),
    page: page,
    totalPosts: totalPosts,
  }

  return reply.status(200).send(postsResponse)
}
