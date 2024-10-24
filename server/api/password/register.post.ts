import {z} from "zod";
import {tables, useDrizzle} from "~/db/db";
import {passwordHash} from "~/utils/password";

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, z.object({
        username: z.string().min(1).trim(),
        name: z.string().min(1).trim(),
        password: z.string().min(1).trim(),
    }).safeParse);

    if (!result.success) {
        throw result.error.issues
    }

    const {username, name, password} = result.data;

    const db = useDrizzle(event.context.cloudflare.env.DB);

    const user = await db.insert(tables.users).values({
        name,
        username
    }).returning().get().catch(() => {
        throw createError({
            statusCode: 400,
            message: 'User already exists'
        })
    })

    await db.insert(tables.passwordCredentials).values({
        userId: user.id,
        password: await passwordHash(password)
    })

    await setUserSession(event, {
        user: {
            id: user.id,
            name: user.name,
            username: user.username,
        }
    })

    return {ok: true}
})