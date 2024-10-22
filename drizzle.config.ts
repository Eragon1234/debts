import type {Config} from "drizzle-kit";

export default {
    schema: "./db/schema.ts",
    dialect: "sqlite",
    out: "./drizzle",
    driver: "d1-http",
} satisfies Config