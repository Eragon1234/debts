import {createUpdateSchema} from "drizzle-orm/zod";
import {tables} from "~~/db/db";

export const patchUserSchema = createUpdateSchema(tables.users);