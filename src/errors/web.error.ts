import { CustomError } from './custom.error'

export class WebError extends CustomError {
  public readonly status: number

  constructor(message: string, status: number, details?: string | Error, stack?: string) {
    super(message, details, stack)

    this.status = status
  }
}
