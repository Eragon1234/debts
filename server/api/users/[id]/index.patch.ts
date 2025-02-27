import {createUpdateSchema} from "drizzle-zod";
import {tables, useDrizzle} from "~/db/db";
import {eq} from "drizzle-orm";

const patchUserSchema = createUpdateSchema(tables.users);

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, patchUserSchema.safeParse);

    if (!result.success) {
        throw result.error.issues
    }

    const id = getRouterParam(event, "id")!;

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
