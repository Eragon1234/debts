import {importSPKI, jwtVerify} from "jose";
import {setUserSession, type UserSession} from "~/composables/session";


export default defineNuxtRouteMiddleware(async () => {
    const runtimeConfig = useRuntimeConfig();

    const token = useCookie("jwt");

    const publicKey = await importSPKI(runtimeConfig.public.jwtPublicKey as string, 'RS256')

    if (token && token.value) {
        try {
            const {payload} = await jwtVerify(token.value, publicKey);
            // token verified successfully, payload contains the token's claims
            setUserSession(payload as UserSession)
        } catch (err: any) {
            // token verification failed
            console.error('Invalid token:', err.message);
        }
    }
})