/**
 * Returns whether a request pathname is absolute, canonical, and unencoded,
 * making it safe for security-sensitive prefix matching.
 */
export function isSafeRequestPath(pathname: string): boolean {
    if (!pathname) {
        return false;
    }

    // Do not accept relative paths because they are ambiguous for prefix checks.
    if (!pathname.startsWith("/")) {
        return false;
    }

    // Do not accept paths that could be interpreted differently by the Nuxt router.
    const canonical = new URL(pathname, "http://localhost").pathname;
    if (pathname !== canonical) {
        return false;
    }

    try {
        // We do not use encoded characters, as they may pose a security risk.
        return decodeURIComponent(pathname) === pathname;
    } catch {
        return false;
    }
}

/**
 * Returns whether a normalized pathname is under the given prefix.
 *
 * > SECURITY: This does not handle path traversal or URL normalization.
 * > Only pass already validated pathnames.
 */
export function isPathUnderPrefix(pathname: string, prefix: string): boolean {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
}
