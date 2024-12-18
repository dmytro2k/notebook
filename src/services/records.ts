import { z } from 'zod';
import {
  CreateRecordZodSchema,
  DeleteRecordZodSchema,
  EditRecordZodSchema,
  GetDateRecordsZodSchema,
  GetFullRecordZodSchema,
  GetRecordedDatesZodSchema,
  GetTimeRecordsZodSchema,
  records,
} from '../database/Schema';
import { DrizzleProvider } from '../database/dbProvider';
import { and, eq } from 'drizzle-orm';
import { BadRequestError, UnauthenticatedError } from '../errors';

type CreateNewRecordProps = z.infer<typeof CreateRecordZodSchema>;
type DeleteRecordByIdProps = z.infer<typeof DeleteRecordZodSchema>;
type UpdateRecordProps = z.infer<typeof EditRecordZodSchema>;
type GetRecordsByDateProps = z.infer<typeof GetDateRecordsZodSchema>;
type GetRecordsByTimeProps = z.infer<typeof GetTimeRecordsZodSchema>;
type GetRecordByIdProps = z.infer<typeof GetFullRecordZodSchema>;
type GetRecordedDatesByUserProps = z.infer<typeof GetRecordedDatesZodSchema>;

export const createNewRecord = async ({ recordDate, userId, recordNote, recordTime = null }: CreateNewRecordProps) => {
  const [record] = await DrizzleProvider.getInstance().insert(records).values({ userId, recordNote, recordDate, recordTime }).returning();
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

export const updateRecord = async ({ recordId, userId, recordNote, recordTime = null }: UpdateRecordProps) => {
  const [record] = await DrizzleProvider.getInstance().select().from(records).where(eq(records.recordId, recordId));

  if (!record) {
    throw new BadRequestError('There is no such record');
  }

  if (record.userId !== userId) {
    throw new UnauthenticatedError('Unauthorized');
  }

  const [updatedRecord] = await DrizzleProvider.getInstance()
    .update(records)
    .set({ recordNote, recordTime })
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

export const getRecordedDatesByUser = async ({ userId }: GetRecordedDatesByUserProps) => {
  const dates = await DrizzleProvider.getInstance()
    .selectDistinct({
      date: records.recordDate,
    })
    .from(records)
    .where(eq(records.userId, userId))
    .orderBy(records.recordDate);

  return dates;
};
