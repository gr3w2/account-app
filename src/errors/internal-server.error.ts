import { WebError } from './web.error';

export class InternalServerError extends WebError {
  constructor(details?: string, stack?: string) {
    super('INTERNAL_SERVER_ERROR', 500, details, stack);
  }
}
