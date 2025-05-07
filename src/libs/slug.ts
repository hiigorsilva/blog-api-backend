import slug from 'slug'

export const createSlug = async (title: string) => {
  try {
    const slugTitle = slug(title, {
      lower: true,
      trim: true,
    })

    return slugTitle
  } catch (error) {
    console.log('CREATE_SLUG_ERROR:', error)
    throw new Error('Failed to create slug')
  }
}
