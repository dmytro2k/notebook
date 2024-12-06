import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

const EmptyZodSchema = z.object({});

interface TypedRequest<BodyType, ParamsType extends ParamsDictionary, QueryType extends ParsedQs> extends Request {
  body: BodyType;
  params: ParamsType;
  query: QueryType;
}

type ControllerFunctionProps = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export { EmptyZodSchema, TypedRequest, ControllerFunctionProps };
