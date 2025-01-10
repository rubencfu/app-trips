import { Nullish } from '@shared-kernel/types';

export function assertUnreachable(nothing: never): never {
  throw new Error(`Didn't expect to get here, but it did: ${JSON.stringify(nothing)}`);
}

export function assert(
  condition: unknown,
  error?: Nullish<string | Error | (() => Error)>
): asserts condition {
  if (!condition) {
    throw error instanceof Error
      ? error
      : typeof error === 'function'
      ? error()
      : new Error(`Assertion: ${typeof error === 'string' ? error : 'it should not happen.'}`);
  }
}
