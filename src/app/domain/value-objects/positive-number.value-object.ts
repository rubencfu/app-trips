import { invariant, Serializable, ValueObject } from '@building-blocks/domain';

interface PositiveNumberProps {
  value: number;
}

export class PositiveNumber
  extends ValueObject<PositiveNumberProps>
  implements Serializable<number>
{
  declare private unique: void;

  constructor({ value }: PositiveNumberProps) {
    invariant(`value must be a safe integer: ${value}`, Number.isSafeInteger(value));
    invariant('value must be positive or 0', value >= 0);

    super({ value });
  }

  toPrimitives(): number {
    return this.props.value;
  }
}
