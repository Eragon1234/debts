import {z} from "zod";
import {useUserSession} from "~/utils/parseUserSession.ts";

const unauthorized = createError({statusCode: 401, message: "Unauthorized"})

const searchUserSchema = z.object({
    query: z.string()
})

export default defineEventHandler(async (event) => {
    const userSession = await useUserSession(event);

    if (!userSession.loggedIn) {
        throw unauthorized
    }

    const result = await getValidatedQuery(event, searchUserSchema.safeParse)

    if (!result.success) {
        throw createError({statusCode: 400, message: "Invalid query"})
    }

    const {query} = result.data;

    const db = useDatabase(event);
    return db.query.users.findMany({
        where: {
            username: {
                like: `%${query}%`
            }
        },
        limit: 10,
    });
})