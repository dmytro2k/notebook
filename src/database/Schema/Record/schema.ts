import { date, time, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { InferSelectModel, InferInsertModel, relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { users } from '../index';
import { z } from 'zod';

export const records = pgTable('records', {
  recordId: uuid('record_id').defaultRandom().primaryKey(),
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

export const CreateRecordZodSchema = createInsertSchema(records)
  .pick({
    userId: true,
    recordDate: true,
    recordTime: true,
    recordNote: true,
  })
  .required();

export const DeleteRecordZodSchema = createInsertSchema(records)
  .pick({
    userId: true,
    recordId: true,
  })
  .required();

export const EditRecordZodSchema = createUpdateSchema(records)
  .pick({
    userId: true,
    recordId: true,
    recordTime: true,
    recordNote: true,
  })
  .required();

export const GetDateRecordsZodSchema = createInsertSchema(records)
  .pick({
    userId: true,
    recordDate: true,
  })
  .required();

export const GetTimeRecordsZodSchema = createInsertSchema(records)
  .pick({
    userId: true,
    recordDate: true,
    recordTime: true,
  })
  .required();

export const GetFullRecordZodSchema = createInsertSchema(records)
  .pick({
    userId: true,
    recordId: true,
  })
  .required();

export const GetRecordedDatesZodSchema = createInsertSchema(records).pick({ userId: true }).required();
