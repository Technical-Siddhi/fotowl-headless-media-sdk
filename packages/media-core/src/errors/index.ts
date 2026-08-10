export class MediaSDKError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public override readonly cause?: unknown;

  constructor(message: string, code = 'MEDIA_SDK_ERROR', statusCode?: number, cause?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthenticationError extends MediaSDKError {
  constructor(message = 'Invalid or missing API key', statusCode = 401, cause?: unknown) {
    super(message, 'AUTHENTICATION_ERROR', statusCode, cause);
  }
}

export class ValidationError extends MediaSDKError {
  constructor(message: string, cause?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, cause);
  }
}

export class RateLimitError extends MediaSDKError {
  constructor(message = 'Rate limit exceeded', statusCode = 429, cause?: unknown) {
    super(message, 'RATE_LIMIT_ERROR', statusCode, cause);
  }
}

export class NetworkError extends MediaSDKError {
  constructor(message = 'Network request failed', cause?: unknown) {
    super(message, 'NETWORK_ERROR', undefined, cause);
  }
}

export class ProviderError extends MediaSDKError {
  public readonly provider?: string;

  constructor(message: string, statusCode?: number, provider?: string, cause?: unknown) {
    super(message, 'PROVIDER_ERROR', statusCode, cause);
    this.provider = provider;
  }
}
