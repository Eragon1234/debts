import {integer, real, sqliteTable, text, unique} from "drizzle-orm/sqlite-core";
import {relations} from "drizzle-orm";

export const users = sqliteTable('users', {
    id: integer('id').primaryKey(),
    username: text('username').notNull().unique(),
    name: text('name').notNull(),
})

export const usersRelations = relations(users, ({many}) => ({
    passwordCredentials: many(passwordCredentials),
    sentTransfers: many(transfers, {
        relationName: 'sender',
    }),
    receivedTransfers: many(transfers, {
        relationName: 'receiver',
    })
}));

export const passwordCredentials = sqliteTable('password_credentials', {
    userId: integer('user_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    password: text('password').notNull()
})

export const passwordCredentialsRelations = relations(passwordCredentials, ({one}) => ({
    user: one(users, {
        fields: [passwordCredentials.userId],
        references: [users.id]
    })
}))

export const oidcCredentials = sqliteTable('oidc_credentials', {
    id: integer('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    provider: text('provider').notNull(),
    subject: text('subject').notNull()
}, (t) => ({
    unique: unique().on(t.provider, t.subject)
}))

export const oidcCredentialsRelations = relations(oidcCredentials, ({one}) => ({
    user: one(users, {
        fields: [oidcCredentials.userId],
        references: [users.id]
    })
}))

export const transfers = sqliteTable('transfers', {
    id: integer('id').primaryKey(),
    senderId: integer('sender_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    receiverId: integer('receiver_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    amount: real('amount').notNull(),
    description: text('description').notNull(),
    date: text('date').notNull()
})

export const transfersRelations = relations(transfers, ({one}) => ({
    sender: one(users, {
        fields: [transfers.senderId],
        references: [users.id],
        relationName: 'sender'
    }),
    receiver: one(users, {
        fields: [transfers.receiverId],
        references: [users.id],
        relationName: 'receiver'
    })
}));

export const counter = sqliteTable('counter', {
    from: integer('from').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    to: integer('to').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    value: integer({mode: 'number'}).notNull()
}, (t) => ({
    unique: unique().on(t.from, t.to)
}))
