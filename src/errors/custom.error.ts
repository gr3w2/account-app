export class CustomError extends Error {
  public message: string;

  public readonly details: string;

  constructor(message: string, details?: string | Error, stack?: string) {
    super(message);

    if (details instanceof Error) {
      stack = details.stack;
      details = details.message;
    }

    this.details = details;
    this.stack = stack || this.stack;
  }
}
