import { date, boolean, pgTable, text, uuid, integer, unique } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { users } from '../index';

export const todos = pgTable('todos', {
  todoId: uuid('todo_id').defaultRandom().primaryKey(),
  todoNote: text('todo_note').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade', onUpdate: 'cascade' }),
  todoDate: date('todo_date').notNull(),
  todoIsDone: boolean('todo_is_done').notNull().default(false),
  todoPosition: integer('todo_position').notNull(),
});

export const todosRelations = relations(todos, ({ one }) => ({
  author: one(users, {
    fields: [todos.userId],
    references: [users.userId],
  }),
}));

export type Todo = InferSelectModel<typeof todos>;
export type NewTodo = InferInsertModel<typeof todos>;

export const todoInsertZodSchema = createInsertSchema(todos, {
  todoNote: (todos) => todos.max(1024, 'this note is too long'),
});
export const todoUpdateZodSchema = createUpdateSchema(todos, {
  todoNote: (todos) => todos.max(1024, 'this note is too long'),
});
