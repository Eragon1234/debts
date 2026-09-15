import {passwordVerify} from "~/utils/password";
import {setJWTToken} from "~/utils/jwt";
import {signInSchema} from "#shared/schemas/SignInSchema";

export default defineEventHandler(async (event) => {
    const result = await readValidatedBody(event, signInSchema.safeParse);

    if (!result.success) {
        throw result.error.issues
    }

    const {username, password} = result.data;

    const db = useDatabase(event);

    const user = await db.query.users.findFirst({
        where: {
            username: username
        },
        with: {passwordCredential: true}
    });

    if (!user) throw createError({statusCode: 400, message: 'User not found'})

    if (!user.passwordCredential) throw createError({statusCode: 400, message: 'User has no password credentials'})

    const validCredential = await passwordVerify(password, user.passwordCredential.password)
    if (!validCredential) {
        throw createError({statusCode: 400, message: 'Invalid password'})
    }

    await setJWTToken(user, event);

    return {ok: true}
})