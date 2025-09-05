import {z} from "zod";
import {tables, useDrizzle} from "~~/db/db";
import {like} from "drizzle-orm";

const searchUserSchema = z.object({
    query: z.string()
})

export default defineEventHandler(async (event) => {
    const result = await getValidatedQuery(event, searchUserSchema.safeParse)

    if (!result.success) {
        throw createError({statusCode: 400, message: "Invalid query"})
    }

    const {query} = result.data;

    const db = useDrizzle(event.context.cloudflare.env.DB);
    return db.query.users.findMany({
        where: like(tables.users.username, `%${query}%`),
        limit: 10,
    });
})