import { z } from 'zod'
import {tables, useDrizzle} from "~/db/db";

export default defineWebAuthnRegisterEventHandler({
  async storeChallenge(event, challenge, attemptId) {
    await event.context.cloudflare.env.KV.put(`auth:challenge:${attemptId}`, challenge, { ttl: 60 })
  },
  async getChallenge(event, attemptId) {
    const challenge = await event.context.cloudflare.env.KV.get<string>(`auth:challenge:${attemptId}`)
    if (!challenge) {
      throw createError({
        statusCode: 400,
        message: 'Challenge not found or expired'
      })
    }
    await event.context.cloudflare.env.KV.delete(`auth:challenge:${attemptId}`)
    return challenge
  },
  validateUser: user => z.object({
    userName: z.string().min(1).toLowerCase().trim(),
    displayName: z.string().min(1).trim()
  }).parseAsync(user),
  async onSuccess(event, { user, credential }) {
    const db = useDrizzle(event.context.cloudflare.env.DB);

    const dbUser = await db.insert(tables.users).values({
      username: user.userName,
      name: user.displayName,
    }).returning().get().catch(() => {
      throw createError({
        statusCode: 400,
        message: 'User already exists'
      })
    })

    await db.insert(tables.credentials).values({
      userId: dbUser.id,
      id: credential.id,
      publicKey: credential.publicKey,
      counter: credential.counter,
      backedUp: credential.backedUp,
      transports: credential.transports
    })

    await setUserSession(event, {
      user: {
        id: dbUser.id,
        username: dbUser.username,
        name: dbUser.name || dbUser.username
      }
    })
  }
})
