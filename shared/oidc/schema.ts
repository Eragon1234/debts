import {z} from "zod";

export const oidcProviderSchema = z.object({
    authorization_endpoint: z.url(),
    authorization_response_iss_parameter_supported: z.boolean(),
    claims_supported: z.array(z.string()),
    code_challenge_methods_supported: z.array(z.string()),
    device_authorization_endpoint: z.url(),
    end_session_endpoint: z.url(),
    grant_types_supported: z.array(z.string()),
    id_token_signing_alg_values_supported: z.array(z.string()),
    introspection_endpoint: z.url(),
    issuer: z.url(),
    jwks_uri: z.url(),
    response_types_supported: z.array(z.string()),
    scopes_supported: z.array(z.string()),
    subject_types_supported: z.array(z.string()),
    token_endpoint: z.url(),
    userinfo_endpoint: z.url(),
})

export type OIDCProvider = z.infer<typeof oidcProviderSchema>