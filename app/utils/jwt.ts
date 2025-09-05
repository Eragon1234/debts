import type {User} from "~~/db/db";
import type {EventHandlerRequest, H3Event} from "h3";
import {importPKCS8, SignJWT} from "jose";

export async function setJWTToken(user: User, event: H3Event<EventHandlerRequest>) {
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
}