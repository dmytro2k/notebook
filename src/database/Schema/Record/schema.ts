import { date, integer, pgTable, text, unique, uuid } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { users } from '../index';

export const records = pgTable(
  'records',
  {
    recordId: uuid('record_id').defaultRandom().primaryKey(),
    recordNote: text('record_note').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.userId, { onDelete: 'cascade', onUpdate: 'cascade' }),
    recordDate: date('record_date').notNull(),
    recordPosition: integer('record_position').notNull(),
  },
  (table) => [unique().on(table.userId, table.recordDate, table.recordPosition)]
);

export const recordsRelations = relations(records, ({ one }) => ({
  author: one(users, {
    fields: [records.userId],
    references: [users.userId],
  }),
}));

export type Record = InferSelectModel<typeof records>;
export type NewRecord = InferInsertModel<typeof records>;

export const recordInsertZodSchema = createInsertSchema(records, {
  recordNote: (records) => records.max(1024, 'this note is too long'),
});
export const recordUpdateZodSchema = createUpdateSchema(records, {
  recordNote: (records) => records.max(1024, 'this note is too long'),
});
