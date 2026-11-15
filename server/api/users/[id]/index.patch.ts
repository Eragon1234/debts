import {tables} from "~~/db/db";
import {eq} from "drizzle-orm";
import {getUserSession} from "#server/utils/parseUserSession.ts";
import {setJWTToken} from "#server/utils/jwt.ts";
import {patchUserSchema} from "#shared/schemas/PatchUserSchema";

const unauthorized = createError({statusCode: 401, message: "Unauthorized"})

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, patchUserSchema.safeParse);

    if (!result.success) {
        throw result.error.issues
    }

    const id = getRouterParam(event, "id")!;

    const userSession = await getUserSession(event);

    if (!userSession.loggedIn) {
        throw unauthorized
    }

    if (userSession.user.id !== parseInt(id)) {
        throw createError({statusCode: 403, message: "You are not allowed to update this user."})
    }

    const db = useDatabase(event);

    const updatedUser = await db
        .update(tables.users)
        .set(result.data)
        .where(eq(tables.users.id, parseInt(id)))
        .returning()
        .then(updated => updated[0])
        .catch(() => {
            throw createError({
                statusCode: 400,
                message: 'User not found'
            })
        });

    await setJWTToken(updatedUser, event);

    return {ok: true}
})
