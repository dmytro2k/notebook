import { recordInsertZodSchema, records } from '../database/Schema';
import {
  CreateRecordBody as CreateNewRecordProps,
  DeleteRecordBody as DeleteRecordByIdProps,
  EditRecordBody as UpdateRecordProps,
  GetDateRecordsBody as GetRecordsByDateProps,
  GetFullRecordBody as GetRecordByIdProps,
  GetRecordedDatesBody as GetRecordedDatesByUserProps,
  ChangeRecordPositionBody as ChangeRecordPositionByIdProps,
} from '../types';
import { DrizzleProvider } from '../database/dbProvider';
import { and, eq, gt, gte, lt, lte, sql } from 'drizzle-orm';
import { BadRequestError, UnauthenticatedError } from '../errors';
import { z } from 'zod';

const GetRecordsLengthPropsZodSchema = recordInsertZodSchema.pick({ userId: true, recordDate: true });
type GetRecordsLengthProps = z.infer<typeof GetRecordsLengthPropsZodSchema>;

export const createNewRecord = async ({ recordDate, userId, recordNote }: CreateNewRecordProps) => {
  const recordsLength = await getRecordsLength({ userId, recordDate });
  const recordPosition = recordsLength + 1;

  const [record] = await DrizzleProvider.getInstance()
    .insert(records)
    .values({ userId, recordNote, recordDate, recordPosition })
    .returning();
  return record;
};

export const deleteRecordById = async ({ recordId, userId }: DeleteRecordByIdProps) => {
  if (!recordId) {
    throw new BadRequestError('There is no record with such id');
  }

  const [record] = await DrizzleProvider.getInstance().select().from(records).where(eq(records.recordId, recordId));

  if (!record) {
    throw new BadRequestError('There is no such record');
  }

  if (record.userId !== userId) {
    throw new UnauthenticatedError('Unauthorized');
  }

  await DrizzleProvider.getInstance().delete(records).where(eq(records.recordId, recordId));
  await DrizzleProvider.getInstance()
    .update(records)
    .set({ recordPosition: sql<number>`recordPosition - 1` })
    .where(
      and(and(eq(records.userId, userId), eq(records.recordDate, record.recordDate)), gt(records.recordPosition, records.recordPosition))
    );
};

export const updateRecord = async ({ recordId, userId, recordNote }: UpdateRecordProps) => {
  const [record] = await DrizzleProvider.getInstance().select().from(records).where(eq(records.recordId, recordId));

  if (!record) {
    throw new BadRequestError('There is no such record');
  }

  if (record.userId !== userId) {
    throw new UnauthenticatedError('Unauthorized');
  }

  const [updatedRecord] = await DrizzleProvider.getInstance()
    .update(records)
    .set({ recordNote })
    .where(eq(records.recordId, recordId))
    .returning();

  return updatedRecord;
};

export const changeRecordPositionById = async ({ userId, recordId, recordPosition: newRecordPosition }: ChangeRecordPositionByIdProps) => {
  const [record] = await DrizzleProvider.getInstance().select().from(records).where(eq(records.recordId, recordId));

  if (!record) {
    throw new BadRequestError('There is no such record');
  }

  if (record.userId !== userId) {
    throw new UnauthenticatedError('Unauthorized');
  }

  const oldRecordPosition = record.recordPosition;

  await DrizzleProvider.getInstance()
    .update(records)
    .set({ recordPosition: sql<number>`-1` })
    .where(eq(records.recordId, recordId));

  if (oldRecordPosition < newRecordPosition) {
    await DrizzleProvider.getInstance()
      .update(records)
      .set({ recordPosition: sql<number>`recordPosition + 1` })
      .where(
        and(
          and(eq(records.userId, userId), eq(records.recordDate, record.recordDate)),
          and(gte(records.recordPosition, newRecordPosition), lt(records.recordPosition, oldRecordPosition))
        )
      );
  } else {
    await DrizzleProvider.getInstance()
      .update(records)
      .set({ recordPosition: sql<number>`recordPosition - 1` })
      .where(
        and(
          and(eq(records.userId, userId), eq(records.recordDate, record.recordDate)),
          and(gt(records.recordPosition, oldRecordPosition), lte(records.recordPosition, newRecordPosition))
        )
      );
  }

  const [updatedRecord] = await DrizzleProvider.getInstance()
    .update(records)
    .set({ recordPosition: newRecordPosition })
    .where(eq(records.recordId, recordId))
    .returning();

  return updatedRecord;
};

export const getRecordsByDate = async ({ recordDate, userId }: GetRecordsByDateProps) => {
  const dateRecords = await DrizzleProvider.getInstance()
    .select()
    .from(records)
    .where(and(eq(records.userId, userId), eq(records.recordDate, recordDate)))
    .orderBy(records.recordDate);

  return dateRecords;
};

export const getRecordById = async ({ recordId, userId }: GetRecordByIdProps) => {
  if (!recordId) {
    throw new BadRequestError('There is no record with such id');
  }

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

const getRecordsLength = async ({ userId, recordDate }: GetRecordsLengthProps) => {
  const [todoLength] = await DrizzleProvider.getInstance()
    .select({ count: sql<number>`COUNT(*)` })
    .from(records)
    .where(and(eq(records.userId, userId), eq(records.recordDate, recordDate)));
  return todoLength.count;
};
