import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { records } from '../index';

export const users = pgTable('users', {
  userId: uuid('user_id').defaultRandom().primaryKey(),
  userName: text('profile_name').notNull().unique(),
  userPassword: text('user_password').notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  records: many(records),
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export const userInsertZodSchema = createInsertSchema(users, {
  userName: (users) => users.min(3, 'name is too short'),
  userPassword: (users) => users.min(8, 'password is too short'),
});

export const userUpdateZodSchema = createUpdateSchema(users, {
  userName: (users) => users.min(3, 'name is too short'),
  userPassword: (users) => users.min(8, 'password is too short'),
});
