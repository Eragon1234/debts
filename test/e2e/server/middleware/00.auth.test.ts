import {describe, expect, it} from "vitest";
import {fetch, setup, url} from "@nuxt/test-utils/e2e";
import {request} from "node:http";

describe("middleware/00.auth", async () => {
    await setup()

    it('should protect private route', async () => {
        const res = await fetch('/api/users/search');

        expect(res.status).toBe(401);
    });

    it('should protect uppercase private routes', async () => {
        const res = await fetch('/API/users/search');

        expect(res.status).toBe(401);
    });

    it("should allow public route", async () => {
        const res = await fetch('/api/public/oidc/login');

        expect(res.status).not.toBe(401);
    })

    it("should protect private routes before route matching", async () => {
        const res = await fetch('/api/does/not/exist');

        expect(res.status).toBe(401);
    })

    it('should protect private routes with query string', async () => {
        const res = await fetch('/api/users/search?query=foo');

        expect(res.status).toBe(401);
    });

    it('should allow public routes with query string', async () => {
        const res = await fetch('/api/public/oidc/login?query=foo');

        expect(res.status).not.toBe(401);
    });

    it("should disallow routes containing path traversal", async () => {
        const fullUrl = new URL(url("/"));
        const res = request({
            hostname: fullUrl.hostname,
            port: fullUrl.port,
            path: "/api/public/../private-something"
        });
        const statusCode: number | undefined = await new Promise((resolve, reject) => {
            res.on("response", res => {
                resolve(res.statusCode);
            });
            res.on("error", reject);
            res.end();
        });

        expect(statusCode).toBe(400);
    })

    it('should disallow routes containing encoded characters', async () => {
        const res = await fetch('/api/public/oidc/login%20');

        expect(res.status).toBe(400);
    });

    it('should allow routes containing encoded query strings', async () => {
        const res = await fetch('/api/public/oidc/login?query=foo%20');
        expect(res.status).not.toBe(400);
    });

    it('should not protect non api routes', async () => {
        const res = await fetch('/');
        expect(res.status).toBe(200);
    })
})
