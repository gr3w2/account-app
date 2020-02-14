import { WebError } from './web.error';

export class BadRequestError extends WebError {
  constructor(details?: string, stack?: string) {
    super('BAD_REQUEST_ERROR', 400, details, stack);
  }
}
