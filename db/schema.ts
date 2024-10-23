import {integer, sqliteTable, text, unique} from "drizzle-orm/sqlite-core";
import type {WebAuthnCredential} from "@simplewebauthn/types";
import {relations} from "drizzle-orm";

export const users = sqliteTable('users', {
    id: integer('id').primaryKey(),
    username: text('username').notNull().unique(),
    name: text('name').notNull(),
})

export const credentials = sqliteTable('credentials', {
    userId: integer('user_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    id: text('id').notNull().unique(),
    publicKey: text('public_key').notNull(),
    counter: integer('counter').notNull(),
    backedUp: integer('backed_up', {mode: 'boolean'}).notNull(),
    transports: text('transports', {mode: 'json'}).notNull().$type<WebAuthnCredential['transports']>()
}, table => ({
    pk: unique().on(table.userId, table.id)
}))

export const transfers = sqliteTable('tranfers', {
    id: integer('id').primaryKey(),
    senderId: integer('sender_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    receiverId: integer('receiver_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    amount: integer('amount').notNull(),
    description: text('description').notNull(),
    date: text('date').notNull()
})

export const usersRelations = relations(users, ({many}) => ({
    credentials: many(credentials),
    sentTransfers: many(transfers, {
        field: 'senderId'
    }),
    receivedTransfers: many(transfers, {
        field: 'receiverId'
    })
}));

export const credentialsRelations = relations(credentials, ({one}) => ({
    user: one(users, {
        fields: [credentials.userId],
        references: [users.id]
    })
}));

export const transfersRelations = relations(transfers, ({one}) => ({
    sender: one(users, {
        fields: [transfers.senderId],
        references: [users.id]
    }),
    receiver: one(users, {
        fields: [transfers.receiverId],
        references: [users.id]
    })
}));
