import {parseUserSession} from "~/utils/parseUserSession";
import {tables, useDrizzle} from "~~/db/db";
import {createTransferSchema} from "#shared/schemas/CreateTransferSchema";

const unauthorized = createError({statusCode: 401, message: "Unauthorized"})

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, createTransferSchema.safeParse);

    if (!result.success) {
        throw result.error.issues
    }

    const data = result.data;

    const token = getCookie(event, "jwt");

    if (!token) {
        throw unauthorized
    }

    const userSession = await parseUserSession(token, useRuntimeConfig(event));

    if (!userSession.loggedIn) {
        throw unauthorized
    }

    const db = useDrizzle(event.context.cloudflare.env.DB);

    for (let i = 0; i < data.receivers.length; i++) {
        if (userSession.user.id !== data.sender && userSession.user.id !== data.receivers[i].id) {
            throw createError({statusCode: 403, message: "You are not allowed to create a transfer for this user."})
        }

        await db.insert(tables.transfers).values({
            senderId: data.sender,
            receiverId: data.receivers[i].id,
            amount: data.amount,
            description: data.description,
            date: data.date,
        });
    }
})
