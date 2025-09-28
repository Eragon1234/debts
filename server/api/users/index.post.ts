import {tables, useDrizzle} from "~~/db/db";
import {passwordHash} from "~/utils/password";
import {setJWTToken} from "~/utils/jwt";
import {createUserSchema} from "#shared/schemas/CreateUserSchema";

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, createUserSchema.safeParse);

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

    await setJWTToken(user, event);

    return {ok: true}
})