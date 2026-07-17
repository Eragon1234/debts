import {integer, real, sqliteTable, text, unique} from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
    id: integer('id').primaryKey(),
    username: text('username').notNull().unique(),
    name: text('name').notNull(),
})

export const passwordCredentials = sqliteTable('password_credentials', {
    userId: integer('user_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    password: text('password').notNull()
})

export const oidcCredentials = sqliteTable('oidc_credentials', {
    id: integer('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    provider: text('provider').notNull(),
    subject: text('subject').notNull()
}, (t) => [
    unique().on(t.provider, t.subject)
])

export const transfers = sqliteTable('transfers', {
    id: integer('id').primaryKey(),
    senderId: integer('sender_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    receiverId: integer('receiver_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    amount: real('amount').notNull(),
    description: text('description').notNull(),
    date: text('date').notNull()
})

export const counter = sqliteTable('counter', {
    from: integer('from').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    to: integer('to').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    value: integer({mode: 'number'}).notNull()
}, (t) => [
    unique().on(t.from, t.to)
])
