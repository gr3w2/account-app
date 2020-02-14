import * as cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware';

export class CorsMiddleware extends Middleware {
  private corsMiddleware: (req: Request, res: Response, next: NextFunction) => void;

  constructor() {
    super();
    this.corsMiddleware = cors();
  }

  public handle(req: Request, res: Response, next: NextFunction) {
    this.corsMiddleware(req, res, next);
  }
}
