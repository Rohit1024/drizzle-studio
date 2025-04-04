import { sql } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	createdAt: timestamp('created_at').default(sql`now()`),
});
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const posts = pgTable('posts', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	body: text('body').notNull(),
	authorId: integer('author_id').notNull().references(() => users.id),
	createdAt: timestamp('created_at').default(sql`now()`),
	updateAt: timestamp('updated_at').default(sql`now()`),
});
export const insertPostSchema = createInsertSchema(posts);
export const selectPostSchema = createSelectSchema(posts);