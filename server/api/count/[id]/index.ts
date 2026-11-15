import {getUserSession} from "#server/utils/parseUserSession.ts";

const unauthorized = createError({statusCode: 401, message: "Unauthorized"})

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id");

    if (!id) {
        throw createError({statusCode: 400, message: "Missing id"})
    }

    const userSession = await getUserSession(event);

    if (!userSession.loggedIn) {
        throw unauthorized
    }

    const db = useDatabase(event);
    const result = await db.query.counter.findFirst({
        where: {
            from: userSession.user.id,
            to: parseInt(id)
        }
    })

    const resultTwo = await db.query.counter.findFirst({
        where: {
            from: parseInt(id),
            to: userSession.user.id
        }
    })

    const value = (result?.value || 0) - (resultTwo?.value || 0)

    return {count: value};
})
