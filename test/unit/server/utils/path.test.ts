import {describe, expect, test} from "vitest";

import {isPathUnderPrefix, isSafeRequestPath} from "../../../../server/utils/path";

describe('isSafeRequestPath', () => {
    test.each([
        '/api/users',
        '/api/users/0f8e234k',
        '/api/public/session',
        '/api/test/1/url'
    ])('accepts %s', p => expect(isSafeRequestPath(p)).toBe(true))

    test.each([
        ['empty path', ''],
        ['relative path', 'test/cat'],
        ['dot-dot traversal', '/api/public/../admin'],
        ['encoded dot-dot traversal', '/api/public/%2e%2e/admin'],
        ['encoded slash', '/api/public%2f..%2fadmin'],
        ['backslash', '/api/public\\..\\admin'],
        ['protocol-relative', '//evil.example/api'],
        ['malformed encoding', '/api/%E0%A4%A'],
        ['valid encoding', '/api/g%C3%BCnther'],
    ])('rejects %s', (_, p) => expect(isSafeRequestPath(p)).toBe(false))
})

describe('isPathUnderPrefix', () => {
    const prefix = "/api/public";

    test.each([
        "/api",
        "/api/",
        "/api/publicity",
        "/api/public-test",
        "/api/users/search",
        "/api/users/1/",
        "/api/users/public"
    ])(`considers %s not under ${prefix}`, (pathname) => {
        expect(isPathUnderPrefix(pathname, prefix)).toBe(false);
    })

    test.each([
        "/api/public",
        "/api/public/",
        "/api/public/users",
        "/api/public/oidc/callback",
    ])(`considers %s under ${prefix}`, (pathname) => {
        expect(isPathUnderPrefix(pathname, prefix)).toBe(true);
    })
})
