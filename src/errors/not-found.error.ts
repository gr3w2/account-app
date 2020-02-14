import { WebError } from './web.error';

export class NotFoundError extends WebError {
  constructor(details?: string, stack?: string) {
    super('NOT_FOUND_ERROR', 404, details, stack);
  }
}
