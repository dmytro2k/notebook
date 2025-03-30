import { z } from 'zod';
import { recordInsertZodSchema, recordUpdateZodSchema } from '../database/Schema';

export const CreateRecordBodyZodSchema = recordInsertZodSchema.omit({ userId: true, recordId: true }).partial({ recordPosition: true });
export const DeleteRecordBodyZodSchema = recordInsertZodSchema.pick({});
export const EditRecordBodyZodSchema = recordUpdateZodSchema.pick({ recordNote: true }).required();
export const GetDateRecordsBodyZodSchema = recordInsertZodSchema.pick({ recordDate: true });
export const GetRecordedDatesBodyZodSchema = recordInsertZodSchema.pick({});
export const ChangeRecordPositionBodyZodSchema = recordUpdateZodSchema.pick({ recordPosition: true }).required();
export const RecordUpdatesBodyZodSchema = recordUpdateZodSchema.pick({ recordNote: true, recordPosition: true });
export const RecordParamsZodSchema = recordInsertZodSchema.pick({ recordId: true });

export type CreateRecordBody = z.infer<typeof CreateRecordBodyZodSchema>;
export type DeleteRecordBody = z.infer<typeof DeleteRecordBodyZodSchema>;
export type EditRecordBody = z.infer<typeof EditRecordBodyZodSchema>;
export type GetDateRecordsBody = z.infer<typeof GetDateRecordsBodyZodSchema>;
export type GetRecordedDatesBody = z.infer<typeof GetRecordedDatesBodyZodSchema>;
export type ChangeRecordPositionBody = z.infer<typeof ChangeRecordPositionBodyZodSchema>;
export type RecordUpdates = z.infer<typeof RecordUpdatesBodyZodSchema>;
export type RecordParams = z.infer<typeof RecordParamsZodSchema>;
