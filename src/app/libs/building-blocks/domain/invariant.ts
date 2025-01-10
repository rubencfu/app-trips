import { Exception, InvariantViolationException } from './exceptions';

export function invariant(
  message: string,
  condition: unknown,
  exception?: Exception
): asserts condition {
  if (!condition) {
    if (exception) {
      throw exception;
    } else {
      throw new InvariantViolationException(message);
    }
  }
}
