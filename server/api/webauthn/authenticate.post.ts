import {eq} from "drizzle-orm";
import {tables, useDrizzle} from "~/db/db";

export default defineWebAuthnAuthenticateEventHandler({
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
  async allowCredentials(event, userName) {
    const db = useDrizzle(event.context.cloudflare.env.DB);

    const user = await db.query.users.findFirst({
      where: eq(tables.users.username, userName),
      with: {
        credentials: true
      }
    })

    if (!user) throw createError({ statusCode: 400, message: 'User not found' })

    return user.credentials || []
  },
  async getCredential(event, credentialID) {
    const db = useDrizzle(event.context.cloudflare.env.DB);
    const credential = await db.query.credentials.findFirst({
      where: eq(tables.credentials.id, credentialID),
      with: {
        user: true
      }
    })

    if (!credential) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Credential not found'
      })
    }

    return credential
  },
  async onSuccess(event, { credential }) {
    await setUserSession(event, {
      user: {
        id: credential.user.id,
        name: credential.user.name,
        username: credential.user.username
      }
    })
  }
})
