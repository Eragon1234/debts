import type {UserSession} from "~/composables/session";
import {importSPKI, jwtVerify} from "jose";
import type {RuntimeConfig} from "nuxt/schema";

export async function parseUserSession(token: string, runtimeConfig: RuntimeConfig): Promise<UserSession> {
    const publicKey = await importSPKI(runtimeConfig.public.jwtPublicKey as string, 'RS256')

    try {
        const {payload} = await jwtVerify(token, publicKey);
        return payload as UserSession;
    } catch (err: any) {
        // token verification failed
        console.error('Invalid token:', err.message);
        return {
            loggedIn: false,
            user: null
        }
    }
}