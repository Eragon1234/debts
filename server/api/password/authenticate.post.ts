import {z} from "zod";
import {tables, useDrizzle} from "~/db/db";
import {eq} from "drizzle-orm";
import {passwordVerify} from "~/utils/password";
import {importPKCS8, SignJWT} from "jose";

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, z.object({
        username: z.string().min(1).trim(),
        password: z.string().min(1).trim(),
    }).safeParse);

    if (!result.success) {
        throw result.error.issues
    }

    const {username, password} = result.data;

    const db = useDrizzle(event.context.cloudflare.env.DB);

    const user = await db.query.users.findFirst({
        where: eq(tables.users.username, username),
        with: {passwordCredentials: true}
    });

    if (!user) throw createError({statusCode: 400, message: 'User not found'})

    if (!user.passwordCredentials) throw createError({statusCode: 400, message: 'User has no password credentials'})

    let foundValidCredential = false
    for (const credential of user.passwordCredentials) {
        if (await passwordVerify(password, credential.password)) {
            foundValidCredential = true
            break
        }
    }
    if (!foundValidCredential) {
        throw createError({statusCode: 400, message: 'Invalid password'})
    }

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