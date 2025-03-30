import { records } from '../database/Schema';
import { RecordUpdates } from '../types/records';
import { DrizzleProvider } from '../database/dbProvider';
import { and, eq, gt, gte, lt, lte, SQL, sql } from 'drizzle-orm';

type CreateNewRecordProps = {
  userId: string;
  recordDate: string;
  recordNote: string;
  recordPosition?: number;
};

type DeleteRecordByIdProps = {
  userId: string;
  recordId: string;
  recordDate: string;
  recordPosition: number;
};

type UpdateRecordProps = {
  recordId: string;
  recordNote: string;
};

type ChangeRecordPositionProps = {
  userId: string;
  recordId: string;
  recordDate: string;
  oldRecordPosition: number;
  newRecordPosition: number;
};

type GetRecordsFromDbProps = {
  userId: string;
  recordDate: string;
};

type GetRecordFromDbProps = {
  recordId: string;
};

type GetRecordedDatesFromDbProps = {
  userId: string;
};

type CountRecordsProps = GetRecordsFromDbProps;

type ShiftRecordsPositionInDbProps = {
  filter: SQL | undefined;
  shift: number;
};

type InsertNewRecordInDbProps = {
  userId: string;
  recordDate: string;
  recordNote: string;
  recordPosition: number;
};

type UpdateRecordInDbProps = {
  recordId: string;
  recordUpdates: RecordUpdates;
};

type DeleteRecordFromDbProps = {
  recordId: string;
};

export const createNewRecord = async ({ userId, recordDate, recordNote, recordPosition }: CreateNewRecordProps) => {
  const recordsLength = await countRecords({ userId, recordDate });

  if ((!recordPosition && recordPosition != 0) || recordPosition > recordsLength) {
    recordPosition = recordsLength;
  }

  await shiftRecordsPositionInDb({
    filter: and(and(eq(records.userId, userId), eq(records.recordDate, recordDate)), gte(records.recordPosition, recordPosition)),
    shift: 1,
  });

  return insertNewRecordInDb({ userId, recordDate, recordNote, recordPosition });
};

export const deleteRecordById = async ({ userId, recordId, recordDate, recordPosition }: DeleteRecordByIdProps) => {
  await deleteRecordFromDb({ recordId });
  await shiftRecordsPositionInDb({
    filter: and(and(eq(records.userId, userId), eq(records.recordDate, recordDate)), gt(records.recordPosition, recordPosition)),
    shift: -1,
  });
};

export const updateRecord = async ({ recordId, recordNote }: UpdateRecordProps) => {
  return updateRecordInDb({ recordId, recordUpdates: { recordNote } });
};

export const changeRecordPosition = async ({
  userId,
  recordId,
  recordDate,
  oldRecordPosition,
  newRecordPosition,
}: ChangeRecordPositionProps) => {
  if (oldRecordPosition < newRecordPosition) {
    await shiftRecordsPositionInDb({
      filter: and(
        and(eq(records.userId, userId), eq(records.recordDate, recordDate)),
        and(gte(records.recordPosition, newRecordPosition), lt(records.recordPosition, oldRecordPosition))
      ),
      shift: 1,
    });
  } else {
    await shiftRecordsPositionInDb({
      filter: and(
        and(eq(records.userId, userId), eq(records.recordDate, recordDate)),
        and(gt(records.recordPosition, oldRecordPosition), lte(records.recordPosition, newRecordPosition))
      ),
      shift: -1,
    });
  }

  return updateRecordInDb({ recordId, recordUpdates: { recordPosition: newRecordPosition } });
};

export const getRecordsFromDb = async ({ userId, recordDate }: GetRecordsFromDbProps) => {
  const dateRecords = await DrizzleProvider.getInstance()
    .select()
    .from(records)
    .where(and(eq(records.userId, userId), eq(records.recordDate, recordDate)))
    .orderBy(records.recordPosition);

  return dateRecords;
};

export const getRecordFromDb = async ({ recordId }: GetRecordFromDbProps) => {
  const [record] = await DrizzleProvider.getInstance().select().from(records).where(eq(records.recordId, recordId));

  return record;
};

export const getRecordedDatesFromDb = async ({ userId }: GetRecordedDatesFromDbProps) => {
  const dates = await DrizzleProvider.getInstance()
    .selectDistinct({
      date: records.recordDate,
    })
    .from(records)
    .where(eq(records.userId, userId))
    .orderBy(records.recordDate);

  return dates;
};

export const countRecords = async ({ userId, recordDate }: CountRecordsProps) => {
  const [recordsLength] = await DrizzleProvider.getInstance()
    .select({ count: sql<number>`COUNT(*)` })
    .from(records)
    .where(and(eq(records.userId, userId), eq(records.recordDate, recordDate)));
  return recordsLength.count;
};

export const shiftRecordsPositionInDb = async ({ filter, shift }: ShiftRecordsPositionInDbProps) => {
  return DrizzleProvider.getInstance()
    .update(records)
    .set({ recordPosition: sql`${records.recordPosition} + ${shift}` })
    .where(filter);
};

export const insertNewRecordInDb = async ({ userId, recordDate, recordNote, recordPosition }: InsertNewRecordInDbProps) => {
  const [record] = await DrizzleProvider.getInstance()
    .insert(records)
    .values({ userId, recordNote, recordDate, recordPosition })
    .returning();
  return record;
};

export const updateRecordInDb = async ({ recordId, recordUpdates }: UpdateRecordInDbProps) => {
  const [updatedRecord] = await DrizzleProvider.getInstance()
    .update(records)
    .set(recordUpdates)
    .where(eq(records.recordId, recordId))
    .returning();

  return updatedRecord;
};

export const deleteRecordFromDb = async ({ recordId }: DeleteRecordFromDbProps) => {
  return DrizzleProvider.getInstance().delete(records).where(eq(records.recordId, recordId));
};
