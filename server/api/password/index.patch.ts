import {useUserSession} from "~/utils/parseUserSession";
import {passwordHash} from "~/utils/password";
import {tables} from "~~/db/db";
import {eq} from "drizzle-orm";
import {changePasswordSchema} from "#shared/schemas/ChangePasswordSchema";

const unauthorized = createError({statusCode: 401, message: "Unauthorized"})

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, changePasswordSchema.safeParse);

    if (!result.success) {
        throw result.error.issues
    }

    const userSession = await useUserSession(event);

    if (!userSession.loggedIn) {
        throw unauthorized
    }

    const db = useDatabase(event);
    const password = await passwordHash(result.data.password);

    await db
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
