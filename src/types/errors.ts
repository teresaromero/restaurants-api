import status from 'http-status';

export class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class APIError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'APIError';
    this.statusCode = status.INTERNAL_SERVER_ERROR;
  }
}

export class UnauthorizedError extends APIError {
  public statusCode: number;

  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
    this.statusCode = status.UNAUTHORIZED;
  }
}

export class ForbiddenError extends APIError {
  public statusCode: number;

  constructor() {
    super('Forbidden');
    this.name = 'ForbiddenError';
    this.statusCode = status.FORBIDDEN;
  }
}

export class BadRequestError extends APIError {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = status.BAD_REQUEST;
  }
}

export class InvalidUserOrPassword extends BadRequestError {
  public statusCode: number;

  constructor() {
    super('Invalid username or password');
    this.name = 'InvalidUserOrPassword';
    this.statusCode = status.BAD_REQUEST;
  }
}

export class InvalidPayload extends BadRequestError {
  public statusCode: number;

  constructor() {
    super('Invalid payload');
    this.name = 'InvalidPayload';
    this.statusCode = status.BAD_REQUEST;
  }
}
