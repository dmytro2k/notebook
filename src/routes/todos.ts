import express from 'express';
import { moveTodo, createTodo, deleteTodo, editTodo, getDateTodos } from '../controllers/todos';
import { validateData } from '../middlewares/validation';
import {
  ChangeTodoPositionBodyZodSchema,
  CreateTodoBodyZodSchema,
  DeleteTodoBodyZodSchema,
  EditTodoBodyZodSchema,
  GetDateTodosBodyZodSchema,
} from '../types/todos';
import { handleRequest } from '../utils/request';
import { checkTodo } from '../middlewares/validateTodos';

const router = express.Router();

router.route('/').post(validateData(CreateTodoBodyZodSchema), handleRequest(createTodo));
router
  .route('/:todoId')
  .delete(validateData(DeleteTodoBodyZodSchema), checkTodo, handleRequest(deleteTodo))
  .patch(validateData(EditTodoBodyZodSchema), checkTodo, handleRequest(editTodo));

router.route('/move/:todoId').post(validateData(ChangeTodoPositionBodyZodSchema), checkTodo, handleRequest(moveTodo));
router.route('/date').post(validateData(GetDateTodosBodyZodSchema), handleRequest(getDateTodos));

export default router;
