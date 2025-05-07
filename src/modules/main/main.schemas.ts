import z from 'zod'

export const ping = {
  schema: {
    summary: 'Ping route',
    description: 'Test route to check if the server is running',
    consumes: ['application/json'],
    tags: ['Ping'],
    response: {
      200: z.object({
        ping: z.string(),
      }),
    },
  },
}
