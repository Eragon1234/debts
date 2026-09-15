import {useUserSession} from "~/utils/parseUserSession";
import {passwordHash, passwordVerify} from "~/utils/password";
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

    const currentPassword = await db.query.passwordCredentials.findFirst({
        where: {
            userId: userSession.user.id
        }
    })

    const noPassword = !currentPassword;
    if (noPassword || !await passwordVerify(result.data.oldPassword, currentPassword.password)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid password'
        })
    }

    const newPassword = await passwordHash(result.data.newPassword);

    const [newPasswordCredentials] = await db
        .update(tables.passwordCredentials)
        .set({password: newPassword})
        .where(eq(tables.passwordCredentials.userId, userSession.user.id))
        .returning();

    if (!newPasswordCredentials) {
        throw createError({
            statusCode: 400,
            message: 'Failed to change password. Please try again.'
        })
    }

    return {ok: true}
})
