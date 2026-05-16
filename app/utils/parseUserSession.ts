import type {UserSession} from "~/composables/session";
import {importSPKI, jwtVerify} from "jose";
import type {RuntimeConfig} from "nuxt/schema";
import type {H3Event} from "h3";

export async function useUserSession(event: H3Event): Promise<UserSession> {
   const runtimeConfig = useRuntimeConfig(event);
   const token = getCookie(event, "jwt") ?? null;
   return await parseUserSession(token, runtimeConfig);
}

export async function parseUserSession(token: string | null, runtimeConfig: RuntimeConfig): Promise<UserSession> {
    if (!token) {
        return {
            loggedIn: false,
            user: null
        }
    }
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