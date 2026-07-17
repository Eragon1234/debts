import {z} from "zod";

const searchUserSchema = z.object({
    query: z.string()
})

export default defineEventHandler(async (event) => {
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