export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'HttpError';
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export function badRequest(message: string, details?: unknown): HttpError {
  return new HttpError(400, message, 'BAD_REQUEST', details);
}

export function unauthorized(message = 'Unauthorized'): HttpError {
  return new HttpError(401, message, 'UNAUTHORIZED');
}

export function notFound(message = 'Not found'): HttpError {
  return new HttpError(404, message, 'NOT_FOUND');
}

export function conflict(message: string, details?: unknown): HttpError {
  return new HttpError(409, message, 'CONFLICT', details);
}
