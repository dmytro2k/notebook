import express from 'express';
import { createRecord, deleteRecord, editRecord, getDateRecords } from '../controllers/records';
import { validateData } from '../middlewares/validation';
import { EmptyZodSchema } from '../interfaces';
import { CreateRecordZodSchema, DeleteRecordZodSchema, EditRecordZodSchema, GetDateRecordsZodSchema } from '../database/Schema';

const router = express.Router();

router
  .route('/')
  .post(validateData(CreateRecordZodSchema), createRecord)
  .delete(validateData(DeleteRecordZodSchema), deleteRecord)
  .patch(validateData(EditRecordZodSchema), editRecord);
router.route('/:recordDate').get(validateData(EmptyZodSchema, GetDateRecordsZodSchema), getDateRecords);

export default router;
