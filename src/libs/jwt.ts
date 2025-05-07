import jwt from 'jsonwebtoken'
import { env } from '../schema/env'

export const createJWT = async (payload: any) => {
  const token = jwt.sign(payload, env.JWT_SECRET)
  return token
}

export const readJWT = async (hash: string) => {
  try {
    const token = jwt.verify(hash, env.JWT_SECRET)
    return token
  } catch (err) {
    console.log('READ_JWT_ERROR:', err)
    return null
  }
}
