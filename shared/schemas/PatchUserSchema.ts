import {createUpdateSchema} from "drizzle-zod";
import {tables} from "~~/db/db";

export const patchUserSchema = createUpdateSchema(tables.users);