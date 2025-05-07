import type { Prisma } from '@prisma/client'
import { db } from '../../libs/prisma'
import { createSlug } from '../../libs/slug'
import type { CreatePostProps } from '../../types/posts/post'

export const createPostSlug = async (title: string) => {
  const slugBase = await createSlug(title)
  if (!slugBase) return

  let newSlug = slugBase
  let counter = 1

  while (true) {
    const postAlreadyExists = await getPostBySlug(newSlug)
    if (!postAlreadyExists) {
      return newSlug
    }

    newSlug = `${slugBase}-${counter}`
    counter++
  }
}

export const createPost = async (data: CreatePostProps) => {
  const post = await db.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      body: data.body,
      tags: data.tags,
      authorId: data.authorId,
    },
    select: {
      title: true,
      slug: true,
      tags: true,
      postId: true,
      postStatus: true,
      authorId: true,
      updatedAt: true,
      createdAt: true,
    },
  })

  await addPostCount(data.authorId)

  return post
}

export const addPostCount = async (userId: string) => {
  const totalPosts = await db.user.update({
    where: { id: userId },
    data: { totalPosts: { increment: 1 } },
    select: {
      totalPosts: true,
    },
  })
  return totalPosts
}

export const removePostCount = async (userId: string) => {
  const totalPosts = await db.user.update({
    where: { id: userId },
    data: { totalPosts: { decrement: 1 } },
    select: {
      totalPosts: true,
    },
  })
  return totalPosts
}

export const updatePost = async (
  slug: string,
  data: Prisma.PostUpdateInput
) => {
  const post = await db.post.update({
    where: { slug: slug },
    data: data,
  })

  return post
}

export const getPostBySlug = async (slug: string) => {
  const post = await db.post.findUnique({
    where: { slug: slug },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  })
  return post
}

export const removePostBySlug = async (slug: string) => {
  const post = await db.post.delete({
    where: { slug: slug },
    select: {
      postId: true,
      title: true,
      author: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  })

  await removePostCount(post.author.id)

  return post
}

export const getAllPosts = async (userId: string, page: number) => {
  const PER_PAGE_ITEMS = 5

  const posts = await db.post.findMany({
    where: { authorId: userId },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    take: PER_PAGE_ITEMS,
    skip: (page - 1) * PER_PAGE_ITEMS,
    orderBy: { createdAt: 'desc' },
  })

  return posts
}

export const getAllPostsCount = async (userId: string) => {
  const totalPosts = await db.post.count({
    where: { authorId: userId },
  })
  return totalPosts
}
