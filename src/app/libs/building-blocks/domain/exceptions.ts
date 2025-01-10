export class Exception extends Error {}

export class InvariantViolationException extends Exception {
  constructor(message: string) {
    super(`Domain Exception: ${message}`);
  }
}
