import {getOIDCProvider} from "#shared/oidc/provider";
import {setJWTToken} from "~/utils/jwt";
import {useUserSession} from "~/utils/parseUserSession";
import {tables, useDrizzle} from "~~/db/db";
import {z} from "zod";
import type {H3Event} from "h3";
import type {NitroRuntimeConfig} from "nitropack/types"
import {LoggedInUserSession} from "~/composables/session";

const tokenResponseSchema = z.object({
    access_token: z.string(),
    expires_in: z.number(),
    refresh_token: z.string().optional(),
    scope: z.string().optional(),
    token_type: z.string().optional(),
});

async function exchangeCodeForToken(code: string) {
    const runtimeConfig = useRuntimeConfig();

    const oidcProvider = await getOIDCProvider();
    if (!oidcProvider) {
        throw createError({statusCode: 500, message: "OIDC Provider not configured"})
    }

    const body = new URLSearchParams();
    body.append("grant_type", "authorization_code");
    body.append("code", code);
    body.append("redirect_uri", `${runtimeConfig.public.baseURL}/api/oidc/callback`);
    body.append("client_id", runtimeConfig.public.oidcClientID as string);
    body.append("client_secret", runtimeConfig.oidcClientSecret as string);

    const tokenResponse = await fetch(oidcProvider.token_endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body.toString()
    });
    if (!tokenResponse.ok) {
        throw createError({statusCode: 500, message: "Failed to fetch token"})
    }
    const tokenResponseJson = await tokenResponse.json();
    const parsedTokenResponse = tokenResponseSchema.safeParse(tokenResponseJson);
    if (!parsedTokenResponse.success) {
        throw createError({statusCode: 500, message: "Failed to parse token response"})
    }
    return parsedTokenResponse.data;
}

const userInfoSchema = z.object({
    sub: z.string(),
    name: z.string(),
    preferred_username: z.string(),
});

type UserInfo = z.infer<typeof userInfoSchema>

async function fetchUserInfo(accessToken: string) {
    const runtimeConfig = useRuntimeConfig();
    const oidcProvider = await getOIDCProvider();
    if (!oidcProvider) {
        throw createError({statusCode: 500, message: "OIDC Provider not configured"})
    }

    const userInfoRequestUrl = new URL(oidcProvider.userinfo_endpoint);
    const userInfoResponse = await fetch(userInfoRequestUrl, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
    const userInfoResponseJson = await userInfoResponse.json();
    const parsedUserInfoResponse = userInfoSchema.safeParse(userInfoResponseJson);
    if (!parsedUserInfoResponse.success) {
        throw createError({statusCode: 500, message: "Failed to parse user info response"})
    }
    return parsedUserInfoResponse.data;
}

const callbackQuerySchema = z.object({
    code: z.string(),
    state: z.string(),
})

export default defineEventHandler(async (event) => {
    const runtimeConfig = useRuntimeConfig(event);
    const parsedQuery = await getValidatedQuery(event, callbackQuerySchema.safeParse);

    if (!parsedQuery.success) {
        throw parsedQuery.error.issues
    }
    const {code, state} = parsedQuery.data;

    const stateCookie = getCookie(event, "oidcState");
    deleteCookie(event, "oidcState")
    if (!stateCookie || state !== stateCookie) {
        throw createError({statusCode: 403, message: "Invalid state"})
    }

    const oidcToken = await exchangeCodeForToken(code as string);
    const accessToken = oidcToken.access_token;

    const userInfo = await fetchUserInfo(accessToken);

    const db = useDatabase(event);

    const userSession = await useUserSession(event);

    if (userSession.loggedIn) {
        await linkOIDC(runtimeConfig, userSession, userInfo, db);
    } else {
        const oidcCredential = await db.query.oidcCredentials.findFirst({
            where: {
                subject: userInfo.sub,
                provider: runtimeConfig.public.oidcName
            }
        })

        if (oidcCredential) {
            const user = await db.query.users.findFirst({
                where: {
                    id: oidcCredential.userId
                }
            });

            await setJWTToken(user!, event);
        } else {
            await matchOrCreateUser(event, userInfo, db);
        }
    }

    await sendRedirect(event, "/");
    return {ok: true}
});

async function linkOIDC(runtimeConfig: NitroRuntimeConfig, userSession: LoggedInUserSession, userInfo: UserInfo, db: ReturnType<typeof useDrizzle>) {
    const existingCredential = await db.query.oidcCredentials.findFirst({
        where: {
            userId: userSession.user.id,
            provider: runtimeConfig.public.oidcName
        }
    })

    if (!existingCredential) {
        await db
            .insert(tables.oidcCredentials)
            .values({
                userId: userSession.user.id, provider: runtimeConfig.public.oidcName, subject: userInfo.sub,
            })
    } else if (existingCredential.userId !== userSession.user.id) {
        throw createError("OIDC credential is already linked to another user")
    } else {
        console.log("Skipped linking OIDC credential - already linked to user")
        return;
    }
}

async function matchOrCreateUser(event: H3Event, userInfo: UserInfo, db: ReturnType<typeof useDrizzle>) {
    const runtimeConfig = useRuntimeConfig(event);
    const existingUser = await db.query.users.findFirst({
        where: {
            username: userInfo.preferred_username
        }
    })
    if (existingUser && runtimeConfig.public.oidcAutomatchUsername) {
        await db.insert(tables.oidcCredentials).values({
            userId: existingUser.id, provider: runtimeConfig.public.oidcName, subject: userInfo.sub,
        })
        await setJWTToken(existingUser, event);
        return;
    }

    if (existingUser) {
        // Incomplete implementation since it prevents users with duplicate usernames from registering using oidc
        throw new Error("Username has already been taken")
    }

    const newUser = await db.insert(tables.users).values({
        name: userInfo.name, username: userInfo.preferred_username
    }).returning().get()

    await db.insert(tables.oidcCredentials).values({
        userId: newUser.id, provider: runtimeConfig.public.oidcName, subject: userInfo.sub,
    })

    await setJWTToken(newUser, event);
}
