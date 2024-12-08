import { date, time, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from '../index';

export const records = pgTable('records', {
  recordId: uuid('record_id').defaultRandom().primaryKey(),
  recordTitle: text('record_title').notNull(),
  recordNote: text('record_note').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade', onUpdate: 'cascade' }),
  recordDate: date().notNull(),
  recordTime: time({ precision: 4 }),
  createdAt: timestamp('created_at', { precision: 0, withTimezone: false }).notNull().defaultNow(),
});

export const recordsRelations = relations(records, ({ one }) => ({
  author: one(users, {
    fields: [records.userId],
    references: [users.userId],
  }),
}));

export type Record = InferSelectModel<typeof records>;
export type NewRecord = InferInsertModel<typeof records>;

export const CreateRecordZodSchema = createInsertSchema(records).pick({
  userId: true,
  recordDate: true,
  recordTime: true,
  recordNote: true,
});

export const DeleteRecordZodSchema = createInsertSchema(records)
  .pick({
    userId: true,
    recordId: true,
  })
  .required();

export const EditRecordZodSchema = createInsertSchema(records)
  .pick({
    userId: true,
    recordId: true,
    recordTime: true,
    recordNote: true,
  })
  .required();

export const GetDateRecordsZodSchema = createSelectSchema(records).pick({
  userId: true,
  recordDate: true,
});

export const GetTimeRecordsZodSchema = createSelectSchema(records)
  .pick({
    userId: true,
    recordDate: true,
    recordTime: true,
  })
  .required();

export const GetFullRecordZodSchema = createSelectSchema(records).pick({
  userId: true,
  recordId: true,
});
