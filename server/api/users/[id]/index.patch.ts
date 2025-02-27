import {createUpdateSchema} from "drizzle-zod";
import {tables, useDrizzle} from "~/db/db";
import {eq} from "drizzle-orm";
import {parseUserSession} from "~/utils/parseUserSession";

const patchUserSchema = createUpdateSchema(tables.users);
const unauthorized = createError({statusCode: 401, message: "Unauthorized"})

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, patchUserSchema.safeParse);

    if (!result.success) {
        throw result.error.issues
    }

    const id = getRouterParam(event, "id")!;

    const token = getCookie(event, "jwt");

    if (!token) {
        throw unauthorized
    }

    const userSession = await parseUserSession(token, useRuntimeConfig(event));

    if (!userSession.loggedIn) {
        throw unauthorized
    }

    if (userSession.user.id !== parseInt(id)) {
        throw createError({statusCode: 403, message: "You are not allowed to update this user."})
    }

    const db = useDrizzle(event.context.cloudflare.env.DB);

    db
        .update(tables.users)
        .set(result.data)
        .where(eq(tables.users.id, parseInt(id)))
        .catch(() => {
            throw createError({
                statusCode: 400,
                message: 'User not found'
            })
        });

    return {ok: true}
})
