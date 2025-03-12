import express from 'express';
import { changeTodoPosition, createTodo, deleteTodo, editTodo, getDateTodos, getFullTodo } from '../controllers/todos';
import { validateData } from '../middlewares/validation';
import {
  ChangeTodoPositionZodSchema,
  CreateTodoZodSchema,
  DeleteTodoZodSchema,
  EditTodoZodSchema,
  GetDateTodosZodSchema,
  GetFullTodoZodSchema,
} from '../types';

const router = express.Router();

router
  .route('/')
  .post(validateData(CreateTodoZodSchema), createTodo)
  .delete(validateData(DeleteTodoZodSchema), deleteTodo)
  .patch(validateData(EditTodoZodSchema), editTodo);

router.route('/move').post(validateData(ChangeTodoPositionZodSchema), changeTodoPosition);
router.route('/full').post(validateData(GetFullTodoZodSchema), getFullTodo);
router.route('/date').post(validateData(GetDateTodosZodSchema), getDateTodos);

export default router;
