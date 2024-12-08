import { z } from 'zod';
import {
  CreateRecordZodSchema,
  DeleteRecordZodSchema,
  EditRecordZodSchema,
  GetDateRecordsZodSchema,
  GetFullRecordZodSchema,
  GetTimeRecordsZodSchema,
  records,
} from '../database/Schema';
import { DrizzleProvider } from '../database/dbProvider';
import { and, eq } from 'drizzle-orm';
import { BadRequestError, UnauthenticatedError } from '../errors';
import { createTitle } from '../utils/createTitle';

type CreateNewRecordProps = z.infer<typeof CreateRecordZodSchema>;
type DeleteRecordByIdProps = z.infer<typeof DeleteRecordZodSchema>;
type PatchRecordProps = z.infer<typeof EditRecordZodSchema>;
type GetRecordsByDateProps = z.infer<typeof GetDateRecordsZodSchema>;
type GetRecordsByTimeProps = z.infer<typeof GetTimeRecordsZodSchema>;
type GetRecordByIdProps = z.infer<typeof GetFullRecordZodSchema>;

export const createNewRecord = async ({ recordDate, userId, recordNote, recordTime = null }: CreateNewRecordProps) => {
  const recordTitle = createTitle(recordNote);

  const [record] = await DrizzleProvider.getInstance()
    .insert(records)
    .values({ userId, recordNote, recordTitle, recordDate, recordTime })
    .returning();
  return record;
};

export const deleteRecordById = async ({ recordId, userId }: DeleteRecordByIdProps) => {
  const [record] = await DrizzleProvider.getInstance().select().from(records).where(eq(records.recordId, recordId));

  if (!record) {
    throw new BadRequestError('There is no such record');
  }

  if (record.userId !== userId) {
    throw new UnauthenticatedError('Unauthorized');
  }

  await DrizzleProvider.getInstance().delete(records).where(eq(records.recordId, recordId));
};

export const updateRecord = async ({ recordId, userId, recordNote, recordTime = null }: PatchRecordProps) => {
  const [record] = await DrizzleProvider.getInstance().select().from(records).where(eq(records.recordId, recordId));

  if (!record) {
    throw new BadRequestError('There is no such record');
  }

  if (record.userId !== userId) {
    throw new UnauthenticatedError('Unauthorized');
  }

  const recordTitle = createTitle(recordNote);

  const [updatedRecord] = await DrizzleProvider.getInstance()
    .update(records)
    .set({ recordNote, recordTitle, recordTime })
    .where(eq(records.recordId, recordId))
    .returning();

  return updatedRecord;
};

export const getRecordsByDate = async ({ recordDate, userId }: GetRecordsByDateProps) => {
  const dateRecords = await DrizzleProvider.getInstance()
    .select()
    .from(records)
    .where(and(eq(records.userId, userId), eq(records.recordDate, recordDate)))
    .orderBy(records.recordDate, records.recordTime, records.createdAt);

  return dateRecords;
};

export const getRecordsByTime = async ({ recordDate, recordTime, userId }: GetRecordsByTimeProps) => {
  if (!recordTime) {
    throw new BadRequestError('Time is not set');
  }

  const timeRecords = await DrizzleProvider.getInstance()
    .select()
    .from(records)
    .where(and(and(eq(records.recordDate, recordDate), eq(records.recordTime, recordTime)), eq(records.userId, userId)))
    .orderBy(records.createdAt);

  return timeRecords;
};

export const getRecordById = async ({ recordId, userId }: GetRecordByIdProps) => {
  const [record] = await DrizzleProvider.getInstance().select().from(records).where(eq(records.recordId, recordId));

  if (!record) {
    throw new BadRequestError('There is no such record');
  }

  if (record.userId !== userId) {
    throw new UnauthenticatedError('Unauthorized');
  }

  return record;
};
