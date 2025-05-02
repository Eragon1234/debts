import {z} from "zod";
import {parseUserSession} from "~/utils/parseUserSession";
import {passwordHash} from "~/utils/password";
import {tables, useDrizzle} from "~/db/db";
import {eq} from "drizzle-orm";

const updatePasswordSchema = z.object({
    password: z.string(),
})
const unauthorized = createError({statusCode: 401, message: "Unauthorized"})

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, updatePasswordSchema.safeParse);

    if (!result.success) {
        throw result.error.issues
    }

    const token = getCookie(event, "jwt");

    if (!token) {
        throw unauthorized
    }

    const userSession = await parseUserSession(token, useRuntimeConfig(event));

    if (!userSession.loggedIn) {
        throw unauthorized
    }

    const db = useDrizzle(event.context.cloudflare.env.DB);
    const password = await passwordHash(result.data.password);

    db
        .update(tables.passwordCredentials)
        .set({password})
        .where(eq(tables.passwordCredentials.userId, userSession.user.id))
        .catch(() => {
            throw createError({
                statusCode: 400,
                message: 'Failed to change password. Please try again.'
            })
        });

    return {ok: true}
})
