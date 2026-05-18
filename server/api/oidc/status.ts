import {useUserSession} from "~/utils/parseUserSession";
import {oidcCredentials} from "~~/db/schema";
import {and, eq} from "drizzle-orm";

export default defineEventHandler(async event => {
    const userSession = await useUserSession(event);
    if (!userSession.loggedIn) {
        throw createError({statusCode: 401, statusMessage: 'Unauthorized'});
    }

    const runtimeConfig = useRuntimeConfig();

    const db = useDatabase(event);
    const oidc = await db
        .select()
        .from(oidcCredentials)
        .where(and(
            eq(oidcCredentials.userId, userSession.user.id),
            eq(oidcCredentials.provider, runtimeConfig.public.oidcName)
        ))

    return {connected: oidc.length > 0}
})