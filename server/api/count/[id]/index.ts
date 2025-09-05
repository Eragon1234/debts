import {parseUserSession} from "~/utils/parseUserSession";
import {useDrizzle} from "~~/db/db";
import {counter} from "~~/db/schema";
import {and, eq} from "drizzle-orm";

const unauthorized = createError({statusCode: 401, message: "Unauthorized"})

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id");

    if (!id) {
        throw createError({statusCode: 400, message: "Missing id"})
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
    const result = (await db.select().from(counter).where(and(
        eq(counter.from, userSession.user.id),
        eq(counter.to, parseInt(id))
    )))[0]

    const resultTwo = (await db.select().from(counter).where(and(
        eq(counter.from, parseInt(id)),
        eq(counter.to, userSession.user.id)
    )))[0]

    const value = (result?.value || 0) - (resultTwo?.value || 0)

    return {count: value};
})
