import express from 'express';
import { createTodo, deleteTodo, editTodo, getDateTodos, getFullTodo } from '../controllers/todos';
import { validateData } from '../middlewares/validation';
import {
  CreateTodoZodSchema,
  DeleteTodoZodSchema,
  EditTodoZodSchema,
  GetDateTodosZodSchema,
  GetFullTodoZodSchema,
} from '../database/Schema';

const router = express.Router();

router
  .route('/')
  .post(validateData(CreateTodoZodSchema), createTodo)
  .delete(validateData(DeleteTodoZodSchema), deleteTodo)
  .patch(validateData(EditTodoZodSchema), editTodo);

router.route('/full').post(validateData(GetFullTodoZodSchema), getFullTodo);
router.route('/dated').post(validateData(GetDateTodosZodSchema), getDateTodos);

export default router;
