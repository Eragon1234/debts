import {z} from "zod";
import {tables, useDrizzle} from "~/db/db";
import {passwordHash} from "~/utils/password";
import {importPKCS8, SignJWT} from "jose";
import {createInsertSchema} from "drizzle-zod";

const createUserSchema = createInsertSchema(tables.users).extend({
    password: z.string().min(1).trim()
});

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, createUserSchema.safeParse);

    if (!result.success) {
        throw result.error.issues
    }

    const {username, name, password} = result.data;

    const db = useDrizzle(event.context.cloudflare.env.DB);

    const user = await db.insert(tables.users).values({
        name,
        username
    }).returning().get().catch(() => {
        throw createError({
            statusCode: 400,
            message: 'User already exists'
        })
    })

    await db.insert(tables.passwordCredentials).values({
        userId: user.id,
        password: await passwordHash(password)
    })

    const privateKey = await importPKCS8(process.env.JWT_PRIVATE_KEY as string, 'RS256');

    const token = await new SignJWT({
        loggedIn: true,
        user: {
            id: user.id,
            name: user.name,
            username: user.username
        }
    })
        .setExpirationTime('7d')
        .setProtectedHeader({alg: 'RS256'})
        .sign(privateKey);

    setCookie(event, "jwt", token, {
        maxAge: 7 * 24 * 60 * 60,
        secure: true,
    })

    return {ok: true}
})