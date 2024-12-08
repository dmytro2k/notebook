import { CustomError } from '../errors';

export const safeAwait = async <T, E = Error>(promise: Promise<T>): Promise<[null, T] | [E, null]> => {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    if (error instanceof CustomError) {
      return [error as E, null];
    }

    throw error;
  }
};
