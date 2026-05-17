import {useUserSession} from "~/utils/parseUserSession";
import {useDrizzle} from "~~/db/db";
import {useRuntimeConfig} from "nuxt/app";
import {oidcCredentials} from "~~/db/schema";
import {and, eq} from "drizzle-orm";

export default defineEventHandler(async event => {
    const userSession = await useUserSession(event);
    if (!userSession.loggedIn) {
        throw createError({statusCode: 401, statusMessage: 'Unauthorized'});
    }

    const runtimeConfig = useRuntimeConfig(event);

    const db = useDrizzle(event.context.cloudflare.env.DB);
    const oidc = await db
        .select()
        .from(oidcCredentials)
        .where(and(
            eq(oidcCredentials.userId, userSession.user.id),
            eq(oidcCredentials.provider, runtimeConfig.public.oidcName)
        ))

    return {connected: oidc.length > 0}
})