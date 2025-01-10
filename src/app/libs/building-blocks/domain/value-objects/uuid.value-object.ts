import { invariant } from '../invariant';
import { Serializable } from '../serializable.interface';
import { ValueObject } from '../value-object';

interface UuidProps {
  value: string;
}

export class Uuid extends ValueObject<UuidProps> implements Serializable<string> {
  private declare unique: void;

  static readonly NIL = new Uuid({ value: '00000000-0000-0000-0000-000000000000' });
  static readonly FIXED_UUID = new Uuid({ value: 'a1b2c3d4-e5f6-4c8a-9b0d-1e2f3a4b5c6d' });

  static generate() {
    return typeof crypto !== 'undefined' && crypto.randomUUID
      ? new Uuid({ value: crypto.randomUUID() })
      : Uuid.FIXED_UUID;
  }

  constructor({ value }: UuidProps) {
    invariant(
      'must be a UUID',
      typeof value === 'string' &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    );

    super({ value });
  }

  toPrimitives(): string {
    return this.props.value;
  }
}
