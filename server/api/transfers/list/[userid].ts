import {parseUserSession} from "~/utils/parseUserSession";
import {useDrizzle} from "~/db/db";
import {and, desc, eq, or} from "drizzle-orm";
import {transfers} from "~/db/schema";

const unauthorized = createError({statusCode: 401, message: "Unauthorized"})

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "userid");

    if (!id) {
        throw createError({statusCode: 400, message: "Missing user id"})
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

    return db.select()
        .from(transfers)
        .where(or(
            and(eq(transfers.receiverId, userSession.user.id), eq(transfers.senderId, id)),
            and(eq(transfers.senderId, userSession.user.id), eq(transfers.receiverId, id))
        ))
        .orderBy(desc(transfers.date))
})
