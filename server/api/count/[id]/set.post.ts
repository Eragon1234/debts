import {parseUserSession} from "~/utils/parseUserSession";
import {useDrizzle} from "~/db/db";
import {counter} from "~/db/schema";
import {and, eq} from "drizzle-orm";

const unauthorized = createError({statusCode: 401, message: "Unauthorized"})

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
        throw createError({statusCode: 400, message: "Missing id"})
    }

    if (body.count === null || body.count === undefined) {
        throw createError({statusCode: 400, message: "Missing count"})
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
    const changed = await db
        .update(counter)
        .set({
            value: body.count
        })
        .where(and(
            eq(counter.from, userSession.user.id),
            eq(counter.to, parseInt(id))
        ))
        .returning()

    if (changed.length === 0) {
        await db.insert(counter).values({
            from: userSession.user.id,
            to: parseInt(id),
            value: body.count
        })
    }

    return {ok: true}
})
