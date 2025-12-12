import {type OIDCProvider, oidcProviderSchema} from "#shared/oidc/schema";

/**
 * Retrieves an OpenID Connect (OIDC) provider's configuration using the provided discovery URL.
 *
 * @param {string} discoveryURL - The URL to the OIDC discovery endpoint.
 * @return {Promise<OIDCProvider | null>} A promise that resolves to the OIDCProvider object
 * if the discovery URL provides a valid configuration, or null if the request fails or the
 * configuration is invalid.
 */
export async function getOIDCProviderWithDiscoveryUrl(discoveryURL: string): Promise<OIDCProvider | null> {
    const response = await fetch(discoveryURL);
    if (!response.ok) {
        console.error('Failed to fetch provider configuration:', response);
        return null;
    }

    const provider = await response.json();
    const result = oidcProviderSchema.safeParse(provider);
    if (!result.success) {
        console.error('Invalid provider:', result.error);
        return null;
    }
    return result.data;
}

export function buildAuthorizationURL(provider: OIDCProvider, clientId: string, redirectUri: string): URL{
    const url = new URL(provider.authorization_endpoint);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', clientId);
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('scope', 'openid profile email');
    return url;
}