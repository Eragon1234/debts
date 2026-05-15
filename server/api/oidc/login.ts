import {buildAuthorizationURL, getOIDCProvider} from "#shared/oidc/provider";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const oidcProvider = await getOIDCProvider();

    if (!oidcProvider) {
        throw createError({statusCode: 500, message: 'missing oidc provider config'})
    }

    const authorizationURL = buildAuthorizationURL(
        oidcProvider!,
        config.public.oidcClientID as string,
        `${config.public.baseURL}/api/oidc/callback`
    );

    const state = crypto.randomUUID()
    setCookie(event, "oidcState", state, {
        maxAge: 60 * 60,
        httpOnly: true,
        secure: !import.meta.dev,
        sameSite: 'lax',
        path: '/api/oidc'
    })
    authorizationURL.searchParams.set("state", state)

    await sendRedirect(event, authorizationURL.toString())
})
