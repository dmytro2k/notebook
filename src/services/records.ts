type CreateNewRecordProps = {
  recordDate: Date;
  recordTime: string;
  userId: string;
  recordText: string;
  recordNote?: string;
};

type DropRecordProps = {
  recordId: string;
  userId: string;
};

type PatchRecordProps = {
  recordId: string;
  recordTime: string;
  recordText: string;
  recordNote?: string;
  userId: string;
};

type GetAllRecordsProps = {
  recordDate: Date;
  userId: string;
};

type GetRecordByIdProps = {
  recordId: string;
};

export const createNewRecord = async ({ recordDate, recordTime, userId, recordText, recordNote = '' }: CreateNewRecordProps) => {};

export const dropRecord = async ({ recordId, userId }: DropRecordProps) => {};

export const patchRecord = async ({ recordId, recordTime, recordText, userId, recordNote = '' }: PatchRecordProps) => {};

export const getAllRecords = async ({ recordDate, userId }: GetAllRecordsProps) => {};
