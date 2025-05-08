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
