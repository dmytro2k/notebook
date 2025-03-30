import { Request, Response, NextFunction } from 'express';
import { ControllerFunctionProps } from '../types';

export const handleRequest = (controllerFunction: ControllerFunctionProps) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controllerFunction(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
