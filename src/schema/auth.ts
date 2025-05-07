import z from 'zod'

// SIGNUP SCHEMA
export const signupBodySchema = z.object({
  name: z.string().min(2),
  email: z
    .string()
    .email()
    .transform(email => email.toLowerCase()),
  password: z.string().min(6),
})
export const signupResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
  token: z.string(),
})

// SIGNIN SCHEMA
export const signinBodySchema = z.object({
  email: z
    .string({ required_error: 'Email field is required' })
    .email({ message: 'Invalid email' })
    .transform(email => email.toLowerCase()),
  password: z.string({ required_error: 'Password field is required' }).min(6, {
    message: 'Password must be at least 6 characters',
  }),
})
export const signinResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
  token: z.string(),
})

// VALIDATE SCHEMA
export const validateHeadersSchema = z.object({
  authorization: z.string(),
})
export const validateResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
})
