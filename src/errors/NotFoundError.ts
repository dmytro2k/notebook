import CustomError from './CustomError';
import { StatusCodes } from 'http-status-codes';

export default class NotFoundError extends CustomError {
  statusCode = StatusCodes.NOT_FOUND;

  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
  }
}
