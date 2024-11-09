import {parseUserSession} from "~/utils/parseUserSession";

const unauthorized = createError({statusCode: 401, message: "Unauthorized"})

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
        throw createError({statusCode: 400, message: "Missing id"})
    }

    if (!body.count) {
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

    const kv = event.context.cloudflare.env.KV;

    kv.put(`${userSession.user.id}->${id}`, body.count);

    return {ok: true}
})
