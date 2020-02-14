import { Request, Response, NextFunction } from 'express';

export abstract class Middleware {
  public abstract handle(
    err: Error | Request,
    req: Request | Response,
    res: Response | NextFunction,
    next?: NextFunction,
  ): void;
}
