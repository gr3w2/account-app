import { Request, Response, NextFunction } from 'express'
import { Middleware } from './middleware'
import { WebError, CustomError, InternalServerError } from '../errors'

export class ErrorMiddleware extends Middleware {
  public handle(err: WebError | CustomError | Error, req: Request, res: Response, next: NextFunction) {
    let webError: WebError
    if (err instanceof WebError) {
      webError = err
    } else if (err instanceof CustomError) {
      webError = new WebError(err.message, 500, err.details, err.stack)
    } else {
      webError = new InternalServerError()
    }

    res.status(webError.status).send({
      message: webError.message,
      details: webError.details,
      stack: webError.stack,
    })
  }
}
