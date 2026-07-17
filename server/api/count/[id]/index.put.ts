import {useUserSession} from "~/utils/parseUserSession";
import {counter} from "~~/db/schema";
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

    const userSession = await useUserSession(event);

    if (!userSession.loggedIn) {
        throw unauthorized
    }

    const db = useDatabase(event);

    const reverseValue = await db.query.counter.findFirst({
        where: {
            from: parseInt(id),
            to: userSession.user.id
        }
    })

    const newCount = body.count + (reverseValue?.value ?? 0)

    const changed = await db
        .update(counter)
        .set({
            value: newCount
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
            value: newCount
        })
    }

    return {ok: true}
})
