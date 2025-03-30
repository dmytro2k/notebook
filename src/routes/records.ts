import express from 'express';
import { moveRecord, createRecord, deleteRecord, editRecord, getDateRecords, getRecordedDates } from '../controllers/records';
import { validateData } from '../middlewares/validation';
import {
  ChangeRecordPositionBodyZodSchema,
  CreateRecordBodyZodSchema,
  DeleteRecordBodyZodSchema,
  EditRecordBodyZodSchema,
  GetDateRecordsBodyZodSchema,
  GetRecordedDatesBodyZodSchema,
} from '../types/records';
import { RecordParamsZodSchema } from '../types/records';
import { checkRecord } from '../middlewares/validateRecords';
import { handleRequest } from '../utils/request';

const router = express.Router();

router.route('/').post(validateData(CreateRecordBodyZodSchema), handleRequest(createRecord));
router
  .route('/:recordId')
  .delete(validateData(DeleteRecordBodyZodSchema, RecordParamsZodSchema), checkRecord, handleRequest(deleteRecord))
  .patch(validateData(EditRecordBodyZodSchema, RecordParamsZodSchema), checkRecord, handleRequest(editRecord));

// GET list api/todos
// GET one api/todos/:todoId
// POST one api/todos
// PATCH one api/todos/:todoId
// DELETE one api/todos/:todoId

// TODO Write validation middleware that check if data exists in database by id, write function that takes (db table, and function that extract search data from request)
// Middleware logic: const filter = $function(); drizzle.select().from($db table).where(filter) ---- $function = (req) => req.params.todoId , req.body.....
// if data not found throw error
// save data to some field in request

// TODO Write validation that checks if modified data belongs to auth user
// get data from request
// take fn as argument (data, user) => boolean;

// router.patch('/:todoId', authMiddleware, ourMiddleware(todos (from schema), (req) => eq(todos.id, req.params.id)), handler for request);

router
  .route('/move/:recordId')
  .post(validateData(ChangeRecordPositionBodyZodSchema, RecordParamsZodSchema), checkRecord, handleRequest(moveRecord));
router.route('/date').post(validateData(GetDateRecordsBodyZodSchema), handleRequest(getDateRecords));
router.route('/dates').post(validateData(GetRecordedDatesBodyZodSchema), handleRequest(getRecordedDates));

export default router;
