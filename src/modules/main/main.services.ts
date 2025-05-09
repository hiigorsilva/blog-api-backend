import { db } from '../../libs/prisma'

export const getAllPublishedPosts = async (page: number) => {
  const PER_PAGE_ITEMS = 5

  const posts = await db.post.findMany({
    where: { postStatus: 'PUBLISHED' },
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

export const getPostsWithSimilarTags = async (slug: string) => {
  const post = await db.post.findUnique({
    where: { slug: slug },
  })
  if (!post)
    return {
      success: false,
      error: 'Post not found',
      data: null,
    }

  const tags = post.tags
  if (tags.length === 0)
    return {
      success: false,
      error: 'No tags found',
      data: null,
    }

  const relatedPosts = await db.post.findMany({
    where: {
      postStatus: 'PUBLISHED',
      slug: { not: slug },
      OR: tags.map(tag => ({
        tags: {
          hasSome: [tag],
        },
      })),
    },
    include: {
      author: {
        select: { name: true },
      },
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  })

  return {
    success: true,
    error: null,
    data: relatedPosts,
  }
}
