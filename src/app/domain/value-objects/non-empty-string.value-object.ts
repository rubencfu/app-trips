import { invariant, Serializable, ValueObject } from '@building-blocks/domain';

interface NonEmptyStringProps {
  value: string;
}

export class NonEmptyString
  extends ValueObject<NonEmptyStringProps>
  implements Serializable<string>
{
  private declare unique: void;

  constructor({ value }: NonEmptyStringProps) {
    invariant('value must be a string', typeof value === 'string');
    invariant('value must not be empty', value !== '');

    super({ value });
  }

  toPrimitives(): string {
    return this.props.value;
  }
}
