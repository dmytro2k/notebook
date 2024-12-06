import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { records } from '../index';

export const users = pgTable('users', {
  userId: uuid('user_id').defaultRandom().primaryKey(),
  userName: text('profile_name').notNull(),
  userPassword: text('user_password').notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  records: many(records),
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export const CreateUserZodSchema = createInsertSchema(users).pick({
  userName: true,
  userPassword: true,
});

export const DeleteUserZodSchema = createInsertSchema(users)
  .pick({
    userId: true,
  })
  .required();

export const GetUserZodSchema = createSelectSchema(users).pick({
  userId: true,
});

export const AuthZodSchema = CreateUserZodSchema;