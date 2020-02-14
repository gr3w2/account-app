import { CustomError } from './custom.error';

export class NoEnoughCreditsError extends CustomError {
  constructor(details?: string, stack?: string) {
    super('NO_ENOUGH_CREDITS', details, stack);
  }
}
