import { json, Request, Response, NextFunction } from 'express'
import { Middleware } from './middleware'
import { BodyParserConfig } from '../types'

export class BodyParserMiddleware extends Middleware {
  private bodyParserMiddleware: (req: Request, res: Response, next: NextFunction) => void

  constructor(config?: BodyParserConfig) {
    super()
    this.bodyParserMiddleware = json(config)
  }

  public handle(req: Request, res: Response, next: NextFunction) {
    this.bodyParserMiddleware(req, res, next)
  }
}
